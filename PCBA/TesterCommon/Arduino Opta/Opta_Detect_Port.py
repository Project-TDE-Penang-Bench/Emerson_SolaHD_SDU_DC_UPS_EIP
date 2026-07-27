import configparser
import os
import sys
import serial.tools.list_ports

# Configuration file location (in the same directory as this script)
CONFIG_FILE = os.path.join(os.path.dirname(__file__), "config.ini")


def find_opta_com_port():
    """Scans available COM ports specifically for an Arduino Opta device."""
    try:
        ports = serial.tools.list_ports.comports()
        for p in ports:
            port_info = f"{p.description} {p.manufacturer}".lower()
            if "opta" in port_info or "arduino" in port_info or p.vid == 0x2341:
                return p.device
    except Exception as e:
        print(f"[ERROR] Exception during port scan: {e}", flush=True)
    return None


def save_com_port_to_ini(com_port):
    """Saves the detected COM port into config.ini."""
    config = configparser.ConfigParser()
    config["SETTINGS"] = {"com_port": com_port}

    try:
        with open(CONFIG_FILE, "w") as configfile:
            config.write(configfile)
        print(f"[SUCCESS] Saved '{com_port}' to {CONFIG_FILE}", flush=True)
        return True
    except Exception as e:
        print(f"[ERROR] Failed to write config.ini: {e}", flush=True)
        return False


def main():
    print("[INFO] Scanning for Arduino Opta...", flush=True)
    com_port = find_opta_com_port()

    if com_port:
        print(f"[INFO] Arduino Opta detected on port: {com_port}", flush=True)
        if save_com_port_to_ini(com_port):
            sys.exit(0)  # Success exit code
        else:
            sys.exit(1)
    else:
        print(
            "[ERROR] Could not detect Arduino Opta. Make sure it is connected.",
            flush=True,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()