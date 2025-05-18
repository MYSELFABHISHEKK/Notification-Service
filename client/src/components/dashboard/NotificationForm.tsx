import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { sendNotification } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NotificationFormProps {
  onSuccess?: () => void;
}

const formSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.enum(["email", "sms", "in-app"], {
    errorMap: () => ({ message: "Notification type is required" }),
  }),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  priority: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function NotificationForm({ onSuccess }: NotificationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      type: "email",
      title: "",
      message: "",
      priority: false,
    },
  });

  const mutation = useMutation({
    mutationFn: sendNotification,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent successfully",
        variant: "default",
      });
      reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send notification",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <Card className="shadow border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-neutral-500">Send Notification</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="userId" className="text-neutral-400 text-sm font-medium mb-2">
              Recipient User ID
            </Label>
            <Input
              id="userId"
              placeholder="e.g. user123"
              {...register("userId")}
              className={errors.userId ? "border-red-300 focus:ring-red-500" : ""}
            />
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <Label className="text-neutral-400 text-sm font-medium mb-2 block">
              Notification Type
            </Label>
            <RadioGroup defaultValue="email" {...register("type")}>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="text-neutral-500">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms" />
                  <Label htmlFor="sms" className="text-neutral-500">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-app" id="in-app" />
                  <Label htmlFor="in-app" className="text-neutral-500">In-App</Label>
                </div>
              </div>
            </RadioGroup>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <Label htmlFor="title" className="text-neutral-400 text-sm font-medium mb-2">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Notification Title"
              {...register("title")}
              className={errors.title ? "border-red-300 focus:ring-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <Label htmlFor="message" className="text-neutral-400 text-sm font-medium mb-2">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Enter your notification message here..."
              rows={4}
              {...register("message")}
              className={errors.message ? "border-red-300 focus:ring-red-500" : ""}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="priority" {...register("priority")} />
              <Label htmlFor="priority" className="text-neutral-500">
                Priority Notification
              </Label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-secondary text-white font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Sending</span>
                  <i className="fas fa-spinner fa-spin"></i>
                </>
              ) : (
                "Send Notification"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
