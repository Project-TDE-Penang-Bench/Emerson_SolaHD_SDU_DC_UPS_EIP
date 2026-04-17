from pywinauto.application import Application
from pywinauto.controls.win32_controls import ButtonWrapper
from io import StringIO
import sys
import re
import time
import pyautogui

try:
    app = Application(backend='uia').start('C:\PROGRA~2\HMS\IPconfig\Hms.IPConfig.exe')
    app = Application(backend='uia').connect(title='HMS IPconfig', timeout=10)
    app.window(title='HMS IPconfig').child_window(title="Hms.IPConfig.UI.Components.ViewModel.ScanListViewItemViewModel", control_type="DataItem").click_input()
    if(app.window(title='HMS IPconfig').child_window(title="Retrieve IP settings dynamically from a DHCP server", auto_id="DhcpToggle", control_type="CheckBox").get_toggle_state()):
        print("click!")   
        app.window(title='HMS IPconfig').child_window(title="Retrieve IP settings dynamically from a DHCP server", auto_id="DhcpToggle", control_type="CheckBox").click_input()

    #edit IP address
    app.window(title='HMS IPconfig').child_window(auto_id="txtIPAddress", control_type="Edit").click_input()
    app.window(title='HMS IPconfig').child_window(auto_id="txtIPAddress", control_type="Edit").type_keys("^A")
    app.window(title='HMS IPconfig').child_window(auto_id="txtIPAddress", control_type="Edit").type_keys("{BACKSPACE}")
    app.window(title='HMS IPconfig').child_window(auto_id="txtIPAddress", control_type="Edit").type_keys("192.168.1.2")

    #edit Subnet mask
    app.window(title='HMS IPconfig').child_window(auto_id="txtSubnetMask", control_type="Edit").click_input()
    app.window(title='HMS IPconfig').child_window(auto_id="txtSubnetMask", control_type="Edit").type_keys("^A")
    app.window(title='HMS IPconfig').child_window(auto_id="txtSubnetMask", control_type="Edit").type_keys("{BACKSPACE}")
    app.window(title='HMS IPconfig').child_window(auto_id="txtSubnetMask", control_type="Edit").type_keys("255.255.255.0")

    #apply IP change
    print("start")
    app.window(title='HMS IPconfig').child_window(title="Hms.IPConfig.UI.Components.ViewModel.ScanListViewItemViewModel", control_type="DataItem").click_input()
    print("done")
    app.window(title='HMS IPconfig').child_window(title="Apply", auto_id="ApplyButton", control_type="Button").click()
    for i in range(10):
        time.sleep(2)
        if pyautogui.locateOnScreen('./Picture/error_rejection_popup.png', confidence=0.8) == None:
            print("PASS")
            break
        app.window(title='HMS IPconfig').child_window(auto_id="CommandButton_1").click_input()
        time.sleep(2)
        app.window(title='HMS IPconfig').child_window(title="Apply", auto_id="ApplyButton", control_type="Button").click()
        
except:
    print("FAIL")
app.window(title='HMS IPconfig').close()
