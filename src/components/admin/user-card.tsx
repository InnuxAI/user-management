'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface User {
  _id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected';
  menuPermissions: string[];
  createdAt: string;
}

interface UserCardProps {
  user: User;
  onUpdate: () => void;
}

const MENU_OPTIONS = [
  'dashboard',
  'analytics',
  'reports',
  'settings',
  'users',
  'billing'
];

export function UserCard({ user, onUpdate }: UserCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(user.menuPermissions);

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

  const updateMenuPermissions = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, menuPermissions: selectedPermissions }),
      });

      if (response.ok) {
        toast.success('Menu permissions updated successfully');
        onUpdate();
      } else {
        toast.error('Failed to update menu permissions');
      }
    } catch (error) {
      toast.error('Failed to update menu permissions');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permission]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium">{user.role}</p>
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
                  Manage Permissions
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Menu Permissions for {user.email}</DrawerTitle>
                </DrawerHeader>
                <div className="space-y-4 p-4">
                  <div className="text-sm text-gray-600">
                    Select which menu items this user can access:
                  </div>
                  <div className="space-y-3">
                    {MENU_OPTIONS.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={selectedPermissions.includes(permission)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={permission}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button onClick={updateMenuPermissions} disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Update Permissions'}
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        {user.menuPermissions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Current Permissions:</p>
            <div className="flex flex-wrap gap-1">
              {user.menuPermissions.map((permission) => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
