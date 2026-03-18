import pandas as pd

df = pd.read_excel('E:/999_Temp/Private/四级单词汇总.xlsx')
print('Columns:', df.columns.tolist())
print('Shape:', df.shape)
print('First 10 rows:')
print(df.head(10).to_string())
