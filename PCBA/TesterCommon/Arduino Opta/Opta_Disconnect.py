import configparser
import os
import serial
import sys
import time

CONFIG_FILE = os.path.join(os.path.dirname(__file__), "config.ini")
BAUD_RATE = 115200


def read_com_port_from_ini():
    """Reads the COM port stored in config.ini."""
    if not os.path.exists(CONFIG_FILE):
        print(f"[ERROR] Config file '{CONFIG_FILE}' not found!", flush=True)
        return None

    config = configparser.ConfigParser()
    try:
        config.read(CONFIG_FILE)
        return config.get("SETTINGS", "com_port", fallback=None)
    except Exception as e:
        print(f"[ERROR] Failed to read config.ini: {e}", flush=True)
        return None


def main():
    com_port = read_com_port_from_ini()
    if not com_port:
        sys.exit(1)

    print(f"[INFO] Disconnecting and resetting Opta on {com_port}...", flush=True)

    try:
        ser = serial.Serial()
        ser.port = com_port
        ser.baudrate = BAUD_RATE
        ser.timeout = 0.5
        ser.write_timeout = 0.5
        ser.dsrdtr = False
        ser.rtscts = False

        ser.open()

        # Send RESET command ('Z') to turn off all outputs
        ser.write(b"Z\n")
        ser.flush()
        time.sleep(0.1)

        # Clear buffers and close port handle
        ser.reset_input_buffer()
        ser.reset_output_buffer()
        ser.close()

        print("[SUCCESS] Sent RESET command and safely closed port.", flush=True)
        sys.exit(0)

    except Exception as e:
        print(f"[ERROR] Failed to disconnect port {com_port}: {e}", flush=True)
        sys.exit(1)


if __name__ == "__main__":
    main()