const spawn = require('child-process-promise').spawn

function ChildProcess() {
  this.promiseSpawn = async(command, args, options) => {
    try {
      const buildPromise = spawn(command, args, options);
      const buildChildProcess = buildPromise.childProcess;

      buildChildProcess.stdout.on('data', data => console.log(data.toString()));
      buildChildProcess.stderr.on('data', data => console.log(data.toString()));
      buildChildProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });

      await buildPromise;
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ChildProcess
