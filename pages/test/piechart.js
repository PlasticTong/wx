function drawPieChart(){
    wx.createSelectorQuery().select('#myCanvasPie')
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
        // ctx.fillStyle = 'black';
        // ctx.fillRect(0, 0, canvas.width, canvas.height );


        // 初始化数据和属性
        var data = [
          { title: '15-20岁', num: 12 },
          { title: '20-25岁', num: 30 },
          { title: '25-30岁', num: 22 },
          { title: '30-35岁', num: 10 },
          { title: '35-100岁', num: 12 }
        ]

        // 设置属性
        var cWidth = res[0].width
        var cHeight = res[0].height
        var zeroX = cWidth / 2 
        var zeroY = cHeight / 2
        var radius = 130
        var innerRadius = 75
        var outLine = 20
        var rectWidth = 30
        var rectHeight = 15
        var space = 20

        // 随机颜色生成器
        function getRandomColor() {
          var r = Math.floor(Math.random() * 256)
          var g = Math.floor(Math.random() * 256)
          var b = Math.floor(Math.random() * 256)
          return 'rgb(' + r + ',' + g + ',' + b + ')'
        }

        // 数据转换函数
        function transformData(data) {
          var sum = data.reduce((acc, item) => acc + item.num, 0)
          return data.map(item => ({
            title: item.title,
            num: item.num,
            angle: item.num / sum * 2 * Math.PI
          }))
        }

         // 颜色插值函数
         function interpolateYlGnBu(t) {
          // 定义起始颜色和结束颜色的RGB值
          const startColor = [255, 255, 204]; // 黄色
          const endColor = [0, 104, 55];      // 深绿色

          // 线性插值计算中间颜色
          const r = Math.floor(startColor[0] + t * (endColor[0] - startColor[0]));
          const g = Math.floor(startColor[1] + t * (endColor[1] - startColor[1]));
          const b = Math.floor(startColor[2] + t * (endColor[2] - startColor[2]));

          return `rgb(${r},${g},${b})`
        }

        // 绘制饼图
        function drawPi(ctx, data) {
          var resultData = transformData(data)
          var startAngle = 0
          resultData.forEach(function (item, index) {
            ctx.beginPath()
            ctx.moveTo(zeroX, zeroY)
            ctx.arc(zeroX, zeroY, radius, startAngle, startAngle + item.angle)
            ctx.arc(zeroX, zeroY, innerRadius, startAngle + item.angle, startAngle, true)
            ctx.closePath()
            ctx.fillStyle = interpolateYlGnBu(index / resultData.length)
            ctx.fill()

            startAngle += item.angle
          })
        }

        // 在页面加载完成后调用绘制函数
        drawPi(ctx, data)
      })
}

module.exports = {
    drawPieChart: drawPieChart
  };