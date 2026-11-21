import shutil

# Make a backup first
shutil.copyfile('index.html', 'index.html.bak')
print("Backup created as index.html.bak")
