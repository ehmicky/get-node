import getNode, { Options, NodeBinary, SemverVersion } from 'get-node'
import {
  expectType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from 'tsd'

const nodeBinary = await getNode('14')
expectError(getNode(14))

await getNode('14', {})
expectAssignable<Options>({})
expectError(await getNode('14', true))
expectError(await getNode('14', { unknown: true }))

await getNode('14', { output: 'node' })
expectAssignable<Options>({ output: 'node' })
expectError(await getNode('14', { output: true }))

await getNode('14', { progress: true })
expectAssignable<Options>({ progress: true })
expectError(await getNode('14', { progress: 'true' }))

await getNode('14', { mirror: 'https://example.com' })
expectAssignable<Options>({ mirror: 'https://example.com' })
expectError(await getNode('14', { mirror: true }))

await getNode('14', { fetch: true })
await getNode('14', { fetch: undefined })
expectAssignable<Options>({ fetch: true })
expectError(getNode('14', { fetch: 'true' }))

await getNode('14', { arch: 'x64' })
expectAssignable<Options>({ arch: 'x64' })
expectError(await getNode('14', { arch: true }))
expectError(await getNode('14', { arch: 'unknownArch' }))

await getNode('14', { cwd: '.' })
expectAssignable<Options>({ cwd: '.' })
expectAssignable<Options>({ cwd: new URL('file://example.com') })
expectError(await getNode('14', { cwd: true }))

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
