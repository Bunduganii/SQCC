import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "sb_publishable_FlFqrDC2EYrYUnsRy3Sj1g_FvLpzMMN";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuYnNranRoYXJ5dGJwbWxlZGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTQ2OTksImV4cCI6MjA5NzIzMDY5OX0.p4v4PpdB7uXg99hlDKRJ22UcDSsgMmTp3bIr8mGmBgk";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);