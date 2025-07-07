#!/bin/bash
# Simple activation script for the Python virtual environment

echo "Activating Python virtual environment..."
source venv/bin/activate

echo "Virtual environment activated!"
echo "Python version: $(python --version)"
echo "Pip version: $(pip --version)"
echo ""
echo "To install dependencies, run:"
echo "  pip install -e ."
echo ""
echo "To start Jupyter Lab, run:"
echo "  jupyter lab"
echo ""
echo "To deactivate, run:"
echo "  deactivate"