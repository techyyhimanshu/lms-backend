import { Router } from "express";
import admin from "../controllers/adminController";
import multer from "multer";
import { upload } from "../_configs/multerconfig"
// Initialize Multer for file uploads


const router = Router();
router.post('/uploadeddata', admin.viewUploadedData);
router.post('/uploadedVerifydata', admin.verifyuploaddata);
router.post('/updatemeterreading', admin.updateReadingData);
router.post('/checkmeterreading', admin.checkmeterreading);
router.post('/registeruser', admin.registeruser);
router.post('/createbatch', admin.registerbatch);
router.post('/createnewuser', admin.createnewuser);
router.get('/getsponsor', admin.sponsor);
router.get('/getcourse', admin.course);
router.post('/getbatchname', admin.getbatchname);
router.post('/upload', upload.single('file'), admin.uploadPdf);
router.post('/course/new', admin.addNewCourse);
router.post('/chapter/new', admin.addNewChapter);
router.post('/exam/new', admin.addNewExam);
router.get('/getchapter/:courseid', admin.chapter);
router.post('/question/new', admin.addNewQuestion);
router.get('/getuser/:firstuser/:lastuser', admin.getuser);
router.post('/activateuser', admin.activateuser);
router.get('/getbatch/:course/:sponsor', admin.getbatch);
router.get('/getByRole/:role', admin.c_getByRole);
router.get('/exam/:id/questions', admin.getExamQuestions);
// router.get('/getByRole/:role/', admin.);




// Update routes---------------------------------------------------------
router.patch('/course/update/:id', admin.updateCourse);
router.patch('/chapter/update/:id', admin.updateChapter);
router.patch('/chapter/exam/:id', admin.updateExam);

// Delete routes---------------------------------------------------------
router.delete('/course/delete/:id', admin.deleteCourse);
router.delete('/chapter/delete/:id', admin.deleteChapter);
router.delete('/chapter/exam/:id', admin.deleteExam);



//Bulk upload
router.post('/upload/user-data',upload.single('file'), admin.bulkUploadUserData);
router.post('/upload/exam-data',upload.single('file'), admin.bulkUploadExamQuestionsData);



export default router;