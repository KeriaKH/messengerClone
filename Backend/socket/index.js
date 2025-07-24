const { Server } = require("socket.io");
const User = require("../models/user");
const FriendRequest = require("../models/friendRequest");

let onlineUsers = new Map();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("user_connected", async (userId) => {
      const existingUser = onlineUsers.get(userId);
      if (existingUser) {
        const updatedUser = {
          ...existingUser,
          callSocket: socket.id,
          inCall: true,
        };
        onlineUsers.set(userId, updatedUser);
      } else {
        onlineUsers.set(userId, {
          mainSocket: socket.id,
          callSocket: null,
          inCall: false,
        });
      }
      io.emit("online_users", Array.from(onlineUsers.keys()));
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });
    });

    socket.on("send_request", async (data) => {
      const { sender, receiver } = data;
      try {
        console.log("đã gửi");
        const created = await FriendRequest.create(data);
        const newRequest = await FriendRequest.findById(created._id).populate(
          "sender",
          "name avatar"
        );

        const receiverSocketId = onlineUsers.get(receiver);
        if (receiverSocketId)
          io.to(receiverSocketId.mainSocket).emit(
            "friend_request_received",
            newRequest
          );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("send_message", async (data) => {
      const { messageData, receiver } = data;
      try {
        receiver.forEach((userId) => {
          const receiverSocketId = onlineUsers.get(userId);
          if (receiverSocketId) {
            io.to(receiverSocketId.mainSocket).emit(
              "message_received",
              messageData
            );
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("call_request", (to, from,type) => {
      const receiverSocketId = onlineUsers.get(to);
      if (!receiverSocketId) {
        console.log(`❌ User ${to} is not online.`);
        return;
      }
      io.to(receiverSocketId.mainSocket).emit("incoming_call", { from, type });
    });

    socket.on("call_end_before_accept", ({ from, to }) => {
      const receiverSocketId = onlineUsers.get(to);
      if (!receiverSocketId) {
        console.log(`❌ User ${to} is not online.`);
        return;
      }
      io.to(receiverSocketId.mainSocket).emit("call_ended_before_accept");
    });

    socket.on("accept_call", ({ from, to }) => {
      const receiverSocketId = onlineUsers.get(to);
      if (!receiverSocketId) {
        console.log(`❌ User ${to} is not online.`);
        return;
      }
      io.to(receiverSocketId.callSocket).emit(
        "call_accepted"
      );
    });

    socket.on("reject_call", ({ from, to }) => {
      const receiverSocketId = onlineUsers.get(to);
      if (!receiverSocketId) {
        console.log(`❌ User ${to} is not online.`);
        return;
      }
      io.to(receiverSocketId.callSocket).emit(
        "call_rejected"
      );
    });

    socket.on("end_call", ({ from, to }) => {
      const receiverSocketId = onlineUsers.get(to);
      if (!receiverSocketId) {
        console.log(`User ${to} is not online.`);
        return;
      }
      io.to(receiverSocketId.callSocket).emit("call_ended");
    });

    socket.on("disconnect", async () => {
      let disconnectedUserId = null;
      for (const [userId, userInfo] of onlineUsers.entries()) {
        if (
          userInfo.mainSocket === socket.id ||
          userInfo.callSocket === socket.id
        ) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        const userInfo = onlineUsers.get(disconnectedUserId);

        // ✅ If main socket disconnects, user goes offline
        if (userInfo.mainSocket === socket.id) {
          onlineUsers.delete(disconnectedUserId);
          io.emit("online_users", Array.from(onlineUsers.keys()));
          io.emit("user_offline", { userId: disconnectedUserId });

          try {
            await User.findByIdAndUpdate(disconnectedUserId, {
              isOnline: false,
              lastSeen: new Date(),
            });
            console.log(`✅ User ${disconnectedUserId} set offline`);
          } catch (err) {
            console.error("❌ Error updating user to offline:", err);
          }
        }
        // ✅ If only call socket disconnects, keep user online
        else if (userInfo.callSocket === socket.id) {
          userInfo.callSocket = null;
          userInfo.inCall = false;
          onlineUsers.set(disconnectedUserId, userInfo);
          console.log(
            `📞 Call socket disconnected for ${disconnectedUserId}, keeping online`
          );
        }
      }

      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
