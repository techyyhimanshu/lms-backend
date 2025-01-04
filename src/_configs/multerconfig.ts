import multer from "multer";
import path from "path";
import fs from "fs";
import { getNextSequence } from "../_services/getNextSequence";

// Define storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const environment = process.env.NODE_ENV
        const mainPath: any = environment === 'development' ? process.env.content_path : "/home/victor/Desktop/Projects/LRSM/lrsm-backend/uploads/pdf"
            ;
        if (!fs.existsSync(mainPath)) {
            fs.mkdirSync(mainPath, { recursive: true });
        }

        if (file.mimetype === "application/pdf") {
            const pathToSave = `${mainPath}/uploadeddocument`
            if (!fs.existsSync(pathToSave)) {
                fs.mkdirSync(pathToSave, { recursive: true });
            }
            cb(null, pathToSave);
        } else if (file.mimetype === "video/mp4") {
            if (!req.body?.org_id) {
                return cb(new Error("org_id is required"), "");
            }
            const pathToSave = `${mainPath}/pdf/${req.body.org_id}`
            if (!fs.existsSync(pathToSave)) {
                fs.mkdirSync(pathToSave, { recursive: true });
            }
            cb(null, pathToSave);
        }

        else if (file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            let pathToSave = ""
            if (!req.body?.exam_id) {
                pathToSave = `${mainPath}/excel/user/${req.body.batch_name}`
                if (!fs.existsSync(pathToSave)) {
                    fs.mkdirSync(pathToSave, { recursive: true });
                }
            }else{
                pathToSave = `${mainPath}/excel/questions/${req.body.exam_id}`
                if (!fs.existsSync(pathToSave)) {
                    fs.mkdirSync(pathToSave, { recursive: true });
                }
            }

            cb(null, pathToSave);
        } else {
            cb(new Error("Unsupported file type!"), "");
        }
    },
    filename: async (req, file, cb) => {
        try {
            // Make the function async and await the sequence


            if (file.mimetype === "application/pdf" || file.mimetype === "video/mp4") {
                const sequence = await getNextSequence(req.body.org_id);
                const ext = path.extname(file.originalname);
                cb(null, `${sequence ? sequence + 1 : 1}${ext}`);
            } else {
                const ext = path.extname(file.originalname);
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                cb(null, `${year}-${month}-${day}-${hours}-${minutes}-${seconds}${ext}`);
                // cb(null, `${}${ext}`);
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

