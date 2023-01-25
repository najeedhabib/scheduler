import { spawn } from 'child_process';

export class ProcessManager {
  private process: any;

  constructor(command: string) {
    this.process = spawn(command);
    this.process.stdout.on('data', (data: any) => {
      console.log(`stdout: ${data}`);
  });
  this.process.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data}`);
  });
  }

  public isRunning(): boolean {
    return !!this.process.pid;
  }

  public kill(signal: string = 'SIGTERM'): void {
    this.process.kill(signal);
  }
  
  public async isStarted(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        this.process.on('error', (err: any) => {
            reject(err);
        });
        this.process.stdout.on('data', (data: any) => {
            resolve(data);
        });
        this.process.stderr.on('data', (data: any) => {
            resolve(data);
        });
    });
}
}