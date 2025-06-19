# Thinkube Vue.js + FastAPI Template

A full-stack web application template for the Thinkube platform, featuring Vue.js frontend and FastAPI backend with Keycloak authentication.

## Overview

This template is designed to be deployed through **Thinkube Control**, providing a complete application scaffold that integrates seamlessly with the Thinkube platform's services and infrastructure.

## Features

- 🚀 **Vue.js 3** frontend with Composition API
- ⚡ **FastAPI** backend with async support
- 🔐 **Keycloak** integration for SSO
- 🌐 **Internationalization** (i18n) support
- 🎨 **Tailwind CSS** with DaisyUI components
- 🐳 **Docker** ready
- ☸️ **Kubernetes** manifests with Jinja2 templates
- 🔄 **GitOps** workflow with ArgoCD
- 📦 **PostgreSQL** database support (optional)
- 🔑 **API token** management (optional)
- 📊 **CI/CD monitoring** integration

## How to Use This Template

This template is deployed through the Thinkube Control interface:

1. **Login to Thinkube Control** at `https://control.yourdomain.com`

2. **Navigate to Templates** section

3. **Select "Vue.js + FastAPI"** template

4. **Configure your application**:
   - Project name (lowercase, hyphens allowed)
   - GitHub organization
   - Feature toggles (PostgreSQL, API tokens, CI/CD monitoring)

5. **Deploy** - Thinkube Control will automatically:
   - Create your GitHub repository
   - Process the template with your configuration
   - Set up the CI/CD pipeline with webhooks
   - Deploy to Kubernetes via ArgoCD
   - Configure Keycloak authentication
   - Enable monitoring and logging

## What Gets Deployed

When you deploy this template, you get:

- **Frontend** accessible at `https://your-app-name.yourdomain.com`
- **Backend API** at `https://your-app-name.yourdomain.com/api`
- **API Documentation** at `https://your-app-name.yourdomain.com/api/v1/docs`
- **Keycloak Client** configured for SSO
- **PostgreSQL Database** (if enabled)
- **CI/CD Pipeline** triggered on git push
- **Monitoring Integration** with Thinkube Control

## Template Structure

```
├── frontend/              # Vue.js application
├── backend/              # FastAPI application
├── k8s/                  # Kubernetes manifests (Jinja2 templates)
├── ansible/              # Deployment automation
│   └── deploy.yaml      # Deployment playbook (executed by Thinkube Control)
└── copier.yml           # Template configuration (used by Thinkube Control)
```

## Development After Deployment

Once deployed, your application repository will be available at:
- **GitHub**: `https://github.com/your-org/your-app-name`
- **Gitea**: `https://git.yourdomain.com/your-org-apps/your-app-name`

Development workflow:
1. Clone from Gitea (for live development on vm-2)
2. Make changes and push to Gitea
3. CI/CD pipeline automatically builds and deploys
4. Stable changes can be pushed back to GitHub

## Template Customization

To customize this template for your organization:

1. Fork this repository
2. Modify the template files as needed
3. Update `copier.yml` with your options
4. Submit a PR or maintain your own version

## Requirements

- Thinkube platform deployed and configured
- Thinkube Control with template deployment enabled
- GitHub organization for source code
- Valid domain with wildcard certificate

## Support

For issues with:
- **This template**: Open an issue in this repository
- **Thinkube Control**: Check the main Thinkube documentation
- **Deployed applications**: Use Thinkube Control's monitoring features