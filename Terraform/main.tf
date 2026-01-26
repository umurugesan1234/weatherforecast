# Configure the Azure Provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
  # Azure credentials will be set via environment variables or Azure CLI
  # Set the following environment variables:
  # ARM_CLIENT_ID = "your-client-id"
  # ARM_CLIENT_SECRET = "your-client-secret" 
  # ARM_TENANT_ID = "your-tenant-id"
  # ARM_SUBSCRIPTION_ID = "your-subscription-id"
}

# Create a resource group
resource "azurerm_resource_group" "appgrp" {
  name     = "rg-website"
  location = "Central India"
}

# Create an App Service Plan
resource "azurerm_service_plan" "weatherforecast_plan" {
  name                = "weatherforecast-appserviceplan"
  resource_group_name = azurerm_resource_group.appgrp.name
  location            = azurerm_resource_group.appgrp.location
  os_type             = "Linux"
  sku_name            = "S1" # Standard SKU
}

# Create the web app
resource "azurerm_linux_web_app" "weatherforecast_app" {
  name                = "weatherforecast-webapp-${random_string.unique.result}"
  resource_group_name = azurerm_resource_group.appgrp.name
  location            = azurerm_resource_group.appgrp.location
  service_plan_id     = azurerm_service_plan.weatherforecast_plan.id

  site_config {
    always_on        = true
    app_command_line = ""
    
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "18.17.0"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
  }

  logs {
    detailed_error_messages = false
    failed_request_tracing  = false
    
    application_logs {
      file_system_level = "Off"
    }
    
    http_logs {
      file_system {
        retention_in_days = 1
        retention_in_mb   = 35
      }
    }
  }

  tags = {
    Environment = "Production"
    Project     = "WeatherForecast"
  }
}

# Generate a random string to make app name unique
resource "random_string" "unique" {
  length  = 8
  upper   = false
  special = false
}

# Create Application Insights for monitoring
resource "azurerm_application_insights" "weatherforecast_insights" {
  name                = "weatherforecast-appinsights"
  location            = azurerm_resource_group.appgrp.location
  resource_group_name = azurerm_resource_group.appgrp.name
  application_type    = "web"

  tags = {
    Environment = "Production"
    Project     = "WeatherForecast"
  }
}

# Configure App Insights connection string in the web app
resource "azurerm_linux_web_app_slot" "staging" {
  name           = "staging"
  app_service_id = azurerm_linux_web_app.weatherforecast_app.id

  site_config {
    always_on = false
    
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "18.17.0"
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.weatherforecast_insights.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.weatherforecast_insights.connection_string
  }

  tags = {
    Environment = "Staging"
    Project     = "WeatherForecast"
  }
}