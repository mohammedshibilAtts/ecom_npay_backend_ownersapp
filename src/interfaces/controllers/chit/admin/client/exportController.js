import express from "express";
import ExcelJS from "exceljs";
import { parse } from "csv-parse/sync";
import multer from "multer";
import processUploadedData from "../../../../../services/importLogics.js";

const router = express.Router();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only xlsx, xls, or csv files are allowed"));
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter });

const createErrorExcelFile = async (skippedRecords, originalHeaders = []) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Error Records');
    
    const columns = [
      { header: 'Line Number', key: 'lineNumber', width: 15 },
      { header: 'Original Data', key: 'originalData', width: 40 },
      { header: 'Error Field', key: 'errorField', width: 20 },
      { header: 'Error Value', key: 'errorValue', width: 20 },
      { header: 'Error Message', key: 'errorMessage', width: 40 },
      { header: 'All Errors', key: 'allErrors', width: 60 }
    ];

    worksheet.columns = columns;

    skippedRecords.forEach(record => {
      worksheet.addRow({
        lineNumber: record.line,
        originalData: JSON.stringify(record.originalData),
        errorField: record.errors[0]?.field || 'Unknown',
        errorValue: record.errors[0]?.value || 'N/A',
        errorMessage: record.errors[0]?.message || 'Unknown error',
        allErrors: record.errors.map(err => 
          `${err.field || 'General'}: ${err.message}`
        ).join('; ')
      });
    });

    worksheet.getRow(1).font = { bold: true };
    
    const excelBuffer = await workbook.xlsx.writeBuffer();
    return excelBuffer;
  } catch (error) {
    console.error('Error creating Excel file:', error);
    throw new Error('Failed to create error report');
  }
};

const getHeadersFromData = (data) => {
  if (data.length === 0) return [];
  return Object.keys(data[0]);
};

router.post("/", upload.single("file"), async (req, res) => {
  let originalData = [];
  let originalHeaders = [];

  try {
    const { field } = req.body;
    if (!field) return res.status(400).json({ success: false, message: "Missing field type." });

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    let data = [];

    try {
      if (fileName.endsWith(".csv")) {
        const content = fileBuffer.toString("utf-8");
        data = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        const worksheet = workbook.getWorksheet(1);
        const rows = [];
        
        const headers = [];
        worksheet.getRow(1).eachCell((cell) => {
          headers.push(cell.value);
        });

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          const rowData = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const header = headers[colNumber - 1];
            let value = cell.value;
            
            if (value && typeof value === 'object' && value.result !== undefined) {
              value = value.result;
            }
            
            if (value instanceof Date) {
              rowData[header] = value.toISOString().split("T")[0];
            } else {
              rowData[header] = value;
            }
          });
          rows.push(rowData);
        });
        data = rows;
      } else {
        return res.status(400).json({ success: false, message: "Unsupported file format." });
      }
    } catch (parseError) {
      console.error("File parsing error:", parseError);
      return res.status(400).json({ 
        success: false, 
        message: "Failed to parse the uploaded file",
        error: parseError.message 
      });
    }

    originalData = data;
    originalHeaders = getHeadersFromData(data);

    const result = await processUploadedData(data, field);
    
    if (result.success) {
      const response = {
        success: true,
        message: result.message,
        insertedCount: result.insertedCount,
        skippedCount: result.skippedCount || 0
      };

      if (field.toLowerCase() === "customers" && result.skippedMobiles) {
        response.skippedMobiles = result.skippedMobiles;
      }

      if (result.skippedRecords && result.skippedRecords.length > 0) {
        response.skippedRecords = result.skippedRecords;
        
        const errorExcelBuffer = await createErrorExcelFile(result.skippedRecords, originalHeaders);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="import_errors_${Date.now()}.xlsx"`);
        res.setHeader('Content-Length', errorExcelBuffer.length);
        
        return res.status(207).send(errorExcelBuffer);
      }

      return res.status(200).json(response);
    } else {
      if (result.skippedRecords && result.skippedRecords.length > 0) {
        const errorExcelBuffer = await createErrorExcelFile(result.skippedRecords, originalHeaders);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="import_errors_${Date.now()}.xlsx"`);
        res.setHeader('Content-Length', errorExcelBuffer.length);
        
        return res.status(207).send(errorExcelBuffer);
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          details: result.details || {}
        });
      }
    }
  } catch (err) {
    console.error("Import error:", err);
    
    if (err.name === 'UploadError') {
      const statusCode = err.details?.skippedCount ? 207 : 400;
      
      // If there are skipped records in error details, generate Excel file
      if (err.details?.skippedRecords && err.details.skippedRecords.length > 0) {
        const errorExcelBuffer = createErrorExcelFile(err.details.skippedRecords, originalHeaders);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="import_errors_${Date.now()}.xlsx"`);
        res.setHeader('Content-Length', errorExcelBuffer.length);
        
        return res.status(statusCode).send(errorExcelBuffer);
      }

      const errorResponse = {
        success: false,
        message: err.message,
        ...err.details
      };

      if (req.body.field?.toLowerCase() === "customers" && err.details?.skippedMobiles) {
        errorResponse.skippedMobiles = err.details.skippedMobiles;
      }

      return res.status(statusCode).json(errorResponse);
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        success: false,
        message: "File size too large" 
      });
    } else if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        success: false,
        message: "File upload error",
        error: err.message 
      });
    } else {
      return res.status(500).json({ 
        success: false,
        message: "Import failed",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
      });
    }
  }
});

router.post("/finish", async (req, res) => {
  try {
    const paymentSums = await Payment.aggregate([
      { $group: { _id: "$schemeAccountId", totalAmount: { $sum: "$amount" } } }
    ]);

    const bulkOps = paymentSums.map((p) => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { amount: p.totalAmount } }
      }
    }));

    if (bulkOps.length > 0) {
      await SchemeAccount.bulkWrite(bulkOps);
    }

    return res.status(200).json({
      success: true,
      message: "Scheme accounts updated successfully",
      updatedAccounts: bulkOps.length,
    });
  } catch (err) {
    console.error("Finish API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to finish updating scheme accounts",
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    });
  }
});

export default router;