import React, { useCallback, useEffect, useState } from "react";
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

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [usersResponse, graphResponse] = await Promise.all([
        axiosInstance.get("/users"),
        axiosInstance.get("/graph")
      ]);
      
      dispatch(setUsers(usersResponse?.data?.data));
      dispatch(setGraphData(graphResponse?.data?.data));
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to fetch data";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInitialData();
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
