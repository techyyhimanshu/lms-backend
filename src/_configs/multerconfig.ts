import multer from "multer";
import path from "path";
import fs from "fs";
import { getNextSequence } from "../_services/getNextSequence";

// Define storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const mainPath: any = process.env.content_path;
        if (!fs.existsSync(mainPath)) {
            fs.mkdirSync(mainPath);
        }
        // Add this check
        if (!req.body?.org_id) {
            return cb(new Error("org_id is required"), "");
        }

        if (file.mimetype === "application/pdf") {
            cb(null, "./uploadeddocument");
        } else if (file.mimetype === "video/mp4") {
            const pathToSave = `${mainPath}/${req.body.org_id}`
            if (!fs.existsSync(pathToSave)) {
                fs.mkdirSync(pathToSave);
            }
            cb(null, pathToSave);
        } else {
            cb(new Error("Unsupported file type!"), "");
        }
    },
    filename: async (req, file, cb) => {
        try {
            // Make the function async and await the sequence
            const sequence = await getNextSequence(req.body.org_id);
            const ext = path.extname(file.originalname);

            if (file.mimetype === "application/pdf" || file.mimetype === "video/mp4") {
                cb(null, `${sequence ? sequence + 1 : 1}${ext}`);
            }
        } catch (error: any) {
            cb(error, "");
        }
    },
});

// Define file filter
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "application/pdf" || file.mimetype === "video/mp4") {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PDF and MP4 files are allowed!"));
//     }
// };

// Configure multer upload
const upload = multer({
    storage,
    // limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB file size limit
    // fileFilter,
});

export { upload };

