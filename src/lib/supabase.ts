import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://rexhmsqzwduxdrytrtoi.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQxNjU5NWJlLTJlNDgtNDUzYi04NDY3LTk0ZjExOTMwMGI1ZSJ9.eyJwcm9qZWN0SWQiOiJyZXhobXNxendkdXhkcnl0cnRvaSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwNjEzOTI5LCJleHAiOjIwOTU5NzM5MjksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.tevaPEqc-JowZu-O8OPXC0F4mAl_eIeMlLindAXOX2E';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };