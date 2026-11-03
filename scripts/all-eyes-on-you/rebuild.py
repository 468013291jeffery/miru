# -*- coding: utf-8 -*-
"""Build local authoring artifacts only. No network or publication actions."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def dump(name, value):
    (ROOT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def bi(text, english=None):
    # Chinese is the only delivered locale; en is a renderer fallback, not a translation.
    return {'zh': text, 'en': english if english is not None else text}


def directive(*parts):
    assert all('|' not in str(p) and '⟧' not in str(p) and '\n' not in str(p) for p in parts)
    return '⟦' + '|'.join(str(p) for p in parts) + '⟧'


def dialogue(lines):
    return [f'{who}：{text}' if who == '旁白' else f'{who}：“{text}”' for who, text in lines]


def main():
    source = (ROOT / 'story-source.json').read_bytes()
    d = json.loads(source)
    source_sha = hashlib.sha256(source).hexdigest()
    script = ['# ' + d['title'], '']
    names = {c['key']: c['short'] for c in d['cast']}
    overview = d['storyIntroduction']
    intro_sheet = ['# 《' + d['title'] + '》开篇与章节导语', '',
                   '内容稿 v' + d['version'] + '。以下为共同在场默认路线；实际进度、地点和在场人物优先。', '',
                   '## 故事背景｜新一局开始显示', '', overview['text'], '']
    entry_backgrounds = {
        'contentId': d['id'], 'version': d['version'],
        'status': 'content-only-not-a-native-runtime-schema',
        'displayContract': d['introductionDisplay'], 'story': overview, 'chapters': []}
    # Relationship previews are not memories of events the user already played.
    romantic_preview = ['### 这晚，谁会怎样为你心动', '']
    for highlight in overview.get('emotionalHighlights', []):
        romantic_preview += ['**' + highlight['title'] + '**', '', highlight['teaser'], '',
                             '> “' + highlight['sampleLine'] + '”', '']
    intro_sheet += romantic_preview
    readable = ['# 《' + d['title'] + '》完整剧本', '',
                '原创 Miru 双角色互动故事 · 中文 v' + d['version'], '',
                '合并版：故事总背景、人物设定、互动规则、十章开篇导语、完整正文与分支结局均收录在本文件中。', '',
                '**故事钩子：** ' + d['hook'], '',
                '## 故事背景｜玩家进入时首先看到', '', overview['text'], ''] + romantic_preview + [
                '**用户扮演自己。** 两位 NPC 均为成年人，分别是34岁的电影投资人艾德里安与30岁的演员诺亚。', '',
                '这是一份交互剧本：每幕先呈现短开场，再等待用户自由输入。四个选择的后果互斥，不连续播放。后台指引不念给用户。', '',
                '没有预设用户台词、内心或身体反应。标为作者说明、处理或指引的内容只供制作使用，不显示给玩家。', '']
    readable += ['## 世界与互动规则｜作者使用', '', d['world'], '', d['style'], '',
                 '## 开篇显示与衔接规则｜作者使用', '',
                 d['introductionDisplay']['story'], '', d['introductionDisplay']['chapter'], '',
                 d['introductionDisplay']['duringConversation'], '', d['introductionDisplay']['resume'], '',
                 d['introductionDisplay']['actualStatePriority'], '', d['introductionDisplay']['separation'], '']
    readable += ['## 两位核心人物', '']
    for c in d['cast']:
        readable += ['### ' + c['name'] + '｜' + str(c['age']) + '岁', '', c['role'], '', c['bio'], '',
                     '**人物机制：** ' + c['personality'], '', '**对用户的关怀与吸引：** ' + c['hooks'], '',
                     '**声线：** ' + c['voice'], '', '**私人愿望：** ' + c['want'], '',
                     '**不安与自持：** ' + c['fear'], '', '**初始关系：** ' + c['toward_player'], '',
                     '**初始知情：** ' + c['knows'], '', '**互动边界：** ' + c['boundaries'], '',
                     '**语气示例：** ' + ' / '.join('“' + line + '”' for line in c['sample_lines']), '']
    chapters, contracts = [], []
    for i, s in enumerate(d['scenes']):
        script += [f'# CHAPTER {s["n"]}｜{s["title"]}']
        if i == 0:
            script.append(directive('ORIENT', 'bg'))
            for c in d['cast']:
                script.append(directive('CHAR', c['short'], c['gender'], c['age'], '', c['role'],
                                        c['bio'] + c['voice'] + c['boundaries']))
        intro = s['chapterIntroduction']
        intro_data = {**intro, 'place': s['place'], 'characters': s['present'],
                      'characterNames': [names[k] for k in s['present']]}
        script += [directive('GOAL', s['experience']), '# SCENE｜' + s['place'],
                   directive('BG', 'bg_' + s['id']), directive('TIME', intro['time'])]
        if i == 0:
            script += dialogue([['旁白', overview['text']]])
        script += dialogue([['旁白', intro['text']]])
        script += dialogue(s['opening'])
        script.append(directive('FREE', s['free'], *s['suggestions']))
        script += ['# CHOICE｜' + s['free']]
        for o in s['options']:
            script += [f'#### {o["key"]}｜{o["text"]}'] + dialogue(o['reply'])
        script += ['# ·', '']
        intro_header = f'## 第{s["n"]}幕｜{s["title"]}'
        intro_block = ['**时间：** ' + intro['time'] + '　**地点：** ' + s['place'], '',
                       '**在场人物：** ' + '、'.join(intro_data['characterNames']), '',
                       '> ' + intro['text'], '']
        intro_sheet += [intro_header, ''] + intro_block
        entry_backgrounds['chapters'].append({'n': s['n'], 'sceneId': s['id'], 'title': s['title'], **intro_data})
        readable += [intro_header, '', '### 章节开篇｜玩家可见', ''] + intro_block + ['### 开场演出', '']
        for who, line in s['opening']:
            readable += [line if who == '旁白' else f'**{who}：** “{line}”', '']
        readable += ['**用户从这里自由回复：** ' + s['free'], '', '### 按用户选择演出', '']
        for o in s['options']:
            readable += [f'**{o["key"]}｜{o["text"]}**', '']
            for who, line in o['reply']:
                readable += [line if who == '旁白' else f'{who}：“{line}”', '']
            readable += ['作者处理：' + o['effect'], '']
        readable += ['### 本幕作者说明与角色指引', '', '**入场条件：** ' + s['entry'], '',
                     '**本幕体验：** ' + s['experience'], '', '导演：' + s['director'], '',
                     '艾德里安：' + s['payload']['adrian'], '', '诺亚：' + s['payload']['noah'], '',
                     '**实际记忆：** ' + s['memory'], '', '**出口：** ' + s['exit'], '',
                     '**偏离与恢复：** ' + s['recovery'], '', '---', '']
        beat = '\n'.join([
            '本幕作者资料，不是顺序播出的旁白。先接用户最新输入，示范台词按实际条件择一改写。',
            '章节进场要求：人物对白之前先显示本章简短背景，含时间、地点、实际在场人物与当前事件；本章聊天不重复。',
            '默认时间：' + intro['time'] + '；默认地点：' + s['place'] + '；默认在场：' + '、'.join(intro_data['characterNames']),
            '本章背景导语（玩家可见）：' + intro['text'],
            '用户停留在旧地点或减少陪同时，按实际进度改写上述导语，不能以导语强制移动、召回人物、补造观影和其他前情。',
            ('新一局总背景应在本章导语之前显示一次：' + overview['text']) if i == 0 else '本章不重播总背景，不泄露后续章节。',
            '若用户此前停止追求，本幕继续友伴；仅用户主动重开才恢复。不能靠下一幕抹去拒绝。',
            '未接受移动就保留实际地点；未邀请加入的人不擅自靠近。只有实际在场且有信息来源的人发言。',
            '本包没有照片、语音或游戏工具结果，禁止声称已经生成、保存、拨号或调用原生游戏。',
            '入口：' + s['entry'], '用户体验目标（不能写成已产生的感受）：' + s['experience'],
            '眼前锚点：' + s['anchor'], '主回应者：' + s['lead'], '当前幕处理：' + s['director'],
            '给艾德里安的当前提示：' + s['payload']['adrian'], '给诺亚的当前提示：' + s['payload']['noah'],
            '开场可用素材，最多取一个短节拍：\n' + '\n'.join(dialogue(s['opening'])),
            '记忆：' + s['memory'], '退出：' + s['exit'], '恢复：' + s['recovery']])
        chapters.append({'n': s['n'], 'title': bi(s['title']), 'introduction': intro_data,
                         'goal': s['experience'] + '；' + s['exit'],
                         'scenes': [{'id': s['id'], 'place': bi(s['place']), 'beat': beat,
                                     'present': s['present'], 'ref_lines': [], 'call': None, 'game': None,
                                     'actor_payload': s['payload'], 'interaction': s.get('interaction', {}),
                                     'choice': {'q': s['free'], 'options': [
                                         {'key': o['key'], 't': o['text'], 'effect': o['effect'] + '。即时语气参考：' + ' / '.join(dialogue(o['reply'])),
                                          'state': o.get('state', {}), 'actor_payload': o.get('actor_payload', {})}
                                         for o in s['options']]}}]})
        contracts.append({
            '01_编号与场所': {'id': s['id'], 'title': s['title'], 'place': s['place'], 'chapterIntroduction': intro_data},
            '02_进入条件': s['entry'], '03_用户体验': s['experience'], '04_可见锚点': s['anchor'],
            '05_在场人物': s['present'], '06_主回应者': s['lead'], '07_事件输入与节拍': s['director'],
            '08_知识边界': s['memory'] + '；只允许本人亲历、公开看见、明确被转告的信息。',
            '09_分角色指引': s['payload'],
            '10_互动形式': '自由对话；第3幕文本即兴；第6幕仅讨论纪念构图，照片工具未启用；电话与原生游戏未启用。',
            '11_选择意图': [{'t': o['text'], 'effect': o['effect']} for o in s['options']],
            '12_后果与记忆': s['memory'], '13_退出条件': s['exit'], '14_恢复方式': s['recovery']})
    script_text = '\n'.join(script)
    (ROOT / 'script.md').write_text(script_text, encoding='utf-8')
    intro_sheet += ['## 展示顺序与恢复', '', d['introductionDisplay']['story'], '',
                    d['introductionDisplay']['chapter'], '', d['introductionDisplay']['duringConversation'], '',
                    d['introductionDisplay']['resume'], '', d['introductionDisplay']['actualStatePriority'], '',
                    '标准 DSL 在对白前写入导语；Bible98 使用 experience.schema=1 的固定导语显示。本内容需与 v1.4 App 运行时配套发布，不能仅上传 JSON。', '']
    (ROOT / '开篇与章节导语.md').write_text('\n'.join(intro_sheet), encoding='utf-8')
    dump('entry-backgrounds.json', entry_backgrounds)
    readable += ['## 五种收束', '']
    for e in d['endings']:
        readable += ['### ' + e['name'], '', '成立条件：' + e['condition'], '', e['text'], '']
    readable += ['## 使用说明', '',
                 '本稿已区分可见正文和作者处理。台词用于展示声线，运行时按用户当前输入改写；友伴、拒绝、暂停和实际地点优先于默认开场。', '',
                 '当前是本地内容草稿，没有发布。尚未提供图片、真实通话或照片工具结果，也没有完成真实模型试玩。', '',
                 '故事与章节导语通过 v1.4 App 固定显示；角色各自接收当前任务，场景选择具有明确状态与结局方向。正式上线结果以发布回执为准。']
    (ROOT / '今晚，偏爱失控_完整剧本.md').write_text('\n'.join(readable) + '\n', encoding='utf-8')
    cast = []
    for c in d['cast']:
        card = {k: v for k, v in c.items() if k not in ('englishName', 'short', 'name', 'role')}
        card.update({'name': bi(c['name'], c['englishName']), 'short': bi(c['short'], c['englishName'].split()[0]),
                     'role': bi(c['role']), 'tier': 'lead', 'romanceable': True})
        cast.append(card)
    bible = {'key': d['id'], 'title': bi(d['title'], d['englishTitle']), 'hook': bi(d['hook']),
             'premise': bi(d['premise']), 'orient': 'bg',
             'tags': ['1v2', '纽约首映夜', '双人偏爱', '成年暧昧', '自由互动'],
             'world': d['world'], 'style': d['style'],
             'player': {'key': 'me', 'name': bi('你', 'You'), 'short': bi('你', 'You'),
                        'gender': d['player']['gender'], 'role': bi(d['player']['role'])},
             'playable': ['me'], 'cast': cast, 'chapters': chapters,
             'endings': [{'id': e['id'], 'name': bi(e['name']), 'condition': e['condition'], 'text': e['text']} for e in d['endings']],
             'intro': bi(overview['text']), 'introductionDisplay': d['introductionDisplay'],
             'experience': d['experience'], 'runtimeRevision': d['runtimeRevision'],
             'state': {}, 'relations': [], 'games_on': False, 'solo98': 1,
             'v98content': d['id'] + '-' + d['version'], 'sourceSha256': source_sha,
             'capabilities': {'actorCard': True, 'freeConversation': True, 'chapterNavigation': 'manual',
                              'sceneEntryArtwork': True, 'assetsProvided': False, 'conditionalArtworkSwitching': False,
                              'transactionalEvents': False, 'strictPrivateMemoryIsolation': False,
                              'earlyEndingCard': True, 'nativeGamesEnabled': False,
                              'photoToolsEnabled': False, 'callToolsEnabled': False,
                              'fixedEntryIntroductionRendering': True},
             'authoringStatus': 'draft-not-published'}
    dump('bible.json', bible)
    dump('runtime-art.json', {})
    dump('authoring-contract.json', {'version': d['version'], 'sourceSha256': source_sha,
                                    'sceneFieldsStatus': 'work-specific-authoring-contract-not-engine-schema',
                                    'introductionDisplay': d['introductionDisplay'],
                                    'scenes': contracts, 'endings': d['endings']})
    dump('meta.json', {'contentId': d['id'], 'title': d['title'], 'version': d['version'],
                       'lang': 'zh', 'availableLocales': ['zh'], 'englishFields': 'Chinese fallback except names and title',
                       'orient': 'bg', 'playerIsSelf': True, 'playerGenderInCurrentEngine': 'f',
                       'npcCount': len(cast), 'chapterCount': len(chapters),
                       'authoredOptions': sum(len(s['options']) for s in d['scenes']),
                       'freeInputWindows': len(chapters), 'endingDirections': len(d['endings']),
                       'storyIntroductions': 1, 'chapterIntroductions': len(chapters),
                       'fixedIntroductionDisplay': {'standardDSL': 'authored-before-dialogue',
                                                    'bible98': 'experience-schema-1-requires-v1.4-runtime'},
                       'assetFiles': 0, 'status': 'authoring-draft', 'runtimeReady': False,
                       'modelPerformanceTested': False, 'published': False,
                       'githubUploaded': False, 'engineFilesChanged': [], 'sourceSha256': source_sha,
                       'releaseNeeds': ['artwork', 'live-model-playtest', 'director-user-focus-conflict-review',
                                        'friend-mode-and-scene-entry-behavior-validation',
                                        'bible98-fixed-introduction-rendering-and-ui-verification']})
    print(json.dumps({'built': True, 'chapters': len(chapters), 'npcCount': len(cast),
                      'published': False}, ensure_ascii=False))
    # Generated images are integrated only after the full set is collected.
    import runpy
    runpy.run_path(str(ROOT / 'visuals/illustrate.py'), run_name='__main__')


if __name__ == '__main__':
    main()
