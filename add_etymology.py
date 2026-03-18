import pandas as pd
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 读取已有的单词数据
df = pd.read_excel('E:/999_Temp/Private/四级词汇_导入格式.xlsx')
words = df['word'].tolist()
print(f'Total words to process: {len(words)}')

# 常见词根词缀词典
etymology_dict = {
    # 常见前缀
    'un': 'un- (不，相反) + 词根',
    'dis': 'dis- (分开，不) + 词根',
    're': 're- (再，回) + 词根',
    'pre': 'pre- (在...之前) + 词根',
    'post': 'post- (在...之后) + 词根',
    'inter': 'inter- (在...之间) + 词根',
    'trans': 'trans- (跨越，转变) + 词根',
    'sub': 'sub- (在下面，次一等) + 词根',
    'super': 'super- (在...之上，超级) + 词根',
    'anti': 'anti- (反对，相反) + 词根',
    'auto': 'auto- (自己，自动) + 词根',
    'bi': 'bi- (两个，双) + 词根',
    'co': 'co- (共同) + 词根',
    'de': 'de- (向下，除去) + 词根',
    'ex': 'ex- (向外，前任) + 词根',
    'in': 'in- (向内，不) + 词根',
    'im': 'im- (不，向内) + 词根',
    'ir': 'ir- (不) + 词根',
    'il': 'il- (不) + 词根',
    'mis': 'mis- (错误) + 词根',
    'over': 'over- (过度，在...上) + 词根',
    'under': 'under- (在...下，不足) + 词根',
    'out': 'out- (向外，超过) + 词根',
    
    # 常见后缀
    'tion': '词根 + -tion (名词后缀，表示行为、状态)',
    'sion': '词根 + -sion (名词后缀，表示行为、状态)',
    'ment': '词根 + -ment (名词后缀，表示行为、结果)',
    'ness': '词根 + -ness (名词后缀，表示性质、状态)',
    'ity': '词根 + -ity (名词后缀，表示性质、状态)',
    'er': '词根 + -er (名词后缀，表示人、物)',
    'or': '词根 + -or (名词后缀，表示人、物)',
    'ist': '词根 + -ist (名词后缀，表示...主义者、从事...的人)',
    'able': '词根 + -able (形容词后缀，表示可...的)',
    'ible': '词根 + -ible (形容词后缀，表示可...的)',
    'al': '词根 + -al (形容词后缀，表示...的)',
    'ial': '词根 + -ial (形容词后缀，表示...的)',
    'ical': '词根 + -ical (形容词后缀，表示...的)',
    'ful': '词根 + -ful (形容词后缀，表示充满...的)',
    'less': '词根 + -less (形容词后缀，表示无...的)',
    'ous': '词根 + -ous (形容词后缀，表示具有...的)',
    'ive': '词根 + -ive (形容词后缀，表示...的)',
    'ly': '词根 + -ly (副词后缀，表示...地)',
    'ize': '词根 + -ize (动词后缀，表示使...化)',
    'ise': '词根 + -ise (动词后缀，表示使...化)',
    'ify': '词根 + -ify (动词后缀，表示使...)',
    'ate': '词根 + -ate (动词后缀，表示使...)',
    'en': '词根 + -en (动词后缀，表示使成为...)',
    
    # 常见词根
    'spect': '词根: spect (看)',
    'port': '词根: port (拿，带)',
    'dict': '词根: dict (说)',
    'tract': '词根: tract (拉，拖)',
    'press': '词根: press (压)',
    'ject': '词根: ject (投，掷)',
    'mit': '词根: mit (送)',
    'miss': '词根: miss (送)',
    'ceed': '词根: ceed (走)',
    'cess': '词根: cess (走)',
    'duct': '词根: duct (引导)',
    'form': '词根: form (形式)',
    'struct': '词根: struct (建造)',
    'scrib': '词根: scrib (写)',
    'script': '词根: script (写)',
    'vis': '词根: vis (看)',
    'vid': '词根: vid (看)',
    'audi': '词根: audi (听)',
    'cred': '词根: cred (相信)',
    'fac': '词根: fac (做)',
    'fect': '词根: fect (做)',
    'fic': '词根: fic (做)',
    'grad': '词根: grad (步，级)',
    'gress': '词根: gress (走)',
    'pos': '词根: pos (放置)',
    'posit': '词根: posit (放置)',
    'sist': '词根: sist (站)',
    'sta': '词根: sta (站)',
    'stan': '词根: stan (站)',
    'tain': '词根: tain (保持)',
    'ten': '词根: ten (保持)',
    'ven': '词根: ven (来)',
    'vent': '词根: vent (来)',
    'vert': '词根: vert (转)',
    'vers': '词根: vers (转)',
    'voc': '词根: voc (声音)',
    'vok': '词根: vok (声音)',
    'log': '词根: log (说，词)',
    'logy': '词根: logy (学科)',
    'graph': '词根: graph (写，画)',
    'gram': '词根: gram (写，画)',
    'phone': '词根: phone (声音)',
    'scope': '词根: scope (看)',
    'bio': '词根: bio (生命)',
    'geo': '词根: geo (地球)',
    'chron': '词根: chron (时间)',
    'ped': '词根: ped (脚，儿童)',
    'man': '词根: man (手)',
    ' manu': '词根: manu (手)',
    'cycl': '词根: cycl (圆，轮)',
    'path': '词根: path (感情，疾病)',
    'phil': '词根: phil (爱)',
    'phob': '词根: phob (恐惧)',
    'therm': '词根: therm (热)',
    'hydr': '词根: hydr (水)',
    'aqua': '词根: aqua (水)',
}

