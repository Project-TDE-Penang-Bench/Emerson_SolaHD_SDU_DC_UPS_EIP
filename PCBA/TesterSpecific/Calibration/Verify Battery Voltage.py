import time
import os
import logging
import re
import serial.tools.list_ports

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.serial_util import SerialDevice

script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir)

# FIX ANSI removal (regex was broken by HTML tags)
def remove_ansi(text):
    return re.sub(r'\x1b\[[0-9;]*m', '', text)

# Extract only required output
def extract_voltage(text):
    match = re.search(r'Battery Voltage Actual:\s*\d+', text)
    if match:
        return match.group(0)
    return None

def find_usb_serial_port():
    ports = serial.tools.list_ports.comports()
    
    for port in ports:
        if "USB SERIAL PORT" in str(port.description).upper():
            return port.device
            
    return None

try:
    # 1. Scan port
    detected_port = find_usb_serial_port()
    
    if detected_port is None:
        raise Exception("No active serial ports found with the description 'USB Serial Port'.")
        
    print(f"Auto-scan completed! Target selected: {detected_port}")
                                     
    # 2. Init device
    device_instance = SerialDevice(known_devices=[], baudrate=115200)
    
    # 3. Override port
    device_instance._get_port = lambda: detected_port

    # 4. Communicate
    with device_instance as device:
        output = device.send_and_wait("17")
        
        # Clean ANSI
        clean_output = remove_ansi(output)

        # Extract ONLY required line
        result = extract_voltage(clean_output)

        if result:
            print(result)   # ONLY THIS LINE OUTPUT
        else:
            print("ERROR: Voltage value not found")

except Exception as e:
    print("ERROR: calibration failed")
    logging.exception("Calibration failed")