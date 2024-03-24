import { registerSchema } from "@/components/Form/RegisterCard";
import { createContext, useEffect, useState } from "react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";
import { loginSchema } from "@/components/Form/LoginCard";
import { Socket, io } from "socket.io-client";
import { messengerSchema } from "@/components/Messenger/Messenger";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

type Props = {
  children: React.ReactNode;
};

type Auth = {
  accessToken: string;
};

type Replies = {
  message: string;
  userName: string;
};

type Context = {
  auth: Auth;
  registerUser: (
    values: z.infer<typeof registerSchema>,
    form: UseFormReturn<{
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }>
  ) => void;
  loginUser: (
    values: z.infer<typeof loginSchema>,
    form: UseFormReturn<{
      email: string;
      password: string;
    }>
  ) => void;
  sendMessage: (
    values: z.infer<typeof messengerSchema>,
    form: UseFormReturn<{
      messages: string;
    }>
  ) => void;
  replies: Replies[];
};

export const AppContext = createContext<Context | null>(null);

const axiosConfig = {
  baseURL: "http://localhost:3000",
  withCredentials: true,
};

Object.assign(axios.defaults, axiosConfig);

const AppProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<Auth>({ accessToken: "" });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [replies, setReplies] = useState<Replies[]>([]);

  const registerUser = async (
    values: z.infer<typeof registerSchema>,
    form: UseFormReturn<{
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }>
  ) => {
    try {
      const response = await axios.post("/user/register", { ...values });

      if (response.status >= 200 && response.status < 300) {
        toast({ title: response.data.message });
        form.reset();
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError)
        toast({ title: error?.response?.data.message });
    }
  };

  const loginUser = async (
    values: z.infer<typeof loginSchema>,
    form: UseFormReturn<{
      email: string;
      password: string;
    }>
  ) => {
    try {
      const response = await axios.post("/user/login", { ...values });

      if (response.status >= 200 && response.status < 300) {
        setAuth((prev) => ({
          ...prev,
          accessToken: response.data.accessToken,
        }));
        toast({ title: response.data.message });
        form.reset();
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError)
        toast({ title: error?.response?.data.message });
    }
  };

  const requestRefresh = async () => {
    try {
      const response = await axios.get("/user/refresh");

      if (response.status >= 200 && response.status < 300) {
        setAuth((prev) => ({
          ...prev,
          accessToken: response.data.accessToken,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = (
    values: z.infer<typeof messengerSchema>,
    form: UseFormReturn<{
      messages: string;
    }>
  ) => {
    socket?.emit("sendMessage", values.messages);
    form.reset();
  };

  useEffect(() => {
    const initialized = async () => {
      try {
        if (auth.accessToken.length <= 0 || !auth.accessToken) {
          await requestRefresh();
        }
      } catch (error) {
        console.error(error);
      }
    };

    initialized();
  }, []);

  useEffect(() => {
    if (auth.accessToken.length > 0 || auth.accessToken) {
      const socket = io("http://localhost:3000", {
        extraHeaders: { authorization: `Bearer ${auth?.accessToken}` },
      });

      setSocket(socket);
    } else {
      socket?.disconnect();
      setSocket(null);
    }

    socket?.on("sendMessage", (data: Replies) => {
      setReplies((prev) => [...prev, data]);
    });
  }, [auth]);

  // useEffect(() => {
  //   socket?.on("sendMessage", (data: Replies) => {
  //     setReplies((prev) => [...prev, data]);
  //   });
  // }, [socket, setReplies]);

  useEffect(() => {}, []);

  return (
    <AppContext.Provider
      value={{ auth, registerUser, loginUser, sendMessage, replies }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
