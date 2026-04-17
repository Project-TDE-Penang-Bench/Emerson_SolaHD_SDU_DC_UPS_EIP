from pywinauto.application import Application
from pywinauto.controls.win32_controls import ButtonWrapper
from io import StringIO
import sys
import re
import time
import pyautogui
import win32api

def success_close_app():
    app.window(title='Firmware Manager II').close()
    print("PASS")

def is_firmware_update_done():
    print("is_firmware_update_done")
    app.window(title='Firmware Manager II').window(control_type="Text",title="Finished").wait('enabled', timeout=300)
    time.sleep(3)
    app.window(title='Firmware Manager II').window(title='Firmware Download').close()
    app.window(title='Firmware Manager II').close()
    print("PASS")

def click_target(str):
    if pyautogui.locateOnScreen(str, confidence=0.8) != None:
        x,y = pyautogui.locateCenterOnScreen(str, confidence=0.8)
        pyautogui.click(x,y)
        time.sleep(0.5)

def change_auto_update():
    print("change_auto_update")
    app.window(title='Firmware Manager II').type_keys('%F')
    app.window(title='Firmware Manager II').type_keys('A')
    
def change_network_type():
    print("change_network_type")
    app.window(title='Firmware Manager II').type_keys('%F')
    app.window(title='Firmware Manager II').type_keys('C')  

def is_module_detected():
    print("is_module_detected")
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1")
    return (pyautogui.locateOnScreen('./Picture/module_detected_post_bfu.png', confidence=0.9) != None) or (pyautogui.locateOnScreen('./Picture/module_detected_pre_bfu.png', confidence=0.9) != None) or (pyautogui.locateOnScreen('./Picture/module_detected_post_bfu_network_changed.png', confidence=0.9) != None)

def is_network_MBUS():
    print("is_network_MBUS")
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1").wait('enabled', timeout=3)
    #UPDATE BOTH PICTURE BELOW
    return (pyautogui.locateOnScreen('./Picture/available_network_latest.png', confidence=0.9) != None) and (pyautogui.locateOnScreen('./Picture/current_network_latest.png', confidence=0.9) != None)
    
def is_firmware_updated():
    print("is_firmware_updated")
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1").wait('enabled', timeout=3)
    time.sleep(1)
    return (pyautogui.locateOnScreen('./Picture/available_firmware.png', confidence=0.9) != None) and (pyautogui.locateOnScreen('./Picture/current_firmware.png', confidence=0.9) != None)

def run_firmware_update():
    print("run_firmware_update")
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1").wait('enabled', timeout=3)
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1").click_input()
    click_target('./Picture/update_module.png')
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Button",class_name="Button").type_keys('%Y')
    is_firmware_update_done()

try:
    app = Application(backend='uia').start('C:\PROGRA~2\HMS\FIRMWA~1\FIRMWA~1.EXE')
    app = Application(backend='uia').connect(title='Firmware Manager II', timeout=10)

    time.sleep(3)
    click_target('./Picture/scan.png')
    print("Scanning...")
    time.sleep(3)
    if not(is_module_detected()):
        print("MODULE DETECTION FAIL")
        raise Exception("Module detection failed")
    else:
        print("MODULE DETECTION PASS")
    
    app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1").wait('enabled', timeout=3)
    
    if (pyautogui.locateOnScreen('./Picture/is_update_module.png', confidence=0.9) != None):
        print("run-1")
        change_network_type()
        if not (is_network_MBUS()):
            app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1").click_input()
            
            # Select Modbus in drop-down
            app.window(title='Firmware Manager II').window(found_index=2, class_name='HMSGUI_COMPONENT_1').click_input()
            print("DROPDOWN CLICKED")
            csr_x_dd_ethernet,csr_y_dd_ethernet = win32api.GetCursorPos()
            csr_x_dd_modbus,csr_y_dd_modbus = csr_x_dd_ethernet, csr_y_dd_ethernet+30
            pyautogui.click(csr_x_dd_modbus, csr_y_dd_modbus)
            print("DROPDOWN MODBUS OPTION CLICKED")
            
            click_target('./Picture/change_network.png')
            app.window(title='Firmware Manager II').window(found_index=0,control_type="Button",class_name="Button").type_keys('%Y') 
            print("NETWORK TYPE CHANGED")            
            is_firmware_update_done()
        else:
            change_auto_update()
            if not (is_firmware_updated()):
                run_firmware_update()
            else:
                print("MBUS FW IS LATEST. NO UPDATE REQUIRED.")
                print("PASS")
                app.window(title='Firmware Manager II').close()
    elif is_network_MBUS():
        change_auto_update()
        if not (is_firmware_updated()):
            run_firmware_update()
        else:
                print("MBUS FW IS LATEST. NO UPDATE REQUIRED.")
                print("PASS")
                app.window(title='Firmware Manager II').close()
    else:
        if not (is_firmware_updated()):
            app.window(title='Firmware Manager II').window(found_index=0,control_type="Pane",class_name="HMSGUI_COMPONENT_HOLLOW_1").click_input()
            
            # Select Modbus in drop-down
            app.window(title='Firmware Manager II').window(found_index=2, class_name='HMSGUI_COMPONENT_1').click_input()
            print("DROPDOWN CLICKED")
            csr_x_dd_ethernet,csr_y_dd_ethernet = win32api.GetCursorPos()
            csr_x_dd_modbus,csr_y_dd_modbus = csr_x_dd_ethernet, csr_y_dd_ethernet+30
            pyautogui.click(csr_x_dd_modbus, csr_y_dd_modbus)
            print("DROPDOWN MODBUS OPTION CLICKED")
            
            click_target('./Picture/change_network.png')
            app.window(title='Firmware Manager II').window(found_index=0,control_type="Button",class_name="Button").type_keys('%Y')
            print("NETWORK TYPE CHANGED")
            is_firmware_update_done()
        else:
                print("MBUS FW IS LATEST. NO UPDATE REQUIRED.")
                print("PASS")
                app.window(title='Firmware Manager II').close()
        
except:
    app.window(title='Firmware Manager II').close()
    print("FAIL")
