import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import instance from "../../utils/axios";


 
export const login=createAsyncThunk('auth/login',async(userData,{rejectWithValue})=>{
    try {
        const response=await instance.post('/auth/login', userData,{
            withCredentials:true,
        });
        if(!response){
            throw new Error('Login failed!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Invalid Credentials";
            return rejectWithValue(message);
          }
          return rejectWithValue("Login failed!");
    }   
}
)


export const register=createAsyncThunk('auth/register',async(userData,{rejectWithValue})=>{
    try {
        const response=await instance.post('/auth/register', userData,{
            withCredentials:true,
        });
        if(!response){
            throw new Error('Registration failed!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Registration failed!";
            return rejectWithValue(message);
          }
          return rejectWithValue("Registration failed!");
    }
    }
)


export const logout=createAsyncThunk('auth/logout',async(_, {rejectWithValue})=>{
    try {
        const response=await instance.get('/auth/logout',{
            withCredentials:true,
        });
        if(!response){
            throw new Error('Logout failed!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Logout failed!";
            return rejectWithValue(message);
          }
          return rejectWithValue("Logout failed!");
    }
    }
)

 const authSlice = createSlice({
    name:'auth',
    initialState:{
        loading:false,
        user:null,
        error:null,
        token:null,
        tokenExpiry:null,
    },
    reducers:{
        triggerLogout: (state) => {
            state.user = null;
            state.token = null;
            state.tokenExpiry = null;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          },
    },
    extraReducers:(builder)=>{
      builder
        .addCase(login.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(login.fulfilled,(state,action)=>{
            const {user,token}=action.payload;
            const decoded=jwtDecode(token);

            state.loading=false;
            state.user=user;
            state.token=token;
            state.tokenExpiry=decoded.exp*1000;
            state.error=null;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        })
        .addCase(login.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(register.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload.user;
            state.error=null;
        })
        .addCase(register.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(logout.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(logout.fulfilled,(state)=>{
            state.loading=false;
            state.user=null;
            state.error=null;
        })
        .addCase(logout.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }

 })

 export const { triggerLogout } = authSlice.actions;

 export default authSlice.reducer;