"""
pip install paramiko
"""
import os
import time
import logging
import paramiko

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.state_util import load_params


script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir)
params = load_params(os.path.join(script_dir, "configs", "params.toml"))

try:
    with paramiko.SSHClient() as ssh:
        # ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        logging.info(f'connecting to {params["hostname"]}')
        ssh.connect(params["hostname"], params["user"], params["password"])
        logging.info(f"Uploading {params['source_dir']} to {params['destination_dir']}...")
        with ssh.open_sftp() as sftp:
            sftp.put(params["source_dir"], params["destination_dir"])
        logging.info("Upload completed successfully!")
        print("SUCCESS: Upload completed successfully")
except Exception as e:
    logging.error(f"Error: {e}")
    print(f"Error: {e}")
