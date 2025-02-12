function _56(plot, results, settings) {
  return (
      plot(results.timsort, settings)
  )
}

function _timsort(prepare, swap) {
  return (
      values => {

          const n = values.length;
          let time = 10;
          const RUN = 4;
          const history = new Map([
              [1, [[0, 0], [1, 2], [2, 2], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]]],
              [2, [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]]],
              [3, [[0, 2], [1, 0], [2, 0], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]]],
              [4, [[0, 3], [1, 3], [2, 3], [3, 3], [4, 5], [5, 3], [6, 5], [7, 3]]],
              [5, [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]]],
              [6, [[0, 5], [1, 5], [2, 5], [3, 5], [4, 3], [5, 5], [6, 3], [7, 5]]],
              [7, [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]]],
              [8, [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]]],
              [9, [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]]],
              [10, [[0, 9], [1, 9], [2, 10], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9]]],
              [11, [[0, 10], [1, 10], [2, 9], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10]]],
              [12, [[0, 11], [1, 11], [2, 11], [3, 11], [4, 11], [5, 11], [6, 11], [7, 11]]],
              [13, [[0, 12], [1, 12], [2, 12], [3, 12], [4, 12], [5, 12], [6, 12], [7, 12]]],
              [14, [[0, 13], [1, 13], [2, 13], [3, 13], [4, 13], [5, 13], [6, 13], [7, 13]]],
              [15, [[0, 14], [1, 14], [2, 14], [3, 14], [4, 14], [5, 14], [6, 14], [7, 14]]],
              [16, [[0, 15], [1, 15], [2, 15], [3, 15], [4, 15], [5, 15], [6, 15], [7, 15]]]

          ]);

          return { time, history };
      }
  )
}



function _params() {
  return (
      {
          numValues: 16,
          lineWidth: 11,
          jitter: 0.5,
          height: 220,
          customColors: [
              "#FF5733", // 红橙色
              "#33FF57", // 绿色
              "#3357FF", // 蓝色
              "#FF33A1", // 粉红色
              "#FFBD33", // 橙黄色
              "#8C33FF", // 紫色
              "#33FFF0", // 青色
              "#FF334B", // 红色
              "#33FF9D", // 浅绿色
              "#FF8F33", // 橙色
              "#33B2FF", // 浅蓝色
              "#FF33E1", // 深粉色
              "#FFD333", // 黄色
              "#A133FF", // 深紫色
              "#33FFF7", // 浅青色
              "#FF3374"  // 深红色
          ]
      }
  )
}

function _values(genValues) {
  return (
      genValues()
  )
}

function _svalues(d3, values) {
  return (
      d3.range(values.length)
  )
}

function _77(md) {
  return (
      md`### Results`
  )
}

function _results(values, timsort) {
  return (
      {
          timsort: timsort(values),
      }
  )
}

function _settings(makePlotSettings, results) {
  return (
      makePlotSettings(results)
  )
}




function _82(md) {
  return (
      md`### Utils`
  )
}

function _drawlines(params, data, svg, scales, d3, xt, tf, a, b) {
  const lines = svg.append('g').classed('lines', true)
      .attr('transform', `translate(0,${params.lineWidth})`);
  const polylinePoints = d => d[1].map(([t, y]) => `${scales.x(t + xt)},${scales.y(y)}`).join(' ');
  let filteredData = data
  if (tf == 1) {
      filteredData = []
      // 过滤数据，只保留 x 值在 a 到 b 之间的点
      filteredData = data.map(series => [
          series[0],
          series[1].filter(point => point[0] >= a && point[0] <= b)
      ]);
  }
  console.log(filteredData)

  lines.selectAll('.line').data(filteredData)
      .join(enter => enter.append('g').call(g => {
          g.append('polyline').classed('line-border', true)
              .attr('points', polylinePoints)
              .attr('stroke', d3.hsl(0, 0, 0.1))
              .attr('stroke-width', `${params.lineWidth + 1.5}px`)
              .attr('stroke-linecap', 'round')
              .attr('stroke-linejoin', 'round')
              .attr('fill', 'none');
          g.append('polyline').classed('line-fill', true)
              .attr('points', polylinePoints)
              // .attr('stroke', d => scales.color(scales.values(d[0])))
              .attr('stroke', d => params.customColors[d[0] - 1])
              .attr('stroke-width', `${params.lineWidth}px`)
              .attr('stroke-linecap', 'round')
              .attr('stroke-linejoin', 'round')
              .attr('fill', 'none');
      }))
      .classed('line', true);

}


