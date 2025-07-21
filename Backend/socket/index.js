const { Server } = require("socket.io");
const User = require("../models/user");
const FriendRequest = require("../models/friendRequest");

let onlineUsers = new Map();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000  ",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("user_connected", async (userId) => {
      onlineUsers.set(userId, socket.id);
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
          io.to(receiverSocketId).emit("friend_request_received", newRequest);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", async () => {
      const disconnectedUserId = [...onlineUsers.entries()].find(
        ([_, id]) => id === socket.id
      )?.[0];

      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        io.emit("online_users", Array.from(onlineUsers.keys()));
      }
      io.emit("user_offline", {
        userId: disconnectedUserId,
      });
      try {
        await User.findByIdAndUpdate(disconnectedUserId, {
          isOnline: false,
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error("❌ Error updating user to offline:", err);
      }
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
