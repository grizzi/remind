resource "aws_acm_certificate" "cert" {
  provider          = aws.us_east # You must request or import an SSL/TLS certificate in the US East (N. Virginia) region (us-east-1) to use it with CloudFront
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# The certificate provider (ACM) asks us to validate the ownership of that domain
# by creating a new DNS entry with the options listed below
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = aws_route53_zone.primary.zone_id
  name    = each.value.name
  records = [each.value.record]
  ttl     = 60
  type    = each.value.type
}

# This makes terraform wait that the certificate has been validated
resource "aws_acm_certificate_validation" "cert" {
  provider        = aws.us_east
  certificate_arn = aws_acm_certificate.cert.arn
  validation_record_fqdns = [
    for record in aws_route53_record.cert_validation : record.fqdn
  ]
}
