terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    bucket       = "logi-quiz-tfstate-438656921478"
    key          = "envs/production/terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-northeast-1"

  default_tags {
    tags = {
      Project     = "logi-quiz"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# CloudFront証明書用（us-east-1必須）
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "logi-quiz"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}
