import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      try {
        // First, try to get the user
        const { data: existingUser, error: queryError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        // If user doesn't exist and no error (other than not found)
        if (!existingUser && (!queryError || queryError.code === 'PGRST116')) {
          // Create new user
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            });

          if (insertError) {
            console.error('Error creating user:', insertError);
            // Continue even if insert fails
            return true;
          }
        } else if (queryError && queryError.code !== 'PGRST116') {
          console.error('Error checking user:', queryError);
          // Continue even if query fails
          return true;
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        // Continue even if there's an error
        return true;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };