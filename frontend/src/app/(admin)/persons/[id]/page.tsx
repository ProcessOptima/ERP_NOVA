"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";

import {fetchWithAuth} from "@/app/api";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";

/* =======================
   TYPES
======================= */

type AddressPayload = {
    city?: string;
    address_line?: string;
    address_line_extra?: string;
    state?: string;
    zipcode?: string;
    area?: string;
};

type PersonDetail = {
    id: number;
    first_name: string;
    last_name: string | null;
    middle_name: string | null;
    full_name: string;
    email: string | null;
    photo: string | null;
    sex: number | null;
    birthday: string | null;
    description: string | null;
    registration_address?: AddressPayload | null;
    actual_address?: AddressPayload | null;
};

type PersonUpdatePayload = {
    first_name?: string;
    last_name?: string | null;
    middle_name?: string | null;
    email?: string | null;
    photo?: string | null;
    sex?: number | null;
    birthday?: string | null;
    description?: string | null;
    registration_address?: AddressPayload;
    actual_address?: AddressPayload;
};

const sexOptions = [
    {value: "1", label: "Male"},
    {value: "2", label: "Female"},
];

/* =======================
   UTILS
======================= */

function hasMeaningfulValues<T extends Record<string, unknown>>(obj: T): boolean {
    return Object.values(obj).some(
        (v) => (typeof v === "string" ? v.trim() !== "" : v != null)
    );
}

/* =======================
   PAGE
======================= */

export default function EditPersonPage() {
    const router = useRouter();
    const {id} = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [person, setPerson] = useState<PersonDetail | null>(null);
    const [registrationAddress, setRegistrationAddress] =
        useState<AddressPayload>({});
    const [actualAddress, setActualAddress] = useState<AddressPayload>({});
    const [showActualAddress, setShowActualAddress] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchWithAuth(`/persons/${id}/`);
                if (!res.ok) return;

                const data: PersonDetail = await res.json();
                setPerson(data);

                if (data.registration_address) {
                    setRegistrationAddress(data.registration_address);
                }
                if (data.actual_address) {
                    setActualAddress(data.actual_address);
                    setShowActualAddress(true);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!person) return;

        if (!person.first_name.trim()) {
            alert("First name is required");
            return;
        }

        const payload: PersonUpdatePayload = {
            first_name: person.first_name,
            last_name: person.last_name,
            middle_name: person.middle_name,
            email: person.email,
            photo: person.photo,
            sex: person.sex,
            birthday: person.birthday,
            description: person.description,
        };

        if (hasMeaningfulValues(registrationAddress)) {
            payload.registration_address = registrationAddress;
        }

        if (showActualAddress && hasMeaningfulValues(actualAddress)) {
            payload.actual_address = actualAddress;
        }

        setSaving(true);
        try {
            const res = await fetchWithAuth(`/persons/${person.id}/`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                console.error(await res.text());
                alert("Ошибка сохранения");
                return;
            }

            router.push("/persons");
        } finally {
            setSaving(false);
        }
    }

    if (loading || !person) {
        return <p className="text-gray-500">Loading...</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">
                Edit person <span className="text-gray-400">#{person.id}</span>
            </h1>

            <ComponentCard title="">
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                        {/* PERSON */}
                        <div className="space-y-4">
                            <Input
                                placeholder="First name *"
                                defaultValue={person.first_name}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, first_name: e.target.value} : p))
                                }
                            />
                            <Input
                                placeholder="Last name"
                                defaultValue={person.last_name ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, last_name: e.target.value} : p))
                                }
                            />
                            <Input
                                placeholder="Middle name"
                                defaultValue={person.middle_name ?? ""}
                                onChange={(e) =>
                                    setPerson((p) =>
                                        p ? {...p, middle_name: e.target.value} : p
                                    )
                                }
                            />
                            <Input
                                placeholder="Email"
                                defaultValue={person.email ?? ""}
                                onChange={(e) =>
                                    setPerson((p) => (p ? {...p, email: e.target.value} : p))
                                }
                            />
                            <DatePicker
                                id="birthday"
                                placeholder="Birthday"
                                defaultDate={person.birthday ?? undefined}
                                onChange={(_, d) =>
                                    setPerson((p) => (p ? {...p, birthday: d || null} : p))
                                }
                            />
                            <Select
                                options={sexOptions}
                                placeholder="Sex"
                                defaultValue={person.sex ? String(person.sex) : ""}
                                onChange={(v) =>
                                    setPerson((p) =>
                                        p ? {...p, sex: v ? Number(v) : null} : p
                                    )
                                }
                            />
                            <Input
                                placeholder="Description"
                                defaultValue={person.description ?? ""}
                                onChange={(e) =>
                                    setPerson((p) =>
                                        p ? {...p, description: e.target.value} : p
                                    )
                                }
                            />
                            <Input disabled defaultValue={person.full_name}/>
                        </div>

                        {/* ADDRESS */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Registration address</h3>
                            <Input
                                placeholder="Address line"
                                defaultValue={registrationAddress.address_line ?? ""}
                                onChange={(e) =>
                                    setRegistrationAddress((a) => ({
                                        ...a,
                                        address_line: e.target.value,
                                    }))
                                }
                            />

                            {!showActualAddress && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowActualAddress(true)}
                                >
                                    + Add actual address
                                </Button>
                            )}

                            {showActualAddress && (
                                <>
                                    <h3 className="font-medium">Actual address</h3>
                                    <Input
                                        placeholder="Address_line"
                                        defaultValue={actualAddress.address_line ?? ""}
                                        onChange={(e) =>
                                            setActualAddress((a) => ({
                                                ...a,
                                                address_line: e.target.value,
                                            }))
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button className="w-full" disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </Form>
            </ComponentCard>
        </div>
    );
}
