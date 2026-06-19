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
        ip_address = ui.find("IP address", xy_ratio=(0, 1.5), debug_img_path=script_dir+r"\debug\a.png").window_text()
        dhcp_state = ui.find("Retrieve IP").get_toggle_state()
        logging.info(f"{ip_address=}, {dhcp_state=}")
    if (ip_address == '0.0.0.0' and dhcp_state):
        print("VERIFY_DHCP_ENABLED_SUCCESS")
    else:
        if ip_address != '0.0.0.0':
            print("IP is not 0.0.0.0")
        if not dhcp_state:
            print("DHCP is not Enabled")
    # print("SUCCESS: Static IP Set-up Succssfully")
    logging.info(f"end: Static IP Set-up via HMS IPConfig, took {time.time()-t1:.2f}s")
except Exception as e:
    print(f"ERROR: Check for default IP and DHCP failed: {e}")
    logging.exception("Check for default IP and DHCP failed")
