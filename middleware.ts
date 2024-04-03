import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 这个方法会调用 authorized
export default NextAuth(authConfig).auth

// 什么时候中间件执行？凡是请求在这个数组中匹配成功时，就会执行
// /开头，不是api, 不是_next/static, 不是_next/image，不是\.png的其他地址，
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
