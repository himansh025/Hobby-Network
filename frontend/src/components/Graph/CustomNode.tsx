import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  popularityScore:number
  username:string,
  age:number,
  friends:string[]

}
const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {

  const baseSize = 120;
  const sizeMultiplier = 1 + (data.popularityScore * 0.1); //  user.popularityScore
  const nodeSize = baseSize * sizeMultiplier;

  const intensity = Math.min(100 + data.popularityScore * 20, 300);
  const backgroundColor = `rgba(59, 130, ${intensity}, 0.8)`;


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
      >
        <div className="flex flex-col items-center justify-center h-full p-3 text-white">
          <div className="text-lg font-bold text-center mb-1">{data.username}</div>
          <div className="text-sm opacity-90 mb-2">Age: {data.age}</div>
          <div className="text-xs opacity-80 text-center">Score: {data.popularityScore.toFixed(1)}</div>
          <div className="text-xs opacity-70 text-center mt-1">Friends: {data.friends.length}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;