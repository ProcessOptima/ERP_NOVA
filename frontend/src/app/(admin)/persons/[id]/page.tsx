"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";

import {fetchWithAuth} from "@/app/api";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

type PersonDetail = {
    id: number;
    last_name: string | null;
    first_name: string;
    middle_name: string | null;
    full_name: string;
    photo: string | null;
    email: string | null;
    sex: number | null;
    birthday: string | null;
    description: string | null;
};

type PersonUpdatePayload = {
    last_name?: string | null;
    first_name?: string;
    middle_name?: string | null;
    email?: string | null;
    photo?: string | null;
    sex?: number | null;
    birthday?: string | null;
    description?: string | null;
};

export default function EditPersonPage() {
    const router = useRouter();
    const params = useParams();
    const personId = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [person, setPerson] = useState<PersonDetail | null>(null);

    async function loadPerson(id: string) {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/persons/${id}/`);
            if (res.status === 401) {
                router.push("/signin");
                return;
            }
            if (!res.ok) {
                console.error("Load person error:", res.status, await res.text());
                return;
            }
            const data: PersonDetail = await res.json();
            setPerson(data);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!person) return;

        const payload: PersonUpdatePayload = {
            last_name: person.last_name,
            first_name: person.first_name,
            middle_name: person.middle_name,
            email: person.email,
            photo: person.photo,
            sex: person.sex,
            birthday: person.birthday,
            description: person.description,
        };

        setSaving(true);
        try {
            const res = await fetchWithAuth(`/persons/${person.id}/`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                router.push("/signin");
                return;
            }

            if (!res.ok) {
                console.error("Save person error:", res.status, await res.text());
                alert("Ошибка сохранения");
                return;
            }

            router.push("/persons");
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        if (typeof personId === "string") {
            loadPerson(personId);
        }
    }, [personId]);

    if (loading || !person) return <p className="text-gray-500">Loading...</p>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Edit person</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">#{person.id}</div>
            </div>

            <ComponentCard title="">
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Last name
                            </label>
                            <Input
                                defaultValue={person.last_name ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, last_name: e.target.value} : p))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                First name
                            </label>
                            <Input
                                defaultValue={person.first_name}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, first_name: e.target.value} : p))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Middle name
                            </label>
                            <Input
                                defaultValue={person.middle_name ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, middle_name: e.target.value} : p))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Email
                            </label>
                            <Input
                                type="email"
                                defaultValue={person.email ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, email: e.target.value} : p))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Photo (url)
                            </label>
                            <Input
                                defaultValue={person.photo ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, photo: e.target.value} : p))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Birthday
                            </label>
                            <Input
                                type="date"
                                defaultValue={person.birthday ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, birthday: e.target.value} : p))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Sex (1=Male, 2=Female)
                            </label>
                            <Input
                                type="number"
                                defaultValue={person.sex ?? ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setPerson((p) => (p ? {...p, sex: v === "" ? null : Number(v)} : p));
                                }}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Description
                            </label>
                            <Input
                                defaultValue={person.description ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, description: e.target.value} : p))
                                }
                            />
                        </div>

                        {/* full_name показываем как read-only */}
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Full name (auto)
                            </label>
                            <Input defaultValue={person.full_name} disabled/>
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
