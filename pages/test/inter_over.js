//inter_over.js

function drawStackedBarChart(canvasId) {

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

        const totalWidth = res[0].width;
        const totalHeight = res[0].height;

        // 线条配置
        const timeMax = totalHeight
        // 线条配置（相对比例版本）
        const lines = [
            { // 第一条线
                color: '#FF6B6B',
                position: totalWidth * (100 / 600),   // 原100px在600宽中的比例
                main: {
                    startY: totalHeight * (20 / 1000),  // 原20px在1000高中
                    endY: totalHeight * (100 / 1000)    // 原100px在1000高中
                },
                targets: [
                    { type: 'rect-top' },
                    { yOffset: totalHeight * 0.5 } // 原timeMax=500改为高度的80%
                ]
            },
            { // 第二条线
                color: '#4ECDC4',
                position: totalWidth * (250 / 600),    // 原250px位置
                main: {
                    startY: totalHeight * (20 / 1000),
                    endY: totalHeight * (100 / 1000)
                },
                targets: [
                    { type: 'rect-middle' },
                    { yOffset: totalHeight * 0.5 }
                ]
            },
            { // 第三条线
                color: '#45B7D1',
                position: totalWidth * (400 / 600),    // 原400px位置
                main: {
                    startY: totalHeight * (20 / 1000),
                    endY: totalHeight * 0.5  // 原timeMax=500改为80%高度
                }
            },
            { // 第四条线
                color: '#FFD700',
                position: totalWidth * (550 / 600),    // 原550px位置
                main: {
                    startY: totalHeight * (20 / 1000),
                    endY: totalHeight * (100 / 1000)
                },
                targets: [
                    { type: 'rect-bottom' },
                    { yOffset: totalHeight * 0.5 }
                ]
            }
        ]
        draw_over(totalWidth * (400 / 600) - 15, totalWidth * (200 / 1000), 100, ['#FF6B6B', '#45B7D1', '#FFD700'], lines, ctx)


        const lines2 = [
            { // 第一条线
                color: '#FF6B6B',
                position: totalWidth * (100 / 600),   // 原100px在600宽中的比例
                main: {
                    startY: totalHeight * 0.5,  // 原20px在1000高中
                    endY: totalHeight * 0.6  // 原100px在1000高中
                },
                targets: [
                    { type: 'rect-bottom' },
                    { yOffset: totalHeight} // 原timeMax=500改为高度的80%
                ]
            },
            { // 第二条线
                color: '#4ECDC4',
                position: totalWidth * (250 / 600),    // 原250px位置
                main: {
                    startY: totalHeight * 0.5,  // 原20px在1000高中
                    endY: totalHeight
                }
            },
            { // 第三条线
                color: '#45B7D1',
                position: totalWidth * (400 / 600),    // 原400px位置
                main: {
                    startY: totalHeight * 0.5,
                    endY: totalHeight * 0.6  // 原timeMax=500改为80%高度
                },
                targets: [
                    { type: 'rect-middle' },
                    { yOffset: totalHeight }
                ]
            },
            { // 第四条线
                color: '#FFD700',
                position: totalWidth * (550 / 600),    // 原550px位置
                main: {
                    startY: totalHeight * 0.5,  // 原20px在1000高中
                    endY: totalHeight * 0.6
                },
                targets: [
                    { type: 'rect-top' },
                    { yOffset: totalHeight }
                ]
            }
        ]
        draw_over(totalWidth * (250 / 600) - 15, totalHeight * 0.6, 100, ['#FFD700', '#4ECDC4', '#FF6B6B'], lines2, ctx)

        // // 线条配置
        // const timeMax2 = 1000
        // const lines2 = [
        //     { // 第一条线
        //         color: '#FF6B6B',
        //         position: 100,   // X轴位置
        //         main: { startY: 500, endY: 600 }, // 主线段
        //         targets: [
        //             { type: 'rect-bottom' },      // 连接到矩形顶部
        //             { yOffset: timeMax2 }          // 底部下方斜线
        //         ]
        //     },
        //     { // 第二条线
        //         color: '#4ECDC4',
        //         position: 250,
        //         main: { startY: 500, endY: timeMax2 }
        //     },
        //     { // 第三条线
        //         color: '#45B7D1',
        //         position: 400,
        //         main: { startY: 500, endY: 600 },
        //         targets: [
        //             { type: 'rect-middle' },
        //             { yOffset: timeMax2 }
        //         ]
        //     },
        //     { // 第四条线
        //         color: '#FFD700',
        //         position: 550,
        //         main: { startY: 500, endY: 600 },
        //         targets: [
        //             { type: 'rect-top' },
        //             { yOffset: timeMax2 }
        //         ]
        //     }
        // ]
        // draw_over(225, 600, 300, ['#FFD700', '#4ECDC4', '#FF6B6B'], lines2,ctx)

    });
}

