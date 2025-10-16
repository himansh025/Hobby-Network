import React, { useEffect, useState } from 'react';
import ReactFlow, {
  // addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectionSource } from '../../store/slices/uiSlice';
import { setGraphData } from '../../store/slices/graphSlice';
import CustomNode from './CustomNode';
import axiosInstance from '../../config/axiosConfig';
import toast from 'react-hot-toast';


const nodeTypes = { custom: CustomNode };

const GraphVisualization: React.FC = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: any) => state.graph);
  console.log("data",data);
  const { connectionSource } = useSelector((state: any) => state.ui);
  console.log("connectio source",connectionSource );
  const { fitView } = useReactFlow();
const [loading,setLoading]=useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

useEffect(() => {
  if (!data?.nodes?.length) return;

  const formattedNodes = data.nodes.map((n: any) => ({
    id: n.id,
    type: 'custom',
    position: n.position,
    data: n.data, 
  }));

  const formattedEdges = data.edges.map((e: any) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    style: { stroke: '#6b7280', strokeWidth: 2 },
  }));

  setNodes(formattedNodes);
  setEdges(formattedEdges);
  setTimeout(() => fitView(), 100);
}, [data, fitView, setNodes, setEdges]);


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
  // API call to create a relationship
  const createRelationship = async (source: string, target: string) => {
    const id=source
    const targetUserId= target
    try {
      const response= await axiosInstance.post(`/users/${id}/link`, {  targetUserId });
      toast.success(response.data.message)
      // Optionally fetch updated graph data
      // fetchGraph
      const response2 = await axiosInstance.get('/graph');
      console.log(response2.data,"efd");
      dispatch(setGraphData(response2.data.data));
    } catch (err) {
      console.error('Error creating relationship:', err);
    }
  }

  // Node click = connect nodes if a source exists
  const onNodeClick = async(event: any, node: any)=> {
      if (connectionSource && connectionSource !== node.id) {
        createRelationship(connectionSource, node.id);
        dispatch(setConnectionSource(null));
      }
    }
  
  

  // Double click = select as source
  const onNodeDoubleClick = async(event: any, node: any) => {
      dispatch(setConnectionSource(node.id));
    }

  const onConnect = async (params: any) => {
      if (params.source && params.target) {
        createRelationship(params.source, params.target);
      }
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
