import React, { useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
import type{ User } from '../../types/user';

const UserManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditUser = (user: User) => {
    console.log(user);
    setSelectedUser(user);
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          {selectedUser ? `Editing: ${selectedUser.username}` : 'Create, edit, and manage users'}
        </p>
      </div>

      {/* User Form */}
      <div className="p-4 border-b border-gray-200">
        <UserForm
          selectedUser={selectedUser}
          onUserUpdate={handleUserUpdate}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          onEditUser={handleEditUser}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default UserManagement;