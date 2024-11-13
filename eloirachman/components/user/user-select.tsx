"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type User = {
  id: string;
  email: string;
  raw_user_meta_data: {
    full_name: string;
    avatar_url: string;
  };
};

export function UserSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string | undefined) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadUsers() {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, raw_user_meta_data');
      if (!error && users) {
        setUsers(users);
      }
    }
    loadUsers();
  }, [supabase]);

  return (
    <Select 
      value={value || "unassigned"} 
      onValueChange={(val) => onChange(val === "unassigned" ? undefined : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">
          <div className="flex items-center gap-2">
            <span>Unassigned</span>
          </div>
        </SelectItem>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={user.raw_user_meta_data.avatar_url}
                  alt={user.raw_user_meta_data.full_name}
                />
                <AvatarFallback>
                  {user.raw_user_meta_data.full_name[0]}
                </AvatarFallback>
              </Avatar>
              <span>{user.raw_user_meta_data.full_name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 