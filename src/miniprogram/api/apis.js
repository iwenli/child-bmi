const request = require('request.js')

module.exports = {
  login: (code) => request.post('/mpapp/JsCode2Session?code=' + code),
  getHome: () => request.get('/mpapp/home'),
  getTrends: (type = 1, measure = 1) => request.get('/mpapp/getTrends', {
    type,
    measure
  }),
  getStatistics: (type = 1, sDate, eDate) => request.get('/mpapp/GetStatistics', {
    type,
    sDate,
    eDate
  }),
}