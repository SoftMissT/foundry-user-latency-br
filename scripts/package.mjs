import { rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const archive = resolve('module.zip')
await rm(archive, { force: true })

const cli = resolve('node_modules/bestzip/bin/cli.js')
const result = spawnSync(process.execPath, [cli, '../module.zip', '*'], {
  cwd: resolve('dist'),
  encoding: 'utf8'
})

if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
if (result.status !== 0) throw new Error(`bestzip failed with exit code ${result.status}`)
