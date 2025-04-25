import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/content';

// Get all content
export const getAllContent = createAsyncThunk(
  'content/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get content by type
export const getContentByType = createAsyncThunk(
  'content/getByType',
  async (type, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${type}`);
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create or update content
export const createOrUpdateContent = createAsyncThunk(
  'content/createOrUpdate',
  async (contentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('type', contentData.type);
      formData.append('title', contentData.title);
      
      if (contentData.subtitle) formData.append('subtitle', contentData.subtitle);
      if (contentData.description) formData.append('description', contentData.description);
      if (contentData.buttonText) formData.append('buttonText', contentData.buttonText);
      if (contentData.buttonLink) formData.append('buttonLink', contentData.buttonLink);
      
      // Append image file if it exists
      if (contentData.imageFile) {
        formData.append('image', contentData.imageFile);
      }
      
      const response = await axios.post(API_URL, formData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  content: [],
  currentContent: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all content
      .addCase(getAllContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content = action.payload;
      })
      .addCase(getAllContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get content by type
      .addCase(getContentByType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContentByType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentContent = action.payload;
      })
      .addCase(getContentByType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create or update content
      .addCase(createOrUpdateContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrUpdateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update content array if the content already exists
        const index = state.content.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.content[index] = action.payload;
        } else {
          state.content.push(action.payload);
        }
        
        state.currentContent = action.payload;
        state.message = 'Content updated successfully';
      })
      .addCase(createOrUpdateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = contentSlice.actions;
export default contentSlice.reducer;