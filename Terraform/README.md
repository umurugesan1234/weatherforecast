# Azure Deployment Instructions for Weather Forecast App

This guide will help you deploy the Weather Forecast application to Azure App Service using Terraform.

## Prerequisites

1. **Azure CLI** - Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
2. **Terraform** - Install from https://www.terraform.io/downloads.html
3. **Node.js** (for local testing) - Install from https://nodejs.org/

## Azure Credentials

The Terraform configuration uses the provided Azure service principal credentials:
- Client ID: `3a1dd217-a847-4040-8233-ecd28f27ecdd`
- Tenant ID: `321d9ef4-fca5-4e43-be35-0a7221c96329`
- Subscription ID: `8ad9564e-118d-41a0-a5c4-406312b09421`

## Deployment Steps

### 1. Initialize Terraform

Navigate to the Terraform directory and initialize:

```bash
cd Terraform
terraform init
```

### 2. Plan the Deployment

Review what resources will be created:

```bash
terraform plan
```

### 3. Deploy to Azure

Apply the Terraform configuration:

```bash
terraform apply
```

Type `yes` when prompted to confirm the deployment.

### 4. Get Deployment Information

After successful deployment, Terraform will output:
- Web app URL
- Web app name
- Resource group name
- App Service Plan name
- Staging slot URL

## What Gets Created

The Terraform script creates the following Azure resources:

1. **Resource Group**: `app-grp` in Central India
2. **App Service Plan**: Standard SKU (S1) with Linux OS
3. **Linux Web App**: Hosts your weather forecast application
4. **Staging Slot**: For testing deployments before production
5. **Application Insights**: For monitoring and analytics

## Configuration Details

- **App Service Plan SKU**: S1 (Standard)
- **Runtime**: Node.js 18 LTS
- **OS**: Linux
- **Region**: Central India
- **Always On**: Enabled for production slot
- **Monitoring**: Application Insights enabled

## Post-Deployment

### Deploy Your Code

After the infrastructure is created, you need to deploy your application code:

1. **Using Azure CLI**:
```bash
# Login to Azure
az login

# Deploy using zip deployment
az webapp deployment source config-zip \
  --resource-group app-grp \
  --name <your-webapp-name> \
  --src weatherforecast.zip
```

2. **Using Git Deployment**:
```bash
# Get Git clone URL
az webapp deployment source show --resource-group app-grp --name <your-webapp-name>

# Set up Git remote and push
git remote add azure <git-clone-url>
git push azure main
```

3. **Using VS Code Extension**:
   - Install Azure App Service extension
   - Right-click on your web app
   - Select "Deploy to Web App"

### Access Your Application

- **Production**: `https://<your-webapp-name>.azurewebsites.net`
- **Staging**: `https://<your-webapp-name>-staging.azurewebsites.net`

## Environment Variables

The application uses these environment variables:
- `PORT`: Automatically set by Azure App Service
- `WEBSITE_NODE_DEFAULT_VERSION`: Set to 18.17.0
- `APPINSIGHTS_INSTRUMENTATIONKEY`: Auto-configured for monitoring

## Monitoring

Application Insights is configured to provide:
- Application performance monitoring
- Error tracking
- User analytics
- Custom telemetry

Access Application Insights through the Azure Portal to view metrics and logs.

## Cleanup

To remove all created resources:

```bash
cd Terraform
terraform destroy
```

## Troubleshooting

1. **Deployment fails**: Check Azure CLI authentication and permissions
2. **App not starting**: Review Application Insights logs for Node.js errors
3. **Performance issues**: Scale up the App Service Plan if needed
4. **Custom domain**: Configure after deployment through Azure Portal

## Support

For issues with:
- Azure services: Check Azure Portal diagnostics
- Terraform: Review terraform plan output
- Application: Check Application Insights logs