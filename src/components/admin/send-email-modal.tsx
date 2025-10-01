'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    _id: string;
    email: string;
    type?: string;
  } | null;
}

export function SendEmailModal({ open, onOpenChange, user }: SendEmailModalProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !subject.trim() || !body.trim()) {
      setError('Subject and message body are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          subject: subject.trim(),
          body: body.trim()
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Email sent successfully to ${user.email}`);
        onOpenChange(false);
        // Reset form
        setSubject('');
        setBody('');
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Send email error:', error);
      setError(error.message || 'An error occurred while sending email');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSubject('');
    setBody('');
    setError('');
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email to User
          </DialogTitle>
          <DialogDescription>
            Send an email message to {user.email}. The subject will automatically include the [ADMIN] prefix.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">To:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{user.type || 'User'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                [ADMIN]
              </span>
              <Input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isLoading}
                className="pl-20"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The [ADMIN] prefix will be automatically added to the subject line.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Enter your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isLoading}
              rows={6}
              className="resize-none"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
