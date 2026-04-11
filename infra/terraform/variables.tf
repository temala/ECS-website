variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
  default     = "ecs-website"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure region for the resource group"
  type        = string
  default     = "francecentral"
}

variable "swa_location" {
  description = "Azure region for Static Web App (limited regions available)"
  type        = string
  default     = "westeurope"
}

variable "acs_resource_name" {
  description = "Name of the existing Azure Communication Services resource to reuse"
  type        = string
  default     = "voicebotpro-prod-acs"
}

variable "acs_resource_group" {
  description = "Resource group of the existing ACS resource"
  type        = string
  default     = "voicebotpro-prod-rg"
}

variable "recipient_email" {
  description = "ECS contact email that receives form submissions"
  type        = string
  default     = "contact@ecs75.fr"
}
