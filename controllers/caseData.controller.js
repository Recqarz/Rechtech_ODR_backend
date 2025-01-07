// require("dotenv").config();
// const xlsx = require("xlsx");
// const fs = require("fs");
// const path = require("path");
// const { CASEDATA } = require("../model/caseData.model");
// const jwt = require("jsonwebtoken");
// const { USER } = require("../module/users/user.model");

// // const handleCaseData = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const { clientName, clientId, clientEmail } = req.body;

// //     if (!clientName || !clientId || !clientEmail) {
// //       fs.unlinkSync(req.file.path); // Delete the file
// //       return res.status(400).json({ message: "Client details are required" });
// //     }

// //     // Read the Excel file
// //     const workbook = xlsx.readFile(req.file.path);
// //     const sheetName = workbook.SheetNames[0];
// //     const sheet = workbook.Sheets[sheetName];
// //     const defaultersData = xlsx.utils.sheet_to_json(sheet);

// //     if (defaultersData.length === 0) {
// //       fs.unlinkSync(req.file.path); // Delete the file
// //       return res.status(400).json({ message: "Excel file is empty" });
// //     }

// //     const transformedDefaulters = defaultersData.map((row) => ({
// //       name: row.name || "",
// //       emailId: row.emailId || "",
// //       contactNo: row.contactNo || "",
// //       accountNo: row.accountNo || "",
// //       amount: Number(row.amount) || 0,
// //       caseStatus: "Pending",
// //       decision: "",
// //       decisionDate: null,
// //       remarks: row.remarks || "",
// //       isArbitrated: false,
// //       isPaid: false,
// //       isClosed: false,
// //     }));

// //     const newCaseData = new CASEDATA({
// //       clientName,
// //       clientId,
// //       clientEmail,
// //       fileName: req.file.originalname,
// //       defaulters: transformedDefaulters,
// //       caseCount: transformedDefaulters.length,
// //     });

// //     await newCaseData.save();

// //     const updateClient = await USER.findOne({ emailId: clientEmail });
// //     let caseAdded =
// //       parseInt(updateClient.caseAdded) + transformedDefaulters.length;
// //     const user = await USER.updateOne(
// //       { emailId: clientEmail },
// //       { caseAdded: caseAdded }
// //     );

// //     if (!user) {
// //       fs.unlinkSync(req.file.path); // Delete the file
// //       return res.status(500).json({ message: "Internal Server Error" });
// //     }

// //     // Delete the file after processing
// //     fs.unlinkSync(req.file.path);

// //     return res.json({
// //       message: `Successfully uploaded ${transformedDefaulters.length} records`,
// //       success: true,
// //     });
// //   } catch (error) {
// //     if (req.file && fs.existsSync(req.file.path)) {
// //       fs.unlinkSync(req.file.path); // Delete the file on error
// //     }
// //     console.error("Error processing file:", error);
// //     return res.status(500).json({
// //       message: "Error processing file",
// //       error: error.message,
// //     });
// //   }
// // };

// const handleGetCaseData = async (req, res) => {
//   try {
//     const cases = await CASEDATA.find().sort({ _id: -1 });
//     res.status(200).json({ cases });
//   } catch (err) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const handleGetOneCaseData = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const caseData = await CASEDATA.findById(id);
//     if (!caseData) {
//       return res.status(404).json({ message: "Case data not found" });
//     }
//     res.status(200).json({ caseData });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const arbitratorCases = async (req, res) => {
//   const { token } = req.headers;

//   if (!token) {
//     return res.status(401).json({ message: "Token not provided" });
//   }
//   try {
//     const decoded = jwt.verify(
//       token?.split(" ")[1],
//       process.env.JWT_SECRET_KEY
//     );
//     if (!decoded) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     const id = decoded.id;
//     const caseData = await CASEDATA.find({ arbitratorId: id });
//     if (!caseData) {
//       return res.status(404).json({ message: "Case data not found" });
//     }
//     res.status(200).json({ caseData });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const clientCases = async (req, res) => {
//   const { token } = req.headers;

//   if (!token) {
//     return res.status(401).json({ message: "Token not provided" });
//   }
//   try {
//     const decoded = jwt.verify(
//       token?.split(" ")[1],
//       process.env.JWT_SECRET_KEY
//     );
//     if (!decoded) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     const id = decoded.id;
//     const user = await USER.findById(id);
//     if (!user) {
//       return res.status(402).json({ message: "Invalid user id" });
//     }
//     const caseData = await CASEDATA.find({ clientId: user.uid });
//     if (!caseData) {
//       return res.status(404).json({ message: "Case data not found" });
//     }
//     res.status(200).json({ caseData });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   handleGetCaseData,
//   handleGetOneCaseData,
//   arbitratorCases,
//   clientCases,
// };
