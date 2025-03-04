// histogram.js

function drawWaveAndSolid(ctx, x, y, width, height, color,shapes) {
    const midX = width * 0.3; // 减小波浪线区域的宽度
    const waveAmplitude = 5; // 减小波浪的振幅
    const waveFrequency = 0.5; // 增加波浪的频率

    // // Draw vertical wave on the left side
    ctx.beginPath();
    ctx.rect(x, y + height / 2, width, height/2);
    ctx.fillStyle = color; // 设置背景颜色
    ctx.fill();



    // // Define the start and end points for the wave
    // const startY = height * 0.2;
    // const endY = height * 0.8;

    // // Start from the middle of the left side
    // let startX = x + midX - waveAmplitude * Math.sin(waveFrequency * 0);

    // // Draw small horizontal line at the start
    // // ctx.moveTo(startX -15, y+10);
    // // ctx.lineTo(startX -5, y+10);

    // for (let cy = startY; cy <= endY; cy++) {
    //     const cx = startX - waveAmplitude * Math.sin(waveFrequency * cy)-10;
    //     if (cy === 0) {
    //         ctx.moveTo(cx, y + cy);
    //     } else {
    //         ctx.lineTo(cx, y + cy);
    //     }
    // }

    // // End at the middle of the left side
    // let endX = startX - waveAmplitude * Math.sin(waveFrequency * height);

    // // Draw small horizontal line at the end
    // // ctx.moveTo(endX - 15, y + height-10);
    // // ctx.lineTo(endX - 5, y + height-10);

    // ctx.stroke();

    // Draw right side solid rectangle with border
    // ctx.beginPath();
    // ctx.rect(x + midX, y, width - midX, height);
    // ctx.fillStyle = "white"; // 右侧纯色块的颜色
    // ctx.fill();
    // ctx.lineWidth = 2; // 设置边框宽度
    // ctx.strokeStyle = color; // 设置边框颜色
    // ctx.stroke();

    // Draw particle shapes in the solid rectangle
    drawParticleShapes(ctx, x, y, width, height, color, shapes);

    // Draw outer border around the entire segment
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2; // 设置边框宽度
    ctx.strokeStyle = color; // 设置边框颜色
    ctx.stroke();
}

function drawStackedBarChart(data, colors, canvasId) {
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {

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

        var width = res[0].width
        var height = res[0].height

        



        const barWidth = (width / data.length) - 30; // 缩小宽度并增加间距
        const maxValues = data.map(item => item.values.reduce((acc, val) => acc + val, 0));
        const maxValue = Math.max(...maxValues);
        const scale = height / maxValue;

        data.forEach((item, index) => {
            let prevHeight = 0;
            item.values.forEach((value, i) => {
                const barHeight = value * scale;
                const offsetX = index * (barWidth + 20) + 10; // 增加水平间距
                const offsetY = height - (prevHeight + barHeight); // 增加垂直间距

                drawWaveAndSolid(ctx, offsetX, offsetY, barWidth, barHeight, colors[i],item.shapes);

                prevHeight += barHeight;
            });
        });

        // Draw labels and axes
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        data.forEach((item, index) => {
            ctx.fillText(item.category, index * (barWidth + 20) + barWidth / 2 + 10, height + 30); // 调整标签位置
        });

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
    });
}

function drawParticleShapes(ctx, x, y, width, height, color, shapes) {
    const particleCount = 50; // 每个矩形内的粒子数量
    const particleSize = 5; // 粒子大小

    for (let i = 0; i < particleCount; i++) {
        // 确保粒子在指定区域内，且不超出边框
        const px = x + Math.random() * (width - particleSize) + particleSize / 2;
        // 确保粒子位于上半部分，且不超出边框
        const py = y + Math.random() * (height / 2 - particleSize) + particleSize / 2;
        // const px = x + Math.random() * width;
        // const py = y + Math.random() * height/2;
        // const py = y + height / 2 + Math.random() * (height / 2);
        const shapeIndex = Math.floor(Math.random() * shapes.length);
        const shape = shapes[shapeIndex];

        switch (shape) {
            case 'circle':
                drawCircle(ctx, px, py, particleSize, color);
                break;
            case 'triangle':
                drawTriangle(ctx, px, py, particleSize, color);
                break;
            case 'diamond':
                drawDiamond(ctx, px, py, particleSize, color);
                break;
            case 'hexagon':
                drawHexagon(ctx, px, py, particleSize/2, color);
                break;
        }
    }
}

function drawCircle(ctx, x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawTriangle(ctx, x, y, size, color) {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawDiamond(ctx, x, y, size, color) {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y);
    ctx.lineTo(x, y + size / 2);
    ctx.lineTo(x - size / 2, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawHexagon(ctx, x, y, size, color) {
    ctx.beginPath();
    const angle = Math.PI / 3;
    for (let i = 0; i < 6; i++) {
        const sx = x + size * Math.cos(angle * i);
        const sy = y + size * Math.sin(angle * i);
        if (i === 0) {
            ctx.moveTo(sx, sy);
        } else {
            ctx.lineTo(sx, sy);
        }
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

module.exports = {
    drawStackedBarChart
};