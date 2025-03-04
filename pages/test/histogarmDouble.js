// histogram.js

function drawStackedBarChart(canvasId) {
    const verticalData = [
        { label: 'A', values: [30, 20, 50, 40] },
        { label: 'B', values: [40, 10, 50, 30] },
        { label: 'C', values: [20, 30, 50, 20] },
        { label: 'D', values: [10, 40, 50, 10] }
    ];
    const horizontalData = [
        { label: 'X', values: [10, 20, 50, 40] },
    ];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {

        if (!res || !res[0] || !res[0].node) {
            console.error('CanvasHisDoubel not found or invalid.');
            return;
          }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = (res[0].height * dpr);
        ctx.scale(dpr, dpr);

        const totalWidth = res[0].width ;
        const totalHeight = res[0].height ;
        const verticalWidth = totalWidth / 3;
        const horizontalWidth = (totalWidth * 2) / 3;

        let horizontalPoints = drawHorizontalBarChart(ctx, horizontalData, colors, 0, 20, 10, totalHeight - 40);
        let verticalPoints = drawVerticalBarChart(ctx, verticalData, colors, horizontalWidth - 40, 20, verticalWidth + 40, totalHeight - 40);

        console.log(horizontalPoints.points);
        console.log(verticalPoints.points);

        for (let i = 0; i < verticalPoints.points.length; i++) {
            drawLine(ctx, verticalPoints.points[i], horizontalPoints.points[i], { color: colors[i] });
            drawLine(ctx, verticalPoints.pointsDown[i], horizontalPoints.pointsDown[i], { color: colors[i] });
        }
    });
}

function drawVerticalBarChart(ctx, data, colors, xStart, yStart, width, height) {
    const barWidth = (height - ((data.length + 1) * 20)) / data.length;
    const maxValue = Math.max(...data.flatMap(item => item.values.reduce((a, b) => a + b, 0)));
    const scale = width / maxValue;

    ctx.clearRect(xStart, yStart, width, height);

    let points = [];
    let pointsDown = [];

    data.forEach((item, index) => {
        let x = xStart + 20;
        const y = yStart + 20 + (index * (barWidth + 20));

        item.values.forEach((value, i) => {
            const rectWidth = value * scale;
            ctx.fillStyle = colors[i];
            ctx.fillRect(x, y, rectWidth, barWidth);
            if (i === 0) {
                points.push({ x: x, y: y });
                pointsDown.push({ x: x, y: y + barWidth })
            }
            x += rectWidth;
        });

        // Draw label
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(item.label, xStart + width - 10, y + barWidth / 2 + 5);
    });

    return { points, pointsDown };
}

function drawHorizontalBarChart(ctx, data, colors, xStart, yStart, width, height) {
    // const barHeight = (height - ((data.length + 1) * 20)) / data.length;
    const barHeight = 40;
    const maxValue = Math.max(...data.flatMap(item => item.values.reduce((a, b) => a + b, 0)));
    const scale = height / maxValue;

    ctx.clearRect(xStart, yStart, width, height);

    let points = [];
    let pointsDown = [];

    data.forEach((item, index) => {
        let y = yStart + 20;
        const x = xStart + 20;

        item.values.forEach((value, i) => {
            const rectHeight = value * scale;
            ctx.fillStyle = colors[i];
            ctx.fillRect(x, y, barHeight, rectHeight);

            points.push({ x: x + barHeight, y: y });
            pointsDown.push({ x: x + barHeight, y: y + rectHeight })

            y += rectHeight;
        });

        // Draw label
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, x + barHeight + 5, yStart + 10 + (index * (barHeight + 20)) + barHeight / 2 + 5);
    });

    return { points, pointsDown };
}

// function drawLine(ctx, startPoint, endPoint) {
//     ctx.beginPath();
//     ctx.moveTo(startPoint.x, startPoint.y);
//     ctx.lineTo(endPoint.x, endPoint.y);
//     ctx.strokeStyle = '#000';
//     ctx.stroke();
// }

function drawLine(ctx, startPoint, endPoint, options = {}) {
    const {
        curvature = 30,   // 默认弯曲程度
        direction = 'auto',  // 弯曲方向（up/down/auto）
    } = options;

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);

    // 判断是否为水平线（y坐标相同）
    if (startPoint.y === endPoint.y) {
        ctx.lineTo(endPoint.x, endPoint.y); // 直接绘制直线
    } else {
        // 智能计算弯曲方向
        let offsetY = curvature;
        if (direction === 'auto') {
            offsetY = (startPoint.y > endPoint.y) ? curvature : -curvature;
        } else if (direction === 'down') {
            offsetY = -curvature;
        }

        // 计算控制点
        const cp = {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2 + offsetY
        };

        ctx.quadraticCurveTo(cp.x, cp.y, endPoint.x, endPoint.y);
    }

    ctx.strokeStyle = options.color || '#000'; // 支持自定义颜色
    ctx.lineWidth = options.width || 2;        // 支持自定义线宽
    ctx.lineCap = 'round';                     // 线条端点圆角处理
    ctx.stroke();
}



module.exports = {
    drawStackedBarChart
};