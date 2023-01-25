"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVparser = void 0;
const fs_1 = require("fs");
class CSVparser {
    async readInvoicesCSV(path) {
        let rows = '';
        try {
            rows = (0, fs_1.readFileSync)(path).toString();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        return this.parseCSV(rows);
    }
    parseCSV(content) {
        var _a;
        let invoices = [];
        const rows = content.trim().split("\n");
        // https://regexr.com/44u6o
        const regExp = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/g; // to avoid splitting inside double quotes
        if (rows.length > 0) {
            const headers = (_a = rows.shift()) === null || _a === void 0 ? void 0 : _a.split(",");
            invoices = rows.map((row) => {
                const values = row.trim().split(regExp);
                const invoiceObject = {};
                for (let index = 0; index < headers.length; index++) {
                    invoiceObject[headers[index]] = values[index].replace(/"/g, "");
                }
                const invoice = invoiceObject;
                return invoice;
            });
        }
        return invoices;
    }
}
exports.CSVparser = CSVparser;
