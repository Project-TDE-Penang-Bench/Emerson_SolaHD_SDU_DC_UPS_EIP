import os
import shutil

TARGET_DIR = r"C:\Temp\UUT_HMS"

def clear_directory_contents(target_path):
    if not os.path.exists(target_path):
        print(f"[ERROR] Target directory does not exist: {target_path}")
        return

    print(f"Warning: Deleting all contents inside {target_path}...")
    
    # Track success counts
    files_deleted = 0
    folders_deleted = 0

    for item in os.listdir(target_path):
        item_path = os.path.join(target_path, item)
        try:
            if os.path.isfile(item_path) or os.path.islink(item_path):
                os.unlink(item_path)  # Deletes files or symbolic links
                files_deleted += 1
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)  # Deletes directory and all its contents
                folders_deleted += 1
        except Exception as e:
            print(f"[ERROR] Failed to delete {item_path}. Reason: {e}")

    print("\n--- Operation Complete ---")
    print(f"Removed {files_deleted} files and {folders_deleted} subfolders.")

if __name__ == "__main__":
    # Double check this is exactly what you want to wipe!
    clear_directory_contents(TARGET_DIR)