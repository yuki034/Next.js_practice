'use client'

import Link from 'next/link';
import { useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';

export default function CreateUserForm() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      await createUser(id, name, email, password,);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md bg-gray-50 p-4 md:p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">ID</label>
        <input value={id} onChange={e => setId(e.target.value)} required className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">E-mail</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
         href="/dashboard/Users"
         className="flex h-10 items-center rounded-lg bg-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
         >
         Cancel
        </Link>
        <Button type="submit">Create Users</Button>
      </div>
    </form>
  );
}
