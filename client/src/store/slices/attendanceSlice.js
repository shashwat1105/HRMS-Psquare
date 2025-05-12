import toast from "react-hot-toast";
import instance from "../../utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const getAllAttendance=createAsyncThunk("attendance/getAllAttendance",async(_,{rejectWithValue})=>{
    try{
        const response=await instance.get("/attendance/getAll",{
          withCredentials:true,
        });

        if(!response.data){
            throw new Error("Failed to fetch attendance data!");
        }

    return response.data;
    }catch(err){
        return rejectWithValue(err.response.data.message);
    }
});

export const updateAttendanceStatus=createAsyncThunk("attendance/updateAttendanceStatus",async({id,status},{rejectWithValue})=>{
    try{
        const response=await instance.patch(`/attendance/update/${id}`,{status},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
            },
        });
        if(!response.data){
            throw new Error("Failed to update attendance status!");
        }
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data.message);
    }
});


const attendanceSlice=createSlice({
    name:"attendance",
    initialState:{
        attendance:[],
        loading:false,
        error:null,
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllAttendance.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getAllAttendance.fulfilled,(state,action)=>{
            state.loading=false;
            state.attendance=action.payload.data; 
            toast.success(action.payload.message || "Attendance fetched successfully!");
            // console.log("Attendance data:",action.payload.data);
          })
        .addCase(getAllAttendance.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(updateAttendanceStatus.pending,(state)=>{
            state.loading=true;
        })
        .addCase(updateAttendanceStatus.fulfilled,(state,action)=>{
            state.loading=false;
            const index=state.attendance.findIndex((item)=>(item._id===action.payload._id));
            if(index!==-1){
                state.attendance[index]=action.payload;
            }
            toast.success(action.payload.message || "Status updated successfully!");
        })
        .addCase(updateAttendanceStatus.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
})


export default attendanceSlice.reducer;
