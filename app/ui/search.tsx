'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); // ?query=shui，只读的
  const pathname = usePathname(); //  /dashboard/invoices
  const { replace } = useRouter();
  // 使用 useDebouncedCallback 消除抖动，这个需要npm install
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    // 标准API，js天生就有的，创建一个searchParams对象实例出来，隐藏的searchParams.toString()
    const params = new URLSearchParams(searchParams);
    // 每次查询发生变化时，都要把page重置为1
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
    // 调用router.replace()替换url
  }, 500);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={ (e)=>{
          // e事件，e.target事件的目标指的是这个input框
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
