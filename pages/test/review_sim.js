// histogram.js

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

        // 饼图固定数据配置
        const pieConfigs = [
            { // 饼图1
                segments: [
                    { ratio: 0.3, color: '#FF6384' },
                    { ratio: 0.5, color: '#36A2EB' },
                    { ratio: 0.2, color: '#FFCE56' }
                ],
                innerColor: '#4BC0C0'
            },
            { // 饼图2
                segments: [
                    { ratio: 0.4, color: '#9966FF' },
                    { ratio: 0.3, color: '#FF9F40' },
                    { ratio: 0.3, color: '#00CC99' }
                ],
                innerColor: '#FF6666'
            },
            { // 饼图3
                segments: [
                    { ratio: 0.25, color: '#FF99CC' },
                    { ratio: 0.35, color: '#66CCFF' },
                    { ratio: 0.4, color: '#99FF99' }
                ],
                innerColor: '#FFD700'
            },
            { // 饼图4
                segments: [
                    { ratio: 0.5, color: '#C71585' },
                    { ratio: 0.25, color: '#20B2AA' },
                    { ratio: 0.25, color: '#DAA520' }
                ],
                innerColor: '#8A2BE2'
            },
            { // 饼图5
                segments: [
                    { ratio: 0.2, color: '#7B68EE' },
                    { ratio: 0.4, color: '#48D1CC' },
                    { ratio: 0.4, color: '#FFA07A' }
                ],
                innerColor: '#2E8B57'
            }
        ];

         // 修改部分开始：动态计算参数
         const config = {
            pieCount: 5,
            baseSize: Math.min(totalWidth, totalHeight) * 0.15, // 基础尺寸比例
            ringRatio: 0.25,     // 内环比例
            gapRatio: 0.02,      // 间隔比例
            cols: 3,             // 默认列数
            marginRatio: 0.08    // 边距比例
        };

        // 动态计算实际尺寸
        const actual = {
            pieSize: config.baseSize,
            ringWidth: config.baseSize * config.ringRatio,
            spacing: config.baseSize * 3,
            margin: config.baseSize * config.marginRatio
        };

        // 修改绘制函数
        function drawSegmentedPie(x, y, index) {
            const { segments, innerColor } = pieConfigs[index];
            const gapAngle = Math.PI * 2 * config.gapRatio; // 动态间隔角度
            const totalAngle = Math.PI * 2 - (segments.length * gapAngle);
            let startAngle = -Math.PI / 2;

            segments.forEach((seg, i) => {
                const segmentAngle = totalAngle * seg.ratio;
                
                // 绘制扇面
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, actual.pieSize, startAngle, startAngle + segmentAngle);
                ctx.closePath();
                ctx.fillStyle = seg.color;
                ctx.fill();

                // 绘制间隔
                ctx.beginPath();
                ctx.arc(x, y, actual.pieSize, 
                    startAngle + segmentAngle, 
                    startAngle + segmentAngle + gapAngle
                );
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.stroke();

                startAngle += segmentAngle + gapAngle;
            });

            // 绘制内层圆
            const innerSize = actual.pieSize - actual.ringWidth;
            ctx.beginPath();
            ctx.arc(x, y, innerSize, 0, Math.PI * 2);
            ctx.fillStyle = innerColor;
            ctx.fill();

            // 内圈边框
            ctx.beginPath();
            ctx.arc(x, y, innerSize, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,1)';
            ctx.lineWidth = actual.ringWidth * 0.6; // 动态边框宽度
            ctx.stroke();
        }

        // 修改布局计算
        function calculatePositions(index) {
            const availableWidth = totalWidth - 2 * actual.margin;
            const colWidth = availableWidth / config.cols;
            
            return {
                x: actual.margin + (index % config.cols) * colWidth + colWidth/2,
                y: actual.margin + Math.floor(index / config.cols) * actual.spacing +2*actual.pieSize
            };
        }

        // 绘制时传递index参数
        for (let i = 0; i < config.pieCount; i++) {
            const pos = calculatePositions(i);
            drawSegmentedPie(pos.x, pos.y, i);  // 添加第三个参数
        }

    });
}  





module.exports = {
    drawStackedBarChart
};