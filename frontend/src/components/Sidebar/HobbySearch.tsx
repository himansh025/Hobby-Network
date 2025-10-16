import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../../store/slices/uiSlice';
import { Search } from 'lucide-react';

const HobbySearch: React.FC = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: any) => state.ui.searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearchTerm(''));
  };

  return (
    <div className="relative mt-4 px-4">
      <div className="relative max-w-md mx-auto">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <input
          type="text"
          placeholder="Search hobbies..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   shadow-sm hover:shadow-md transition-all duration-200
                   placeholder-gray-400 text-gray-700
                   bg-white"
        />
        
        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2
                     text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default HobbySearch;