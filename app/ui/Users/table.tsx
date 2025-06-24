import { User } from '@/app/lib/definitions';
import { UpdateUsers, DeleteUsers } from '@/app/ui/Users/buttons';

export default function UsersTable({ users }: { users: User[] }) {
    return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
                <th className="px-3 py-5 font-medium">E-mail</th>
              </tr>
            </thead>
            <tbody className="bg-white">
            {users.map((user) => (
                <tr
                key={user.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {user.name}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                    {user.email}
                </td>
                <td className="whitespace-nowrap px-3 py-3 flex gap-10">
                  <UpdateUsers id={user.id} />
                  <DeleteUsers id={user.id} />
                </td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
    );
}
