import langdetect from "langdetect";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import notificationModel from "../models/notificationModel.js";
import { io } from "../index.js";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";

export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;
  try {
    let chatInfo = await chatModel.findById(chatId);
    const language = langdetect.detect(message)[0].lang;
    if (chatInfo.users.length > 1 && language=="en") {
      await new notificationModel({
        sender: req.rootUserId,
        chatId,
        users: chatInfo.users,
      }).save();
      let msg = await Message.create({
        sender: req.rootUserId,
        message,
        chatId,
      });
      msg = await (
        await msg.populate("sender", "name profilePic email")
      ).populate({
        path: "chatId",
        select: "chatName isGroup users",
        model: "Chat",
        populate: {
          path: "users",
          select: "name email profilePic",
          model: "User",
        },
      });
      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: msg,
      });
      res.status(200).json({
        langError:false,
        langMsg:msg
      });

      msg.chatId.users.forEach((user) => {
        if (user._id.toString() != req.rootUserId.toString()) {
          io.emit(JSON.stringify(user._id), true);
        }
      });
    }
    else{
      res.status(200).json({
        langError:true,
        langMsg:"What The Hell?!Are you weak in English?"
      })
    }
  } catch (error) {
    await chatModel.findByIdAndDelete(chatId);
    res.status(500).json({ error: error });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: "sender",
        model: "User",
        select: "name profilePic email",
      })
      .populate({
        path: "chatId",
        model: "Chat",
      });

    res.status(200).json(messages);
  } catch (error) {
    res.sendStatus(500).json({ error: error });
    console.log(error);
  }
};

export const reportMessage = async (req, res) => {
  const { reportId } = req.body;
  try {
    let message = await Message.findById(reportId).select(
      "sender message chatId-_id"
    );

    if (message.message) {
      const { data } = await axios.post(process.env.AI_URL, {
        message: message.message,
      });
      if (parseInt(data[0].label[0], 10) < 3) {
        let reportUserId = message.sender;
        let reportUser = await userModel
          .findById(reportUserId)
          .select("report");
        if (reportUser && reportUser.report > 5) {
          await userModel.findByIdAndDelete(reportUserId);
          res
            .status(200)
            .send("Reported User Has Been Deleted For Unusual Activity!");
        }
        await Message.findByIdAndDelete(reportId);
        reportUser.report += 1;
        await reportUser.save();
        const lastDoc = await Message.find({
          chatId: message.chatId,
        })
          .sort({ _id: -1 })
          .limit(1)
          .select("chatId");
        await chatModel.findByIdAndUpdate(lastDoc.chatId, {
          latestMessage: lastDoc._id,
        });
        res
          .status(200)
          .send(
            "Your Report Went Successfull.This Message Contains Harassment/Insult/Sexual Abuse & Violates Our Terms & Condition.So,We Have Remove The Message From This Chat!!"
          );
      } else {
        res.status(200).send("Sorry,Your Report Gonna Failed.!!");
      }
    }
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};
