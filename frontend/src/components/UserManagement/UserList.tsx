import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Users } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosConfig";
import type { User } from "../../types/user";
import LoadingSpinner from "../UI/LoadingSpinner";
import { setUsers } from "../../store/slices/usersSlice";
import { setGraphData } from "../../store/slices/graphSlice";
import UserListItem from "./UserListItem";

interface UserListProps {
  onEditUser: (user: User) => void;
  refreshTrigger?: number;
}

const UserList: React.FC<UserListProps> = ({ onEditUser, refreshTrigger }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const users: User[] = useSelector((state: any) => state.users?.users || []);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      const graph = await axiosInstance.get("/graph");
      dispatch(setUsers(response.data.data));
      dispatch(setGraphData(graph.data.data));
    } catch (error: any) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      setDeleteLoading(userId);
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to delete user";
      toast.error(errorMsg);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full overflow-y-auto">
      {users.length === 0 ? (
        <div className="p-8 text-center text-gray-500 h-full flex flex-col items-center justify-center">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-2">No users found</p>
          <p className="text-sm text-gray-400 mb-4">Create your first user to get started!</p>
        </div>
      ) : (
        users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            onEdit={onEditUser}
            onDelete={handleDelete}
            loading={deleteLoading === user._id}
          />
        ))
      )}
    </div>
  );
};

export default UserList;