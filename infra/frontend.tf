terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-central-1"
}


resource "aws_s3_bucket" "webapp" {
  bucket = "remind-webapp-static"
}

resource "aws_s3_bucket_public_access_block" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "webapp" {
  bucket = aws_s3_bucket.webapp.id
  rule {
  object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  acl = "public-read"
  depends_on = [
  aws_s3_bucket_ownership_controls.webapp,
  aws_s3_bucket_public_access_block.webapp
  ]
}

resource "aws_s3_bucket_policy" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  policy = jsonencode({
  Version = "2012-10-17"
  Statement = [
    {
    Sid       = "PublicReadGetObject"
    Effect    = "Allow"
    Principal = "*"
    Action    = "s3:GetObject"
    Resource = [
      aws_s3_bucket.webapp.arn,
      "${aws_s3_bucket.webapp.arn}/*",
    ]
    },
  ]
  })

  depends_on = [
  aws_s3_bucket_public_access_block.webapp
  ]
}
