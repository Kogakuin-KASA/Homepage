"""note の RSS から最新記事を取得し、サイトが読む data/note.json を書き出す。

GitHub Actions（.github/workflows/update-note.yml）が1時間ごとに実行する。
手元で試すときは `python scripts/fetch_note.py` を実行する（標準ライブラリのみ使用）。
"""

import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import timezone, timedelta
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path

CREATOR_ID = "kasa_kogakuin"  # https://note.com/<CREATOR_ID>
MAX_ITEMS = 3
EXCERPT_LENGTH = 200  # サイト側でさらに短く切る
RSS_URL = f"https://note.com/{CREATOR_ID}/rss"
OUTPUT = Path(__file__).resolve().parent.parent / "data" / "note.json"
JST = timezone(timedelta(hours=9))
MEDIA_NS = "{http://search.yahoo.com/mrss/}"


class _TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def to_text(description):
    parser = _TextExtractor()
    parser.feed(description or "")
    text = html.unescape(" ".join(parser.parts))
    text = re.sub(r"\s+", " ", text).strip()
    # note の RSS は本文の末尾に「続きをみる」リンクを付けるので除く
    text = re.sub(r"\s*続きをみる$", "", text)
    return text[:EXCERPT_LENGTH]


def parse_items(xml_text):
    root = ET.fromstring(xml_text)
    items = []
    for item in root.iter("item"):
        link = (item.findtext("link") or "").strip()
        if not link.startswith("https://note.com/"):
            continue
        thumbnail = (item.findtext(f"{MEDIA_NS}thumbnail") or "").strip()
        if not thumbnail.startswith("https://"):
            thumbnail = ""
        published = parsedate_to_datetime(item.findtext("pubDate"))
        items.append((published, {
            "title": (item.findtext("title") or "").strip(),
            "link": link,
            "date": published.astimezone(JST).strftime("%Y-%m-%d"),
            "thumbnail": thumbnail,
            "excerpt": to_text(item.findtext("description")),
        }))
    items.sort(key=lambda pair: pair[0], reverse=True)
    return [entry for _, entry in items[:MAX_ITEMS]]


def main():
    request = urllib.request.Request(RSS_URL, headers={"User-Agent": "KASA-Homepage-note-sync"})
    with urllib.request.urlopen(request, timeout=30) as response:
        xml_text = response.read().decode("utf-8")
    items = parse_items(xml_text)
    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(json.dumps({"items": items}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"{len(items)} 件を {OUTPUT.name} に書き出しました", file=sys.stderr)


if __name__ == "__main__":
    main()
