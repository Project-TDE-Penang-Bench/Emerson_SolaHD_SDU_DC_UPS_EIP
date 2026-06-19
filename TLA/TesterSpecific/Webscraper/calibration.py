import time
import os
import logging
import serial.tools.list_ports

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.serial_util import SerialDevice

script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir)

def find_usb_serial_port():
    """Scans for any active port explicitly named 'USB Serial Port'."""
    ports = serial.tools.list_ports.comports()
    
    for port in ports:
        # Check the description field (e.g., "USB Serial Port (COM11)")
        if "USB SERIAL PORT" in str(port.description).upper():
            return port.device  # Returns "COM11", etc.
            
    return None

try:
    # 1. Dynamically scan for a generic USB Serial Port
    detected_port = find_usb_serial_port()
    
    if detected_port is None:
        raise Exception("No active serial ports found with the description 'USB Serial Port'.")
        
    print(f"Auto-scan success! Target selected: {detected_port}")
                                     
    # 2. Initialize the device wrapper normally
    device_instance = SerialDevice(known_devices=[], baudrate=115200)
    
    # 3. Dynamic Override via your working lambda hack
    device_instance._get_port = lambda: detected_port

    # 4. Use the context manager with our modified instance
    with device_instance as device:
        output = device.send_and_wait("16")
        print(output)
        
except Exception as e:
    print("ERROR: calibration failed")
    logging.exception("Calibration failed")