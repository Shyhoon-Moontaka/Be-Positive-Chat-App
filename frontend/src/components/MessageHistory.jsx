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
  }, [messages]);

  const report = async () => {
    const res = await reportMessage({
      reportId: messageId,
    });
    if (res) {
      toast.info(res);
    }
    dispatch(fetchChats());
  };

  return (
    <div className="overflow-y-scroll">
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div className="flex items-center gap-x-[6px]" key={m._id}>
              {(isSameSender(messages, m, i, activeUser.id) ||
                isLastMessage(messages, i, activeUser.id)) && (
                <Tooltip
                  label={m.sender?.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    style={{ width: "32px", height: "32px" }}
                    mt="43px"
                    mr={1}
                    cursor="pointer"
                    name={m.sender?.name}
                    src={m.sender?.profilePic}
                    borderRadius="25px"
                    marginLeft="3%"
                  />
                </Tooltip>
              )}
              <div
                className="relative w-[30%] my-[1%]"
                style={{
                  left: `${m.sender._id === activeUser.id ? "70%" : "3%"}`,
                }}
              >
                <h1
                  className="text-[14px] flex flex-wrap"
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

                <div className="flex flex-row justify-between px-[8%] py-[2%]">
                  <p className="font-bold text-[12px]">
                    {timeSince(m.updatedAt)}
                  </p>
                  <p
                    onClick={() => {
                      setMessageId(m._id);
                      openChatModal();
                    }}
                    className="font-bold cursor-pointer text-[12px]"
                  >
                    ***
                  </p>
                </div>

                <div
                  className={`${
                    openModal && messageId == m._id
                      ? "relative left-[60%] z-10 w-fit flex flex-wrap rounded-[10%] px-2 py-2 bg-[white]"
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
      <p className="mb-[18%]"></p>
    </div>
  );
}

export default MessageHistory;
