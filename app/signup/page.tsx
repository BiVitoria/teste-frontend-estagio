"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X, CheckCircle } from "lucide-react";

import { checkUserExists, registerUser, isAuthenticated } from "@/lib/auth";
import { Input, SubmitButton, Loader, ThemeToggle } from "@/components";

interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup = () => {
  const { push } = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [shakeFields, setShakeFields] = useState<{
    username: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [signupData, setSignupData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  useEffect(() => {
    if (isAuthenticated()) {
      push("/dashboard");
    }
  }, [push]);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 10) score++;
    if (score <= 1) return { label: "Fraca", color: "bg-red-400", percent: 25 };
    if (score === 2)
      return { label: "Média", color: "bg-yellow-400", percent: 50 };
    if (score === 3 || score === 4)
      return { label: "Forte", color: "bg-green-500", percent: 75 };
    if (score >= 5)
      return { label: "Muito forte", color: "bg-green-700", percent: 100 };
    return { label: "", color: "bg-gray-200", percent: 0 };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShakeFields({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [shakeFields]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let hasErrors = false;

    if (!signupData.username.trim()) {
      errors.username = "Nome de usuário é obrigatório";
      setShakeFields((prev) => ({ ...prev, username: true }));
      hasErrors = true;
    } else if (signupData.username.length < 3) {
      errors.username = "Nome de usuário deve ter pelo menos 3 caracteres";
      setShakeFields((prev) => ({ ...prev, username: true }));
      hasErrors = true;
    }

    if (!signupData.email.trim()) {
      errors.email = "Email é obrigatório";
      setShakeFields((prev) => ({ ...prev, email: true }));
      hasErrors = true;
    } else if (!isValidEmail(signupData.email)) {
      errors.email = "Formato de email inválido";
      setShakeFields((prev) => ({ ...prev, email: true }));
      hasErrors = true;
    }

    if (!signupData.password) {
      errors.password = "Senha é obrigatória";
      setShakeFields((prev) => ({ ...prev, password: true }));
      hasErrors = true;
    } else if (!isValidPassword(signupData.password)) {
      errors.password = "Senha deve ter pelo menos 6 caracteres";
      setShakeFields((prev) => ({ ...prev, password: true }));
      hasErrors = true;
    }

    if (!signupData.confirmPassword) {
      errors.confirmPassword = "Confirmação de senha é obrigatória";
      setShakeFields((prev) => ({ ...prev, confirmPassword: true }));
      hasErrors = true;
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
      setShakeFields((prev) => ({ ...prev, confirmPassword: true }));
      hasErrors = true;
    }

    setValidationErrors(errors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setValidationErrors({});

    setShakeFields({
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
    });

    if (!validateForm()) {
      setIsSubmitLoading(false);
      return;
    }

    try {
      const { usernameExists, emailExists } = await checkUserExists(
        signupData.username,
        signupData.email
      );

      if (usernameExists) {
        setErrorMessage("Nome de usuário já existe. Escolha outro nome.");
        setShakeFields((prev) => ({ ...prev, username: true }));
        setIsSubmitLoading(false);
        return;
      }

      if (emailExists) {
        setErrorMessage("Email já está em uso. Use outro email.");
        setShakeFields((prev) => ({ ...prev, email: true }));
        setIsSubmitLoading(false);
        return;
      }

      const success = await registerUser(
        signupData.username,
        signupData.password,
        signupData.email
      );

      if (success) {
        setSuccessMessage("Cadastro realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          push("/login");
        }, 2000);
      } else {
        setErrorMessage("Erro ao realizar cadastro. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErrorMessage(
        "Aconteceu um erro ao realizar o cadastro. Tente novamente."
      );
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <Suspense fallback="Carregando...">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-col w-[450px] p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h1 className="text-center font-bold text-[28px] md:text-[32px] hover:scale-[1.03] transition-all duration-500 cursor-default text-gray-900 dark:text-white">
            Criar conta na{" "}
            <span className="gradient-text from-secondary-purple to-primary-purple">
              Capivara AI
            </span>
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col mt-8 relative"
          >
            <label
              className="block text-base font-medium mt-8 mb-2 text-gray-900 dark:text-white"
              htmlFor="username-input"
            >
              Nome de usuário
            </label>
            <Input
              id="username-input"
              type="text"
              placeholder="Digite seu nome de usuário"
              value={signupData.username}
              onChange={(event) =>
                handleInputChange("username", event.target.value)
              }
              state={validationErrors.username ? "error" : "default"}
              disabled={isSubmitLoading}
              className={`${shakeFields.username && "animate-shake"}`}
            />
            {validationErrors.username && (
              <span className="text-red-500 text-sm mt-1">
                {validationErrors.username}
              </span>
            )}

            <label
              className="block text-base font-medium mt-6 mb-2 text-gray-900 dark:text-white"
              htmlFor="email-input"
            >
              Email
            </label>
            <Input
              id="email-input"
              type="email"
              placeholder="Digite seu email"
              value={signupData.email}
              onChange={(event) =>
                handleInputChange("email", event.target.value)
              }
              state={validationErrors.email ? "error" : "default"}
              disabled={isSubmitLoading}
              className={`${shakeFields.email && "animate-shake"}`}
            />
            {validationErrors.email && (
              <span className="text-red-500 text-sm mt-1">
                {validationErrors.email}
              </span>
            )}

            <label
              className="block text-base font-medium mt-6 mb-2 text-gray-900 dark:text-white"
              htmlFor="password-input"
            >
              Senha
            </label>
            <Input
              id="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={signupData.password}
              onChange={(event) =>
                handleInputChange("password", event.target.value)
              }
              state={validationErrors.password ? "error" : "default"}
              disabled={isSubmitLoading}
              className={`${shakeFields.password && "animate-shake"}`}
              icon={
                showPassword ? (
                  <EyeOff size={20} className="text-primary-purple" />
                ) : (
                  <Eye size={20} className="text-primary-purple" />
                )
              }
              onClickIcon={() => setShowPassword((prev) => !prev)}
            />
            {signupData.password && (
              <div className="mt-2 flex items-center gap-3">
                <div className="w-32 h-2 rounded bg-gray-200 overflow-hidden">
                  <div
                    className={`h-2 rounded ${
                      getPasswordStrength(signupData.password).color
                    }`}
                    style={{
                      width: `${
                        getPasswordStrength(signupData.password).percent
                      }%`,
                    }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-semibold ${getPasswordStrength(
                    signupData.password
                  ).color.replace("bg-", "text-")}`}
                >
                  {getPasswordStrength(signupData.password).label}
                </span>
              </div>
            )}
            {validationErrors.password && (
              <span className="text-red-500 text-sm mt-1">
                {validationErrors.password}
              </span>
            )}

            <label
              className="block text-base font-medium mt-6 mb-2 text-gray-900 dark:text-white"
              htmlFor="confirm-password-input"
            >
              Confirmar senha
            </label>
            <Input
              id="confirm-password-input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={signupData.confirmPassword}
              onChange={(event) =>
                handleInputChange("confirmPassword", event.target.value)
              }
              state={validationErrors.confirmPassword ? "error" : "default"}
              disabled={isSubmitLoading}
              className={`${shakeFields.confirmPassword && "animate-shake"}`}
              icon={
                showConfirmPassword ? (
                  <EyeOff size={20} className="text-primary-purple" />
                ) : (
                  <Eye size={20} className="text-primary-purple" />
                )
              }
              onClickIcon={() => setShowConfirmPassword((prev) => !prev)}
            />
            {validationErrors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1">
                {validationErrors.confirmPassword}
              </span>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <X size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                <span className="text-green-700 text-sm">{successMessage}</span>
              </div>
            )}

            <SubmitButton
              title="Cadastrar"
              className="mt-8"
              disabled={isSubmitLoading}
            />

            <div className="mt-6 text-center">
              <span className="text-gray-600">Já tem uma conta? </span>
              <button
                type="button"
                onClick={() => push("/login")}
                className="text-primary-purple hover:text-secondary-purple font-medium transition-colors"
              >
                Faça login
              </button>
            </div>

            {isSubmitLoading && (
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
                <Loader />
              </div>
            )}
          </form>
        </div>
      </div>
    </Suspense>
  );
};

export default Signup;
