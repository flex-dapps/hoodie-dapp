import { writable, readable, get } from 'svelte/store'

const terminal = {
  DEFAULT_HANDLER_KEY: '_DEFAULT',
  paras: writable([]),
  prompt: writable(''),
  updateInterval: writable(100),
  handlers: {},
  setHandlers: obj => {
    terminal.handlers = obj
  },
  handle: input => {
    if (terminal.handlers[input]) {
      terminal.handlers[input](input)
    } else if (terminal.handlers[terminal.DEFAULT_HANDLER_KEY]) {
      terminal.handlers[terminal.DEFAULT_HANDLER_KEY](input)
    } else {
      terminal.defaultHandler(input)
    }
  },
  defaultHandler: input => {
    if (!input) return terminal.update([``])
    terminal.update([`Command "${input}" not recognised`])
  },
  update: (newParas, callback) => {
    const paras = newParas
    let interval = setInterval(() => {
      if (paras.length === 0) {
        if (callback) callback()
        return clearInterval(interval)
      }
      terminal.paras.update(p => {
        p.push(paras.shift())
        return p
      })
    }, get(terminal.updateInterval))
  }
}

export default terminal
