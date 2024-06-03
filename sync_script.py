import requests
import json
import os
from github import Github

# Configuration
GHOST_API_URL = os.getenv('GHOST_API_URL')
GHOST_API_KEY = os.getenv('GHOST_API_KEY')
REPO_NAME = os.getenv('REPO_NAME')
GH_TOKEN = os.getenv('GH_TOKEN')
CONTENT_FILE = 'content.json'

# Debugging: Print the environment variables
print(f'GHOST_API_URL: {GHOST_API_URL}')
print(f'GHOST_API_KEY: {GHOST_API_KEY}')
print(f'REPO_NAME: {REPO_NAME}')
print(f'GH_TOKEN: {"Exists" if GH_TOKEN else "Not Found"}')

# Check if GHOST_API_URL and GHOST_API_KEY are set
if not GHOST_API_URL or not GHOST_API_KEY:
    raise ValueError("GHOST_API_URL and GHOST_API_KEY must be set")

# Fetch posts from Ghost
response = requests.get(f'{GHOST_API_URL}/ghost/api/v3/content/posts/?key={GHOST_API_KEY}')
posts = response.json()

# Save posts to a file
with open(CONTENT_FILE, 'w') as file:
    json.dump(posts, file, indent=4)

# Commit and push to GitHub
g = Github(GH_TOKEN)
repo = g.get_repo(REPO_NAME)
with open(CONTENT_FILE, 'r') as file:
    content = file.read()

# Create or update the file in the repo
try:
    file = repo.get_contents(CONTENT_FILE)
    repo.update_file(file.path, "Update content", content, file.sha)
except:
    repo.create_file(CONTENT_FILE, "Add content", content)
