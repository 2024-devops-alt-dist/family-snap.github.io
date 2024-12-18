// Configuración de Supabase
const SUPABASE_URL = 'https://phaavyhwbzmzfrndwkwb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYWF2eWh3YnptemZybmR3a3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzUwNDUsImV4cCI6MjA1MDExMTA0NX0.E0SttKH0ftlRy8tV5MfJQZw1kzF0yNnzCZ68OHIsn1c';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
