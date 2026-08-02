import { access, readFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile('dist/module.json', 'utf8'))
const pkg = JSON.parse(await readFile('package.json', 'utf8'))

if (manifest.version !== pkg.version) throw new Error('package.json and module.json versions differ.')
if (manifest.compatibility.minimum !== '13' || manifest.compatibility.verified !== '14') {
  throw new Error('Foundry VTT compatibility must be minimum 13 and verified 14.')
}
if (manifest.title !== 'Latência dos Usuários') throw new Error('The module title must be in Portuguese.')
if (manifest.manifest !== 'https://raw.githubusercontent.com/SoftMissT/foundry-user-latency-br/main/module.json') {
  throw new Error('The manifest URL must use the stable raw main URL.')
}
if (manifest.download !== `https://github.com/SoftMissT/foundry-user-latency-br/releases/download/v${pkg.version}/module.zip`) {
  throw new Error('The download URL must point to the current versioned release asset.')
}

for (const path of ['dist/index.js', 'dist/index.css', 'dist/lang/pt-BR.json', 'dist/LICENSE', 'dist/README.md']) {
  await access(path)
}

console.info(`Package validation passed for Foundry VTT v14: ${manifest.id} v${manifest.version}.`)
