import os
import time
import logging
from typing import List, Tuple

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.selenium_util import Browser


script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir,
                    disabled_loggers=['selenium',
                                      'urllib3',
                                      'selenium.webdriver.remote.remote_connection'])

try:
    # Define target URLs and testing vectors
    TARGET_URL = "http://192.168.1.5"  # Replace with your test hardware IP

    # Initialize the automated execution block
    with Browser(TARGET_URL, headless=False) as browser:
        # Step 1: Initial Load Validation
        browser.wait_for_visibility(browser.loc(element_id="main-content"))
        # add elements to check as you see fit
        print("SUCCESS: web loaded succesfully")

except Exception as e:
    print(f"ERROR: web scraping failed {e}")
    logging.exception("web scraping failed")
