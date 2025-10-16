import { createSlice } from '@reduxjs/toolkit';
import type { GraphData } from '../../types/user';

interface GraphState {
  data: GraphData;

}

const initialState: GraphState = {
  data: { nodes: [], edges: [] },
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {

    setGraphData: (state,action) => {
      state.data = action.payload;
    },
  },
});

export const {  setGraphData } = graphSlice.actions;
export default graphSlice.reducer;
