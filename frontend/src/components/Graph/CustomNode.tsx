import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  popularityScore: number;
  username: string;
  age: number;
  friends: string[];
  hobbies: string[];
  _id: string;
  id:string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  const baseSize = 120;
  const sizeMultiplier = 1 + (data.popularityScore * 0.1);
  const nodeSize = baseSize * sizeMultiplier;
  const intensity = Math.min(100 + data.popularityScore * 20, 300);
  const backgroundColor = `rgba(59, 130, ${intensity}, 0.8)`;

  // Handle drop event
const handleDrop = (event: React.DragEvent) => {
  event.preventDefault();

  try {
    const dragData = event.dataTransfer.getData("application/json");
    console.log("drag",dragData);
    if (dragData) {
      const { hobby } = JSON.parse(dragData);
console.log("data0",data);
      if (hobby && !data.hobbies.includes(hobby)) {
        const customEvent = new CustomEvent("hobbyDrop", {
          detail: { userId: data.id, hobby },
        });
        window.dispatchEvent(customEvent);
      }
    }
  } catch (error) {
    console.error("Error processing drop:", error);
  }
};

const handleDragOver = (event: React.DragEvent) => {
  event.preventDefault(); // required to allow drop
  event.dataTransfer.dropEffect = "copy";
};


  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    // Add visual feedback for drag over
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    // Remove visual feedback
  };

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <div
        className="rounded-lg shadow-lg border-2 border-white transition-all duration-200 hover:shadow-xl hover:scale-105"
        style={{
          width: nodeSize,
          height: nodeSize,
          backgroundColor,
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center h-full p-3 text-white">
          <div className="text-lg font-bold text-center mb-1">{data.username}</div>
          <div className="text-sm opacity-90 mb-2">Age: {data.age}</div>
          <div className="text-xs opacity-80 text-center">Score: {data.popularityScore.toFixed(1)}</div>
          <div className="text-xs opacity-70 text-center mt-1">Friends: {data.friends.length}</div>
          <div className="text-xs opacity-70 text-center mt-1">Hobbies: {data.hobbies.length}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;