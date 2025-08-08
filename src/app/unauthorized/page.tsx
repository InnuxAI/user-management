"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 'this page';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/dashboard');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-destructive/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access the {page} section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            This page is restricted to users with specific roles. Please contact your administrator if you believe this is an error.
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Redirecting automatically in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
