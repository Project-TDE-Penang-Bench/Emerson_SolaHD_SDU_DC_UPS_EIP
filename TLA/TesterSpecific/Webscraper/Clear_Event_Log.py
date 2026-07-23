import os
import time
import logging
import pyautogui
import pandas as pd
from typing import List, Tuple

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.selenium_util import Browser
from tde_utilities.tkinter_util import StatusOverlay
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

overlay = StatusOverlay()

script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir,
                    disabled_loggers=['selenium',
                                      'urllib3',
                                      'selenium.webdriver.remote.remote_connection'])

overlay.start()
overlay.message = "Status: Reading Security Page"

try:
    # Define target URLs and testing vectors
    TARGET_URL = "http://192.168.1.5"  # Replace with your test hardware IP
    

    # Initialize the automated execution block
    with Browser(TARGET_URL, headless=False) as browser:
        browser.handle_basic_auth()
    
         # Set Security and Reset
        browser.click(browser.loc(element_id='security'))
        browser.handle_basic_auth_ignore_error()
    
        browser.check_box(browser.loc(element_id='cbEvents'), True)        

    # --- POPUP DETECTION INTEGRATION ---
        max_retries = 2
        for attempt in range(max_retries + 1):  # 0, 1, 2 (Total 3 attempts)
            try:
                # Click the "Save settings" button using its name attribute
                browser.click(browser.loc(element_id='btnResetSecurity'))
                time.sleep(5)
                pyautogui.press("enter")    
                time.sleep(1)
                # Wait up to 5 seconds for the browser alert to appear
                WebDriverWait(browser.driver, 5).until(EC.alert_is_present())
                
                # Switch focus to the alert box
                alert = browser.driver.switch_to.alert
                print(f"POPUP DETECTED: Message reads -> '{alert.text}'")
                
                # Click 'OK' automatically to dismiss it
                alert.accept()
                print("SUCCESS: Event Log Reset Successfully!")
                
                # Exit the loop immediately since it succeeded
                break 

            except Exception as e:
                print(f"Attempt {attempt + 1} failed: No alert popup appeared within 5 seconds.")
                
                # If we have reached the max retry limit, log the final error
                if attempt == max_retries:
                    print(f"ERROR: All {max_retries + 1} attempts failed! Details: {e}")
                else:
                    print("Retrying...")


except Exception as e:
    print(f"ERROR: web scraping failed {e}")
    logging.exception("web scraping failed")

overlay.close()