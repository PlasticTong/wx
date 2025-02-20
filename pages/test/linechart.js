// linechart.js
function drawChart(ctx, data, options) {
  const {
    x = (d) => d.year,
    y = (d) => d.wind,
    yLabel = "",
    width,
    height = 100,
    color = "rgb(139, 181, 110)",
    fillColor = "rgba(139, 181, 110, 0.5)", // 添加填充颜色选项
    marginLeft = 10,
    marginBottom = 30,
    marginTop = 10,
    marginRight = 10,
    xType = "linear",
    yType = "linear"
  } = options;

  // Compute values.
  const X = data.map(x);
  const Y = data.map(y);

  // Compute default domains.
  const xDomain = [Math.min(...X), Math.max(...X)];
  const yDomain = [0, Math.max(...Y)];

  // Construct scales and axes.
  const xScale = scaleLinear(xDomain, [marginLeft, width - marginRight]);
  const yScale = scaleLinear(yDomain, [height - marginBottom, marginTop]);

  // Draw axes with labels.
  drawAxes(ctx, width, height, marginLeft, marginTop, marginRight, marginBottom, xScale.scale, data.map(d => x(d)));

  // Draw the line and fill the area below it.
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = fillColor; // 设置填充颜色

  let firstPoint = true;

  data.forEach((d, i) => {
    const xCoord = xScale.scale(x(d));
    const yCoord = yScale.scale(y(d));

    if (firstPoint) {
      ctx.moveTo(xCoord, yCoord);
      firstPoint = false;
    } else {
      ctx.lineTo(xCoord, yCoord);
    }
  });

  // 连接到图表底部并闭合路径以填充颜色
  ctx.lineTo(width - marginRight, height - marginBottom); // 连接到最右边的点
  ctx.lineTo(marginLeft, height - marginBottom); // 连接到底部左边
  ctx.closePath();

  // 先填充后描边
  ctx.fill(); // 填充下方区域
  ctx.stroke(); // 绘制线条

  // Add labels if needed
  if (yLabel) {
    ctx.fillStyle = "black";
    ctx.fillText(yLabel, 10, height / 2);
  }
  return { xScale, yScale };
}

function scaleLinear(domain, range) {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;
  const scale = (value) => ((value - domainMin) * (rangeMax - rangeMin)) / (domainMax - domainMin) + rangeMin;
  const invert = (value) => ((value - rangeMin) * (domainMax - domainMin)) / (rangeMax - rangeMin) + domainMin;
  return { scale, invert };
}

function drawAxes(ctx, width, height, marginLeft, marginTop, marginRight, marginBottom, xScale, xLabels) {
  // X axis
  ctx.beginPath();
  ctx.moveTo(marginLeft, height - marginBottom);
  ctx.lineTo(width - marginRight, height - marginBottom);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(marginLeft, marginTop);
  ctx.lineTo(marginLeft, height - marginBottom);
  // ctx.stroke();

  // Add ticks and labels for X axis
  xLabels.forEach((label, index) => {
    const xPos = marginLeft + (width - marginLeft - marginRight) / (xLabels.length - 1) * index;
    ctx.beginPath();
    ctx.moveTo(xPos, height - marginBottom);
    ctx.lineTo(xPos, height - marginBottom + 5);
    ctx.stroke();

    // Add label text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgb(21,104,0)'; // 设置文本颜色为黑色
    ctx.font = 'bold 10px Arial';
    ctx.fillText(label, xPos, height - marginBottom + 10); // 在每个刻度下绘制文本
  });


}

module.exports = {
  drawChart: drawChart
};