-- 添加 is_public 字段到 vocabularies 表
ALTER TABLE vocabularies ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 更新 RLS 策略，允许查看公共词库
DROP POLICY IF EXISTS "用户只能查看自己的词库" ON vocabularies;
DROP POLICY IF EXISTS "用户只能修改自己的词库" ON vocabularies;

-- 新策略：用户可以查看公共词库或自己的词库
CREATE POLICY "用户可以查看公共词库或自己的词库" ON vocabularies
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- 新策略：只有词库创建者可以修改
CREATE POLICY "只有词库创建者可以修改词库" ON vocabularies
    FOR ALL USING (auth.uid() = user_id);

-- 允许所有认证用户向公共词库插入单词
DROP POLICY IF EXISTS "用户可以查看词库中的单词" ON words;
DROP POLICY IF EXISTS "用户可以向自己的词库添加单词" ON words;

CREATE POLICY "用户可以查看词库中的单词" ON words
    FOR SELECT USING (
        vocabulary_id IN (
            SELECT id FROM vocabularies WHERE is_public = true OR user_id = auth.uid()
        )
    );

CREATE POLICY "用户可以向词库添加单词" ON words
    FOR INSERT WITH CHECK (
        vocabulary_id IN (
            SELECT id FROM vocabularies WHERE user_id = auth.uid()
        )
    );

-- 为 is_public 字段创建索引
CREATE INDEX IF NOT EXISTS idx_vocabularies_is_public ON vocabularies(is_public);
