# GitHub Actions CI/CD Setup Instructions

This repository contains a GitHub Actions workflow that automatically deploys your Weather Forecast application to Azure App Service.

## 🚀 How it works

The workflow (`.github/workflows/deploy.yml`) will:
1. **Build** - Install dependencies and build the Node.js application
2. **Test** - Run any tests (if configured)  
3. **Deploy** - Deploy to Azure App Service on every push to `main` branch

## 🔐 Required GitHub Secrets

You need to configure these secrets in your GitHub repository:

### 1. AZURE_CREDENTIALS

Create this secret with your Azure service principal credentials:

```json
{
  "clientId": "your-client-id-here",
  "clientSecret": "your-client-secret-here",
  "subscriptionId": "your-subscription-id-here",
  "tenantId": "your-tenant-id-here"
}
```

**Note**: Use the actual values from your local `azure-credentials.env` file.

## 📋 Setup Steps

### Step 1: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_CREDENTIALS`
5. Value: Copy the JSON above with your actual credentials
6. Click **Add secret**

### Step 2: Verify Deployment Target

The workflow is configured to deploy to:
- **App Name**: `weatherforecast-webapp-vwe3fend`
- **URL**: `https://weatherforecast-webapp-vwe3fend.azurewebsites.net`

### Step 3: Trigger Deployment

The workflow triggers automatically when you:
- Push to `main` branch
- Create a pull request to `main`
- Manually trigger via GitHub Actions tab

## 🔧 Workflow Configuration

- **Node.js Version**: 18.x
- **Build Command**: `npm install`
- **Test Command**: `npm test` (if available)
- **Build Command**: `npm run build` (if available)

## 🌍 Environments

The workflow deploys to:
- **Production Environment**: Direct deployment to main App Service
- **Staging**: You can enable staging slot deployment by modifying the workflow

## 🚦 Monitoring

After deployment, you can:
- View deployment status in GitHub Actions tab
- Access your live app at: https://weatherforecast-webapp-vwe3fend.azurewebsites.net
- Monitor app performance in Azure Portal → Application Insights

## 🛠️ Customization

To modify the deployment:
1. Edit `.github/workflows/deploy.yml`
2. Update environment variables
3. Add additional deployment steps
4. Configure staging slots or multiple environments

## 🔍 Troubleshooting

**Common Issues:**
- **Authentication fails**: Verify AZURE_CREDENTIALS secret is correct JSON format
- **App not found**: Check AZURE_WEBAPP_NAME matches your actual app service name
- **Build fails**: Ensure package.json scripts are configured correctly

**Logs Location:**
- GitHub Actions logs: Repository → Actions tab
- Azure App Service logs: Azure Portal → App Service → Log stream