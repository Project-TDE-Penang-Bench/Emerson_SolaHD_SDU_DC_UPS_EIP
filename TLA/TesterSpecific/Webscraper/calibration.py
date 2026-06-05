import time
import os
import logging

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.serial_util import SerialDevice


script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir)

try:
    with SerialDevice(known_devices=[[0x0403, 0x6001]],  # FTDI FT232
                      baudrate=115200) as device:
        output = device.send_and_wait("50")
        

except Exception as e:
    print("ERROR: calibration failed")
    logging.exception("Calibration failed")
