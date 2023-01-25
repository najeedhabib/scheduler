import { InvoiceField } from "../dto/invoice-data.dto";
import { Response } from "../dto/response.dto";
import http from 'http';
export class Scheduler{

    private readonly post_options = {
        host: 'localhost',
        port: '9090',
        path: '/messages',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    private readonly schedulerDelimiter = '-';
    private remindersResponse: Response[] = [];
    async scheduleInvoices(invoices: InvoiceField[]): Promise<Response[]> {
        await Promise.all(
            invoices.map( async invoice => {
                const response = await this.scheduleInvoice(invoice);
                this.remindersResponse.push(response);
            } )
        )
        return this.remindersResponse;
    }
    
    private async scheduleInvoice(invoice: InvoiceField): Promise<Response> {
        const schedules = invoice.schedule?.split(this.schedulerDelimiter);
        let invoiceResponse: Response = {
            email: "",
            text: "",
            paid: false
        }
        for (let index = 0; index < schedules!.length; index++) {
            let schedule = parseInt(schedules[index])
            if(index){
                schedule = schedule - parseInt(schedules[index - 1])
            }
            console.log(`Scheduling invoice for user: ${invoice.email} and schedule: ${invoice.schedule}. Waiting time: ${schedule}`)
            await new Promise(resolve => setTimeout(resolve, schedule * 1000));
            console.log(`Trying to send reminder for user: ${invoice.email} with text: ${invoice.text} and waited for ${schedule}`)
            try {
                invoiceResponse = await this.sendReminder(invoice, this.post_options);
                console.log(`Reminder successfully sent. Sender responded with: ${JSON.stringify(invoiceResponse)}`)
                if(invoiceResponse.paid){
                    console.log(`Invoice paid by user: ${invoice.email} on ${index+1} attempt. Schedules were: ${schedules}`);
                    break;
                }
            } catch (error) {
                console.log(error);
            }
            
        }
        return invoiceResponse;
    }

    private async sendReminder(invoice: InvoiceField, options: object): Promise<Response> {
        return new Promise((resolve,reject) => {
            const request = http.request( options, response => {
                const chunks: any[] = [];
                response.on('data', data => chunks.push(data))
                response.on('end', () => {
                    let responseBody = Buffer.concat(chunks).toString();
                    resolve(JSON.parse(responseBody) as unknown as Response)
                })                
            }).on('error', (error)=>{
                console.log(`${error}`);
                reject('Error')
            })
            request.write(JSON.stringify(invoice));
            
            request.end();
        });
    }
}
