# Variables for the Terraform configuration
variable "location" {
  description = "The Azure Region in which all resources should be created"
  type        = string
  default     = "Central India"
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "app-grp"
}

variable "app_name_prefix" {
  description = "Prefix for the application name"
  type        = string
  default     = "weatherforecast"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "sku_name" {
  description = "The SKU name for the App Service Plan"
  type        = string
  default     = "S1"
  validation {
    condition = contains(["B1", "B2", "B3", "S1", "S2", "S3", "P1", "P2", "P3", "P1v2", "P2v2", "P3v2"], var.sku_name)
    error_message = "The sku_name must be one of: B1, B2, B3, S1, S2, S3, P1, P2, P3, P1v2, P2v2, P3v2."
  }
}

variable "node_version" {
  description = "Node.js version for the web app"
  type        = string
  default     = "18-lts"
}

variable "tags" {
  description = "A map of tags to assign to the resources"
  type        = map(string)
  default = {
    Environment = "Production"
    Project     = "WeatherForecast"
    ManagedBy   = "Terraform"
  }
}