import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const createLeave=createAsyncThunk('leave/createLeave',async(leaveData,{rejectWithValue})=>{

try{
 const response=await instance.post('/leave/create',leaveData,{
    withCredentials:true,
    headers:{
        'Content-Type':'multipart/form-data',
    },
 }
 )
    return response.data;
    
}catch(error){
    return rejectWithValue(error.response.data.message)
}

});

export const getAllLeaves=createAsyncThunk('leave/getAllLeaves',async(_, {rejectWithValue})=>{
    try{
        const response=await instance.get('/leave/getAll',{
            withCredentials:true,
        })
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data.message)
    }
}
)

export const updateLeaveStatus=createAsyncThunk('leave/updateLeaveStatus',async({id,status},{rejectWithValue})=>{
    try{
        const response=await instance.patch(`/leave/update/${id}`,{status},{
            withCredentials:true,
        })
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data.message)
    }
})


const leaveSlice=createSlice({
    name:'leave',
    initialState:{
        leaveRequests:[],
        leaveRequest:{},
        isLoading:false,
        isError:false,
        message:'',
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(createLeave.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(createLeave.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.leaveRequest=action.payload.data;
            state.message=action.payload.message;
        })
        .addCase(createLeave.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        })
        .addCase(getAllLeaves.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(getAllLeaves.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.leaveRequests=action.payload.data;
            state.message=action.payload.message;
        })
        .addCase(getAllLeaves.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        })
        .addCase(updateLeaveStatus.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(updateLeaveStatus.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.leaveRequest=action.payload.data;
            state.message=action.payload.message;
        })
        .addCase(updateLeaveStatus.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        })
    }
})

export default leaveSlice.reducer;