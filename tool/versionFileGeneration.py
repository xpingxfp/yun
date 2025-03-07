import os
import json
from datetime import datetime, timezone

def get_file_info(path, root_path):
    """获取文件信息，包括相对于root_path的路径"""
    try:
        file_stat = os.stat(path)
        return {
            "type": "file",
            "fileName": os.path.basename(path),
            "path": os.path.relpath(path, root_path),  # 使用相对路径
            "size": file_stat.st_size,  # 文件大小，以字节为单位
            "lastModified": datetime.fromtimestamp(file_stat.st_mtime, tz=timezone.utc).isoformat()
        }
    except Exception as e:
        print(f"Error processing file {path}: {e}")
        return {"type": "error", "message": f"Error processing file {path}: {e}"}

def folder_to_json(folder_path, ignore_folders=None, root_path=None):
    """递归地将文件夹转换为JSON格式，并可以忽略指定的文件夹"""
    if ignore_folders is None:
        ignore_folders = []
    if root_path is None:
        root_path = folder_path  # 如果没有提供root_path，则默认使用folder_path作为根路径
        
    folder_name = os.path.basename(folder_path.rstrip(os.sep))
    contents = []

    try:
        for item in os.listdir(folder_path):
            if item in ignore_folders:
                continue  # 跳过忽略的文件夹
            
            item_path = os.path.join(folder_path, item)
            if os.path.isdir(item_path):
                contents.append({
                    "type": "folder",
                    "folderName": item,
                    "contents": folder_to_json(item_path, ignore_folders, root_path)  # 递归调用，传递root_path
                })
            else:
                contents.append(get_file_info(item_path, root_path))  # 传递root_path到get_file_info

        return contents  # 返回内容列表，而不是包含folderName的对象
    except PermissionError as e:
        print(f"Permission denied accessing {folder_path}: {e}")
        return [{"type": "error", "message": "Permission denied"}]
    except Exception as e:
        print(f"An error occurred while processing {folder_path}: {e}")
        return [{"type": "error", "message": str(e)}]

def generate_folder_json(folder_path, output_file, ignore_folders=None):
    """生成文件夹的JSON表示，并保存到指定文件"""
    folder_structure = {
        "type": "folder",
        "folderName": os.path.basename(folder_path.rstrip(os.sep)),
        "contents": folder_to_json(folder_path, ignore_folders, folder_path)  # 传递folder_path作为root_path
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(folder_structure, f, ensure_ascii=False, indent=2)

# 使用示例
path = "G:/yun/app"
output_path = os.path.join(path, 'version.json')
ignore_list = ['path']  # 指定要忽略的文件夹
generate_folder_json(path, output_path, ignore_folders=ignore_list)