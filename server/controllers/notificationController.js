import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

export const getNotification = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({
        users: req.rootUserId,
        sender: { $ne: req.rootUserId },
        snooze: { $nin: [req.rootUserId] },
      })
      .populate({
        path: "chatId",
        select: "chatName isGroup users",
        model: "Chat",
        populate: {
          path: "users",
          select: "name email profilePic",
          model: "User",
        },
      })
      .sort({ updatedAt: -1 });
    let seen = new Set();
    let uniqueNotifications = notifications.filter((n) => {
      if (seen.has(n.chatId._id.toString())) return false;
      seen.add(n.chatId._id.toString());
      return true;
    });
    const finalNotifications = await userModel.populate(uniqueNotifications, {
      path: "latestMessage.sender",
      select: "name email profilePic",
    });
    res.status(200).json(finalNotifications);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { Id, userId } = req.params;

    if (!Id || !userId) {
      return res
        .status(400)
        .json({ message: "Notification ID & UserId is required" });
    }

    await notificationModel.findByIdAndUpdate(Id, {
      $push: { snooze: userId },
    });

    return res.status(200).json({
      message: "Notification Deleted Successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
