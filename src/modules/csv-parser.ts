import { InvoiceField } from "../dto/invoice-data.dto";
import { readFileSync } from "fs";

export class CSVparser{
    async readInvoicesCSV(path: string): Promise<InvoiceField[]> {
        let rows: string = '';
        try {
          rows = readFileSync(path).toString();
        } catch (error) {
          console.log(error);
          throw error;
        }
        return this.parseCSV(rows);
      }
      
      parseCSV(content: string): InvoiceField[]{
        let invoices: InvoiceField[] = [];  
        const rows = content.trim().split("\n")       
          // https://regexr.com/44u6o
          const regExp = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/g; // to avoid splitting inside double quotes
          if (rows.length > 0) {
            const headers = rows.shift()?.split(",");
            invoices = rows.map((row) => {
              const values = row.trim().split(regExp);
      
              const invoiceObject: { [key: string]: string } = {};
              for (let index = 0; index < headers!.length; index++) {
                invoiceObject[headers![index]] = values[index].replace(/"/g, "");
              }
              const invoice = invoiceObject as unknown as InvoiceField;
              return invoice;
            });
          }
       
        return invoices;
      }
}