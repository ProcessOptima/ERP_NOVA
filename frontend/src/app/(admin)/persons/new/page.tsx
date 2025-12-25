"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";

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

type PersonCreatePayload = {
    first_name: string;
    last_name?: string;
    middle_name?: string;
    email?: string;
    photo?: string;
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

export default function NewPersonPage() {
    const router = useRouter();

    const [saving, setSaving] = useState(false);
    const [showActualAddress, setShowActualAddress] = useState(false);

    const [person, setPerson] = useState<PersonCreatePayload>({
        first_name: "",
    });

    const [registrationAddress, setRegistrationAddress] =
        useState<AddressPayload>({});
    const [actualAddress, setActualAddress] = useState<AddressPayload>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!person.first_name.trim()) {
            alert("First name is required");
            return;
        }

        const payload: PersonCreatePayload = {...person};

        if (hasMeaningfulValues(registrationAddress)) {
            payload.registration_address = registrationAddress;
        }

        if (showActualAddress && hasMeaningfulValues(actualAddress)) {
            payload.actual_address = actualAddress;
        }

        setSaving(true);
        try {
            const res = await fetchWithAuth("/persons/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                console.error(await res.text());
                alert("Ошибка создания");
                return;
            }

            router.push("/persons");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Create person</h1>

            <ComponentCard title="">
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                        {/* PERSON */}
                        <div className="space-y-4">
                            <Input
                                placeholder="First name *"
                                onChange={(e) =>
                                    setPerson((p) => ({...p, first_name: e.target.value}))
                                }
                            />
                            <Input
                                placeholder="Last name"
                                onChange={(e) =>
                                    setPerson((p) => ({...p, last_name: e.target.value}))
                                }
                            />
                            <Input
                                placeholder="Middle name"
                                onChange={(e) =>
                                    setPerson((p) => ({...p, middle_name: e.target.value}))
                                }
                            />
                            <Input
                                placeholder="Email"
                                onChange={(e) =>
                                    setPerson((p) => ({...p, email: e.target.value}))
                                }
                            />
                            <DatePicker
                                id="birthday"
                                placeholder="Birthday"
                                onChange={(_, d) =>
                                    setPerson((p) => ({...p, birthday: d || null}))
                                }
                            />
                            <Select
                                options={sexOptions}
                                placeholder="Sex"
                                onChange={(v) =>
                                    setPerson((p) => ({...p, sex: v ? Number(v) : null}))
                                }
                            />
                            <Input
                                placeholder="Description"
                                onChange={(e) =>
                                    setPerson((p) => ({...p, description: e.target.value}))
                                }
                            />
                        </div>

                        {/* ADDRESS */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Registration address</h3>
                            <Input
                                placeholder="City"
                                onChange={(e) =>
                                    setRegistrationAddress((a) => ({
                                        ...a,
                                        city: e.target.value,
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
                                        placeholder="City"
                                        onChange={(e) =>
                                            setActualAddress((a) => ({
                                                ...a,
                                                city: e.target.value,
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
