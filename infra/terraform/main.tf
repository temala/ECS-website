terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    # Configure via CLI args:
    #   -backend-config="resource_group_name=tfstate-rg"
    #   -backend-config="storage_account_name=tfstatesa"
    #   -backend-config="container_name=tfstate"
    #   -backend-config="key=ecs-website.tfstate"
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

locals {
  prefix = "${var.project_name}-${var.environment}"
  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# -----------------------------------------------------------------------------
# Resource Group
# -----------------------------------------------------------------------------
resource "azurerm_resource_group" "main" {
  name     = "${local.prefix}-rg"
  location = var.location
  tags     = local.tags
}

# -----------------------------------------------------------------------------
# Azure Communication Services (reuse existing from voicebotpro)
# -----------------------------------------------------------------------------
data "azurerm_communication_service" "shared" {
  name                = var.acs_resource_name
  resource_group_name = var.acs_resource_group
}

# -----------------------------------------------------------------------------
# ACS Email Service (separate for ECS, Azure-managed domain - free)
# -----------------------------------------------------------------------------
resource "azurerm_email_communication_service" "ecs" {
  name                = "${local.prefix}-mail"
  resource_group_name = azurerm_resource_group.main.name
  data_location       = "United States"
  tags                = local.tags
}

resource "azurerm_email_communication_service_domain" "ecs" {
  name              = "AzureManagedDomain"
  email_service_id  = azurerm_email_communication_service.ecs.id
  domain_management = "AzureManaged"
}

# -----------------------------------------------------------------------------
# Azure Static Web App (Frontend + API - free tier)
# -----------------------------------------------------------------------------
resource "azurerm_static_web_app" "frontend" {
  name                = "${local.prefix}-frontend"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.swa_location
  sku_tier            = "Free"
  sku_size            = "Free"
  tags                = local.tags
}
