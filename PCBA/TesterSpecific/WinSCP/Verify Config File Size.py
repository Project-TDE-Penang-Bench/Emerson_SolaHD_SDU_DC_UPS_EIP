import os

# Configuration
TARGET_DIR = r"C:\Temp\UUT_HMS"
FILES_TO_CHECK = ["ftp.cfg", "http.cfg", "InternalSystemLog.txt"]

all_match = True

for file_name in FILES_TO_CHECK:
    # Construct the full local file path
    file_path = os.path.join(TARGET_DIR, file_name)
    
    try:
        if os.path.exists(file_path):
            # Get the true local file size in bytes
            file_size = os.path.getsize(file_path)
            
            # Check if file size is between 1 byte and 1024 bytes (shows as 1 KB outside)
            if 0 < file_size <= 1024:
                print(f"[PASS] {file_name}: Size is {file_size} bytes (Displays as 1 KB)")
            else:
                print(f"[FAIL] {file_name}: Size is {file_size} bytes (Does not round to 1 KB)")
                all_match = False
        else:
            print(f"[ERROR] {file_name}: File does not exist at path.")
            all_match = False
            
    except Exception as e:
        print(f"[ERROR] {file_name}: Could not retrieve size. Error: {e}")
        all_match = False

print("\n------------------------------------------------")
if all_match:
    print("SUCCESS: All files are 1 KB each from the outside view.")
else:
    print("ERROR: One or more files failed the 1 KB criteria.")