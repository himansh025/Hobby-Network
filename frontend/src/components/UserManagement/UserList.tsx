import React, { useState } from "react";
import { Users } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../config/axiosConfig";
import type { User } from "../../types/user";
import UserItem from "./UserItem";

interface UserListProps {
  onEditUser: (user: User) => void;
  refreshTrigger?: number;
}

const UserList: React.FC<UserListProps> = ({ onEditUser, refreshTrigger }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const users: User[] = useSelector((state: any) => state.users.users);

  const handleEdit = (user: User) => {
    onEditUser(user);
  };

  const handleDelete = async (userId: string) => {
    try {
      setDeleteLoading(userId);
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to delete user";
      toast.error(errorMsg);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Users size={48} className="mx-auto text-gray-300 mb-2" />
        <p>No users found.</p>
        <p className="text-sm">Create your first user to get started!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {users.map((user) => (
        <UserItem
          key={user._id}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={deleteLoading === user._id}
        />
      ))}
    </div>
  );
};

export default UserList;
