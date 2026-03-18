import pandas as pd
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

df = pd.read_excel('E:/999_Temp/Private/四级单词汇总.xlsx', header=None)
print('Shape:', df.shape)
print('First 5 rows raw:')
print(df.head(5).to_string())
print('\n\nAll columns:')
for i, col in enumerate(df.columns):
    print(f'Column {i}: {col}')
