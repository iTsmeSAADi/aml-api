import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { DocuPass, amlAPI, VaultApi, CoreAPI } from "../app.js";
import { Company } from "../models/Company.js";
import { MaunalEmailVerification } from "../models/ManualEmailVerification.js";
import { docuPassFeatures } from "../utils/IDAnalyzer/docuPassFeatures.js";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";
import { CoreAPIFeatures } from "../utils/IDAnalyzer/coreAPIFeatures.js";
import { QuickDocumentScan } from "../models/QuickDocumentScan.js";
export const quickNameSearch = catchAsyncError(async (req, res, next) => {
  try {
    const {
      firstName,
      surname,
      dob,
      country,
      idNumber = "xxxxx",
      gender,
    } = req.body;
    amlAPI.setAMLDatabase("");
    amlAPI.setEntityType("person");
    const countryCodePattern = /^[A-Z]{2}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let searchByID = "";
    if (!firstName || !surname || !dob || !country || !gender)
      return next(new errorHandler("Required Fields cannot be empty", 400));
    const name = firstName + " " + surname;
    if (!countryCodePattern.test(country)) {
      return next(new errorHandler("Country must be in ISO 2 format", 400));
    }
    if (!dateRegex.test(dob)) {
      return next(
        new errorHandler("Country must be in yyyy-mm-dd format", 400)
      );
    }
    if (idNumber) {
      if (idNumber.toString().length < 5) {
        console.log(idNumber.toString().length);
        return next(
          new errorHandler(
            "Document number should contain at least 5 characters",
            400
          )
        );
      } else {
        searchByID = await amlAPI.searchByIDNumber(idNumber, country, dob);
      }
    }

    //date format: yyyy-mm-dd
    const searchByName = await amlAPI.searchByName(name, country, dob);
    console.log(searchByName.items);
    if (searchByID.items.length === 0 && searchByName.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: `${name}does not have any criminal Record and does not exist in database`,
      });
    } else {
      let databaseId = "";
      let databaseName = "";
      if (searchByID.items.length > 0) {
        databaseId = searchByID.items[0].database;
      }
      if (searchByName.items.length > 0) {
        databaseName = searchByName.items[0].database;
      }
      if (databaseId || databaseName) {
        const dbName = databaseName || databaseId;
        // const dbName = 'interpol_red';
        if (dbName === "interpol_red") {
          return res.status(200).json({
            success: true,
            message: `${name}has criminal record and exists in database of ${dbName}`,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: `${name}exists in database of ${dbName}`,
          });
        }
      }
    }
    return res.status(200).json({
      success: true,
      message: `${name}does not have any criminal Record and does not exist in database`,
    });
  } catch (err) {
    console.log(err.message);
  }
});
//email Identity Verification by sending 2 URLs one for browser and another for live mobile verification.
export const emailIdentityVerification = catchAsyncError(
  async (req, res, next) => {
    try {
      const { name, email, company } = req.body;
      if (!name || !email || !company)
        return next(new errorHandler("Required fields can not be empty!", 400));
      const companyName = await Company.findOne({ name: company });
      if (!companyName)
        return next(new errorHandler("Company doesn't exist!", 404));
      let userInvite = await MaunalEmailVerification.findOne({
        email,
      });
      if (userInvite) return next(new errorHandler("User already exists", 409));
      const { user } = req;
      const { companyUser } = req;
      let adminId = "";
      let adminEmail = "";
      let adminName = "";
      if (user) {
        adminId = user._id;
        adminEmail = user.email;
        adminName = user.name;
      } else {
        adminId = companyUser._id;
        adminEmail = companyUser.email;
        adminName = companyUser.name;
      }
      userInvite = await MaunalEmailVerification.create({
        name,
        email,
        company: {
          company_id: companyName._id,
          name: companyName.name,
        },
        fk_admin: {
          admin_id: adminId,
          admin_name: adminName,
        },
        completed: false,
      });
      DocuPass.setCustomID(userInvite._id);
      docuPassFeatures();
      console.log(userInvite);
      const responseRedirection = await DocuPass.createRedirection();
      const liveMobileResponse = await DocuPass.createLiveMobile();
      if (!responseRedirection.error || !liveMobileResponse.error) {
        // console.log("Web Redirection");
        console.log(responseRedirection);
        // console.log("live mobile");
        console.log(liveMobileResponse);
        console.log("Web Url:");
        console.log(responseRedirection["url"]);
        console.log("Live Mobile Url:");
        console.log(liveMobileResponse["url"]);
        const message = `You have been invited to verify identity in the GlobalCompliance platform. If you want to uplaod documemtns for verification click on the given Link ${responseRedirection["url"]} or if you want use live mobile verification use this link ${liveMobileResponse["url"]} to complete the Identity Verification process.`;
        userInvite.referenceToken.webRedirectionToken =
          responseRedirection.reference;
        userInvite.referenceToken.liveMobileToken =
          liveMobileResponse.reference;

        await userInvite.save();

        sendEmail(
          userInvite.email,
          adminEmail,
          "Identity Verification",
          message
        );
        res.status(200).json({
          success: true,
          message: "Email has been sent for Identity verification.",
          message,
        });
      } else {
        // Error occurred
        console.log(responseRedirection.error);
        console.log(liveMobileResponse.error);
      }
    } catch (err) {
      console.log(err.message);
    }
  }
);

