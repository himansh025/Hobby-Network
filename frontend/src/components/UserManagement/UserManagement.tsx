import React, { useState } from "react";
import UserList from "./UserList";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import type { User } from "../../types/user";

type TabType = "list" | "create";

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleUserCreated = () => {
    setActiveTab("list");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUserUpdated = () => {
    setSelectedUser(null);
    setShowUpdateModal(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelUpdate = () => {
    setSelectedUser(null);
    setShowUpdateModal(false);
  };

  const tabs = [
    { id: "list" as TabType, label: "All Users", icon: "👥" },
    { id: "create" as TabType, label: "Create User", icon: "➕" },
  ];

  return (
    <div className="h-full flex w-full flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="h-[700px] overflow-hidden">
            {activeTab === "list" && (
              <UserList
                onEditUser={handleEditUser}
                refreshTrigger={refreshTrigger}
              />
            )}

            {activeTab === "create" && (
              <CreateUser
                onSuccess={handleUserCreated}
                onCancel={() => setActiveTab("list")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Update User Modal */}
      {showUpdateModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center p-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm  w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 overflow-y-auto max-h-[85vh]">
              <UpdateUser
                user={selectedUser}
                onSuccess={handleUserUpdated}
                onCancel={handleCancelUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;