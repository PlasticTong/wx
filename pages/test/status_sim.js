// status_sim.js

function drawStackedBarChart(canvasId) {
  // 样本数据（包含个人表现和小组平均值）
  const metrics = {
    Part: { personal: 85, group: 72 },
    Con: { personal: 70, group: 65 },
    Rel: { personal: 90, group: 81 },
    Res: { personal: 65, group: 68 },
    Know: { personal: 80, group: 75 }
  };

  // 颜色配置
  const colors = {
    personal: '#108b96',     // 青色
    group: '#284179',        // 深蓝
    background: '#f8f9fa',   // 背景色
    text: '#2d3436',         // 文字颜色
    grades: {
      A: '#73d13d',       // 优秀（绿色）
      B: '#ffd666',       // 良好（黄色）
      C: '#ff4d4f'        // 需改进（红色）
    }
  };

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
    canvas.height = res[0].height * dpr;
    ctx.scale(dpr, dpr);

    const totalWidth = res[0].width;
    const totalHeight = res[0].height;

    // 动态计算基准尺寸
    const baseSize = Math.min(totalWidth, totalHeight) * 0.08; // 基准尺寸（用于字体/间距等）
    const cardPadding = baseSize * 1.5; // 卡片内边距
    const chartCenterX = totalWidth * 0.5; // 雷达图水平位置
    const chartCenterY = totalHeight * 0.5; // 雷达图垂直位置
    const chartRadius = Math.min(totalWidth, totalHeight) * 0.3; // 雷达图半径

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRadarChart(chartCenterX, chartCenterY, chartRadius);
    }



    function drawRadarChart(x, y, radius) {
      const dimensions = Object.keys(metrics);
      const angle = (Math.PI * 2) / dimensions.length;

      // 绘制雷达图网格
      ctx.strokeStyle = '#e0e0e0';
      ctx.setLineDash([5, 3]);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(x, y, radius * (i + 1) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 绘制小组平均值区域（浅灰色）
      drawRadarPolygon(x, y, radius, 'group', 0.15);

      // 绘制个人表现区域（带实心端点）
      drawRadarPolygon(x, y, radius, 'personal', 0.25);

      // 绘制维度标签和评级
      drawDimensionLabels(x, y, radius + 30);

      // 绘制图例和评分系统
      drawEnhancedLegend(x + 180, y + radius + 40);
    }

    function drawRadarPolygon(x, y, radius, type, opacity) {
      const dimensions = Object.keys(metrics);
      const angle = (Math.PI * 2) / dimensions.length;

      ctx.beginPath();
      dimensions.forEach((dim, i) => {
        const value = metrics[dim][type] / 100 * radius;
        const pointX = x + Math.cos(angle * i - Math.PI / 2) * value;
        const pointY = y + Math.sin(angle * i - Math.PI / 2) * value;

        // // 为个人数据添加实心端点
        // if (type === 'personal') {
        //     ctx.beginPath();
        //     ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
        //     ctx.fillStyle = colors.personal;
        //     ctx.fill();
        // }

        i === 0 ? ctx.moveTo(pointX, pointY) : ctx.lineTo(pointX, pointY);
      });
      ctx.closePath();

      // 填充区域颜色
      ctx.fillStyle = type === 'personal'
        ? `${colors.personal}${Math.round(opacity * 255).toString(16)}`
        : `${colors.group}${Math.round(opacity * 255).toString(16)}`;
      ctx.fill();

      // 绘制轮廓线
      ctx.strokeStyle = type === 'personal' ? colors.personal : colors.group;
      ctx.lineWidth = 2;
      ctx.stroke();


      dimensions.forEach((dim, i) => {
        const value = metrics[dim][type] / 100 * radius;
        const pointX = x + Math.cos(angle * i - Math.PI / 2) * value;
        const pointY = y + Math.sin(angle * i - Math.PI / 2) * value;

        // 为个人数据添加实心端点
        if (type === 'personal') {
          ctx.beginPath();
          ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
          ctx.fillStyle = colors.personal;
          ctx.fill();
        }

      });
    }

    function drawDimensionLabels(x, y, radius) {
      const dimensions = Object.keys(metrics);
      const angle = (Math.PI * 2) / dimensions.length;


      // 学生姓名
      ctx.fillStyle = "black";
      ctx.font = '12px Arial';

      let pos_stu = {
        x: x-radius ,
        y: y -radius+20
      };

      // 绘制维度名称
      ctx.fillText("Stu.A", pos_stu.x, pos_stu.y);



      dimensions.forEach((dim, i) => {
        let pos = {
          x: x + Math.cos(angle * i - Math.PI / 2) * radius,
          y: y + Math.sin(angle * i - Math.PI / 2) * radius + 5
        };
        if (dim == "Know") {
          // 计算标签位置
          pos = {
            x: x + Math.cos(angle * i - Math.PI / 2) * radius - 20,
            y: y + Math.sin(angle * i - Math.PI / 2) * radius + 5
          };

        }

        if (dim == "Con") {
          // 计算标签位置
          pos = {
            x: x + Math.cos(angle * i - Math.PI / 2) * radius - 30,
            y: y + Math.sin(angle * i - Math.PI / 2) * radius + 5
          };

        }

        if (dim == "Part") {
          // 计算标签位置
          pos = {
            x: x + Math.cos(angle * i - Math.PI / 2) * radius - 15,
            y: y + Math.sin(angle * i - Math.PI / 2) * radius + 15
          };

        }

        if (dim == "Rel") {
          // 计算标签位置
          pos = {
            x: x + Math.cos(angle * i - Math.PI / 2) * radius - 20,
            y: y + Math.sin(angle * i - Math.PI / 2) * radius
          };

        }


        ctx.fillStyle = colors.text;
        ctx.font = '12px Arial';

        // 绘制维度名称
        ctx.fillText(dim, pos.x, pos.y);

        // 计算并绘制评级
        const diff = ((metrics[dim].personal - metrics[dim].group) / metrics[dim].group * 100).toFixed(0);
        const grade = getGrade(diff);

        ctx.fillStyle = colors.grades[grade];
        ctx.font = 'bold 14px Arial';
        ctx.fillText(grade, pos.x + 35, pos.y);
      });
    }

    function getGrade(diff) {
      if (diff >= 15) return 'A';  // 高于15%为优秀
      if (diff >= 5) return 'B';   // 5-15%为良好
      return 'C';                 // 低于5%需改进
    }

    function drawEnhancedLegend(x, y) {
      // 缩写图例项
      const legendItems = [
        { color: colors.personal, label: 'Pers.' },
        { color: colors.group, label: 'Group' }
      ];

      // 绘制图例图标
      legendItems.forEach((item, i) => {
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y + i * 30, 18, 12);
        ctx.fillStyle = colors.text;
        ctx.font = '12px Arial';
        ctx.fillText(item.label, x + 25, y + 10 + i * 30);
      });

      // 绘制评分说明
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = colors.grades.A;
      ctx.fillText('A: >15%', x + 100, y + 15);
      ctx.fillStyle = colors.grades.B;
      ctx.fillText('B: 5-15%', x + 100, y + 40);
      ctx.fillStyle = colors.grades.C;
      ctx.fillText('C: <5%', x + 100, y + 65);
    }

    // 初始化绘制
    draw();
  });
}




module.exports = {
  drawStackedBarChart
};