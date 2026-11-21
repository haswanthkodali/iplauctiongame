from curl_cffi import requests

r = requests.get("https://www.iplt20.com/teams/delhi-capitals/squad", impersonate="chrome124", timeout=15)
html = r.text
idx = html.find("Axar Patel")
print("Found index:", idx)
if idx != -1:
    print(html[idx-300:idx+800].encode('ascii', errors='replace').decode('ascii'))
