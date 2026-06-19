import os
import tomllib
import logging

def load_params(config_file_path):
    """Loads a TOML configuration file from an absolute file path."""
    
    # 1. Enforce the .toml extension automatically if they forgot it
    file_name, file_ext = os.path.splitext(config_file_path)
    if file_ext.lower() != ".toml":
        config_file_path = f"{file_name}.toml"
    
    # 2. Check if the file exists
    if not os.path.exists(config_file_path):
        error_msg = f"Configuration file not found at: {config_file_path}"
        logging.error(error_msg)
        raise FileNotFoundError(error_msg)

    # 3. Read and parse
    logging.info(f"Loading configuration from: {config_file_path}")
    with open(config_file_path, "rb") as f:
        return tomllib.load(f)
