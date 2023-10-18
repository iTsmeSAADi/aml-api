import multer from "multer";
//middleware
const storage = multer.memoryStorage();
const doubleUpload = multer({ storage }).array("files", 2);
//here for single file we used single for many array option is used and file name here must be same as req.file.
export default doubleUpload;
