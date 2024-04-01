import '@/app/ui/global.css'
// @代表整个项目的目录
import { inter } from '@/app/ui/fonts'
// 设置了全局的字体
// Here, you're also adding the Tailwind antialiased class which smooths out the font. It's not necessary to use this class, but it adds a nice touch.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
