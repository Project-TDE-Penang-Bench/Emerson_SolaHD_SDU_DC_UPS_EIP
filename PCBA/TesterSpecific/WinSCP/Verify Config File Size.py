from ftplib import FTP

# Configuration
FTP_HOST = "192.168.1.5"
FTP_USER = "SolaHD"
FTP_PASS = "r00t_sola"
FILES_TO_CHECK = ["ftp.cfg", "http.cfg", "InternalSystemLog.txt"]

def check_ftp_files():
    try:
        # Connect and login to the UUT
        print(f"Connecting to {FTP_HOST}...")
        ftp = FTP(FTP_HOST)
        ftp.login(user=FTP_USER, passwd=FTP_PASS)
        print("Login successful.\n")

        all_match = True
        
        for file_name in FILES_TO_CHECK:
            try:
                # Get the true file size in bytes
                file_size = ftp.size(file_name)
                
                # Check if file size is between 1 byte and 1024 bytes (shows as 1 KB outside)
                if file_size is not None and 0 < file_size <= 1024:
                    print(f"[PASS] {file_name}: Size is {file_size} bytes (Displays as 1 KB)")
                else:
                    actual_size = f"{file_size} bytes" if file_size is not None else "Unknown/Missing"
                    print(f"[FAIL] {file_name}: Size is {actual_size} (Does not round to 1 KB)")
                    all_match = False
                    
            except Exception as e:
                print(f"[ERROR] {file_name}: Could not retrieve size. It might not exist. Error: {e}")
                all_match = False

        # Close the connection safely
        ftp.quit()

        if all_match:
            print("SUCCESS: All files are 1kb each from the outside view.")
        else:
            print("ERROR: One or more files failed the 1kb criteria.")

    except Exception as e:
        print(f"FTP Connection Failure: {e}")

if __name__ == "__main__":
    check_ftp_files()