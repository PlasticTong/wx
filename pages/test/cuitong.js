// index.js
const d3 = require('../../utils/d3.v7.min.js'); // 确保路径正确
const lineChart = require('./linechart.js');
const pieChart = require('./piechart.js');
const heatmap = require('./heatmap');
const reviewChart = require('./review');
const histogram = require('./histogram');
const histogramDouble = require('./histogarmDouble');
Page({
  data: {
    currentView: 'view1', // 当前显示的视图
    title: "Overview",
    windData: [
      { year: 10, value: 1187 },
      { year: 11, value: 1151 },
      { year: 12, value: 2194 },
      { year: 13, value: 3334 },
      { year: 14, value: 1426 },
      { year: 15, value: 1426 },
      { year: 16, value: 1438 },
      { year: 17, value: 1465 },
      { year: 18, value: 1533 },
      { year: 19, value: 170 },
      { year: 20, value: 314 },
      { year: 21, value: 673 }
    ],
    history: ([
      [1, [[0, 0], [1, 2], [2, 2], [3, 0], [4, 0], [5, 0], [6, 15], [7, 15]]],
      [2, [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 14], [8, 14]]],
      [3, [[0, 2], [1, 0], [2, 0], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]]],
      [4, [[0, 13], [1, 10], [2, 3], [3, 3], [4, 5], [5, 3], [6, 5], [7, 3]]],
      [5, [[0, 14], [1, 11], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]]],
      [6, [[0, 15], [1, 12], [2, 5], [3, 5], [4, 3], [5, 5], [6, 3], [7, 5]]],
      [7, [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]]],
      [8, [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]]],
      [9, [[0, 11], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]]],
      [10, [[0, 12], [1, 9], [2, 10], [3, 9], [4, 9], [5, 8], [6, 7], [7, 9]]],
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
      lineWidth: 8,
      jitter: 0.5,
      // height: 220,
      // width: 400,
      customColors: [
        "#02B86B", // 红橙色
        "#C5DAB6", // 绿色
        "#015478", // 蓝色
        "#EC7B89", // 粉红色
        "#C5DAB6", // 橙黄色
        "#EA9E45", // 紫色
        "transparent", // 青色
        "transparent", // 红色
        "transparent", // 浅绿色
        "#79BBD0", // 橙色
        "#646EC1", // 浅蓝色
        "transparent", // 深粉色
        "transparent", // 黄色
        "transparent", // 深紫色
        "transparent", // 浅青色
        "transparent"  // 深红色
      ]
    },
    linesInfo: [],
    isDragging: false,
    startX: 0,
    dataInfo: '',
    fixedBoxWidth: 0,
    xScale: null,
    yScale: null,
    startXall: 0, // 记录触摸开始时的X坐标
    hisData: [
      { category: 'A', values: [30, 20, 50, 40, 60], shapes: ['circle', 'triangle', 'diamond', 'hexagon'] }, // 观点表达
      { category: 'B', values: [25, 35, 45, 55, 70], shapes: ['circle', 'triangle', 'diamond', 'hexagon'] }, // 提问
      { category: 'C', values: [40, 50, 60, 70, 80], shapes: ['circle', 'triangle', 'diamond', 'hexagon'] }, // 总结
      { category: 'D', values: [55, 65, 75, 85, 90], shapes: ['circle', 'triangle', 'diamond', 'hexagon'] },
      { category: 'e', values: [40, 50, 60, 70, 80], shapes: ['circle', 'triangle', 'diamond', 'hexagon'] }, // 反驳
  ],
  hisCol:['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

  },
  constructor() {
    this.linesInfo = [];
  },

  onReady: function () {
    // 基础设置
    let res = this.makePlotSettings(this.data.history)
    // 绘画数据
    let dataForDraw = this.makePointsData(this.data.history, res.maxTime)
    console.log(dataForDraw);

    // 绘画缠绕图
    this.drawline(dataForDraw)
    // 绘画折线图
    this.drawLineChart()
    // 绘画移动框-折线图
    this.drawOverlayInit()
    // 绘画饼图
    // pieChart.drawPieChart()

    const width = 600;
    const height = 400;

    // histogram.drawStackedBarChart(this.data.hisData, this.data.hisCol, 'stackedWaveChart', width, height);
    histogramDouble.drawStackedBarChart("stackedWaveChart")

    const rows = 10;
    const cols = 16;
    heatmap.drawHeatmap(rows, cols);
    reviewChart.drawCanvasReview()

    wx.request({
      url: 'http://192.168.1.116:5000/', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
      }
    })

    // wx.startLocalServiceDiscovery({
    //   // 当前手机所连的局域网下有一个 _http._tcp. 类型的服务
    //   serviceType: '_http._tcp.',
    //   success: console.log,
    //   fail: console.log
    // })
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
      x: d3.scaleLinear().domain([0, maxTime]).range([10, width - 10]),
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

        // 添加两个新的点
        const point1 = [b[0] - that.data.params.jitter, a[1]];
        const point2 = [b[0] + that.data.params.jitter, b[1]];

        // 检查并添加第一个新点
        if (!(point1[0] === res[res.length - 1][0] && point1[1] === res[res.length - 1][1])) {
          res.push(point1);
        }

        // 检查并添加第二个新点
        if (!(point2[0] === res[res.length - 1][0] && point2[1] === res[res.length - 1][1])) {
          res.push(point2);
        }
        // res.push(b)
      }

      // 添加最大时间点
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


        // this.drawLineForCut(data, scales, ctx, 1, 0, 0, 25);

        // this.drawLineForCut(data, scales, ctx, 1, 0, 0, 1.5);
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
  // drawLineForCut: function (data, scales, ctx, border, tf, a, b) {
  //   let filteredData = data
  //   if (tf == 1) {
  //     filteredData = []
  //     // 过滤数据，只保留 x 值在 a 到 b 之间的点
  //     filteredData = data.map(series => [
  //       series[0],
  //       series[1].filter(point => point[0] >= a && point[0] <= b)
  //     ]);
  //   }

  //   // 颜色插值函数
  //   function interpolateYlGnBu(t,totalLength) {
  //     // 定义起始颜色和结束颜色的RGB值
  //     const startColor = [1, 84, 120]; // 黄色
  //     const endColor = [255, 104, 255];      // 深绿色

  //     // 计算实际的插值比例
  //     const adjustedT = t / (totalLength - 1);
  //     console.log(t ,(totalLength - 1));


  //     // 线性插值计算中间颜色
  //     const r = Math.floor(startColor[0] + adjustedT * (endColor[0] - startColor[0]));
  //     const g = Math.floor(startColor[1] + adjustedT * (endColor[1] - startColor[1]));
  //     const b = Math.floor(startColor[2] + adjustedT * (endColor[2] - startColor[2]));
  //     console.log(`rgb(${r},${g},${b})`);

  //     return `rgb(${r},${g},${b})`
  //   }

  //   filteredData.forEach((series, i) => {

  //     const points = series[1].map(([t, y]) => ({
  //       x: scales.x(t),
  //       y: scales.y(y) + 10,
  //       originalT: t,
  //       originalY: y
  //     }));



  //     if (points.length === 0) {
  //       console.warn(`No points for series ${i + 1}`);
  //       return;
  //     }
  //     if (border == 1) {
  //       // 绘制边框线
  //       ctx.beginPath();
  //       ctx.lineWidth = this.data.params.lineWidth + 5;
  //       ctx.strokeStyle = '#4B7902';
  //       ctx.lineCap = 'round';
  //       ctx.lineJoin = 'round';

  //       points.forEach((point, j) => {
  //         if (j === 0) {
  //           ctx.moveTo(point.x, point.y - this.data.params.lineWidth);
  //         } else {
  //           ctx.lineTo(point.x, point.y - this.data.params.lineWidth);
  //         }
  //       });
  //       ctx.stroke();

  //     } else {
  //       // 绘制填充线
  //       ctx.beginPath();
  //       ctx.lineWidth = this.data.params.lineWidth;
  //       ctx.strokeStyle = this.data.params.customColors[series[0]-1]
  //       ctx.lineCap = 'round';
  //       ctx.lineJoin = 'round';

  //       points.forEach((point, j) => {

  //         if (j === 0) {
  //           ctx.moveTo(point.x, point.y - this.data.params.lineWidth);
  //         } else {
  //           ctx.lineTo(point.x, point.y - this.data.params.lineWidth);
  //           const prevPoint = points[j - 1];
  //           // 存储每条线段的信息
  //           this.data.linesInfo.push({
  //             name: series[0],
  //             startX: prevPoint.x,
  //             startY: prevPoint.y,
  //             endX: point.x,
  //             endY: point.y,
  //             t1: prevPoint.originalT,
  //             y1: prevPoint.originalY,
  //             t2: point.originalT,
  //             y2: point.originalY
  //           });
  //         }

  //       });
  //       ctx.stroke();

  //     }




  //   });



  // },
  drawLineForCut: function (data, scales, ctx, border, tf, a, b) {
    let filteredData = data;
    if (tf == 1) {
      // 过滤数据，只保留 x 值在 a 到 b 之间的点
      filteredData = data.map(series => [
        series[0],
        series[1].filter(point => point[0] >= a && point[0] <= b)
      ]);
    }

    // 颜色插值函数
    function interpolateYlGnBu(t, totalLength) {
      const startColor = [1, 84, 120]; // 起始颜色RGB值
      const endColor = [255, 104, 255]; // 结束颜色RGB值

      const adjustedT = t / (totalLength - 1);

      const r = Math.floor(startColor[0] + adjustedT * (endColor[0] - startColor[0]));
      const g = Math.floor(startColor[1] + adjustedT * (endColor[1] - startColor[1]));
      const b = Math.floor(startColor[2] + adjustedT * (endColor[2] - startColor[2]));

      return `rgb(${r},${g},${b})`;
    }

    filteredData.forEach((series, i) => {
      const points = series[1].map(([t, y]) => ({
        x: scales.x(t),
        y: scales.y(y) + 10,
        originalT: t,
        originalY: y
      }));

      if (points.length === 0) {
        console.warn(`No points for series ${i + 1}`);
        return;
      }

      ctx.beginPath();
      ctx.lineWidth = border == 1 ? this.data.params.lineWidth + 5 : this.data.params.lineWidth;
      ctx.strokeStyle = border == 1 ? '#4B7902' : this.data.params.customColors[series[0] - 1];
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 计算控制点用于绘制贝塞尔曲线
      function calculateControlPoint(prevPoint, currentPoint, nextPoint) {
        const controlX = (nextPoint.x - prevPoint.x) / 4;
        const controlY = (nextPoint.y - prevPoint.y) / 4;
        return { x: currentPoint.x + controlX, y: currentPoint.y + controlY };
      }

      points.forEach((point, j) => {
        if (j === 0) {
          ctx.moveTo(point.x, point.y); // 移动到第一个点
        } else {
          if (j < points.length - 1) {
            // 对于中间的每个点（非最后一个），计算两个控制点并绘制贝塞尔曲线
            const nextPoint = points[j + 1];
            const cp1 = calculateControlPoint(points[j - 1], point, nextPoint);
            const cp2 = calculateControlPoint(point, nextPoint, j + 2 < points.length ? points[j + 2] : nextPoint);
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, nextPoint.x, nextPoint.y);

            // 存储每条线段的信息
            this.data.linesInfo.push({
              name: series[0],
              startX: points[j - 1].x,
              startY: points[j - 1].y,
              endX: nextPoint.x,
              endY: nextPoint.y,
              t1: points[j - 1].originalT,
              y1: points[j - 1].originalY,
              t2: nextPoint.originalT,
              y2: nextPoint.originalY
            });
          } else {
            // 如果是最后一个点，则直接画线到该点
            ctx.lineTo(point.x, point.y);
          }
        }
      });
      // // Move to the first point
      // ctx.moveTo(points[0].x, points[0].y);

      // // Draw cubic Bezier curves between points
      // for (let j = 1; j <= points.length - 3; j += 3) {
      //     const cp1 = { x: points[j].x, y: points[j].y };
      //     const cp2 = { x: points[j + 1].x, y: points[j + 1].y };
      //     const end = { x: points[j + 2].x, y: points[j + 2].y };

      //     ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
      // }

      // ctx.stroke();

      ctx.stroke();
    });
  },

  handleClick: function () {
    console.log("adsadas");
    console.log(this.data.linesInfo);


  },
  handleCanvasTap: function (event) {
    const x = event.detail.x;
    const y = event.detail.y - 440;


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

  handleTouchStart(e) {
    this.setData({
      isDragging: true,
      startX: e.touches[0].x
    });
  },

  handleTouchMove(e) {

    if (!this.data.isDragging) return;

    const moveX = e.touches[0].x;
    const moveY = e.touches[0].y;
    // console.log(moveX);


    const query = wx.createSelectorQuery();
    query.select('#overlayCanvas')
      .fields({ node: true })
      .exec((res) => {

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(moveX, 0, 20, canvas.height / dpr);
      });

  },

  handleTouchEnd() {
    this.setData({ isDragging: false });
  },

  drawBox(ctx, startX) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, 10, this.data.fixedBoxWidth, 280);
    // ctx.draw();
  },
  drawOverlay() {
    const query = wx.createSelectorQuery();
    query.select('#overlayCanvas')
      .fields({ node: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = canvas.width * dpr; // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { startX, startY, endX, endY } = this.data;
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      });
  },



  updateDataInfo(startX) {
    const startYear = this.data.xScale.invert(startX);
    const endYear = this.data.xScale.invert(startX + this.data.fixedBoxWidth);
    const filteredData = this.data.windData.filter(d => d.year >= startYear && d.year <= endYear);
    this.setData({ dataInfo: `Selected Data: ${JSON.stringify(filteredData)}` });
  },

  drawLineChart() {
    const query = wx.createSelectorQuery();
    query.select('#myCanvas2')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = (res[0].height * dpr);
        ctx.scale(dpr, dpr);

        // 设置背景颜色等初始设置
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 调用 linechart.js 中的 drawChart 方法
        const width = res[0].width;
        const height = res[0].height;

        // Wind chart
        const { xScale, yScale } = lineChart.drawChart(ctx, this.data.windData, {
          x: (d) => d.year,
          y: (d) => d.value,
          yLabel: "",
          width,
          height,
          color: "rgb(139, 181, 110)"
        });

        this.setData({
          xScale: xScale,
          yScale: yScale,
          fixedBoxWidth: (xScale.scale(this.data.windData[this.data.windData.length - 1].year) - xScale.scale(this.data.windData[0].year)) / this.data.windData.length
        });
      });
  },
  drawOverlayInit() {
    wx.createSelectorQuery().select('#overlayCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = (res[0].height * dpr);
        ctx.scale(dpr, dpr);

        // 设置背景颜色等初始设置
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // // const { startX, startY, endX, endY } = this.data;
        ctx.strokeStyle = "rgb(0, 104, 55)";
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 0, 20, canvas.height / dpr);

      });

  },
  handleTouchStart2(e) {
    this.setData({
      startXall: e.touches[0].pageX // 记录触摸开始时的X坐标
    });
  },

  handleTouchEnd2(e) {
    const endX = e.changedTouches[0].pageX;
    const distance = this.data.startXall - endX;

    if (distance > 50) { // 如果向左滑动超过50像素，则切换视图
      this.setData({
        currentView: 'view2'
      });
    } else if (distance < -50) { // 如果向右滑动超过50像素，则切换回原视图
      this.setData({
        currentView: 'view1'
      });
    }
  },


});