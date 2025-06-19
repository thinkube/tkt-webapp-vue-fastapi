# Thinkube Vue.js + FastAPI Template

A full-stack web application template for Thinkube platform, featuring Vue.js frontend and FastAPI backend with Keycloak authentication.

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

## Prerequisites

- Python 3.11+
- [Copier](https://copier.readthedocs.io/) 
- Thinkube platform deployed

## Using This Template

1. Install Copier:
   ```bash
   pip install copier
   ```

2. Create a new project from this template:
   ```bash
   copier copy https://github.com/thinkube-templates/tkt-webapp-vue-fastapi my-app
   ```

3. Answer the prompts to customize your project

4. Initialize git and push to GitHub:
   ```bash
   cd my-app
   git init
   git add .
   git commit -m "Initial commit from template"
   git remote add origin git@github.com:yourusername/my-app.git
   git push -u origin main
   ```

5. Deploy using Thinkube Control:
   - Login to Thinkube Control
   - Navigate to Templates
   - Deploy your application

## Template Options

- **project_name**: Your project identifier (lowercase, hyphens)
- **project_title**: Human-readable project name
- **use_postgresql**: Enable PostgreSQL database
- **enable_api_tokens**: Add API token management
- **enable_cicd_monitoring**: Integrate with CI/CD monitoring

## Project Structure

```
├── frontend/              # Vue.js application
├── backend/              # FastAPI application
├── k8s/                  # Kubernetes manifests
├── ansible/              # Deployment automation
│   ├── deploy.yaml      # Main deployment playbook
│   └── roles/           # Shared Ansible roles
└── copier.yml           # Template configuration
```

## Development

See the generated README.md in your project for development instructions.

## Contributing

1. Fork this template repository
2. Create a feature branch
3. Make your improvements
4. Test with Copier
5. Submit a pull request

## License

MIT License - see LICENSE file for details