function draw_over(rectX, rectY, rectTime, rectColors, lines, ctx) {
    // 配置参数
    const config = {
        // 矩形配置
        rect: {
            x: rectX,         // 水平起始位置
            y: rectY,         // 垂直起始位置
            width: 30,       // 矩形宽度
            totalHeight: rectTime,// 总高度
            colors: rectColors, // 上/中/下颜色
            bottomOffset: 25 // 底部下方斜线偏移量
        },

        // 线条配置
        lines: lines
    };



    function calculateTarget(rect, targetType) {
        const square = rect.width;
        const middleH = rect.totalHeight - 2 * square;

        switch (targetType) {
            case 'rect-top':
                return {
                    x: rect.x + square / 2,
                    y: rect.y + square / 2
                };
            case 'rect-middle':
                return {
                    x: rect.x + square / 2,
                    y: rect.y + square + middleH / 2
                };
            case 'rect-bottom':
                return {
                    x: rect.x + square / 2,
                    y: rect.y + rect.totalHeight - square / 2
                };
            default:
                return null;
        }
    }

    function draw() {
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制矩形
        const rect = config.rect;
        const square = rect.width;
        const middleH = rect.totalHeight - 2 * square;

        // // 顶部
        // ctx.fillStyle = rect.colors[0];
        // ctx.fillRect(rect.x, rect.y, square, square);
        // // 中部
        // ctx.fillStyle = rect.colors[1];
        // ctx.fillRect(rect.x, rect.y + square, square, middleH);
        // // 底部
        // ctx.fillStyle = rect.colors[2];
        // ctx.fillRect(rect.x, rect.y + square + middleH, square, square);

        // 绘制所有线条
        config.lines.forEach(line => {
            // 主竖线
            ctx.beginPath();
            ctx.moveTo(line.position, line.main.startY);
            ctx.lineTo(line.position, line.main.endY);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.stroke();

            // 绘制连接线
            if (line.targets) {
                line.targets.forEach(target => {
                    if (target.type) {
                        // 矩形连接线
                        const point = calculateTarget(rect, target.type);
                        ctx.beginPath();
                        ctx.moveTo(line.position, line.main.endY);
                        ctx.lineTo(point.x, point.y);
                        ctx.stroke();
                    } else {
                        // 底部下方斜线
                        ctx.beginPath();
                        ctx.moveTo(
                            rect.x + rect.width / 2,
                            rect.y + rect.totalHeight + rect.bottomOffset
                        );
                        ctx.lineTo(line.position, target.yOffset);
                        ctx.stroke();
                    }
                });
            }
        });

        // 顶部
        ctx.fillStyle = rect.colors[0];
        ctx.fillRect(rect.x, rect.y, square, square);
        // 中部
        ctx.fillStyle = rect.colors[1];
        ctx.fillRect(rect.x, rect.y + square, square, middleH);
        // 底部
        ctx.fillStyle = rect.colors[2];
        ctx.fillRect(rect.x, rect.y + square + middleH, square, square);
    }

    draw();
}


module.exports = {
    drawStackedBarChart
};