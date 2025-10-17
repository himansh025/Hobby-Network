import React, { useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
import type { User } from '../../types/user';
import { Users, UserPlus, Edit3, Sparkles, Cross } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userView, setUserView] = useState(false);

  const handleEditUser = (user: User) => {
    console.log(user);
    setSelectedUser(user);
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
  };

  const handleViewUsers=()=>{
    setUserView(!userView)
  }

  if(userView){
return(
       <div className="flex-1 px-2 pb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-gray-50 to-purple-50/50 px-6 py-2 border-b border-gray-100">
            <div className="flex items-center justify-between relative">
              <div className="flex items-center space-x-3 ">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg ">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">All Users</h3>
                  <p className="text-sm text-gray-600">Manage your user network</p>
              
                </div>
                    <button title='x' onClick={()=>setUserView(!userView)} className='absolute top-1 right-0'>
                    <Cross className='rotate-45 font-light text-red-600  '/>
                  </button>
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              </div>
            </div>
          </div>
          <div className="h-[calc(100%-80px)] overflow-y-auto">
            <UserList onEditUser={handleEditUser} />
          </div>
        </div>
      </div> 
)
  }
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header with gradient and better styling */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Users size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">User Management</h3>
            <p className="text-blue-100 text-sm mt-1 flex items-center">
              <Sparkles size={14} className="mr-1" />
              {selectedUser ? `Editing: ${selectedUser.username}` : 'Create, edit, and manage your network'}
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${selectedUser ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></div>
            <span>{selectedUser ? 'Editing Mode' : 'Ready'}</span>
          </div>
        </div>
      </div>

      {/* User Form with card styling */}
      <div className="p-2">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${selectedUser ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                {selectedUser ? <Edit3 size={16} /> : <UserPlus size={16} />}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {selectedUser ? 'Update user information' : 'Add a new user to your network'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <UserForm
              selectedUser={selectedUser}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        </div>
      </div>
 <div className="flex-1 px-2 flex justify-center items-center pb-6"> 
  <button onClick={handleViewUsers}>
<h2 className='text-gray-800 text-xl bg-green-400 px-10 py-2 rounded-md'>View Users
  </h2>  
  </button>
  </div>
    </div>
  );
};

export default UserManagement;