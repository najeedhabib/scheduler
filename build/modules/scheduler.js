"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const http_1 = __importDefault(require("http"));
class Scheduler {
    constructor() {
        this.post_options = {
            host: 'localhost',
            port: '9090',
            path: '/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        this.schedulerDelimiter = '-';
        this.remindersResponse = [];
    }
    async scheduleInvoices(invoices) {
        await Promise.all(invoices.map(async (invoice) => {
            const response = await this.scheduleInvoice(invoice);
            this.remindersResponse.push(response);
        }));
        return this.remindersResponse;
    }
    async scheduleInvoice(invoice) {
        var _a;
        const schedules = (_a = invoice.schedule) === null || _a === void 0 ? void 0 : _a.split(this.schedulerDelimiter);
        let invoiceResponse = {
            email: "",
            text: "",
            paid: false
        };
        for (let index = 0; index < schedules.length; index++) {
            let schedule = parseInt(schedules[index]);
            if (index) {
                schedule = schedule - parseInt(schedules[index - 1]);
            }
            console.log(`Scheduling invoice for user: ${invoice.email} and schedule: ${invoice.schedule}. Waiting time: ${schedule}`);
            await new Promise(resolve => setTimeout(resolve, schedule * 1000));
            console.log(`Trying to send reminder for user: ${invoice.email} with text: ${invoice.text} and waited for ${schedule}`);
            try {
                invoiceResponse = await this.sendReminder(invoice, this.post_options);
                console.log(`Reminder successfully sent. Sender responded with: ${JSON.stringify(invoiceResponse)}`);
                if (invoiceResponse.paid) {
                    console.log(`Invoice paid by user: ${invoice.email} on ${index + 1} attempt. Schedules were: ${schedules}`);
                    break;
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        return invoiceResponse;
    }
    async sendReminder(invoice, options) {
        return new Promise((resolve, reject) => {
            const request = http_1.default.request(options, response => {
                const chunks = [];
                response.on('data', data => chunks.push(data));
                response.on('end', () => {
                    let responseBody = Buffer.concat(chunks).toString();
                    resolve(JSON.parse(responseBody));
                });
            }).on('error', (error) => {
                console.log(`${error}`);
                reject('Error');
            });
            request.write(JSON.stringify(invoice));
            request.end();
        });
    }
}
exports.Scheduler = Scheduler;
