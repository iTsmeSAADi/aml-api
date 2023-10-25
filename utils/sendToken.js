export const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
  };
  user.token = token;
  var data = {
    success: true,
    message,
    user,
  };
  console.log(data);
  res.status(statusCode).cookie("token", token, options).json(data);
};
