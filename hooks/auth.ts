"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  loginSchema,
  LoginSchema,
  signupSchema,
  SignupSchema,
} from "@/lib/validation/auth";
import { axiosInstance } from "@/lib/axios-instance";
import { AuthResponse } from "@/types/auth";
import { setAuthCookie } from "@/lib/token";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/user";
import { User } from "@/types/user";

export function useLogin() {
  const { setUser } = useAuthStore.getState();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginSchema) => {
      // Validate input (defensive)
      const data = loginSchema.parse(payload);

      const res = await axiosInstance.post<AuthResponse>("/auth/login", data);

      // Validate response shape
      return res.data;
    },
    onSuccess: (data) => {
      setAuthCookie(data.token);
      setUser(data.user);
      router.push("/chat");
    },
  });
}

export function useMe() {
  const { setUser } = useAuthStore();
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<User> => {
      const { data } = await axiosInstance.get<AuthResponse>("/auth/me");
      setUser(data.user);
      return data.user;
    },
    retry: false, // don’t retry on 401
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });
}

export function useSignup() {
  const { setUser } = useAuthStore.getState();
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: SignupSchema) => {
      const data = signupSchema.parse(payload);
      const res = await axiosInstance.post<AuthResponse>("/auth/signup", data);
      return res.data;
    },

    onSuccess: (data) => {
      setAuthCookie(data.token);
      setUser(data.user);
      router.push("/chat");
    },
  });
}
