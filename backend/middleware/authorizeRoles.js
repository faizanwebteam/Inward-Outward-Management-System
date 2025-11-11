import asyncHandler from "express-async-handler";

export const authorizeRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(
        `Role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  });
};