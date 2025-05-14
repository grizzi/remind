# Add domain to Amazon SES (Simple Email Service) for email sending
resource "aws_ses_domain_identity" "domain" {
  domain = var.domain_name
}

# TXT record for SES domain verification (_amazonses.example.com)
resource "aws_route53_record" "ses_verification" {
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  zone_id = aws_route53_zone.primary.zone_id

  records = [aws_ses_domain_identity.domain.verification_token]
}

# Wait until AWS confirms the domain is verified
resource "aws_ses_domain_identity_verification" "verification" {
  domain     = aws_ses_domain_identity.domain.id
  depends_on = [aws_route53_record.ses_verification]
}

# Enable DKIM signing for better deliverability. This is used to
# sign emails (sending server sign with private key, recipient server
# verify with public key retrieved from DNS)
resource "aws_ses_domain_dkim" "dkim" {
  domain = aws_ses_domain_identity.domain.domain
}

# CNAME records for DKIM verification (3 records)
resource "aws_route53_record" "dkim_records" {
  count   = 3 # SES always returns exactly 3 DKIM tokens
  name    = "${aws_ses_domain_dkim.dkim.dkim_tokens[count.index]}._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 600
  zone_id = aws_route53_zone.primary.zone_id

  records = ["${aws_ses_domain_dkim.dkim.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

# SPF record to allow Amazon SES to send mail from this domain
# This is a TXT record that specifies which mail servers are allowed to send email on behalf
# of the domain
resource "aws_route53_record" "spf" {
  name    = var.domain_name
  type    = "TXT"
  ttl     = 600
  zone_id = aws_route53_zone.primary.zone_id

  records = ["v=spf1 include:amazonses.com ~all"]
}

# Add a DMARC record to define mail policy and reporting
resource "aws_route53_record" "dmarc" {
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  zone_id = aws_route53_zone.primary.zone_id

  records = [
    "v=DMARC1; p=none;"
  ]
}
