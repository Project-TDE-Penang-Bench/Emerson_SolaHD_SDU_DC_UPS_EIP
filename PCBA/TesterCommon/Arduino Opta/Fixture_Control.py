import configparser
import os
import serial
import sys
import time

CONFIG_FILE = os.path.join(os.path.dirname(__file__), "config.ini")
COMMAND_TIMEOUT = 0.5
BAUD_RATE = 115200

COMMAND_MAP = {
    "MAIN_VALVE_EN ON": "1",
    "MAIN_VALVE_EN OFF": "0",
    "VALVE1_EN ON": "2",
    "VALVE1_EN OFF": "3",
    "VALVE2_EN ON": "4",
    "VALVE2_EN OFF": "5",
    "VALVE3_EN ON": "6",
    "VALVE3_EN OFF": "7",
    "VALVE4_EN ON": "8",
    "VALVE4_EN OFF": "9",
    "VALVE5_EN ON": "A",
    "VALVE5_EN OFF": "B",
    "FIX_POWER_EN ON": "C",
    "FIX_POWER_EN OFF": "D",
    "SPARE1 ON": "E",
    "SPARE1 OFF": "F",
    "SPARE2 ON": "G",
    "SPARE2 OFF": "H",
    "SPARE3 ON": "I",
    "SPARE3 OFF": "J",
    "SPARE4 ON": "K",
    "SPARE4 OFF": "L",
    "SPARE5 ON": "M",
    "SPARE5 OFF": "N",
    "QUERY STATUS": "Q",
    "RESET": "Z",
}


def read_com_port_from_ini():
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


def open_serial_port(com_port):
    try:
        ser = serial.Serial()
        ser.port = com_port
        ser.baudrate = BAUD_RATE
        ser.timeout = 0.2
        ser.write_timeout = 0.2

        ser.open()

        # Modern Opta CDC stack setup:
        ser.dtr = True
        ser.rts = True
        time.sleep(0.1)  # Let CDC enumerate

        return ser
    except Exception as e:
        print(f"[ERROR] Could not open {com_port}: {e}", flush=True)
        return None


def send_command(ser, char_code):
    try:
        # Clear out any stale hardware bytes before sending
        ser.reset_input_buffer()
        ser.reset_output_buffer()

        # Send byte command + carriage return / newline
        payload = f"{char_code}\r\n".encode()
        print(f"[DEBUG] Sending bytes: {payload}", flush=True)

        ser.write(payload)
        ser.flush()

        start_time = time.monotonic()
        received_data = ""

        while (time.monotonic() - start_time) < COMMAND_TIMEOUT:
            if ser.in_waiting > 0:
                chunk = ser.read(ser.in_waiting).decode(errors="ignore")
                received_data += chunk
                if "\n" in received_data or "\r" in received_data:
                    break
            time.sleep(0.005)

        resp = received_data.strip()
        print(f"[DEBUG] Raw response from Opta: '{resp}'", flush=True)

        if resp:
            return True, resp
        return (
            False,
            "No response from Arduino. Check sketch line-endings (e.g. Serial.readStringUntil('\\n')).",
        )

    except serial.SerialException as e:
        return False, f"Serial Error: {e}"


def main():
    if len(sys.argv) < 2:
        print(
            '[ERROR] Usage: python Fixture_Control.py "<COMMAND>"', flush=True
        )
        sys.exit(1)

    cmd = " ".join(sys.argv[1:]).strip().upper()

    if cmd not in COMMAND_MAP:
        print(f"[ERROR] Invalid command: '{cmd}'", flush=True)
        sys.exit(1)

    com_port = read_com_port_from_ini()
    if not com_port:
        sys.exit(1)

    ser = open_serial_port(com_port)
    if not ser:
        sys.exit(1)

    success = False
    try:
        char_code = COMMAND_MAP[cmd]
        success, message = send_command(ser, char_code)
        print(f"[RESULT] {message}", flush=True)

    finally:
        # SAFE PORT CLOSING MECHANISM:
        if ser and ser.is_open:
            try:
                # Cancel pending OS read/write operations to prevent CloseHandle freeze
                ser.cancel_read()
                ser.cancel_write()
                ser.close()
            except Exception:
                pass

    # Exit cleanly AFTER the finally block has safely closed the handle
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()