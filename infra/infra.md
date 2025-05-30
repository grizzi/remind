┌────────────────────────────┐
│   Namecheap (manual step)  │
└────────────┬───────────────┘
             ↓
┌────────────────────────────┐
│   aws_route53_zone.primary │◄──────────────┐
└────────────┬───────────────┘               │
             ↓                               │
┌────────────────────────────────────────┐   │
│aws_acm_certificate.cert (us-east-1)    │   │
│ - Needs DNS validation                 │   │
└────────────┬───────────────────────────┘   │
             ↓                               │
┌──────────────────────────────────────────────┐
│aws_route53_record.cert_validation            │
│ - Validates the certificate via DNS          │
└────────────┬─────────────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│aws_acm_certificate_validation.cert     │
│ - Waits for cert to be verified        │
└────────────┬───────────────────────────┘
             ↓
┌──────────────────────────────────────────────────────────┐
│aws_cloudfront_distribution.webapp                        │
│ - Uses:                                                  │
│    - ACM cert from us-east-1                             │
│    - S3 static website endpoint                          │
└────────────┬─────────────────────────────────────────────┘
             ↓
┌──────────────────────────────────────────────┐
│aws_route53_record.cloudfront_alias           │
│ - Points to domain to CloudFront dist        │
└──────────────────────────────────────────────┘


## Dependencies

# AWS CLI

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws
```
# OpenTofu

Instruction for other distributions availabe at the
[official page](https://opentofu.org/docs/intro/install/standalone/)

```bash
curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh
chmod +x install-opentofu.sh
./install-opentofu.sh --install-method standalone
rm -f install-opentofu.sh
```


## Init Tofu

```bash
tofu init
```

## Setup the backend

## Create certificate for backend server

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot -d api.remnd.co
```

Test autorenewal

```bash
sudo certbot renew --dry-run
```
