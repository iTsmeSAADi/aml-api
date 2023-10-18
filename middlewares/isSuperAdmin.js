import errorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
export const isSuperAdmin = catchAsyncError(async (req, res, next) => {
  if (req.companyUser)
    return next(
      new errorHandler(
        "Logout first from company user and login as a super admin",
        401
      )
    );
  if (req.user.role !== "superAdmin")
    return next(new errorHandler("Only Super Admin can have the Access", 401));
  next();
});
