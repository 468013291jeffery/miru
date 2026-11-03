# -*- coding: utf-8 -*-
"""Attach generated originals to the existing manuscript; no pixel editing."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def dump(name, data):
    (ROOT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def picture(asset):
    return '\n![' + asset['moment'] + '](' + asset['file'] + ')\n\n**图片名：** `' + asset['filename'] + '`\n\n'


def main():
    path = ROOT / 'assets-manifest.json'
    if not path.exists():
        return
    manifest = json.loads(path.read_text())
    if manifest['status'] != 'complete':
        return
    assets = manifest['assets']
    assert len(assets) == 17
    by_id = {a['id']: a for a in assets}
    source = json.loads((ROOT / 'story-source.json').read_text())
    bible = json.loads((ROOT / 'bible.json').read_text())
    meta = json.loads((ROOT / 'meta.json').read_text())
    contract = json.loads((ROOT / 'authoring-contract.json').read_text())
    bookpath = ROOT / '今晚，偏爱失控_完整剧本.md'
    book = bookpath.read_text()
    book = book.replace('\n\n', '\n' + picture(by_id['cover']), 1)
    visual = source.get('visualDirection')
    if visual:
        direction = '## 美术与服装连续性｜作者使用\n\n' + visual['style'] + '\n\n' + visual['wardrobeContinuity'] + '\n\n' + visual['playerView'] + '\n\n'
        book = book.replace('## 两位核心人物', direction + '## 两位核心人物', 1)
    for character in source['cast']:
        heading = '### ' + character['name'] + '｜' + str(character['age']) + '岁'
        assert heading in book
        book = book.replace(heading + '\n', heading + '\n' + picture(by_id['char_' + character['key']]), 1)
    for scene in reversed(source['scenes']):
        heading = '## 第' + str(scene['n']) + '幕｜' + scene['title']
        start = book.index(heading)
        match = re.search(r'\n## (?:第\d+幕｜|五种收束)', book[start + len(heading):])
        end = start + len(heading) + match.start() if match else len(book)
        part = book[start:end]
        entry = by_id['bg_' + scene['id']]
        conditional = [a for a in assets if a['kind'] == 'highlight' and a['sceneId'] == scene['id']]
        part = part.replace('### 开场演出', picture(entry) + '### 开场演出', 1)
        if conditional:
            block = '### 条件高光配图｜作者按实际事件选用\n\n以下为互斥或有条件的演出配图，不在章首轮播，不把尚未发生的亲密画面先展示给玩家。\n\n'
            for a in conditional:
                block += '**对应时刻：** ' + a['moment'] + '\n\n**显示条件：** ' + a['trigger'] + '\n' + picture(a)
            part = part.replace('### 本幕作者说明与角色指引', block + '### 本幕作者说明与角色指引', 1)
        book = book[:start] + part + book[end:]
        bible_scene = bible['chapters'][scene['n'] - 1]['scenes'][0]
        bible_scene['authorArtwork'] = {'entry': entry, 'conditional': conditional, 'conditionalRuntimeConnected': False}
        bible_scene['beat'] += '\n本章配图：' + entry['filename'] + '。这是电影剧情配图，不是故事内照片工具执行结果。实际地点与在场人物优先；条件高光只在对应事件发生后选用，当前未接自动切换。'
        contract['scenes'][scene['n'] - 1]['01_编号与场所']['artwork'] = bible_scene['authorArtwork']
    book = book.replace('尚未提供图片、真实通话或照片工具结果，也没有完成真实模型试玩。',
                        '已提供17张真实电影感配图，并在本文件的对应人物与剧情时刻标注图片名。没有真实通话或故事内照片工具结果，也没有完成真实模型试玩。')
    bookpath.write_text(book, encoding='utf-8')
    bible['capabilities']['assetsProvided'] = True
    bible['capabilities']['conditionalArtworkSwitching'] = False
    bible['artManifest'] = 'assets-manifest.json'
    meta['assetFiles'] = 17
    meta['assetManifest'] = 'assets-manifest.json'
    meta['artBindingScope'] = 'local-content-package-not-published'
    meta['releaseNeeds'] = ['published-asset-path-binding' if x == 'artwork' else x for x in meta['releaseNeeds']]
    meta['releaseNeeds'].append('conditional-highlight-display-hook-and-ui-verification')
    dump('bible.json', bible)
    dump('meta.json', meta)
    dump('authoring-contract.json', contract)
    dump('runtime-art.json', {a['id']: a['file'] for a in assets})
    print(json.dumps({'illustrated': True, 'images': 17, 'chapters': 10, 'published': False}, ensure_ascii=False))


if __name__ == '__main__':
    main()
