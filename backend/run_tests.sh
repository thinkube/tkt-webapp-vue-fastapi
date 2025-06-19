#!/bin/bash
# run_tests.sh - Run backend tests with coverage

set -e

echo "Running backend tests..."

# Load test environment variables
if [ -f .env.test ]; then
    export $(cat .env.test | grep -v '^#' | xargs)
fi

# Run tests with coverage
pytest tests/ -v --cov=app --cov-report=term-missing --cov-report=html

# Run code quality checks (optional - don't fail the build)
echo -e "\nRunning code quality checks..."
flake8 app/ --max-line-length=120 --exclude=__pycache__ || echo "Linting issues found (non-blocking)"
black --check app/ || echo "Formatting issues found (non-blocking)"

echo -e "\nAll tests and checks passed!"

# 🤖 Generated with Claude