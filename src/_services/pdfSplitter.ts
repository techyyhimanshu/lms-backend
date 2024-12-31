import fs from 'fs';
import path from 'path';
import { PDFDocument, square } from 'pdf-lib';
import { getNextSequence } from './getNextSequence';
async function splitPDF(filePath: any, org_id: any) {
    const dataBuffer = fs.readFileSync(filePath);

    // Load the PDF
    const pdfDoc = await PDFDocument.load(dataBuffer);

    // Get the total page count
    const totalPages = pdfDoc.getPageCount();

    // Directory to save the single-page PDFs
    const splitDir = path.join("/home/victor/Desktop/Projects/LRSM/lrsm-backend/uploads/pdf");
    if (!fs.existsSync(splitDir)) {
        fs.mkdirSync(splitDir);
    }
    let sequence = await getNextSequence(org_id)
    const seq = sequence
    // Split and save each page as a separate PDF
    const splitFilePaths = [];
    for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);


        const orgFiles = path.join(splitDir, org_id)
        if (!fs.existsSync(orgFiles)) {
            fs.mkdirSync(orgFiles);
        }

        const splitFilePath = path.join(orgFiles, `${sequence ? sequence + 1 : i + 1}.pdf`);
        const pdfBytes = await newPdf.save();
        fs.writeFileSync(splitFilePath, pdfBytes);
        const relativePath = path.join(`PDF`, org_id, `${sequence ? sequence + 1 : i + 1}.pdf`);
        //`PDF\\${org_id}\\${sequence ? sequence + 1 : i + 1}.pdf`
        splitFilePaths.push(relativePath);
        sequence++;
    }
    return { totalPages, splitFilePaths, seq };
}

export default splitPDF;
