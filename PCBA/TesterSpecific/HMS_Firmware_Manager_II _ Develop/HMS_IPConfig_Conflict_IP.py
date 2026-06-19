import os
import logging
import time 

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.win_util import WindowApp


script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir)

path = r"C:\PROGRA~2\HMS\IPconfig\Hms.IPConfig.exe"
title = "HMS IPconfig"

try:
    t1 = time.time()
    logging.info("begin: Check for default IP and DHCP")
    with WindowApp(path, title) as ui:
        # open device configuration
        ui.find("SDU_20-24BC-EIP").click_input()
        dhcp_toggle = ui.find("Retrieve IP")
        if dhcp_toggle.get_toggle_state():
            logging.info("unchecking DHCP")
            dhcp_toggle.click_input()
        ip_field = ui.find("IP address", xy_ratio=(0, 1.5))
        # replace ip address
        ip_field.click_input()
        ip_field.type_keys("^a{BACKSPACE}192.168.1.2")
        logging.info("overwritting IP")
        # replace subnet mask
        sub_mask_field = ui.find("Subnet mask", xy_ratio=(0, 1.5))
        sub_mask_field.click_input()
        sub_mask_field.type_keys("^a{BACKSPACE}255.255.255.0")
        logging.info("overwritting subnet mask")
        # click apply
        ui.find("Apply").click_input()
        # check for setup successfully keyword
        ui.find("Success:")
    print("SUCCESS: Static IP Set-up Succssfully to 192.168.1.2")
    logging.info(f"end: Static IP Set-up via HMS IPConfig, took {time.time()-t1:.2f}s")
except Exception as e:
    print(f"ERROR: Check for default IP and DHCP failed: {e}")
    logging.exception("Check for default IP and DHCP failed")
