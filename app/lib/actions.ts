'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 数据规则
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // 强制转换
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

// 针对创建发票时的验证器，去掉id和date
const CreateInvoice = FormSchema.omit({ id: true, date: true});

export async function createInvoice(formData: FormData) {
  // const rawFormData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // };
  // console.log(rawFormData);

  // 解析验证这些数据，验证成功后返回数据对象
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  // 以分为单位的转换
  const amountInCents = amount * 100;
  // 得到年月日
  const date = new Date().toISOString().split('T')[0];
  // 出错后：界面无反应
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (err) {
    return {message: 'Database Error: insert fail'}
  }
  
  // 告诉nextjs 针对'/dashboard/invoices'路由的数据需要更新了。
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql `DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard.invoices');
}



