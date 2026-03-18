import pandas as pd
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

df = pd.read_excel('E:/999_Temp/Private/四级单词汇总.xlsx')
print('Columns:', df.columns.tolist())
print('Shape:', df.shape)
print(df.head(10).to_string())
