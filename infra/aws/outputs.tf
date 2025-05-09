output "nameservers" {
  description = "Use these NS records in Namecheap"
  value       = aws_route53_zone.primary.name_servers
}

output "cloudfront_url" {
  description = "This gives you a default preview URL for cloudfront"
  value       = aws_cloudfront_distribution.webapp.domain_name
}

output "certificate_arn" {
  value = aws_acm_certificate.cert.arn
}