//vault search by  custom id
export const docuPassSearchByCustomId = catchAsyncError(
  async (req, res, next) => {
    try {
      const { docuPassCustomId } = req.params;
      let result = await VaultApi.list({
        filter: [`docupass_customid = ${docuPassCustomId}`],
      });
      return res.status(200).json({
        success: true,
        message: "Docu Pass search by custom Id",
        result,
      });
    } catch (err) {
      console.log(err.message);
    }
  }
);

//get all invitations sent of email identity verification (statuses) from vault
export const getAllInvitations = catchAsyncError(async (req, res, next) => {
  try {
    let result = await VaultApi.list({
      filter: ["createtime>=2023/01/1"],
      orderby: "firstName",
      sort: "ASC",
      limit: 100,
      offset: 0,
    });
    return res.status(200).json({
      success: true,
      message: "All invitations",
      result,
    });
  } catch (err) {
    console.log(err.message);
  }
});
//get all the invitations sent and get the data from MaunalEmailVerification model.
export const getSentInvitations = catchAsyncError(async (req, res, next) => {
  try {
    const admin = req.user ? req.user : req.companyUser;
    let result = await VaultApi.list({
      filter: ["docupass_success=1"],
      orderby: "firstName",
      sort: "ASC",
      limit: 100,
      offset: 0,
    });
    let vaultResultArray = result.items;
    const toObjectId = vaultResultArray.map(
      (item) => new mongoose.Types.ObjectId(item.docupass_customid)
    );
    const usersResult = await MaunalEmailVerification.find({
      _id: { $in: toObjectId },
    }).lean();
    // Iterate over the data array and update the completed key using ternary operator
    usersResult.forEach(async (item) => {
      const updatedCompletedValue = item.completed ? true : true;
      await MaunalEmailVerification.findOneAndUpdate(
        { _id: item._id },
        { completed: updatedCompletedValue }
      );
    });
    const finalList = await MaunalEmailVerification.find();
    return res.status(200).json({
      success: true,
      message: "All sent Invitations",
      finalList,
      admin,
    });
  } catch (err) {
    console.log(err.message);
  }
});

//quick document scan
export const quickDocumentScan = catchAsyncError(async (req, res, next) => {
  try {
    const admin = req.user ? req.user : req.companyUser;
    const { docFrontImage, docBackImage, companyName } = req.body;
    if (!companyName || !docFrontImage || !docBackImage)
      return next(new errorHandler("Required fields can't be empty", 400));
    const searchCompany = await Company.findOne({ name: companyName });
    if (!searchCompany)
      return next(new errorHandler("Company doesn't exist!", 404));
    const docScanInstance = await QuickDocumentScan.create({
      fullName: "test",
      vaultid: "test",
      fk_admin: {
        admin_id: admin._id,
        admin_name: admin.name,
      },
      doc_front_url: docFrontImage,
      doc_back_url: docBackImage,
      company: {
        company_id: searchCompany._id,
        name: searchCompany.name,
      },
    });
    CoreAPIFeatures();
    CoreAPI.setVaultData(docScanInstance._id);
    const response = await CoreAPI.scan({
      document_primary: docFrontImage,
      document_secondary: docBackImage,
    });
    if (!response.error) {
      console.log(response);
      // All the information about this ID will be returned in an associative array
      const data_result = response["result"];
      const authentication_result = response["authentication"];
      const aml_result = response["aml"];
      const aml_database = aml_result["database"];
      const aml_schema = aml_result["schema"];
      let message = "";
      // Print result
      console.log(
        `Hello your name is ${data_result["firstName"]} ${data_result["lastName"]}`
      );
      // Parse document authentication results
      if (authentication_result) {
        if (authentication_result["score"] > 0.5) {
          console.log("The document uploaded is authentic");
        } else if (authentication_result["score"] > 0.3) {
          console.log("The document uploaded looks a little bit suspicious");
        } else {
          console.log("The document uploaded is fake");
        }
      }
      if (aml_result.length === 0) {
        message = `${data_result["firstName"]} ${data_result["lastName"]} does not have any criminal record and is not found in any database.`;
      } else {
        if (aml_database === "interpol") {
          message = `${data_result["firstName"]} ${data_result["lastName"]} has  criminal Record and  exist in database of ${aml_database} with schema ${aml_schema}.`;
        } else {
          message = `${data_result["firstName"]} ${data_result["lastName"]}  exists in database of ${aml_database} with schema ${aml_schema}.`;
        }
      }
      docScanInstance.fullName = response.result.fullName;
      docScanInstance.vaultid = response.vaultid;
      docScanInstance.result = response;
      await docScanInstance.save();

      return res.status(200).json({
        success: true,
        docScanInstance,
        message,
      });
    } else {
      // Error occurred
      console.log(response.error);
    }
  } catch (err) {
    console.log(err.message);
  }
});
