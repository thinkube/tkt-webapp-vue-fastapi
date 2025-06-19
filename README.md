# Vue.js + FastAPI Template for Thinkube

A full-stack web application template for the [Thinkube](https://github.com/thinkube/thinkube) platform, providing a production-ready scaffold with authentication, internationalization, and CI/CD integration.

## 🚀 Quick Start

[![Deploy to Thinkube](https://img.shields.io/badge/Deploy%20to-Thinkube-blue?style=for-the-badge&logo=kubernetes)](https://thinkube.github.io/tkt-webapp-vue-fastapi/deploy.html)

Click the button above to deploy this template to your Thinkube instance!

## ✨ Features

### Frontend (Vue.js 3)
- ⚡ Composition API with `<script setup>`
- 🌐 Internationalization (i18n) 
- 🎨 Tailwind CSS + DaisyUI
- 🔐 Keycloak authentication
- 📱 Responsive design

### Backend (FastAPI)
- 🚀 Async/await support
- 📚 Automatic API documentation
- 🔐 JWT token validation
- 🗄️ PostgreSQL integration (optional)
- 🔑 API token management (optional)

### Platform Integration
- ☸️ Kubernetes-ready with Helm charts
- 🔄 GitOps workflow (GitHub → Gitea → ArgoCD)
- 📊 CI/CD monitoring
- 🐳 Automated container builds
- 🔒 Automatic HTTPS with cert-manager

## 📁 Project Structure

```
.
├── frontend/               # Vue.js SPA
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── views/        # Page components
│   │   ├── locales/      # i18n translations
│   │   └── services/     # API integration
│   └── Dockerfile
│
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core configuration
│   │   └── models/      # Pydantic models
│   └── Dockerfile
│
├── k8s/                   # Kubernetes manifests
│   └── *.yaml.jinja      # Templated manifests
│
├── ansible/               # Deployment automation
│   └── deploy.yaml       # Main deployment playbook
│
└── copier.yml            # Template configuration
```

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3, Vite, Tailwind CSS, DaisyUI
- **Backend**: FastAPI, SQLAlchemy, Alembic
- **Authentication**: Keycloak (OIDC)
- **Database**: PostgreSQL
- **Container**: Docker, Kubernetes
- **CI/CD**: Argo Workflows, ArgoCD
- **Monitoring**: Integrated with Thinkube Control

## 📋 Prerequisites

- Thinkube platform deployed
- Thinkube Control configured
- GitHub organization
- Domain with wildcard certificate

## 🔧 Configuration Options

When deploying through Thinkube Control:

| Option | Description | Default |
|--------|-------------|---------|
| `project_name` | Application identifier (lowercase) | - |
| `project_title` | Human-readable name | - |
| `github_username` | GitHub org/username | - |
| `use_postgresql` | Enable PostgreSQL database | `true` |
| `enable_api_tokens` | Add API token management | `true` |
| `enable_cicd_monitoring` | Enable CI/CD monitoring | `true` |

## 🚀 After Deployment

Your application will be available at:
- **Application**: `https://your-app.yourdomain.com`
- **API Docs**: `https://your-app.yourdomain.com/api/v1/docs`
- **GitHub**: `https://github.com/your-org/your-app`
- **Gitea**: `https://git.yourdomain.com/your-org-apps/your-app`

## 📖 Documentation

- [Thinkube Documentation](https://github.com/thinkube/thinkube)
- [Template Customization Guide](TEMPLATE_README.md)
- [Vue.js Documentation](https://vuejs.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Test the template deployment
5. Submit a pull request

## 📝 License

This template is part of the Thinkube project and follows the same license terms.

---

**Note**: This is a template repository. The actual application README will be generated when you deploy through Thinkube Control.