"""Basic tests to ensure the testing setup works."""

import pytest


def test_basic_functionality():
    """Test basic functionality to ensure pytest is working."""
    assert True


def test_python_version():
    """Test that we're running on a supported Python version."""
    import sys

    version = sys.version_info
    assert version.major == 3
    assert version.minor >= 11


def test_imports():
    """Test that core dependencies can be imported."""
    try:
        import geopandas  # noqa: F401
        import numpy  # noqa: F401
        import pandas  # noqa: F401

        assert True
    except ImportError as e:
        pytest.fail(f"Failed to import required dependencies: {e}")


class TestBasicClass:
    """Test class to ensure class-based tests work."""

    def test_class_method(self):
        """Test that class-based test methods work."""
        result = 2 + 2
        assert result == 4

    def test_with_fixture(self):
        """Test using a simple fixture."""
        data = {"key": "value"}
        assert data["key"] == "value"
