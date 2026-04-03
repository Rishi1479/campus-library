import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/admin/';

export const getDashboardStats = createAsyncThunk('admin/getStats', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'dashboard', config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getStudents = createAsyncThunk('admin/getStudents', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'students', config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getStudentDetails = createAsyncThunk('admin/getStudentDetails', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + `students/${id}`, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const approveStudent = createAsyncThunk('admin/approveStudent', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}students/${id}/approve`, {}, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    students: [],
    studentDetails: null, // Holds profile + array of issue records
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    resetAdminState: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => { state.isLoading = true; })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false; state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // Students List
      .addCase(getStudents.pending, (state) => { state.isLoading = true; })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.isLoading = false; state.students = action.payload;
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // Student Details
      .addCase(getStudentDetails.pending, (state) => { state.isLoading = true; })
      .addCase(getStudentDetails.fulfilled, (state, action) => {
        state.isLoading = false; state.studentDetails = action.payload;
      })
      .addCase(getStudentDetails.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // Approve Student
      .addCase(approveStudent.pending, (state) => { 
        // Do not set isLoading to true here, so the UI doesn't flash a loader
      })
      .addCase(approveStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.studentDetails && state.studentDetails.student._id === action.payload._id) {
            state.studentDetails.student = action.payload;
        }
      })
      .addCase(approveStudent.rejected, (state, action) => {
        state.isError = true; state.message = action.payload;
      });
  }
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
