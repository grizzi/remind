#checkov:skip=CKV2_AWS_62: We do not need to ensure S3 buckets have event notifications enabled
#checkov:skip=CKV_AWS_144: We do not need to ensure that S3 buckets have cross-region replication enabled
#checkov:skip=CKV_AWS_18: We do not need to enable access logging for this bucket
#checkov:skip=CKV_AWS_20: This bucket is intentionally public for static hosting
#checkov:skip=CKV2_AWS_6: This bucket intentionally allows public access

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
  #checkov:skip=CKV_AWS_53: The bucket is a public static content host
  #checkov:skip=CKV_AWS_54: The bucket is a public static content host
  #checkov:skip=CKV_AWS_55: The bucket is a public static content host
  #checkov:skip=CKV_AWS_56: The bucket is a public static content host
  #checkov:skip=CKV2_AWS_6: The bucket is a public static content host

  bucket = aws_s3_bucket.webapp.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_versioning" "webapp" {
  bucket = aws_s3_bucket.webapp.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  rule {
    id     = "expire-old"
    status = "Enabled"

    expiration {
      days = 365
    }
  }

  rule {
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
    filter {}
    id     = "log"
    status = "Enabled"
  }
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
  #checkov:skip=CKV2_AWS_65: This bucket uses ACLs intentionally for static hosting
  bucket = aws_s3_bucket.webapp.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "webapp" {
  bucket = aws_s3_bucket.webapp.id
  acl    = "public-read"

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
          "${aws_s3_bucket.webapp.arn}/*"
        ]
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.webapp
  ]
}
