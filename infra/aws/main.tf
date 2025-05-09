provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "us_east"
  region = "us-east-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.2.0"

  backend "s3" {
    bucket = "remind-terraform-state"
    key    = "terraform.tfstate"
    region = var.region
  }
}
