import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { fetchUsers } from '@/app/lib/data';
import UsersTable from '@/app/ui/Users/table';
import { CreateUsers } from '@/app/ui/Users/buttons';


export default async function Page({}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const users = await fetchUsers();
  const Commonusers = users.filter((user: any) => !user.is_admin );
   return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
        <CreateUsers />
      </div>
      <div className="mt-5">
        <UsersTable users={Commonusers} />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
    title: 'Users',
};