import time
import os
import logging
import re
import serial.tools.list_ports

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.serial_util import SerialDevice

script_dir = os.path.dirname(os.path.abspath(__file__))
setup_custom_logger(script_dir)

def remove_ansi(text):
    return re.sub(r'\x1b\[[0-9;]*m', '', text)

def scan_port_for_main(detected_port, timeout=20):
    """
    Scans a specific port for up to `timeout` seconds.
    Sends an 'Enter' key and checks if 'Main' appears in the response.
    """
    try:
        device_instance = SerialDevice(known_devices=[], baudrate=115200)
        device_instance._get_port = lambda: detected_port

        with device_instance as device:
            
            start_time = time.time()
            # Send an initial 'Enter' to wake up/prompt the terminal
            device.send_and_wait("\r\n") 
            
            # Keep reading and checking until 20 seconds have passed
            while time.time() - start_time < timeout:
                # Adjust this read method based on what SerialDevice provides 
                # (e.g., device.read(), device.readline(), or sending Enter repeatedly)
                output = device.send_and_wait("\r\n") 
                clean_output = remove_ansi(output)
                
                if "Main" in clean_output:
                    print(f"Connected Port: {detected_port}")
                    return True
                
                time.sleep(0.5) # Small delay to prevent slamming the CPU
                
    except Exception:
        # Silently skip bad/busy ports
        pass
        
    return False

def find_and_test_usb_ports():
    all_ports = serial.tools.list_ports.comports()
    
    # Filter list to only include actual USB Serial Ports
    usb_ports = [p for p in all_ports if "USB SERIAL PORT" in str(p.description).upper()]
    
    for port in usb_ports:
        detected_port = port.device
        # If "Main" is found, we can stop scanning other ports and return success
        if scan_port_for_main(detected_port, timeout=20):
            return "SUCCESS"
            
    return None

try:
    # Active scan and test matching USB ports
    final_result = find_and_test_usb_ports()
    
    if final_result == "SUCCESS":
        print("SUCCESS: Serial Port Ready!")   # TestStand captures this exact string
    else:
        print("ERROR: No USB Serial Ports or Serial Port is Not Ready!")
        raise Exception("Device calibration handshake failed on all system USB ports.")

except Exception as e:
    print("ERROR: calibration failed")
    logging.exception("Calibration failed")