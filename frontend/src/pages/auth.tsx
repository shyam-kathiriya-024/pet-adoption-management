import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PawPrint } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { LoginFormData, RegisterFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { loginSchema, registerSchema } from "@/lib/validations";

export default function AuthPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();
  const location = useLocation();
  const defaultTab = location.pathname.includes("register") ? "register" : "login";
  const [activeTab, setActiveTab] = useState<typeof defaultTab>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_email: "",
      user_password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user_name: "",
      user_email: "",
      user_password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await login.mutateAsync(data);
      toast.success("Logged in successfully!");

      // Navigate based on user role
      if (result.user.user_role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch {
      // Error toast is handled by the hook
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register.mutateAsync(data);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch {
      // Error toast is handled by the hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-heading">Welcome to PawFriends</h1>
          <p className="text-muted-foreground mt-2">Join our community to find your perfect companion.</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to sign in to your account.</CardDescription>
              </CardHeader>
              <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" {...loginForm.register("user_email")} />
                    {loginForm.formState.errors.user_email && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.user_email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...loginForm.register("user_password")}
                    />
                    {loginForm.formState.errors.user_password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.user_password.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full mt-4" disabled={login.isPending}>
                    {login.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Enter your details to create a new account.</CardDescription>
              </CardHeader>
              <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" {...registerForm.register("user_name")} />
                    {registerForm.formState.errors.user_name && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.user_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="m@example.com"
                      {...registerForm.register("user_email")}
                    />
                    {registerForm.formState.errors.user_email && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.user_email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      {...registerForm.register("user_password")}
                    />
                    {registerForm.formState.errors.user_password && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.user_password.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full mt-4" disabled={register.isPending}>
                    {register.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
