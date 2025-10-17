import React, { useState, useEffect } from "react";
import type { User, CreateUserRequest } from "../../types/user";
import { Plus, Save, X } from "lucide-react";
import { axiosInstance } from "../../config/axiosConfig";
import { setUsers } from "../../store/slices/usersSlice";
import { useDispatch } from "react-redux";
import { setGraphData } from "../../store/slices/graphSlice";
import toast from "react-hot-toast";
import LoadingSpinner from "../UI/LoadingSpinner";

interface UserFormProps {
  selectedUser: User | null;
  onCancelEdit: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  selectedUser,
  onCancelEdit,
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    age: 25,
    hobbies: [],
  });
  const dispatch=useDispatch();
  const [newHobby, setNewHobby] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        age: selectedUser.age,
        hobbies: [...selectedUser.hobbies],
      });
    } else {
      setFormData({
        username: "",
        age: 25,
        hobbies: [],
      });
    }
    setErrors({});
  }, [selectedUser]);

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
      toast.success("User created successfully!");
      const res= await axiosInstance.get('/users')
            const graph= await axiosInstance.get('/graph')
      // console.log(res.data.data);
      dispatch(setUsers(res.data.data))
            dispatch(setGraphData(graph.data.data))

      return response.data.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to create user";
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: CreateUserRequest) => {
    // console.log(id, userData);
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/users/${id}`, userData);
      toast.success("User updated successfully!");
      const user = await axiosInstance.get('/users');
      dispatch(setUsers(user.data.data))
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
      if (selectedUser) {
        await updateUser(selectedUser._id, formData);
      } else {
        await createUser(formData);
      }
      setFormData({ username: "", age: 0, hobbies: [] });
      onCancelEdit(); // Clear selection
    } catch (error:any) {
      toast.error(error.message)
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

if(loading){
  return <LoadingSpinner/>
}
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
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
          title="age"
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
            title="new hobby"
            type="button"
            onClick={addHobby}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.hobbies.map((hobby, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {hobby}
              <button
                title="remvoe hobby"
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

    <div className="flex flex-col md:flex-row gap-2">
  <button
    type="submit"
    disabled={loading}
    className="btn-primary rounded-md flex-1 p-2 bg-blue-950 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex text-white items-center justify-center"
  >
    <Save size={20} className="mr-1 text-green-400" />
    {selectedUser ? "Update User" : "Create User"}
    {loading && "..."}
  </button>

  {selectedUser && (
    <button
      type="button"
      onClick={onCancelEdit}
      className="btn-secondary flex-1 p-2 w-full md:w-auto"
    >
      Cancel
    </button>
  )}
</div>

    </form>
  );
};

export default UserForm;
