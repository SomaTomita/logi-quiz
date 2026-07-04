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
    key          = "envs/staging/terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-southeast-1"

  default_tags {
    tags = {
      Project     = "logi-quiz"
      Environment = "staging"
      ManagedBy   = "terraform"
    }
  }
}

# CloudFront証明書用（us-east-1必須。stagingのリージョンに関わらず変更不要）
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "logi-quiz"
      Environment = "staging"
      ManagedBy   = "terraform"
    }
  }
}
