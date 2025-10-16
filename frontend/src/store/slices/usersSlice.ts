import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    }
  },
});

export const { setLoading, setUsers } = usersSlice.actions;
export default usersSlice.reducer;