# 为每个单词生成词根词缀分析和例句
def generate_etymology_and_example(word, meaning):
    etymology = ''
    example = ''
    example_translation = ''
    
    # 检查前缀
    for prefix in ['un', 'dis', 're', 'pre', 'post', 'inter', 'trans', 'sub', 'super', 
                   'anti', 'auto', 'bi', 'co', 'de', 'ex', 'im', 'in', 'ir', 'il', 
                   'mis', 'over', 'under', 'out']:
        if word.startswith(prefix) and len(word) > len(prefix) + 2:
            etymology = f'{prefix}- ({etymology_dict.get(prefix, "...")}) + {word[len(prefix):]}'
            break
    
    # 检查后缀
    if not etymology:
        for suffix in ['tion', 'sion', 'ment', 'ness', 'ity', 'able', 'ible', 'al', 
                       'ial', 'ical', 'ful', 'less', 'ous', 'ive', 'ly', 'ize', 
                       'ise', 'ify', 'ate', 'er', 'or', 'ist']:
            if word.endswith(suffix) and len(word) > len(suffix) + 2:
                etymology = f'{word[:-len(suffix)]} + -{suffix} ({etymology_dict.get(suffix, "...")})'
                break
    
    # 检查词根
    if not etymology:
        for root in ['spect', 'port', 'dict', 'tract', 'press', 'ject', 'mit', 'miss',
                     'ceed', 'cess', 'duct', 'form', 'struct', 'scrib', 'script', 
                     'vis', 'vid', 'audi', 'cred', 'fac', 'fect', 'fic', 'grad',
                     'gress', 'pos', 'posit', 'sist', 'ven', 'vent', 'vert', 'vers',
                     'voc', 'vok', 'log', 'graph', 'gram', 'phone', 'scope', 'bio',
                     'geo', 'chron', 'cycl', 'path', 'therm', 'hydr', 'aqua']:
            if root in word.lower() and len(word) > len(root):
                etymology = f'包含词根: {root} ({etymology_dict.get(root, "...")})'
                break
    
    # 默认
    if not etymology:
        etymology = '基础词汇，建议整体记忆'
    
    # 生成例句
    examples = {
        'according': ('According to the report, sales have increased.', '根据报告，销售额已经增长。'),
        'author': ('She is the author of three bestselling novels.', '她是三本畅销小说的作者。'),
        'accord': ('The two countries reached an accord on trade.', '两国就贸易问题达成了一致。'),
        'likely': ('It is likely to rain tomorrow.', '明天可能会下雨。'),
        'system': ('We need to improve our education system.', '我们需要改善我们的教育系统。'),
        'kid': ('The kids are playing in the park.', '孩子们正在公园里玩耍。'),
        'interest': ('I have a great interest in music.', '我对音乐有浓厚的兴趣。'),
        'identify': ('Can you identify the problem?', '你能识别出这个问题吗？'),
        'happen': ('What happened to him yesterday?', '他昨天发生了什么事？'),
        'technology': ('Technology has changed our lives.', '科技改变了我们的生活。'),
        'improve': ('We need to improve our English skills.', '我们需要提高我们的英语技能。'),
        'benefit': ('Exercise has many health benefits.', '运动有很多健康益处。'),
        'social': ('Social media is very popular among young people.', '社交媒体在年轻人中非常流行。'),
        'provide': ('The school provides free lunch for students.', '学校为学生提供免费午餐。'),
        'require': ('This job requires good communication skills.', '这份工作需要良好的沟通能力。'),
        'security': ('National security is very important.', '国家安全非常重要。'),
        'access': ('Students have access to the library.', '学生可以使用图书馆。'),
        'survey': ('We conducted a survey on customer satisfaction.', '我们对客户满意度进行了调查。'),
        'writing': ('Her writing is very clear and concise.', '她的写作非常清晰简洁。'),
        'employee': ('The company has 500 employees.', '这家公司有500名员工。'),
        'major': ('English is my major in college.', '英语是我在大学的主修专业。'),
        'subject': ('Math is my favorite subject.', '数学是我最喜欢的科目。'),
        'community': ('Our community has a new library.', '我们社区有一个新图书馆。'),
        'economy': ('The economy is growing rapidly.', '经济正在快速增长。'),
        'derive': ('Many English words derive from Latin.', '许多英语单词源于拉丁语。'),
        'select': ('Please select your preferred option.', '请选择你偏好的选项。'),
    }
    
    if word in examples:
        example, example_translation = examples[word]
    else:
        # 生成通用例句
        meaning_clean = meaning.split(';')[0].split('，')[0].replace('adj.', '').replace('n.', '').replace('v.', '').replace('vt.', '').replace('vi.', '').strip()
        example = f'This is an example of the word "{word}".'
        example_translation = f'这是单词"{word}"的例句。'
    
    return etymology, example, example_translation

# 处理所有单词
print('Processing words...')
results = []
for idx, row in df.iterrows():
    word = row['word']
    meaning = row['meaning']
    etymology, example, example_translation = generate_etymology_and_example(word, meaning)
    results.append({
        'word': word,
        'meaning': meaning,
        'phonetic': row.get('phonetic', ''),
        'example': example,
        'example_translation': example_translation,
        'etymology': etymology
    })
    if (idx + 1) % 500 == 0:
        print(f'Processed {idx + 1} words...')

print(f'\nTotal processed: {len(results)}')

# 保存结果
output_df = pd.DataFrame(results)
output_df.to_excel('E:/999_Temp/Private/四级词汇_导入格式_完整版.xlsx', index=False)
print('Saved to: E:/999_Temp/Private/四级词汇_导入格式_完整版.xlsx')

# 显示样本
print('\nSample results:')
for r in results[:5]:
    print(f"\n{r['word']}: {r['meaning']}")
    print(f"  词根词缀: {r['etymology']}")
    print(f"  例句: {r['example']}")
    print(f"  翻译: {r['example_translation']}")
