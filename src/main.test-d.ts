import getNode from 'get-node'
import { expectType, expectError } from 'tsd'

expectType<Promise<{ version: string; path: string }>>(getNode('14.0.0'))
expectType<Promise<{ version: string; path: string }>>(getNode('8'))

expectType<Promise<{ version: string; path: string }>>(getNode('8', {
	arch: 'x64'
}))

expectType<{ version: string; path: string }>(await getNode('8', {
	mirror: 'https://npm.taobao.org/mirrors/node'
}))

expectError(getNode(14))
