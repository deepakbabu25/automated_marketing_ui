import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orgData: null
}

const orgSlice = createSlice({
    name: 'org',
    initialState,
    reducers: {
        setOrgData: (state, action) =>{
            state.orgData = action.payload;
        }
    }
});

export const { setOrgData } = orgSlice.actions;

export default orgSlice.reducer;

//selectors
export const selectOrgData = (state) =>state.org.orgData;