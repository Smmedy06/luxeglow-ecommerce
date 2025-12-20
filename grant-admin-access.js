/**
 * Script to grant admin access to a user
 * Run with: node grant-admin-access.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjemerhlkrgjveymixxs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const userId = '06a7ae47-e4bc-4370-8532-f1278cd120b5';
const userEmail = 'hamzaraies.2005@gmail.com';

async function grantAdminAccess() {
  console.log('Granting admin access to user...');
  console.log(`User ID: ${userId}`);
  console.log(`Email: ${userEmail}`);
  console.log('');

  try {
    // First, check if user profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking user profile:', fetchError);
      return;
    }

    if (existingProfile) {
      // Update existing profile
      console.log('User profile exists. Updating admin status...');
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          is_admin: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();

      if (error) {
        console.error('Error updating user profile:', error);
        return;
      }

      console.log('✅ Successfully granted admin access!');
      console.log('Updated profile:', data[0]);
    } else {
      // Create new profile with admin access
      console.log('User profile does not exist. Creating new profile with admin access...');
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          full_name: 'Hamza Raies',
          is_admin: true
        })
        .select();

      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      console.log('✅ Successfully created user profile with admin access!');
      console.log('Created profile:', data[0]);
    }

    // Verify the admin status
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('user_id, full_name, is_admin')
      .eq('user_id', userId)
      .single();

    if (verifyError) {
      console.error('Error verifying admin status:', verifyError);
      return;
    }

    console.log('');
    console.log('Verification:');
    console.log(`- User ID: ${verifyData.user_id}`);
    console.log(`- Full Name: ${verifyData.full_name}`);
    console.log(`- Is Admin: ${verifyData.is_admin ? '✅ YES' : '❌ NO'}`);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

grantAdminAccess();


