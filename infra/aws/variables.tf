variable "domain_name" {
  description = "Web app domain name"
  type        = string
  default     = "remnd.co"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

# TODO(giuseppe): this should be done differently in the future
variable "ec2_public_ip" {
  type    = string
  default = "52.58.224.194"
}
