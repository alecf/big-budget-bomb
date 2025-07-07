"""Utility functions for the Salt Cap Data Processing package."""

from typing import Dict, Any, Optional
import logging


def setup_logging(level: str = "INFO") -> None:
    """Set up logging configuration.
    
    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )


def validate_config(config: Dict[str, Any]) -> bool:
    """Validate configuration dictionary.
    
    Args:
        config: Configuration dictionary to validate
        
    Returns:
        True if configuration is valid, False otherwise
    """
    required_keys = ["data_source", "output_path"]
    
    for key in required_keys:
        if key not in config:
            logging.error(f"Missing required configuration key: {key}")
            return False
    
    return True


def safe_get(data: Dict[str, Any], key: str, default: Any = None) -> Any:
    """Safely get a value from a dictionary.
    
    Args:
        data: Dictionary to get value from
        key: Key to look up
        default: Default value if key not found
        
    Returns:
        Value from dictionary or default
    """
    return data.get(key, default)


class ConfigurationError(Exception):
    """Raised when there's a configuration error."""
    pass


class DataProcessingError(Exception):
    """Raised when there's a data processing error."""
    pass