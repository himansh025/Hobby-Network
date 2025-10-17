import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedHobby } from '../../store/slices/uiSlice';
import { Gift, Slash } from 'lucide-react'; // Slash icon for "not allowed"

interface HobbyItemProps {
  hobby: string;
  count: number;
}

const HobbyItem: React.FC<HobbyItemProps> = ({ hobby, count }) => {
  const dispatch = useDispatch();
  const selectedHobby = useSelector((state: any) => state.ui.selectedHobby);
  const isSelected = selectedHobby === hobby;

  const handleClick = () => {
    if (!isSelected) dispatch(setSelectedHobby(hobby));
  };

  const handleDragStart = (event: React.DragEvent) => {
    if (isSelected) {
      event.preventDefault(); // prevent dragging already-selected hobby
      return;
    }
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ hobby })
    );
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      onClick={handleClick}
      draggable={!isSelected} // disable dragging if selected
      onDragStart={handleDragStart}
      className={`
        flex items-center justify-between p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed relative' 
          : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center">
        <Gift size={16} className={`mr-3 ${isSelected ? 'text-gray-400' : 'text-green-400'}`} />
        <span className={`${isSelected ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
          {hobby}
        </span>
      </div>
      <div className="flex items-center">
        <span className={`text-sm px-2 py-1 rounded-full ${isSelected ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          {count}
        </span>
        {isSelected && <Slash size={16} className="text-gray-500 ml-2" />}
      </div>
    </div>
  );
};


export default HobbyItem;
