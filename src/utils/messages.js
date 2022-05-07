exports.generateMessage = (text, username) => {
  return {
    text,
    createdAt: new Date().getTime(),
    username,
  };
};

exports.generateLocation = (url, username) => {
  return {
    url,
    createdAt: new Date().getTime(),
    username,
  };
};
