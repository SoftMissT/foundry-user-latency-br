import { cp, mkdir, rm } from 'node:fs/promises'

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })
await cp('src/lang', 'dist/lang', { recursive: true })
await cp('README.md', 'dist/README.md')
await cp('LICENSE', 'dist/LICENSE')
