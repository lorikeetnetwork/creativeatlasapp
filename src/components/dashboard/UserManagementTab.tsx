import { useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useCollaboratorRole } from '@/hooks/useCollaboratorRole';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Shield, ShieldOff, Loader2, UserPlus, UserMinus, Crown, Copy, Check, Mail, Link2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function UserManagementTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFullName, setInviteFullName] = useState('');
  const [inviteRole, setInviteRole] = useState('collaborator');
  const [inviteMethod, setInviteMethod] = useState<'email' | 'magicLink'>('email');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  
  const { users, isLoading, grantCollaboratorRole, revokeCollaboratorRole, inviteUser } = useUserManagement();
  const { isMaster, loading: roleLoading } = useCollaboratorRole();

  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteFullName || !inviteRole) return;
    
    try {
      const result = await inviteUser.mutateAsync({
        email: inviteEmail,
        fullName: inviteFullName,
        role: inviteRole,
        inviteMethod,
      });
      
      if (result.inviteMethod === 'email' && result.password) {
        setGeneratedPassword(result.password);
      } else {
        setInviteSuccess(true);
      }
    } catch {
      // Error handled by mutation
    }
  };

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(generatedPassword);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
    setInviteEmail('');
    setInviteFullName('');
    setInviteRole('collaborator');
    setInviteMethod('email');
    setGeneratedPassword('');
    setInviteSuccess(false);
    setPasswordCopied(false);
  };

  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Only master account can access this tab
  if (!isMaster) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">Only the master account can manage users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredUsers?.filter(u => u.isCollaborator).length || 0} collaborators
        </div>
        
        {/* Invite User Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={(open) => !open && handleCloseInviteDialog()}>
          <DialogTrigger asChild>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Create a new user account with a generated password.
              </DialogDescription>
            </DialogHeader>
            
            {generatedPassword ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-medium">User created successfully!</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    A welcome email with login instructions has been sent. Share this temporary password with the user as backup:
                  </p>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={generatedPassword} 
                      readOnly 
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyPassword}
                    >
                      {passwordCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCloseInviteDialog}>Done</Button>
                </DialogFooter>
              </div>
            ) : inviteSuccess ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-sm font-medium mb-1">Magic link sent!</p>
                  <p className="text-sm text-muted-foreground">
                    An invitation email with a magic link has been sent to <strong>{inviteEmail}</strong>. 
                    The link expires in 24 hours.
                  </p>
                </div>
                <DialogFooter>
                  <Button onClick={handleCloseInviteDialog}>Done</Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={inviteFullName}
                    onChange={(e) => setInviteFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collaborator">Collaborator</SelectItem>
                      <SelectItem value="owner">Entity / Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Invite Method</Label>
                  <RadioGroup 
                    value={inviteMethod} 
                    onValueChange={(value) => setInviteMethod(value as 'email' | 'magicLink')}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="relative">
                      <RadioGroupItem 
                        value="email" 
                        id="method-email" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="method-email"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-background p-3 hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-colors"
                      >
                        <Mail className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">Email + Password</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem 
                        value="magicLink" 
                        id="method-magic" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="method-magic"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-background p-3 hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-colors"
                      >
                        <Link2 className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">Magic Link</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    {inviteMethod === 'email' 
                      ? 'User receives an email with login credentials and must change password on first login.'
                      : 'User receives a one-time magic link to set up their account (expires in 24h).'}
                  </p>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleCloseInviteDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteUser}
                    disabled={!inviteEmail || !inviteFullName || inviteUser.isPending}
                  >
                    {inviteUser.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Send Invitation
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.full_name || 'No name'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.isMaster && (
                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                          <Crown className="h-3 w-3 mr-1" />
                          Master
                        </Badge>
                      )}
                      {user.isCollaborator && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Collaborator
                        </Badge>
                      )}
                      {!user.isMaster && !user.isCollaborator && (
                        <Badge variant="secondary">
                          User
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {!user.isMaster && (
                      user.isCollaborator ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Collaborator Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke collaborator access from{' '}
                                <strong>{user.full_name || user.email}</strong>? 
                                They will lose access to the Collaborator Dashboard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => revokeCollaboratorRole.mutate(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4 mr-1" />
                              Grant Access
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Grant Collaborator Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to grant collaborator access to{' '}
                                <strong>{user.full_name || user.email}</strong>? 
                                They will be able to manage events, opportunities, articles, and more.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => grantCollaboratorRole.mutate(user.id)}
                              >
                                Grant Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
