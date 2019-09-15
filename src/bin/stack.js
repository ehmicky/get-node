// Some error message (e.g. when there is an HTTP error) include the stack trace
// in `error.message`. We don't show these on the CLI
export const removeStackTrace = function(message) {
  return message
    .split('\n')
    .filter(line => !isStackTrace(line))
    .join('\n')
}

const isStackTrace = function(line) {
  return STACK_TRACE_REGEXP.test(line)
}

const STACK_TRACE_REGEXP = /^\s*at .*/u
