import { asyncErrorHandler, Error } from "express-error-catcher";

import jwt from "jsonwebtoken";

const auth = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.tkn;

  if (isNull(token)) throw new Error("Authentication failed", 401);

  let data;
  try {
    data = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    // Expired / tampered / malformed token → clean 401 instead of a 500.
    throw new Error("Authentication failed", 401);
  }

  req.user = { _id: data.id, ...data };

  next();
});

export default auth;
