import os
import logging
import time 
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
        self.ocr = OcrUtil(script_path=script_path)
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
            # self.ui.ensure_active_and_front()
            self.move_mouse_away()

            # Step 1: Scan for SDU
            self.navigate_to_change_network_type()
            self.scan_for_devices()
        
    def scan_for_devices(self):
        self.ui.ensure_active_and_front()
        
        # Path to your template image
        scan_img_path = os.path.join(os.path.dirname(__file__), "Picture", "scan.png")
        
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
            
            self.move_mouse_away()  # <-- Move mouse away after finishing the login form
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
        self.move_mouse_away()  # <-- Move mouse away

    def is_change_network_type_done(self):
        self.ui.find("Finished", timeout=300)
        self.ui.find('Close').click_input()
        self.move_mouse_away()  # <-- Move mouse away
        print("NETWORK TYPE CHANGED")
        return True

    def navigate_to_automatic_firmware_update(self):
        self.ui.ensure_active_and_front()
        self.ui.shortcut("%F")
        self.ui.shortcut("A")

    def check_update_needed(self):
        print(self.params['build_version'])
        rel_coords = self.ocr.locate_all(self.params["build_version"])
        if len(rel_coords) == 2:
            logging.info('attempt to update firmware')
            return True
        logging.info("no need to update firmware")
        return False
    
    def perform_firmware_update(self):
        self.ui.find("File",xy_ratio=(0,3.5), script_path=self.script_path).click_input()
        # Use OCR because locator name not available
        rel_coord = self.ocr.locate("Update", self.ui.get_windows_region())
        self.ui.find_by_coord(coord=rel_coord).click_input()
        self.ocr.locate("firmware?", self.ui.get_windows_region())
        self.ui.find("Yes").click_input()
        self.move_mouse_away()  # <-- Move mouse away

    def is_firmware_update_done(self):
        self.ui.find("Finished", timeout=300)
        self.ui.find('Close').click_input()
        self.move_mouse_away()  # <-- Move mouse away
        print("UUT FIRMWARE IS LATEST. NO UPDATE REQUIRED")
        print("PASS")
        return True

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