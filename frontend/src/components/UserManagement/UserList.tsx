import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Users, Edit2, Trash2, Star, Plus, List, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosConfig";
import type { User, CreateUserRequest } from "../../types/user";
import LoadingSpinner from "../UI/LoadingSpinner";
import { setUsers } from "../../store/slices/usersSlice";
import { setGraphData } from "../../store/slices/graphSlice";
import UserForm from "./UserForm";

interface UserListProps {
  onEditUser: (user: User) => void;
  refreshTrigger?: number;
}

type TabType = "list" | "create";

const UserList: React.FC<UserListProps> = ({ onEditUser, refreshTrigger }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("list");
  const users: User[] = useSelector((state: any) => state.users?.users || []);
  const dispatch = useDispatch();

  // Refresh users when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchUsers();
    }
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
      // Refresh the user list
      fetchUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to delete user";
      toast.error(errorMsg);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleUserCreated = () => {
    toast.success("User created successfully!");
    setActiveTab("list"); // Switch to list tab after creation
    // Refresh the user list
    fetchUsers();
  };

  const handleEditClick = (user: User) => {
    onEditUser(user);
    setActiveTab("create"); // Switch to create tab for editing
  };

  const tabs = [
    { id: "list" as TabType, label: "View Users", icon: List },
    { id: "create" as TabType, label: "Create User", icon: Plus },
  ];

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden lg:h-[700px] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <IconComponent size={16} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "list" && (
          <div className="h-full overflow-y-auto">
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                <Users size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-2">No users found</p>
                <p className="text-sm text-gray-400 mb-4">Create your first user to get started!</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  Create User
                </button>
              </div>
            ) : (
              users.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  loading={deleteLoading === user._id}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "create" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <UserForm 
                onSuccess={handleUserCreated}
                onCancel={() => {
                  setActiveTab("list");
                  onEditUser(null as any); // Clear any selected user
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// User List Item Component
interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  loading: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onEdit, onDelete, loading }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(user._id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
      {/* Header with user info and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center mb-1">
              <h4 className="font-semibold text-gray-900 truncate">{user.username}</h4>
              <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">({user.age})</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users size={14} className="mr-1.5 text-gray-400" />
                <span>{user.friends.length} friends</span>
              </div>
              <div className="flex items-center">
                <Star size={14} className="mr-1.5 text-yellow-500" />
                <span>Score: {user.popularityScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <button
            onClick={() => onEdit(user)}
            disabled={loading}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-200"
            title="Edit user"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border ${
              showConfirm
                ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                : "text-red-600 hover:bg-red-50 border-transparent hover:border-red-200"
            }`}
            title={showConfirm ? "Click again to confirm" : "Delete user"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Hobbies */}
      {user.hobbies.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {user.hobbies.slice(0, 4).map((hobby, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200"
              >
                {hobby}
              </span>
            ))}
            {user.hobbies.length > 4 && (
              <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200">
                +{user.hobbies.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showConfirm && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-700 font-medium">
              Are you sure you want to delete {user.username}?
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;