import os
import keyboard
import logging
import threading
import tkinter as tk

class StatusOverlay:
    def __init__(self):
        self._window = None
        self._bold_label = None
        self._normal_label = None
        self._red_label = None
        
        # Backing variables for properties
        self._emphasis = ""
        self._message = ""
        self._info = ""

        # Start background exit hotkey
        threading.Thread(target=self._hotkey_exit, daemon=True).start()

    def _hotkey_exit(self):
        keyboard.wait('ctrl+shift+q')
        logging.info("hotkey pressed, terminating test program")
        print("Hotkey pressed. Terminating Test Program.")
        os._exit(0)

    def start(self, initial_text="Test in Progress, Please wait.. \n" 
                                 "Status: Intializing test.. \n" 
                                 "Please do NOT touch! Press Ctrl + Shift + Q to force quit the program."):
        """Creates and displays the status window."""
        if self._window is not None:
            return  # Already running
        self._window = tk.Tk()
        self._window.attributes("-topmost", True)
        self._window.resizable(False, False)
        # Disable the menu bar and window decorations entirely 
        self._window.overrideredirect(True)
        # Set size and position (bottom-right corner)
        width, height = 500, 120
        screen_width = self._window.winfo_screenwidth()
        screen_height = self._window.winfo_screenheight()
        x = screen_width - width - 10
        y = screen_height - height - 100
        self._window.geometry(f"{width}x{height}+{x}+{y}")
        # Bold label (Emphasis)
        self._bold_label = tk.Label(
            self._window, font=("Segoe UI", 10, "bold"), 
            wraplength=480, justify="center", anchor="nw"
        )
        self._bold_label.pack(fill="x", padx=10, pady=(10, 0))
        # Normal label (Message)
        self._normal_label = tk.Label(
            self._window, font=("Segoe UI", 10), 
            wraplength=480, justify="center", anchor="nw"
        )
        self._normal_label.pack(fill="x", padx=10, pady=(2, 0))
        # Red label (Info)
        self._red_label = tk.Label(
            self._window, font=("Segoe UI", 10), fg="red", 
            wraplength=480, justify="center", anchor="nw"
        )
        self._red_label.pack(fill="x", padx=10, pady=(2, 10))
        # Parse initial multiline text string if provided
        self.parse_full_text(initial_text)
        self._window.update()

    def close(self):
        """Destroys and clears the status window."""
        if self._window:
            self._window.destroy()
            self._window = None
            self._bold_label = None
            self._normal_label = None
            self._red_label = None

    def parse_full_text(self, text):
        """Splits a 3-line newline string into individual labels."""
        lines = text.splitlines()
        self.emphasis = lines[0] if len(lines) > 0 else ""
        self.message = lines[1] if len(lines) > 1 else ""
        self.info = lines[2] if len(lines) > 2 else ""

    # Property for Top Line (Bold Text)
    @property
    def emphasis(self):
        return self._emphasis

    @emphasis.setter
    def emphasis(self, value):
        self._emphasis = value
        if self._bold_label and self._window:
            self._bold_label.config(text=value)
            self._window.update()

    # Property for Middle Line (Normal Text)
    @property
    def message(self):
        return self._message

    @message.setter
    def message(self, value):
        self._message = value
        if self._normal_label and self._window:
            self._normal_label.config(text=value)
            self._window.update()

    # Property for Bottom Line (Red Text)
    @property
    def info(self):
        return self._info

    @info.setter
    def info(self, value):
        self._info = value
        if self._red_label and self._window:
            self._red_label.config(text=value)
            self._window.update()
