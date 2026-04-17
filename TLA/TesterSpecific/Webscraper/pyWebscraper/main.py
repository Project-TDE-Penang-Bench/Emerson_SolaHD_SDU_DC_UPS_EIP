import os
import pyautogui
import time
import configparser
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from keyboard import press
from argparse import ArgumentParser


def match_image(images, confidence):
    data = ""
    for image in images:
        if pyautogui.locateOnScreen(image, confidence=confidence) is None:
            data += image + " FAIL\r\n"
        else:
            data += image + " PASS\r\n"
    return data


def wait_until_present(driver, locator, str):
    match locator:
        case "id":
            element = WebDriverWait(driver, args.delay).until(EC.presence_of_element_located((By.ID, str)))
        case "name":
            element = WebDriverWait(driver, args.delay).until(EC.presence_of_element_located((By.NAME, str)))
        case "xpath":
            element = WebDriverWait(driver, args.delay).until(EC.presence_of_element_located((By.XPATH, str)))
    return element



def wait_until_visible(driver, locator, str):
    match locator:
        case "id":
            element = WebDriverWait(driver, args.delay).until(EC.visibility_of_element_located((By.ID, str)))
        case "name":
            element = WebDriverWait(driver, args.delay).until(EC.visibility_of_element_located((By.NAME, str)))
        case "xpath":
            element = WebDriverWait(driver, args.delay).until(EC.visibility_of_element_located((By.XPATH, str)))
    return element


def wait_until_all_visible(driver):
    for id in ids:
        wait_until_visible(driver, "id", id)
    for name in names:
        wait_until_visible(driver, "name", name)
    for xpath in xpaths:
        wait_until_visible(driver, "xpath", xpath)


def click(driver, locator, str):
    match locator:
        case "id":
            element = driver.find_element(By.ID, str).click()
        case "name":
            element = driver.find_element(By.NAME, str).click()
        case "xpath":
            element = driver.find_element(By.XPATH, str).click()
    return element


def select_option(driver, locator, str, value):
    match locator:
        case "id":
            select = Select(driver.find_element(By.ID, str))
        case "name":
            select = Select(driver.find_element(By.NAME, str))
        case "xpath":
            select = Select(driver.find_element(By.XPATH, str))
    select.select_by_value(value)
    return select
    
    
def get_header_size(driver, table_id):
    xpath_tr = "//table[@id='" + table_id + "']/thead/tr"
    xpath_th = xpath_tr + "[1]/th"
    tr = len(driver.find_elements(By.XPATH, xpath_tr))
    th = len(driver.find_elements(By.XPATH, xpath_th))
    return tr, th


def get_table_header(driver, table_id, hdr_class):
    hdr = ""

    # Populate header
    tr, th = get_header_size(driver, table_id)
    #print("tr=" + str(tr) + " th=" + str(th))
    xpath1 = "//table[@id='" + table_id + "']/thead/tr["
    xpath2 = "/th["
    xpath3 = "]"

    for r in range(1, tr + 1):
        xpath_tr = xpath1 + str(r) + xpath3
        # Aside from overview and alarm_ph2, only parse data with class attribute and value that is same as hdr_class
        if hdr_class != "overview" and hdr_class != "alarm_ph2":
            tr_outer_html = driver.find_element(By.XPATH, xpath_tr).get_attribute("outerHTML")
            if tr_outer_html.find("class") == -1:   # class attribute not found
                continue
            else:
                tr_class = driver.find_element(By.XPATH, xpath_tr).get_attribute("class")
                if tr_class.find(hdr_class) == -1:  # class value is not same as hdr_class
                    continue

        # Update th
        th = len(driver.find_elements(By.XPATH, xpath_tr + "/th"))

        for h in range(1, th + 1):
            xpath = xpath_tr + xpath2 + str(h) + xpath3
            val = driver.find_element(By.XPATH, xpath).get_attribute("textContent")
            hdr += val + ","

    return hdr

def get_table_size(driver, tbody_id):
    xpath_row = "//tbody[@id='" + tbody_id + "']/tr"
    xpath_col = xpath_row + "[1]/td"
    row = len(driver.find_elements(By.XPATH, xpath_row))
    col = len(driver.find_elements(By.XPATH, xpath_col))
    return row, col
    
def get_table_data(driver, tbody_id, data_class):
    data = ""

    # Populate data
    row, col = get_table_size(driver, tbody_id)

    xpath1 = "//tbody[@id='" + tbody_id + "']/tr["
    xpath2 = "]/td["
    xpath3 = "]"

    for r in range(1, row + 1):
        xpath = xpath1 + str(r) + xpath3

        # If colspan attribute is found, skip the row and update col (if colspan > col)
        tr_outer_html = driver.find_element(By.XPATH, xpath).get_attribute("outerHTML")
        if tr_outer_html.find("colspan") > -1:
            text = 'colspan="'
            text_index = tr_outer_html.index(text)
            tr_colspan = int(tr_outer_html[text_index + len(text):text_index + len(text) + 1])
            if tr_colspan > col:
                col = tr_colspan
            continue

        # Aside from overview, only parse data with class that is same as data_class
        tr_class = driver.find_element(By.XPATH, xpath).get_attribute("class")
        if (tr_class.find(data_class) == -1) and (data_class != "overview"):
            continue
        for c in range(1, col + 1):
            xpath = xpath1 + str(r) + xpath2 + str(c) + xpath3
            val = driver.find_element(By.XPATH, xpath).get_attribute("textContent")
            val = val.replace("\n", "")
            val = val.replace(u"\u2103", "*C") # degree celsius
            val = val.strip()     
            data += val + ","

        data += "\n"

    return data


