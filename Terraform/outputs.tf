# Output the URL of the deployed web app
output "web_app_url" {
  value       = azurerm_linux_web_app.weatherforecast_app.default_hostname
  description = "The URL of the deployed weather forecast web application"
}

output "web_app_name" {
  value       = azurerm_linux_web_app.weatherforecast_app.name
  description = "The name of the deployed web application"
}

output "resource_group_name" {
  value       = azurerm_resource_group.appgrp.name
  description = "The name of the resource group"
}

output "app_service_plan_name" {
  value       = azurerm_service_plan.weatherforecast_plan.name
  description = "The name of the App Service Plan"
}

output "staging_slot_url" {
  value       = "https://${azurerm_linux_web_app.weatherforecast_app.name}-staging.azurewebsites.net"
  description = "The URL of the staging slot"
}

output "application_insights_instrumentation_key" {
  value       = azurerm_application_insights.weatherforecast_insights.instrumentation_key
  description = "Application Insights instrumentation key"
  sensitive   = true
}

output "application_insights_app_id" {
  value       = azurerm_application_insights.weatherforecast_insights.app_id
  description = "Application Insights Application ID"
}