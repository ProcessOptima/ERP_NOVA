"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {fetchWithAuth} from "@/app/api";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

type PersonCreatePayload = {
    last_name?: string | null;
    first_name: string;
    middle_name?: string | null;
    email?: string | null;
    photo?: string | null;
    sex?: number | null;
    birthday?: string | null;
    description?: string | null;
};

export default function NewPersonPage() {
    const router = useRouter();

    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<PersonCreatePayload>({
        last_name: "",
        first_name: "",
        middle_name: "",
        email: "",
        photo: "",
        sex: null,
        birthday: null,
        description: "",
    });

    function setField<K extends keyof PersonCreatePayload>(key: K, value: PersonCreatePayload[K]) {
        setForm((prev) => ({...prev, [key]: value}));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.first_name || form.first_name.trim().length === 0) {
            alert("First name is required");
            return;
        }

        setSaving(true);
        try {
            const res = await fetchWithAuth("/persons/", {
                method: "POST",
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                console.error("Create person error:", res.status, await res.text());
                alert("Ошибка создания");
                return;
            }

            router.push("/persons");
        } catch (err) {
            console.error(err);
            alert("Network error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-semibold">Create person</h1>

            <ComponentCard title="">
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Last name
                            </label>
                            <Input
                                defaultValue={form.last_name ?? ""}
                                onChange={(e) => setField("last_name", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                First name *
                            </label>
                            <Input
                                defaultValue={form.first_name}
                                onChange={(e) => setField("first_name", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Middle name
                            </label>
                            <Input
                                defaultValue={form.middle_name ?? ""}
                                onChange={(e) => setField("middle_name", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Email
                            </label>
                            <Input
                                type="email"
                                defaultValue={form.email ?? ""}
                                onChange={(e) => setField("email", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Photo (url)
                            </label>
                            <Input
                                defaultValue={form.photo ?? ""}
                                onChange={(e) => setField("photo", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Birthday
                            </label>
                            <Input
                                type="date"
                                defaultValue={form.birthday ?? ""}
                                onChange={(e) => setField("birthday", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Sex (1=Male, 2=Female)
                            </label>
                            <Input
                                type="number"
                                defaultValue={form.sex ?? ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setField("sex", v === "" ? null : Number(v));
                                }}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Description
                            </label>
                            <Input
                                defaultValue={form.description ?? ""}
                                onChange={(e) => setField("description", e.target.value)}
                            />
                        </div>

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
