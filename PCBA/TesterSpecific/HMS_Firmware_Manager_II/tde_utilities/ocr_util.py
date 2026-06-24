"""
Run on Windows only.
Windows Native OCR Screen Locator Utility Component.

This module provides synchronous object-oriented access to the Windows WinRT OCR 
engine to capture the screen, read text data, and extract relative image canvas coordinates.

Usage Examples:
    >>> ocr = OcrUtil(script_path="./logs")
    
    1. Scan the whole screen for a keyword:
        >>> coords = ocr.locate(keyword="Submit")
        >>> print(coords)  # (450, 612) or None
        
    2. Scan a specific region and save debug visualizations:
        >>> bbox = (100, 150, 600, 700) # (left, top, right, bottom)
        >>> coords = ocr.locate(keyword="Login", region=bbox)

    3. Extract all coordinates for repeating UI keywords (e.g., table rows):
        >>> bbox = (200, 200, 800, 800)
        >>> all_matches = ocr.locate_all(keyword="Update", region=bbox)
        >>> print(all_matches)  # Returns a list: [(x1, y1), (x2, y2), ...]
"""
import os
import re
import sys
import time
import asyncio
import logging
from PIL import ImageGrab, ImageDraw, ImageFont, ImageOps, ImageEnhance


class OcrUtil:
    def __init__(self, script_path=None):
        """
        Initializes the OCR locator instance.
        
        Args:
            script_path (str, optional): Default directory path to write debug overlay captures.
        """
        self.script_path = script_path

    def locate(self, target_pattern, region=None, script_path=None, timeout=5, preprocess=False):
        """
        Finds the relative (x, y) coordinate center of the FIRST matching target_pattern.
        
        Returns:
            tuple: (x, y) relative pixel integers, or None if not found.
        """
        if script_path is None:
            script_path = self.script_path
        coord = None
        t = time.time()
        while time.time() - t < timeout:
            coord = asyncio.run(self._execute_scan(target_pattern=target_pattern, 
                                                   region=region, 
                                                   script_path=script_path,
                                                   preprocess=preprocess))
            if coord:
                break
        return coord

    def locate_all(self, target_pattern, region=None, preprocess=False):
        """
        Finds the relative (x, y) coordinate center of ALL matching target_patterns.
        
        Returns:
            list: A predictable list of (x, y) coordinate tuples. Returns [] if none found.
        """
        return asyncio.run(self._execute_scan(target_pattern, region, fetch_all=True, preprocess=preprocess))

    async def _execute_scan(self, target_pattern, region=None, fetch_all=False, script_path=None, preprocess=False):
        """Internal asynchronous core engine running WinRT pipelines."""
        if sys.platform != "win32":
            raise OSError("The 'OcrUtil' utility requires a Microsoft Windows environment to load WinRT APIs.")
        
        import winocr  

        # Capture target region boundaries
        if region:
            active_image = ImageGrab.grab(bbox=region)
        else:
            active_image = ImageGrab.grab()

        if script_path is None:
            script_path = self.script_path

        # Handle isolated preprocessing and capture scale changes dynamically
        scale_factor = 1
        if preprocess:
            active_image, scale_factor = self._preprocess(active_image, scale_factor=3, grayscale=True, enhance=True)

        result = await winocr.recognize_pil(active_image)
        
        matches = []
        highlighted_targets = []  # Tracks matches for custom debug colorization

        compiled_pattern = (target_pattern if isinstance(target_pattern, re.Pattern) 
                            else re.compile(re.escape(target_pattern), re.IGNORECASE))
        
        raw_target = target_pattern.pattern if isinstance(target_pattern, re.Pattern) else str(target_pattern)
        has_spaces = " " in raw_target.strip()

        for line in result.lines:
            # STEP 1: Multi-word Phrase Logic (e.g., Target is "Update Config")
            if has_spaces and compiled_pattern.search(line.text):
                logging.info(f"Target phrase detected at line-level: '{line.text.strip()}'")
                
                matched_words = []
                for word in line.words:
                    if word.text.lower() in raw_target.lower() or compiled_pattern.search(word.text):
                        matched_words.append(word.bounding_rect)
                
                if matched_words:
                    min_x = min(r.x for r in matched_words)
                    min_y = min(r.y for r in matched_words)
                    max_x = max(r.x + r.width for r in matched_words)
                    max_y = max(r.y + r.height for r in matched_words)
                    
                    cx = int(min_x + ((max_x - min_x) / 2))
                    cy = int(min_y + ((max_y - min_y) / 2))
                    
                    # Track unscaled bounds for the debug highlighter
                    highlighted_targets.append([[min_x, min_y, max_x, max_y], line.text.strip(), "red"])
                    
                    match_point = (int(cx / scale_factor), int(cy / scale_factor))
                    
                    if not fetch_all:
                        if script_path:
                            self._save_debug_image(active_image, result, highlighted_targets)
                        return match_point
                    matches.append(match_point)
                    continue

            # STEP 2: Precise Single Word Fallback (e.g., Target is "Tool")
            for word in line.words:
                if compiled_pattern.search(word.text):
                    r = word.bounding_rect
                    
                    cx = int(r.x + (r.width / 2))
                    cy = int(r.y + (r.height / 2))
                    
                    # Track unscaled bounds for the debug highlighter
                    highlighted_targets.append([[r.x, r.y, r.x + r.width, r.y + r.height], word.text.strip(), "red"])
                    
                    match_point = (int(cx / scale_factor), int(cy / scale_factor))
                    
                    logging.info(f"Target word localized precisely: '{word.text.strip()}' at {match_point}")
                    
                    if not fetch_all:
                        if script_path:
                            self._save_debug_image(active_image, result, highlighted_targets)
                        return match_point
                    matches.append(match_point)

        if script_path:
            self._save_debug_image(active_image, result, highlighted_targets)
            
        return matches if fetch_all else None
    
    def _preprocess(self, image, scale_factor=3, grayscale=True, enhance=True):
        """
        Applies a high-fidelity upscale and contrast enhancement pipeline.
        Avoids destructive binary thresholding to preserve precise characters 
        like periods, commas, and small prefix letters like 'v'.
        """
        
        active_image = image.copy()
        logging.debug("Applying high-fidelity upscale and contrast enhancement...")
        
        # 1. Upscale significantly (using cubic interpolation) to generate smooth sub-pixels
        w, h = active_image.size
        active_image = active_image.resize((w * scale_factor, h * scale_factor), resample=2) # 2 = Image.BICUBIC
        
        if grayscale:
            # 2. Convert to grayscale to remove icon artifacts
            active_image = ImageOps.grayscale(active_image)
        
        if enhance:
            # 3. Boost contrast dramatically (Factor of 4.0 or higher)
            # This forces the faint gray font lines to become dark charcoal/black 
            # without introducing any jagged binary edges or warping periods into commas.
            enhancer = ImageEnhance.Contrast(active_image)
            active_image = enhancer.enhance(4.0)
        
        # Convert back to standard RGB layout for WinOCR ingestion
        active_image = active_image.convert('RGB')
        
        return active_image, scale_factor

    def _save_debug_image(self, image, ocr_result, highlighted_targets=None):
        """
        Generates debug layout illustrations.
        Draws standard cyan boxes for generic text detections, and layers down 
        the customized highlighted target structures passed from the execution scan.
        """
        timestamp = time.strftime('%Y%m%d_%H%M%S', time.localtime())
        base_dir = self.script_path if self.script_path else "."
        debug_dir = os.path.join(base_dir, "debug")
        os.makedirs(debug_dir, exist_ok=True)
        
        save_filename = f"ocr_{timestamp}.png"
        save_path = os.path.join(debug_dir, save_filename)
        
        annotated_image = image.copy()
        draw = ImageDraw.Draw(annotated_image)
        try:
            font = ImageFont.load_default()
        except Exception:
            font = None
            
        # 1. Draw generic low-contrast background boxes for ALL recognized words
        for line in ocr_result.lines:
            for word in line.words:
                r = word.bounding_rect
                draw.rectangle([r.x, r.y, r.x + r.width, r.y + r.height], outline="cyan", width=1)
                if font:
                    draw.text((r.x, max(0, r.y - 12)), word.text, fill="magenta", font=font)
                    
        # 2. Overlay your high-priority custom target highlights on top (e.g. Red for successful clicks)
        if highlighted_targets:
            for box_coords, text_label, color_str in highlighted_targets:
                loc_l, loc_t, loc_r, loc_b = box_coords
                # Highlight with a thicker line width (width=3) to make it stand out instantly
                draw.rectangle([loc_l, loc_t, loc_r, loc_b], outline=color_str, width=3)
                if font and text_label:
                    draw.text((loc_l + 4, loc_t + 2), f"MATCH: {text_label}", fill=color_str, font=font)
                    
        annotated_image.save(save_path)
