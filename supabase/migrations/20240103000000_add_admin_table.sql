-- 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- 创建用户资料表（存储用户公开信息）
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    name VARCHAR(100),
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 自动创建 profiles 记录的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_guest)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'isGuest')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除已存在的触发器（如果有）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建用户学习统计视图
CREATE OR REPLACE VIEW user_learning_stats AS
SELECT 
    p.id,
    p.email,
    p.name,
    p.created_at,
    p.is_guest,
    COALESCE(mastered.count, 0) as total_words_learned,
    COALESCE(test_stats.count, 0) as total_tests_taken,
    COALESCE(test_stats.avg_score, 0) as average_score,
    COALESCE(activity.last_active, p.created_at) as last_active
FROM profiles p
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM user_words
    WHERE status = 'mastered'
    GROUP BY user_id
) mastered ON p.id = mastered.user_id
LEFT JOIN (
    SELECT 
        user_id, 
        COUNT(*) as count,
        ROUND(AVG(score)) as avg_score
    FROM tests
    WHERE completed_at IS NOT NULL
    GROUP BY user_id
) test_stats ON p.id = test_stats.user_id
LEFT JOIN (
    SELECT user_id, MAX(last_reviewed) as last_active
    FROM user_words
    GROUP BY user_id
) activity ON p.id = activity.user_id;

-- RLS 策略
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- admins 表策略
CREATE POLICY "所有人可以查看管理员列表" ON admins
    FOR SELECT USING (true);

CREATE POLICY "只有管理员可以添加管理员" ON admins
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
    );

-- profiles 表策略
CREATE POLICY "用户可以查看所有资料" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "用户只能更新自己的资料" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 授权
GRANT ALL PRIVILEGES ON admins TO authenticated;
GRANT ALL PRIVILEGES ON profiles TO authenticated;
GRANT SELECT ON user_learning_stats TO authenticated;

-- 为现有用户创建 profiles 记录
INSERT INTO profiles (id, email, name, is_guest)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
    COALESCE((u.raw_user_meta_data->>'isGuest')::boolean, false)
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = u.id);

-- 插入默认管理员
-- 请将下面的 'admin@example.com' 替换为实际管理员的邮箱
-- INSERT INTO admins (user_id) 
-- SELECT id FROM profiles WHERE email = 'admin@example.com';
