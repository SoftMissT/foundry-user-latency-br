import { readFile, writeFile } from 'node:fs/promises'

const pkg = JSON.parse(await readFile('package.json', 'utf8'))
const repository = 'https://github.com/SoftMissT/foundry-user-latency-br'

const manifest = {
  id: 'user-latency',
  title: 'Latência dos Usuários',
  description: pkg.description,
  version: pkg.version,
  compatibility: {
    minimum: '13',
    verified: '14'
  },
  authors: [
    {
      name: 'mawburn',
      email: 'mawburn7@gmail.com',
      url: 'https://github.com/mawburn'
    },
    {
      name: 'SoftMissT',
      url: 'https://github.com/SoftMissT'
    }
  ],
  esmodules: ['index.js'],
  styles: ['index.css'],
  languages: [
    { lang: 'en', name: 'English', path: 'lang/en.json' },
    { lang: 'pt-BR', name: 'Português (Brasil)', path: 'lang/pt-BR.json' },
    { lang: 'es', name: 'Español', path: 'lang/es.json' },
    { lang: 'fr', name: 'Français', path: 'lang/fr.json' },
    { lang: 'zh-CH', name: '简体中文', path: 'lang/zh-CH.json' },
    { lang: 'zh-TW', name: '正體中文', path: 'lang/zh-TW.json' }
  ],
  socket: true,
  url: repository,
  manifest: 'https://raw.githubusercontent.com/SoftMissT/foundry-user-latency-br/main/module.json',
  download: `${repository}/releases/download/v${pkg.version}/module.zip`,
  license: `${repository}/blob/main/LICENSE`,
  readme: `${repository}/blob/main/README.md`,
  bugs: `${repository}/issues`,
  changelog: `${repository}/releases`
}

await writeFile('module.json', `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile('dist/module.json', `${JSON.stringify(manifest, null, 2)}\n`)
