
import Breadcrumbs from '@/app/ui/Users/breadcrumbs';
import EditUserForm from '@/app/ui/Users/edit-form';
import { fetchUsers } from '@/app/lib/data';
import { Metadata } from 'next';

export default async function Page({ params }: { params: { id: string } }) {
    const users = await fetchUsers();
    if (typeof params.id !== 'string') {
      // エラー処理
      return <div>不正なIDです</div>;
    }
    const user = users.find(u => u.id === String(params.id));
    if (!user) {
        return <div>ユーザーが見つかりません</div>;
      }

return (
    <main>
      <Breadcrumbs
      breadcrumbs={[
  { label: 'Users', href: '/dashboard/users' },
  {
    label: 'Edit Users',
    href: `/dashboard/Users/edit`,
    active: true,
  },  ]}
  />
  <EditUserForm user={user} />
</main>
);
}
export const metadata: Metadata = {
title: 'edit',
};