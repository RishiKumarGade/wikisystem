import Link from 'next/link'

import { getCurrentUser } from '@/lib/auth/current-user'
import { LogoutButton } from './logout-button'
import { isEditor } from '@/modules/auth/auth.permissions'


export async function Navbar() {
    const user =
        await getCurrentUser()

    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-xl font-bold"
                >
                    WikiSystem
                </Link>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/articles"
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                Articles
                            </Link>

                            <Link
                                href="/articles/new"
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                New Draft
                            </Link>

                            <span className="text-sm text-gray-500">
                                {user.email}
                            </span>
                            {isEditor(user) ? (
                                <Link
                                    href="/admin/users"
                                    className="text-sm text-gray-600 hover:text-black"
                                >
                                    Users
                                </Link>
                            ) : null}

                            <Link
                                href="/articles/archived"
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                Archived
                            </Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg border px-3 py-1 text-sm"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

