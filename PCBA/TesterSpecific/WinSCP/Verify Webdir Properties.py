import os

# --- CONFIGURATION ---
TARGET_DIR = r"C:\Temp\UUT_HMS\webdir"

# Your target metrics
EXPECTED_FILES = 70
EXPECTED_FOLDERS = 8
EXPECTED_BYTES = 451374

def calculate_local_directory():
    if not os.path.exists(TARGET_DIR):
        print(f"[ERROR] Target directory not found at: {TARGET_DIR}")
        return

    print(f"Enumerating files recursively inside '{TARGET_DIR}' local path...\n")

    files_found = 0
    folders_found = 0
    bytes_found = 0

    # os.walk recursively traverses the folder tree natively
    for root, dirs, files in os.walk(TARGET_DIR):
        # Count subfolders in the current directory level
        folders_found += len(dirs)
        
        # Count files and accumulate their sizes
        for file_name in files:
            files_found += 1
            file_path = os.path.join(root, file_name)
            try:
                bytes_found += os.path.getsize(file_path)
            except Exception as e:
                print(f"[WARNING] Could not read size for {file_path}. Error: {e}")

    print("--- Local Folder Calculation Results ---")
    print(f"Files Found   : {files_found} (Expected: {EXPECTED_FILES})")
    print(f"Folders Found : {folders_found} (Expected: {EXPECTED_FOLDERS})")
    print(f"Total Size    : {bytes_found} Bytes (Expected: {EXPECTED_BYTES} Bytes)")

    # Verify against criteria
    success = (files_found == EXPECTED_FILES and 
               folders_found == EXPECTED_FOLDERS and 
               bytes_found == EXPECTED_BYTES)
    print("\n------------------------------------------------")
    if success:
        print("SUCCESS: Properties match expectations exactly!")
    else:
        print("ERROR: Calculated sizes do not match.")

if __name__ == "__main__":
    calculate_local_directory()