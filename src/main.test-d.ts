import getNode from 'get-node'
import { expectType, expectError } from 'tsd'

expectType<Promise<{ version: string; path: string }>>(getNode('14.0.0'))
await getNode('8')

await getNode('8', { output: 'node' })
await getNode('8', { progress: true })
await getNode('8', { mirror: 'https://npmmirror.com/mirrors/node' })
await getNode('8', { fetch: true })
await getNode('8', { arch: 'x64' })
await getNode('8', { cwd: '.' })
await getNode('8', { cwd: new URL('.', import.meta.url) })

expectError(getNode(14))
