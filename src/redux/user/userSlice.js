import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../services/Api';

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (payload, { rejectWithValue }) => {
    try {
      const { page, per_page, search, filter, sort, order_by } = payload;
      const res = await axiosApi.get("/users", {
        params: { page, per_page, search, filter, sort, order_by },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching users');
    }
  }
);
export const getRoles = createAsyncThunk(
  'users/getRoles',
  async (payload, { rejectWithValue }) => {
    try {
      const { page, per_page, search, filter, sort, order_by } = payload;
      const res = await axiosApi.get("/roles", {
        params: { page, per_page, search, filter, sort, order_by },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching roles');
    }
  }
);

export const userExport = createAsyncThunk(
  'users/userExport',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosApi.get("/users-export", {
        params: payload,
        responseType: 'blob', 
      });
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error exporting users');
    }
  }
);


export const addUser = createAsyncThunk(
  'users/addUser',
  async ({payload,  rejectWithValue ,cb}) => {
    try {
      const res = await axiosApi.post("/users", payload);
      cb();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error adding user');
    }
  }
);


export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data, cb }, { rejectWithValue }) => {
    try {
      const res = await axiosApi.post(`/users/${id}`, data); 
      if (cb) cb(); 
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error updating user');
    }
  }
);

export const deleteMultipleUsers = createAsyncThunk(
  "users/deleteMultipleUsers",
  async ({ ids, cb }, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/users-delete-multiple", { id: ids });
      if (cb) cb(); 
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error deleting users");
    }
  }
);

const initialState = {
  users: [],
  roles: [],
  userloading: false,
  rolesloading: false,
  addloading: false,
  error: null,
  userCount: 0,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getUsers.pending, (state) => {
        state.userloading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        
        state.userloading = false;
        state.users = action.payload?.data || [];
        state.userCount = action.payload?.total;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.userloading = false;
        state.error = action.payload;
      })

      .addCase(getRoles.pending, (state) => {
        state.rolesloading = true;
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.rolesloading = false;
        state.roles = action.payload;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.rolesloading = false;
        state.error = action.payload;
      })

      .addCase(userExport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userExport.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(userExport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.pending, (state) => {
        state.addloading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addloading = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addloading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.addloading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.addloading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.addloading = false;
        state.error = action.payload;
      })
      .addCase(deleteMultipleUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMultipleUsers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMultipleUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
