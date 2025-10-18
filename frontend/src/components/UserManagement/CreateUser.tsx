import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosConfig";
import type { CreateUserRequest } from "../../types/user";
import LoadingSpinner from "../UI/LoadingSpinner";
import { setUsers } from "../../store/slices/usersSlice";
import { setGraphData } from "../../store/slices/graphSlice";

interface CreateUserProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    age: 25,
    hobbies: [],
  });
  const [newHobby, setNewHobby] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  const createUser = async (userData: CreateUserRequest) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/users", userData);
      const usersResponse = await axiosInstance.get("/users");
      const graphResponse = await axiosInstance.get("/graph");

      dispatch(setUsers(usersResponse.data.data));
      dispatch(setGraphData(graphResponse.data.data));
      return response.data.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to create user";
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
      await createUser(formData);
      toast.success("User created successfully!");
      onSuccess();
    } catch (error) {
      // Error handling is done in the create function
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
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create New User
            </h2>
            <p className="text-gray-600">Add a new user to the system</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              title="g"
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  age: parseInt(e.target.value) || 0,
                }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.age ? "border-red-500" : "border-gray-300"
              }`}
              min="1"
              max="150"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hobbies
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a hobby"
              />
              <button
                title="g"
                type="button"
                onClick={addHobby}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm"
                >
                  {hobby}
                  <button
                    title="g"
                    type="button"
                    onClick={() => removeHobby(hobby)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              <Save size={16} className="mr-2" />
              Create User
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
