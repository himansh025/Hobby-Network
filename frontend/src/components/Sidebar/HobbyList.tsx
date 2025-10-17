import React, { useMemo } from 'react';
import {  useSelector } from 'react-redux';
import { User } from '../../types/user';
import HobbyItem from './HobbyItem';



const HobbyList: React.FC = () => {
 const users: User[] = useSelector((state: any) => state.users?.users || []);
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
        <HobbyItem hobby={hobby} count={count} />
      ))}
    </div>
  );
};

export default HobbyList;
