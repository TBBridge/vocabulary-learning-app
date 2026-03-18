import pandas as pd
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

df = pd.read_excel('E:/999_Temp/Private/四级词汇_导入格式_完整版.xlsx')
print('Columns:', df.columns.tolist())
print('Shape:', df.shape)
print('\nSample words with detailed data:')
# 显示有详细数据的单词样本
for idx, row in df.iterrows():
    if '基础词汇' not in str(row['etymology']):
        print(f"\n{row['word']}: {row['meaning']}")
        print(f"  词根词缀: {row['etymology']}")
        print(f"  例句: {row['example']}")
        print(f"  翻译: {row['example_translation']}")
        if idx > 30:
            break
