// review.js

function drawCanvasReview() {

    wx.createSelectorQuery().select('#myCanvasReview')
        .fields({ node: true, size: true })
        .exec((res) => {

            if (!res || !res[0] || !res[0].node) {
                console.error('CanvasPie not found or invalid.');
                return;
            }
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            const dpr = wx.getWindowInfo().pixelRatio;
            canvas.width = res[0].width * dpr;
            canvas.height = (res[0].height * dpr);
            ctx.scale(dpr, dpr);
        //     ctx.fillStyle = 'black';
        // ctx.fillRect(0, 0, canvas.width, canvas.height );
            // 矩形参数
            const rectHeight1 = 200; // 第一个矩形的高度
            const rectWidth = 100;  // 矩形的宽度
            const canvasWidth = canvas.width * dpr;
            const canvasHeight = canvas.height* dpr;
            const rectX1 = 0; // 第一个矩形的x坐标
            const rectY1 = 0;  // 第一个矩形的y坐标

            const rectHeight2 = 100; // 第二个矩形的高度
            const rectX2 = 200; // 第二个矩形的x坐标
            const rectY2 = 50 ;  // 第二个矩形的y坐标

            // 绘制第一个矩形
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(0, 0, rectWidth, rectHeight1);
            ctx.strokeRect(0, 0, rectWidth, rectHeight1);

            // 绘制第二个矩形
            ctx.fillStyle = '#ADD8E6';
            ctx.fillRect(200, 50, rectWidth, rectHeight2);
            ctx.strokeRect(200, 50, rectWidth, rectHeight2);

            // 计算上顶点曲线的控制点
            const topControlPoint1X = rectX1 + rectWidth;
            const topControlPoint1Y = rectY1;

            const topControlPoint2X = rectX2;
            const topControlPoint2Y = rectY2;

            // 计算下顶点曲线的控制点
            const bottomControlPoint1X = rectX1 + rectWidth;
            const bottomControlPoint1Y = rectY1 + rectHeight1;

            const bottomControlPoint2X = rectX2;
            const bottomControlPoint2Y = rectY2 + rectHeight2;

            // 开始路径并绘制上顶点曲线
            ctx.beginPath();
            ctx.moveTo(topControlPoint1X, topControlPoint1Y); // 起点
            ctx.bezierCurveTo(
                topControlPoint1X + 30, topControlPoint1Y, // 控制点1
                topControlPoint2X - 30, topControlPoint2Y, // 控制点2
                topControlPoint2X, topControlPoint2Y       // 结束点
            );

            // 移动到第二个矩形的下顶点
            ctx.lineTo(bottomControlPoint2X, bottomControlPoint2Y);

            // 绘制下顶点曲线
            ctx.bezierCurveTo(
                bottomControlPoint2X - 30, bottomControlPoint2Y, // 控制点1
                bottomControlPoint1X + 30, bottomControlPoint1Y, // 控制点2
                bottomControlPoint1X, bottomControlPoint1Y       // 结束点
            );

            // 关闭路径
            ctx.closePath();

            // 设置填充样式并填充
            ctx.fillStyle = '#90EE90'; // 填充颜色
            ctx.fill();

            // 设置曲线样式并绘制边框
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 5;
            ctx.stroke();

        })
}

module.exports = {
    drawCanvasReview: drawCanvasReview
};