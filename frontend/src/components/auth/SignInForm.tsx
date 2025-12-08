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

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    // НИКАКИХ any и лишних аргументов
    const handleSubmit = async () => {
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
            {/* Верхняя ссылка "Back to dashboard", чтобы ChevronLeftIcon и Link были использованы */}
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon/>
                    Back to dashboard
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md dark:text-white/90">
                        Sign In
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your email and password to sign in!
                    </p>
                </div>

                <div>
                    {/* form нужен только чтобы не было сабмита по умолчанию */}
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
                                // ВАЖНО: у InputField НЕТ prop `value`, только `defaultValue` и `onChange`.
                                // Чтобы не менять компонент, используем только onChange.
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
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                >
                  {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                  ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                  )}
                </span>
                            </div>
                        </div>

                        {/* REMEMBER ME */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox checked={isChecked} onChange={setIsChecked}/>
                                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
                            </div>

                            <Link
                                href="/reset-password"
                                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div>
                            <Button className="w-full" size="sm" onClick={handleSubmit}>
                                Sign in
                            </Button>
                        </div>
                    </form>

                    {/* REGISTER LINK */}
                    <div className="mt-5">
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                            {"Don't have an account?"}{" "}
                            <Link
                                href="/signup"
                                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
