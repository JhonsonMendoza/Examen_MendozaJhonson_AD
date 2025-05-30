module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer);

  const connectedUsers = new Set();

  io.on("connection", (socket) => {
    // Cuando el cliente pide validar usuario
    socket.on("check-user", (username) => {
      const isAvailable = !connectedUsers.has(username);
      socket.emit("check-user-response", isAvailable);
    });

    socket.on("register-user", (username) => {
      if (connectedUsers.has(username)) {
        socket.emit("register-error", "El usuario ya está en uso.");
        socket.disconnect();
        return;
      }
      connectedUsers.add(username);
      socket.username = username;
      socket.emit("register-success");

      // Escuchar mensajes para emitirlos a todos
      socket.on("message", (message) => {
        io.emit("message", { user: socket.username, message });
      });

      socket.on("disconnect", () => {
        connectedUsers.delete(socket.username);
      });
    });
  });
};
