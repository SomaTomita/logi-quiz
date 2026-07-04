"""
README用のシンプルなインフラ構成図（新: Terraform / マルチリージョン）。
既存の旧構成図（frontend/app/public/docs/diagrams_infra.png）と同じ抽象度で作成する。
"""
from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import ECS, ECR
from diagrams.aws.network import ALB, Route53, CloudFront
from diagrams.aws.database import RDSMysqlInstance
from diagrams.aws.storage import S3
from diagrams.aws.security import ACM
from diagrams.aws.engagement import SES
from diagrams.onprem.client import Users
from diagrams.onprem.vcs import Github
from diagrams.onprem.iac import Terraform

graph_attr = {
    "fontsize": "20",
    "bgcolor": "white",
    "pad": "0.5",
    "splines": "spline",
    "nodesep": "0.8",
    "ranksep": "1.1",
    "dpi": "150",
}

node_attr = {
    "fontsize": "12",
}

edge_attr = {
    "fontsize": "11",
}

with Diagram(
    "logi-quiz New Infrastructure (Terraform, multi-region)",
    filename="/Users/soma/Documents/GitHub/logi-quiz/frontend/app/public/docs/diagrams_infra_terraform",
    show=False,
    direction="TB",
    graph_attr=graph_attr,
    node_attr=node_attr,
    edge_attr=edge_attr,
    outformat="png",
):
    user = Users("User")
    dev = Github("Developer\n(GitHub Actions)")

    with Cluster("AWS (Terraform管理)"):
        r53 = Route53("Route 53")
        ecr = ECR("ECR\n(logi-quiz-api)")
        ses = SES("SES\n(logi-quiz.com)")

        with Cluster("ap-northeast-1 — Tokyo (production)"):
            cf_prod = CloudFront("CloudFront")
            s3_prod = S3("S3\n(frontend)")
            acm_prod = ACM("ACM")
            alb_prod = ALB("ALB")
            ecs_prod = ECS("ECS Fargate\n(Rails)")
            rds_prod = RDSMysqlInstance("RDS MySQL")

            cf_prod >> s3_prod
            acm_prod >> Edge(style="dotted") >> alb_prod
            alb_prod >> ecs_prod >> rds_prod
            ecs_prod >> Edge(style="dashed", label="SMTP") >> ses

        with Cluster("ap-southeast-1 — Singapore (staging, on-demand)"):
            cf_stg = CloudFront("CloudFront")
            s3_stg = S3("S3\n(frontend)")
            alb_stg = ALB("ALB")
            ecs_stg = ECS("ECS Fargate\nSpot (Rails)")
            rds_stg = RDSMysqlInstance("RDS MySQL")

            cf_stg >> s3_stg
            alb_stg >> ecs_stg >> rds_stg

        ecs_stg >> Edge(color="gray", style="dashed", label="cross-region") >> ecr
        ecs_stg >> Edge(color="gray", style="dashed", label="cross-region") >> ses
        ecr >> Edge(color="gray") >> ecs_prod

        r53 >> Edge(label="logi-quiz.com") >> cf_prod
        r53 >> Edge(label="api.logi-quiz.com") >> alb_prod
        r53 >> Edge(style="dashed", label="staging.*") >> cf_stg
        r53 >> Edge(style="dashed", label="staging-api.*") >> alb_stg

    user >> Edge() >> r53
    dev >> Edge(label="push image") >> ecr
    dev >> Edge(label="deploy") >> ecs_prod

    tf = Terraform("Terraform\n(IaC)")
    tf >> Edge(style="dotted", label="apply") >> r53

print("done")
