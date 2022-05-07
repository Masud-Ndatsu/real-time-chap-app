const users = [];

exports.addUsers = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate the data
  if (!username || !room) {
    return {
      error: "Username and room is required!",
    };
  }

  // Checking for existing User
  const existingUsers = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // validate user
  if (existingUsers) {
    return {
      error: "Username already in use",
    };
  }

  // store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

exports.getUser = (id) => {
  return users.find((user) => user.id === id);
};

exports.getUserInRoom = (room) => {
  return users.filter((user) => user.room === room);
};