def enable_dhcp(driver):
    try:
        select_option(driver, "name", "dhcp", "1")
        time.sleep(2)
        click(driver, "name", "button_ipconf")
        time.sleep(3)
        press("enter")
    except:
        data = "FAIL"
    else:
       data = "PASS"
    return data
    
    
def set_parser():
    # Argument Parser
    parser = ArgumentParser()

    # Required
    parser.add_argument('-u', '--url', help='<Required> Set flag', required=True)
    parser.add_argument('-t', '--test', help='<Required> Set flag', required=True)

    # Optional
    parser.add_argument('-i', '--image', nargs='+', help='<Required> Set flag', required=False)
    parser.add_argument('-c', '--confidence', default=0.9, help='<Required> Set flag', required=False)
    parser.add_argument('-d', '--delay', default=10, help='<Required> Set flag', required=False);

    return parser.parse_args()


def set_config(path):
    # Config Parser  
    config = configparser.ConfigParser()

    # path = "C:/Emerson/SolaHD/SCM-E-MBUS/PCBA/TesterSpecific/Webscraper/Data/config.ini"
    config.read(path)
    
    ids, names, xpaths = [], [], []
    for key in config[args.test]:
        if "id" in key:
            ids.append(config[args.test][key])
        elif "name" in key:
            names.append(config[args.test][key])
        elif "xpath" in key:
            xpaths.append(config[args.test][key])
    
    return ids, names, xpaths


if __name__ == '__main__':

    args = set_parser()
    
    # Get config file path
    dir_name = os.path.dirname(__file__)
    ini_path = os.path.join(dir_name, '../Data/config.ini')
    
    # Get list of required visible data
    ids, names, xpaths = set_config(ini_path)

    # Selenium
    service = Service()
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--guest")
    options.add_experimental_option("useAutomationExtension", False)
    options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])

    # This is to suppress SSL certificate issue
    os.environ['WDM_SSL_VERIFY'] = '0'

    driver = webdriver.Chrome(service=service, options=options)
    driver.get(args.url)
    # driver.get("http://192.168.1.5/")
            
    match args.test:
        case "ratio":
            time.sleep(5)
            wait_until_present(driver, "id", "main-content")
            wait_until_all_visible(driver)
            hdr = ""
            data = match_image(args.image, args.confidence)
        case "overview":
            wait_until_visible(driver, "id", args.test)
            time.sleep(5)
            click(driver, "id", args.test)
            time.sleep(5)
            wait_until_present(driver, "id", "overview-table")
            wait_until_all_visible(driver)
            hdr = get_table_header(driver, "overview-table", "overview")
            data = get_table_data(driver, "tbody", args.test)
        case "livepara":
            wait_until_visible(driver, "id", args.test)
            time.sleep(5)
            click(driver, "id", args.test)
            time.sleep(5)
            wait_until_present(driver, "id", "paran-table")
            wait_until_all_visible(driver)
            hdr = get_table_header(driver, "paran-table", "header1")
            data = get_table_data(driver, "tbody", args.test)
        case "counts":
            wait_until_visible(driver, "id", args.test)
            time.sleep(5)
            click(driver, "id", args.test)
            time.sleep(5)
            wait_until_present(driver, "id", "paran-table")
            wait_until_all_visible(driver)
            hdr = get_table_header(driver, "paran-table", "header3")
            data = get_table_data(driver, "tbody", "count")
        case "maxvalue":
            wait_until_visible(driver, "id", args.test)
            time.sleep(5)
            click(driver, "id", args.test)
            time.sleep(5)
            wait_until_present(driver, "id", "paran-table")
            wait_until_all_visible(driver)
            hdr = get_table_header(driver, "paran-table", "header2")
            data = get_table_data(driver, "tbody", "maxvalue")
        case "alarm_ph2":
            wait_until_visible(driver, "id", args.test)
            time.sleep(5)
            click(driver, "id", args.test)
            time.sleep(5)
            wait_until_present(driver, "id", "alarm_ph2-table")
            wait_until_all_visible(driver)
            hdr = get_table_header(driver, "alarm_ph2-table", "alarm_ph2")
            data = get_table_data(driver, "tbody", "row")
        case "nwconfig":
            wait_until_visible(driver, "id", args.test)
            time.sleep(5)
            click(driver, "id", args.test)
            time.sleep(5)
            wait_until_present(driver, "id", "ipconf")
            wait_until_all_visible(driver)
            hdr = ""
            data = enable_dhcp(driver)
        case _:
            hdr = ""
            data = ""
            print("Invalid test.")

    print(hdr)
    print(data)

    driver.quit()
