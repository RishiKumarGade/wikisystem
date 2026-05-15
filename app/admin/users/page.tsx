import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  isEditor,
} from '@/modules/auth/auth.permissions'

import {
  getAllUsers,
} from '@/modules/users/user.service'

import { PromoteButton } from '@/components/admin/promote-button'

export default async function AdminUsersPage() {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (!isEditor(user)) {
    redirect('/articles')
  }

  const users =
    await getAllUsers(user)

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="mt-2 text-gray-600">
          Manage contributor and editor roles.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3">
                Email
              </th>

              <th className="px-4 py-3">
                Role
              </th>

              <th className="px-4 py-3">
                Created
              </th>

              <th className="px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map(
              (listedUser) => (
                <tr
                  key={
                    listedUser.id
                  }
                  className="border-b"
                >
                  <td className="px-4 py-3">
                    {
                      listedUser.email
                    }
                  </td>

                  <td className="px-4 py-3">
                    {
                      listedUser.role
                    }
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(
                      listedUser.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    {listedUser.role ===
                    'EDITOR' ? (
                      <span className="text-sm text-gray-500">
                        Already
                        Editor
                      </span>
                    ) : (
                      <PromoteButton
                        userId={
                          listedUser.id
                        }
                      />
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}