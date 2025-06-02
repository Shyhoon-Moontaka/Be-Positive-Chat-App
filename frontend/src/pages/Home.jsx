import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, validUser } from "../apis/auth";
import { setActiveUser } from "../redux/activeUserSlice";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import { BiNotification } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { setShowNotifications, setShowProfile } from "../redux/profileSlice";
import Chat from "./Chat";
import Profile from "../components/Profile";
import { acessCreate } from "../apis/chat.js";
import "./home.css";
import { fetchChats, setNotifications } from "../redux/chatsSlice";
import { getSender } from "../utils/logics";
import { setActiveChat } from "../redux/chatsSlice";
import Group from "../components/Group";
import Contacts from "../components/Contacts";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import Search from "../components/group/Search";
import {
  fetchAllNotifications,
  removeNotification,
} from "../apis/notifications.js";
import { Badge } from "@mui/material";
import { Socket } from "../App.jsx";

function Home() {
  const dispatch = useDispatch();
  const { showProfile, showNotifications } = useSelector(
    (state) => state.profile
  );
  const activeUser = useSelector((state) => state.activeUser);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { notifications, activeChat } = useSelector((state) => state.chats);
  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };
  const handleClick = async (e) => {
    await acessCreate({ userId: e._id });
    dispatch(fetchChats());
    setSearch("");
  };
  useEffect(() => {
    const searchChange = async () => {
      if (!search) return null;
      setIsLoading(true);
      const { data } = await searchUsers(search);
      setSearchResults(data);
      setIsLoading(false);
    };
    searchChange();
  }, [search]);

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();

      const user = {
        id: data?.user?._id,
        email: data?.user?.email,
        profilePic: data?.user?.profilePic,
        bio: data?.user?.bio,
        name: data?.user?.name,
      };
      dispatch(setActiveUser(user));
    };
    isValid();
  }, [dispatch]);

  useEffect(() => {
    const getNotification = async () => {
      const data = await fetchAllNotifications();
      dispatch(setNotifications(data));
    };
    getNotification();
    Socket.on(JSON.stringify(activeUser.id), async (data) => {
      if (data) {
        getNotification();
      }
    });
  }, []);

  return (
    <>
      <div className="h-[100vh] w-[98vw] mx-auto">
        <div>
          {!showProfile ? (
            <div
              className={`h-[100%] bg-[#ffff] border-r-2 relative lg:w-[28%] w-[100vw] ${
                activeChat ? "hidden" : "block"
              }`}
            >
              <div className="h-[61px] px-4">
                <div className="flex">
                  <a
                    className="flex flex-col justify-center items-center relative  -top-4 block h-[90px]"
                    href="/chats"
                  >
                    <h3 className="text-[20px] text-[#1f2228] font-body font-extrabold tracking-wider">
                      Be Positive
                    </h3>
                    <h3 className="text-[10px] text-[#1f2228] font-body font-extrabold tracking-wider">
                      Powered By Shyhoon
                    </h3>
                  </a>
                </div>
                <div className="absolute top-4 right-5 flex items-center gap-x-3">
                  <button
                    onClick={() => {
                      dispatch(setShowNotifications(!showNotifications));
                    }}
                    title="Notifications"
                  >
                    <NotificationBadge
                      effect={Effect.SCALE}
                      style={{
                        width: "15px",
                        height: "15px",
                        fontSize: "9px",
                        padding: "4px 2px 2px 2px",
                      }}
                    />

                    {showNotifications ? (
                      <RiNotificationBadgeFill
                        style={{
                          width: "25px",
                          height: "25px",
                          color: "#319268",
                        }}
                      />
                    ) : (
                      <Badge badgeContent={notifications?.length} color="error">
                        <BiNotification
                          style={{
                            color: "#319268",
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </Badge>
                    )}
                  </button>

                  <div
                    className={`${
                      showNotifications
                        ? "overflow-y-scroll absolute top-10 -left-44 z-10 w-[240px] border-2 rounded-[10%] px-4 py-2 shadow-10xl bg-[black]"
                        : "hidden"
                    }`}
                  >
                    <div className="text-[13px] text-[white]">
                      {!notifications?.length && "No new messages"}
                    </div>
                    {notifications.map((e, index) => {
                      return (
                        <div
                          onClick={() => {
                            dispatch(setActiveChat(e.chatId));
                            dispatch(
                              setNotifications(
                                notifications.filter((data) => data !== e)
                              )
                            );
                            removeNotification(e._id, activeUser.id);
                            dispatch(fetchChats());
                          }}
                          key={index}
                          className="text-[13px] text-[white] text-center p-1 cursor-pointer font-bold border-b-1 border-b-[white]"
                        >
                          {e.chatId?.isGroup
                            ? `* New Message in ${e.chatId?.chatName}`
                            : `New Message from ${getSender(
                                activeUser,
                                e.chatId?.users
                              )}`}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => dispatch(setShowProfile(true))}
                    className="flex items-center gap-x-1 relative"
                  >
                    <img
                      className="w-[30px] h-[30px] rounded-[50%] border-3"
                      src={
                        activeUser.profilePic
                          ? activeUser.profilePic
                          : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      }
                      alt=""
                    />
                    <IoIosArrowDown
                      style={{
                        color: "#616c76",
                        height: "14px",
                        width: "14px",
                      }}
                    />
                  </button>
                </div>
              </div>

              <div>
                <div className="relative pt-2 px-4">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input
                      onChange={handleSearch}
                      className="text-[15px] w-[90%] bg-[#f6f6f6] text-[#111b21] pl-[5%] py-1 mx-[5%] rounded-[9px] outline-2"
                      type="text"
                      name="search"
                      placeholder="🔎 Search"
                    />
                  </form>

                  <Group />

                  <div
                    style={{ display: search ? "block" : "none" }}
                    className="h-[100vh] mt-[1%] absolute z-10 w-[100%] left-[0px] top-[70px] bg-[#fff] flex flex-col gap-y-3 pt-3 px-4"
                  >
                    <Search
                      searchResults={searchResults}
                      isLoading={isLoading}
                      handleClick={handleClick}
                      search={search}
                    />
                  </div>
                </div>

                <Contacts />
              </div>
            </div>
          ) : (
            <Profile className="w-[100%] z-1 h-[100vh] bg-[#fafafa] shodow-xl relative overflow-x-hidden" />
          )}
          <Chat />
        </div>
      </div>
    </>
  );
}

export default Home;
