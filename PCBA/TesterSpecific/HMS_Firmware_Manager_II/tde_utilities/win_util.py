"""
Available operations on the returned element object based on control_type:
    All Elements:
        .click_input()                     -> Simulates physical left mouse click
        .window_text()                     -> Returns element title/text string
        .rectangle()                       -> Returns boundaries (left, top, right, bottom)
        .is_enabled() / .is_visible()      -> Boolean interaction status validations
        
    Edit Controls (Input Text Fields):
        .type_keys("text")                 -> Inputs keystrokes (supports special codes like ^a, {BACKSPACE})
        .window_text()                     -> Extracts typed data text value
        
    CheckBox / Toggle Controls:
        .get_toggle_state()                -> Returns checked state: 1 (On) or 0 (Off)
        .is_checked()                      -> Returns True if active checkbox is checked
        .check() / .uncheck()              -> Safe targeted value forcing state shifts

Quick-Start Usage Patterns:
    1. Focus and Target Preparation:
       >>> app.ensure_active_and_front()   # Restores window and forces it to the foreground

    2. Direct Text Search (Will throw error if missing):
       >>> app.find("Submit").click_input()

    3. Label-Relative Offset (Targeting blank inputs next to text labels):
       >>> app.find("Username:", xy_ratio=(1.8, 0.0)).type_keys("admin")

    4. Conditional Flow Validation (Safe check; returns None instead of throwing error):
       >>> optional_popup = app.find("Update Available", timeout=2, raise_on_timeout=False)
       >>> if optional_popup:
       ...     app.find("Remind Me Later").click_input()

    5. Scanning Encompassing Regions (Perfect for limiting external OCR search boundaries):
       >>> master_bbox = app.get_windows_region()  # Returns (L, T, R, B) of all popups
       >>> result = ocr_locate(keyword="Confirm", search_area=master_bbox)

    6. App-Level Global Shortcuts:
       >>> app.shortcut("%F")  # Presses ALT + F to open the File Menu.

    7. Inspection & Debugging (Saves combined-region blueprint):
       >>> app.dump_ui_tree(script_path="./logs")

    8. Return element using coordinates:
       >>> app.find_by_coord(coord)
"""
import time
from PIL import ImageGrab, ImageDraw, ImageFont
from pywinauto import Application
import re
import os
import logging


class WindowApp:
    def __init__(self, start_path, backend="uia"):
        self.start_path = start_path
        self.backend = backend
        self.app = None
        self.dlg = None

    def start(self, timeout=10):
        """Launches the application and connects to the main window."""
        logging.info(f"Starting application: {self.start_path}")
        launched_app = Application(backend=self.backend).start(self.start_path)
        
        # 2. Connect automatically using the unique process ID (PID)
        self.app = Application(backend=self.backend).connect(
            process=launched_app.process, timeout=timeout
        )
        
        # Small sleep to let the UI finish rendering inside the window
        time.sleep(1)
        self.dlg = self.app.top_window()
        
        # # Maximize the main window
        # try:
        #     self.dlg.maximize()
        # except Exception as e:
        #     logging.warning(f"Could not maximize window: {e}")
            
        return self

    def close(self):
        """Instantly terminates the application process tree without hardcoded title matches."""
        if self.app is None:
            logging.info("No active application to terminate.")
            return
        logging.info("Terminating application process tree instantly via kill()")
        try:
            self.app.kill()
        except Exception as e:
            logging.error(f"Failed to kill application process: {e}")
        # Reset states so the wrapper can be reused safely
        self.app = None
        self.dlg = None

    def ensure_active_and_front(self):
        """Ensures the application window is initialized, restored, and brought to the front."""
        if not self.app or not self.dlg:
            raise RuntimeError("Application or active dialog window not initialized. Call .start() first.")
        
        try:
            # 1. Restore the window if it was minimized
            if self.dlg.is_minimized():
                logging.info("Window is minimized. Restoring window state.")
                self.dlg.restore()
                
            # 2. Set keyboard/mouse focus and bring to front
            logging.info("Bringing target application window to the absolute front.")
            self.dlg.set_focus()
            
        except Exception as e:
            logging.error(f"Failed to force window to front: {e}")
            
        return self

    def get_windows_region(self):
        """
        Loops through all open dialogs/popups belonging to the app 
        and returns a single bounding box enclosing all of them.
        
        Returns:
            tuple: (left, top, right, bottom) encompassing all open windows.
        """
        if not self.app:
            raise RuntimeError("Application not initialized. Call .start() first.")
        # 1. Collect rectangles from all currently open windows in your app process
        open_windows = self.app.windows()
        if not open_windows:
            raise RuntimeError("No open windows found for this application process.")
        lefts, tops, rights, bottoms = [], [], [], []
        for win in open_windows:
            if win.is_visible():
                rect = win.rectangle()
                lefts.append(rect.left)
                tops.append(rect.top)
                rights.append(rect.right)
                bottoms.append(rect.bottom)

                # 2. Force loop through children to catch overlapping or extended panes
                for child in win.descendants():
                    try:
                        if child.is_visible():
                            c_rect = child.rectangle()
                            if max(c_rect.width(), c_rect.height()) > 0:
                                lefts.append(c_rect.left)
                                tops.append(c_rect.top)
                                rights.append(c_rect.right)
                                bottoms.append(c_rect.bottom)
                    except Exception:
                        continue
        if not lefts:
            raise RuntimeError("No visible UI elements discovered to compute boundaries.")
        # 2. Extract extreme bounds to encompass every single element
        combined_region = (min(lefts), min(tops), max(rights), max(bottoms))
        logging.info(f"Calculated encompassing region for {len(lefts)} visible windows: {combined_region}")
        return combined_region

    def shortcut(self, key_combination):
        """
        Sends hotkeys or system shortcuts directly to the active application window.
        
        Pywinauto Keystroke Modifiers:
            '%' -> ALT key
            '^' -> CTRL key
            '+' -> SHIFT key
            '{DOWN}', '{UP}', '{LEFT}', '{RIGHT}'
            '{ENTER}', '{F4}', '{BACKSPACE}' -> Special Key Blocks
            
        Args:
            key_combination (str): Keystroke sequence string (e.g., '%F' or '^a')
        """
        if not self.app:
            raise RuntimeError("Application window not initialized. Call .start() first.")
        self._refresh_active_window()
        logging.info(f"Sending global application shortcut: {key_combination}")
        # Sends key combinations straight to the active top dialog safely
        self.dlg.type_keys(key_combination)
        return self

    def dump_ui_tree(self, script_path=None):
        """Logs all controls in a single structured message and saves a visual blueprint."""
        if not self.app:
            logging.error("Application window not initialized.")
            return
        self._refresh_active_window() 
        debug_list = []
        log_lines = ["UI Tree =", "=== STARTING FULL UI INSPECTION TREE ==="]
        active_nodes = self.dlg.descendants()
        log_lines.append(f"Total active window elements found: {len(active_nodes)}")
        for idx, element in enumerate(active_nodes):
            try:
                rect = element.rectangle()
                props = element.get_properties()
                control_type = props.get("control_type", "UnknownType")
                win_text = str(element.window_text()).strip()
                uia_name = props.get("name", "")
                log_lines.append(f"[{idx}] Type: {control_type} | Text: '{win_text}' | UIA Name: '{uia_name}' | Box: ({rect.width()}x{rect.height()}) | Coord: ({rect.left}, {rect.top})")
                if script_path and max(rect.width(), rect.height()) > 0:
                    global_bounds = (rect.left, rect.top, rect.right, rect.bottom)
                    debug_list.append([global_bounds, f"#{idx}", "red"])
            except Exception as e:
                log_lines.append(f"[{idx}] Failed reading node data: {e}")
        log_lines.append("=== END OF UI INSPECTION TREE ===")
        logging.debug("\n".join(log_lines))
        if script_path and debug_list:
            script_path = os.path.join(script_path, "debug")
            os.makedirs(script_path, exist_ok=True)
            img_filename = os.path.join(script_path, "ui_dump_map.png")
            self._save_annotated_screenshot(debug_list, filename=img_filename)
        
    def find(self, target_pattern, xy_ratio=(0.0, 0.0), timeout=5, raise_on_timeout=True, script_path=None):
        """
        Scans the application window for a text pattern. If an offset (x, y) tuple 
        is provided, it returns the neighboring element located at that pixel offset.
        Otherwise, it returns the matched text element itself.

        Args:
            target_pattern (str or re.Pattern): The text label or compiled regex.
            xy_ratio (tuple): (x_ratio, y_ratio) aspect multipliers relative to the anchor's size.
                              e.g., (1.8, 0.0) moves right, (0.0, 1.5) moves down.
            timeout (int): Seconds to wait before failing.
            raise_on_timeout (bool): If True, raises a TimeoutError on failure. 
                                     If False, returns None (suppressing error).
            
        Returns:
            pywinauto.application.WindowSpecification or None
        """
        if not self.app:
            raise RuntimeError("Application window not initialized. Call .start() first.")
        compiled_pattern = (target_pattern if isinstance(target_pattern, re.Pattern) 
                            else re.compile(re.escape(target_pattern), re.IGNORECASE))
        start_time = time.time()
        while True:
            self._refresh_active_window() 
            try:
                # Pulling descendants fresh in case elements dynamically load
                for element in self.dlg.descendants():
                    try:
                        rect = element.rectangle()
                        if max(rect.width(), rect.height()) == 0:
                            continue
                        text_pool = self._extract_text_pool(element)
                        if not self._is_pattern_found(text_pool, compiled_pattern):
                            continue
                        final_element = self._resolve_target_element(element, rect, xy_ratio)
                        if script_path:
                            f_rect = final_element.rectangle()
                            global_bounds = (f_rect.left, f_rect.top, f_rect.right, f_rect.bottom)
                            timestamp = time.strftime('%Y%m%d_%H%M%S', time.localtime())
                            save_path = os.path.join(script_path, "debug", f"find_{timestamp}.png")
                            self._save_annotated_screenshot([[global_bounds, f"{target_pattern} -> Target", "blue"]], filename=save_path)
                        return final_element
                    except Exception:
                        continue
            except Exception as e:
                logging.debug(f"Window tree extraction transient error: {e}")
            if (time.time() - start_time) > timeout:
                break
            time.sleep(0.5)
        error_message = f"RPA Search Failure: Pattern target '{target_pattern}' was not discovered within {timeout}s."
        if raise_on_timeout:
            raise TimeoutError(error_message)
        logging.error(f"{error_message} (Suppressing exception: returning None)")
        return None

    def find_by_coord(self, coord, xy_ratio=(0.0, 0.0), script_path=None):
        region = self.get_windows_region()
        c_left, c_top, c_right, c_bottom = region
        x, y = coord
        x += c_left
        y += c_top
        logging.info(f'find element using global coord {x=}, {y=}')
        element = self.dlg.from_point(x, y)
        rect = element.rectangle()
        final_element = self._resolve_target_element(element, rect, xy_ratio)
        if script_path:
            f_rect = final_element.rectangle()
            global_bounds = (f_rect.left, f_rect.top, f_rect.right, f_rect.bottom)
            timestamp = time.strftime('%Y%m%d_%H%M%S', time.localtime())
            save_path = os.path.join(script_path, "debug", f"find_by_coord_{timestamp}.png")
            self._save_annotated_screenshot([[global_bounds, f"{f_rect.left}, {f_rect.top})", "blue"]], filename=save_path)
        return final_element

    def _refresh_active_window(self):
        """Internal helper to automatically shift focus to the active pop-up or main window."""
        try:
            # 0.5s timeout keeps it lightning fast while waiting for transitions
            self.dlg = self.app.top_window().wait('ready', timeout=0.5)
        except Exception:
            # Fallback to the last known state if the window is temporarily busy/hidden
            pass
            
    def _extract_text_pool(self, element):
        """Aggressively gathers all text variations from an element to prevent missed matches."""
        pool = set()
        # Standard text property
        pool.add(str(element.window_text()).strip())
        # Check explicitly for pywinauto specific window text lists
        if hasattr(element, 'texts'):
            try:
                for t in element.texts():
                    if isinstance(t, str):
                        pool.add(t.strip())
            except Exception:
                pass
        # Structural property dictionary maps
        try:
            props = element.get_properties()
            for key in ['texts', 'name', 'title']:
                val = props.get(key)
                if isinstance(val, list):
                    pool.update(str(item).strip() for item in val)
                elif val:
                    pool.add(str(val).strip())
            # Fallback processing loop targeted specifically at nested controls
            if 'legacy_properties' in props and props['legacy_properties']:
                legacy_val = props['legacy_properties'].get('Value')
                if legacy_val:
                    pool.add(str(legacy_val).strip())
        except Exception:
            pass
        return [t for t in pool if t and t not in ["[]", "[ ]", "None"]]

    def _is_pattern_found(self, text_pool, compiled_pattern):
        """Checks the gathered pool against your regex target pattern."""
        for text in text_pool:
            # logging.debug(f"Inspecting node text: '{text}'")
            if compiled_pattern.search(text):
                return True
        return False

    def _resolve_target_element(self, element, rect, xy_ratio):
        """Calculates offset math to jump from a text anchor to an input field."""
        mult_x, mult_y = xy_ratio
        if float(mult_x) == 0.0 and float(mult_y) == 0.0:
            return element
        # Find coordinates relative to desktop screen space
        anchor_center_x = rect.left + (rect.width() // 2)
        anchor_center_y = rect.top + (rect.height() // 2)
        pixel_jump_x = int(rect.width() * float(mult_x))
        pixel_jump_y = int(rect.height() * float(mult_y))
        target_element = self.dlg.from_point(anchor_center_x + pixel_jump_x, anchor_center_y + pixel_jump_y)
        return target_element if target_element else element

    def _save_annotated_screenshot(self, targets, filename, region=None):
        """
        Unified helper that calculates bounding regions, captures a 
        screenshot snippet, draws custom overlay rectangles, and saves it.
        
        Args:
            targets (list): Elements to draw -> [[[loc_l, loc_t, loc_r, loc_b], text, color], ...]
            filename (str): Output destination path.
            region (tuple, optional): Explicit (l, t, r, b) bounds. Defaults to all open windows.
        """
        if not region:
            try:
                region = self.get_windows_region()
            except Exception as e:
                logging.warning(f"Could not calculate combined window region, falling back to desktop: {e}")
                rect = self.app.desktop().rectangle()
                region = (rect.left, rect.top, rect.right, rect.bottom)
        c_left, c_top, c_right, c_bottom = region
        screenshot = ImageGrab.grab(bbox=(c_left, c_top, c_right, c_bottom))
        draw = ImageDraw.Draw(screenshot)
        font = ImageFont.load_default()
        for box_coords, text_label, color_str in targets:
            # Map raw global monitor coordinates directly to local canvas pixels
            loc_l = box_coords[0] - c_left
            loc_t = box_coords[1] - c_top
            loc_r = box_coords[2] - c_left
            loc_b = box_coords[3] - c_top
            draw.rectangle([loc_l, loc_t, loc_r, loc_b], outline=color_str, width=1)
            if text_label and len(str(text_label).strip()) > 0:
                draw.text((loc_l + 4, loc_t + 2), str(text_label), fill=color_str, font=font)
        screenshot.save(filename)
        logging.info(f"Debug layout screenshot successfully saved to: {filename}")

    # --- Context Manager Implementation ('with' statement hooks) ---
    def __enter__(self):
        # This executes automatically when entering the 'with' block
        return self.start()

    def __exit__(self, exc_type, exc_val, exc_tb):
        # This executes automatically when leaving the 'with' block (even on error)
        self.close()
        return False  # Do not suppress exceptions if any occurred inside the block
