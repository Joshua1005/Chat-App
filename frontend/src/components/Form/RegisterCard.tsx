import useApp from "@/hooks/useApp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(8, { message: "Name is required to have atleast 8 characters." }),
    email: z
      .string()
      .min(1, { message: "Email must have atleast 1 characters" })
      .email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must have atleast 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Confirm password must matched the first password.",
    path: ["confirmPassword"],
  });

const RegisterCard = () => {
  const { auth, registerUser } = useApp();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid grid-cols-2 gap-2"
            onSubmit={form.handleSubmit((values) => registerUser(values, form))}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={cn("col-span-2")}>
                  <FormLabel>Username:</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={cn("col-span-2")}>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="foo@bar.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Confirm your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className={cn("col-span-2")} type="submit">
              Create an account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterCard;
