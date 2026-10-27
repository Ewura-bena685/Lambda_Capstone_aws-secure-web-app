# Lambda Capstone Project: AWS Secure Web Application

A secure, scalable, and automated cloud infrastructure deployment on AWS built using Infrastructure as Code (IaC) principles.

## Overview

This project provisions and deploys an enterprise-grade secure web application architecture on Amazon Web Services (AWS). Designed as part of the Lambda Capstone project, the infrastructure emphasizes high availability, zero-trust security controls, automated monitoring, and continuous integration/continuous deployment (CI/CD) pipelines.

## System Architecture

The architecture follows AWS best practices for cloud security and resilience, featuring:

* **Identity & Access Management (IAM):** Granular, least-privilege IAM roles and policies.
* **Network Security:** Amazon Virtual Private Cloud (VPC) with segregated public and private subnets across multiple Availability Zones, custom Security Groups, and Network Access Control Lists (NACLs).
* **Compute & Serverless:** Containerized or serverless microservices powered by AWS Lambda and Amazon EC2/ECS.
* **Application Security & Delivery:** Amazon CloudFront CDN with AWS Web Application Firewall (WAF) integration for protection against common web exploits and DDoS attacks.
* **Storage & Artifact Management:** Secure Amazon S3 buckets with default server-side encryption (SSE-S3/KMS), bucket policies, and versioning.
* **Observability & Auditability:** Centralized logging and threat monitoring via Amazon CloudWatch, AWS CloudTrail, and Amazon GuardDuty.

## Repository Structure

```text
├── .github/              # CI/CD pipeline workflows
├── docs/                 # Architecture diagrams and documentation
├── infrastructure/       # IaC templates (CloudFormation / Terraform)
├── src/                  # Application source code and Lambda functions
├── tests/                # Unit and integration test suites
├── .gitignore            # Git ignore specification
├── LICENSE               # License information
└── README.md             # Project documentation
```
