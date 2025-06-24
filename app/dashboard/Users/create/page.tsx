import CreateUserForm from '@/app/ui/Users/create-form';
import Breadcrumbs from '@/app/ui/Users/breadcrumbs';
import { Metadata } from 'next';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/dashboard/Users' },
          {
            label: 'Create Users',
            href: '/dashboard/Users/create',
            active: true,
          },
        ]}
      />
    <CreateUserForm />
    </main>
  );
}

export const metadata:Metadata = {
    title: 'create',
};