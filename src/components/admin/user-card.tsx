'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface User {
  _id: string;
  email: string;
  type: string;
  role?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface UserCardProps {
  user: User;
  onUpdate: () => void;
}

const ROLE_OPTIONS = ['super', 'Finance', 'HR', 'Sales'];

export function UserCard({ user, onUpdate }: UserCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role || 'none');

  const updateUserStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, status }),
      });

      if (response.ok) {
        toast.success('User status updated successfully');
        onUpdate();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateUserType = async (type: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, type }),
      });

      if (response.ok) {
        toast.success('User type updated successfully');
        onUpdate();
      } else {
        toast.error('Failed to update user type');
      }
    } catch (error) {
      toast.error('Failed to update user type');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateUserRole = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, role: selectedRole === 'none' ? undefined : selectedRole }),
      });

      if (response.ok) {
        toast.success('User role updated successfully');
        onUpdate();
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{user.email}</CardTitle>
          <Badge 
            variant={
              user.status === 'accepted' ? 'default' : 
              user.status === 'pending' ? 'secondary' : 
              'destructive'
            }
          >
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <Select 
              value={user.type} 
              onValueChange={(value) => updateUserType(value)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium">
              {user.role ? (
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">No role</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Joined</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Status</Label>
            <Select 
              value={user.status} 
              onValueChange={(value) => updateUserStatus(value)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  Manage Role
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Assign Role to {user.email}</DrawerTitle>
                </DrawerHeader>
                <div className="space-y-4 p-4">
                  <div className="text-sm text-gray-600">
                    Select a role for this user:
                  </div>
                  <div className="space-y-3">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No role</SelectItem>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button onClick={updateUserRole} disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Update Role'}
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
