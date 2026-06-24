from pywinauto.application import Application
from pywinauto.controls.win32_controls import ButtonWrapper
from io import StringIO
import sys
import re
import time
import pyautogui


def click_target(str):
    if pyautogui.locateOnScreen(str, confidence=0.8) != None:
        x,y = pyautogui.locateCenterOnScreen(str, confidence=0.8)
        pyautogui.click(x,y)
        time.sleep(0.5)

def is_module_detected():
    print("is_module_detected")
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1")
    return (pyautogui.locateOnScreen('./Picture/available_network_latest.png', confidence=0.9) != None) or (pyautogui.locateOnScreen('./Picture/current_network_latest.png', confidence=0.9) != None) or (pyautogui.locateOnScreen('./Picture/module_detected_post_bfu_network_changed.png', confidence=0.9) != None) or (pyautogui.locateOnScreen('./Picture/module_detected_post_bfu_ip_reset.png', confidence=0.9) != None)

try:
    app = Application(backend='uia').start('C:\PROGRA~2\HMS\FIRMWA~1\FIRMWA~1.EXE')
    app = Application(backend='uia').connect(title='Firmware Manager II', timeout=10)
    click_target('./Picture/scan.png')
    print("Scanning...")
    time.sleep(3)
    if not(is_module_detected()):
        print("MODULE DETECTION FAIL")
    else:
        print("MODULE DETECTION PASS")
    print("HMS_MANAGER_TOOL_SCAN PASS")

except:
    print("HMS_MANAGER_TOOL_SCAN FAIL")

app.window(title='Firmware Manager II').close()
