const ChildProcess = require('../Utils/ChildProcess')

function Builder() {
  
  this.childProcess = new ChildProcess()

  this.buildReactNativeProject = async (options) => {
    try {
      console.warn("======= BUILD STARTING ======")

      if (options.branch) {
        await this.updateGitRepository(options)
      }

      await this.childProcess.promiseSpawn('gradlew.bat', ['assembleRelease'], { cwd: `${options.path}android` })
      
      console.log("======= BUILD DONE! ======")
    } catch (error) {
      console.error("======= BUILD ERROR ======")
      console.log(error)
    }
  }

  this.updateGitRepository = async (options) => {
    try {
      console.warn("======= UPDATING PROJECT ======")

      const cwd = `${options.path}`

      await this.childProcess.promiseSpawn('git', ['fetch'], { cwd })
      await this.childProcess.promiseSpawn('git', ['checkout', `${options.branch}`], { cwd })
      await this.childProcess.promiseSpawn('git', ['pull', 'origin', `${options.branch}`], { cwd })
      
      console.log("======= PROJECT DONE UPDATED! ======")
    } catch (error) {
      console.error("======= PROJECT UPDATE ERROR ======")
      console.log(error)
    }
  }
}

module.exports =  Builder