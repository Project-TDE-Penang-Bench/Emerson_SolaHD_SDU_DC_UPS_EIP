import os
import logging
import json
import pyautogui
import time
from typing import Tuple, Optional, Dict, List
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import WebDriverException
from selenium.common.exceptions import StaleElementReferenceException
from selenium.common.exceptions import TimeoutException


class Browser:
    def __init__(self, url: str, timeout: int = 10, headless: bool = False):
        self.url = url
        self.timeout = timeout
        self.headless = headless
        self.driver: Optional[webdriver.Chrome] = None

    def loc(self,
        element_id: Optional[str] = None,
        xpath: Optional[str] = None,
        name: Optional[str] = None,
        text: Optional[str] = None
        ) -> Tuple[str, str]:
        """
        Generates a standardized Selenium locator tuple (By, value).
        """
        if element_id:
            return (By.ID, element_id)
        if xpath:
            return (By.XPATH, xpath)
        if name:
            return (By.NAME, name)
        if text:
            return (By.XPATH, f"//*[text()='{text}']")
        raise ValueError("You must provide at least one identifier: element_id, xpath, name, or text.")

    def start(self,allow_fail=True) -> webdriver.Chrome:
        """
        Initializes the Chrome driver, configures secure/clean options, and loads the URL.
        """
        if self.driver:
            return self.driver
        logging.info(f"Launching Chrome session for: {self.url}")
        # Suppress SSL verification warnings for local hardware testing
        os.environ['WDM_SSL_VERIFY'] = '0'
        options = webdriver.ChromeOptions()
        options.add_argument("--start-maximized")
        options.add_argument("--guest")
        options.add_experimental_option("useAutomationExtension", False)
        options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
        if self.headless:
            options.add_argument("--headless=new")
        try:
            self.driver = webdriver.Chrome(service=Service(), options=options)
            self.driver.get(self.url)
            return self.driver
        except WebDriverException as e:
            logging.error(f"Failed to start the browser session: {e}")
            self.close()
            if allow_fail:

                raise
            else:
                return False

    def close(self) -> None:
        """
        Safely terminates the browser process.
        """
        if self.driver:
            logging.info("Closing browser session cleanly.")
            try:
                self.driver.quit()
            except Exception as e:
                logging.debug(f"Error during quit: {e}")
            finally:
                self.driver = None

    # --- Hybrid Context Manager Support ---
    def __enter__(self) -> "Browser":
        self.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type:
            logging.error(f"Context closed due to an exception: {exc_val}")
        self.close()

    # --- Safe Interaction Wrappers ---
    def wait_for_presence(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> webdriver.remote.webelement.WebElement:
        """Waits until an element exists in the DOM."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(EC.presence_of_element_located(locator))

    def wait_for_visibility(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> webdriver.remote.webelement.WebElement:
        """Waits until an element is visibly displayed on the screen."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(EC.visibility_of_element_located(locator))

    def wait_until_hidden(self, locator: Tuple[str, str], timeout: int = 30) -> bool:
        """
        Pauses execution until an element (like a loading spinner) 
        completely disappears or becomes hidden on the screen.
        """
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.invisibility_of_element_located(locator)
            )
            return True
        except Exception:
            logging.warning(f"Loader element {locator} did not disappear within {timeout}s")
            return False

    def wait_for_javascript_ready(self, max_wait: int = 15) -> bool:
        """
        Blocks execution until jQuery finishes loading external scripts 
        and background network requests return to idle ($.active == 0).
        """
        # This small JS snippet checks if jQuery is loaded, and if background tasks are done
        js_condition = "return (typeof jQuery !== 'undefined') && (jQuery.active === 0);"
        try:
            logging.info("Waiting for background JavaScript engine to settle...")
            WebDriverWait(self.driver, max_wait).until(
                lambda driver: driver.execute_script(js_condition)
            )
            return True
        except TimeoutException:
            logging.warning("JavaScript engine failed to settle within the timeout window.")
            return False

    def click(self, locator: Tuple[str, str]) -> None:
        """Waits for an element to be clickable, then clicks it."""
        element = WebDriverWait(self.driver, self.timeout).until(EC.element_to_be_clickable(locator))
        element.click()

    def check_box(self, locator: Tuple[str, str], state: bool):
        element = self.wait_for_visibility(locator)
        if element.is_selected() != state:
            self.click(locator)

    def select_by_value(self, locator: Tuple[str, str], value: str) -> None:
        """Waits for a dropdown element to be visible, then selects an option by value attribute."""
        element = self.wait_for_visibility(locator)
        select = Select(element)
        select.select_by_value(value)

    def get_element_size(self, locator: Tuple[str, str]) -> Tuple[int, int]:
        element = self.wait_for_visibility(locator)
        width = element.size['width']
        height = element.size['height']
        logging.debug(f"Element {locator} width: {width}px, height: {height}px")
        return (width, height)

    def scrape_table(self, table_locator: Tuple[str, str]) -> Dict[str, str]:
        """
        Extracts two-column key-value tables safely, even if the elements
        go stale or lack standard formatting headers.
        """
        table_element = self.wait_for_visibility(table_locator)
        rows = table_element.find_elements(By.XPATH, ".//tr")
        parsed_table = []
        for row in rows:
            # Look for either standard cells (td) or header cells (th)
            cells = row.find_elements(By.XPATH, ".//td | .//th")
            if not cells:
                continue
            # Extract text from every cell in this row
            row_data = []
            for cell in cells:
                text = cell.text.strip().replace("临C", "*C")
                row_data.append(text)
            # Skip empty separator rows (like ones with colspan)
            if any(row_data):
                parsed_table = parsed_table + [row_data]
        return parsed_table
    
    def handle_basic_auth(self, username: str = "admin", password: str = "admin", delay: float = 1.5) -> None:
        """
        Simulates keyboard input to clear Chrome's native HTTP Basic Auth popup.
        
        :param username: Username to type.
        :param password: Password to type.
        :param delay: Seconds to wait for the browser prompt to gain focus before typing.
        """
        # Wait for Chrome to render the popup and focus on the Username field
        time.sleep(delay)
        
        # Type Username -> Switch field -> Type Password -> Submit
        pyautogui.typewrite(username)
        pyautogui.press("tab")
        pyautogui.typewrite(password)
        pyautogui.press("enter")
        
        # Short pause to allow login to complete
        time.sleep(1.0)

    def handle_basic_auth_ignore_error(self, username: str = "admin", password: str = "admin", delay: float = 2) -> None:
        """
        Simulates keyboard input ONCE to clear Chrome's native HTTP Basic Auth popup.
        Silently suppresses any errors if the popup is absent or focus is lost.
        
        :param username: Username to type.
        :param password: Password to type.
        :param delay: Seconds to wait for the browser prompt to gain focus before typing.
        """
        try:
            # Wait for Chrome to render the popup and focus on the Username field
            time.sleep(delay)
            
            # Type Username -> Switch field -> Type Password -> Submit
            pyautogui.typewrite(username)
            pyautogui.press("tab")
            pyautogui.typewrite(password)
            pyautogui.press("enter")
            
            # Short pause to allow login to complete
            time.sleep(1.0)
        except Exception as e:
            # Silently swallow any execution errors
            logging.debug(f"Basic auth error suppressed: {e}")
