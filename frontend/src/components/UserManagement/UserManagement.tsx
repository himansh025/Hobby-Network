import React, { useState } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";
import type { User } from "../../types/user";

const UserManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
  };

  const handleUserCreated = () => {
    setSelectedUser(null);
    // Trigger refresh of user list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-full flex w-full flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Only show UserList, UserForm is now inside UserList tabs */}
          <UserList 
            onEditUser={handleEditUser}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;