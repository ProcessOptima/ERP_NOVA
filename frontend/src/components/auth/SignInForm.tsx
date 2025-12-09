"use client";

import React, {useState} from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {ChevronLeftIcon, EyeCloseIcon, EyeIcon} from "@/icons";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";

export default function SignInForm() {
    const router = useRouter();
    const {login} = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit() {
        setErrorMessage("");

        const ok = await login(email, password);

        if (!ok) {
            setErrorMessage("Invalid email or password");
            return;
        }

        router.push("/dashboard");
    }

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link href="/"
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    <ChevronLeftIcon/>
                    Back to dashboard
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <h1 className="mb-2 font-semibold text-title-sm">Sign In</h1>

                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                <Label>Email *</Label>
                <Input placeholder="info@gmail.com" onChange={(e) => setEmail(e.target.value)}/>

                <Label>Password *</Label>
                <div className="relative mb-6">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword((v) => !v)}
                    >
            {showPassword ? <EyeIcon/> : <EyeCloseIcon/>}
          </span>
                </div>

                <Button size="sm" className="w-full" onClick={handleSubmit}>
                    Sign in
                </Button>
            </div>
        </div>
    );
}
