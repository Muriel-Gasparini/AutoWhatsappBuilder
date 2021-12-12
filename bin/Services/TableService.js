const Table = require('cli-table')

function TableService() {
  this.printSimpleTable = (headers, columns) => {
    const table = new Table({
      head: headers
    })

    table.push(...columns)

    console.log(table.toString())
  }
}

module.exports = TableService
