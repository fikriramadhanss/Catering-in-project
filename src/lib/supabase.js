import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://akkejybcynvxrnclpeck.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFra2VqeWJjeW52eHJuY2xwZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjEwNjIsImV4cCI6MjA5NDEzNzA2Mn0.m5a-Ik6tlufayhDkcCr9vp4dn20PcbTkTcwMWH4BUAs';

const isValidUrl = supabaseUrl.startsWith('http');

export const supabase = isValidUrl 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!isValidUrl) {
  console.warn("⚠️ URL Supabase sepertinya tidak valid. URL harus diawali dengan 'https://'. Silakan periksa kembali Project URL di dashboard Supabase Anda.");
}
