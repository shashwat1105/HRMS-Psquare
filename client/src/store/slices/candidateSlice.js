import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";
import toast from "react-hot-toast";


export const addCandidate=createAsyncThunk('candidate/add',async(userData,{rejectWithValue})=>{
    try {
        const response=await instance.post('/candidate/add', userData,{
            withCredentials:true,   
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        });
        if(!response){
            throw new Error('Candidate creation failed!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Candidate creation failed!";
            return rejectWithValue(message);
          }
          return rejectWithValue("Candidate creation failed!");
    }
    }   
)
export const getAllCandidates=createAsyncThunk('candidate/getAll',async(_, {rejectWithValue})=>{
    try {
        const response=await instance.get('/candidate/getAll',{
            withCredentials:true,
        });
        if(!response){
            throw new Error('Failed to fetch candidates!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Failed to fetch candidates!";
            return rejectWithValue(message);
          }
          return rejectWithValue("Failed to fetch candidates!");
    }
    }   
)
export const updateCandidateStatus=createAsyncThunk('candidate/updateStatus',async({id, status}, {rejectWithValue})=>{
    try {
        const response=await instance.patch(`/candidate/update/${id}`, {status},{
            withCredentials:true,
        });
        if(!response){
            throw new Error('Failed to update candidate status!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Failed to update candidate status!";
            return rejectWithValue(message);
          }
          return rejectWithValue("Failed to update candidate status!");
    }
    }   
)
// export const downloadResume=createAsyncThunk('candidate/download',async(id, {rejectWithValue})=>{
//     try {
//         const response=await instance.get(`/candidate/${id}/resume`,{
//             withCredentials:true,
//         });
//         if(!response){
//             throw new Error('Failed to download resume!');
//         }
//         return response.data;
//     } catch (err) {
//         if (err.response) {
//             const message = err.response.data.message || "Failed to download resume!";
//             return rejectWithValue(message);
//           }
//           return rejectWithValue("Failed to download resume!");
//     }
//     }   
// )

const deleteCandidate=createAsyncThunk('candidate/delete',async(id, {rejectWithValue})=>{
    try {
        const response=await instance.delete(`/candidate/${id}`,{
            withCredentials:true,
        });
        if(!response){
            throw new Error('Failed to delete candidate!');
        }
        return response.data;
    } catch (err) {
        if (err.response) {
            const message = err.response.data.message || "Failed to delete candidate!";
            return rejectWithValue(message);
          }
          return rejectWithValue("Failed to delete candidate!");
    }
    }
)

const candidateSlice=createSlice({
    name:'candidate',
    initialState:{
        candidates:[],
        loading:false,
        error:null,
        success:false,
    },
    reducers:{
        clearState:(state)=>{
            state.loading=false;
            state.error=null;
            state.success=false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(addCandidate.pending,(state)=>{
            state.loading=true;
        })
        .addCase(addCandidate.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=true;
            state.candidates = [action.payload.data, ...state.candidates];
            toast.success(action.payload.message || "Candidate added successfully!");
        })
        .addCase(addCandidate.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getAllCandidates.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getAllCandidates.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=true;
            state.candidates=action.payload.data;
            toast.success(action.payload.message || "Candidates fetched successfully!");
        })
        .addCase(getAllCandidates.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(updateCandidateStatus.pending,(state)=>{
            state.loading=true;
        })
        .addCase(updateCandidateStatus.fulfilled,(state,action)=>{
            state.loading=false;
            const index=state.candidates.findIndex((candidate)=>(candidate._id===action.payload.data._id));
            if(index!==-1){
                state.candidates[index]=action.payload.data;
            }
            state.success=true;
            toast.success(action.payload.message || "Candidate status updated successfully!");
        })
        .addCase(updateCandidateStatus.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        // .addCase(downloadResume.pending,(state)=>{
        //     state.loading=true;
        // })
        // .addCase(downloadResume.fulfilled,(state)=>{
        //     state.loading=false;
        //     state.success=true;
        // })

        // .addCase(downloadResume.rejected,(state,action)=>{
        //     state.loading=false;
        //     state.error=action.payload;
        // })
        .addCase(deleteCandidate.pending,(state)=>{
            state.loading=true;
        })
        .addCase(deleteCandidate.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=true;
            state.candidates=state.candidates.filter((candidate)=>(candidate._id!==action.payload.data._id));
       
            toast.success(action.payload.message || "Candidate deleted successfully!");})

        .addCase(deleteCandidate.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
})
export const {clearState}=candidateSlice.actions;
export default candidateSlice.reducer;