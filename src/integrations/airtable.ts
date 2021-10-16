
import axios from 'axios';
import qs from 'querystring';
import Airtable from 'airtable';
import { Sort } from '../types/custom';

const { AIRTABLE_BASE, AIRTABLE_KEY } = process.env;

if ((AIRTABLE_BASE === undefined) || (AIRTABLE_KEY === undefined)) {
    throw new Error("Need to provide initialization for AirTable");
}

// @ts-ignore
const base = new Airtable({apiKey: AIRTABLE_KEY}).base(AIRTABLE_BASE);

export const read = async (table: string, record_id: string) => {
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

            return res(record.fields);
        });
    });
}

export const find = async (table: string, filterByFormula: string, fields: string[]|undefined = undefined, sort: Sort[]|undefined, view: string|undefined, useString: boolean) => {
    const query = useString ? {
        filterByFormula,
        fields,
        sort,
        cellFormat: 'string',
        userLocale: 'en-ca',
        timeZone: 'America/Toronto',
    } : {
        filterByFormula,
        fields,
        sort,
        view
    };
    return new Promise((res,rej) => {
        base(table).select(query).firstPage((err, records) => {
            console.info(err, records);
            if (err) {
                if (err.statusCode === 404){
                    return res(undefined);
                }
                console.log({err})
                return rej(err);
            }

            if (records === undefined) {
                return rej(new Error("Record is undefined"));
            }

            return res(records.map(record => ({
                id: record.id,
                ...record.fields,
            })));
        });
    });
}

export const write = async (table, data) => {
    return new Promise((res,rej) => {
        base(table).create(data, {typecast: true}, function(err, record) {
            if (err) {
              console.error(err);
              return rej(err);
            }
            if (record) {
                return res(record.fields);
            }
            return res(undefined);
        });
    })
}

