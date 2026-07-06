import clr
import os

# --- CONFIGURATION ---
WINSCP_DLL_PATH = r"C:\Program Files (x86)\WinSCP\WinSCPnet.dll"

FTP_HOST = "192.168.1.6"
FTP_USER = "SolaHD"
FTP_PASS = "r00t_sola"
TARGET_DIR = "webdir"

# Your target metrics
EXPECTED_FILES = 70
EXPECTED_FOLDERS = 8
EXPECTED_BYTES = 451374

def calculate_via_winscp_dll():
    if not os.path.exists(WINSCP_DLL_PATH):
        print(f"[ERROR] WinSCPnet.dll not found at: {WINSCP_DLL_PATH}")
        return

    clr.AddReference(WINSCP_DLL_PATH)
    import WinSCP

    print("Initializing WinSCP Session Options...")
    session_options = WinSCP.SessionOptions()
    session_options.Protocol = WinSCP.Protocol.Ftp
    session_options.HostName = FTP_HOST
    session_options.UserName = FTP_USER
    session_options.Password = FTP_PASS

    session = WinSCP.Session()

    try:
        print("Connecting to the UUT...")
        session.Open(session_options)
        print("Login successful.")

        print(f"Enumerating files recursively inside '{TARGET_DIR}' using WinSCP engine...")
        
        # EnumerateRemoteFiles takes: (Remote path, search mask, enumeration options)
        # EnumerateOptions.AllDirectories triggers the native recursive calculation loop
        file_infos = session.EnumerateRemoteFiles(
            TARGET_DIR, 
            "*.*", 
            WinSCP.EnumerationOptions.AllDirectories
        )

        files_found = 0
        folders_found = 0
        bytes_found = 0

        # Loop through everything WinSCP discovered natively
        for file_info in file_infos:
            if file_info.IsDirectory:
                folders_found += 1
            else:
                files_found += 1
                bytes_found += file_info.Length

        print("\n--- WinSCP Calculation Results ---")
        print(f"Files Found   : {files_found} (Expected: {EXPECTED_FILES})")
        print(f"Folders Found : {folders_found} (Expected: {EXPECTED_FOLDERS})")
        print(f"Total Size    : {bytes_found} Bytes (Expected: {EXPECTED_BYTES} Bytes)")

        # Verify against criteria
        success = (files_found == EXPECTED_FILES and 
                   folders_found == EXPECTED_FOLDERS and 
                   bytes_found == EXPECTED_BYTES)

        print("\n--- Final Verdict ---")
        if success:
            print("YES - Success: Properties match WinSCP expectations exactly!")
        else:
            print("Failure: Calculated sizes do not match.")

    except Exception as e:
        print(f"[ERROR] WinSCP API Execution failed: {e}")
    finally:
        session.Dispose()

if __name__ == "__main__":
    calculate_via_winscp_dll()