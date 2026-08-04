import os
import logging
import time 
import re
import pyautogui
import pywinauto.mouse as mouse  # <-- Imported for mouse movement

from tde_utilities.log_util import setup_custom_logger
from tde_utilities.win_util import WindowApp
from tde_utilities.ocr_util import OcrUtil
from tde_utilities.state_util import load_params


class CustomWorkflow:
    def __init__(self, app_path, script_path):
        self.app_path = app_path
        self.script_path = script_path
        self.ocr =  OcrUtil(script_path=script_path)
        self.params = load_params(rf"{script_path}\configs\params.toml")

    def move_mouse_away(self, coords=(0, 0)):
        """Moves the mouse cursor to a safe space to avoid hovering artifacts."""
        try:
            mouse.move(coords=coords)
            time.sleep(0.5)  # Brief pause to let the UI register the move
        except Exception as e:
            logging.warning(f"Failed to move mouse away: {e}")

    def run(self):
        with WindowApp(self.app_path) as ui:
            self.ui = ui
            self.ui.ensure_active_and_front()
            self.move_mouse_away()

            # Step 1: Scan for SDU
            self.navigate_to_change_network_type()
            self.scan_for_devices()

            # Step 2: Check if login needed to UUT and perform if needed
            self.login_to_uut_if_needed()

            # Step 3: Check if network change needed and perform if needed
            if self.check_change_network_needed():
                self.perform_change_network()
                self.is_change_network_type_done()
            
            #Step 4: Perform firmware update
            if self.check_update_needed():
                self.navigate_to_automatic_firmware_update()
                self.scan_for_devices()
                self.perform_firmware_update()
                if self.is_firmware_update_done():
                    return

    def scan_for_devices(self):
        self.ui.ensure_active_and_front()
        
        # Path to your template image
        scan_img_path = r"C:\Emerson\SolaHD\SDU-DC-UPS-EIP-2024B\PCBA\TesterSpecific\HMS_Firmware_Manager_II\Picture\scan.png"
        
        print("Looking for 'Scan' button on screen...")
        try:
            # Locate the center of the image on the screen
            # confidence=0.9 requires the 'opencv-python' package installed
            scan_location = pyautogui.locateCenterOnScreen(scan_img_path, confidence=0.9)
            
            if scan_location is None:
                raise Exception("Could not find the 'Scan' button image on screen.")
                
            # Unpack the screen coordinates
            screen_x, screen_y = scan_location
            
            # Click the button using your UI framework's coordinate method
            self.ui.find_by_coord(coord=(screen_x, screen_y)).click_input()
            
        except Exception as e:
            raise Exception(f"Failed to locate or click the Scan button: {e}")

        # Keep your existing OCR check for "SDU", or replace if you have an image for that too
        if not self.ocr.locate("SDU", self.ui.get_windows_region(), timeout=5):
            raise Exception("Module detection failed")
            
        print("MODULE DETECTION PASS")

    def navigate_to_change_network_type(self):
        self.ui.ensure_active_and_front()
        self.ui.shortcut("%F")
        self.ui.shortcut("C")

    def login_to_uut_if_needed(self):
        rel_coord = self.ocr.locate("Login", self.ui.get_windows_region())
        if rel_coord:
            self.ui.find_by_coord(coord=rel_coord).click_input()
            rel_coord = self.ocr.locate("Username", self.ui.get_windows_region())
            self.ui.find_by_coord(rel_coord, xy_ratio=(0, 1.5)).type_keys('SolaHD')
            rel_coord = self.ocr.locate("Password", self.ui.get_windows_region())
            self.ui.find_by_coord(rel_coord, xy_ratio=(0, 1.5)).type_keys('r00t_sola')
            # Somehow OCR cannot find Ok, use Cancel to press Ok
            rel_coord = self.ocr.locate("Cancel", self.ui.get_windows_region())
            self.ui.find_by_coord(rel_coord, xy_ratio=(-1, 0), script_path=self.script_path).click_input()
            time.sleep(5)

    def check_change_network_needed(self):
        rel_coords = self.ocr.locate_all("EtherNet/IP")
        if len(rel_coords) != 2:
            logging.info('Attempt to change network type')
            return True
        logging.info("Network change not needed")
        return False
        
    def perform_change_network(self):
        self.ui.find("File",xy_ratio=(0,3.5), script_path=self.script_path).click_input()
        # Use OCR because locator name not available
        rel_coord = self.ocr.locate("Change", self.ui.get_windows_region())
        self.ui.find_by_coord(coord=rel_coord).click_input()
        self.ocr.locate("Change", self.ui.get_windows_region())
        self.ui.find("Yes").click_input()

    def is_change_network_type_done(self):
        self.ui.find("Finished", timeout=300)
        self.ui.find('Close').click_input()
        print("NETWORK TYPE CHANGED")
        return True

    def navigate_to_automatic_firmware_update(self):
        self.ui.ensure_active_and_front()
        self.ui.shortcut("%F")
        self.ui.shortcut("A")

    def check_update_needed(self):
        print(f"Target build version from params: {self.params['build_version']}")
        
        # Define image paths
        available_img = r"C:\Emerson\SolaHD\SDU-DC-UPS-EIP\PCBA\TesterSpecific\HMS_Firmware_Manager_II\Picture\available_firmware.png"
        current_img = r"C:\Emerson\SolaHD\SDU-DC-UPS-EIP\PCBA\TesterSpecific\HMS_Firmware_Manager_II\Picture\current_firmware.png"
        
        try:
            # Locate all instances of both images on the screen
            # Note: list() is used because locateAllOnScreen returns a generator
            available_matches = list(pyautogui.locateAllOnScreen(available_img, confidence=0.9))
            current_matches = list(pyautogui.locateAllOnScreen(current_img, confidence=0.9))
            
            logging.info(f"Found {len(available_matches)} available firmware markers and {len(current_matches)} current firmware markers.")
            
            # Check condition: Update is needed if both markers are present on screen
            if len(available_matches) > 0 and len(current_matches) > 0:
                logging.info('Attempt to update firmware: Version mismatch detected via images.')
                return True
                
        except Exception as e:
            logging.error(f"Error during PyAutoGUI screen matching: {e}")
            
        print ("EIP FW IS LATEST, NO UPDATE REQUIRED. \nPASS")
        return False
    
    def perform_firmware_update(self):
        self.ui.find("File",xy_ratio=(0,3.5), script_path=self.script_path).click_input()
        # Use OCR because locator name not available
        rel_coord = self.ocr.locate("Update", self.ui.get_windows_region())
        self.ui.find_by_coord(coord=rel_coord).click_input()
        self.ocr.locate("firmware?", self.ui.get_windows_region())
        self.ui.find("Yes").click_input()

    import os

    def is_firmware_update_done(self):
        self.ui.find("Finished", timeout=300)
        self.ui.find('Close').click_input()
        
        # Retrieve configuration parameters
        folder_path = self.params.get("log_path")
        expected_version = str(self.params.get("build_version"))
        
        if folder_path and os.path.exists(folder_path):
            # 1. Identify the latest file in the directory using only 'os'
            try:
                files = [os.path.join(folder_path, f) for f in os.listdir(folder_path)]
                files = [f for f in files if os.path.isfile(f)]
                
                if files:
                    latest_log = max(files, key=os.path.getmtime)
                    
                    # 2. Read and strip content from the latest file
                    with open(latest_log, 'r', errors='ignore') as f:
                        log_content = f.read().strip()
                        print (log_content)
                    
                    # 3. Clean up: Delete the file right after reading it
                    os.remove(latest_log)
                    
                    # 4. Exact match version check
                    if expected_version in log_content:
                        print("UUT FIRMWARE IS LATEST. NO UPDATE REQUIRED. \nPASS")
                        return True
            except Exception as e:
                print(f"Error handling files: {e}")

        print("FAIL: Firmware version mismatch or log file missing.")
        return False

def main():
    script_path = os.path.dirname(os.path.abspath(__file__))
    setup_custom_logger(script_path,
                        disabled_loggers=["PIL",
                                          "asyncio"])
    path = r"C:\PROGRA~2\HMS\Firmware Manager II\Firmware Manager II.exe"
    try:
        t1 = time.time()
        logging.info("begin HMS FIRMWARE MANAGER CONVERT")
        workflow = CustomWorkflow(path, script_path)
        workflow.run()
        logging.info(f"end HMS FIRMWARE MANAGER CONVERT, took{t1-time.time():.2f}s")
    except Exception as e:
        print(f"HMS_MANAGER_CONVERT FAIL: {e}")
        logging.exception("HMS_MANAGER_CONVERT FAIL")

if __name__ == "__main__":
    main()
