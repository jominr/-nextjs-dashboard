import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({params}: {params: {id: string}}) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    // fetchInvoiceById(id), // 123abc, 先检测格式对不对，格式不对就直接报错，不会404
    // 因此加catch，如果出错自己的代码catch处理，将返回undefined promise, await后就得到undefined的结果。
    fetchInvoiceById(id).catch(()=>{}),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}