import fs from "fs"
import { awsTextractClient, azureRecognizerClient, } from "../utils/config.js";
import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import ExcelJs from "exceljs"
import XLSX from "xlsx"
import { getTables } from "../utils/awsHelper.js";

const performAwsOcr = async (req, res) => {
    try {
        const imageBuffer = fs.readFileSync("./sample.png")
        const params = {
            Document: {
                Bytes: Buffer.from(imageBuffer, 'base64'),
            },
            FeatureTypes: ["TABLES"],
        };
        const ocrData = await awsTextractClient.send(new AnalyzeDocumentCommand(params));
        if (ocrData) {
            const tables = await getTables(ocrData);
            const wb = XLSX.utils.book_new();
            tables.forEach((sheetData, index) => {
                const wsData = Object.values(sheetData).map(row => Object.values(row));
                const ws = XLSX.utils.aoa_to_sheet(wsData);
                XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
            });
            const filePath = 'awsResult.xlsx';
            XLSX.writeFile(wb, filePath);

            return res.status(200).send({ status: 1, res: "information as been exported to excel" })
        }

        return res.status(400).send({ status: 0, res: "Invalid request" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, res: "Internal server error" });
    }
}

const performAzureOcr = async (req, res) => {
    try {
        const workbook = new ExcelJs.Workbook();
        const imageBuffer = fs.readFileSync("./sample.png")
        const params = await azureRecognizerClient.beginAnalyzeDocument("prebuilt-document", imageBuffer);
        const ocrData = await params.pollUntilDone();
        if (ocrData) {

            const addTableToWorksheet = (table, sheetName) => {
                const worksheet = workbook.addWorksheet(sheetName);
                const headers = table.cells
                    .filter(cell => cell.kind === 'columnHeader')
                    .map(cell => cell.content);
                worksheet.addRow(headers);
                for (let i = 0; i < table.rowCount; i++) {
                    const rowData = table.cells
                        .filter(cell => cell.rowIndex === i && cell.kind === 'content')
                        .map(cell => cell.content);
                    worksheet.addRow(rowData);
                }
            }

            ocrData.tables.forEach((table, i) => {
                addTableToWorksheet(table, `Table${i + 1}`)
            })

            workbook.xlsx.writeFile('azureResult.xlsx')
                .then(() => {
                    console.log('Excel file exported successfully.');
                })
                .catch(error => {
                    console.error('Error exporting Excel file:', error);
                });
            
            return res.status(200).send({ status: 1, res: "information as been exported to excel" })
        }

        return res.status(400).send({ status: 0, res: "Invalid request" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, res: "Internal server error" });
    }
}

export { performAwsOcr, performAzureOcr }


