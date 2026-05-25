let io;

export const initSocket = (serverIo) => {
  io = serverIo;

  io.on("connection", (socket) => {
    console.log(`user connected with ${socket.id}`);

    socket.on("joinShow", (showId) => {
      socket.join(showId);
      console.log(`user ${socket.id} joined room ${showId}`);
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected ${socket.id}`);
    });
  });
};

// 👇 YOU WILL USE THIS IN WORKER
export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};