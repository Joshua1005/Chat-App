import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import useApp from "@/hooks/useApp";

export const messengerSchema = z.object({
  messages: z.string(),
});

const Messenger = () => {
  const { sendMessage, replies } = useApp();
  const form = useForm({
    resolver: zodResolver(messengerSchema),
    defaultValues: {
      messages: "",
    },
  });

  const messagesInstances = replies?.map((reply, index) => (
    <section key={index} className="flex gap-5">
      <Avatar>
        <AvatarFallback>{reply.userName}</AvatarFallback>
      </Avatar>
      <p className="text-sm text-muted-foreground my-auto">{reply.message}</p>
    </section>
  ));

  return (
    <Card className="max-w-96 mx-auto">
      <CardHeader>
        <CardTitle>Messenger</CardTitle>
        <CardDescription>
          This is my second attempt making chat app.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-5")}>
        <ScrollArea className={cn("h-40")}>{messagesInstances}</ScrollArea>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => sendMessage(values, form))}
            className="grid gap-2"
          >
            <FormField
              control={form.control}
              name="messages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write your messages here!"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Send</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Messenger;
