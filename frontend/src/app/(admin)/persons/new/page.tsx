"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";

import {fetchWithAuth} from "@/app/api";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";

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

function hasMeaningfulValues<T extends Record<string, unknown>>(obj: T): boolean {
    return Object.values(obj).some((v) =>
        typeof v === "string" ? v.trim() !== "" : v != null
    );
}

export default function NewPersonPage() {
    const router = useRouter();

    const [saving, setSaving] = useState(false);
    const [showActualAddress, setShowActualAddress] = useState(false);

    const [person, setPerson] = useState<PersonCreatePayload>({
        first_name: "",
    });

    const [registrationAddress, setRegistrationAddress] = useState<AddressPayload>({});
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
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className="mb-6">
                <h1 className="text-title-md2 font-semibold text-black dark:text-white">
                    Create Person
                </h1>
            </div>

            {/* КЛЮЧЕВО: одна форма вокруг ВСЕГО, включая кнопку Save */}
            <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                    {/* Personal Information */}
                    <div className="flex flex-col gap-9">
                        <div
                            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Personal Information
                                </h3>
                            </div>

                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        First Name <span className="text-meta-1">*</span>
                                    </label>
                                    <Input
                                        placeholder="Enter first name"
                                        onChange={(e) =>
                                            setPerson((p) => ({...p, first_name: e.target.value}))
                                        }
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Last Name
                                    </label>
                                    <Input
                                        placeholder="Enter last name"
                                        onChange={(e) =>
                                            setPerson((p) => ({...p, last_name: e.target.value}))
                                        }
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Middle Name
                                    </label>
                                    <Input
                                        placeholder="Enter middle name"
                                        onChange={(e) =>
                                            setPerson((p) => ({...p, middle_name: e.target.value}))
                                        }
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="Enter email address"
                                        onChange={(e) =>
                                            setPerson((p) => ({...p, email: e.target.value}))
                                        }
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Photo URL
                                    </label>
                                    <Input
                                        placeholder="Enter photo URL"
                                        onChange={(e) =>
                                            setPerson((p) => ({...p, photo: e.target.value}))
                                        }
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Birthday
                                    </label>
                                    <DatePicker
                                        id="birthday"
                                        placeholder="Select date"
                                        onChange={(_, d) =>
                                            setPerson((p) => ({...p, birthday: d || null}))
                                        }
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Sex
                                    </label>
                                    <Select
                                        options={sexOptions}
                                        placeholder="Select sex"
                                        onChange={(v) =>
                                            setPerson((p) => ({...p, sex: v ? Number(v) : null}))
                                        }
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Description
                                    </label>
                                    <Input
                                        placeholder="Enter description"
                                        onChange={(e) =>
                                            setPerson((p) => ({...p, description: e.target.value}))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="flex flex-col gap-9">
                        <div
                            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Registration Address
                                </h3>
                            </div>

                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Address Line
                                    </label>
                                    <Input
                                        placeholder="Enter address line"
                                        onChange={(e) =>
                                            setRegistrationAddress((a) => ({
                                                ...a,
                                                address_line: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                {!showActualAddress && (
                                    <Button
                                        onClick={() => setShowActualAddress(true)}
                                        className="w-full"
                                    >
                                        + Add Actual Address
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Actual Address */}
                        {showActualAddress && (
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        Actual Address
                                    </h3>
                                </div>

                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Address Line
                                        </label>
                                        <Input
                                            placeholder="Enter address line"
                                            onChange={(e) =>
                                                setActualAddress((a) => ({
                                                    ...a,
                                                    address_line: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => setShowActualAddress(false)}
                                    >
                                        Remove Actual Address
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button (внутри Form, без onClick) */}
                <div className="mt-6">
                    <Button
                        className="w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Person"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
