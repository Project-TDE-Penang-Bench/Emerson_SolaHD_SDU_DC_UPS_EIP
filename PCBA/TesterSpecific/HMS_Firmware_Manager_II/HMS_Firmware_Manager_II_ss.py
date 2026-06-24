import os
import logging
import time 
import numpy as np
import pyautogui
import asyncio

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.win_util import WindowApp
from tde_utilities.ocr_util import ocr_screen

def click_text_by_ocr(keyword, x_offset=10, y_offset=0, debug_path=None):
    """
    Finds text on screen using OCR and clicks it.

    Args:
        keyword (str): Text to search for
        x_offset (int): Pixels to shift horizontally before click
        y_offset (int): Pixels to shift vertically before click
        debug_path (str): Optional debug image path

    Returns:
        tuple: (x, y) clicked coordinates
    """

    result = asyncio.run(
        ocr_screen(keyword=keyword, debug_path=debug_path))

    print(result)

    if not result:
        raise Exception(f"OCR could not find '{keyword}' on screen")

    # Extract coordinates
    if isinstance(result, dict) and "coordinates" in result:
        base_x, base_y = result["coordinates"]
    elif isinstance(result, (list, tuple)):
        base_x, base_y = result
    else:
        raise Exception("Invalid OCR result format")

    click_x = int(base_x + x_offset)
    click_y = int(base_y + y_offset)

    pyautogui.click(x=click_x, y=click_y)
    print(f"Clicked '{keyword}' at: ({click_x}, {click_y})")

    return click_x, click_y


# Setup logger
script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir)

# Application path and window title
path = r"C:\PROGRA~2\HMS\Firmware Manager II\Firmware Manager II.exe"
title = "Firmware Manager II"

# Start process
t1 = time.time()
logging.info("Begin: Static IP Set-up via HMS IPConfig")

with WindowApp(path, title) as ui:
    # Ensure window is ready
    time.sleep(1.5)

    click_text_by_ocr(
        keyword="Update Module", x_offset=130, debug_path=r'C:\Emerson\SolaHD\SDU-DC-UPS-EIP\PCBA\TesterSpecific\HMS_Firmware_Manager_II\debug')
