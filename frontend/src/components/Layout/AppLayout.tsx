import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/slices/uiSlice";
import HobbyList from "../Sidebar/HobbyList";
import HobbySearch from "../Sidebar/HobbySearch";
import GraphVisualization from "../Graph/GraphVisualization";
import UserManagement from "../UserManagement/UserManagement";
import { Menu, X } from "lucide-react";
import { ReactFlowProvider } from "reactflow";

const AppLayout: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: any) => state.ui.sidebarOpen);
  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return (
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
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-2 h-[600px]">
              <ReactFlowProvider>
                <GraphVisualization />
              </ReactFlowProvider>
            </div>
            <div className="bg-white rounded-lg border p-2">
              <UserManagement />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
