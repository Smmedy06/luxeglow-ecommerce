import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

/**
 * Check if the current user is an admin
 * Uses the is_admin() RPC function to avoid RLS recursion
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    // Use RPC function to check admin status (bypasses RLS)
    const { data, error } = await supabase.rpc('is_admin');

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get admin user info
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    // Check if user is admin using RPC function
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) return null;

    // Get profile info (this should work now with the fixed RLS)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', session.user.id)
      .maybeSingle();

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.full_name || session.user.email?.split('@')[0] || 'Admin',
      isAdmin: true,
    };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

/**
 * Set a user as admin (only existing admins can do this)
 */
export async function setUserAsAdmin(userId: string, isAdmin: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_admin: isAdmin })
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting admin status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error setting admin status:', error);
    return false;
  }
}

