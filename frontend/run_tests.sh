#!/bin/sh
# run_tests.sh - Run frontend tests with coverage

set -e

echo "Running frontend tests..."

# Install dependencies if needed
if [ -f package-lock.json ]; then
    echo "Installing dependencies with npm ci..."
    npm ci --cache /workspace/.cache/npm
else
    echo "Installing dependencies with npm install..."
    npm install --cache /workspace/.cache/npm
fi

# Run linter
echo -e "\nRunning linter..."
npm run lint || echo "Linting issues found (non-blocking)"

# Run tests
echo -e "\nRunning unit tests..."
if [ -f package.json ] && grep -q '"test"' package.json; then
    npm run test
    echo "Tests passed successfully!"
else
    echo "Error: No test script found in package.json"
    exit 1
fi

# Run coverage report if available
echo -e "\nChecking test coverage..."
npm run test:coverage || echo "Coverage report not available"

echo -e "\nAll tests completed!"

# 🤖 Generated with Claude