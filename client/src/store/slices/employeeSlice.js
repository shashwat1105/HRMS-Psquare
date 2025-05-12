import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";
import toast from "react-hot-toast";


export const addEmployee = createAsyncThunk('employee/add', async (userData, { rejectWithValue }) => {
    try {
      const response = await instance.post('/employee/add', userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response) {
        throw new Error('Employee creation failed!');
      }
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || "Employee creation failed!");
      }
      return rejectWithValue("Employee creation failed!");
    }
  });
export const getAllEmployees=createAsyncThunk('employee/getAll',async(_, {rejectWithValue})=>{
    try {
        const response=await instance.get('/employee/getAll',{
            withCredentials:true,
        });
        if(!response){
            throw new Error('Failed to fetch employees!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Failed to fetch employees!";
            return rejectWithValue(message);
          }
          return rejectWithValue("Failed to fetch employees!");
    }
    }
)
export const updateEmployee = createAsyncThunk(
    'employee/update',
    async ({ id, userData }, { rejectWithValue }) => {
      try {
        const response = await instance.patch(
          `/employee/update/${id}`,
          userData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        if (!response.data) {
          throw new Error('Failed to update employee!');
        }
        return response.data;
      } catch (err) {
        if (err.response) {
          const message = err.response.data.message || "Failed to update employee!";
          return rejectWithValue(message);
        }
        return rejectWithValue("Failed to update employee!");
      }
    }
  );
export const deleteEmployee = createAsyncThunk(
    'employee/delete',
    async (id, { rejectWithValue }) => {
      try {
        const response = await instance.delete(`/employee/${id}`, {
          withCredentials: true,
        });
        
        if (!response.data) {
          throw new Error('Failed to delete employee!');
        }
        return response.data;
      } catch (err) {
        if (err.response) {
          const message = err.response.data.message || "Failed to delete employee!";
          return rejectWithValue(message);
        }
        return rejectWithValue("Failed to delete employee!");
      }
    }
  );




const employeeSlice=createSlice({
    name:'employee',
    initialState:{
        leaveRequests: [],
        employees:[],
        loading:false,
        error:null,
    },
    reducers:{
        
    },
    extraReducers:(builder)=>{
        builder
        .addCase(addEmployee.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addEmployee.fulfilled,(state,action)=>{
            state.loading=false;
            state.employees = [action.payload.data, ...state.employees];
            state.error=null;

        })
        .addCase(addEmployee.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getAllEmployees.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getAllEmployees.fulfilled,(state,action)=>{
            state.loading=false;
            state.employees=action.payload.data;
            state.error=null;
            toast.success(action.payload.message || "Employees fetched successfully!");
        })
        .addCase(getAllEmployees.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(updateEmployee.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateEmployee.fulfilled,(state)=>{
            state.loading=false;
            // state.employees=action.payload.data;
            state.error=null;
        })
        .addCase(updateEmployee.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(deleteEmployee.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteEmployee.fulfilled,(state)=>{
            state.loading=false;
            // state.employees=action.payload.data;
            state.error=null;
        })
        .addCase(deleteEmployee.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

          
    }
})

export default employeeSlice.reducer;