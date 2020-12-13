const App = require("@live-change/framework")
const app = new App()

const validators = require("../validation")

const definition = app.createServiceDefinition({
  name: "echo",
  validators
})

function sleep(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

definition.action({
  name: "echo",
  properties: {
    data: {
      type: String
    },
    delay: {
      type: Number
    }
  },
  async execute(params, { client, service }, emit) {
    await sleep(+params.delay)
    return params.data
  }
})

module.exports = definition

async function start() {
  app.processServiceDefinition(definition, [...app.defaultProcessors])
  await app.updateService(definition)//, { force: true })
  const service = await app.startService(definition, { runCommands: true, handleEvents: true })

  //require("../config/metricsWriter.js")(definition.name, () => ({}))
}

if (require.main === module) start().catch(error => {
  console.error(error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})