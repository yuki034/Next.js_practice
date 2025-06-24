'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateUsers } from '@/app/lib/actions';
import { useActionState } from 'react';
import { User } from '@/app/lib/definitions';


export default function EditUserForm({ user }: { user: User }) {
  const initialState = { message:"", errors: {} };
  const updateUsersWithId = updateUsers.bind(null, user.id);
  const [, formAction] = useActionState(updateUsersWithId, initialState);

  return (
    <form action={formAction}>

        <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ID</label>
          <input
            name="id"
            defaultValue={user.id}
            required
            className="w-full border rounded px-2 py-1"
          />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            defaultValue={user.name}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            name="email"
            type="email"
            defaultValue={user.email}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="新しいパスワードを入力（変更しない場合は空欄）"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/Users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          キャンセル
        </Link>
        <Button type="submit">ユーザー編集</Button>
      </div>
      </div>
    </form>
  );
}