#!/usr/bin/env python3
"""把 minigames.json 里的 36 个三选一小游戏挂到《我暗恋的人有秘密规则》的作品资料（bible.json）上。

用法（在仓库根目录）：python3 scripts/secret-rules-v1/apply-minigames.py
重复运行结果相同；只改每章第 2、4 场的 scene.game、games_on 和 minigames 摘要，其他字段不动。
"""
import json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "scripts", "secret-rules-v1", "minigames.json")
data = json.load(open(SRC, encoding="utf8"))
WID = data["story"]
BIBLE = os.path.join(ROOT, "art", "official", WID + ".bible.json")
ASSETS = os.path.join(ROOT, "art", "official", WID + ".json")
b = json.load(open(BIBLE, encoding="utf8"))
assets = json.load(open(ASSETS, encoding="utf8"))

games = data["games"]
assert len(games) == 36, len(games)
assert len({g["code"] for g in games}) == 36
seen = set()
for g in games:
    ch, sc = g["ch"], g["scene"]
    assert sc in (2, 4), g["code"]
    assert g["code"] == "MG_CH%02d_%s" % (ch, "A" if sc == 2 else "B"), g["code"]
    assert len(g["items"]) == 3 and 0 <= g["ans"] < 3, g["code"]
    for k in ("zh", "en", "pz", "pe", "stake", "win", "lose", "skip"):
        assert str(g.get(k, "")).strip(), (g["code"], k)
    scene = b["chapters"][ch - 1]["scenes"][sc - 1]
    sid = "c%02ds%02d" % (ch, sc)
    assert scene["id"] == sid, (g["code"], scene["id"])
    assert (ch, sc) not in seen
    seen.add((ch, sc))
    img = assets.get(scene.get("backgroundKey", ""), "")
    scene["game"] = {
        "id": g["code"],
        "kind": "pick3",
        "code": g["code"],
        "name": g["zh"],
        "name_en": g["en"],
        "when": "进入「%s」这一场后，可以选择玩或跳过" % scene["place"]["zh"],
        "stake": g["stake"],
        "outcomes": {"WIN": g["win"], "LOSE": g["lose"], "SKIP": g["skip"]},
        "winFlag": "mg_%s_win" % g["code"],
        "play": {
            "tpl": data.get("template", "m111_pick"),
            "seconds": data.get("seconds", 35),
            "pz": g["pz"], "pe": g["pe"], "ask": g["ask"], "items": g["items"], "ans": g["ans"],
            "img": img,
        },
    }

b["games_on"] = True
b["minigames"] = {"count": 36, "kind": "pick3", "template": data.get("template", "m111_pick"),
                  "seconds": data.get("seconds", 35), "source": "scripts/secret-rules-v1/minigames.json",
                  "placement": "每章第2场A、第4场B", "rules": data["rules"]}

with open(BIBLE, "w", encoding="utf8", newline="\n") as f:
    json.dump(b, f, ensure_ascii=False, indent=2)
    f.write("\n")
n = sum(1 for c in b["chapters"] for s in c["scenes"] if s.get("game"))
print("挂载完成：%d 个小游戏，games_on=%s" % (n, b["games_on"]))
sys.exit(0 if n == 36 else 1)
