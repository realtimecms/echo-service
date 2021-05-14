const app = require("@live-change/framework").app()

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
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  })

  app.processServiceDefinition(definition, [...app.defaultProcessors])
  await app.updateService(definition)//, { force: true })
  const service = await app.startService(definition, { runCommands: true, handleEvents: true })

  //require("../config/metricsWriter.js")(definition.name, () => ({}))
}

if (require.main === module) start().catch(error => {
  console.error(error)
  process.exit(1)
})

