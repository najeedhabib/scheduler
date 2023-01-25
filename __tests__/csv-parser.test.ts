import { InvoiceField } from "../src/dto/invoice-data.dto";
import { CSVparser } from "../src/modules";


describe("CSVParser", () => {
  let csvParser: CSVparser;

  beforeEach(() => {
    csvParser = new CSVparser();
  });

  it("readInvoicesCSV should read the contents of a CSV file and parse it into an array of InvoiceFields", async () => {
    const path = `${__dirname}/data/testCustomers.csv`;;
    
    const expectedInvoices: InvoiceField[] = [
      { email: "test1@example.com", text: "Test Invoice", schedule: "1s-2s-3s" },
      { email: "test2@example.com", text: "Another Invoice", schedule: "1s-2s-3s" }
    ];

    const invoices = await csvParser.readInvoicesCSV(path);

    expect(invoices).toEqual(expectedInvoices);
  });
  
  it("parseCSV should parse the contents of a CSV file into an array of InvoiceFields", async () => {
    const mockRows = "email,text,schedule\ntest1@example.com,\"Test Invoice\",\"2022-10-01\"\ntest2@example.com,\"Another Invoice\",\"2022-11-01\"";
    const expectedInvoices: InvoiceField[] = [
      { email: "test1@example.com", text: "Test Invoice", schedule: "2022-10-01" },
      { email: "test2@example.com", text: "Another Invoice", schedule: "2022-11-01" }
    ];

    const invoices = csvParser.parseCSV(mockRows);

    expect(invoices).toEqual(expectedInvoices);
  });
});