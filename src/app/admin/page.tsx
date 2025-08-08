'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserDataTable } from '@/components/admin/user-data-table';
import { toast } from 'sonner';

interface User {
  _id: string;
  email: string;
  type: string;
  role?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any).type !== 'Admin') {
      redirect('/dashboard');
    }
    
    fetchUsers();
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        console.log('Fetched users:', data.users);
      } else {
        console.error('Failed to fetch users:', data);
        toast.error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: { status?: string; role?: string; type?: string }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...updates }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the user list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600">Manage user registrations and permissions</p>
        
        {/* Debug info */}
        <div className="mt-4 p-4 rounded text-sm">
          <p><strong>Session:</strong> {session?.user?.email} ({(session?.user as any)?.type})</p>
          <p><strong>Users Found:</strong> {users.length}</p>
        </div>
      </div>

      <UserDataTable data={users} onUpdateUser={handleUpdateUser} />

      {users.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No users found</p>
          <button 
            onClick={fetchUsers} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Fetch
          </button>
        </div>
      )}
    </div>
  );
}
