
import Breadcrumbs from '@/app/ui/Users/breadcrumbs';
import EditUserForm from '@/app/ui/Users/edit-form';
import { fetchUsers } from '@/app/lib/data';
import { Metadata } from 'next';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const users = await fetchUsers();
  const user = users.find((u) => u.id === params.id);
  if (!user) return <div>ユーザーが見つかりません</div>;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/dashboard/users' },
          {
            label: 'Edit Users',
            href: `/dashboard/Users/edit`,
            active: true,
          },
        ]}
      />
      <EditUserForm user={user} />
    </main>
  );
}

export const metadata: Metadata = {
title: 'edit',
};