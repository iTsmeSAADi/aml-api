import IDAnalyzer from "idanalyzer";
export const connectIDAnalyzer = () => {
  let amlAPI = new IDAnalyzer.AMLAPI(process.env.IDANALYZER_KEY, "EU");
  return amlAPI;
};
export const connectIDAnalyzerDocuPass = () => {
  let DocuPass = new IDAnalyzer.DocuPass(
    process.env.IDANALYZER_KEY,
    "GlobalCompliance Platform",
    "EU"
  );
  return DocuPass;
};
export const connectIDAnalyzerVault = () => {
  let Vault = new IDAnalyzer.Vault(process.env.IDANALYZER_KEY, "EU");
  return Vault;
};
export const connectIDAnalyzerCoreAPI = () => {
  let CoreAPI = new IDAnalyzer.CoreAPI(process.env.IDANALYZER_KEY, "EU");
  return CoreAPI;
};
