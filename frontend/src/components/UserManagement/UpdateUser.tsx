import React ,{useEffect,useState} from "react";
import { useDispatch } from "react-redux";
import { Plus, X, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosConfig";
import type { User, CreateUserRequest } from "../../types/user";
import LoadingSpinner from "../UI/LoadingSpinner";
import { setUsers } from "../../store/slices/usersSlice";
import { setGraphData } from "../../store/slices/graphSlice";

interface UpdateUserProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateUser: React.FC<UpdateUserProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    age: 25,
    hobbies: [],
  });
  const [newHobby, setNewHobby] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        age: user.age,
        hobbies: [...user.hobbies],
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters long";
    }

    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = "Age must be between 1 and 150";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUser = async (id: string, userData: CreateUserRequest) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/users/${id}`, userData);
      const usersResponse = await axiosInstance.get("/users");
      const graphResponse = await axiosInstance.get("/graph");

      dispatch(setUsers(usersResponse.data.data));
      dispatch(setGraphData(graphResponse.data.data));
      return response.data.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to update user";
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateUser(user._id, formData);
      toast.success("User updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
      // Error handling is done in the update function
    }
  };

  const addHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()],
      }));
      setNewHobby("");
    }
  };

  const removeHobby = (hobbyToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((hobby) => hobby !== hobbyToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHobby();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full   ">
      {/* Modal Header */}
      <div className="flex items-center justify-between mb-6 pb-1 border-b border-gray-200">
        <div className="flex items-center">
          <button
            title="fd"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
            <p className="text-gray-600 text-sm">
              Update information for {user.username}
            </p>
          </div>
        </div>
        <button
            title="f"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-2">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            title="f"
            type="number"
            value={formData.age}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                age: parseInt(e.target.value) || 0,
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.age ? "border-red-500" : "border-gray-300"
            }`}
            min="1"
            max="150"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-2">{errors.age}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hobbies
          </label>
          <div className="flex space-x-3 mb-3">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Add a hobby"
            />
            <button
              title="f"
              type="button"
              onClick={addHobby}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <Plus size={20} />
            </button>
          </div>

          {formData.hobbies.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Current Hobbies:
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm shadow-sm"
                  >
                    {hobby}
                    <button
                      title="f"
                      type="button"
                      onClick={() => removeHobby(hobby)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
          >
            <Save size={20} className="mr-2" />
            Update User
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
