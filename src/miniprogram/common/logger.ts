var log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;
// log?.error('init');

function consolePrint(type: 'log' | 'warn' | 'error', args: any[]) {
  const prefix = '[logger]'
  console[type]?.(prefix, ...args)
}
export default {
  info(...args: any[]) {
    consolePrint('log', args)
    if (!log) return
    log.info.apply(log, args)
  },

  warn(...args: any[]) {
    consolePrint('warn', args)
    if (!log) return
    log.warn.apply(log, args)
  },

  error(...args: any[]) {
    consolePrint('error', args)
    if (!log) return
    log.error.apply(log, args)
  },

  setFilterMsg(msg = '') {
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  },

  addFilterMsg(msg = '') {
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    log.addFilterMsg(msg)
  }
}