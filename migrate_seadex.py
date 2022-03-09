import json
import requests

seadex_json = open('seadex_data.json')
seadex = json.load(seadex_json)

for item in seadex:
    request_body = {
        "title": [
            {
                "title": item['title'],
                "lang": "en"
            },
            {
                "title": item['alias'],
                "lang": "romanji"
            }
        ],
        "isMovie": False
    }
    releases = []
    for release in item['releases']:
        if "Movie" in release['type']:
            # skipping over movies
            continue

        if release['best']:
            releases.append({
                "type": "best",
                "releaseGroup": release['best'],
                "dualAudio": release['best_dual'],
                "title": "S1" if not release['type'] else release['type'],
                "nyaaLink": release['best_links'].split(' ')[0] if release['best_links'] and "nyaa" in release['best_links'].split(' ')[0] else None,
                "isRelease": not release['best_unmuxed'],
                "isBestVideo": not release['best_bad_encode'],
                "incomplete": not release['best_incomplete'],
                "isExclusiveRelease": False,
                "isBroken": False,
                "notes": item['notes'] if item['notes'] else None,
                "comparisons": item['comparisons'] if item['comparisons'] else None 
            })
        if release['alt']:
            releases.append({
                "type": "alternative",
                "releaseGroup": release['alt'],
                "dualAudio": release['alt_dual'],
                "title": "S1" if not release['type'] else release['type'],
                "nyaaLink": release['alt_links'].split(' ')[0] if release['alt_links'] and "nyaa" in release['alt_links'].split(' ')[0] else None,
                "isRelease": not release['alt_unmuxed'],
                "isBestVideo": not release['alt_bad_encode'],
                "incomplete": not release['alt_incomplete'],
                "isExclusiveRelease": False,
                "isBroken": False,
                "notes": None,
                "comparisons": None
            })
    request_body['releases'] = releases

    print(requests.post(url="http://localhost:3000/api/anime", json=request_body, headers={"Authorization": "ifuckedyourmum"}).status_code)
    