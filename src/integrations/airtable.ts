
import axios from 'axios';
import qs from 'querystring';
import Airtable from 'airtable';
import { Sort } from '../types/custom';
import { IUpdateAirtableData } from "../types/types";


const { AIRTABLE_BASE, AIRTABLE_KEY } = process.env;

if ((AIRTABLE_BASE === undefined) || (AIRTABLE_KEY === undefined)) {
    throw new Error("Need to provide initialization for AirTable");
}

// @ts-ignore
const base = new Airtable({apiKey: AIRTABLE_KEY}).base(AIRTABLE_BASE);

export const read = async (table: string, record_id: string, fields?: string[]) => {
    return new Promise((res,rej) => {
        base(table).find(record_id, (err, record) => {
            if (err) {
                if (err.statusCode === 404){
                    return res(undefined);
                }
                console.log({err})
                return rej(err);
            }

            if (record === undefined) {
                return rej(new Error("Record is undefined"));
            }

            if (fields !== undefined){
                return res({
                    id: record_id, 
                    ...Object.keys(record.fields)
                    .filter(key => fields.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = record.fields[key];
                        return obj;
                    }, {})});
            }

            return res({ id: record_id, ...record.fields });
        });
    });
}

export const find = async (table: string, filterByFormula?: string, fields?: string[], sort?: Sort[], view?: string) : Promise<any[]> => {
    const query = {
        filterByFormula,
        fields,
        sort,
        view
    };

    const cleanedQuery = JSON.parse(JSON.stringify(query)); // remove undefined optional parameters

    const records = await base(table).select(cleanedQuery).all();

    return records.map(record => ({
        id: record.id,
        ...record.fields,
    }));
}

export const update = async (table, data: IUpdateAirtableData[]) => {
    // assuming maximum one user updated at a time
    if (data.length > 1){
        throw new Error("Too many rows in Airtable update");
    }

    return new Promise((res,rej) => {
        base(table).update(data, function(err, record) {
            if (err) {
              console.error(err);
              return rej(err);
            }
            
            if (record) {
                return res({
                    id: record[0].id,
                    ...record[0].fields
                });
            }

            return res(undefined);
        });
    })
}

