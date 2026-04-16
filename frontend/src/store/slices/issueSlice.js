import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/issues/`;

// Issue a book (Admin only)
export const issueBook = createAsyncThunk('issues/issueBook', async (issueData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, issueData, config);
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Request a book (Student only)
export const requestBook = createAsyncThunk('issues/requestBook', async (requestData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'request', requestData, config);
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Approve a book request (Admin only)
export const approveIssueRequest = createAsyncThunk('issues/approveIssueRequest', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + `${id}/approve`, {}, config);
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Return a book (Admin only)
export const returnBook = createAsyncThunk('issues/returnBook', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + `${id}/return`, {}, config);
    return response.data; // Returned issueRecord with fines
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get all issues (Admin only)
export const getIssues = createAsyncThunk('issues/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get my issues (Student view)
export const getMyIssues = createAsyncThunk('issues/getMyIssues', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'myissues', config);
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const issueSlice = createSlice({
  name: 'issue',
  initialState: {
    issues: [], // Used for both admin (all) and student (my issues)
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
  },
  reducers: {
    resetIssueState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // getIssues (Admin)
      .addCase(getIssues.pending, (state) => { state.isLoading = true; })
      .addCase(getIssues.fulfilled, (state, action) => {
        state.isLoading = false; state.issues = action.payload; state.isSuccess = true;
      })
      .addCase(getIssues.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // getMyIssues (Student)
      .addCase(getMyIssues.pending, (state) => { state.isLoading = true; })
      .addCase(getMyIssues.fulfilled, (state, action) => {
        state.isLoading = false; state.issues = action.payload; state.isSuccess = true;
      })
      .addCase(getMyIssues.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // issueBook
      .addCase(issueBook.pending, (state) => { state.isLoading = true; })
      .addCase(issueBook.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.issues.unshift(action.payload);
      })
      .addCase(issueBook.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // returnBook
      .addCase(returnBook.pending, (state) => { state.isLoading = true; })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.issues = state.issues.map(issue => issue._id === action.payload._id ? action.payload : issue);
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // requestBook
      .addCase(requestBook.pending, (state) => { state.isLoading = true; })
      .addCase(requestBook.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; 
        state.issues.unshift(action.payload);
      })
      .addCase(requestBook.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // approveIssueRequest
      .addCase(approveIssueRequest.pending, (state) => { state.isLoading = true; })
      .addCase(approveIssueRequest.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.issues = state.issues.map(issue => issue._id === action.payload._id ? action.payload : issue);
      })
      .addCase(approveIssueRequest.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      });
  }
});

export const { resetIssueState } = issueSlice.actions;
export default issueSlice.reducer;
