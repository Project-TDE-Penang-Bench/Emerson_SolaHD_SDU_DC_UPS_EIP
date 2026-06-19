import os
import sys
import time
import logging
from PIL import ImageGrab, ImageDraw, ImageFont

def crop_image(image, bbox=None):
    """Crops an image using a boundary box tuple: (left, top, right, bottom)."""
    if bbox:
        logging.info(f"Cropping image boundaries to: {bbox}")
        return image.crop(bbox)
    return image

async def ocr_screen(crop_bbox=None, keyword=None, debug_path=None):
    """
    Captures a screenshot, optionally crops it, and runs Windows Native OCR.
    Only executes on Windows machines.
    """
    # 1. Protect other OS users by checking the platform at runtime
    if sys.platform != "win32":
        raise OSError("The 'ocr_screen' utility requires a Microsoft Windows environment to load WinRT APIs.")

    # 2. Import winocr lazily so it doesn't break Linux/Mac on package load
    import winocr  

    # 3. Capture full screen space
    screenshot = ImageGrab.grab()
    
    # 4. Apply relative cropping bounds if provided
    active_image = crop_image(screenshot, crop_bbox)
    offset_x = crop_bbox[0] if crop_bbox else 0
    offset_y = crop_bbox[1] if crop_bbox else 0

    # 5. Perform Windows Media OCR execution asynchronously
    logging.info("Executing native Windows WinRT OCR sequence...")
    result = await winocr.recognize_pil(active_image)
    
    coordinates = None
    matched_text = None
    
    # 6. Search for specific text tokens if requested
    if keyword:
        keyword_lower = keyword.lower()
        for line in result.lines:
            if keyword_lower in line.text.lower():
                if line.words:
                    # Target bounding box of matching word segment
                    rect = line.words[0].bounding_rect
                    
                    # Convert relative coordinates back to global monitor coordinates
                    cx = rect.x + (rect.width / 2) + offset_x
                    cy = rect.y + (rect.height / 2) + offset_y
                    
                    coordinates = (cx, cy)
                    matched_text = line.text.strip()
                    logging.info(f"Keyword match target localized: '{matched_text}' at {coordinates}")
                    break  # Return first structural match

    # 7. Save visual runtime image to workspace if root path parameters are passed
    if debug_path:
        _save_debug_image(active_image, result, keyword, debug_path)

    return {
        "coordinates": coordinates,
        "matched_text": matched_text,
        "raw_result": result
    }

def _save_debug_image(image, ocr_result, keyword, debug_path):
    """Internal helper to write bounded shapes and annotations onto image copy."""
    debug_dir = os.path.join(debug_path, "debug", "ocr")
    os.makedirs(debug_dir, exist_ok=True)
    
    clean_keyword = "".join(c for c in str(keyword) if c.isalnum()) if keyword else "scan"
    timestamp = int(time.time())
    save_filename = f"{clean_keyword}_{timestamp}.png"
    save_path = os.path.join(debug_dir, save_filename)
    
    annotated_image = image.copy()
    draw = ImageDraw.Draw(annotated_image)
    
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None

    for line in ocr_result.lines:
        for word in line.words:
            r = word.bounding_rect
            draw.rectangle([r.x, r.y, r.x + r.width, r.y + r.height], outline="cyan", width=2)
            if font:
                draw.text((r.x, max(0, r.y - 12)), word.text, fill="magenta", font=font)

    logging.info(f"Saving system debug verification capture layout directly to: {save_path}")
    annotated_image.save(save_path)
