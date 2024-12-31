import { ErrorRequestHandler, RequestHandler } from "express";
import queAnsService from '../_services/queAnsService';
import createHttpError from "http-errors";
import response from "../_middlewares/response";
import { messaging } from "firebase-admin";

const addQuestion: RequestHandler = async (req, res, next) => {
    try {
        //debugger
        const  {question} = req.body;
        const  userId: string = req.header('Data') as string;

        if(userId == undefined || question == undefined){
            throw new Error("userId or question is required")
        }
        let result: any = await queAnsService.queryQuestion(question,userId)

        let questionDeatil: any = result
        res.json({ message: 'Question added successfully', data: questionDeatil });


    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const getAnsweredQuestions: RequestHandler = async (req, res, next) => {
    try {
        const  userId: string = req.header('Data') as string;
        if(userId == undefined  ){
            throw new Error("userId or question is required")
        }      
        let result: any = await queAnsService.getAnsweredTutorQuery(userId)
        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                Question: result.question,
                Answer: result.answer,
                AnsweredOn : result.answerDate,
                AskBy : result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }});
        res.status(200).json(response.success(questionDeatil));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }
};

const getUnansweredQuestions: RequestHandler = async (req, res, next) => {
    try {
        const  userId: string = req.header('Data') as string;
        if(userId == undefined  ){
            throw new Error("userId or question is required")
        }      
        let result: any = await queAnsService.getUnansweredTutorQuery(userId)
        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                Question: result.question,
                AskBy : result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }});
        res.status(200).json(response.success(questionDeatil));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }
};

const giveQueryAnswer: RequestHandler = async (req, res, next) => {
    try {
        const  userId: string = req.header('Data') as string;
        if(userId == undefined || req.body.questionId == undefined || req.body.answer == undefined){
            throw new Error("userId, questionId and answer is required")
        }      
        let result: any = await queAnsService.answerQuery(userId,req.body.answer,req.body.questionId)
        let questionDeatil: any = result; 
        res.status(200).json(response.success(questionDeatil));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }
};


const getAllQuestions: RequestHandler = async (req, res, next) => {
    try {
        const  userId: string = req.header('Data') as string;
        if(userId == undefined  ){
            throw new Error("userId or question is required")
        }      
        let result: any = await queAnsService.getAllTutorQuery(userId)
        // console.log("result",result);
        
        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                Question: result.question,
                Answer: result.answer,
                AnsweredOn : result.answerDate,
                AskBy : result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }});
        
        res.status(200).json(response.success(questionDeatil));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }
};

const getAllStuQuestions: RequestHandler = async (req, res, next) => {
    try {
        const  userId : any = req.header('Data') as string;
        if(userId == undefined  ){
            throw new Error("userId or question is required")
        }      
        let result: any = await queAnsService.getAllStuQuery(userId)
        // console.log("result",result);
        
        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                TutorId: result.tutorURN,
                Question: result.question,
                Answer: result.answer,
                AnsweredOn : result.answerDate,
                AskBy : result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }});
        
        res.status(200).json(response.success(questionDeatil));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }
};


export default {
    addQuestion,
    getAnsweredQuestions,
    getUnansweredQuestions,
    getAllQuestions,
    giveQueryAnswer,
    getAllStuQuestions
}


