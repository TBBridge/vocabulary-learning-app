import pandas as pd
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

df = pd.read_excel('E:/999_Temp/Private/四级词汇_导入格式.xlsx')
print('Columns:', df.columns.tolist())
print('Shape:', df.shape)
print('\nFirst 15 rows:')
print(df.head(15).to_string())
