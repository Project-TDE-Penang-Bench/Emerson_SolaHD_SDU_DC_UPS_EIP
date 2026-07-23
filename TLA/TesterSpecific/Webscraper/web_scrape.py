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
    with Browser(TARGET_URL) as browser:
        browser.handle_basic_auth()

        # Step 1: Initial Load Validation
        browser.wait_for_visibility(browser.loc(element_id="main-content"))
        # add elements to check as you see fit
        print("SUCCESS: web loaded succesfully")

        # Step 2: Proportional Ratio Validation
        w, h = browser.get_element_size(browser.loc(element_id="header"))
        if w != 800 or h != 86:
            raise Exception(f'ratio for header is wrong {w=}, {h=}')
        # add elements to check as you see fit
        print("SUCCESS: ratio check okay")

        # Step 3: Read overview-table
        browser.wait_until_hidden(browser.loc(element_id='spinnerOvrTemp'))
        content = browser.scrape_table(browser.loc(element_id='overview-table'))
        print(f"SUCCESS: overview table:\n {content}")

        # Step 4: Read UPS Parameters (complicated because it didn't have spinner)
        browser.click(browser.loc(element_id='para'))
        for _ in range(10):
            content = browser.scrape_table(browser.loc(element_id='para-table'))
            if not any("??" in cell for row in content for cell in row):
                break
            time.sleep(1)
        print(f"SUCCESS: parameter table:\n {content}")

        # Step 5: Read Event (needs at least 64 lines)
        browser.click(browser.loc(element_id='event'))
        browser.wait_for_javascript_ready()
        content = browser.scrape_table(browser.loc(element_id='eventTable'))
        print(f"SUCCESS: event table:\n {content}")

        # Step 6: Read alarm 
        browser.click(browser.loc(element_id='alarm'))
        browser.wait_for_javascript_ready()
        content = browser.scrape_table(browser.loc(element_id='alarm-table'))
        print(f"SUCCESS: alarm table:\n {content}")

        # Step 7: Read Settings 
        browser.click(browser.loc(element_id='setting'))
        browser.wait_for_javascript_ready()
        content = browser.scrape_table(browser.loc(element_id='alarm-table'))
        print(f"SUCCESS: setting table:\n {content}")

        # Step 8: Set Security and Reset
        browser.click(browser.loc(element_id='security'))
        browser.check_box(browser.loc(element_id='cbCyberSecurity'), True)
        browser.check_box(browser.loc(element_id='cbPCShutdown'), True)
        browser.check_box(browser.loc(element_id='cbAlarm'), True)
        browser.check_box(browser.loc(element_id='cbEvents'), True)
        browser.check_box(browser.loc(element_id='cbSettings'), True)
        browser.check_box(browser.loc(element_id='cbNetwork'), True)
        # browser.click(browser.loc(element_id='btnResetSecurity'))

except Exception as e:
    print(f"ERROR: web scraping failed {e}")
    logging.exception("web scraping failed")
