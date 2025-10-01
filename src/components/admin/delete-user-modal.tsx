'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    _id: string;
    email: string;
    type?: string;
  } | null;
  onUserDeleted: () => void;
}

export function DeleteUserModal({ open, onOpenChange, user, onUserDeleted }: DeleteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/users/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('User deleted successfully');
        onUserDeleted();
        onOpenChange(false);
      } else {
        throw new Error(result.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Delete user error:', error);
      setError(error.message || 'An error occurred while deleting user');
    }

    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete User
          </DialogTitle>
          <DialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the user account and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Are you sure you want to delete this user?</strong>
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{user.type || 'User'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">User ID:</span>
                <span className="text-xs font-mono">{user._id}</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
