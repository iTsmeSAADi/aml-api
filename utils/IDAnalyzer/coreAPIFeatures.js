import { CoreAPI } from "../../app.js";
export const CoreAPIFeatures = () => {
  CoreAPI.enableAuthentication(true, 2);
  CoreAPI.enableVault(true, false, false, false); // enable vault cloud storage to store document information and image
  CoreAPI.verifyExpiry(true);
  CoreAPI.setBiometricThreshold(0.6); // make face verification more strict
  CoreAPI.enableAuthentication(true, "quick"); // check if document is real using 'quick' module
  CoreAPI.enableBarcodeMode(false); // disable OCR and scan for AAMVA barcodes only
  CoreAPI.enableImageOutput(true, true, "url"); // output cropped document and face region in URL format
  CoreAPI.enableDualsideCheck(true); // check if data on front and back of ID matches
  CoreAPI.enableAMLCheck(true); // enable AML/PEP compliance check
  CoreAPI.setAMLDatabase(""); // limit AML check to all
};
