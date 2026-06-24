import os
import logging
import time 

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

    def run(self):
        with WindowApp(self.app_path) as ui:
            self.ui = ui
            self.ui.ensure_active_and_front()

            # Step 1: Scan for SDU
            self.navigate_to_change_network_type()
            self.scan_for_devices()
        
    def scan_for_devices(self):
        self.ui.ensure_active_and_front()
        # Use OCR because locator name not available
        rel_coord = self.ocr.locate("Scan", self.ui.get_windows_region())
        self.ui.find_by_coord(coord=rel_coord).click_input()
        if not self.ocr.locate("SDU", self.ui.get_windows_region(), timeout=5):
            raise Exception("MODULE DETECTION FAIL")
        print("MODULE DETECTION PASS")
        print("HMS_MANAGER_TOOL_SCAN PASS")

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

    def is_firmware_update_done(self):
        self.ui.find("Finished", timeout=300)
        self.ui.find('Close').click_input()
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
