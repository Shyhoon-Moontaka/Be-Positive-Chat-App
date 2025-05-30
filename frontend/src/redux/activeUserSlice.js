import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  profilePic: "",
  bio: "",
  name: "",
};

const activeUserSlice = createSlice({
  name: "activeUser",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      const { id, email, profilePic, bio, name } = action.payload;
      state.id = id;
      state.email = email;
      state.profilePic = profilePic;
      state.bio = bio;
      state.name = name;
    },
    setUserNameAndBio: (state, action) => {
      const { name, bio, profilePic } = action.payload;
      state.name = name;
      state.bio = bio;
      state.profilePic = profilePic;
    },
  },
});

export const { setActiveUser, setUserNameAndBio } = activeUserSlice.actions;
export default activeUserSlice.reducer;
