import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { searchUsers } from "../apis/auth";

const initialState = {
  searchResults: [],
  isLoading: false,
  isError: false,
};

export const searchUserThunk = createAsyncThunk(
  "search/searchUser",
  async (search, { rejectWithValue }) => {
    try {
      const { data } = await searchUsers(search);
      return data;
    } catch (error) {
      toast.error("Something Went Wrong. Try Again!");
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchUserThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(searchUserThunk.fulfilled, (state, { payload }) => {
        state.searchResults = payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(searchUserThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default searchSlice.reducer;
