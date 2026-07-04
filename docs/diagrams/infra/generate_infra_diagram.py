"""
logi-quiz インフラ構成図（docs/plans/2026-07-04-terraform-aws-multi-env-infrastructure.md 完了後）
production=ap-northeast-1（東京）/ staging=ap-southeast-1（シンガポール）のマルチリージョン構成。
mingrammer/diagrams で生成。
"""
from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import ECS, ECR
from diagrams.aws.network import (
    ALB, Route53, CloudFront, VPC, InternetGateway, PublicSubnet,
)
from diagrams.aws.database import RDSMysqlInstance
from diagrams.aws.storage import S3
from diagrams.aws.security import ACM, SecretsManager, IAM, IAMRole
from diagrams.aws.management import Cloudwatch, CloudwatchLogs
from diagrams.aws.engagement import SES
from diagrams.onprem.client import Users
from diagrams.onprem.vcs import Github
from diagrams.onprem.ci import GithubActions
from diagrams.onprem.iac import Terraform

graph_attr = {
    "fontsize": "26",
    "bgcolor": "white",
    "pad": "0.8",
    "splines": "ortho",
    "nodesep": "1.1",
    "ranksep": "1.6",
    "compound": "true",
    "concentrate": "false",
    "dpi": "150",
}

node_attr = {
    "fontsize": "11",
}

edge_attr = {
    "fontsize": "10",
}

