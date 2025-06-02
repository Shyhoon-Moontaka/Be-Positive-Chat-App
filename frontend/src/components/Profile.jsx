import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setShowProfile } from "../redux/profileSlice";
import { IoMdLogOut } from "react-icons/io";
import InputEdit from "./profile/InputEdit";
import { updateUser } from "../apis/auth";
import { toast } from "react-toastify";
import { setUserNameAndBio } from "../redux/activeUserSlice";
function Profile(props) {
  const dispatch = useDispatch();
  const { showProfile } = useSelector((state) => state.profile);
  const activeUser = useSelector((state) => state.activeUser);
  const [formData, setFormData] = useState({
    name: activeUser.name,
    bio: activeUser.bio,
    profilePic: activeUser.profilePic,
  });
  const logoutUser = () => {
    toast.success("Logout Successfull!");
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const submit = async () => {
    let verify = confirm("Do you want to Update it?");
    if (verify) {
      dispatch(setUserNameAndBio(formData));
      toast.success("Updated!");
      await updateUser(activeUser.id, formData);
    } else {
      toast.warn("Cancled");
    }
    setFormData({
      name: activeUser.name,
      bio: activeUser.bio,
      profilePic: activeUser.profilePic,
    });
  };
  return (
    <div
      style={{ transition: showProfile ? "3s ease-in-out" : "" }}
      className={props.className}
    >
      <div className="absolute  w-[100%]">
        <div className="bg-[#166e48] border-1 rounded-lg h-[8vh] pt-[2%] lg:pt-[1%] lg:pb-[3%] lg:pl-[1%]">
          <button
            onClick={() => dispatch(setShowProfile(false))}
            className="flex items-center"
          >
            <IoArrowBack
              style={{ color: "#fff", width: "30px", height: "20px" }}
            />
            <h6 className="text-[16px] text-[#fff] font-semibold">Profile</h6>
          </button>
        </div>
        <div className=" pt-5">
          <div className="flex items-center flex-col">
            <img
              className="w-[80px] h-[80px] lg:w-[150px] lg:h-[150px] rounded-[100%] -ml-5 border-[5px] border-black border-solid"
              src={
                activeUser.profilePic == ""
                  ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  : activeUser.profilePic
              }
              alt=""
            />
          </div>

          <p className="text-[12px] text-[#166e48] font-medium tracking-wide ml-4 mt-6">
            Your Name
          </p>

          <InputEdit
            type="name"
            handleChange={handleChange}
            input={formData.name}
            handleSubmit={submit}
          />

          <p className="text-[12px] text-[#166e48] font-medium tracking-wide ml-4 mt-6">
            Your Bio
          </p>

          <InputEdit
            type="bio"
            handleChange={handleChange}
            input={formData.bio}
            handleSubmit={submit}
          />

          <p className="text-[12px] text-[#166e48] font-medium tracking-wide ml-4 mt-4">
            Your Profile Pic
          </p>

          <InputEdit
            type="profilePic"
            handleChange={handleChange}
            input={formData.profilePic}
            handleSubmit={submit}
          />
        </div>

        <div
          onClick={logoutUser}
          className="flex items-center justify-center my-[3vh] lg:mt-[1vh] lg:mb-[1%] cursor-pointer shadow-2xl"
        >
          <IoMdLogOut className="text-[#e44d4d] w-[27px] h-[23px]" />
          <h6 className="text-[17px] text-[#e44d4d] font-semibold">Logout</h6>
        </div>
      </div>
    </div>
  );
}

export default Profile;
