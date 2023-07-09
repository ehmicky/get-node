import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import getNode, {
  type Options,
  type NodeBinary,
  type SemverVersion,
} from 'get-node'

const nodeBinary = await getNode('14')
const NODE_VERSION = 14
// @ts-expect-error
await getNode(NODE_VERSION)

await getNode('14', {})
expectAssignable<Options>({})
// @ts-expect-error
await getNode('14', true)
// @ts-expect-error
await getNode('14', { unknown: true })

await getNode('14', { output: 'node' })
expectAssignable<Options>({ output: 'node' })
// @ts-expect-error
await getNode('14', { output: true })

await getNode('14', { progress: true })
expectAssignable<Options>({ progress: true })
// @ts-expect-error
await getNode('14', { progress: 'true' })

await getNode('14', { mirror: 'https://example.com' })
expectAssignable<Options>({ mirror: 'https://example.com' })
// @ts-expect-error
await getNode('14', { mirror: true })

await getNode('14', { signal: AbortSignal.abort() })
expectAssignable<Options>({ signal: AbortSignal.abort() })
// @ts-expect-error
await getNode('14', { signal: 'signal' })

await getNode('14', { fetch: true })
await getNode('14', { fetch: undefined })
expectAssignable<Options>({ fetch: true })
// @ts-expect-error
await getNode('14', { fetch: 'true' })

await getNode('14', { arch: 'x64' })
expectAssignable<Options>({ arch: 'x64' })
// @ts-expect-error
await getNode('14', { arch: true })
// @ts-expect-error
await getNode('14', { arch: 'unknownArch' })

await getNode('14', { cwd: '.' })
expectAssignable<Options>({ cwd: '.' })
expectAssignable<Options>({ cwd: new URL('file://example.com') })
// @ts-expect-error
await getNode('14', { cwd: true })

expectAssignable<SemverVersion>('1.2.3')
expectAssignable<SemverVersion>('0.0.1')
expectAssignable<SemverVersion>('10.10.10')
expectAssignable<SemverVersion>('1.2.3-beta')
expectNotAssignable<SemverVersion>('1.2.a')
expectNotAssignable<SemverVersion>('1.2')
expectNotAssignable<SemverVersion>('1')

expectType<NodeBinary>(nodeBinary)
const { path, version } = nodeBinary
expectType<string>(path)
expectType<SemverVersion>(version)
