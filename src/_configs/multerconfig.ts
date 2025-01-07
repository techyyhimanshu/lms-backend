import multer from "multer";
import path from "path";
import fs from "fs";
import { getNextSequence } from "../_services/getNextSequence";
import { AppError } from "../helpers/customError";

const createDirectory = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const getMainPath = (): string => {
    return process.env.content_path || "/default/path/to/uploads";
};

const validateParameters = (params: Record<string, any>, required: string[]): void => {
    const missing = required.filter(param => !params[param]);
    if (missing.length) {
        throw new AppError(`Missing required parameters: ${missing.join(", ")}`, 400);
    }
};

const generateTimestampedFilename = (originalName: string): string => {
    const ext = path.extname(originalName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `${timestamp}${ext}`;
};

const isExcelFile = (mimetype: string): boolean => {
    return [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].includes(mimetype);
};

const handleUploadRoute = (file: Express.Multer.File, req: any): string => {
    validateParameters(req.body, ["org_id"]);
    if (file.mimetype === "application/pdf") {
        return `${getMainPath()}/uploadeddocument`;
    } else if (file.mimetype === "video/mp4") {
        return `${getMainPath()}/pdf/${req.body.org_id}`;
    }
    throw new AppError(`Unsupported file type: ${file.mimetype}`, 400);
};

const handleUserDataRoute = (file: Express.Multer.File, req: any): string => {
    validateParameters(req.body, ["course_id", "sponsor_id", "batch_name"]);
    if (isExcelFile(file.mimetype)) {
        return `${getMainPath()}/excel/user/${req.body.batch_name}`;
    }
    throw new AppError(`Unsupported file type: ${file.mimetype}`, 400);
};

const handleExamDataRoute = (file: Express.Multer.File, req: any): string => {
    validateParameters(req.body, ["exam_id"]);
    if (isExcelFile(file.mimetype)) {
        return `${getMainPath()}/excel/questions/${req.body.exam_id}`;
    }
    throw new AppError(`Unsupported file type: ${file.mimetype}`, 400);
};

const getFileDestination = (file: Express.Multer.File, req: any): string => {
    switch (req.url) {
        case "/upload":
            return handleUploadRoute(file, req);
        case "/upload/user-data":
            return handleUserDataRoute(file, req);
        case "/upload/exam-data":
            return handleExamDataRoute(file, req);
        default:
            throw new AppError(`Unsupported route: ${req.url}`, 400);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const dest = getFileDestination(file, req);
            createDirectory(dest);
            cb(null, dest);
        } catch (error: any) {
            cb(error, "");
        }
    },
    filename: async (req, file, cb) => {
        try {
            if (file.mimetype === "application/pdf" || file.mimetype === "video/mp4") {
                const sequence = await getNextSequence(req.body.org_id);
                const ext = path.extname(file.originalname);
                cb(null, `${sequence ? sequence + 1 : 1}${ext}`);
            } else {
                cb(null, generateTimestampedFilename(file.originalname));
            }
        } catch (error: any) {
            cb(error, "");
        }
    },
});

const upload = multer({ storage });

export { upload };
