import pandas as pd
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 读取 Excel
df = pd.read_excel('E:/999_Temp/Private/四级单词汇总.xlsx', header=None)

# 提取单词和释义
words = []

# 左侧列组 (列2=单词, 列3=释义)
for idx, row in df.iterrows():
    word = row[2]
    meaning = row[3]
    if pd.notna(word) and pd.notna(meaning):
        words.append({
            'word': str(word).strip(),
            'meaning': str(meaning).strip(),
            'phonetic': '',
            'example': '',
            'example_translation': '',
            'etymology': ''
        })

# 右侧列组 (列7=单词, 列8=释义)
for idx, row in df.iterrows():
    word = row[7]
    meaning = row[8]
    if pd.notna(word) and pd.notna(meaning):
        words.append({
            'word': str(word).strip(),
            'meaning': str(meaning).strip(),
            'phonetic': '',
            'example': '',
            'example_translation': '',
            'etymology': ''
        })

print(f'Total words: {len(words)}')
print('Sample words:')
for w in words[:10]:
    print(f"  {w['word']}: {w['meaning']}")

# 保存为新的 Excel 文件
output_df = pd.DataFrame(words)
output_df.to_excel('E:/999_Temp/Private/四级词汇_导入格式.xlsx', index=False)
print('\nSaved to: E:/999_Temp/Private/四级词汇_导入格式.xlsx')
