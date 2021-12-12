const venom = require('venom-bot');
const Builder = require('./Builder');
const TableService = require('./TableService');

function WhatsappService(options) {
  if (!WhatsappService.instance) {
    WhatsappService.instance = this; 
  }

  this.builder = new Builder()

  this.listContacts = async () => {
    let whatsappInstance
    try {
      whatsappInstance = await venom.create({ mkdirFolderToken: '/node_modules', folderNameToken: 'tokens'})
      const tableService = new TableService()
  
      const allContacts = await whatsappInstance.getAllContacts()
  
      const table = {
        headers: ['Name', 'ContactId'],
        colums: allContacts.filter(x => x.isMyContact).map(x => [x.name, x.id._serialized]) 
      }
  

      tableService.printSimpleTable(table.headers, table.colums)
    } catch (error) {
      console.log(error)
    } finally {
      whatsappInstance?.close()
      process.exit(0)
    }
  }

  this.sendApp = async () => {
    let whatsappInstance
    try {
      if (options.build) {
        await this.builder.buildReactNativeProject(options)
      }
      console.log("====== INICIANDO BOT WHATSAPP ======")
      whatsappInstance = await venom.create({ mkdirFolderToken: '/node_modules', folderNameToken: 'tokens' })
      
      const buildPath = `${options.path}android\\app\\build\\outputs\\apk\\release\\app-release.apk`
      console.log(`====== ENVIANDO ARQUIVO PARA ${options.user} ======`)
      await whatsappInstance.sendFile(options.user, buildPath, `${options.appName}.apk`)
      console.log(`====== ARQUIVO ENVIADO COM SUCESSO ======`)
    } catch (error) {
      console.log("==== SEND APP ERROR ====")
      console.log(error)
    } finally {
      whatsappInstance?.close()
      process.exit(0)
    }
  }

  return WhatsappService.instance
}

module.exports = WhatsappService
