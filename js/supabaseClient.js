const SUPABASE_URL = "https://mttmibybyzoqoorkysil.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dG1pYnlieXpvcW9vcmt5c2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NzY3NTgsImV4cCI6MjA5NTI1Mjc1OH0.i6ynS4NINJKYQskADDxRkC1UXh9fnIAaAN2KJs5cqLo";


console.log(SUPABASE_URL);
console.log(SUPABASE_KEY);


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);