import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/books/';

export const getBooks = createAsyncThunk('books/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createBook = createAsyncThunk('books/create', async (bookData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await axios.post(API_URL, bookData, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateBook = createAsyncThunk('books/update', async ({ id, bookData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await axios.put(API_URL + id, bookData, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteBook = createAsyncThunk('books/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + id, config);
    return id; // return id so we can filter it from state
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const bookSlice = createSlice({
  name: 'book',
  initialState: {
    books: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
  },
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => { state.isLoading = true; })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(createBook.pending, (state) => { state.isLoading = true; })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(updateBook.pending, (state) => { state.isLoading = true; })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; 
        state.books = state.books.map(b => b._id === action.payload._id ? action.payload : b);
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(deleteBook.pending, (state) => { state.isLoading = true; })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.books = state.books.filter(b => b._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      });
  }
});

export const { reset } = bookSlice.actions;
export default bookSlice.reducer;
