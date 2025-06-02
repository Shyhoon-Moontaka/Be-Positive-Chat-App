import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isLastMessage, timeSince } from "../utils/logics";
import { Tooltip } from "@chakra-ui/tooltip";
import { Avatar } from "@chakra-ui/avatar";
import "../pages/home.css";
import { fetchChats } from "../redux/chatsSlice";
import { toast } from "react-toastify";
import { reportMessage } from "../apis/messages";
function MessageHistory({ messages }) {
  const [openModal, setOpenModal] = useState(false);
  const [messageId, setMessageId] = useState("");
  const openChatModal = () => {
    setOpenModal(!openModal);
  };
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.activeUser);
  useEffect(() => {
    dispatch(fetchChats());
  }, [messages, dispatch]);

  const report = async () => {
    const res = await reportMessage({
      reportId: messageId,
    });
    if (res) {
      toast.info(res);
      dispatch(fetchChats());
    }
  };

  return (
    <div>
      <p className="pt-[20%] lg:pt-[4%]"></p>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div key={m._id}>
              <div
                className={`flex flex-col my-[4vh] ${
                  m.sender._id === activeUser.id
                    ? "ml-[30vw] lg:ml-[34vw]"
                    : "ml-[5vw]"
                }`}
              >
                <h1
                  className="text-[14px] flex flex-wrap w-[60vw] justify-center"
                  style={{
                    backgroundColor: `${
                      m.sender._id === activeUser.id ? "orange" : "black"
                    }`,
                    borderRadius: "0px 30px 0px 30px",
                    padding: "13px 23px",
                    color: `${
                      m.sender._id === activeUser.id ? "black" : "white"
                    }`,
                  }}
                >
                  {m.message}
                </h1>

                <div className="flex flex-row">
                  <Tooltip
                    label={m.sender?.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      style={{ width: "32px", height: "32px" }}
                      s
                      cursor="pointer"
                      name={m.sender?.name}
                      src={m.sender?.profilePic}
                      borderRadius="25px"
                    />
                  </Tooltip>
                  <p className="font-bold text-[12px]">
                    {timeSince(m.updatedAt)}
                  </p>
                  <p
                    onClick={() => {
                      setMessageId(m._id);
                      openChatModal();
                    }}
                    className="font-bold cursor-pointer text-[12px] ml-[18vw] lg:ml-[50vw]"
                  >
                    ***
                  </p>
                </div>

                <div
                  className={`${
                    openModal && messageId == m._id
                      ? "relative left-[30vw] lg:left-[55vw] z-10 w-fit flex flex-wrap rounded-[10%] px-2 py-2 bg-[white]"
                      : "hidden"
                  }`}
                >
                  <div className="flex flex-col justify-center items-center">
                    <p
                      className="cursor-pointer text-[10px] text-center border-2 my-1 rounded-[10px] inline p-1 border-[brown] font-bold"
                      onClick={report}
                    >
                      Report Message
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </ScrollableFeed>
      <p className="pb-[25%] lg:pb-[8%]"></p>
    </div>
  );
}

export default MessageHistory;
