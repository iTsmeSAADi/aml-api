import { DocuPass } from "../../app.js";
export const docuPassFeatures = () => {
  // Enable vault cloud storage to store verification results
  DocuPass.enableVault(true);

  // Set a callback URL where verification results will be sent, you can use docupass_callback.php under this folder as a template
  //   DocuPass.setCallbackURL(
  //     "https://webhook.site/ebabab8d-10b8-4c99-bed8-78944ad2f66f"
  //   );

  // We want DocuPass to return document image and user face image in URL format.
  DocuPass.setCallbackImage(true, true, 1);

  // We will do a quick check on whether user have uploaded a fake ID
  DocuPass.enableAuthentication(true, "quick", 0.3);

  // Enable photo facial biometric verification with threshold of 0.5
  DocuPass.enableFaceVerification(true, 1, 0.5);

  // Users will have only 1 attempt for verification
  DocuPass.setMaxAttempt(1);

  DocuPass.setWelcomeMessage(
    "We need to verify identity in the GlobalCompliance platform."
  ); // Display your own greeting message
  DocuPass.verifyExpiry(true); // check document expiry
  DocuPass.enableAMLCheck(true); // enable AML/PEP compliance check
  DocuPass.setAMLDatabase(""); // limit AML check to all

  // We want to redirect user back to your website when they are done with verification
  //  DocuPass.setRedirectionURL("","");
};
