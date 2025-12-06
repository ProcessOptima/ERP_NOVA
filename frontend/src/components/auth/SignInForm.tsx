"use client";

import React, {useState} from "react";
import Checkbox from "@/components/form/input/Checkbox";
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

    // form state
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    // --------------------------
    // LOGIN HANDLER (без any, без параметров)
    // --------------------------
    const handleSubmit = async (): Promise<void> => {
        setErrorMessage("");

        const ok = await login(email, password);

        if (!ok) {
            setErrorMessage("Invalid credentials");
            return;
        }

        router.push("/dashboard");
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                    <ChevronLeftIcon/>
                    Back to dashboard
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
                        Sign In
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter your email and password to sign in!
                    </p>
                </div>

                <div>
                    {/* форму оставляем только для верстки, submit гасим */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        {/* ERROR MESSAGE */}
                        {errorMessage && (
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        )}

                        {/* EMAIL */}
                        <div>
                            <Label>
                                Email <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="info@gmail.com"
                                defaultValue={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <Label>
                                Password <span className="text-error-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    defaultValue={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                >
                  {showPassword ? (
                      <EyeIcon className="fill-gray-500"/>
                  ) : (
                      <EyeCloseIcon className="fill-gray-500"/>
                  )}
                </span>
                            </div>
                        </div>

                        {/* REMEMBER ME */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox checked={isChecked} onChange={setIsChecked}/>
                                <span className="block text-gray-700">Keep me logged in</span>
                            </div>

                            <Link href="/reset-password" className="text-sm text-brand-500">
                                Forgot password?
                            </Link>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div>
                            <Button
                                className="w-full"
                                size="sm"
                                onClick={handleSubmit} // теперь сигнатура () => Promise<void>, TS доволен
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>

                    {/* REGISTER LINK */}
                    <div className="mt-5">
                        <p className="text-sm text-center text-gray-700">
                            {"Don't have an account?"}
                            <Link href="/signup" className="text-brand-500">
                                {" "}
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
