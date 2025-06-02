import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat, fetchChats } from "../redux/chatsSlice";
import { formatDateDynamic, getChatName, getChatPhoto } from "../utils/logics";
import NoContacts from "./ui/NoContacts";
import { removeUser } from "../apis/chat";
import { toast } from "react-toastify";

function Contacts() {
  const { chats, activeChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.activeUser);
  const [openModal, setOpenModal] = useState(false);
  const [openModalId, setOpenModalId] = useState("");

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const openChatModal = () => {
    setOpenModal(!openModal);
  };

  const leaveGroup = async () => {
    let verify = confirm("Are you sure?");
    if (verify) {
      const res = await removeUser({
        chatId: openModalId,
        userId: activeUser.id,
      });
      if (res._id) {
        dispatch(fetchChats());
        setOpen(false);
        toast.success("You are leaving from this chat!!");
      }
    } else {
      toast.info("Calceled!!");
    }
  };

  return (
    <>
      <div
        className={`w-[100%] lg:flex lg:flex-col overflow-y-scroll h-[77vh] lg:pb-[20%]`}
      >
        {chats?.length > 0 ? (
          chats?.map((e) => {
            return (
              <div
                key={e._id}
                className={`flex items-center justify-between ${
                  activeChat._id === e._id ? "bg-[#fafafa]" : "bg-[#fff]"
                } cursor-pointer  py-3 px-4`}
              >
                <div
                  className="flex items-center gap-x-3 sm:gap-x-1 md:gap-x-3"
                  onClick={() => {
                    dispatch(setActiveChat(e));
                  }}
                >
                  <img
                    className="w-12 h-12  sm:w-12 sm:h-12 rounded-[30px] shadow-lg object-cover border-[3px]"
                    src={
                      getChatPhoto(e, activeUser) ||
                      "https://cdn-icons-png.flaticon.com/512/9790/9790561.png"
                    }
                    alt=""
                  />
                  <div>
                    <h5 className="text-[13.6px] sm:text-[16px] text-[#2b2e33] font-bold">
                      {getChatName(e, activeUser)}
                    </h5>
                    <p className="text-[13.6px] sm:text-[13.5px] font-medium text-[#56585c] ">
                      {" "}
                      {e.latestMessage?.message.length > 30
                        ? e.latestMessage?.message.slice(0, 30) + "..."
                        : e.latestMessage?.message}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-y-[8px]">
                  <p
                    onClick={() => {
                      setOpenModalId(e._id);
                      openChatModal();
                    }}
                    className="font-bold"
                  >
                    ...
                  </p>
                  <div
                    className={`${
                      openModal && openModalId == e._id
                        ? "relative left-1 z-10 w-fit flex flex-wrap rounded-[10%] px-2 py-2 bg-[white]"
                        : "hidden"
                    }`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <p
                        className="text-[10px] text-center border-2 my-1 rounded-[10px] inline p-1 border-[red] font-bold"
                        onClick={leaveGroup}
                      >
                        Leave Chat
                      </p>
                    </div>
                  </div>
                  <p className="text-[12.4px] sm:text-[12px]  font-bold text-[black]">
                    {formatDateDynamic(e.updatedAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <NoContacts />
        )}
      </div>
    </>
  );
}

export default Contacts;
