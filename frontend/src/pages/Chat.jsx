import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Model from "../components/Model";
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs";
import { fetchMessages, sendMessage } from "../apis/messages";
import { useEffect } from "react";
import MessageHistory from "../components/MessageHistory";
import "./home.css";
import { fetchChats, setActiveChat } from "../redux/chatsSlice";
import Loading from "../components/ui/Loading";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getChatName, timeSince } from "../utils/logics";
import { validUser } from "../apis/auth";
import { Socket } from "../App";

function Chat(props) {
  const { activeChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const activeUser = useSelector((state) => state.activeUser);

  const keyDownFunction = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && message) {
      setMessage("");
      const data = await sendMessage({
        chatId: activeChat._id,
        message,
      });
      setMessages([...messages, data]);
      dispatch(fetchChats());
    }
  };

  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat) {
        setLoading(true);
        const data = await fetchMessages(activeChat._id);
        setMessages(data);
        setLoading(false);
      }
    };
    fetchMessagesFunc();
    Socket.on(JSON.stringify(activeUser.id), async (data) => {
      if (data) {
        fetchMessagesFunc();
        dispatch(fetchChats());
      }
    });
  }, [activeChat]);

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.user) {
        window.location.href = "/";
      }
    };
    isValid();
  }, []);

  if (loading) {
    return (
      <div className={props.className}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {activeChat ? (
        <div className="w-[100vw] lg:block lg:w-[100%] h-[100vh]">
          <div className="flex px-5 w-[100%] mt-[3vh] fixed">
            <div className="flex flex-col flex-wrap pl-1 lg:pl-5">
              <div className="flex flex-row">
                <button
                  className="cursor-pointer font-bold text-[20px] lg:text-[25px] mr-[10%] text-[green]"
                  title="Go Back To Home..."
                  onClick={() => {
                    dispatch(setActiveChat(""));
                  }}
                >
                  &lt;&lt;
                </button>
                <h5 className="text-[17px] text-[#2b2e33] font-bold">
                  {getChatName(activeChat, activeUser)}
                  <p className="text-[11px] text-[blue] font-bold">
                    Last Active {timeSince(activeChat.updatedAt)}
                  </p>
                </h5>
              </div>
            </div>

            <div className="absolute right-0 lg:mr-[3vw] mr-[5vw]">
              <Model />
            </div>
          </div>

          <MessageHistory className={"lottie-container"} messages={messages} />

          <div className="flex justify-center items-center">
            <div className="absolute bottom-0 fixed w-[100vw] lg:w-[70vw]">
              {showPicker && (
                <Picker
                  data={data}
                  onEmojiSelect={(e) => setMessage(message + e.native)}
                />
              )}
              <div className="">
                <div className="border-[1px] border-[gray] pl-4 py-3 rounded-t-[10px]">
                  <form
                    onKeyDown={(e) => keyDownFunction(e)}
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      className="focus:outline-0 w-[100%] overflow-y-scroll"
                      type="text"
                      name="message"
                      placeholder="Enter message"
                      value={message}
                    />
                  </form>
                </div>

                <div className="border-t-[black] border-[gray] border-2 px-6 py-3 rounded-b-[10px]">
                  <div className="flex justify-between items-start">
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowPicker(!showPicker)}
                    >
                      {showPicker ? (
                        <BsFillEmojiSmileFill className="w-[20px] h-[20px] text-[#ffb02e] border-[black]" />
                      ) : (
                        <BsEmojiSmile className="w-[20px] h-[20px]" />
                      )}
                    </div>
                    <button
                      onClick={(e) => keyDownFunction(e)}
                      className="bg-[green] border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-[white] font-bold rounded-[7px] -mt-1"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden z-0 lg:flex lg:absolute lg:top-[40vh] lg:left-[50%] flex flex-col items-center justify-center gap-y-3">
          <img
            className="w-[50px] h-[50px] rounded-[25px]"
            alt="User profile"
            src={
              activeUser.profilePic
                ? activeUser.profilePic
                : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
          />
          <h3 className="text-[#111b21] text-[20px] text-center font-medium">
            Welcome{" "}
            <strong className="text-[#166e48] text-[19px] font-bold">
              {" "}
              {activeUser.name}
            </strong>{" "}
            to JUST'ian Society.
          </h3>
        </div>
      )}
    </>
  );
}

export default Chat;
