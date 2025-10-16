import { createSlice  } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  connectionSource: string | null;
  searchTerm: string;
  selectedHobby: string | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  connectionSource: null,
  searchTerm: '',
  selectedHobby: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setConnectionSource: (state, action) => {
      state.connectionSource = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedHobby: (state, action) => {
      state.selectedHobby = action.payload;
    },
  },
});

export const { toggleSidebar, setConnectionSource, setSearchTerm, setSelectedHobby } = uiSlice.actions;
export default uiSlice.reducer;
