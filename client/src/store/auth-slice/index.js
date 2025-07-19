import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading : FontFaceSetLoadEvent,
    user : null 
}


const authSlice = createSlice({
    name : 'auth',
    initalState,
    reducers : {
        setUser:(state,action)=>{

        }
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;