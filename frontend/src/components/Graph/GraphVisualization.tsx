import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
  Connection,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { setConnectionSource } from "../../store/slices/uiSlice";
import { setGraphData } from "../../store/slices/graphSlice";
import CustomNode from "./CustomNode";
import axiosInstance from "../../config/axiosConfig";
import toast from "react-hot-toast";
import LoadingSpinner from "../UI/LoadingSpinner";
import { setUsers } from "../../store/slices/usersSlice";

const nodeTypes = { custom: CustomNode };

const GraphVisualization: React.FC = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state: any) => state.graph);
  const { connectionSource } = useSelector((state: any) => state.ui);
  const { fitView } = useReactFlow();
  const [laoding, setLoading] = useState(false);

  // Memoize node formatting
  const formattedNodes = useMemo(() => {
    if (!data?.nodes?.length) return [];
    return data.nodes.map((n: any) => ({
      id: n.id,
      type: "custom",
      position: n.position,
      data: n.data,
    }));
  }, [data?.nodes]);

  const formattedEdges = useMemo(() => {
    if (!data?.edges?.length) return [];
    return data.edges.map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      style: { stroke: "#6b7280", strokeWidth: 2 },
    }));
  }, [data?.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(formattedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(formattedEdges);

  useEffect(() => {
    setNodes(formattedNodes);
    setEdges(formattedEdges);
    setTimeout(() => fitView(), 100);
  }, [formattedNodes, formattedEdges, setNodes, setEdges, fitView]);

  const createRelationship = 
    async (id: string, target: string) => {
      setLoading(true);
      try {
        await axiosInstance.post(`/users/${id}/link`, { targetUserId: target });
        const graphResponse = await axiosInstance.get("/graph");
        const user= await axiosInstance.get("/users")
        dispatch(setUsers(user.data.data));
        dispatch(setGraphData(graphResponse.data.data));
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.error || "Failed to create relationship";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
    
  const removeRelationship = 
    async (id: string, targetUserId: string) => {
      setLoading(true);
      // console.log(id);
      try {
        const response = await axiosInstance.delete(`/users/${id}/unlink`, {
          data: { targetUserId },
        });
        toast.success(response.data.message);
        const graphResponse = await axiosInstance.get("/graph");
        const user= await axiosInstance.get("/users")
        dispatch(setUsers(user.data.data));
        dispatch(setGraphData(graphResponse.data.data));

      } catch (err: any) {
        const errorMsg =err.response?.data?.error || "Failed to remove relationship";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  const onEdgeDoubleClick = async (event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm("Are you sure you want to remove this relationship?")) {
      await removeRelationship(edge.source, edge.target);
    }
  };

  const onNodeClick = useCallback(
    async (event: React.MouseEvent, node: any) => {
      if (connectionSource && connectionSource !== node.id) {
        await createRelationship(connectionSource, node.id);
        dispatch(setConnectionSource(null));
      }
    },
    [connectionSource, createRelationship, dispatch]
  );

  const onNodeDoubleClick = async (event: React.MouseEvent, node: any) => {
    dispatch(setConnectionSource(node.id));
  };

  const onConnect = async (connection: Connection) => {
    if (connection.source && connection.target) {
      await createRelationship(connection.source, connection.target);
    }
  };

  if (laoding) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {connectionSource && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg">
          🔗 Select target user to connect...
        </div>
      )}
    </div>
  );
};

export default GraphVisualization;
