import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store';
import { setSelectedHobby } from '../../store/slices/uiSlice';
import { useDrag } from 'react-dnd';
import { Gift } from 'lucide-react';
import { User } from '../../types/user';

interface HobbyItemProps {
  hobby: string;
  count: number;
}

const HobbyItem: React.FC<HobbyItemProps> = ({ hobby, count }) => {
  const dispatch = useDispatch();
  const selectedHobby = useSelector((state: any) => state.ui.selectedHobby);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'hobby',
    item: { hobby },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    dispatch(setSelectedHobby(hobby === selectedHobby ? null : hobby));
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`
        flex items-center justify-between p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200
        ${selectedHobby === hobby 
          ? 'bg-blue-50 border-blue-500 shadow-md' 
          : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
        }
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
      `}
    >
      <div className="flex items-center">
        <Gift size={16} className="text-green-400 mr-3" />
        <span className="font-medium text-gray-700">{hobby}</span>
      </div>
      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        {count}
      </span>
    </div>
  );
};

const HobbyList: React.FC = () => {
  const users:User[] = useSelector((state: any) => state.users.users);
  const searchTerm = useSelector((state:any ) => state.ui.searchTerm);

  const hobbiesWithCount = useMemo(() => {
    const hobbyCount: Record<string, number> = {};

    users.forEach(user => {
      user.hobbies.forEach(hobby => {
        hobbyCount[hobby] = (hobbyCount[hobby] || 0) + 1;
      });
    });

    let hobbies = Object.entries(hobbyCount)
      .map(([hobby, count]) => ({ hobby, count }))
      .sort((a, b) => b.count - a.count);

    if (searchTerm) {
      hobbies = hobbies.filter(item =>
        item.hobby.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return hobbies;
  }, [users, searchTerm]);

  if (hobbiesWithCount.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {searchTerm ? 'No hobbies found matching your search.' : 'No hobbies available.'}
      </div>
    );
  }

  return (
    <div className="p-4">
      {hobbiesWithCount.map(({ hobby, count }) => (
        <HobbyItem key={hobby} hobby={hobby} count={count} />
      ))}
    </div>
  );
};

export default HobbyList;
