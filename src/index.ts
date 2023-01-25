import { CSVparser, ProcessManager, Scheduler } from './modules';
import * as path from 'path';

const csvPath = path.resolve(__dirname, 'assets/data/customers.csv');
const commServicePath = resolveCommServiceBinaryPath('assets/binary/commservice');


(async () => {
  try {
    const commService = new ProcessManager(commServicePath);
    const isCommServiceStarted = await commService.isStarted();
    console.log(isCommServiceStarted.toString());
     const csv = new CSVparser;
    const invoices = await csv.readInvoicesCSV(csvPath);
    const scheduler = new Scheduler();
    const response = await scheduler.scheduleInvoices(invoices);
    commService.kill();
  } catch (error) {
    console.log(error);
  }
})();

function resolveCommServiceBinaryPath(dir: string): string{
  const OS = process.platform.toString();
  let ext = 'mac';
  if (OS == "darwin") {
      ext = "mac";
  } else if (OS == "win32" || OS == "win64") {
      ext = "windows";
  } else if (OS == "linux") {
      ext = "linux";
  }
  return path.resolve(__dirname, `${dir}.${ext}`)
}

