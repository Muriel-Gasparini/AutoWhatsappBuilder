#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const venom = require('venom-bot');
const yargs = require("yargs");

const options = yargs
  .command('listContacts', 'List all Whatsapp contacts')
  .command('build', 'Build React Native Apk and send via Whatsapp')
  .example('AutoBuild --action build --path /path/to/root/project --user whatsappUserId')
  .example('AutoBuild --action listContacts --contactName filterListByContactName')
  .alias('a', 'action')
  .describe('a', 'define which action to do')
  .alias('p', 'path')
  .describe('p', 'Root directory path')
  .alias('u', 'user')
  .describe('u', 'Whatsapp userId')
  .alias('c', 'contactName')
  .describe('c', 'Contact name to filter list')
  .option("action", { alias: "action", type: "string", demandOption: true })
  .option("path", { alias: "path", type: "string", demandOption: false })
  .option("user", { alias: "user", type: "string", demandOption: false })
  .option("contactName", { alias: "contactName", type: "string", demandOption: false })
  .epilog(`Muriel Gasparini - https://github.com/Muriel-Gasparini`)
  .argv;

const BUILDER_ACTIONS = {
  BUILD: 'build',
  LIST_CONTACTS: 'listContacts',
}

switch (options.action) {
  case BUILDER_ACTIONS.BUILD:
    buildAndSend()
    break;
  case BUILDER_ACTIONS.LIST_CONTACTS:
    listContacts()
    break;
  default:
    console.log("no action specified, exiting ...")
    console.log("All available actions:")
    Object.keys(BUILDER_ACTIONS).forEach(x => console.log(BUILDER_ACTIONS[x]))
    process.exit(1)
}

async function listContacts() {
  const botInstance = await venom.create()
  const allContacts = await botInstance.getAllContacts()
  const filteredContacts = allContacts
  if (options.contactName) {
    return console.log(filteredContacts
      .filter(x => x.isMyContact && new RegExp(options.contactName).test(x.name))
      .map(y => ({ user: y.id._serialized, name: y.name })))
  }
  console.log(filteredContacts
    .filter(x => x.isMyContact)
    .map(y => ({ user: y.id._serialized, name: y.name })))
}

async function buildAndSend() {
  try {
    const botInstance = await venom.create()
    console.log("INITIALING BUILD PLEASE AWAIT...")
    const execBuildCommand = await exec(`cd ${options.path} && cd android && "./gradlew" assembleRelease`)

    if (execBuildCommand.stderr) {
      throw execBuildCommand.stderr
    }

    console.log("STDOUT INIT")
    console.log(execBuildCommand.stdout)
    console.log("STDOUT END")

    console.log("SENDING TO WHATSAPP CONTACT")

    const buildPath = `${options.path}\\android\\app\\build\\outputs\\apk\\release\\app-release.apk`
    await botInstance.sendFile(options.user, buildPath, 'app-release.apk')

    console.log("SUCESS!")
    process.exit(1)
  } catch (error) {
    console.log(error)
  }
}
