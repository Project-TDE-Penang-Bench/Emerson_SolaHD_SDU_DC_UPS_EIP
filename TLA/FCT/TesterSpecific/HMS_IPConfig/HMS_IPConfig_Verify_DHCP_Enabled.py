from pywinauto.application import Application
from pywinauto.controls.win32_controls import ButtonWrapper
from io import StringIO
import sys
import re
import time
import pyautogui

def is_ip_zero():
    print("is_ip_zero")
    return (pyautogui.locateOnScreen('./Picture/ip_zero.png', confidence=0.9) != None)

def is_dhcp_enabled():
    print("is_dhcp_enabled")
    return (pyautogui.locateOnScreen('./Picture/dhcp_enabled.png', confidence=0.9) != None)    
   

try:
    app = Application(backend='uia').start('C:\PROGRA~2\HMS\IPconfig\Hms.IPConfig.exe')
    app = Application(backend='uia').connect(title='HMS IPconfig', timeout=10)
    #move cursor to top right corner to prevent false failure
    pyautogui.moveTo(0, 0)
    time.sleep(5)
    if (is_ip_zero() and is_dhcp_enabled()):
        print("VERIFY_DHCP_ENABLED_SUCCESS")
    else:
        if not (is_ip_zero()):
            print("IP is not 0.0.0.0")
        if not (is_dhcp_enabled()):
            print("DHCP is not Enabled")
    
except:
    print("FAIL")
app.window(title='HMS IPconfig').close()
