-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 创建词库表
CREATE TABLE IF NOT EXISTS vocabularies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    word_count INTEGER DEFAULT 0,
    progress FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocabularies_user_id ON vocabularies(user_id);

-- 创建单词表
CREATE TABLE IF NOT EXISTS words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vocabulary_id UUID REFERENCES vocabularies(id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    phonetic VARCHAR(100),
    meaning TEXT NOT NULL,
    etymology TEXT,
    example TEXT,
    example_translation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_words_vocabulary_id ON words(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);

-- 创建用户单词关联表
CREATE TABLE IF NOT EXISTS user_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    word_id UUID REFERENCES words(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'learning' CHECK (status IN ('learning', 'mastered')),
    review_count INTEGER DEFAULT 0,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_user_words_user_id ON user_words(user_id);
CREATE INDEX IF NOT EXISTS idx_user_words_word_id ON user_words(word_id);
CREATE INDEX IF NOT EXISTS idx_user_words_status ON user_words(status);

-- 创建测试表
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vocabulary_id UUID REFERENCES vocabularies(id) ON DELETE CASCADE,
    word_count INTEGER NOT NULL,
    test_type VARCHAR(20) NOT NULL CHECK (test_type IN ('choice', 'fill')),
    score FLOAT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_vocabulary_id ON tests(vocabulary_id);

-- 创建测试结果表
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    word_id UUID REFERENCES words(id) ON DELETE CASCADE,
    user_answer VARCHAR(255),
    correct_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_word_id ON test_results(word_id);

-- Supabase访问权限设置

-- 基本访问权限
GRANT SELECT ON users TO anon;
GRANT SELECT ON vocabularies TO anon;
GRANT SELECT ON words TO anon;

-- 认证用户完整权限
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT ALL PRIVILEGES ON vocabularies TO authenticated;
GRANT ALL PRIVILEGES ON words TO authenticated;
GRANT ALL PRIVILEGES ON user_words TO authenticated;
GRANT ALL PRIVILEGES ON tests TO authenticated;
GRANT ALL PRIVILEGES ON test_results TO authenticated;

-- RLS(行级安全)策略

-- vocabularies表的RLS策略
ALTER TABLE vocabularies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查看自己的词库" ON vocabularies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能修改自己的词库" ON vocabularies
    FOR ALL USING (auth.uid() = user_id);

-- words表的RLS策略  
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以查看词库中的单词" ON words
    FOR SELECT USING (
        vocabulary_id IN (
            SELECT id FROM vocabularies WHERE user_id = auth.uid()
        )
    );
    
-- 为了方便导入，允许用户向属于自己的词库中插入单词
CREATE POLICY "用户可以向自己的词库添加单词" ON words
    FOR INSERT WITH CHECK (
        vocabulary_id IN (
            SELECT id FROM vocabularies WHERE user_id = auth.uid()
        )
    );

-- user_words表的RLS策略
ALTER TABLE user_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查看自己的学习记录" ON user_words
    FOR ALL USING (auth.uid() = user_id);

-- tests表的RLS策略
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查看自己的测试" ON tests
    FOR ALL USING (auth.uid() = user_id);

-- test_results表的RLS策略
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查看自己的测试结果" ON test_results
    FOR ALL USING (
        test_id IN (
            SELECT id FROM tests WHERE user_id = auth.uid()
        )
    );
