"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {fetchWithAuth} from "@/app/api";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

export default function NewUserPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
        password: "",
    });

    function update(key: keyof typeof form, value: string) {
        setForm((prev) => ({...prev, [key]: value}));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const res = await fetchWithAuth("/users/", {
                method: "POST",
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push("/settings/users");
            } else {
                console.error("Create user error", res.status);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-semibold">Create user</h1>

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
                                onChange={(e) => update("email", e.target.value)}
                            />
                        </div>

                        {/* ROLE */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Role
                            </label>
                            <Input
                                defaultValue="user"
                                onChange={(e) => update("role", e.target.value)}
                            />
                        </div>

                        {/* FIRST NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                First name
                            </label>
                            <Input
                                onChange={(e) => update("first_name", e.target.value)}
                            />
                        </div>

                        {/* LAST NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Last name
                            </label>
                            <Input
                                onChange={(e) => update("last_name", e.target.value)}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="col-span-full">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Password
                            </label>
                            <Input
                                type="password"
                                onChange={(e) => update("password", e.target.value)}
                            />
                        </div>

                        {/* SUBMIT */}
                        <div className="col-span-full">
                            <Button className="w-full" size="sm">
                                Save
                            </Button>
                        </div>
                    </div>
                </Form>
            </ComponentCard>
        </div>
    );
}
