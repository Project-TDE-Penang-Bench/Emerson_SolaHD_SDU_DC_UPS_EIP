import os
import logging
from logging.handlers import RotatingFileHandler

def setup_custom_logger(
    log_folder_path,
    log_filename="logs.log", 
    log_level=logging.DEBUG,
    disabled_loggers=None  # Fix: Avoid mutable default lists
):
    """Configures and returns a root logger. Requires a log folder path."""
    
    # 1. Safely handle the "debug" subfolder enforcement
    if os.path.basename(os.path.normpath(log_folder_path)) != "debug":
        log_folder_path = os.path.join(log_folder_path, "debug")
        
    os.makedirs(log_folder_path, exist_ok=True)
    
    # 2. Safely enforce the .log extension
    file_name, file_ext = os.path.splitext(log_filename)
    if file_ext.lower() != ".log":
        log_filename = f"{file_name}.log"
        
    log_file_path = os.path.join(log_folder_path, log_filename)

    # 3. Handle disabled loggers safely
    if disabled_loggers is None:
        disabled_loggers = []
        
    for logger_name in disabled_loggers:
        logging.getLogger(logger_name).setLevel(logging.ERROR)

    # 4. Define the format
    log_format = '%(asctime)s - %(levelname)s - [%(name)s.%(module)s.%(funcName)s:%(lineno)d] - %(message)s'
    
    # 5. Setup the Rotating Handler
    file_handler = RotatingFileHandler(
        log_file_path, 
        maxBytes=2*1024*1024, 
        backupCount=5
    )
    file_handler.setFormatter(logging.Formatter(log_format))

    # 6. Apply config to the Root Logger safely
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    
    # Clear existing handlers to prevent duplicate logs 
    # remove Stream handler to avoid TestStand conflicts with print()
    if root_logger.hasHandlers():
        root_logger.handlers.clear()
        
    root_logger.addHandler(file_handler)
    
    return root_logger
