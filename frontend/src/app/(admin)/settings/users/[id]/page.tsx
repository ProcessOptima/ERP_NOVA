"use client";

import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import {API} from "@/app/api";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

interface UpdateUserPayload {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    password?: string;
}

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;

    const [user, setUser] = useState<User | null>(null);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ===============================
    // LOAD USER
    // ===============================
    useEffect(() => {
        if (!userId) return;

        (async () => {
            try {
                const res = await fetch(`${API}/users/${userId}/`, {
                    credentials: "include",
                });

                if (res.status === 401) {
                    router.push("/signin");
                    return;
                }

                if (!res.ok) return;

                const data: User = await res.json();
                setUser(data);
            } catch (e) {
                console.error("Load user error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId, router]);

    // ===============================
    // SAVE USER
    // ===============================
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;

        setSaving(true);

        const payload: UpdateUserPayload = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
        };

        if (password.trim() !== "") {
            payload.password = password;
        }

        try {
            const res = await fetch(`${API}/users/${userId}/`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                router.push("/signin");
                return;
            }

            if (res.ok) {
                router.push("/settings/users");
            }
        } catch (e) {
            console.error("Save user error:", e);
        } finally {
            setSaving(false);
        }
    }

    if (loading || !user) {
        return <p className="text-gray-500">Loading...</p>;
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-semibold">Edit user</h1>

            <ComponentCard title="">
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* EMAIL */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Email
                            </label>
                            <Input
                                type="email"
                                defaultValue={user.email}
                                onChange={(e) =>
                                    setUser((prev) =>
                                        prev ? {...prev, email: e.target.value} : prev
                                    )
                                }
                            />
                        </div>

                        {/* ROLE */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Role
                            </label>
                            <Input
                                defaultValue={user.role}
                                onChange={(e) =>
                                    setUser((prev) =>
                                        prev ? {...prev, role: e.target.value} : prev
                                    )
                                }
                            />
                        </div>

                        {/* FIRST NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                First name
                            </label>
                            <Input
                                defaultValue={user.first_name}
                                onChange={(e) =>
                                    setUser((prev) =>
                                        prev ? {...prev, first_name: e.target.value} : prev
                                    )
                                }
                            />
                        </div>

                        {/* LAST NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Last name
                            </label>
                            <Input
                                defaultValue={user.last_name}
                                onChange={(e) =>
                                    setUser((prev) =>
                                        prev ? {...prev, last_name: e.target.value} : prev
                                    )
                                }
                            />
                        </div>

                        {/* NEW PASSWORD */}
                        <div className="col-span-full">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                New password
                            </label>
                            <Input
                                type="password"
                                placeholder="Leave empty to keep current password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* SUBMIT */}
                        <div className="col-span-full">
                            <Button className="w-full" size="sm" disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </Form>
            </ComponentCard>
        </div>
    );
}
