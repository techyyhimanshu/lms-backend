import { Router } from "express";
import { getReportDataBatchWise, getReportDataDateWise, getReportDataLoginWise } from "../controllers/reportController";

const router = Router();


router.post('/batch-wise', getReportDataBatchWise);
router.post('/date-wise', getReportDataDateWise);


router.post('/login-wise', getReportDataLoginWise);



export default router;
