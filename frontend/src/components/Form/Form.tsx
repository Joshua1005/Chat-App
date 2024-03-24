import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";
import useApp from "@/hooks/useApp";
import { useEffect } from "react";

const Form = () => {
  const navigate = useNavigate();
  const { auth } = useApp();

  useEffect(() => {
    if (auth.accessToken.length > 0 || auth.accessToken) navigate("/");
  }, [auth]);

  return (
    <Tabs defaultValue="login">
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <RegisterCard />
      </TabsContent>
      <TabsContent value="login">
        <LoginCard />
      </TabsContent>
    </Tabs>
  );
};

export default Form;
