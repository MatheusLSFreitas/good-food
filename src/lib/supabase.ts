import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ztnefxarpspfeicmjetu.supabase.co'
const supabaseKey = 'sb_publishable_e0qwiN0JJ1ncGI11osUqGA_Jq-OE4D7'

export const supabase = createClient(supabaseUrl, supabaseKey)