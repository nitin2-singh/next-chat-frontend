"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin } from "lucide-react";
import { useMe } from "@/hooks/auth";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function ProfilePage() {
  const { data: me, isLoading } = useMe();

  const form = useForm<ProfileForm>({
    values: {
      firstName: me?.firstName ?? "",
      lastName: me?.lastName ?? "",
      email: me?.email ?? "",
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header skeleton */}
          <div className="rounded-2xl border p-6">
            <div className="flex items-center gap-5">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="mt-2 flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left card */}
            <div className="rounded-2xl border p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Right card */}
            <div className="rounded-2xl border p-6 space-y-4 md:col-span-2">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-4xl"
      >
        {/* Header */}
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              {/* <Avatar className="h-20 w-20">
                <AvatarImage src="https://avatars.githubusercontent.com/u/1?v=4" />
                <AvatarFallback>
                  {me?.firstName?.[0]}
                  {me?.lastName?.[0]}
                </AvatarFallback>
              </Avatar> */}

              <div>
                <h1 className="text-2xl font-semibold">
                  {me?.firstName} {me?.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">Account profile</p>

                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">User</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Info */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>Account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{me?.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>India</span>
              </div>
            </CardContent>
          </Card>

          {/* Right Form (Read-only) */}
          <Card className="rounded-2xl md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>View-only information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First name</Label>
                  <Input disabled {...form.register("firstName")} />
                </div>

                <div className="space-y-2">
                  <Label>Last name</Label>
                  <Input disabled {...form.register("lastName")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input disabled {...form.register("email")} />
              </div>

              <Separator />

              <p className="text-sm text-muted-foreground">
                Profile updates are currently disabled.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
