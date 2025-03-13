// histogram.js

function drawStackedBarChart(canvasId) {
    const verticalData = [
        { label: 'A', values: [30, 20, 50, 40] },
        { label: 'B', values: [40, 10, 50, 30] },
        { label: 'C', values: [20, 30, 50, 20] },
        { label: 'D', values: [10, 40, 50, 10] },
        { label: 'e', values: [10, 40, 50, 10] }
    ];
    const horizontalData = [
        { label: 'X', values: [10, 20, 50, 40,20] },
    ];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',"yellow",];
    const colorsHor = ['#2A4C7D', '#3B6AA0', '#4C8AC3', '#5DA9E6', '#6EC8FF']
    const colorPie = ['#778899', '#87CEEB', '#B0C4DE', '#D3D3D3', '#A9A9A9']

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
        // const verticalWidth = totalWidth / 3;
        // const horizontalWidth = (totalWidth * 2) / 3;

         // 调整绘图区域分配
         const verticalWidth = totalWidth * 0.5;  // 中间40%
         const horizontalWidth = totalWidth * 0.2; // 左40%
         const scaleWidth = totalWidth * 0.2;     // 刻度区20%

        let horizontalPoints = drawHorizontalBarChart(ctx, horizontalData, colorsHor, 0,0, horizontalWidth, totalHeight-20);//纵向
        let verticalPoints = drawVerticalBarChart(ctx, verticalData, colors, horizontalWidth, 0, verticalWidth , totalHeight );//横向

        console.log(horizontalPoints.points);
        // console.log(verticalPoints.points);

        for (let i = 0; i < verticalPoints.points.length; i++) {
            // drawLine(ctx, {x:(verticalPoints.points[i].x+verticalPoints.pointsDown[i].x)/2,y:(verticalPoints.points[i].y+verticalPoints.pointsDown[i].y)/2}, {x:(horizontalPoints.points[i].x+horizontalPoints.pointsDown[i].x)/2,y:(horizontalPoints.points[i].y+horizontalPoints.pointsDown[i].y)/2}, { color: colorsHor[i] });
            drawLine(ctx, verticalPoints.points[i], horizontalPoints.points[i], { color: colorsHor[i] });
            drawLine(ctx, verticalPoints.pointsDown[i], horizontalPoints.pointsDown[i], { color: colorsHor[i] });
        }

        // 绘制右侧刻度尺（距离右侧图表30px）
        const scaleX = verticalWidth + horizontalWidth + 30;
        drawVerticalScale(
            ctx,
            verticalPoints.labelPositions,
            scaleX,
            20,
            totalHeight - 40
        );

        // 新增饼图绘制参数
        const pieParams = {
            startX: verticalWidth + horizontalWidth + 30, // 饼图起始X坐标
            size: 25,                                      // 饼图半径
            spacing: 50                                    // 饼图间距
        };

        // 绘制饼图（传入垂直柱状图的标签位置信息）
        drawPieCharts(
            ctx, 
            verticalData, 
            colorPie, 
            pieParams.startX, 
            verticalPoints.labelPositions,
            pieParams.size
        );
    });
}

function drawVerticalScale(ctx, scaleData, xStart, yStart, height) {
    ctx.save();
    ctx.strokeStyle = "#999";
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // 绘制主轴线
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xStart, yStart + height);
    ctx.stroke();

    // 绘制刻度标记
    scaleData.forEach(item => {
        ctx.beginPath();
        ctx.moveTo(xStart - 5, item.y);
        ctx.lineTo(xStart, item.y);
        ctx.stroke();

        ctx.fillText(item.text, xStart + 8, item.y);
    });

    ctx.restore();
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

    // 新增：返回标签位置用于绘制刻度
    const labelPositions = data.map((item, index) => {
        const y = yStart + 20 + (index * (barWidth + 20)) + barWidth / 2;
        return { 
            y: y,
            text: item.label 
        };
    });

    return { points, pointsDown,labelPositions };
}

function drawPieCharts(ctx, data, colors, startX, verticalPositions, pieSize) {
    data.forEach((item, index) => {
        const center = {
            x: startX + pieSize * 2,
            y: verticalPositions[index].y
        };
        
        // 计算饼图数据
        const total = item.values.reduce((a, b) => a + b, 0);
        let startAngle = 0;
        
        item.values.forEach((value, i) => {
            const sliceAngle = (value / total) * Math.PI * 2;
            
            // 绘制扇形
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.arc(
                center.x, 
                center.y,
                pieSize,
                startAngle,
                startAngle + sliceAngle
            );
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            
            startAngle += sliceAngle;
        });

        // 绘制白色边框
        ctx.beginPath();
        ctx.arc(center.x, center.y, pieSize, 0, Math.PI*2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function drawHorizontalBarChart(ctx, data, colors, xStart, yStart, width, height) {
    // const barHeight = (height - ((data.length + 1) * 20)) / data.length;
    const barHeight = 40;
    const maxValue = Math.max(...data.flatMap(item => item.values.reduce((a, b) => a + b, 0)));
    const totalSum = data.reduce((sum, item) => {
        return sum + item.values.reduce((a, b) => a + b, 0);
      }, 0);
      console.log(totalSum);
      
    const scale = height / totalSum;
    console.log(height);
    

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