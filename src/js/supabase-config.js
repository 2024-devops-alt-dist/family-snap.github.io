import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm";

const SUPABASE_URL = 'https://nyrvwnhonznixxnclqbg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cnZ3bmhvbnpuaXh4bmNscWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1OTk0NDMsImV4cCI6MjA1MDE3NTQ0M30.e1ok-UIQI1pNelZryUlmQ4Ej70TJGrwmkEXxKxir-ME';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);