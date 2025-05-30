const socket = io();
const user = document.cookie
  .split("; ")
  .find((row) => row.startsWith("username="))
  ?.split("=")[1];

if (!user) {
  alert("No estás registrado. Por favor ingresa un nombre de usuario.");
  window.location.href = "/register.html";
} else {
  socket.emit("register-user", user);
}

const send = document.querySelector("#send-message");
const allMessages = document.querySelector("#all-messages");

send.addEventListener("click", () => {
  const message = document.querySelector("#message").value.trim();
  if (message === "") return;
  socket.emit("message", message);
  document.querySelector("#message").value = "";
});

socket.on("message", ({ user, message }) => {
  const msg = document.createRange().createContextualFragment(`
    <div class="message d-flex mb-3">
      <div class="image-container me-3">
        <img src="/img/perfil.jpg" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
      </div>
      <div class="message-body flex-grow-1">
        <div class="user-info d-flex justify-content-between align-items-center mb-1">
          <span class="username fw-bold">${user}</span>
          <span class="time text-muted" style="font-size: 0.8rem;">Hace 1 minuto</span>
        </div>
        <p class="mb-0">${message}</p>
      </div>
    </div>
  `);
  allMessages.append(msg);
});


socket.on("register-error", (msg) => {
  alert(msg);
  window.location.href = "/register.html";
});
