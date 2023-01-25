"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessManager = void 0;
const child_process_1 = require("child_process");
class ProcessManager {
    constructor(command) {
        this.process = (0, child_process_1.spawn)(command);
        this.process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        this.process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    }
    isRunning() {
        return !!this.process.pid;
    }
    kill(signal = 'SIGTERM') {
        this.process.kill(signal);
    }
    async isStarted() {
        return new Promise((resolve, reject) => {
            this.process.on('error', (err) => {
                reject(err);
            });
            this.process.stdout.on('data', (data) => {
                resolve(data);
            });
            this.process.stderr.on('data', (data) => {
                resolve(data);
            });
        });
    }
}
exports.ProcessManager = ProcessManager;
