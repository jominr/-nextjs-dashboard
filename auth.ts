import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    // 以防数据库报错，敏感信息反映在浏览器上。
    // 打印在服务器端
    console.error('Failed to fetch user:', error);
    // 反映给浏览器
    throw new Error('Failed to fetch user.');
  }
}

// 之所以要单独写这么一个文件，而不是像授权验证那样只写authConfig, 再在middleware中使用，
// 是因为用于密码校验的依赖包，需要node的一个api, 这个api不能在中间件中使用。
// 这里signIn会调用authorize这个方法来显示登录验证。
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig, // 把第一层展开，再拼成一个对象，浅拷贝，
  providers: [ // 提供登录验证的能力，可以是账号密码，可以是微信扫描，可以是邮箱，多种登录方式对应多个。
    Credentials({ // 账号密码的方式。Credentials的参数是配置。
      async authorize(credentials) {
        // 验证用户凭证。z.object()生成一个具有校验能力的对象，.safeParse()去真实的校验，得到一个验证结果parsedCredentials
        const parsedCredentials = z
          .object({email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        // 如果验证成功
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // 获取数据库中相应的用户信息
          const user = await getUser(email);
          if (!user) return null;
          // 进行密码匹配，如果匹配成功，返回用户信息。
          // 就是因为这个bcrypt模块，我们单独写出来这个文件。我们给的string password能不能转换成数据库里存的这个值。
          const passwordsMatch = await bcrypt.compare(password, user.password);
          // user会作为是否登录的标准，后续也会保存起来。
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null; // 验证失败，
      },
    }),
  ],
});