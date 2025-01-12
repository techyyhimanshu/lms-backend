import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
require('dotenv').config();


export const getReportDataBatchWiseService = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await sequelize.query(
            `call sp_reportByBatch(:inputBatchID,:inputCourseID)`,
            {
                replacements: { inputBatchID: data.batchId, inputCourseID: data.courseId },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};

export const getReportDataDateWiseService = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await sequelize.query(
            `call sp_reportByDate(:entryDate,:expiryDate,:inputCourseID)`,
            {
                replacements: {
                    entryDate: data.entryDate,
                    expiryDate: data.expiryDate,
                    inputCourseID: data.courseId
                },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};

export const getReportDataLoginWiseService = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await sequelize.query(
            `call sp_reportByLogin(:inputId)`,
            {
                replacements: {
                    inputId: data.id
                },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};