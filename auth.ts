import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
    async authorize(credentials) {
      console.log('Authorize function called with:', credentials); // 1. 受け取った情報を確認
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);

        if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            console.log('Validation successful for email:', email); // 2. バリデーション成功を確認

            const user = await getUser(email);
            if (!user)return null;
            const passwordsMatch = await bcrypt.compare(password, user.password);//ハッシュ化されたパスワードを比較します

            if (passwordsMatch) return user;
            }

            console.log('Invalid credentials');
          return null;
        },
      }),
    ],
  });