import time
from PIL import ImageGrab, ImageDraw, ImageFont
from pywinauto import Application
import re
import os
import logging


class WindowApp:
    def __init__(self, start_path, title, backend="uia"):
        self.start_path = start_path
        self.title = title
        self.backend = backend
        self.app = None
        self.dlg = None

    def start(self, timeout=10):
        """Launches the application and connects to the main window."""
        logging.info(f"Starting application: {self.start_path}")
        self.app = Application(backend=self.backend).start(self.start_path)
        self.app = Application(backend=self.backend).connect(
            title=self.title, timeout=timeout
        )
        # Small sleep to let the UI finish rendering inside the window
        time.sleep(1)
        self.dlg = self.app.window(title=self.title)
        return self

    def close(self):
        """Safely closes the application window if it is open."""
        if self.app and self.dlg:
            logging.info(f"Closing window: {self.title}")
            try:
                # Kills the process cleanly via the main window context
                self.dlg.close()
            except Exception:
                # Fallback if the window refuses a clean close request
                self.app.kill()
        else:
            logging.info("No active application window to close.")

    def save_ui_blueprint(self, debug_dir_path):
        """
        Generates 3 separate debug artifacts inside the target directory:
        1. A raw, unfiltered sequential structural text dump.
        2. A clean, beautified text documentation index with copy-paste code.
        3. A color-coded, decluttered visual map blueprint image.
        """
         # 1. Reject immediately if the input path exists but is an actual file
        if os.path.exists(debug_dir_path) and not os.path.isdir(debug_dir_path):
            raise NotADirectoryError(f"The path '{debug_dir_path}' is a file, not a directory.")
        # 2. Normalize and enforce the "debug" subfolder name
        if os.path.basename(os.path.normpath(debug_dir_path)) != "debug":
            debug_dir_path = os.path.join(debug_dir_path, "debug")
        # 3. Safely create the directory (and parent folders) if it doesn't exist yet
        os.makedirs(debug_dir_path, exist_ok=True)
        if not self.dlg:
            raise RuntimeError("Application window not initialized. Call .start() first.")
            # 1. Safely handle the "debug" subfolder enforcement
        # File paths definition
        raw_dump_file = os.path.join(debug_dir_path, "ui_raw_dump.txt")
        beautified_index_file = os.path.join(debug_dir_path, "ui_mapping_index.txt")
        visual_map_image = os.path.join(debug_dir_path, "ui_mapping.png")
        # ---------------------------------------------------------------------
        # ARTIFACT 1: Save the completely raw, unfiltered text structural dump
        # ---------------------------------------------------------------------
        self.dlg.print_control_identifiers(filename=raw_dump_file)
        logging.info(f"1. Raw structural UI dump saved to: {raw_dump_file}")
        # ---------------------------------------------------------------------
        # PROCESSING LAYER: Filter and deduplicate for visual layout + index
        # ---------------------------------------------------------------------
        rect = self.dlg.rectangle()
        w_left, w_top = rect.left, rect.top
        SKIP_TYPES = ["Thumb", "Header", "Custom", "Pane", "Window", "ScrollBar", "Separator"]
        all_controls = self.dlg.descendants()
        all_controls.sort(key=lambda c: c.rectangle().width() * c.rectangle().height(), reverse=False)
        captured_boxes = []
        unique_boxes = {}
        for ctrl in all_controls:
            c_rect = ctrl.rectangle()
            c_width, c_height = c_rect.width(), c_rect.height()
            if max(c_width, c_height) == 0: continue
            if max(c_width, 6) == 6 or max(c_height, 6) == 6: continue
            props = ctrl.get_properties()
            control_type = props.get("control_type", "Element")
            auto_id = props.get("automation_id", "")
            if control_type in SKIP_TYPES or "Gripper" in str(auto_id): continue
            box_left = c_rect.left - w_left
            box_top = c_rect.top - w_top
            box_right = c_rect.right - w_left
            box_bottom = c_rect.bottom - w_top
            center_x = box_left + (c_width // 2)
            center_y = box_top + (c_height // 2)
            is_vip_target = bool(control_type in ["DataItem", "Button", "Edit", "CheckBox"] or "192.168" in str(props.get("texts", "")))
            if not is_vip_target:
                is_duplicate = False
                for p_left, p_top, p_right, p_bottom in captured_boxes:
                    if (abs(box_left - p_left) <= 3 and abs(box_top - p_top) <= 3 and 
                        abs(box_right - p_right) <= 3 and abs(box_bottom - p_bottom) <= 3):
                        is_duplicate = True
                        break
                        
                    if (center_x >= p_left and center_x <= p_right and center_y >= p_top and center_y <= p_bottom):
                        is_duplicate = True
                        break
                if is_duplicate: continue

            box_tuple = (box_left, box_top, box_right, box_bottom)
            captured_boxes.append(box_tuple)
            
            if box_tuple not in unique_boxes: unique_boxes[box_tuple] = []
            unique_boxes[box_tuple].append(ctrl)
        # ---------------------------------------------------------------------
        # ARTIFACT 2 & 3: Generate beautified documentation & image targets queue
        # ---------------------------------------------------------------------
        # Bright palette array to cycle through distinct colors for every single item
        COLOR_PALETTE = [
            "red", "blue", "green", "magenta", "orange", 
            "purple", "cyan", "brown", "darkorange", "teal"
        ]
        drawing_targets_list = []
        f = open(beautified_index_file, "w", encoding="utf-8")
        f.write("=== HMS IPCONFIG BEAUTIFIED RPA TARGET MAP INDEX ===\n")
        f.write("Total Unique Cleaned Components Located: " + str(len(unique_boxes)) + "\n\n")
        element_counter = 1
        for box_coords, controls in unique_boxes.items():
            best_id, best_title, ctrl_type = "", "", "Element"
            for ctrl in controls:
                props = ctrl.get_properties()
                auto_id = props.get("automation_id", "")
                raw_texts = props.get("texts", [])
                current_type = props.get("control_type", "Element")
                if current_type != "Element" or ctrl_type == "Element": ctrl_type = current_type
                title = str(raw_texts).strip()
                if auto_id and not best_id: best_id = auto_id
                if title and title != "[]" and title != "['']" and not best_title:
                    best_title = title.replace("['", "").replace("']", "").strip()
            label_text = f"#{element_counter}"
            # Select color based on element counter to keep adjacent borders distinct
            assigned_color = COLOR_PALETTE[(element_counter - 1) % len(COLOR_PALETTE)]
            # Queue up boundaries for overlay painting
            drawing_targets_list.append([box_coords, label_text, assigned_color])
            # Write clean reference definitions
            f.write(f"[{element_counter}] ----------------------------------------\n")
            f.write(f"    Pywinauto control_type      : \"{ctrl_type}\"\n")
            f.write(f"    Pywinauto automation_id     : \"{best_id}\"\n")
            f.write(f"    Pywinauto title / text      : \"{best_title}\"\n")
            f.write(f"    Assigned Layout Map Color   : {assigned_color.upper()}\n")
            f.write("    RPA Best Match Reference Example:\n")
            if len(best_id) > 0:
                f.write("    -> app.child_window(auto_id=\"" + str(best_id) + "\", control_type=\"" + str(ctrl_type) + "\")\n\n")
            elif len(best_title) > 0:
                f.write("    -> app.child_window(title=\"" + str(best_title) + "\", control_type=\"" + str(ctrl_type) + "\")\n\n")
            else:
                f.write("    -> app.child_window(control_type=\"" + str(ctrl_type) + "\", found_index=0)\n\n")
            element_counter += 1
        f.close()
        logging.info(f"2. Beautified text map index saved to: {beautified_index_file}")
        # Render the final visual map image via the helper
        self._draw_debug_overlay(targets=drawing_targets_list, filename=visual_map_image)
        logging.info(f"3. Color-coded visual blueprint saved to: {visual_map_image}")

    def find(self, target_pattern, xy_ratio=(0.0, 0.0), timeout=5, raise_on_timeout=True, debug_img_path=''):
        """
        Scans the application window for a text pattern. If an offset (x, y) tuple 
        is provided, it returns the neighboring element located at that pixel offset.
        Otherwise, it returns the matched text element itself.
        
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
        if not self.dlg:
            raise RuntimeError("Application window not initialized. Call .start() first.")
        if isinstance(target_pattern, str):
            compiled_pattern = re.compile(re.escape(target_pattern))
        else:
            compiled_pattern = target_pattern
        start_time = time.time()
        while True:
            all_elements = self.dlg.descendants()
            for element in all_elements:
                try:
                    # Consolidate native textual attributes safely
                    text_pool = [str(element.window_text()).strip()]
                    props_texts = element.get_properties().get("texts", [])
                    if isinstance(props_texts, list):
                        for t in props_texts:
                            text_pool.append(str(t).strip())
                    for current_text in text_pool:
                        if not current_text or current_text in ["[]", "['']"]:
                            continue
                        if compiled_pattern.search(current_text):
                            rect = element.rectangle()
                            anchor_w = rect.width()
                            anchor_h = rect.height()
                            if max(anchor_w, anchor_h) == 0:
                                continue
                            final_element = element
                            label_tag = str(target_pattern)
                            # Unpack ratio coordinates
                            mult_x, mult_y = xy_ratio
                            is_static_search = bool(float(mult_x) == 0.0 and float(mult_y) == 0.0)
                            if not is_static_search:
                                # Calculate absolute center coordinates of the anchor text box
                                anchor_center_x = rect.left + (anchor_w // 2)
                                anchor_center_y = rect.top + (anchor_h // 2)
                                # Multiply ratios directly by the anchor's width and height
                                pixel_jump_x = int(anchor_w * float(mult_x))
                                pixel_jump_y = int(anchor_h * float(mult_y))
                                # Resolve target screen location points
                                final_screen_x = anchor_center_x + pixel_jump_x
                                final_screen_y = anchor_center_y + pixel_jump_y
                                # Grab whatever UI control exists at that exact scaled location point
                                target_element = self.dlg.from_point(final_screen_x, final_screen_y)
                                if target_element:
                                    final_element = target_element
                                    label_tag = f"{target_pattern} -> Ratio Target"
                            # As long as a path is provided, we execute your overlay painting routine
                            if debug_img_path:
                                f_rect = final_element.rectangle()
                                w_rect = self.dlg.rectangle()
                                # Convert absolute screen positions to application-relative coordinates
                                loc_l = f_rect.left - w_rect.left
                                loc_t = f_rect.top - w_rect.top
                                loc_r = f_rect.right - w_rect.left
                                loc_b = f_rect.bottom - w_rect.top
                                # Package boundaries and forward directly to our drawing utility
                                debug_list = [[[loc_l, loc_t, loc_r, loc_b], label_tag, "blue"]]
                                self._draw_debug_overlay(debug_list, filename=debug_img_path)
                            return final_element
                except Exception:
                    continue
            # Check if execution time has surpassed timeout threshold limits
            elapsed_time = time.time() - start_time
            if elapsed_time > timeout:
                break
            time.sleep(0.5)
        # Handle what happens when the search fails
        error_message = f"RPA Search Failure: Pattern target '{target_pattern}' was not discovered within {timeout}s."
        if raise_on_timeout:
            raise TimeoutError(error_message)
        logging.error(error_message + " (Suppressing exception: returning None)")
        return None

    def _draw_debug_overlay(self, targets, filename="debug_output.png"):
        """
        Helper method to capture the application window, draw custom 
        rectangles/text overlays, and save the resulting image.
        
        Args:
            targets (list): A list of lists formatted as: 
                            [[local_left, local_top, local_right, local_bottom], text, color]
            filename (str): The destination file path for the saved image.
        """
        if not self.dlg:
            raise RuntimeError("Application window not initialized.")
        # 1. Grab application window dimensions
        rect = self.dlg.rectangle()
        w_left = rect.left
        w_top = rect.top
        w_width = rect.width()
        w_height = rect.height()
        # 2. Capture snapshot of the application area
        screenshot = ImageGrab.grab(bbox=(w_left, w_top, w_left + w_width, w_top + w_height))
        draw = ImageDraw.Draw(screenshot)
        font = ImageFont.load_default()
        # 3. Draw each provided debug target layer
        for box_coords, text_label, color_str in targets:
            local_left, local_top, local_right, local_bottom = box_coords
            # Draw the boundary rectangle line
            draw.rectangle([local_left, local_top, local_right, local_bottom], outline=color_str, width=1)
            # If a label tag is provided, render it next to the box
            if text_label and len(str(text_label).strip()) > 0:
                draw.text((local_left + 4, local_top + 2), str(text_label), fill=color_str, font=font)
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
