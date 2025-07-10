// Credentials data
const credentials = {
  users: [
    {
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
    },
    {
      username: "user",
      password: "user123",
      email: "user@example.com",
    },
    {
      username: "teste",
      password: "teste123",
      email: "teste@example.com",
    },
  ],
};

export interface User {
  username: string;
  password: string;
  email: string;
}

export const authenticateUser = async (
  username: string,
  password: string
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = credentials.users.find(
    (u) => u.username === username && u.password === password
  );

  return !!user;
};

export const checkUserExists = async (
  username: string,
  email: string
): Promise<{ usernameExists: boolean; emailExists: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const existingUsername = credentials.users.find(
    (u) => u.username === username
  );
  const existingEmail = credentials.users.find((u) => u.email === email);

  return {
    usernameExists: !!existingUsername,
    emailExists: !!existingEmail,
  };
};

export const registerUser = async (
  username: string,
  password: string,
  email: string
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = credentials.users.find((u) => u.username === username);
  if (existingUser) {
    return false;
  }

  credentials.users.push({
    username,
    password,
    email,
  });

  return true;
};

export const sendPasswordResetEmail = async (
  email: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const user = credentials.users.find((u) => u.email === email);
  return !!user;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth_token");
};

export const login = (token: string, username: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
  localStorage.setItem("current_user", username);
};

export const logout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("current_user");
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("auth_token");
  const username = localStorage.getItem("current_user");

  if (!token || !username) return null;

  const user = credentials.users.find((u) => u.username === username);
  return user || null;
};
