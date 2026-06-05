import os
import time
import logging
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
overlay.message = "Status: Setting All Port to Default Speed"

try:
    # Define target URLs and testing vectors
    TARGET_URL = "http://192.168.1.5"  # Replace with your test hardware IP

    # Initialize the automated execution block
    with Browser(TARGET_URL, headless=True) as browser:
        
        # Navigate to Configuration Page 
        browser.click(browser.loc(element_id='nwconfig'))
        browser.wait_for_visibility(browser.loc(element_id="main-content"))
        browser.wait_for_javascript_ready()

        # Set Port 1 Speed to Auto
        locator = browser.loc(name='comm1') 
    
        # Find it using the underlying selenium driver instance
        raw_element = browser.driver.find_element(*locator) 
        
        # Use standard Selenium Select
        select_object = Select(raw_element)
        # Value (0 = Auto, 1 = 10HDX, 2 = 10 FDX, 3 = 100HDX, 4 = 100FDX)
        select_object.select_by_value("0")

        # Set Port 2 Speed to Auto
        locator = browser.loc(name='comm2') 
    
        # Find it using the underlying selenium driver instance
        raw_element = browser.driver.find_element(*locator) 
        
        # Use standard Selenium Select
        select_object = Select(raw_element)
        # Value (0 = Auto, 1 = 10HDX, 2 = 10 FDX, 3 = 100HDX, 4 = 100FDX)
        select_object.select_by_value("0")

        # Click the "Save settings" button using its name attribute
        browser.click(browser.loc(name='button_ethconf'))

        # --- POPUP DETECTION INTEGRATION ---
        max_retries = 2
        for attempt in range(max_retries + 1):  # 0, 1, 2 (Total 3 attempts)
            try:
                # Click the "Save settings" button using its name attribute
                browser.click(browser.loc(name='button_ethconf'))
                # Wait up to 5 seconds for the browser alert to appear
                WebDriverWait(browser.driver, 5).until(EC.alert_is_present())
                
                # Switch focus to the alert box
                alert = browser.driver.switch_to.alert
                print(f"POPUP DETECTED: Message reads -> '{alert.text}'")
                
                # Click 'OK' automatically to dismiss it
                alert.accept()
                print("SUCCESS: All Port Speed Set to Default! ")
                
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