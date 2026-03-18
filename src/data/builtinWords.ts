export interface Word {
  word: string;
  phonetic: string;
  meaning: string;
  etymology: string;
  example: string;
  example_translation: string;
}

export interface DayWords {
  day: number;
  theme: string;
  words: Word[];
}

export const builtinWords: DayWords[] = [
  {
    day: 1,
    theme: '词根 spect- (看) - Day 1',
    words: [
      {
        word: 'inspect',
        phonetic: '/ɪnˈspekt/',
        meaning: '检查；视察',
        etymology: 'in- (向内) + spect (看) → 向内看 → 检查',
        example: 'The police inspected the scene of the crime.',
        example_translation: '警察检查了犯罪现场。'
      },
      {
        word: 'aspect',
        phonetic: '/ˈæspekt/',
        meaning: '方面；外观',
        etymology: 'a- (向) + spect (看) → 看到的东西 → 方面',
        example: 'We must consider every aspect of the problem.',
        example_translation: '我们必须考虑问题的各个方面。'
      },
      {
        word: 'respect',
        phonetic: '/rɪˈspekt/',
        meaning: '尊重；尊敬',
        etymology: 're- (回) + spect (看) → 看重 → 尊重',
        example: 'We should respect others\' opinions.',
        example_translation: '我们应该尊重他人的意见。'
      },
      {
        word: 'expect',
        phonetic: '/ɪkˈspekt/',
        meaning: '期待；预期',
        etymology: 'ex- (向外) + spect (看) → 向外看 → 期待',
        example: 'I expect to finish the work by Friday.',
        example_translation: '我预计在周五前完成这项工作。'
      },
      {
        word: 'prospect',
        phonetic: '/ˈprɒspekt/',
        meaning: '前景；展望',
        etymology: 'pro- (向前) + spect (看) → 向前看 → 前景',
        example: 'The job prospects in this field are excellent.',
        example_translation: '这个领域的就业前景非常好。'
      },
      {
        word: 'spectator',
        phonetic: '/spekˈteɪtə(r)/',
        meaning: '观众；旁观者',
        etymology: 'spect (看) + -ator (人) → 观看的人',
        example: 'The stadium was filled with cheering spectators.',
        example_translation: '体育场里坐满了欢呼的观众。'
      },
      {
        word: 'perspective',
        phonetic: '/pəˈspektɪv/',
        meaning: '观点；透视法',
        etymology: 'per- (通过) + spect (看) + -ive → 透过...看 → 观点',
        example: 'Try to see things from a different perspective.',
        example_translation: '试着从不同的角度看待事物。'
      },
      {
        word: 'suspect',
        phonetic: '/səˈspekt/',
        meaning: '怀疑；嫌疑犯',
        etymology: 'sus- (在下面) + spect (看) → 从下面看 → 怀疑',
        example: 'I suspect he is lying about his age.',
        example_translation: '我怀疑他在年龄上撒谎。'
      },
      {
        word: 'retrospect',
        phonetic: '/ˈretrəspekt/',
        meaning: '回顾；回想',
        etymology: 'retro- (向后) + spect (看) → 向后看 → 回顾',
        example: 'In retrospect, that was a great decision.',
        example_translation: '回想起来，那是个很棒的决定。'
      },
      {
        word: 'spectacular',
        phonetic: '/spekˈtækjələ(r)/',
        meaning: '壮观的；精彩的',
        etymology: 'spect (看) + -acular → 值得看的 → 壮观的',
        example: 'The sunset was spectacular.',
        example_translation: '日落非常壮观。'
      },
      {
        word: 'spectrum',
        phonetic: '/ˈspektrəm/',
        meaning: '光谱；范围',
        etymology: 'spect (看) + -rum → 能看到的东西 → 光谱',
        example: 'The full spectrum of colors was visible.',
        example_translation: '可以看到完整的色彩光谱。'
      },
      {
        word: 'conspicuous',
        phonetic: '/kənˈspɪkjuəs/',
        meaning: '明显的；显眼的',
        etymology: 'con- (一起) + spic (看) + -uous → 让人一眼看到 → 明显的',
        example: 'She felt conspicuous in her bright red dress.',
        example_translation: '她穿着鲜红色的裙子觉得很显眼。'
      },
      {
        word: 'speculate',
        phonetic: '/ˈspekjuleɪt/',
        meaning: '推测；投机',
        etymology: 'specul (看) + -ate → 观察 → 推测',
        example: 'Scientists speculate about life on other planets.',
        example_translation: '科学家推测其他星球上是否存在生命。'
      },
      {
        word: 'introspection',
        phonetic: '/ˌɪntrəˈspekʃn/',
        meaning: '内省；反省',
        etymology: 'intro- (向内) + spect (看) + -ion → 向内看 → 内省',
        example: 'Introspection helps us understand ourselves better.',
        example_translation: '内省帮助我们更好地了解自己。'
      },
      {
        word: 'circumspect',
        phonetic: '/ˈsɜːkəmspekt/',
        meaning: '谨慎的；周密的',
        etymology: 'circum- (周围) + spect (看) → 四周都看 → 谨慎的',
        example: 'She is circumspect about giving advice.',
        example_translation: '她在提供建议时非常谨慎。'
      },
      {
        word: 'despise',
        phonetic: '/dɪˈspaɪz/',
        meaning: '鄙视；看不起',
        etymology: 'de- (向下) + spise (看) → 向下看 → 鄙视',
        example: 'He despises people who are dishonest.',
        example_translation: '他鄙视不诚实的人。'
      },
      {
        word: 'aspectual',
        phonetic: '/æˈspektʃuəl/',
        meaning: '体貌的；方面的',
        etymology: 'aspect (方面) + -ual (形容词)',
        example: 'Aspectual analysis is important in linguistics.',
        example_translation: '体貌分析在语言学中很重要。'
      },
      {
        word: 'inspection',
        phonetic: '/ɪnˈspekʃn/',
        meaning: '检查；视察',
        etymology: 'inspect (检查) + -ion (名词)',
        example: 'The factory passed the safety inspection.',
        example_translation: '工厂通过了安全检查。'
      },
      {
        word: 'respective',
        phonetic: '/rɪˈspektɪv/',
        meaning: '各自的',
        etymology: 'respect (方面) + -ive → 各方面的 → 各自的',
        example: 'They went to their respective homes.',
        example_translation: '他们各自回家了。'
      },
      {
        word: 'disrespect',
        phonetic: '/ˌdɪsrɪˈspekt/',
        meaning: '不尊重；无礼',
        etymology: 'dis- (不) + respect (尊重)',
        example: 'Showing disrespect to elders is unacceptable.',
        example_translation: '对长辈不尊重是不可接受的。'
      },
      {
        word: 'spectacle',
        phonetic: '/ˈspektəkl/',
        meaning: '景象；眼镜',
        etymology: 'spect (看) + -acle (事物) → 可看的事物',
        example: 'The fireworks display was a magnificent spectacle.',
        example_translation: '烟花表演是一场壮观的景象。'
      },
      {
        word: 'specimen',
        phonetic: '/ˈspesɪmən/',
        meaning: '标本；样本',
        etymology: 'spec (看) + -imen → 给人看的东西 → 样本',
        example: 'The museum has a rare butterfly specimen.',
        example_translation: '博物馆有一个稀有的蝴蝶标本。'
      },
      {
        word: 'unrespectable',
        phonetic: '/ʌnrɪˈspektəbl/',
        meaning: '不受尊重的；不可敬的',
        etymology: 'un- (不) + respect (尊重) + -able',
        example: 'His behavior was quite unrespectable.',
        example_translation: '他的行为相当不受尊重。'
      },
      {
        word: 'perspicacious',
        phonetic: '/ˌpɜːspɪˈkeɪʃəs/',
        meaning: '敏锐的；有洞察力的',
        etymology: 'per- (通过) + spic (看) + -acious → 能看透的',
        example: 'The perspicacious detective solved the mystery.',
        example_translation: '那个敏锐的侦探解开了谜团。'
      }
    ]
  },
  {
    day: 2,
    theme: '词根 port- (携带) - Day 2',
    words: [
      {
        word: 'transport',
        phonetic: '/ˈtrænspɔːt/',
        meaning: '运输；交通工具',
        etymology: 'trans- (跨越) + port (携带) → 携带跨越 → 运输',
        example: 'Public transport in the city is efficient.',
        example_translation: '城市的公共交通很高效。'
      },
      {
        word: 'export',
        phonetic: '/ɪkˈspɔːt/',
        meaning: '出口；输出',
        etymology: 'ex- (向外) + port (携带) → 带出去 → 出口',
        example: 'China exports many products to other countries.',
        example_translation: '中国向其他国家出口很多产品。'
      },
      {
        word: 'import',
        phonetic: '/ˈɪmpɔːt/',
        meaning: '进口；输入',
        etymology: 'im- (向内) + port (携带) → 带进来 → 进口',
        example: 'The country imports raw materials.',
        example_translation: '这个国家进口原材料。'
      },
      {
        word: 'report',
        phonetic: '/rɪˈpɔːt/',
        meaning: '报告；汇报',
        etymology: 're- (回) + port (携带) → 带回信息 → 报告',
        example: 'She reported the incident to the police.',
        example_translation: '她向警察报告了这件事。'
      },
      {
        word: 'support',
        phonetic: '/səˈpɔːt/',
        meaning: '支持；支撑',
        etymology: 'sup- (从下面) + port (携带) → 从下面托 → 支持',
        example: 'My family always supports me.',
        example_translation: '我的家人总是支持我。'
      },
      {
        word: 'portable',
        phonetic: '/ˈpɔːtəbl/',
        meaning: '便携的；可携带的',
        etymology: 'port (携带) + -able (能...的)',
        example: 'This laptop is very portable.',
        example_translation: '这台笔记本电脑非常便携。'
      },
      {
        word: 'passport',
        phonetic: '/ˈpɑːspɔːt/',
        meaning: '护照',
        etymology: 'pass (通过) + port (港口) → 通过港口的证件',
        example: 'Don\'t forget to bring your passport.',
        example_translation: '别忘了带上你的护照。'
      },
      {
        word: 'important',
        phonetic: '/ɪmˈpɔːtnt/',
        meaning: '重要的',
        etymology: 'im- (向内) + port (携带) + -ant → 带入的 → 重要的',
        example: 'It is important to exercise regularly.',
        example_translation: '定期锻炼很重要。'
      },
      {
        word: 'deport',
        phonetic: '/dɪˈpɔːt/',
        meaning: '驱逐出境',
        etymology: 'de- (向下) + port (携带) → 带走 → 驱逐',
        example: 'The illegal immigrant was deported.',
        example_translation: '非法移民被驱逐出境了。'
      },
      {
        word: 'portfolio',
        phonetic: '/pɔːtˈfəʊliəʊ/',
        meaning: '作品集；投资组合',
        etymology: 'port (携带) + folio (叶) → 携带的一叠 → 作品集',
        example: 'She showed me her design portfolio.',
        example_translation: '她给我看了她的设计作品集。'
      },
      {
        word: 'transportation',
        phonetic: '/ˌtrænspɔːˈteɪʃn/',
        meaning: '交通；运输',
        etymology: 'transport (运输) + -ation (名词)',
        example: 'The city has excellent transportation.',
        example_translation: '这座城市有优秀的交通系统。'
      },
      {
        word: 'opportunity',
        phonetic: '/ˌɒpəˈtjuːnəti/',
        meaning: '机会；机遇',
        etymology: 'op- (朝着) + port (港口) + -unity → 面向港口 → 机会',
        example: 'This is a great opportunity to learn.',
        example_translation: '这是一个很好的学习机会。'
      },
      {
        word: 'disport',
        phonetic: '/dɪˈspɔːt/',
        meaning: '娱乐；玩耍',
        etymology: 'dis- (分开) + port (携带) → 带出去放松 → 娱乐',
        example: 'Children disport themselves in the playground.',
        example_translation: '孩子们在操场上玩耍。'
      },
      {
        word: 'importance',
        phonetic: '/ɪmˈpɔːtns/',
        meaning: '重要性',
        etymology: 'important (重要的) + -ce (名词)',
        example: 'The importance of education cannot be overstated.',
        example_translation: '教育的重要性无论怎么强调都不为过。'
      },
      {
        word: 'unsupported',
        phonetic: '/ˌʌnsəˈpɔːtɪd/',
        meaning: '无支持的；未获支持的',
        etymology: 'un- (不) + support (支持) + -ed',
        example: 'The theory remains unsupported by evidence.',
        example_translation: '这个理论仍然没有证据支持。'
      },
      {
        word: 'reporter',
        phonetic: '/rɪˈpɔːtə(r)/',
        meaning: '记者；报告者',
        etymology: 'report (报告) + -er (人)',
        example: 'The reporter interviewed the witnesses.',
        example_translation: '记者采访了目击者。'
      },
      {
        word: 'sport',
        phonetic: '/spɔːt/',
        meaning: '运动；体育',
        etymology: 'disport (娱乐) 的缩略',
        example: 'Football is a popular sport worldwide.',
        example_translation: '足球是世界流行的运动。'
      },
      {
        word: 'transportable',
        phonetic: '/trænˈspɔːtəbl/',
        meaning: '可运输的',
        etymology: 'transport (运输) + -able',
        example: 'These goods are easily transportable.',
        example_translation: '这些货物很容易运输。'
      },
      {
        word: 'purport',
        phonetic: '/pəˈpɔːt/',
        meaning: '声称；意指',
        etymology: 'pur- (向前) + port (携带) → 带出来的 → 声称',
        example: 'The study purports to show new findings.',
        example_translation: '这项研究声称有新发现。'
      },
      {
        word: 'portage',
        phonetic: '/ˈpɔːtɪdʒ/',
        meaning: '搬运；水陆联运',
        etymology: 'port (携带) + -age (行为)',
        example: 'The portage around the waterfall was difficult.',
        example_translation: '绕过瀑布的搬运很困难。'
      },
      {
        word: 're-export',
        phonetic: '/ˌriːɪkˈspɔːt/',
        meaning: '再出口；转口贸易',
        etymology: 're- (再) + export (出口)',
        example: 'The company specializes in re-export business.',
        example_translation: '这家公司专门做转口贸易。'
      },
      {
        word: 'disportation',
        phonetic: '/ˌdɪspɔːˈteɪʃn/',
        meaning: '娱乐活动',
        etymology: 'disport (娱乐) + -ation',
        example: 'The festival is a time of great disportation.',
        example_translation: '节日是欢乐娱乐的时光。'
      },
      {
        word: 'reimport',
        phonetic: '/ˌriːˈɪmpɔːt/',
        meaning: '再进口；复进口',
        etymology: 're- (再) + import (进口)',
        example: 'Some goods are reimported after processing.',
        example_translation: '有些商品加工后再进口。'
      },
      {
        word: 'misreport',
        phonetic: '/ˌmɪsrɪˈpɔːt/',
        meaning: '误报；错误报告',
        etymology: 'mis- (错误) + report (报告)',
        example: 'The media misreported the facts.',
        example_translation: '媒体误报了事实。'
      },
      {
        word: 'comport',
        phonetic: '/kəmˈpɔːt/',
        meaning: '举止；相称',
        etymology: 'com- (一起) + port (携带) → 举止',
        example: 'She comports herself with dignity.',
        example_translation: '她举止端庄。'
      }
    ]
  },
  {
    day: 3,
    theme: '词根 dict- (说) - Day 3',
    words: [
      {
        word: 'dictate',
        phonetic: '/dɪkˈteɪt/',
        meaning: '口述；命令',
        etymology: 'dict (说) + -ate → 口述',
        example: 'The teacher dictated the notes to the class.',
        example_translation: '老师向全班口述了笔记。'
      },
      {
        word: 'dictionary',
        phonetic: '/ˈdɪkʃəneri/',
        meaning: '字典；词典',
        etymology: 'dict (说) + -ionary (收集...的)',
        example: 'I use a dictionary to look up new words.',
        example_translation: '我查字典学习新单词。'
      },
      {
        word: 'predict',
        phonetic: '/prɪˈdɪkt/',
        meaning: '预测；预言',
        etymology: 'pre- (提前) + dict (说) → 提前说 → 预测',
        example: 'Experts predict a rise in temperatures.',
        example_translation: '专家预测气温会上升。'
      },
      {
        word: 'contradict',
        phonetic: '/ˌkɒntrəˈdɪkt/',
        meaning: '反驳；与...矛盾',
        etymology: 'contra- (反对) + dict (说) → 反着说 → 反驳',
        example: 'Her actions contradict her words.',
        example_translation: '她的行动与她的话相矛盾。'
      },
      {
        word: 'verdict',
        phonetic: '/ˈvɜːdɪkt/',
        meaning: '裁决；判决',
        etymology: 'ver (真实) + dict (说) → 说真话 → 裁决',
        example: 'The jury reached a verdict of guilty.',
        example_translation: '陪审团做出了有罪的裁决。'
      },
      {
        word: 'dictation',
        phonetic: '/dɪkˈteɪʃn/',
        meaning: '听写；口述',
        etymology: 'dictate (口述) + -ion',
        example: 'The students practiced dictation.',
        example_translation: '学生们练习听写。'
      },
      {
        word: 'indicate',
        phonetic: '/ˈɪndɪkeɪt/',
        meaning: '指示；表明',
        etymology: 'in- (向内) + dic (说) → 指出来 → 表明',
        example: 'The sign indicates the exit.',
        example_translation: '标志指示着出口。'
      },
      {
        word: 'dedicate',
        phonetic: '/ˈdedɪkeɪt/',
        meaning: '奉献；致力于',
        etymology: 'de- (彻底) + dic (说) + -ate → 宣誓 → 奉献',
        example: 'She dedicated her life to teaching.',
        example_translation: '她毕生致力于教学。'
      },
      {
        word: 'addict',
        phonetic: '/əˈdɪkt/',
        meaning: '沉迷者；上瘾',
        etymology: 'ad- (向) + dict (说) → 宣誓依附 → 上瘾',
        example: 'He is addicted to computer games.',
        example_translation: '他沉迷于电脑游戏。'
      },
      {
        word: 'predictable',
        phonetic: '/prɪˈdɪktəbl/',
        meaning: '可预测的',
        etymology: 'predict (预测) + -able',
        example: 'The ending of the movie was predictable.',
        example_translation: '电影的结局是可以预测的。'
      },
      {
        word: 'contradiction',
        phonetic: '/ˌkɒntrəˈdɪkʃn/',
        meaning: '矛盾；反驳',
        etymology: 'contradict (反驳) + -ion',
        example: 'There is a contradiction in his statement.',
        example_translation: '他的陈述中有矛盾之处。'
      },
      {
        word: 'indict',
        phonetic: '/ɪnˈdaɪt/',
        meaning: '起诉；控告',
        etymology: 'in- (向内) + dict (说) → 正式指控 → 起诉',
        example: 'The prosecutor decided to indict him.',
        example_translation: '检察官决定起诉他。'
      },
      {
        word: 'indication',
        phonetic: '/ˌɪndɪˈkeɪʃn/',
        meaning: '指示；迹象',
        etymology: 'indicate (表明) + -ion',
        example: 'There is no indication of rain today.',
        example_translation: '今天没有下雨的迹象。'
      },
      {
        word: 'dedication',
        phonetic: '/ˌdedɪˈkeɪʃn/',
        meaning: '奉献；献身',
        etymology: 'dedicate (奉献) + -ion',
        example: 'His dedication to his work is admirable.',
        example_translation: '他对工作的奉献精神令人钦佩。'
      },
      {
        word: 'addiction',
        phonetic: '/əˈdɪkʃn/',
        meaning: '成瘾；沉迷',
        etymology: 'addict (上瘾) + -ion',
        example: 'Drug addiction is a serious problem.',
        example_translation: '药物成瘾是一个严重问题。'
      },
      {
        word: 'prediction',
        phonetic: '/prɪˈdɪkʃn/',
        meaning: '预测；预报',
        etymology: 'predict (预测) + -ion',
        example: 'Weather predictions are not always accurate.',
        example_translation: '天气预报并不总是准确的。'
      },
      {
        word: 'dictator',
        phonetic: '/dɪkˈteɪtə(r)/',
        meaning: '独裁者',
        etymology: 'dictate (命令) + -or (人)',
        example: 'The dictator ruled with absolute power.',
        example_translation: '独裁者拥有绝对权力统治。'
      },
      {
        word: 'abdicate',
        phonetic: '/ˈæbdɪkeɪt/',
        meaning: '退位；放弃',
        etymology: 'ab- (离开) + dic (说) + -ate → 宣布离开 → 退位',
        example: 'The king decided to abicate the throne.',
        example_translation: '国王决定退位。'
      },
      {
        word: 'edict',
        phonetic: '/ˈiːdɪkt/',
        meaning: '法令；敕令',
        etymology: 'e- (向外) + dict (说) → 公告 → 法令',
        example: 'The emperor issued an edict.',
        example_translation: '皇帝颁布了一项法令。'
      },
      {
        word: 'maledict',
        phonetic: '/ˈmælɪdɪkt/',
        meaning: '诅咒',
        etymology: 'mal- (坏) + dict (说) → 说坏话 → 诅咒',
        example: 'The witch maledicted her enemies.',
        example_translation: '女巫诅咒她的敌人。'
      },
      {
        word: 'benedict',
        phonetic: '/ˈbenɪdɪkt/',
        meaning: '新郎；受祝福者',
        etymology: 'bene- (好) + dict (说) → 被祝福的人',
        example: 'The benedict stood at the altar.',
        example_translation: '新郎站在祭坛前。'
      },
      {
        word: 'jurisdiction',
        phonetic: '/ˌdʒʊərɪsˈdɪkʃn/',
        meaning: '司法权；管辖权',
        etymology: 'juris (法律) + dict (说) + -ion → 说法律',
        example: 'This case falls under federal jurisdiction.',
        example_translation: '这个案件属于联邦管辖。'
      },
      {
        word: 'valediction',
        phonetic: '/ˌvælɪˈdɪkʃn/',
        meaning: '告别词',
        etymology: 'vale (再见) + dict (说) + -ion → 告别的话',
        example: 'The valedictory speech was very touching.',
        example_translation: '告别演讲非常感人。'
      },
      {
        word: 'interdict',
        phonetic: '/ˈɪntədɪkt/',
        meaning: '禁止；禁令',
        etymology: 'inter- (之间) + dict (说) → 中间禁止 → 禁令',
        example: 'The court issued an interdict.',
        example_translation: '法院发布了禁令。'
      },
      {
        word: 'predication',
        phonetic: '/ˌpredɪˈkeɪʃn/',
        meaning: '断言；预测',
        etymology: 'predict (预测) + -ion',
        example: 'His predication turned out to be true.',
        example_translation: '他的预测结果是正确的。'
      }
    ]
  },
  {
    day: 4,
    theme: '词根 tract- (拉/拖) - Day 4',
    words: [
      {
        word: 'attract',
        phonetic: '/əˈtrækt/',
        meaning: '吸引；引起',
        etymology: 'at- (向) + tract (拉) → 拉过来 → 吸引',
        example: 'The beautiful flowers attract bees.',
        example_translation: '美丽的花朵吸引蜜蜂。'
      },
      {
        word: 'contract',
        phonetic: '/ˈkɒntrækt/',
        meaning: '合同；收缩',
        etymology: 'con- (一起) + tract (拉) → 拉到一起 → 合同',
        example: 'Please sign the contract.',
        example_translation: '请签合同。'
      },
      {
        word: 'distract',
        phonetic: '/dɪˈstrækt/',
        meaning: '分散注意力',
        etymology: 'dis- (分开) + tract (拉) → 拉走 → 分散',
        example: 'Loud noises distract me from studying.',
        example_translation: '巨大的噪音分散了我学习的注意力。'
      },
      {
        word: 'extract',
        phonetic: '/ɪkˈstrækt/',
        meaning: '提取；摘录',
        etymology: 'ex- (向外) + tract (拉) → 拉出来 → 提取',
        example: 'The machine extracts oil from seeds.',
        example_translation: '机器从种子中提取油。'
      },
      {
        word: 'abstract',
        phonetic: '/ˈæbstrækt/',
        meaning: '抽象的；摘要',
        etymology: 'abs- (离开) + tract (拉) → 拉开的 → 抽象的',
        example: 'Art can be quite abstract.',
        example_translation: '艺术可以相当抽象。'
      },
      {
        word: 'attraction',
        phonetic: '/əˈtrækʃn/',
        meaning: '吸引；吸引力',
        etymology: 'attract (吸引) + -ion',
        example: 'The Eiffel Tower is a major tourist attraction.',
        example_translation: '埃菲尔铁塔是主要的旅游景点。'
      },
      {
        word: 'contraction',
        phonetic: '/kənˈtrækʃn/',
        meaning: '收缩；缩略',
        etymology: 'contract (收缩) + -ion',
        example: 'Muscle contraction helps movement.',
        example_translation: '肌肉收缩帮助运动。'
      },
      {
        word: 'distraction',
        phonetic: '/dɪˈstrækʃn/',
        meaning: '分散注意力的事物',
        etymology: 'distract (分散) + -ion',
        example: 'Social media can be a major distraction.',
        example_translation: '社交媒体可能是一个主要的干扰。'
      },
      {
        word: 'extraction',
        phonetic: '/ɪkˈstrækʃn/',
        meaning: '提取；取出',
        etymology: 'extract (提取) + -ion',
        example: 'The extraction of minerals damages the environment.',
        example_translation: '矿物开采破坏环境。'
      },
      {
        word: 'traction',
        phonetic: '/ˈtrækʃn/',
        meaning: '牵引；附着力',
        etymology: 'tract (拉) + -ion → 拉 → 牵引',
        example: 'The truck lost traction on the icy road.',
        example_translation: '卡车在结冰的路上失去了附着力。'
      },
      {
        word: 'tractor',
        phonetic: '/ˈtræktə(r)/',
        meaning: '拖拉机',
        etymology: 'tract (拉) + -or (物) → 拖拉机',
        example: 'Farmers use tractors to plow fields.',
        example_translation: '农民用拖拉机耕地。'
      },
      {
        word: 'subtract',
        phonetic: '/səbˈtrækt/',
        meaning: '减去；扣除',
        etymology: 'sub- (向下) + tract (拉) → 拉下去 → 减去',
        example: 'If you subtract five from ten, you get five.',
        example_translation: '如果你从十减去五，得到五。'
      },
      {
        word: 'retract',
        phonetic: '/rɪˈtrækt/',
        meaning: '收回；缩回',
        etymology: 're- (回) + tract (拉) → 拉回 → 收回',
        example: 'He retracted his statement.',
        example_translation: '他收回了他的声明。'
      },
      {
        word: 'protract',
        phonetic: '/prəˈtrækt/',
        meaning: '延长；拖延',
        etymology: 'pro- (向前) + tract (拉) → 向前拉 → 延长',
        example: 'The meeting was protracted for hours.',
        example_translation: '会议拖延了几个小时。'
      },
      {
        word: 'intractable',
        phonetic: '/ɪnˈtræktəbl/',
        meaning: '难处理的；顽固的',
        etymology: 'in- (不) + tract (拉) + -able → 无法拉动的',
        example: 'The problem seems intractable.',
        example_translation: '这个问题似乎难以处理。'
      },
      {
        word: 'subtractive',
        phonetic: '/səbˈtræktɪv/',
        meaning: '减去的',
        etymology: 'subtract (减去) + -ive',
        example: 'This is a subtractive process.',
        example_translation: '这是一个减法过程。'
      },
      {
        word: 'retractable',
        phonetic: '/rɪˈtræktəbl/',
        meaning: '可收回的；可缩回的',
        etymology: 'retract (收回) + -able',
        example: 'The pen has a retractable tip.',
        example_translation: '这支笔有一个可缩回的笔尖。'
      },
      {
        word: 'detract',
        phonetic: '/dɪˈtrækt/',
        meaning: '贬低；减损',
        etymology: 'de- (向下) + tract (拉) → 向下拉 → 贬低',
        example: 'Nothing can detract from her beauty.',
        example_translation: '没有什么能减损她的美丽。'
      },
      {
        word: 'protraction',
        phonetic: '/prəˈtrækʃn/',
        meaning: '延长；拖延',
        etymology: 'protract (延长) + -ion',
        example: 'The protraction of the war caused suffering.',
        example_translation: '战争的拖延造成了苦难。'
      },
      {
        word: 'tractable',
        phonetic: '/ˈtræktəbl/',
        meaning: '易处理的；温顺的',
        etymology: 'tract (拉) + -able → 能拉动的',
        example: 'The dog is very tractable.',
        example_translation: '这只狗很温顺。'
      },
      {
        word: 'detractive',
        phonetic: '/dɪˈtræktɪv/',
        meaning: '诽谤的；贬低的',
        etymology: 'detract (贬低) + -ive',
        example: 'His detractive comments hurt her.',
        example_translation: '他贬低的评论伤害了她。'
      },
      {
        word: 'contractor',
        phonetic: '/kənˈtræktə(r)/',
        meaning: '承包商',
        etymology: 'contract (合同) + -or (人)',
        example: 'The contractor will build the house.',
        example_translation: '承包商将建造这所房子。'
      },
      {
        word: 'attractive',
        phonetic: '/əˈtræktɪv/',
        meaning: '有吸引力的',
        etymology: 'attract (吸引) + -ive',
        example: 'She is an attractive woman.',
        example_translation: '她是一个有吸引力的女人。'
      },
      {
        word: 'tractive',
        phonetic: '/ˈtræktɪv/',
        meaning: '牵引的；拉力的',
        etymology: 'tract (拉) + -ive',
        example: 'The tractive force moves the vehicle.',
        example_translation: '牵引力推动车辆。'
      },
      {
        word: 'intraction',
        phonetic: '/ɪnˈtrækʃn/',
        meaning: '难处理的状态',
        etymology: 'in- (不) + tract (拉) + -ion',
        example: 'The intraction of the case frustrated lawyers.',
        example_translation: '这个案件难以处理的状态让律师感到沮丧。'
      }
    ]
  },
  {
    day: 5,
    theme: '词根 press- (按压) - Day 5',
    words: [
      {
        word: 'press',
        phonetic: '/pres/',
        meaning: '按压；新闻界；按',
        etymology: 'press (压) 本身',
        example: 'Press the button to start.',
        example_translation: '按下按钮开始。'
      },
      {
        word: 'pressure',
        phonetic: '/ˈpreʃə(r)/',
        meaning: '压力；压强',
        etymology: 'press (压) + -ure (名词)',
        example: 'High blood pressure is dangerous.',
        example_translation: '高血压是危险的。'
      },
      {
        word: 'compress',
        phonetic: '/kəmˈpres/',
        meaning: '压缩；压紧',
        etymology: 'com- (一起) + press (压) → 一起压 → 压缩',
        example: 'Compress the file to save space.',
        example_translation: '压缩文件以节省空间。'
      },
      {
        word: 'express',
        phonetic: '/ɪkˈspres/',
        meaning: '表达；快车',
        etymology: 'ex- (向外) + press (压) → 挤出来 → 表达',
        example: 'Express your feelings openly.',
        example_translation: '公开表达你的感受。'
      },
      {
        word: 'impress',
        phonetic: '/ɪmˈpres/',
        meaning: '给...留下深刻印象',
        etymology: 'im- (向内) + press (压) → 压入心 → 打动',
        example: 'Her singing impressed the audience.',
        example_translation: '她的歌唱打动了观众。'
      },
      {
        word: 'depress',
        phonetic: '/dɪˈpres/',
        meaning: '使沮丧；按下',
        etymology: 'de- (向下) + press (压) → 向下压 → 沮丧',
        example: 'The sad news depressed everyone.',
        example_translation: '悲伤的消息让大家很沮丧。'
      },
      {
        word: 'oppress',
        phonetic: '/əˈpres/',
        meaning: '压迫；压制',
        etymology: 'op- (对抗) + press (压) → 压制 → 压迫',
        example: 'The dictator oppressed the people.',
        example_translation: '独裁者压迫人民。'
      },
      {
        word: 'suppress',
        phonetic: '/səˈpres/',
        meaning: '镇压；抑制',
        etymology: 'sup- (向下) + press (压) → 压下去 → 抑制',
        example: 'The government suppressed the rebellion.',
        example_translation: '政府镇压了叛乱。'
      },
      {
        word: 'express',
        phonetic: '/ˈekspres/',
        meaning: '快递；快速的',
        etymology: 'ex- (向外) + press (压) → 快速推出',
        example: 'I sent it by express delivery.',
        example_translation: '我通过快递寄送了它。'
      },
      {
        word: 'impressive',
        phonetic: '/ɪmˈpresɪv/',
        meaning: '令人印象深刻的',
        etymology: 'impress (打动) + -ive',
        example: 'The performance was impressive.',
        example_translation: '表演令人印象深刻。'
      },
      {
        word: 'depression',
        phonetic: '/dɪˈpreʃn/',
        meaning: '抑郁；萧条',
        etymology: 'depress (沮丧) + -ion',
        example: 'Many people suffer from depression.',
        example_translation: '许多人患有抑郁症。'
      },
      {
        word: 'oppression',
        phonetic: '/əˈpreʃn/',
        meaning: '压迫；压抑',
        etymology: 'oppress (压迫) + -ion',
        example: 'The people fought against oppression.',
        example_translation: '人民反抗压迫。'
      },
      {
        word: 'suppression',
        phonetic: '/səˈpreʃn/',
        meaning: '镇压；抑制',
        etymology: 'suppress (抑制) + -ion',
        example: 'The suppression of free speech is wrong.',
        example_translation: '压制言论自由是错误的。'
      },
      {
        word: 'expressive',
        phonetic: '/ɪkˈpresɪv/',
        meaning: '富于表现力的',
        etymology: 'express (表达) + -ive',
        example: 'She has an expressive face.',
        example_translation: '她有一张富于表情的脸。'
      },
      {
        word: 'compressible',
        phonetic: '/kəmˈpresəbl/',
        meaning: '可压缩的',
        etymology: 'compress (压缩) + -ible',
        example: 'Air is compressible.',
        example_translation: '空气是可压缩的。'
      },
      {
        word: 'repress',
        phonetic: '/rɪˈpres/',
        meaning: '压抑；压制',
        etymology: 're- (回) + press (压) → 压回去 → 压抑',
        example: 'She repressed her anger.',
        example_translation: '她压抑了她的愤怒。'
      },
      {
        word: 'repression',
        phonetic: '/rɪˈpreʃn/',
        meaning: '压抑；压制',
        etymology: 'repress (压抑) + -ion',
        example: 'The repression of memories can be harmful.',
        example_translation: '压抑记忆可能是有害的。'
      },
      {
        word: 'expression',
        phonetic: '/ɪkˈspreʃn/',
        meaning: '表达；表情',
        etymology: 'express (表达) + -ion',
        example: 'Her expression showed her happiness.',
        example_translation: '她的表情显示了她的快乐。'
      },
      {
        word: 'impression',
        phonetic: '/ɪmˈpreʃn/',
        meaning: '印象；印记',
        etymology: 'impress (打动) + -ion',
        example: 'First impressions are important.',
        example_translation: '第一印象很重要。'
      },
      {
        word: 'compressor',
        phonetic: '/kəmˈpresə(r)/',
        meaning: '压缩机',
        etymology: 'compress (压缩) + -or (物)',
        example: 'The compressor pumps air into the tire.',
        example_translation: '压缩机把空气打进轮胎。'
      },
      {
        word: 'unimpressive',
        phonetic: '/ˌʌnɪmˈpresɪv/',
        meaning: '不令人印象深刻的',
        etymology: 'un- (不) + impressive (令人印象深刻的)',
        example: 'The results were unimpressive.',
        example_translation: '结果并不令人印象深刻。'
      },
      {
        word: 'depressant',
        phonetic: '/dɪˈpresnt/',
        meaning: '镇静剂；抑制剂',
        etymology: 'depress (压) + -ant (物)',
        example: 'Alcohol acts as a depressant.',
        example_translation: '酒精起镇静剂的作用。'
      },
      {
        word: 'oppressive',
        phonetic: '/əˈpresɪv/',
        meaning: '压迫性的；令人窒息的',
        etymology: 'oppress (压迫) + -ive',
        example: 'The heat was oppressive.',
        example_translation: '热得令人窒息。'
      },
      {
        word: 'suppressive',
        phonetic: '/səˈpresɪv/',
        meaning: '抑制的；镇压的',
        etymology: 'suppress (抑制) + -ive',
        example: 'The drug has suppressive effects.',
        example_translation: '这种药有抑制作用。'
      },
      {
        word: 'repressive',
        phonetic: '/rɪˈpresɪv/',
        meaning: '镇压的；压抑的',
        etymology: 'repress (压抑) + -ive',
        example: 'The regime was repressive.',
        example_translation: '这个政权是镇压性的。'
      },
      {
        word: 'unexpressed',
        phonetic: '/ˌʌnɪkˈsprest/',
        meaning: '未表达的；未说出的',
        etymology: 'un- (不) + expressed (表达的)',
        example: 'Her feelings remained unexpressed.',
        example_translation: '她的感受未表达出来。'
      }
    ]
  }
];

export default builtinWords;
