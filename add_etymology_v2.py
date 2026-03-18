import pandas as pd
import sys
import io
import json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 读取已有的单词数据
df = pd.read_excel('E:/999_Temp/Private/四级词汇_导入格式.xlsx')
print(f'Total words to process: {len(df)}')

# 完整的词根词缀和例句数据库
word_data = {
    # A
    'according': {
        'etymology': 'accord (一致) + -ing → 按照，依据',
        'example': 'According to the weather forecast, it will rain tomorrow.',
        'translation': '根据天气预报，明天会下雨。'
    },
    'author': {
        'etymology': 'aug- (增加) + -thor → 创造者，作者',
        'example': 'The author of this book is very famous.',
        'translation': '这本书的作者非常有名。'
    },
    'accord': {
        'etymology': 'ac- (加强) + cord (心) → 心心相印，一致',
        'example': 'The two sides reached an accord on the trade agreement.',
        'translation': '双方就贸易协定达成了一致。'
    },
    'likely': {
        'etymology': 'like (像) + -ly (形容词后缀) → 可能的',
        'example': 'It is likely that he will win the competition.',
        'translation': '他很可能会赢得比赛。'
    },
    'system': {
        'etymology': '来自希腊语 systema，意为"有组织的整体"',
        'example': 'We need to improve our education system.',
        'translation': '我们需要改善我们的教育系统。'
    },
    'kid': {
        'etymology': '古英语，原指"小山羊"，后引申为"小孩"',
        'example': 'The kids are playing in the park.',
        'translation': '孩子们正在公园里玩耍。'
    },
    'interest': {
        'etymology': 'inter- (在...之间) + est (存在) → 在两者之间产生的关系，利益；兴趣',
        'example': 'I have a strong interest in learning languages.',
        'translation': '我对学习语言有浓厚的兴趣。'
    },
    'identify': {
        'etymology': 'ident- (相同) + -ify (动词后缀，使...) → 使相同，识别',
        'example': 'Can you identify the main problem in this situation?',
        'translation': '你能识别出这种情况下的主要问题吗？'
    },
    'happen': {
        'etymology': 'hap (运气，机会) + -en (动词后缀) → 碰巧发生',
        'example': 'What happened to you yesterday?',
        'translation': '你昨天发生了什么事？'
    },
    'technology': {
        'etymology': 'techn- (技艺) + -ology (学科) → 技术学，工艺学',
        'example': 'Modern technology has changed our way of life.',
        'translation': '现代科技改变了我们的生活方式。'
    },
    'improve': {
        'etymology': 'im- (加强) + prove (证明，验证) → 使更好，改进',
        'example': 'You need to improve your English pronunciation.',
        'translation': '你需要改进你的英语发音。'
    },
    'benefit': {
        'etymology': 'bene- (好) + fit (做) → 做好事，利益',
        'example': 'Regular exercise has many health benefits.',
        'translation': '经常锻炼有很多健康益处。'
    },
    'social': {
        'etymology': 'soci- (社会，同伴) + -al (形容词后缀) → 社会的',
        'example': 'Social media has become part of our daily life.',
        'translation': '社交媒体已成为我们日常生活的一部分。'
    },
    'provide': {
        'etymology': 'pro- (向前) + vid (看) → 预先看到并准备，提供',
        'example': 'The hotel provides free breakfast for guests.',
        'translation': '酒店为客人提供免费早餐。'
    },
    'require': {
        'etymology': 're- (反复) + quir (寻求) + -e → 反复寻求，需要',
        'example': 'This job requires excellent communication skills.',
        'translation': '这份工作需要优秀的沟通技巧。'
    },
    'security': {
        'etymology': 'se- (离开) + cur (关心) + -ity (名词后缀) → 不用担心，安全',
        'example': 'National security is a top priority for every country.',
        'translation': '国家安全是每个国家的首要任务。'
    },
    'access': {
        'etymology': 'ac- (加强) + cess (走) → 走向，接近，通路',
        'example': 'Students have free access to the library.',
        'translation': '学生可以免费使用图书馆。'
    },
    'survey': {
        'etymology': 'sur- (在上面) + vey (看) → 从上往下看，调查',
        'example': 'We conducted a survey to understand customer needs.',
        'translation': '我们进行了一项调查以了解客户需求。'
    },
    'writing': {
        'etymology': 'write (写) + -ing (名词后缀) → 写作，书写',
        'example': 'Academic writing requires formal language.',
        'translation': '学术写作需要使用正式语言。'
    },
    'employee': {
        'etymology': 'employ (雇佣) + -ee (被...的人) → 被雇佣者，员工',
        'example': 'The company has over 1000 employees.',
        'translation': '这家公司有超过1000名员工。'
    },
    'major': {
        'etymology': 'maj- (大) + -or (比较级) → 较大的，主要的',
        'example': 'English is my major at university.',
        'translation': '英语是我在大学的主修专业。'
    },
    'subject': {
        'etymology': 'sub- (在下面) + ject (投掷) → 投掷在下面的，主题；科目',
        'example': 'Math is my favorite subject in school.',
        'translation': '数学是我在学校最喜欢的科目。'
    },
    'community': {
        'etymology': 'com- (共同) + mun (服务) + -ity (名词后缀) → 共同服务的群体，社区',
        'example': 'Our community organizes various activities.',
        'translation': '我们社区组织各种活动。'
    },
    'economy': {
        'etymology': 'eco- (家庭) + -nomy (管理) → 家庭管理，经济',
        'example': 'The global economy is facing challenges.',
        'translation': '全球经济正面临挑战。'
    },
    'derive': {
        'etymology': 'de- (向下) + riv (河流) + -e → 从河流引水，源于',
        'example': 'Many English words derive from Latin.',
        'translation': '许多英语单词源于拉丁语。'
    },
    'select': {
        'etymology': 'se- (分开) + lect (选择) → 分开挑选，选择',
        'example': 'Please select the items you want to buy.',
        'translation': '请选择你想购买的物品。'
    },
    # B
    'benefit': {
        'etymology': 'bene- (好) + fit (做) → 做好事，利益',
        'example': 'Regular exercise brings many health benefits.',
        'translation': '经常锻炼带来许多健康益处。'
    },
    'basis': {
        'etymology': 'bas- (底座) + -is → 基础，根据',
        'example': 'We made this decision on the basis of facts.',
        'translation': '我们根据事实做出了这个决定。'
    },
    'behavior': {
        'etymology': 'behave (行为) + -ior (名词后缀) → 行为，举止',
        'example': 'His behavior at the meeting was inappropriate.',
        'translation': '他在会议上的行为不恰当。'
    },
    'believe': {
        'etymology': 'be- (使) + lieve (爱，信任) → 使相信',
        'example': 'I believe that you can succeed.',
        'translation': '我相信你能成功。'
    },
    'belong': {
        'etymology': 'be- (使) + long (长) → 属于',
        'example': 'This book belongs to the library.',
        'translation': '这本书属于图书馆。'
    },
    'below': {
        'etymology': 'be- (在) + low (低) → 在下面',
        'example': 'Please sign your name below the line.',
        'translation': '请在线下签名。'
    },
    'beyond': {
        'etymology': 'be- (在) + yond (那边) → 在那边，超出',
        'example': 'The situation is beyond our control.',
        'translation': '情况超出了我们的控制。'
    },
    'birth': {
        'etymology': '古英语，意为"出生"',
        'example': 'She gave birth to a healthy baby.',
        'translation': '她生下了一个健康的宝宝。'
    },
    'blame': {
        'etymology': '古法语，意为"责备"',
        'example': 'Don\'t blame others for your mistakes.',
        'translation': '不要因为你的错误而责怪别人。'
    },
    'blank': {
        'etymology': '古法语，意为"白色的，空白的"',
        'example': 'Please fill in the blank with the correct word.',
        'translation': '请在空白处填入正确的单词。'
    },
    'block': {
        'etymology': '古法语，意为"木块"',
        'example': 'The road was blocked by a fallen tree.',
        'translation': '道路被一棵倒下的树堵住了。'
    },
    'board': {
        'etymology': '古英语，意为"木板"',
        'example': 'All passengers should board the ship now.',
        'translation': '所有乘客现在应该登船。'
    },
    'brain': {
        'etymology': '古英语，意为"大脑"',
        'example': 'The human brain is very complex.',
        'translation': '人的大脑非常复杂。'
    },
    'branch': {
        'etymology': '古法语，意为"树枝"',
        'example': 'The company has branches in many cities.',
        'translation': '这家公司在许多城市都有分公司。'
    },
    'brand': {
        'etymology': '古英语，意为"燃烧，烙印"',
        'example': 'This brand is very popular among young people.',
        'translation': '这个品牌在年轻人中很受欢迎。'
    },
    'break': {
        'etymology': '古英语，意为"断裂"',
        'example': 'Don\'t break the rules.',
        'translation': '不要违反规则。'
    },
    'breath': {
        'etymology': '古英语，意为"呼吸"',
        'example': 'Take a deep breath and relax.',
        'translation': '深呼吸，放松一下。'
    },
    'bridge': {
        'etymology': '古英语，意为"桥"',
        'example': 'They built a new bridge across the river.',
        'translation': '他们在河上建了一座新桥。'
    },
    'brief': {
        'etymology': '拉丁语 brevis，意为"短的"',
        'example': 'Please give a brief introduction of yourself.',
        'translation': '请简短地介绍一下你自己。'
    },
    'bright': {
        'etymology': '古英语，意为"明亮的"',
        'example': 'The future looks bright for this company.',
        'translation': '这家公司的前景看起来很光明。'
    },
    'broad': {
        'etymology': '古英语，意为"宽阔的"',
        'example': 'The river is broad at this point.',
        'translation': '这条河在这里很宽。'
    },
    'budget': {
        'etymology': '古法语 bougette，意为"小袋子"（装钱的）',
        'example': 'We need to balance the budget this year.',
        'translation': '我们需要平衡今年的预算。'
    },
    'build': {
        'etymology': '古英语，意为"建造"',
        'example': 'They plan to build a new school.',
        'translation': '他们计划建一所新学校。'
    },
    'burden': {
        'etymology': '古英语，意为"负担"',
        'example': 'He carried the burden of his family alone.',
        'translation': '他独自承担了家庭的重担。'
    },
    'bureaucracy': {
        'etymology': 'bureau (办公室) + -cracy (统治) → 官僚制度',
        'example': 'The bureaucracy makes things move slowly.',
        'translation': '官僚制度使事情进展缓慢。'
    },
    # C
    'calculate': {
        'etymology': 'calcul- (小石子，用于计数) + -ate (动词后缀) → 计算',
        'example': 'We need to calculate the total cost.',
        'translation': '我们需要计算总成本。'
    },
    'campaign': {
        'etymology': 'camp (田野) + -aign → 在田野上作战，运动',
        'example': 'The company launched a marketing campaign.',
        'translation': '公司发起了一场营销活动。'
    },
    'cancel': {
        'etymology': '拉丁语 cancelli，意为"格子"（划掉）',
        'example': 'The meeting was cancelled due to bad weather.',
        'translation': '会议因天气恶劣被取消。'
    },
    'candidate': {
        'etymology': 'candid- (白色) + -ate → 穿白袍的人，候选人',
        'example': 'He is a candidate for the position.',
        'translation': '他是这个职位的候选人。'
    },
    'capacity': {
        'etymology': 'cap- (拿) + -acity (名词后缀) → 能容纳的能力，容量',
        'example': 'The stadium has a capacity of 50,000.',
        'translation': '体育场可容纳5万人。'
    },
    'capture': {
        'etymology': 'capt- (拿) + -ure (名词/动词后缀) → 捕获',
        'example': 'The police captured the criminal.',
        'translation': '警察捕获了罪犯。'
    },
    'career': {
        'etymology': 'car (车) + -eer → 道路，职业',
        'example': 'She has a successful career in medicine.',
        'translation': '她在医学领域有成功的职业生涯。'
    },
    'careful': {
        'etymology': 'care (关心) + -ful (充满...的) → 小心的',
        'example': 'Be careful when crossing the street.',
        'translation': '过马路时要小心。'
    },
    'carry': {
        'etymology': '古英语，意为"携带"',
        'example': 'Can you help me carry this box?',
        'translation': '你能帮我搬这个箱子吗？'
    },
    'case': {
        'etymology': '拉丁语 casus，意为"落下，事件"',
        'example': 'In case of emergency, call 911.',
        'translation': '如遇紧急情况，请拨打911。'
    },
    'category': {
        'etymology': '希腊语 kategorein，意为"指控，归类"',
        'example': 'This product falls into a different category.',
        'translation': '这个产品属于不同的类别。'
    },
    'cause': {
        'etymology': '拉丁语 causa，意为"原因"',
        'example': 'What was the cause of the accident?',
        'translation': '事故的原因是什么？'
    },
    'cease': {
        'etymology': '拉丁语 cessare，意为"停止"',
        'example': 'The fighting has ceased.',
        'translation': '战斗已经停止。'
    },
    'celebrate': {
        'etymology': 'celebr- (著名的) + -ate → 使著名，庆祝',
        'example': 'We celebrate New Year\'s Day on January 1st.',
        'translation': '我们在1月1日庆祝元旦。'
    },
    'central': {
        'etymology': 'center (中心) + -al (形容词后缀) → 中心的',
        'example': 'The central government made the decision.',
        'translation': '中央政府做出了这个决定。'
    },
    'century': {
        'etymology': 'cent (百) + -ury → 一百年',
        'example': 'We are living in the 21st century.',
        'translation': '我们生活在21世纪。'
    },
    'certain': {
        'etymology': 'cert- (确定) + -ain → 确定的',
        'example': 'I am certain that he will come.',
        'translation': '我确定他会来。'
    },
    'challenge': {
        'etymology': '古法语，意为"挑战"',
        'example': 'This job is a big challenge for me.',
        'translation': '这份工作对我来说是一个巨大的挑战。'
    },
    'champion': {
        'etymology': 'camp (田野) + -ion → 战场上的胜利者，冠军',
        'example': 'She became the world champion in swimming.',
        'translation': '她成为了游泳世界冠军。'
    },
    'channel': {
        'etymology': '拉丁语 canalis，意为"管道"',
        'example': 'Change the channel to watch the news.',
        'translation': '换频道看新闻。'
    },
    'chapter': {
        'etymology': '希腊语 kephalē，意为"头"（章节的开头）',
        'example': 'Read Chapter 1 for homework.',
        'translation': '阅读第一章作为作业。'
    },
    'character': {
        'etymology': '希腊语 charaktēr，意为"刻印，特征"',
        'example': 'He has a strong character.',
        'translation': '他性格坚强。'
    },
    'charge': {
        'etymology': '古法语，意为"装载，负责"',
        'example': 'He was charged with stealing.',
        'translation': '他被指控偷窃。'
    },
    'chart': {
        'etymology': '拉丁语 charta，意为"纸，地图"',
        'example': 'Look at the chart on page 10.',
        'translation': '看第10页的图表。'
    },
    'chase': {
        'etymology': '古法语，意为"追逐"',
        'example': 'The dog chased the cat up the tree.',
        'translation': '狗把猫追上了树。'
    },
    'cheap': {
        'etymology': '古英语，意为"交易，便宜"',
        'example': 'This shirt is very cheap.',
        'translation': '这件衬衫很便宜。'
    },
    'check': {
        'etymology': '古法语 eschec，意为"将军"（象棋）',
        'example': 'Please check your answers before submitting.',
        'translation': '提交前请检查你的答案。'
    },
    'chemical': {
        'etymology': 'chem- (化学) + -ical (形容词后缀) → 化学的',
        'example': 'The factory produces chemical products.',
        'translation': '这家工厂生产化学产品。'
    },
    'chief': {
        'etymology': '古法语，意为"头，首领"',
        'example': 'He is the chief executive officer.',
        'translation': '他是首席执行官。'
    },
    'choice': {
        'etymology': 'choose (选择) + -ice (名词后缀) → 选择',
        'example': 'You have two choices.',
        'translation': '你有两个选择。'
    },
    'choose': {
        'etymology': '古英语，意为"选择"',
        'example': 'You can choose any book you like.',
        'translation': '你可以选择任何你喜欢的书。'
    },
    'church': {
        'etymology': '希腊语 kyriakon，意为"主的房子"',
        'example': 'They go to church every Sunday.',
        'translation': '他们每个星期天去教堂。'
    },
    'circle': {
        'etymology': '拉丁语 circulus，意为"圆圈"',
        'example': 'Draw a circle on the paper.',
        'translation': '在纸上画一个圆。'
    },
    'circumstance': {
        'etymology': 'circum- (周围) + st (站) + -ance → 站在周围的情况，环境',
        'example': 'Under the circumstances, we had no choice.',
        'translation': '在这种情况下，我们没有选择。'
    },
    'citizen': {
        'etymology': 'city (城市) + -zen (人) → 城市居民，公民',
        'example': 'Every citizen has the right to vote.',
        'translation': '每个公民都有投票权。'
    },
    'civil': {
        'etymology': '拉丁语 civilis，意为"市民的"',
        'example': 'They were involved in a civil war.',
        'translation': '他们卷入了一场内战。'
    },
    'claim': {
        'etymology': '拉丁语 clamare，意为"叫喊"',
        'example': 'He claimed that he was innocent.',
        'translation': '他声称自己是无辜的。'
    },
    'clarify': {
        'etymology': 'clar- (清楚) + -ify (使...) → 使清楚，澄清',
        'example': 'Could you clarify your point?',
        'translation': '你能澄清你的观点吗？'
    },
    'classic': {
        'etymology': 'class- (等级，阶级) + -ic → 第一流的，经典的',
        'example': 'This is a classic novel.',
        'translation': '这是一部经典小说。'
    },
    'classroom': {
        'etymology': 'class (班级) + room (房间) → 教室',
        'example': 'The students are in the classroom.',
        'translation': '学生们在教室里。'
    },
    'clear': {
        'etymology': '拉丁语 clarus，意为"明亮的，清楚的"',
        'example': 'It is clear that he is lying.',
        'translation': '很明显他在撒谎。'
    },
    'climate': {
        'etymology': '希腊语 klima，意为"倾斜，地带"（气候带）',
        'example': 'The climate in this region is mild.',
        'translation': '这个地区的气候温和。'
    },
    'climb': {
        'etymology': '古英语，意为"攀爬"',
        'example': 'We climbed the mountain last weekend.',
        'translation': '我们上周末爬了山。'
    },
    'clinical': {
        'etymology': 'clinic (诊所) + -al → 临床的',
        'example': 'Clinical trials are necessary for new drugs.',
        'translation': '临床试验对新药是必要的。'
    },
    'close': {
        'etymology': '拉丁语 claudere，意为"关闭"',
        'example': 'The store closes at 9 p.m.',
        'translation': '商店晚上9点关门。'
    },
    'clothes': {
        'etymology': 'cloth (布) + -es → 衣服',
        'example': 'She bought some new clothes.',
        'translation': '她买了一些新衣服。'
    },
    'coach': {
        'etymology': '匈牙利语 kocsi，意为"马车"（从Kocs镇来）',
        'example': 'Our coach is very strict.',
        'translation': '我们的教练非常严格。'
    },
    'coast': {
        'etymology': '拉丁语 costa，意为"肋骨，侧面"（海岸）',
        'example': 'We visited the east coast.',
        'translation': '我们参观了东海岸。'
    },
    'code': {
        'etymology': '拉丁语 codex，意为"木板，法典"',
        'example': 'You need to enter the correct code.',
        'translation': '你需要输入正确的代码。'
    },
    'coffee': {
        'etymology': '阿拉伯语 qahwa，意为"咖啡"',
        'example': 'I drink coffee every morning.',
        'translation': '我每天早上喝咖啡。'
    },
    'coin': {
        'etymology': '拉丁语 cuneus，意为"楔子"（铸币模具）',
        'example': 'I found a coin on the street.',
        'translation': '我在街上发现了一枚硬币。'
    },
    'collapse': {
        'etymology': 'col- (共同) + lapse (滑落) → 一起滑落，倒塌',
        'example': 'The building collapsed during the earthquake.',
        'translation': '建筑在地震中倒塌了。'
    },
    'colleague': {
        'etymology': 'col- (共同) + league (选择) → 一起被选择的人，同事',
        'example': 'He is my colleague at work.',
        'translation': '他是我的工作同事。'
    },
    'collect': {
        'etymology': 'col- (共同) + lect (选择) → 集合，收集',
        'example': 'I collect stamps as a hobby.',
        'translation': '我集邮作为一种爱好。'
    },
    'collection': {
        'etymology': 'collect (收集) + -ion (名词后缀) → 收藏',
        'example': 'He has a large collection of books.',
        'translation': '他收藏了大量书籍。'
    },
    'collective': {
        'etymology': 'collect (收集) + -ive (形容词后缀) → 集体的',
        'example': 'We made a collective decision.',
        'translation': '我们做出了一个集体决定。'
    },
    'college': {
        'etymology': 'col- (共同) + leg (选择) + -e → 一起学习的地方，学院',
        'example': 'She goes to a prestigious college.',
        'translation': '她上一所著名的学院。'
    },
    'combine': {
        'etymology': 'com- (共同) + bi (两个) + -ne → 结合',
        'example': 'Combine the flour and eggs.',
        'translation': '把面粉和鸡蛋混合。'
    },
    'come': {
        'etymology': '古英语，意为"来"',
        'example': 'Can you come to my party?',
        'translation': '你能来我的派对吗？'
    },
    'comedy': {
        'etymology': '希腊语 kōmōidia，意为"喜剧"',
        'example': 'We watched a comedy last night.',
        'translation': '我们昨晚看了一部喜剧。'
    },
    'comfort': {
        'etymology': 'com- (加强) + fort (力量) → 使有力量，安慰',
        'example': 'She needs some comfort after the loss.',
        'translation': '她在失去后需要一些安慰。'
    },
    'comfortable': {
        'etymology': 'comfort (舒适) + -able (能...的) → 舒适的',
        'example': 'This chair is very comfortable.',
        'translation': '这把椅子非常舒适。'
    },
    'command': {
        'etymology': 'com- (加强) + mand (命令) → 命令',
        'example': 'The general commanded the army.',
        'translation': '将军指挥军队。'
    },
    'comment': {
        'etymology': 'com- (加强) + ment (思考) → 评论',
        'example': 'Please leave a comment below.',
        'translation': '请在下面留言。'
    },
    'commercial': {
        'etymology': 'commerce (商业) + -ial (形容词后缀) → 商业的',
        'example': 'This is a commercial area.',
        'translation': '这是一个商业区。'
    },
    'commission': {
        'etymology': 'com- (共同) + miss (送) + -ion → 委托，委员会',
        'example': 'He received a commission for the sale.',
        'translation': '他因销售获得了佣金。'
    },
    'commit': {
        'etymology': 'com- (加强) + mit (送) → 交付，承诺',
        'example': 'He committed to finishing the project.',
        'translation': '他承诺完成这个项目。'
    },
    'commitment': {
        'etymology': 'commit (承诺) + -ment (名词后缀) → 承诺',
        'example': 'This job requires a strong commitment.',
        'translation': '这份工作需要强烈的承诺。'
    },
    'committee': {
        'etymology': 'commit (委托) + -tee (被...的人) → 委员会',
        'example': 'The committee will meet tomorrow.',
        'translation': '委员会明天开会。'
    },
    'commodity': {
        'etymology': 'com- (共同) + mod (方式) + -ity → 商品',
        'example': 'Oil is an important commodity.',
        'translation': '石油是一种重要的商品。'
    },
    'common': {
        'etymology': 'com- (共同) + mon (服务) → 共同的，普通的',
        'example': 'This is a common mistake.',
        'translation': '这是一个常见的错误。'
    },
    'communicate': {
        'etymology': 'com- (共同) + muni (服务) + -cate → 交流',
        'example': 'We communicate by email.',
        'translation': '我们通过电子邮件交流。'
    },
    'communication': {
        'etymology': 'communicate (交流) + -ion (名词后缀) → 交流',
        'example': 'Communication is important in relationships.',
        'translation': '沟通在关系中很重要。'
    },
    'community': {
        'etymology': 'com- (共同) + mun (服务) + -ity → 社区',
        'example': 'Our community has many activities.',
        'translation': '我们社区有很多活动。'
    },
    'company': {
        'etymology': 'com- (共同) + pan (面包) + -y → 一起吃面包的人，公司',
        'example': 'He works for a large company.',
        'translation': '他为一家大公司工作。'
    },
    'compare': {
        'etymology': 'com- (共同) + par (平等) + -e → 比较',
        'example': 'Compare the two products.',
        'translation': '比较这两种产品。'
    },
    'comparison': {
        'etymology': 'compare (比较) + -ison (名词后缀) → 比较',
        'example': 'There is no comparison between them.',
        'translation': '它们之间没有可比性。'
    },
    'compel': {
        'etymology': 'com- (加强) + pel (推) → 强迫',
        'example': 'The evidence compelled him to confess.',
        'translation': '证据迫使他认罪。'
    },
    'compensate': {
        'etymology': 'com- (加强) + pens (称重) + -ate → 补偿',
        'example': 'The company will compensate you for the loss.',
        'translation': '公司将赔偿你的损失。'
    },
    'compete': {
        'etymology': 'com- (共同) + pet (寻求) + -e → 竞争',
        'example': 'Many companies compete in this market.',
        'translation': '许多公司在这个市场竞争。'
    },
    'competence': {
        'etymology': 'competent (有能力的) + -ence (名词后缀) → 能力',
        'example': 'She demonstrated her competence in the interview.',
        'translation': '她在面试中展示了她的能力。'
    },
    'competition': {
        'etymology': 'compete (竞争) + -ition (名词后缀) → 竞争',
        'example': 'The competition is very strong.',
        'translation': '竞争非常激烈。'
    },
    'competitive': {
        'etymology': 'compete (竞争) + -itive (形容词后缀) → 有竞争力的',
        'example': 'The market is highly competitive.',
        'translation': '市场竞争激烈。'
    },
    'competitor': {
        'etymology': 'compete (竞争) + -itor (人) → 竞争者',
        'example': 'Our competitor lowered their prices.',
        'translation': '我们的竞争对手降低了价格。'
    },
    'complain': {
        'etymology': 'com- (加强) + plain (抱怨) → 抱怨',
        'example': 'Don\'t complain about everything.',
        'translation': '不要抱怨一切。'
    },
    'complaint': {
        'etymology': 'complain (抱怨) + -t (名词后缀) → 投诉',
        'example': 'I have a complaint about the service.',
        'translation': '我对服务有投诉。'
    },
    'complete': {
        'etymology': 'com- (加强) + plet (填满) + -e → 完成',
        'example': 'Please complete the form.',
        'translation': '请填写表格。'
    },
    'complex': {
        'etymology': 'com- (共同) + plex (编织) → 复杂的',
        'example': 'This is a complex problem.',
        'translation': '这是一个复杂的问题。'
    },
    'complicated': {
        'etymology': 'complicate (使复杂) + -d → 复杂的',
        'example': 'The situation is very complicated.',
        'translation': '情况非常复杂。'
    },
    'component': {
        'etymology': 'com- (共同) + pon (放置) + -ent → 成分，组件',
        'example': 'Each component is important.',
        'translation': '每个组件都很重要。'
    },
    'compose': {
        'etymology': 'com- (共同) + pos (放置) + -e → 组成，作曲',
        'example': 'She composed a beautiful song.',
        'translation': '她创作了一首美丽的歌。'
    },
    'composition': {
        'etymology': 'compose (组成) + -ition (名词后缀) → 作文，组成',
        'example': 'Write a composition about your hobby.',
        'translation': '写一篇关于你爱好的作文。'
    },
    'comprehensive': {
        'etymology': 'com- (加强) + prehens (抓住) + -ive → 全面的',
        'example': 'This is a comprehensive guide.',
        'translation': '这是一份全面的指南。'
    },
    'comprise': {
        'etymology': 'com- (共同) + pris (抓住) + -e → 包含',
        'example': 'The team comprises five members.',
        'translation': '这个团队由五名成员组成。'
    },
    'compromise': {
        'etymology': 'com- (共同) + promis (承诺) → 妥协',
        'example': 'We need to find a compromise.',
        'translation': '我们需要找到一个折中方案。'
    },
    'computer': {
        'etymology': 'comput- (计算) + -er (物) → 计算机',
        'example': 'I use my computer every day.',
        'translation': '我每天都用电脑。'
    },
    'concentrate': {
        'etymology': 'con- (共同) + centr (中心) + -ate → 集中',
        'example': 'Please concentrate on your work.',
        'translation': '请专心于你的工作。'
    },
    'concept': {
        'etymology': 'con- (共同) + cept (抓住) → 概念',
        'example': 'This is a difficult concept to understand.',
        'translation': '这是一个很难理解的概念。'
    },
    'concern': {
        'etymology': 'con- (共同) + cern (分开) → 关心',
        'example': 'I am concerned about his health.',
        'translation': '我关心他的健康。'
    },
    'concert': {
        'etymology': 'con- (共同) + cert (确定) → 一致，音乐会',
        'example': 'We went to a concert last night.',
        'translation': '我们昨晚去了一场音乐会。'
    },
    'conclude': {
        'etymology': 'con- (加强) + clud (关闭) + -e → 总结',
        'example': 'We can conclude that he is innocent.',
        'translation': '我们可以得出结论他是无辜的。'
    },
    'conclusion': {
        'etymology': 'conclude (总结) + -ion (名词后缀) → 结论',
        'example': 'What is your conclusion?',
        'translation': '你的结论是什么？'
    },
    'condition': {
        'etymology': 'con- (共同) + dit (说) + -ion → 条件',
        'example': 'What are the conditions of the contract?',
        'translation': '合同的条件是什么？'
    },
    'conduct': {
        'etymology': 'con- (共同) + duct (引导) → 进行，行为',
        'example': 'He conducted the experiment carefully.',
        'translation': '他仔细地进行实验。'
    },
    'conference': {
        'etymology': 'confer (协商) + -ence (名词后缀) → 会议',
        'example': 'I attended a conference last week.',
        'translation': '我上周参加了一个会议。'
    },
    'confidence': {
        'etymology': 'con- (加强) + fid (相信) + -ence → 自信',
        'example': 'She has confidence in her abilities.',
        'translation': '她对自己的能力有信心。'
    },
    'confident': {
        'etymology': 'con- (加强) + fid (相信) + -ent → 自信的',
        'example': 'He is confident about the result.',
        'translation': '他对结果有信心。'
    },
    'confirm': {
        'etymology': 'con- (加强) + firm (坚固) → 确认',
        'example': 'Please confirm your reservation.',
        'translation': '请确认您的预订。'
    },
    'conflict': {
        'etymology': 'con- (共同) + flict (打击) → 冲突',
        'example': 'There was a conflict between the two groups.',
        'translation': '两组之间有冲突。'
    },
    'confront': {
        'etymology': 'con- (加强) + front (前面) → 面对',
        'example': 'We must confront the problem.',
        'translation': '我们必须面对这个问题。'
    },
    'confuse': {
        'etymology': 'con- (共同) + fus (倒) + -e → 混淆',
        'example': 'The instructions confused me.',
        'translation': '说明书让我困惑。'
    },
    'confusion': {
        'etymology': 'confuse (混淆) + -ion (名词后缀) → 困惑',
        'example': 'There was some confusion about the schedule.',
        'translation': '日程安排有一些混乱。'
    },
    'congratulate': {
        'etymology': 'con- (共同) + gratul (感谢) + -ate → 祝贺',
        'example': 'I want to congratulate you on your success.',
        'translation': '我想祝贺你的成功。'
    },
    'congress': {
        'etymology': 'con- (共同) + gress (走) → 会议，国会',
        'example': 'The Congress passed a new law.',
        'translation': '国会通过了一项新法律。'
    },
    'connect': {
        'etymology': 'con- (共同) + nect (绑) → 连接',
        'example': 'Connect the two wires.',
        'translation': '连接两根电线。'
    },
    'connection': {
        'etymology': 'connect (连接) + -ion (名词后缀) → 连接',
        'example': 'I have a good internet connection.',
        'translation': '我有一个好的互联网连接。'
    },
    'conquer': {
        'etymology': 'con- (加强) + quer (寻求) → 征服',
        'example': 'They conquered the enemy.',
        'translation': '他们征服了敌人。'
    },
    'conscious': {
        'etymology': 'con- (加强) + sci (知道) + -ous → 有意识的',
        'example': 'He was conscious during the operation.',
        'translation': '他在手术过程中是有意识的。'
    },
    'consciousness': {
        'etymology': 'conscious (有意识的) + -ness (名词后缀) → 意识',
        'example': 'He lost consciousness after the accident.',
        'translation': '事故后他失去了意识。'
    },
    'consensus': {
        'etymology': 'con- (共同) + sens (感觉) + -us → 共识',
        'example': 'We reached a consensus on the issue.',
        'translation': '我们在这个问题上达成了共识。'
    },
    'consequence': {
        'etymology': 'con- (加强) + sequ (跟随) + -ence → 后果',
        'example': 'Every action has consequences.',
        'translation': '每个行为都有后果。'
    },
    'conservation': {
        'etymology': 'con- (加强) + serv (保持) + -ation → 保护',
        'example': 'Wildlife conservation is important.',
        'translation': '野生动物保护很重要。'
    },
    'conservative': {
        'etymology': 'con- (加强) + serv (保持) + -ative → 保守的',
        'example': 'He has conservative views.',
        'translation': '他持有保守观点。'
    },
    'consider': {
        'etymology': 'con- (加强) + sider (星星) → 观察星星，考虑',
        'example': 'Please consider my proposal.',
        'translation': '请考虑我的提议。'
    },
    'considerable': {
        'etymology': 'consider (考虑) + -able → 相当大的',
        'example': 'He made a considerable effort.',
        'translation': '他付出了相当大的努力。'
    },
    'consideration': {
        'etymology': 'consider (考虑) + -ation (名词后缀) → 考虑',
        'example': 'Take this into consideration.',
        'translation': '把这点考虑进去。'
    },
    'consist': {
        'etymology': 'con- (共同) + sist (站) → 组成',
        'example': 'The team consists of ten members.',
        'translation': '这个团队由十名成员组成。'
    },
    'consistent': {
        'etymology': 'con- (共同) + sist (站) + -ent → 一致的',
        'example': 'His actions are consistent with his words.',
        'translation': '他的行为与他的话一致。'
    },
    'constant': {
        'etymology': 'con- (加强) + st (站) + -ant → 恒定的',
        'example': 'The temperature remained constant.',
        'translation': '温度保持恒定。'
    },
    'constitute': {
        'etymology': 'con- (共同) + stitut (放置) → 构成',
        'example': 'Women constitute 60% of the workforce.',
        'translation': '女性占劳动力的60%。'
    },
    'constitution': {
        'etymology': 'constitute (构成) + -ion (名词后缀) → 宪法',
        'example': 'The Constitution protects our rights.',
        'translation': '宪法保护我们的权利。'
    },
    'construct': {
        'etymology': 'con- (共同) + struct (建造) → 建造',
        'example': 'They are constructing a new building.',
        'translation': '他们正在建造一座新建筑。'
    },
    'construction': {
        'etymology': 'construct (建造) + -ion (名词后缀) → 建设',
        'example': 'The construction will finish next year.',
        'translation': '建设将于明年完成。'
    },
    'consult': {
        'etymology': 'con- (共同) + sult (坐) → 一起坐下讨论，咨询',
        'example': 'You should consult a doctor.',
        'translation': '你应该咨询医生。'
    },
    'consume': {
        'etymology': 'con- (加强) + sum (拿) + -e → 消费',
        'example': 'We consume too much sugar.',
        'translation': '我们消费了太多的糖。'
    },
    'consumer': {
        'etymology': 'consum- (消费) + -er (人) → 消费者',
        'example': 'Consumer demand is increasing.',
        'translation': '消费者需求正在增加。'
    },
    'consumption': {
        'etymology': 'consum- (消费) + -ption (名词后缀) → 消费',
        'example': 'The consumption of oil is rising.',
        'translation': '石油消费正在上升。'
    },
    'contact': {
        'etymology': 'con- (共同) + tact (接触) → 联系',
        'example': 'Please contact me by email.',
        'translation': '请通过电子邮件联系我。'
    },
    'contain': {
        'etymology': 'con- (加强) + tain (保持) → 包含',
        'example': 'The box contains books.',
        'translation': '箱子里装着书。'
    },
    'contemporary': {
        'etymology': 'con- (共同) + tempor (时间) + -ary → 同时代的',
        'example': 'He is a contemporary writer.',
        'translation': '他是一位当代作家。'
    },
    'content': {
        'etymology': 'con- (加强) + tent (保持) → 满足的；内容',
        'example': 'I am content with my life.',
        'translation': '我对我的生活感到满足。'
    },
    'contest': {
        'etymology': 'con- (共同) + test (证明) → 比赛',
        'example': 'She won the speech contest.',
        'translation': '她赢得了演讲比赛。'
    },
    'context': {
        'etymology': 'con- (共同) + text (编织) → 上下文',
        'example': 'Consider the context of the sentence.',
        'translation': '考虑句子的上下文。'
    },
    'continent': {
        'etymology': 'con- (共同) + tin (保持) + -ent → 连续的陆地，大陆',
        'example': 'Asia is the largest continent.',
        'translation': '亚洲是最大的大陆。'
    },
    'continue': {
        'etymology': 'con- (加强) + tinu (保持) + -e → 继续',
        'example': 'Please continue with your story.',
        'translation': '请继续你的故事。'
    },
    'continuous': {
        'etymology': 'continu- (继续) + -ous → 连续的',
        'example': 'There was continuous rain.',
        'translation': '持续下雨。'
    },
    'contract': {
        'etymology': 'con- (共同) + tract (拉) → 收缩；合同',
        'example': 'Sign the contract here.',
        'translation': '在这里签合同。'
    },
    'contradict': {
        'etymology': 'contra- (相反) + dict (说) → 矛盾',
        'example': 'His actions contradict his words.',
        'translation': '他的行为与他的话相矛盾。'
    },
    'contrary': {
        'etymology': 'contra- (相反) + -ry → 相反的',
        'example': 'The result was contrary to our expectations.',
        'translation': '结果与我们的预期相反。'
    },
    'contrast': {
        'etymology': 'contra- (相反) + st (站) → 对比',
        'example': 'Compare and contrast the two articles.',
        'translation': '比较和对比这两篇文章。'
    },
    'contribute': {
        'etymology': 'con- (共同) + tribut (给予) + -e → 贡献',
        'example': 'Everyone contributed to the project.',
        'translation': '每个人都为项目做出了贡献。'
    },
    'contribution': {
        'etymology': 'contribute (贡献) + -ion (名词后缀) → 贡献',
        'example': 'Thank you for your contribution.',
        'translation': '感谢您的贡献。'
    },
    'control': {
        'etymology': 'contra- (相反) + rol (滚) → 控制',
        'example': 'He lost control of the car.',
        'translation': '他失去了对车的控制。'
    },
    'controversial': {
        'etymology': 'contro- (相反) + vers (转) + -ial → 有争议的',
        'example': 'This is a controversial issue.',
        'translation': '这是一个有争议的问题。'
    },
    'controversy': {
        'etymology': 'contro- (相反) + vers (转) + -y → 争议',
        'example': 'There was a controversy about the decision.',
        'translation': '关于这个决定有争议。'
    },
    'convenient': {
        'etymology': 'con- (共同) + veni (来) + -ent → 方便的',
        'example': 'This location is very convenient.',
        'translation': '这个位置非常方便。'
    },
    'convention': {
        'etymology': 'con- (共同) + vent (来) + -ion → 大会，惯例',
        'example': 'They attended the convention.',
        'translation': '他们参加了大会。'
    },
    'conventional': {
        'etymology': 'convention (惯例) + -al (形容词后缀) → 传统的',
        'example': 'This is the conventional method.',
        'translation': '这是传统的方法。'
    },
    'conversation': {
        'etymology': 'con- (共同) + vers (转) + -ation → 对话',
        'example': 'We had a pleasant conversation.',
        'translation': '我们进行了一次愉快的谈话。'
    },
    'convert': {
        'etymology': 'con- (加强) + vert (转) → 转换',
        'example': 'Convert the file to PDF format.',
        'translation': '将文件转换为PDF格式。'
    },
    'convey': {
        'etymology': 'con- (加强) + vey (路) → 传达',
        'example': 'Please convey my regards to him.',
        'translation': '请向他转达我的问候。'
    },
    'convince': {
        'etymology': 'con- (加强) + vinc (征服) + -e → 说服',
        'example': 'I tried to convince him to stay.',
        'translation': '我试图说服他留下。'
    },
    'cook': {
        'etymology': '古英语，意为"烹饪"',
        'example': 'She is cooking dinner.',
        'translation': '她正在做晚饭。'
    },
    'cool': {
        'etymology': '古英语，意为"凉爽的"',
        'example': 'The weather is cool today.',
        'translation': '今天天气凉爽。'
    },
    'cooperate': {
        'etymology': 'co- (共同) + operat (工作) + -e → 合作',
        'example': 'We need to cooperate with each other.',
        'translation': '我们需要相互合作。'
    },
    'coordinate': {
        'etymology': 'co- (共同) + ordin (顺序) + -ate → 协调',
        'example': 'We need to coordinate our efforts.',
        'translation': '我们需要协调我们的努力。'
    },
    'cope': {
        'etymology': '古法语 couper，意为"打击"（应对）',
        'example': 'How do you cope with stress?',
        'translation': '你如何应对压力？'
    },
    'core': {
        'etymology': '拉丁语 cor，意为"心"',
        'example': 'This is the core of the problem.',
        'translation': '这是问题的核心。'
    },
    'corn': {
        'etymology': '古英语，意为"谷物"',
        'example': 'Farmers grow corn in this area.',
        'translation': '农民在这个地区种植玉米。'
    },
    'corner': {
        'etymology': '拉丁语 cornu，意为"角"',
        'example': 'The store is on the corner.',
        'translation': '商店在拐角处。'
    },
    'corporate': {
        'etymology': 'corpor (身体) + -ate → 公司的',
        'example': 'Corporate culture is important.',
        'translation': '企业文化很重要。'
    },
    'corporation': {
        'etymology': 'corpor (身体) + -ation (名词后缀) → 公司',
        'example': 'He works for a large corporation.',
        'translation': '他在一家大公司工作。'
    },
    'correct': {
        'etymology': 'cor- (加强) + rect (直) → 正确的',
        'example': 'Please correct your mistakes.',
        'translation': '请改正你的错误。'
    },
    'correspond': {
        'etymology': 'cor- (共同) + respond (回答) → 通信，对应',
        'example': 'I correspond with him regularly.',
        'translation': '我定期与他通信。'
    },
    'corrupt': {
        'etymology': 'cor- (加强) + rupt (断裂) → 腐败的',
        'example': 'The official was corrupt.',
        'translation': '这个官员是腐败的。'
    },
    'cost': {
        'etymology': '拉丁语 constare，意为"花费"',
        'example': 'How much does it cost?',
        'translation': '这需要多少钱？'
    },
    'costly': {
        'etymology': 'cost (花费) + -ly (形容词后缀) → 昂贵的',
        'example': 'This is a costly mistake.',
        'translation': '这是一个代价高昂的错误。'
    },
    'cotton': {
        'etymology': '阿拉伯语 qutn，意为"棉花"',
        'example': 'This shirt is made of cotton.',
        'translation': '这件衬衫是棉制的。'
    },
    'cough': {
        'etymology': '古英语，意为"咳嗽"',
        'example': 'He has a bad cough.',
        'translation': '他咳嗽得很厉害。'
    },
    'could': {
        'etymology': 'can 的过去式',
        'example': 'I could help you if you want.',
        'translation': '如果你愿意，我可以帮助你。'
    },
    'council': {
        'etymology': 'coun- (共同) + cil (召集) → 委员会',
        'example': 'The city council meets today.',
        'translation': '市议会今天开会。'
    },
    'counsel': {
        'etymology': 'coun- (共同) + sel (建议) → 建议，律师',
        'example': 'He sought legal counsel.',
        'translation': '他寻求法律咨询。'
    },
    'count': {
        'etymology': '拉丁语 computare，意为"计算"',
        'example': 'Can you count from 1 to 10?',
        'translation': '你能从1数到10吗？'
    },
    'counter': {
        'etymology': '拉丁语 contra，意为"相反"',
        'example': 'Put the money on the counter.',
        'translation': '把钱放在柜台上。'
    },
    'country': {
        'etymology': '拉丁语 contra，意为"对面"（土地）',
        'example': 'What country are you from?',
        'translation': '你来自哪个国家？'
    },
    'countryside': {
        'etymology': 'country (乡村) + side (边) → 乡村',
        'example': 'I love the countryside.',
        'translation': '我喜欢乡村。'
    },
    'county': {
        'etymology': 'count (伯爵) + -y → 伯爵的领地，县',
        'example': 'He lives in Orange County.',
        'translation': '他住在橙县。'
    },
    'couple': {
        'etymology': '拉丁语 copula，意为"连接"',
        'example': 'A couple of friends came over.',
        'translation': '几个朋友过来了。'
    },
    'courage': {
        'etymology': 'cour (心) + -age → 心的力量，勇气',
        'example': 'He showed great courage.',
        'translation': '他表现出了巨大的勇气。'
    },
    'course': {
        'etymology': '拉丁语 cursus，意为"跑，课程"',
        'example': 'I\'m taking a computer course.',
        'translation': '我正在上计算机课程。'
    },
    'court': {
        'etymology': '拉丁语 cohors，意为"庭院"',
        'example': 'The court will make a decision.',
        'translation': '法院将做出决定。'
    },
    'cousin': {
        'etymology': '拉丁语 consobrinus，意为"表兄弟"',
        'example': 'My cousin is visiting us.',
        'translation': '我的表弟正在拜访我们。'
    },
    'cover': {
        'etymology': '拉丁语 cooperire，意为"覆盖"',
        'example': 'Cover the pot with a lid.',
        'translation': '用盖子盖上锅。'
    },
    'cow': {
        'etymology': '古英语，意为"母牛"',
        'example': 'The cow produces milk.',
        'translation': '母牛产奶。'
    },
    'crack': {
        'etymology': '古英语，意为"破裂"',
        'example': 'There\'s a crack in the wall.',
        'translation': '墙上有一道裂缝。'
    },
    'craft': {
        'etymology': '古英语，意为"技艺"',
        'example': 'She is skilled at her craft.',
        'translation': '她擅长她的手艺。'
    },
    'crash': {
        'etymology': '中古英语，意为"撞击"',
        'example': 'The car crashed into a tree.',
        'translation': '汽车撞上了一棵树。'
    },
    'crazy': {
        'etymology': 'craze (疯狂) + -y → 疯狂的',
        'example': 'You must be crazy!',
        'translation': '你一定疯了！'
    },
    'cream': {
        'etymology': '拉丁语 chrisma，意为"涂抹的油"',
        'example': 'Would you like some cream in your coffee?',
        'translation': '你的咖啡要加奶油吗？'
    },
    'create': {
        'etymology': 'cre- (生长) + -ate (动词后缀) → 创造',
        'example': 'Artists create beautiful works.',
        'translation': '艺术家创造美丽的作品。'
    },
    'creation': {
        'etymology': 'creat- (创造) + -ion (名词后缀) → 创造',
        'example': 'The creation of the company took years.',
        'translation': '公司的创建花费了数年。'
    },
    'creative': {
        'etymology': 'creat- (创造) + -ive (形容词后缀) → 有创造力的',
        'example': 'She has a creative mind.',
        'translation': '她有创造性的头脑。'
    },
    'creature': {
        'etymology': 'creat- (创造) + -ure (名词后缀) → 生物',
        'example': 'All creatures need water.',
        'translation': '所有生物都需要水。'
    },
    'credit': {
        'etymology': 'cred- (相信) + -it → 信用',
        'example': 'He has good credit.',
        'translation': '他有良好的信用。'
    },
    'crew': {
        'etymology': '古法语，意为"增援"',
        'example': 'The crew worked hard.',
        'translation': '船员们工作努力。'
    },
    'crime': {
        'etymology': '拉丁语 crimen，意为"指控"',
        'example': 'He committed a crime.',
        'translation': '他犯了罪。'
    },
    'criminal': {
        'etymology': 'crime (犯罪) + -inal (形容词后缀) → 罪犯的',
        'example': 'The criminal was arrested.',
        'translation': '罪犯被逮捕了。'
    },
    'crisis': {
        'etymology': '希腊语 krisis，意为"决定"',
        'example': 'The company is facing a crisis.',
        'translation': '公司正面临危机。'
    },
    'critical': {
        'etymology': 'critic (批评) + -al (形容词后缀) → 批判的',
        'example': 'This is a critical moment.',
        'translation': '这是一个关键时刻。'
    },
    'criticism': {
        'etymology': 'critic (批评) + -ism (名词后缀) → 批评',
        'example': 'He accepted the criticism.',
        'translation': '他接受了批评。'
    },
    'criticize': {
        'etymology': 'critic (批评) + -ize (动词后缀) → 批评',
        'example': 'Don\'t criticize others too harshly.',
        'translation': '不要过于严厉地批评别人。'
    },
    'crop': {
        'etymology': '古英语，意为"收获"',
        'example': 'The farmers are harvesting their crops.',
        'translation': '农民们正在收获庄稼。'
    },
    'cross': {
        'etymology': '古诺斯语，意为"十字"',
        'example': 'Look both ways before you cross the street.',
        'translation': '过马路前要看两边。'
    },
    'crowd': {
        'etymology': '古英语，意为"拥挤"',
        'example': 'There was a large crowd at the concert.',
        'translation': '音乐会上有一大群人。'
    },
    'crucial': {
        'etymology': 'crux (十字，关键) + -ial → 关键的',
        'example': 'This is a crucial decision.',
        'translation': '这是一个关键的决定。'
    },
    'cruel': {
        'etymology': '拉丁语 crudelis，意为"残忍的"',
        'example': 'It is cruel to hurt animals.',
        'translation': '伤害动物是残忍的。'
    },
    'cry': {
        'etymology': '古英语，意为"叫喊"',
        'example': 'The baby is crying.',
        'translation': '婴儿在哭。'
    },
    'cultural': {
        'etymology': 'culture (文化) + -al (形容词后缀) → 文化的',
        'example': 'There are many cultural differences.',
        'translation': '有许多文化差异。'
    },
    'culture': {
        'etymology': 'cult- (耕种) + -ure (名词后缀) → 文化',
        'example': 'Different countries have different cultures.',
        'translation': '不同的国家有不同的文化。'
    },
    'curious': {
        'etymology': 'cur- (关心) + -ious → 好奇的',
        'example': 'Children are naturally curious.',
        'translation': '孩子们天生好奇。'
    },
    'currency': {
        'etymology': 'curr (跑，流动) + -ency → 货币',
        'example': 'What is the local currency?',
        'translation': '当地的货币是什么？'
    },
    'current': {
        'etymology': 'curr (跑) + -ent → 当前的',
        'example': 'What is the current situation?',
        'translation': '目前的情况如何？'
    },
    'curriculum': {
        'etymology': 'curr (跑) + -iculum → 课程（跑道）',
        'example': 'The curriculum includes many subjects.',
        'translation': '课程包括许多科目。'
    },
    'curve': {
        'etymology': '拉丁语 curvus，意为"弯曲的"',
        'example': 'The road has a sharp curve.',
        'translation': '路有一个急转弯。'
    },
    'custom': {
        'etymology': '拉丁语 consuescere，意为"习惯"',
        'example': 'It is the custom to shake hands.',
        'translation': '握手是一种习俗。'
    },
    'customer': {
        'etymology': 'custom (习惯) + -er (人) → 常客，顾客',
        'example': 'The customer is always right.',
        'translation': '顾客永远是对的。'
    },
    'cycle': {
        'etymology': '希腊语 kyklos，意为"圆，轮"',
        'example': 'Life is a cycle.',
        'translation': '生命是一个循环。'
    },
}

