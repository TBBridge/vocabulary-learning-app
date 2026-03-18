import pandas as pd
df = pd.read_excel('E:/999_Temp/Private/四级单词汇总.xlsx')
print('Columns:', df.columns.tolist())
print('Shape:', df.shape)
print(df.head(10))
