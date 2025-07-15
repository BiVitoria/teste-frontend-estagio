"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, sendPasswordResetEmail } from "@/lib/auth";
import { Input, SubmitButton, Loader, ThemeToggle } from "@/components";
import { X, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shake, setShake] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (isAuthenticated()) {
      push("/dashboard");
    }
  }, [push]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShake(false);

    if (!isValidEmail(email)) {
      setError("Formato de email inválido");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    try {
      const sent = await sendPasswordResetEmail(email);
      if (sent) {
        setSuccess("Enviamos um link de redefinição para seu email.");
      } else {
        setError("Email não encontrado. Verifique e tente novamente.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      setError("Erro ao enviar email. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col w-[450px] p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-center font-bold text-[28px] md:text-[32px] hover:scale-[1.03] transition-all duration-500 cursor-default text-gray-900 dark:text-white">
          Esqueceu a senha na{" "}
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
            htmlFor="email-input"
          >
            Email
          </label>
          <Input
            id="email-input"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setSuccess("");
            }}
            state={error ? "error" : "default"}
            disabled={isLoading}
            className={shake ? "animate-shake" : ""}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <X size={16} className="text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}
          <SubmitButton
            title="Enviar link de redefinição"
            className="mt-8"
            disabled={isLoading}
          />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => push("/login")}
              className="text-primary-purple hover:text-secondary-purple font-medium transition-colors"
            >
              Voltar para login
            </button>
          </div>
          {isLoading && (
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
              <Loader />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
