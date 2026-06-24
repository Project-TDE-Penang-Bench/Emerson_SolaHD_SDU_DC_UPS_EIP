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

def find_and_test_usb_ports():
    all_ports = serial.tools.list_ports.comports()
    
    # Filter list to only include actual USB Serial Ports
    usb_ports = [p for p in all_ports if "USB SERIAL PORT" in str(p.description).upper()]
    
    for port in usb_ports:
        detected_port = port.device
        
        try:
            # Init device for the current port
            device_instance = SerialDevice(known_devices=[], baudrate=115200)
            device_instance._get_port = lambda: detected_port

            # Attempt communication block
            with device_instance as device:
                output = device.send_and_wait("17")
                clean_output = remove_ansi(output)
                
                # Verify if this port is the correct device by validating response data
                result = extract_voltage(clean_output)
                if result:
                    # Print the exact COM port that was successfully chosen
                    print(f"Connected Port: {detected_port}")
                    return result  
                    
        except Exception:
            # Silently skip bad/busy ports to keep the console clean
            continue
            
    return None

try:
    # 1. Active scan and test only matching USB ports
    final_result = find_and_test_usb_ports()
    
    if final_result:
        print(final_result)   # Prints the output from the UUT for TestStand to capture
    else:
        print("ERROR: No response on any USB Serial Ports")
        raise Exception("Device calibration handshake failed on all system USB ports.")

except Exception as e:
    print("ERROR: calibration failed")
    logging.exception("Calibration failed")