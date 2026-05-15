import urllib.request
import re

url = "https://unsplash.com/s/photos/beauty-products"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # Unsplash image IDs are typically 11 chars
    ids = re.findall(r'photo-([a-zA-Z0-9_-]{11})', html)
    unique_ids = list(set(ids))
    print(unique_ids[:50])
except Exception as e:
    print(e)
