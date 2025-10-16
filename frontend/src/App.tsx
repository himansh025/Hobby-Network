import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import toast, { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/UI/ErrorBoundary";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import { setUsers } from "./store/slices/usersSlice";
import axiosInstance from "./config/axiosConfig";
import { setGraphData } from "./store/slices/graphSlice";
import AppLayout from "./components/Layout/AppLayout";
import { useDispatch } from "react-redux";


const App: React.FC = () => {
   const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      console.log(response.data.data);
      toast.success("all user are duccessfully fetched")
      dispatch(setUsers(response?.data?.data));
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to fetch users";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/graph");
console.log("GRAPH API response:", response.data);  
    dispatch(setGraphData(response?.data?.data));
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to fetch users";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchGraphData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (    
    <div>

    <ErrorBoundary>
        <DndProvider backend={HTML5Backend}>
          <div className="App">
            <AppLayout />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </DndProvider>
    </ErrorBoundary>
                    </div>
  );
};

export default App;