with Diagram(
    "logi-quiz Infrastructure (Terraform / AWS, post-cutover, multi-region)",
    filename="/Users/soma/Documents/GitHub/logi-quiz/docs/diagrams/infra/2026-07-04-terraform-infra",
    show=False,
    direction="TB",
    graph_attr=graph_attr,
    node_attr=node_attr,
    edge_attr=edge_attr,
    outformat="png",
):

    users = Users("End Users\n(Browser)")

    # ---------------- GitHub / CI-CD ----------------
    with Cluster("GitHub (SomaTomita/logi-quiz)"):
        repo = Github("Repo\nmain branch")
        with Cluster("GitHub Actions Workflows"):
            tf_ci = GithubActions("terraform-ci.yml\nfmt / validate / tflint")
            be_ci = GithubActions("backend-ci.yml\nrspec / rubocop\nbrakeman / bundler-audit")
            fe_ci = GithubActions("frontend-ci.yml\nvitest / tsc / build")
            be_deploy = GithubActions("backend-deploy.yml\nimage push→migrate→service update")
            fe_deploy = GithubActions("frontend-deploy.yml\nbuild→s3 sync→invalidate")

        repo >> Edge(style="dashed", label="PR") >> tf_ci
        repo >> Edge(style="dashed", label="PR") >> be_ci
        repo >> Edge(style="dashed", label="PR") >> fe_ci
        repo >> Edge(color="firebrick", label="push main") >> be_deploy
        repo >> Edge(color="firebrick", label="push main") >> fe_deploy

    # ---------------- Terraform local operator ----------------
    with Cluster("Local Operator"):
        tf = Terraform("terraform apply\n(bootstrap/global/envs)")

    with Cluster("AWS Account 438656921478 (Terraform管理・マルチリージョン)"):

        # ---------------- Terraform state (bucket lives in Tokyo, region-agnostic) ----------------
        with Cluster("terraform/bootstrap (ap-northeast-1)"):
            tf_state = S3("S3: logi-quiz-tfstate-<acct>\nversioning + SSE + native lock")

        # ---------------- Route 53 (global service, not region-scoped) ----------------
        r53 = Route53("Route 53\nlogi-quiz.com zone")

        # ==================== Tokyo region: global + production ====================
        with Cluster("ap-northeast-1 — 東京 (global stack + envs/production)"):

            # ---------------- Global stack ----------------
            with Cluster("terraform/global (env横断・共用、東京固定)"):
                ecr = ECR("ECR\nlogi-quiz-api\nSHA tag + latest\nscan_on_push")
                oidc = IAMRole("IAM OIDC Role\nlogi-quiz-github-deploy\n(GitHub OIDC, 長期キーなし\n両リージョンのECSを許可)")
                with Cluster("Amazon SES"):
                    ses_domain = SES("Email Identity\nlogi-quiz.com\nDKIM(3) + DMARC(p=none)")
                    ses_user = IAM("IAM User\nlogi-quiz-ses-smtp\n(SendEmail/SendRawEmail only)")
                    ses_user >> Edge(style="dotted", label="SMTP creds") >> ses_domain

            # ---------------- Frontend (production) ----------------
            with Cluster("Frontend — production (modules/frontend)"):
                acm_fe_prod = ACM("ACM (us-east-1)\nlogi-quiz.com")
                cf_prod = CloudFront(
                    "CloudFront\nOAC + SPA fallback(403/404→index.html)\n"
                    "Security Headers Policy\n(CSP/HSTS/X-Frame/X-Content-Type)"
                )
                s3_fe_prod = S3("S3 (private)\nlogi-quiz-frontend-production-<acct>")
                cf_prod >> Edge(label="OAC") >> s3_fe_prod
                acm_fe_prod >> Edge(style="dotted") >> cf_prod

            # ---------------- Backend (production) ----------------
            with Cluster("Backend — production (envs/production)"):
                with Cluster("modules/network: VPC 10.0.0.0/16"):
                    igw_prod = InternetGateway("IGW")
                    with Cluster("Public Subnets x2 AZ (1a/1c)"):
                        subnet_prod = PublicSubnet("subnet-1a / subnet-1c\n(NAT/private無し：コスト最適化)")

                with Cluster("modules/alb_api"):
                    acm_api_prod = ACM("ACM\napi.logi-quiz.com")
                    alb_prod = ALB(
                        "ALB\n:443→TG(:3000)\n:80→301 redirect\nSG: 80/443 from internet"
                    )

                with Cluster("modules/ecs_service"):
                    ecs_cluster_prod = ECS(
                        "ECS Fargate Cluster\nlogi-quiz-production\n0.5vCPU/1GB, desired=1\n(nginx廃止: ALB→Puma直結)"
                    )
                    logs_prod = CloudwatchLogs("/ecs/logi-quiz-production\nretention 30d")

                with Cluster("modules/rds"):
                    rds_prod = RDSMysqlInstance(
                        "RDS MySQL 8.0\ndb.t4g.micro\nSingle-AZ, gp3 20GB\nbackup 7d, deletion protected"
                    )

                with Cluster("modules/app_secrets + rds password"):
                    sm_prod = SecretsManager(
                        "Secrets Manager\n"
                        "- DATABASE_PASSWORD\n"
                        "- SECRET_KEY_BASE\n"
                        "- EMAIL_PASSWORD"
                    )

                igw_prod >> subnet_prod
                subnet_prod >> alb_prod
                acm_api_prod >> Edge(style="dotted") >> alb_prod
                alb_prod >> Edge(label="HTTP:3000\nSG: app←alb only") >> ecs_cluster_prod
                ecs_cluster_prod >> Edge(label="3306\nSG: rds←app only") >> rds_prod
                ecs_cluster_prod >> Edge(style="dashed") >> logs_prod
                sm_prod >> Edge(style="dotted", label="GetSecretValue\n(execution role)") >> ecs_cluster_prod
                ecs_cluster_prod >> Edge(label="SMTP :587", color="darkorange") >> ses_domain

            # ---------------- Monitoring ----------------
            cw = Cloudwatch("CloudWatch\nLogs / Alarms")
            logs_prod >> Edge(style="dotted") >> cw

        # ==================== Singapore region: staging (on-demand) ====================
        with Cluster("ap-southeast-1 — シンガポール (envs/staging, ON-DEMAND: apply/destroy)"):
            alb_stg = ALB("ALB\napi-staging\n(destroy時 $0)")
            ecs_stg = ECS("ECS Fargate SPOT\nlogi-quiz-staging\n0.25vCPU/0.5GB\nAZ: 1a/1b")
            rds_stg = RDSMysqlInstance("RDS MySQL 8.0\ndb.t4g.micro\nno backup, skip_final_snapshot")
            cf_stg = CloudFront("CloudFront\nstaging.logi-quiz.com")
            s3_fe_stg = S3("S3 (private)\nfrontend-staging")

            alb_stg >> ecs_stg >> rds_stg
            cf_stg >> s3_fe_stg

        # ---------------- Cross-region access: staging shares Tokyo's ECR + SES ----------------
        ecs_stg >> Edge(color="purple", style="bold", label="cross-region pull") >> ecr
        ecs_stg >> Edge(color="darkorange", style="dashed", label="SMTP :587\n(東京へ越境)") >> ses_domain

    # ---------------- Wiring across clusters ----------------
    users >> Edge(label="https://logi-quiz.com") >> r53
    users >> Edge(label="https://api.logi-quiz.com") >> r53
    r53 >> Edge(label="ALIAS A") >> cf_prod
    r53 >> Edge(label="ALIAS A") >> alb_prod
    r53 >> Edge(style="dashed", label="(on-demand)") >> cf_stg
    r53 >> Edge(style="dashed", label="(on-demand)") >> alb_stg

    tf >> Edge(color="blue", label="state") >> tf_state
    tf >> Edge(color="blue", style="bold") >> ecr
    tf >> Edge(color="blue", style="bold") >> r53
    tf >> Edge(color="blue", style="bold") >> rds_prod
    tf >> Edge(color="blue", style="bold") >> ecs_cluster_prod

    oidc >> Edge(color="firebrick", label="AssumeRoleWithWebIdentity") >> be_deploy
    oidc >> Edge(color="firebrick") >> fe_deploy

    be_deploy >> Edge(color="firebrick", label="docker push") >> ecr
    ecr >> Edge(color="firebrick", label="pull image") >> ecs_cluster_prod
    be_deploy >> Edge(color="firebrick", label="run-task db:migrate\n+ update-service") >> ecs_cluster_prod

    fe_deploy >> Edge(color="firebrick", label="s3 sync + invalidate") >> s3_fe_prod
    fe_deploy >> Edge(color="firebrick", style="dashed") >> cf_prod

print("done")
