import { createClient } from '@supabase/supabase-js';

// 从环境变量读取，如果不存在则使用默认值
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://squqxcwehpqpmyjsnlnl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdXF4Y3dlaHBxcG15anNubG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MTY1MDUsImV4cCI6MjA4MDI5MjUwNX0.yk_GdCUfGXD6pReevFqB0JntDe4Slzvux7rwVgX7e90';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
