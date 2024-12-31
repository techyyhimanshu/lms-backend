import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
export const getNextSequence = async (org_id: any): Promise<any> => {
    try {
        const result = await sequelize.query(`Select max(SEQUENCE) as sequence from CONTENTSTATIC where ORGSTRUCTUREID=${org_id}`, {
            type: QueryTypes.SELECT
        })
        return result[0].sequence
    } catch (error) {
        let er: any = error;
        throw er;
    }
}