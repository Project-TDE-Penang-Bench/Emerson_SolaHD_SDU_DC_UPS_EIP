import os
import time
import logging
import pandas as pd
from typing import List, Tuple

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.selenium_util import Browser
from tde_utilities.tkinter_util import StatusOverlay

overlay = StatusOverlay()

script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir,
                    disabled_loggers=['selenium',
                                      'urllib3',
                                      'selenium.webdriver.remote.remote_connection'])

overlay.start()
overlay.message = "Status: Reading Settings Page"

try:
    # Define target URLs and testing vectors
    TARGET_URL = "http://192.168.1.5"  # Replace with your test hardware IP

    # Initialize the automated execution block
    with Browser(TARGET_URL, headless=False) as browser:
    
         # Set Security and Reset
        browser.click(browser.loc(element_id='security'))
        browser.check_box(browser.loc(element_id='cbCyberSecurity'), True)
        browser.check_box(browser.loc(element_id='cbPCShutdown'), True)
        browser.check_box(browser.loc(element_id='cbAlarm'), True)
        browser.check_box(browser.loc(element_id='cbEvents'), True)
        browser.check_box(browser.loc(element_id='cbSettings'), True)
        browser.check_box(browser.loc(element_id='cbNetwork'), True)

        # browser.click(browser.loc(element_id='btnResetSecurity'))

    browser = Browser(TARGET_URL)

    for attempt in range(10):
        
        print(f"Check attempt {attempt+1}")


        # Try interact + confirm GUI is present
        if not browser.start (allow_fail=False):
            logging.info ("Start Fail,existing loop")
            break

        browser.close()

        # GUI still alive
        print("GUI still detected (connection OK)")
        time.sleep(1)
        continue   # keep looping until lost

    else:
        print("ERROR: GUI still active after 10 checks (no disconnect detected)")


except Exception as e:
    print(f"ERROR: web scraping failed {e}")
    logging.exception("web scraping failed")

overlay.close()