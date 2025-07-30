import os
import requests


def downloadFile(url: str, localPath: str) -> bool:
    """
    Download a file from GitHub to a local path.

    Args:
        - url (str): GitHub raw URL to download from
        - localPath (str): Local path to save the file

    Returns:
        - bool: True if successful, False otherwise
    """
    try:
        response = requests.get(url)
        response.raise_for_status()

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(localPath), exist_ok=True)

        with open(localPath, "w", encoding="utf-8") as f:
            f.write(response.text)

        return True

    except Exception as e:
        return False


def getGithubRepoContents(owner: str, repo: str, path: str = "") -> list:
    """
    Get the contents of a GitHub repository directory.

    Args:
        - owner (str): GitHub repository owner
        - repo (str): Repository name
        - path (str): Path within the repository

    Returns:
        - list: List of file/directory information
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()

    except Exception as e:
        return []


def downloadRepository(
    owner: str = "SantiagoRR2004",
    repo: str = "GRIA-TestCreator",
    databaseFolder: str = "database",
):
    """
    Download all question files from the GRIA-TestCreator repository.

    Args:
        - owner (str): GitHub repository owner
        - repo (str): Repository name
        - databaseFolder (str): Local folder to store downloaded questions
    """
    baseUrl = f"https://raw.githubusercontent.com/{owner}/{repo}/main"

    # Create database folder if it doesn't exist
    os.makedirs(databaseFolder, exist_ok=True)

    # Get the root contents of the repository
    rootContents = getGithubRepoContents(owner, repo)

    if not rootContents:
        return

    # Known subject folders from the repository
    validFolders = []

    # Find all directories in the root that could contain questions
    for item in rootContents:
        if item["type"] == "dir" and item["name"][0] != ".":
            validFolders.append(item["name"])

    totalDownloaded = 0
    totalFailed = 0

    for folder in validFolders:

        # Get contents of the folder
        folderContents = getGithubRepoContents(owner, repo, folder)

        if not folderContents:
            continue

        # Create local subject folder
        localpath = os.path.join(databaseFolder, folder)
        os.makedirs(localpath, exist_ok=True)

        # Download all JSON files
        for item in folderContents:
            if item["type"] == "file" and item["name"].endswith(".json"):
                file_url = f"{baseUrl}/{folder}/{item['name']}"
                local_file_path = os.path.join(localpath, item["name"])

                if downloadFile(file_url, local_file_path):
                    totalDownloaded += 1
                else:
                    totalFailed += 1

    return (
        totalDownloaded / (totalDownloaded + totalFailed)
        if (totalDownloaded + totalFailed) > 0
        else 0
    )


if __name__ == "__main__":
    downloadRepository()
