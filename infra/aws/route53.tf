resource "aws_route53_zone" "primary" {
  name = var.domain_name
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"

  # Tell aws that when we go to www.domain we shall actually go the
  # cloudfront url
  alias {
    name                   = aws_cloudfront_distribution.webapp.domain_name
    zone_id                = aws_cloudfront_distribution.webapp.hosted_zone_id
    evaluate_target_health = false
  }
}

# This is the record to be used for secure connections (HTTPS) with the
# webapp
# EC2 addresses can change on every restart, so we need to use a dynamic
resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [var.ec2_public_ip]
}
