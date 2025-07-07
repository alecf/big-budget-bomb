"""Tests for the utils module."""

import logging
from unittest.mock import patch

import pytest

from bigbudgetbomb.utils import (
    ConfigurationError,
    DataProcessingError,
    safe_get,
    setup_logging,
    validate_config,
)


class TestSetupLogging:
    """Test the setup_logging function."""

    @patch("logging.basicConfig")
    def test_setup_logging_default(self, mock_basic_config):
        """Test setup_logging with default level."""
        setup_logging()
        mock_basic_config.assert_called_once_with(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )

    @patch("logging.basicConfig")
    def test_setup_logging_custom_level(self, mock_basic_config):
        """Test setup_logging with custom level."""
        setup_logging("DEBUG")
        mock_basic_config.assert_called_once_with(
            level=logging.DEBUG,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )


class TestValidateConfig:
    """Test the validate_config function."""

    def test_validate_config_valid(self):
        """Test validate_config with valid configuration."""
        config = {"data_source": "test_source", "output_path": "/tmp/test"}
        assert validate_config(config) is True

    def test_validate_config_missing_data_source(self):
        """Test validate_config with missing data_source."""
        config = {"output_path": "/tmp/test"}
        assert validate_config(config) is False

    def test_validate_config_missing_output_path(self):
        """Test validate_config with missing output_path."""
        config = {"data_source": "test_source"}
        assert validate_config(config) is False

    def test_validate_config_empty(self):
        """Test validate_config with empty configuration."""
        config = {}
        assert validate_config(config) is False


class TestSafeGet:
    """Test the safe_get function."""

    def test_safe_get_existing_key(self):
        """Test safe_get with existing key."""
        data = {"key1": "value1", "key2": "value2"}
        result = safe_get(data, "key1")
        assert result == "value1"

    def test_safe_get_missing_key_no_default(self):
        """Test safe_get with missing key and no default."""
        data = {"key1": "value1"}
        result = safe_get(data, "missing_key")
        assert result is None

    def test_safe_get_missing_key_with_default(self):
        """Test safe_get with missing key and default value."""
        data = {"key1": "value1"}
        result = safe_get(data, "missing_key", "default_value")
        assert result == "default_value"

    def test_safe_get_empty_dict(self):
        """Test safe_get with empty dictionary."""
        data = {}
        result = safe_get(data, "any_key", "default")
        assert result == "default"


class TestExceptions:
    """Test custom exceptions."""

    def test_configuration_error(self):
        """Test ConfigurationError can be raised and caught."""
        with pytest.raises(ConfigurationError):
            raise ConfigurationError("Test configuration error")

    def test_data_processing_error(self):
        """Test DataProcessingError can be raised and caught."""
        with pytest.raises(DataProcessingError):
            raise DataProcessingError("Test data processing error")
