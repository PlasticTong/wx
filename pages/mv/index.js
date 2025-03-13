// index.js
const histogramDouble = require('../test/histogarmDouble');
const statusSim = require('../test/status_sim');
const reviewSim = require('../test/review_sim');
const interOver = require('../test/inter_over');
Page({
  data: {
    inputValue: ''
  },
  onReady: function () {
    histogramDouble.drawStackedBarChart("stackedWaveChart")
    statusSim.drawStackedBarChart("stackedWaveChart2")
    reviewSim.drawStackedBarChart("stackedWaveChart3")
    interOver.drawStackedBarChart("stackedWaveChart4")
    interOver.drawStackedBarChart("stackedWaveChart5")
  }
  

})