# 为每个单词添加词根词缀和例句
print('Processing words...')
results = []
not_found = []

for idx, row in df.iterrows():
    word = str(row['word']).strip().lower()
    meaning = row['meaning']
    
    if word in word_data:
        data = word_data[word]
        results.append({
            'word': row['word'],
            'meaning': meaning,
            'phonetic': row.get('phonetic', ''),
            'example': data['example'],
            'example_translation': data['translation'],
            'etymology': data['etymology']
        })
    else:
        not_found.append(word)
        # 生成默认内容
        results.append({
            'word': row['word'],
            'meaning': meaning,
            'phonetic': row.get('phonetic', ''),
            'example': f'This is an example using the word "{row["word"]}".',
            'example_translation': f'这是使用单词"{row["word"]}"的例句。',
            'etymology': '基础词汇，建议整体记忆'
        })
    
    if (idx + 1) % 500 == 0:
        print(f'Processed {idx + 1} words...')

print(f'\nTotal processed: {len(results)}')
print(f'Words with detailed data: {len(results) - len(not_found)}')
print(f'Words using default: {len(not_found)}')

# 保存结果
output_df = pd.DataFrame(results)
output_df.to_excel('E:/999_Temp/Private/四级词汇_导入格式_完整版.xlsx', index=False)
print('\nSaved to: E:/999_Temp/Private/四级词汇_导入格式_完整版.xlsx')

# 保存未找到的单词列表
with open('E:/999_Temp/Private/未匹配单词列表.txt', 'w', encoding='utf-8') as f:
    f.write(f'共 {len(not_found)} 个单词使用了默认例句和词根分析：\n\n')
    for w in not_found[:100]:  # 只显示前100个
        f.write(f'{w}\n')
print('Saved word list to: E:/999_Temp/Private/未匹配单词列表.txt')
