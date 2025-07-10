"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Mail, User as UserIcon } from "lucide-react";

import { isAuthenticated, logout, getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components";

interface UserData {
  username: string;
  email: string;
}

const Dashboard = () => {
  const { push } = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      push("/");
    } else {
      const user = getCurrentUser();
      if (user) {
        setUserData({
          username: user.username,
          email: user.email,
        });
      }
    }
  }, [push]);

  const handleLogout = () => {
    logout();
    push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="gradient-text from-secondary-purple to-primary-purple">
                  Capivara AI
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <User size={20} />
                <span>{userData?.username || "Usuário Logado"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-purple transition-colors"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Bem-vindo ao Dashboard!
            </h2>

            {userData && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserIcon size={20} className="mr-2 text-primary-purple" />
                  Perfil do Usuário
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Nome de usuário:
                      </span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userData.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Email:
                      </span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Você está logado com sucesso. Esta é uma página de exemplo do
              dashboard.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
