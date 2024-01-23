import mongoose from "mongoose";
import { VaultApi } from "../app.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { MaunalEmailVerification } from "../models/ManualEmailVerification.js";
import { combineArrays } from "../utils/combineTwoArrays.js";
import { QuickDocumentScan } from "../models/QuickDocumentScan.js";


export const getAllScreenings = catchAsyncError(async (req, res, next) => {
  // let result = await VaultApi.list({
  //   filter: ["docupass_success=1"],
  //   orderby: "firstName",
  //   sort: "ASC",
  //   limit: 100,
  //   offset: 0,
  // });
  // let vaultResultArray = result.items; //result from vault (array) successful
  // const toObjectId = new Set(
  //   vaultResultArray.map((item) => item.docupass_customid)
  // ); //ids in string from vault
  // const usersResult = await MaunalEmailVerification.find({
  //   _id: { $in: [...toObjectId].map((id) => new mongoose.Types.ObjectId(id)) },
  // }).lean(); // find the successful response in the local data base using the IDs from vault.
  // //console.log(usersResult);
  // const extractedIds = new Set(usersResult.map((item) => item._id.toString())); //extract the ids from the result.
  // const resultArray = vaultResultArray.filter((obj) =>
  //   extractedIds.has(obj.docupass_customid)
  // ); //filter the result of vault to give only the successful that is equal to local db IDs.
  // //console.log(resultArray);
  // const combinedArray = combineArrays(usersResult, resultArray); //function to combine two arrays (utils)
  // // console.log(combinedArray);

  //-----------------------------------quick document scan portion----------------------------------
  //get data from vault based on authentication value.
  const docuPassEntries = await QuickDocumentScan.find();
  console.log(docuPassEntries);

  res.status(200).json({
    success: true,
    message: "get all screenings",
    // emailIdentityVerificationResponse: combinedArray,
    docscansandforensics: docuPassEntries,
  });
});
