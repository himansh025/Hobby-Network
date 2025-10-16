import React, { useState } from "react";
import type { User } from "../../types/user";
import { Edit2, Trash2, Users, Star } from "lucide-react";

interface UserItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  loading: boolean;
}

const UserItem: React.FC<UserItemProps> = ({ user, onEdit, onDelete, loading }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(user._id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-800">{user.username}</h3>
          <span className="ml-2 text-sm text-gray-500">({user.age})</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(user)}
            disabled={loading}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit user"
          >
            <Edit2 size={14} />
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              showConfirm
                ? "bg-red-500 text-white"
                : "text-red-600 hover:bg-red-50"
            }`}
            title={showConfirm ? "Click again to confirm" : "Delete user"}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
        <div className="flex items-center">
          <Users size={14} className="mr-1" />
          {user.friends.length} friends
        </div>
        <div className="flex items-center">
          <Star size={14} className="mr-1" />
          Score: {user.popularityScore.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {user.hobbies.slice(0, 3).map((hobby, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
          >
            {hobby}
          </span>
        ))}
        {user.hobbies.length > 3 && (
          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
            +{user.hobbies.length - 3} more
          </span>
        )}
      </div>

      {showConfirm && (
        <div className="mt-2 text-xs text-red-600 font-medium">
          Click delete again to confirm
        </div>
      )}
    </div>
  );
};

export default UserItem;
