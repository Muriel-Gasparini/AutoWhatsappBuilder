#!/usr/bin/env node

const yargs = require("yargs");
const WhatsappService = require('./Services/WhatsappService');

const options = yargs
  .command('listContacts', '')
  .command('build', 'Build React Native Apk and send via Whatsapp')
  .example('AutoBuild --action build --path /path/to/root/project --user whatsappUserId')
  .example('AutoBuild --action listContacts --contactName filterListByContactName')
  .option("listContacts", { type: "boolean", describe: 'List all Whatsapp contacts', demandOption: false })
  .option("path", { alias: "p", type: "string", describe: 'Root directory path', demandOption: false })
  .option("user", { alias: "u", type: "string", describe: 'Whatsapp userId', demandOption: false })
  .option("contactName", { alias: "c", describe: 'Contact name to filter list', type: "string", demandOption: false })
  .option("branch", { alias: "b", type: "string", describe: 'Define which branch to build', demandOption: false })
  .epilog(`Muriel Gasparini - https://github.com/Muriel-Gasparini`)
  .argv;

const { listContacts, sendApp} = new WhatsappService(options)

const BUILDER_ACTIONS = {
  listContacts,
  sendApp
}

for (let action of Object.keys(BUILDER_ACTIONS)) {
  if (options[action]) {
    return BUILDER_ACTIONS[action]()
  }
}
