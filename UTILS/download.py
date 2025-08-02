import os
import requests
import datetime


def checkUpdates(folderPath: str, owner: str, repo: str) -> bool:
    """
    Check if the local folder is up to date with the remote repository.

    Args:
        - folderPath (str): The path to the local folder containing the questions.
        - owner (str): GitHub repository owner
        - repo (str): Repository name

    Returns:
        - bool: True if the local folder is up to date,
            or an error occurred,
            False if it does not exist or is outdated.
    """
    if not os.path.exists(folderPath):
        return False

    folderTime = datetime.datetime.fromtimestamp(
        os.path.getmtime(folderPath), tz=datetime.timezone.utc
    )

    url = f"https://api.github.com/repos/{owner}/{repo}/commits?per_page=1"

    try:
        response = requests.get(url)
        response.raise_for_status()
        latestCommit = response.json()[0]
        latestCommitTime = datetime.datetime.fromisoformat(
            latestCommit["commit"]["committer"]["date"]
        )

        return folderTime >= latestCommitTime

    except Exception as e:
        print(f"Error checking updates: {e}")
        return True


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


def purgeEmpty(folderPath: str) -> None:
    """
    Remove empty directories in the specified folder.

    Args:
        - folderPath (str): The path to the folder to purge

    Returns:
        - None
    """
    for root, dirs, files in os.walk(folderPath, topdown=False):
        for name in dirs:
            dirPath = os.path.join(root, name)
            if not os.listdir(dirPath):  # Check if directory is empty
                os.rmdir(dirPath)  # Remove empty directory


def downloadRepository(
    owner: str = "SantiagoRR2004",
    repo: str = "GRIA-TestCreator",
    databaseFolder: str = "database",
) -> float:
    """
    Download all question files from the GRIA-TestCreator repository.

    Args:
        - owner (str): GitHub repository owner
        - repo (str): Repository name
        - databaseFolder (str): Local folder to store downloaded questions

    Returns:
        - float: The success rate of downloaded files (0 to 1)
    """
    if checkUpdates(databaseFolder, owner, repo):
        print("The local database is up to date.")
        return 1

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

    # Remove empty directories
    purgeEmpty(databaseFolder)

    return (
        totalDownloaded / (totalDownloaded + totalFailed)
        if (totalDownloaded + totalFailed) > 0
        else 0
    )


if __name__ == "__main__":
    downloadRepository()
