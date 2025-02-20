function drawHeatmap(rows, cols) {
    function lerpColor(startColor, endColor, t) {
        // 确保 t 在 [0, 1] 范围内
        t = Math.min(Math.max(t, 0), 1);

        const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t);
        const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t);
        const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t);

        return [r, g, b];
    }

    const startColor = [197, 218, 182];  // 起始颜色
    const endColor = [255, 255, 255];    // 目标颜色 (白色)

    wx.createSelectorQuery().select('#myCanvasHeat')
        .fields({ node: true, size: true }).exec((res) => {
            if (!res || !res[0] || !res[0].node) {
                console.error('Canvas not found or invalid.');
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

            const cellWidth = canvas.width / (cols * dpr);
            const cellHeight = canvas.height / (dpr * rows);

            // Generate random data for demonstration purposes
            const data = Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => Math.random())
            );
            console.log(data);


            data.forEach((row, rowIndex) => {
                row.forEach((value, colIndex) => {
                    const color = lerpColor(startColor, endColor, value);
                    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                    ctx.fillRect(colIndex * cellWidth, rowIndex * cellHeight, cellWidth, cellHeight);
                });
            });
        });
}

module.exports = {
    drawHeatmap: drawHeatmap
};