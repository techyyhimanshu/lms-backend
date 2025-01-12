import { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from '../helpers/customError';
import { sendSuccessResponse } from "../helpers/successResponse";
import { getReportDataBatchWiseService, getReportDataDateWiseService, getReportDataLoginWiseService } from "../_services/reportService";


export const getReportDataBatchWise:RequestHandler=async (req,res,next)=>{
    try {
        const data=await getReportDataBatchWiseService(req.body)
        sendSuccessResponse(res,'',data);
    } catch (error:any) {
        return next(new AppError(error.message, 400));
    }
}

export const getReportDataDateWise:RequestHandler=async (req,res,next)=>{
    try {
        const data=await getReportDataDateWiseService(req.body)
        sendSuccessResponse(res,'',data);
    } catch (error:any) {
        return next(new AppError(error.message, 400));
    }
}
export const getReportDataLoginWise:RequestHandler=async (req,res,next)=>{
    try {
        const data=await getReportDataLoginWiseService(req.body)
        sendSuccessResponse(res,'',data);
    } catch (error:any) {
        return next(new AppError(error.message, 400));
    }
}