// 新的函数来交换每个子数组的索引n和索引m的数据点
function _swapIndex(data, n, m) {
  return data.map(series => {
      if (series[1].length > 2) {

          const temp = series[1][n];
          console.log(temp)
          series[1][n] = series[1][m];
          series[1][m] = temp;
      }
      return series;
  });
}

// 新的函数来交换每个子数组的指定索引a和索引b的数据点使用 push 方法
function swapIndexAandIndexB(data, indexA, indexB) {
  const series = []
  for (let i = 0; i < data.length; i++) {
      if (i === indexA) {
          series.push(data[indexB]);
      } else if (i === indexB) {
          series.push(data[indexA]);
      } else {
          series.push(data[i]);
      }
  }
  return series
}



function _plot(d3, DOM, width, params, makePointsData, $0, genValues) {
  return (
      (result, { maxTime, scales }) => {
          const svg = d3.select(DOM.svg(width, params.height));


          const data = makePointsData(result, maxTime);

          let reversedData = [];

          for (let i = data.length - 1; i >= 0; i--) {
              reversedData.push(data[i]);
          }
          console.log(data)

          _drawlines(params, data, svg, scales, d3, 0, 1, 0, 1.5)
          const test = swapIndexAandIndexB(data, 0, 2)
          console.log("test:", test)
          _drawlines(params, test, svg, scales, d3, 0, 1, 1.5, 2.5)
          let test_1 = swapIndexAandIndexB(test, 10, 9)
          _drawlines(params, test_1, svg, scales, d3, 0, 1, 2.5, 4.5)
          let test2 = swapIndexAandIndexB(data, 3, 5)
          _drawlines(params, test2, svg, scales, d3, 0, 1, 4.5, 5.5)
          let test3 = swapIndexAandIndexB(test2, 3, 5)
          _drawlines(params, test3, svg, scales, d3, 0, 1, 5.5, 6.5)
          let test4 = swapIndexAandIndexB(test3, 3, 5)
          _drawlines(params, test4, svg, scales, d3, 0, 1, 6.5, 10)


          svg.on('click', () => {
              $0.value = genValues();
          });

          return svg.node();
      }
  )
}

function _makePlotSettings(d3, values, width, params) {
  return (
      results => {
          const maxTime = d3.max(d3.values(results), d => d.time);
          const scales = {
              values: d3.scaleLinear().domain([d3.min(values), d3.max(values)]).range([0.2, 0.8]),
              x: d3.scaleLinear().domain([0, maxTime]).range([0, width]),
              y: d3.scaleLinear().domain([0, values.length]).range([0, params.height]),
              // color: d3.interpolateRdYlBu
              // // color: d3.interpolatePuBuGn
              color: d3.interpolateYlGnBu
          };
          return { maxTime, scales };
      }
  )
}

function _makePointsData(params) {
  return (
      ({ history }, maxTime) => {
          function makePoints(entries) {
              const res = [entries[0]];
              for (let i = 1; i < entries.length; i++) {
                  const a = entries[i - 1], b = entries[i];
                  res.push([b[0] - params.jitter, a[1]]);
                  res.push([b[0] + params.jitter, b[1]]);
              }
              res.push([maxTime, res[res.length - 1][1]]);
              return res;
          }

          return [...history.entries()].map(([k, v]) => [k, makePoints(v)]);
      }
  )
}

function _genValues(d3, params) {
  return (
      () => d3.shuffle(d3.range(params.numValues))
  )
}

function _prepare() {
  return (
      values => ({
          copy: values.slice(),
          history: values.reduce((map, x, i) => map.set(x, [[0, i]]), new Map())
      })
  )
}

function _swap() {
  return (
      (i, j, time, copy, history) => {
          history.get(copy[i]).push([time, j]);
          history.get(copy[j]).push([time, i]);

          const t = copy[i];
          copy[i] = copy[j];
          copy[j] = t;
      }
  )
}

function _89(md) {
  return (
      md`## Appendix`
  )
}

function _d3(require) {
  return (
      require('d3@5')
  )
}

function test(){
  console.log("sssssssssss")
  return 123123
}
// module.exports = {
//   idTimsort: test,
//   genValues:_56
//   // sharedData: sharedData
// };