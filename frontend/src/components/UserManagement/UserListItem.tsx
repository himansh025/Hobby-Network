import React, { useState } from "react";
import { Edit2, Trash2, Star, Users } from "lucide-react";
import type { User } from "../../types/user";

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

export default UserListItem;