import { Inter, Lusitana } from 'next/font/google'
// subsets, 子集, 下载的字体的一个小子集
// 从next/font导入的，next已经帮我们进行了优化
export const inter = Inter({ subsets: ['latin']})

export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700']
})