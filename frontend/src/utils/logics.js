import moment from "moment";
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export function timeSince(date) {
  return moment(date).fromNow();
}
export function formatDateDynamic(dateString) {
  const date = moment(dateString);
  const now = moment();

  if (date.isSame(now, "day")) {
    return date.format("h:mm A");
  } else if (date.isSame(now, "week")) {
    return date.format("dddd");
  } else if (date.isSame(now, "year")) {
    return date.format("MMM D");
  } else {
    return date.format("MMM, YYYY");
  }
}
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
export const getSender = (activeUser, users) => {
  return activeUser.id === users[0]._id ? users[1].name : users[0].name;
};
export const getChatName = (activeChat, activeUser) => {
  return activeChat?.isGroup
    ? activeChat?.chatName
    : activeChat?.users[0]?._id === activeUser.id
    ? activeChat?.users[1]?.name
    : activeChat?.users[0]?.name;
};
export const getChatPhoto = (activeChat, activeUser) => {
  return activeChat?.isGroup
    ? activeChat.photo
    : activeChat?.users[0]?._id === activeUser?.id
    ? activeChat?.users[1]?.profilePic
    : activeChat?.users[0]?.profilePic;
};
