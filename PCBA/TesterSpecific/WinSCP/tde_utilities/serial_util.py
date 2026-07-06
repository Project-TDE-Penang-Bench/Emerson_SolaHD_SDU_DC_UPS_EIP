import serial
import logging
import time
from serial.tools import list_ports
import re


class SerialDevice:
    def __init__(self, known_devices, baudrate=115200):
        self.known_devices = known_devices
        self.baudrate = baudrate
        self.full_buffer = ""
        self.ser = None
        self.last_activity_time = 0
        self.nudge_interval = 60

    def __enter__(self):
        """Logic for the 'with' statement start."""
        port = self._get_port()
        if not port:
            logging.error('No compatible device found')
            raise serial.SerialException("No compatible device found.")
        self.ser = serial.Serial(port, self.baudrate, timeout=0.1)
        logging.info(f"Connected to {port} at {self.baudrate}")
        return self # This is what 'as device' receives

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Logic for the 'with' statement end (Cleanup)."""
        if self.ser and self.ser.is_open:
            self.ser.close()
            logging.info("Serial connection safely closed.")

    def _get_port(self):
        """Internal helper to find hardware."""
        for p in list_ports.comports():
            if [p.vid, p.pid] in self.known_devices:
                return p.device
        return None

    def _clear_all_buffers(self):
        """Wipes both Python and Hardware buffers."""
        self.full_buffer = ""
        if self.ser and self.ser.is_open:
            self.ser.reset_input_buffer()
            self.ser.reset_output_buffer()

    def _read_into_buffer(self):
        """Reads data and returns True if new data arrived."""
        if self.ser and self.ser.in_waiting > 0:
            new_data = self.ser.read(self.ser.in_waiting).decode('utf-8', errors='ignore')
            # logging.debug(f"Raw RX: {repr(new_data)}") 
            self.full_buffer += new_data
            self.last_activity_time = time.time()
            return True
        elif (time.time() - self.last_activity_time) > self.nudge_interval:
            logging.debug("silence detected, nudging...")
            # \x15 is Ctrl+U (kills current line), \r is Enter
            self.write(b"\x15\r") 
            self.last_activity_time = time.time()
        return False
    
    def _clean_up_buffer(self, keyword):
        # Check if the user passed a compiled regex object (e.g., re.compile(r"root@*?>", re.IGNORECASE))
        is_regex = isinstance(keyword, re.Pattern)
        
        if is_regex:
            matches = list(keyword.finditer(self.full_buffer))
            if not matches:
                return None
            end_index = matches[-1].end()
            pre_match = self.full_buffer[:end_index]
            self.full_buffer = self.full_buffer[end_index:]
            log_pattern = keyword.pattern
        else:
            if keyword not in self.full_buffer:
                return None
            parts = self.full_buffer.rsplit(keyword, 1)
            pre_match = parts[0] + keyword
            self.full_buffer = parts[-1]
            log_pattern = keyword

        logging.info(f"Buffer message ({log_pattern}):\n" + "\n".join(pre_match.splitlines()))
        return pre_match

    def write(self, command):
        """Helper to handle encoding and logging."""
        if self.ser and self.ser.is_open:
            if isinstance(command, bytes):
                self.ser.write(command)
            else:
                self.ser.write(f"{command}\r".encode('utf-8'))
            self.last_activity_time = time.time()

    def wait(self, keyword, timeout=10):
        start_time = time.time()
        while (time.time() - start_time) < timeout:
            if self._read_into_buffer():
                output = self._clean_up_buffer(keyword)
                if output is not None:
                    return output
            if "---(more" in self.full_buffer:
                logging.info('pagination detected, requesting next page')
                # regex matches: ---(more [anything inside] )---
                # re.sub replaces the matched UI junk with a single space or newline
                self.full_buffer = re.sub(r'---\(more.*?\)?---', '\n', self.full_buffer)
                self.write(b"\r")
            time.sleep(.1)
        else:
            logging.info(f'timed-out wating for {keyword}, full_buffer:\n' + "\n".join(self.full_buffer.splitlines()))
        return None
        
    def send_and_wait(self, command, keyword="Main", timeout=1, allow_fail=False):
        """
        Sends a command and returns the full output once the keyword reappears.
        """
        logging.info(f"Executing: {command}")
        self._clear_all_buffers()
        self.write(command)
        output = self.wait(keyword, timeout)
        if output is not None:
            return output
        if allow_fail:
            return False
        raise serial.SerialException(f"Command '{command}' timed out waiting for keyword '{keyword}'")
