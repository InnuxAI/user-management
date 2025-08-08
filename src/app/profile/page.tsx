"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface ProfileFormData {
  name: string
  email: string
  avatar: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function ProfilePageContent() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const form = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
      avatar: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/users/me")
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
        
        // Update form with current user data
        form.setValue("name", data.user.name || "")
        form.setValue("email", data.user.email || "")
        form.setValue("avatar", data.user.avatar || "")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  // Fetch user data when component mounts
  useEffect(() => {
    if (session) {
      fetchCurrentUser()
    }
  }, [session])

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsLoading(true)
    
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        toast.error("Name is required")
        setIsLoading(false)
        return
      }

      if (data.name.trim().length < 2) {
        toast.error("Name must be at least 2 characters long")
        setIsLoading(false)
        return
      }

      if (!data.email?.trim()) {
        toast.error("Email is required")
        setIsLoading(false)
        return
      }

      // Email validation
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      if (!emailRegex.test(data.email.trim())) {
        toast.error("Please enter a valid email address")
        setIsLoading(false)
        return
      }

      // Avatar validation (if provided)
      if (data.avatar?.trim()) {
        const avatarRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
        if (!avatarRegex.test(data.avatar.trim())) {
          toast.error("Please enter a valid image URL (jpg, jpeg, png, gif, webp)")
          setIsLoading(false)
          return
        }
      }

      const updateData = {
        name: data.name.trim(),
        email: data.email.trim(),
        avatar: data.avatar?.trim() || "",
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Failed to update profile")
        setIsLoading(false)
        return
      }

      // Update session with new data
      const updatedSession = {
        ...session,
        user: {
          ...session?.user,
          name: updateData.name,
          email: updateData.email,
        },
      }
      
      await update(updatedSession)

      // Refetch current user data to get the latest from database
      await fetchCurrentUser()

      toast.success("Profile updated successfully")
      
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitPassword = async (data: ProfileFormData) => {
    setIsLoading(true)
    
    try {
      // Validate password fields
      if (!data.currentPassword?.trim()) {
        toast.error("Current password is required")
        setIsLoading(false)
        return
      }
      
      if (!data.newPassword?.trim()) {
        toast.error("New password is required")
        setIsLoading(false)
        return
      }

      if (!data.confirmPassword?.trim()) {
        toast.error("Please confirm your new password")
        setIsLoading(false)
        return
      }
      
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match")
        setIsLoading(false)
        return
      }
      
      if (data.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long")
        setIsLoading(false)
        return
      }

      const updateData = {
        currentPassword: data.currentPassword.trim(),
        newPassword: data.newPassword.trim(),
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Failed to update password")
        setIsLoading(false)
        return
      }

      toast.success("Password updated successfully")
      
      // Clear password fields
      form.setValue("currentPassword", "")
      form.setValue("newPassword", "")
      form.setValue("confirmPassword", "")
      
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("Failed to update password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser?.avatar || session.user?.image || ""} alt={currentUser?.name || session.user?.name || ""} />
                    <AvatarFallback className="text-lg">
                      {(currentUser?.name || session.user?.name || "User")?.substring(0, 1)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-2xl">{currentUser?.name || session.user?.name || "User"}</CardTitle>
                      <Badge variant="secondary">{currentUser?.role || (session.user as any)?.role}</Badge>
                    </div>
                    <CardDescription className="text-base">{currentUser?.email || session.user?.email}</CardDescription>
                    <Badge 
                      variant={(currentUser?.status || (session.user as any)?.status) === 'accepted' ? 'default' : 'outline'}
                      className="capitalize"
                    >
                      {currentUser?.status || (session.user as any)?.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your personal information and change your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        <p className="text-sm text-muted-foreground">
                          Update your personal details here.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          rules={{
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters long"
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          rules={{
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="avatar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Avatar URL (Optional)</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input 
                                    type="url" 
                                    placeholder="https://example.com/avatar.jpg" 
                                    {...field} 
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => form.setValue("avatar", "")}
                                  >
                                    Clear
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground">
                                Enter a URL to an image to use as your avatar. Leave blank to remove avatar.
                              </p>
                              {field.value && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium mb-2">Preview:</p>
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={field.value} alt="Avatar preview" />
                                    <AvatarFallback>
                                      {form.getValues("name")?.substring(0, 1)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Profile Update Button */}
                      <div className="flex justify-end pt-4">
                        <Button 
                          type="button" 
                          disabled={isLoading}
                          onClick={() => onSubmitProfile(form.getValues())}
                        >
                          {isLoading ? "Updating..." : "Update Profile"}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Change Password */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Change your account password here.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Enter current password" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Enter new password" 
                                  {...field} 
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
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Confirm new password" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Password Update Button */}
                      <div className="flex justify-end pt-4">
                        <Button 
                          type="button" 
                          disabled={isLoading}
                          onClick={() => onSubmitPassword(form.getValues())}
                          variant="outline"
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfilePageContent />
    </DashboardLayout>
  )
}
