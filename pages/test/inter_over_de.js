const params={
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
}

const history = ([
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
])

function drawline() {


  // 基础设置
  let res = makePlotSettings(history)
  // 绘画数据
  let data = makePointsData(history, res.maxTime)


  


  const query = wx.createSelectorQuery();
  query.select('#stackedWaveChart4')
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

      const values = Array.from(history.keys());
      const plotSettings = makePlotSettings(values, width, height);
      const { scales } = plotSettings;


      // this.drawLineForCut(data, scales, ctx, 1, 0, 0, 25);

      // this.drawLineForCut(data, scales, ctx, 1, 0, 0, 1.5);
      drawLineForCut(data, scales, ctx, 0, 1, 0, 1.5);


      let test = swapIndexAandIndexB(data, 0, 2);
      drawLineForCut(test, scales, ctx, 0, 1, 1.5, 2.5);

      let test_1 = swapIndexAandIndexB(test, 10, 9);
      drawLineForCut(test_1, scales, ctx, 0, 1, 2.5, 4.5);

      let test2 = swapIndexAandIndexB(data, 3, 5);
      drawLineForCut(test2, scales, ctx, 0, 1, 4.5, 5.5);

      let test3 = swapIndexAandIndexB(test2, 3, 5);
      drawLineForCut(test3, scales, ctx, 0, 1, 5.5, 6.5);

      let test4 = swapIndexAandIndexB(test3, 3, 5);
      drawLineForCut(test4, scales, ctx, 0, 1, 6.5, 10);

      console.log('Drawing completed.');



    });


}

const d3 = require('../../utils/d3.v7.min.js'); // 确保路径正确

function makePlotSettings(results, width, height) {
  const maxTime = 10;
  const scales = {
    x: d3.scaleLinear().domain([0, maxTime]).range([10, width - 10]),
    y: d3.scaleLinear().domain([0, results.length]).range([0, height]),
    // color: d3.interpolateRdYlBu
    // // color: d3.interpolatePuBuGn
    color: d3.interpolateYlGnBu
  };
  return { maxTime, scales }
}

function drawLineForCut(data, scales, ctx, border, tf, a, b) {
  
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
    ctx.lineWidth = border == 1 ? params.lineWidth + 5 : params.lineWidth;
    ctx.strokeStyle = border == 1 ? '#4B7902' : params.customColors[series[0] - 1];
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

          // // 存储每条线段的信息
          // this.data.linesInfo.push({
          //   name: series[0],
          //   startX: points[j - 1].x,
          //   startY: points[j - 1].y,
          //   endX: nextPoint.x,
          //   endY: nextPoint.y,
          //   t1: points[j - 1].originalT,
          //   y1: points[j - 1].originalY,
          //   t2: nextPoint.originalT,
          //   y2: nextPoint.originalY
          // });
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
}


function swapIndexAandIndexB(data, indexA, indexB) {
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
}

function makePointsData(history, maxTime) {

  let that = this
  function makePoints(entries) {
    const res = [entries[0]];

    for (let i = 1; i < entries.length; i++) {
      const a = entries[i - 1], b = entries[i];

      // 添加两个新的点
      const point1 = [b[0] - params.jitter, a[1]];
      const point2 = [b[0] + params.jitter, b[1]];

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
}


module.exports = {
  drawline
};