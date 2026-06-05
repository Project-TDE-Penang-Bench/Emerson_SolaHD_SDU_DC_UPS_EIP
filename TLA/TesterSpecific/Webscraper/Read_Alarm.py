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
overlay.message = "Status: Reading Alarm Page"

try:
    # Define target URLs and testing vectors
    TARGET_URL = "http://192.168.1.5"  # Replace with your test hardware IP

    # Initialize the automated execution block
    with Browser(TARGET_URL, headless=True) as browser:
    
        # Step 6: Read alarm 
        browser.click(browser.loc(element_id='alarm'))
        browser.wait_for_javascript_ready()
        content = browser.scrape_table(browser.loc(element_id='alarm-table'))

        df = pd.DataFrame(content)
        text_cols = df.select_dtypes(include=['object', 'string']).columns

        # Apply the replacement to all text columns at once
        pattern = r'[^a-zA-Z0-9\s.,!?:%]'
        df[text_cols] = df[text_cols].apply(lambda x: x.str.replace(pattern, '', regex=True))

        # Add "Value" to header of second column as in Emerson WebGUI does not have any text for Column 0 Row 1
        df.loc[df[0] == "Identification", 1] = "Value"
        csv_string = df.to_csv(index=False, header=False)
        
        print (csv_string)

        print(f"SUCCESS: Alarm Page Readable")

except Exception as e:
    print(f"ERROR: web scraping failed {e}")
    logging.exception("web scraping failed")

overlay.close()