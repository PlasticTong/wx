// Import the Timsort algorithm
const { timSort } = require('./timsort.js');

Page({
  data: {
    values: [],
    sortedValues: [],
    plotData: [],
    scales: {
      x: [],
      y: [],
      color: []
    }
  },

  onLoad: function () {
    this.initValues();
    this.sortAndPlot();
  },

  initValues: function () {
    const numValues = 16;
    const values = Array.from({ length: numValues }, (_, i) => i + 1);
    this.setData({ values });
  },

  sortAndPlot: function () {
    const values = this.data.values.slice();
    const sortedValues = timSort(values);
    this.setData({ sortedValues });

    const maxTime = sortedValues.length;
    const width = 300;
    const height = 220;
    const lineWidth = 8;
    const jitter = 0.5;

    const scales = {
      values: this.createScale(values, 0.2, 0.8),
      x: this.createScale([0, maxTime], 0, width),
      y: this.createScale([0, values.length], 0, height),
      color: this.createColorScale(values)
    };

    const plotData = this.makePointsData(sortedValues, maxTime, scales);

    this.setData({ plotData, scales }, () => {
      this.drawPlot();
    });
  },

  drawPlot: function () {
    const ctx = wx.createCanvasContext('timsortCanvas', this);
    const { plotData, scales, lineWidth } = this.data;

    plotData.forEach(([index, points]) => {
      const color = scales.color(index);
      ctx.beginPath();
      ctx.setStrokeStyle(color);
      ctx.setLineWidth(lineWidth);
      points.forEach(([x, y], i) => {
        const scaledX = scales.x(x);
        const scaledY = scales.y(y);
        if (i === 0) {
          ctx.moveTo(scaledX, scaledY);
        } else {
          ctx.lineTo(scaledX, scaledY);
        }
      });
      ctx.stroke();
    });

    ctx.draw();
  },

  createScale: function (domain, rangeMin, rangeMax) {
    const scale = (value) => {
      const [domainMin, domainMax] = domain;
      return ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin) + rangeMin;
    };
    return scale;
  },

  createColorScale: function (values) {
    const colorScale = (value) => {
      const index = values.indexOf(value);
      return `hsl(${(index / values.length) * 360}, 100%, 50%)`;
    };
    return colorScale;
  },

  makePointsData: function (result, maxTime, scales) {
    const makePoints = (entries) => {
      const res = [entries[0]];
      for (let i = 1; i < entries.length; i++) {
        const a = entries[i - 1], b = entries[i];
        res.push([b[0] - jitter, a[1]]);
        res.push([b[0] + jitter, b[1]]);
      }
      res.push([maxTime, res[res.length - 1][1]]);
      return res;
    };

    return result.map((value, index) => [index, makePoints([[0, value]])]);
  }
});
