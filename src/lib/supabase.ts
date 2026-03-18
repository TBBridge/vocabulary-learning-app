import { createClient } from '@supabase/supabase-js';

// 支持 Vite 环境变量和 process.env (Node.js)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 如果环境变量缺失，创建一个模拟客户端，避免应用崩溃
// 实际功能会提示用户登录
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
