"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
const path = __importStar(require("path"));
const csvPath = path.resolve(__dirname, 'assets/data/customers.csv');
const commServicePath = resolveCommServiceBinaryPath('assets/binary/commservice');
(async () => {
    try {
        const commService = new modules_1.ProcessManager(commServicePath);
        const isCommServiceStarted = await commService.isStarted();
        console.log(isCommServiceStarted.toString());
        const csv = new modules_1.CSVparser;
        const invoices = await csv.readInvoicesCSV(csvPath);
        const scheduler = new modules_1.Scheduler();
        const response = await scheduler.scheduleInvoices(invoices);
        commService.kill();
    }
    catch (error) {
        console.log(error);
    }
})();
function resolveCommServiceBinaryPath(dir) {
    const OS = process.platform.toString();
    let ext = 'mac';
    if (OS == "darwin") {
        ext = "mac";
    }
    else if (OS == "win32" || OS == "win64") {
        ext = "windows";
    }
    else if (OS == "linux") {
        ext = "linux";
    }
    return path.resolve(__dirname, `${dir}.${ext}`);
}
