output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "frontend_url" {
  description = "URL of the Static Web App"
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
}

output "swa_deployment_token" {
  description = "Deployment token for Azure Static Web Apps (use as AZURE_SWA_DEPLOYMENT_TOKEN secret)"
  value       = azurerm_static_web_app.frontend.api_key
  sensitive   = true
}

output "swa_name" {
  description = "Name of the Static Web App"
  value       = azurerm_static_web_app.frontend.name
}

output "email_service_name" {
  description = "Name of the ACS Email Communication Service for ECS"
  value       = azurerm_email_communication_service.ecs.name
}

output "email_domain" {
  description = "Azure-managed email domain for sending"
  value       = azurerm_email_communication_service_domain.ecs.from_sender_domain
}
