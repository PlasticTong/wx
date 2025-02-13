// index.js
const d3 = require('../../utils/d3.v7.min.js'); // 确保路径正确

Page({
  data: {
    history: ([
      [1, [[0, 0], [1, 2], [2, 2], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]]],
      [2, [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]]],
      [3, [[0, 2], [1, 0], [2, 0], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]]],
      [4, [[0, 3], [1, 3], [2, 3], [3, 3], [4, 5], [5, 3], [6, 5], [7, 3]]],
      [5, [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]]],
      [6, [[0, 5], [1, 5], [2, 5], [3, 5], [4, 3], [5, 5], [6, 3], [7, 5]]],
      [7, [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]]],
      [8, [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]]],
      [9, [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]]],
      [10, [[0, 9], [1, 9], [2, 10], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9]]],
      [11, [[0, 10], [1, 10], [2, 9], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10]]],
      [12, [[0, 11], [1, 11], [2, 11], [3, 11], [4, 11], [5, 11], [6, 11], [7, 11]]],
      [13, [[0, 12], [1, 12], [2, 12], [3, 12], [4, 12], [5, 12], [6, 12], [7, 12]]],
      [14, [[0, 13], [1, 13], [2, 13], [3, 13], [4, 13], [5, 13], [6, 13], [7, 13]]],
      [15, [[0, 14], [1, 14], [2, 14], [3, 14], [4, 14], [5, 14], [6, 14], [7, 14]]],
      [16, [[0, 15], [1, 15], [2, 15], [3, 15], [4, 15], [5, 15], [6, 15], [7, 15]]]
    ]),
    time: 10,
    params: {
      numValues: 16,
      lineWidth: 10,
      jitter: 0.5,
      // height: 220,
      // width: 400,
      customColors: [
        "#FF5733", // 红橙色
        "#33FF57", // 绿色
        "#3357FF", // 蓝色
        "#FF33A1", // 粉红色
        "#FFBD33", // 橙黄色
        "#8C33FF", // 紫色
        "#33FFF0", // 青色
        "#FF334B", // 红色
        "#33FF9D", // 浅绿色
        "#FF8F33", // 橙色
        "#33B2FF", // 浅蓝色
        "#FF33E1", // 深粉色
        "#FFD333", // 黄色
        "#A133FF", // 深紫色
        "#33FFF7", // 浅青色
        "#FF3374"  // 深红色
      ]
    },
    linesInfo: []
  },
  constructor() {
    this.linesInfo = [];
  },

  onReady: function () {
    // 基础设置
    let res = this.makePlotSettings(this.data.history)
    // 绘画数据
    let dataForDraw = this.makePointsData(this.data.history, res.maxTime)
    // 绘画
    this.drawline(dataForDraw)
    // this.drawLineForCut(dataForDraw,1, 0, 1.5)
    // const test = this.swapIndexAandIndexB(dataForDraw, 0, 2)
    // this.drawLineForCut(test,1, 1.5, 2.5)
  },
  initcanvas: function () {
    wx.createSelectorQuery()
      .select('#myCanvas') // 在 WXML 中填入的 id
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        // console.log(res)
        // Canvas 对象
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        // console.log(dpr)
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        // 清空画布
        ctx.clearRect(0, 0, width, height)

        // 绘制红色正方形
        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(10, 10, 50, 50);

        // 绘制蓝色半透明正方形
        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(30, 30, 50, 50);
      })

  },
  // 新的函数来交换每个子数组的指定索引a和索引b的数据点使用 push 方法
  swapIndexAandIndexB: function (data, indexA, indexB) {
    const series = []
    for (let i = 0; i < data.length; i++) {
      if (i === indexA) {
        series.push(data[indexB]);
      } else if (i === indexB) {
        series.push(data[indexA]);
      } else {
        series.push(data[i]);
      }
    }
    return series
  },
  makePlotSettings: function (results, width, height) {
    const maxTime = this.data.time;
    const scales = {
      x: d3.scaleLinear().domain([0, maxTime]).range([0, width]),
      y: d3.scaleLinear().domain([0, results.length]).range([0, height]),
      // color: d3.interpolateRdYlBu
      // // color: d3.interpolatePuBuGn
      color: d3.interpolateYlGnBu
    };
    return { maxTime, scales }
  },
  makePointsData: function (history, maxTime) {
    let that = this
    function makePoints(entries) {
      const res = [entries[0]];
      for (let i = 1; i < entries.length; i++) {
        const a = entries[i - 1], b = entries[i];
        res.push([b[0] - that.data.params.jitter, a[1]]);
        res.push([b[0] + that.data.params.jitter, b[1]]);
      }
      res.push([maxTime, res[res.length - 1][1]]);
      return res;
    }

    return history.map(([k, v]) => [k, makePoints(v)]);
  },
  drawline: function (data) {
    const query = wx.createSelectorQuery();
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          console.error('Canvas not found or invalid.');
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFB6C1';


        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        // 清空画布
        ctx.clearRect(0, 0, width, height)
        // 设置背景颜色以便确认 Canvas 显示区域
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        const values = Array.from(this.data.history.keys());
        const plotSettings = this.makePlotSettings(values, width, height);
        const { scales } = plotSettings;


        this.drawLineForCut(data, scales, ctx, 1, 0, 0, 1100);

        this.drawLineForCut(data, scales, ctx, 0, 1, 0, 1.5);

        let test = this.swapIndexAandIndexB(data, 0, 2);
        this.drawLineForCut(test, scales, ctx, 0, 1, 1.5, 2.5);

        let test_1 = this.swapIndexAandIndexB(test, 10, 9);
        this.drawLineForCut(test_1, scales, ctx, 0, 1, 2.5, 4.5);

        let test2 = this.swapIndexAandIndexB(data, 3, 5);
        this.drawLineForCut(test2, scales, ctx, 0, 1, 4.5, 5.5);

        let test3 = this.swapIndexAandIndexB(test2, 3, 5);
        this.drawLineForCut(test3, scales, ctx, 0, 1, 5.5, 6.5);

        let test4 = this.swapIndexAandIndexB(test3, 3, 5);
        this.drawLineForCut(test4, scales, ctx, 0, 1, 6.5, 10);

        console.log('Drawing completed.');



      });


  },
  drawLineForCut: function (data, scales, ctx, border, tf, a, b) {
    let filteredData = data
    if (tf == 1) {
      filteredData = []
      // 过滤数据，只保留 x 值在 a 到 b 之间的点
      filteredData = data.map(series => [
        series[0],
        series[1].filter(point => point[0] >= a && point[0] <= b)
      ]);
    }

    filteredData.forEach((series, i) => {

      const points = series[1].map(([t, y]) => ({
        x: scales.x(t),
        y: scales.y(y) + 20,
        originalT: t,
        originalY: y
      }));



      if (points.length === 0) {
        console.warn(`No points for series ${i + 1}`);
        return;
      }
      if (border == 1) {
        // 绘制边框线
        ctx.beginPath();
        ctx.lineWidth = this.data.params.lineWidth + 5;
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        points.forEach((point, j) => {
          if (j === 0) {
            ctx.moveTo(point.x, point.y - this.data.params.lineWidth);
          } else {
            ctx.lineTo(point.x, point.y - this.data.params.lineWidth);
          }
        });
        ctx.stroke();

      } else {
        // 绘制填充线
        ctx.beginPath();
        ctx.lineWidth = this.data.params.lineWidth;
        ctx.strokeStyle = this.data.params.customColors[series[0] - 1];
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        points.forEach((point, j) => {

          if (j === 0) {
            ctx.moveTo(point.x, point.y - this.data.params.lineWidth);
          } else {
            ctx.lineTo(point.x, point.y - this.data.params.lineWidth);
            const prevPoint = points[j - 1];
            // 存储每条线段的信息
            this.data.linesInfo.push({
              name:series[0],
              startX: prevPoint.x,
              startY: prevPoint.y,
              endX: point.x,
              endY: point.y,
              t1: prevPoint.originalT,
              y1: prevPoint.originalY,
              t2: point.originalT,
              y2: point.originalY
            });
          }

        });
        ctx.stroke();

      }




    });



  },

  handleClick: function () {
    console.log("adsadas");
    console.log(this.data.linesInfo);


  },
  handleCanvasTap: function (event) {
    const x = event.detail.x;
    const y = event.detail.y-440;


    // 查找点击位置最近的线段
    const nearestLine = this.findNearestLine(x, y);
    if (nearestLine) {
      wx.showToast({
        title: `Clicked on line between (${nearestLine.t1}, ${nearestLine.y1}) and (${nearestLine.t2}, ${nearestLine.y2}),name(${nearestLine.name})`,
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: "No line clicked.",
        icon: 'none'
      });
    }
  },
  findNearestLine: function (x, y) {
    let minDistance = Infinity;
    let nearestLine = null;

    this.data.linesInfo.forEach(line => {
      const distance = this.distancePointToSegment(x, y, line.startX, line.startY, line.endX, line.endY);
      if (distance < minDistance) {
        minDistance = distance;
        nearestLine = line;
      }
      // console.log(distance);
      
    });

    // 设定一个距离阈值，只有当点击位置离线段足够近时才认为是点击了该线段
    const threshold = 20; // 可根据实际情况调整
    if (minDistance < threshold) {
      return nearestLine;
    } else {
      return null;
    }
  },

  distancePointToSegment: function (px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) // in case of 0 length line
      param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  },
  plot: function () {

  }


});