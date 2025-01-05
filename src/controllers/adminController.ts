import { ErrorRequestHandler, RequestHandler } from "express";
import adminService from '../_services/adminService';
import createHttpError from "http-errors";
import response from "../_middlewares/response";
import splitPDF from "../_services/pdfSplitter";
import { getNextSequence } from "../_services/getNextSequence";
import path from "path";
import XLSX from 'xlsx';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}




const viewUploadedData: RequestHandler = async (req, res, next) => {
    try {
        //debugger

        let result: any = await adminService.viewUploadedData(req.body.userId)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const verifyuploaddata: RequestHandler = async (req, res, next) => {
    try {
        debugger

        let result: any = await adminService.verifyUploadedData(req.body.userId)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const updateReadingData: RequestHandler = async (req, res, next) => {
    try {
        debugger

        let result: any = await adminService.updateReadingData(req.body.taskid, req.body.readingdata)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const checkmeterreading: RequestHandler = async (req, res, next) => {
    try {
        debugger

        let result: any = await adminService.checkmeterreading(req.body.taskid, req.body.verify, req.body.remark)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};
const registeruser: RequestHandler = async (req, res, next) => {
    try {
        debugger

        let result: any = await adminService.registeruser(req.body.name, req.body.mobuile, req.body.emailid)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const registerbatch: RequestHandler = async (req, res, next) => {
    try {
        debugger

        let userid: any = req.headers.data ?? "";

        let result: any = await adminService.registerbatch(req.body.courseid, req.body.companyid, userid, req.body.batchsize)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const createnewuser: RequestHandler = async (req, res, next) => {
    try {
        //debugger

        let userid: any = 'ADMIN';//req.headers.data ?? "";

        let result: any = await adminService.createnewuser(req.body.courseid, req.body.companyid, userid, req.body.batchname, req.body.noofuser)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const sponsor: RequestHandler = async (req, res, next) => {
    try {
        //debugger

        let result: any = await adminService.sponsor()

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const course: RequestHandler = async (req, res, next) => {
    try {
        //debugger

        let result: any = await adminService.course()

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const chapter: RequestHandler = async (req, res, next) => {
    try {
        console.log(" cntrl run");

        // Extract courseId from request parameters (adjust based on where courseId comes from)
        const { courseid } = req.params; // Or req.query/courseId or req.body.courseId, based on your API design

        if (!courseid) {
            return next(createHttpError(400, 'courseId is required')); // Handle missing courseId
        }

        // Call adminService.course with courseId
        const result: any = await adminService.chapter(courseid);
        // console.log("result ", result);

        const changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    } catch (err) {
        const er: any = err;
        next(createHttpError(500, er.message));
    }
};

const getbatchname: RequestHandler = async (req, res, next) => {
    try {
        //debugger

        let result: any = await adminService.getbatchname(req.body.courseid, req.body.companyid)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const uploadPdf: RequestHandler = async (req, res, next) => {
    try {
        const { org_id } = req.body

        const filePath = req.file?.path
        const fileType = req.file?.mimetype
        if (fileType === "application/pdf") {
            const { splitFilePaths, seq: sequence } = await splitPDF(filePath, org_id)
            const data = splitFilePaths.map((item: any, index: number) => {
                return {
                    ORGSTRUCTUREID: org_id,
                    CONTENT: `CO${org_id}`,
                    SEQUENCE: sequence ? sequence + index + 1 : index + 1,
                    RECORDED: 'Y',
                    IMAGEPATH: 'Y',
                    TIMED: 'Y',
                    HEADER: 'AB',
                    FOOTER: 'CH1',
                    HEADER1: 'AB',
                    HEADER2: 'AB',
                    CONTENTPATH: item,

                }
            })
            const result = await adminService.uploadPdfService(data)
            res.status(200).json(response.success(result));
        }
        else {

            const sequence = await getNextSequence(org_id)
            const data = {
                ORGSTRUCTUREID: org_id,
                CONTENT: `CO${org_id}`,
                SEQUENCE: sequence ? sequence + 1 : 1,
                RECORDED: 'Y',
                IMAGEPATH: 'Y',
                TIMED: 'Y',
                HEADER: 'AB',
                FOOTER: 'CH1',
                HEADER1: 'AB',
                HEADER2: 'AB',
                // CONTENTPATH: `PDF\\${org_id}\\${sequence ? sequence + 1 : 1}.mp4`,
                CONTENTPATH: path.join(`PDF`, org_id, `${sequence ? sequence + 1 : 1}.mp4`)

            }

            const result = await adminService.uploadVideoService(data)
            res.status(200).json(response.success(result));
        }



    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const addNewCourse: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.addNewCourseService(req.body);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};
const addNewChapter: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.addNewChapterService(req.body);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};
const addNewExam: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.addNewExamService(req.body);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const addNewQuestion: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.addNewQuestionService(req.body);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const getuser: RequestHandler = async (req, res, next) => {
    try {
        //  console.log(" cntrl run");

        // Extract courseId from request parameters (adjust based on where courseId comes from)
        const { firstuser, lastuser } = req.params;

        // Validate that both parameters are provided
        if (!firstuser || !lastuser) {
            return next(createHttpError(400, 'Both firstuser and lastuser are required'));
        }

        // Call adminService.course with courseId
        const result: any = await adminService.getuser(firstuser, lastuser);
        // console.log("result ", result);

        const changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    } catch (err) {
        const er: any = err;
        next(createHttpError(500, er.message));
    }
};

const activateuser: RequestHandler = async (req, res, next) => {
    try {
        debugger

        let result: any = await adminService.activateuser(req.body)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const getExamQuestions: RequestHandler = async (req, res, next) => {
    try {
        //  console.log(" cntrl run");

        // Extract courseId from request parameters (adjust based on where courseId comes from)
        const { id: examId } = req.params;

        // Validate that both parameters are provided
        if (!examId) {
            return next(createHttpError(400, 'Exam ID is required '));
        }

        // Call adminService.course with courseId
        const result: any = await adminService.getExamQuestionService(Number(examId));
        // console.log("result ", result);

        const changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    } catch (err) {
        const er: any = err;
        next(createHttpError(500, er.message));
    }
};

// --------------Update controllers---------------
const updateCourse: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.updateCourseService(req.params.id,req.body);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};
const updateChapter: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.updateChapterService(req.params.id,req.body);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};
const updateExam: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.updateExamService(req.params.id,req.body);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

// --------------Delete controllers---------------
const deleteCourse: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.deleteCourseService(req.params.id);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};
const deleteChapter: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.deleteChapterService(req.params.id);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};
const deleteExam: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        result = await adminService.deleteExamService(req.params.id);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};
const getbatch: RequestHandler = async (req, res, next) => {
    try {
        //  console.log(" cntrl run");

        // Extract courseId from request parameters (adjust based on where courseId comes from)
        const { course, sponsor } = req.params;

        // Validate that both parameters are provided
        if (!course || !sponsor) {
            return next(createHttpError(400, 'Both course and sponsor are required'));
        }

        // Call adminService.course with courseId
        const result: any = await adminService.getbatch(course, sponsor);
        // console.log("result ", result);

        const changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    } catch (err) {
        const er: any = err;
        next(createHttpError(500, er.message));
    }
};

const c_getByRole: RequestHandler = async (req, res, next) => {

    //debugger
    let result: any;
    try {
        const role = req.params.role;
        if (!(role === 'TUTOR' || role === 'USER' || role === 'ADMIN')) {
            return next(createHttpError(400, 'role should be correct')); // Handle missing courseId
        }
        result = await adminService.s_getByRole(role);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

// -------------------Bulk upload controllers--------------------
const bulkUploadUserData: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            throw createHttpError(400, 'No file uploaded.');
        }
        const {course_id,sponsor_id,batch_name}=req.body
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // // Sanitize and map the input data
        // const sanitizedData = rawData.map(record => ({
        //     "URN Number": String(record['URN Number'] || '').trim(),
        //     "Name": String(record['Name'] || '').trim(),
        //     "Email": String(record['Email'] || '').trim(),
        //     "Mobile Number": String(record['Mobile Number'] || '').trim(),
        //     "Branch": String(record['Branch'] || '').trim(),
        //     "Referred By": String(record['Referred By'] || '').trim(),
        //     "City": String(record['City'] || '').trim(),
        //     "State": String(record['State'] || '').trim(),
        //     "Application Number": String(record['Application Number'] || '').trim(),
        //     "Code": String(record['Code'] || '').trim(),
        //     "IPM": String(record['IPM'] || '').trim(),
        // }));


        // Pass sanitized data to the service
        const result = await adminService.bulkUploadUserDataService(rawData,course_id,sponsor_id,batch_name);

        res.status(200).json(response.success(result));
    } catch (err) {
        const error: any = err;
        console.error("Error in bulk upload user controller", error);
        next(createHttpError(error.status || 500, error.message || 'Internal Server Error'));
    } 
    // finally {
    //     if (req.file) {
    //         fs.unlink(req.file.path, (err) => {
    //             if (err) console.error("Error removing file:", err.message);
    //         });
    //     }
    // }
};
const bulkUploadExamQuestionsData: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            throw createHttpError(400, 'No file uploaded.');
        }
        const {exam_id}=req.body
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // // Sanitize and map the input data
        // const sanitizedData = rawData.map(record => ({
        //     "URN Number": String(record['URN Number'] || '').trim(),
        //     "Name": String(record['Name'] || '').trim(),
        //     "Email": String(record['Email'] || '').trim(),
        //     "Mobile Number": String(record['Mobile Number'] || '').trim(),
        //     "Branch": String(record['Branch'] || '').trim(),
        //     "Referred By": String(record['Referred By'] || '').trim(),
        //     "City": String(record['City'] || '').trim(),
        //     "State": String(record['State'] || '').trim(),
        //     "Application Number": String(record['Application Number'] || '').trim(),
        //     "Code": String(record['Code'] || '').trim(),
        //     "IPM": String(record['IPM'] || '').trim(),
        // }));


        // Pass sanitized data to the service
        const result = await adminService.bulkUploadExamQuestionsDataService(rawData,exam_id);

        res.status(200).json(response.success(result));
    } catch (err) {
        const error: any = err;
        console.error("Error in bulk upload user controller", error);
        next(createHttpError(error.status || 500, error.message || 'Internal Server Error'));
    } 
    // finally {
    //     if (req.file) {
    //         fs.unlink(req.file.path, (err) => {
    //             if (err) console.error("Error removing file:", err.message);
    //         });
    //     }
    // }
};

export default {

    viewUploadedData,
    verifyuploaddata,
    updateReadingData,
    checkmeterreading,
    registeruser,
    registerbatch,
    sponsor,
    course,
    chapter,
    getbatchname,
    getbatch,
    uploadPdf,
    addNewCourse,
    addNewChapter,
    addNewExam,
    createnewuser,
    addNewQuestion,
    getuser,
    activateuser,
    updateCourse,
    updateChapter,
    deleteCourse,
    c_getByRole,
    getExamQuestions,
    deleteChapter,
    bulkUploadUserData,
    bulkUploadExamQuestionsData,
    deleteExam,
    updateExam

}