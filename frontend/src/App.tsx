import React, { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import toast, { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/UI/ErrorBoundary";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import { setUsers } from "./store/slices/usersSlice";
import axiosInstance from "./config/axiosConfig";
import { setGraphData } from "./store/slices/graphSlice";
import { useDispatch, useSelector } from "react-redux";
import { Route, Router, useSearchParams } from "react-router-dom";
import { toggleSidebar } from "./store/slices/uiSlice";
import HobbyList from "./components/Sidebar/HobbyList";
import HobbySearch from "./components/Sidebar/HobbySearch";
import GraphVisualization from "./components/Graph/GraphVisualization";
import UserManagement from "./components/UserManagement/UserManagement";
import { Menu, X } from "lucide-react";
import { ReactFlowProvider } from "reactflow";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const sidebarOpen = useSelector((state: any) => state.ui.sidebarOpen);
  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);
  const fetchInitialData = async () => {
    try {
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
        
  <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-200 border-r bg-white`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            <HobbySearch />
            <div className="flex-1 overflow-auto">
              <HobbyList />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <h1 className="text-lg font-semibold">Hobby Network</h1>
          <div className="w-8" />
        </header>

        <div className="flex-1 p-2 overflow-auto">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-auto">
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-2 h-[300px] lg:h-[700px]">
              <ReactFlowProvider>
                <GraphVisualization />
              </ReactFlowProvider>
            </div>
            <div className="bg-white   rounded-lg border p-2">
              <UserManagement />
            </div>
          </div>
        </div>
      </div>
    </div>
           
    
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
