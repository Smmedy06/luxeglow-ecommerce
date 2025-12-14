'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/');
          return;
        }

        if (session?.user) {
          // Create or update user profile if needed
          try {
            const name = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name || 
                        session.user.email?.split('@')[0] || 
                        'User';

            // Check if profile exists
            const { data: existingProfile } = await supabase
              .from('user_profiles')
              .select('user_id')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (!existingProfile) {
              // Insert new profile
              const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                  user_id: session.user.id,
                  full_name: name,
                });

              if (profileError) {
                console.error('Error creating profile in callback:', {
                  message: profileError.message,
                  code: profileError.code,
                  details: profileError.details,
                  hint: profileError.hint
                });
              }
            }
          } catch (profileErr) {
            console.error('Exception creating profile in callback:', profileErr);
          }
        }

        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Error handling auth callback:', error);
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ba9157] mx-auto mb-4"></div>
        <p className="text-[#6b5d52]">Completing authentication...</p>
      </div>
    </div>
  );
}

