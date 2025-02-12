
  
  function _idTimsort(md) {
    return (
      md`### Timsort [▲](#idTop)`
    )
  }
  
  function _56(plot, results, settings) {
    console.log(results.timsort)
    console.log(settings)
    return (
      plot(results.timsort, settings)
    )
  }
  
  function _timsort(prepare, swap) {
    return (
      values => {
        const n = values.length;
        let time = 20;
        const RUN = 4;
        const history = new Map([
            [1, [[0, 0], [3, 5], [7, 2], [12, 8], [15, 1], [20, 6]]],
            [2, [[0, 1], [4, 9], [8, 3], [11, 12], [14, 7], [20, 11]]],
            [3, [[0, 2], [2, 10], [6, 4], [10, 14], [16, 0], [20, 8]]],
            [4, [[0, 3], [5, 13], [9, 6], [13, 15], [17, 1], [20, 12]]],
            [5, [[0, 4], [6, 7], [10, 1], [14, 10], [18, 13], [20, 5]]],
            [6, [[0, 5], [3, 8], [8, 2], [12, 11], [16, 3], [20, 9]]],
            [7, [[0, 6], [4, 12], [9, 5], [13, 14], [17, 0], [20, 10]]],
            [8, [[0, 7], [5, 3], [10, 9], [15, 1], [19, 12], [20, 13]]],
            [9, [[0, 8], [2, 14], [7, 6], [11, 2], [15, 10], [20, 14]]],
            [10, [[0, 9], [4, 1], [8, 13], [12, 7], [16, 3], [20, 15]]],
            [11, [[0, 10], [6, 12], [11, 4], [15, 8], [19, 2], [20, 0]]],
            [12, [[0, 11], [3, 1], [7, 14], [11, 5], [16, 9], [20, 10]]],
            [13, [[0, 12], [5, 8], [9, 3], [13, 11], [17, 6], [20, 1]]],
            [14, [[0, 13], [4, 6], [8, 10], [12, 2], [16, 14], [20, 5]]],
            [15, [[0, 14], [6, 1], [10, 12], [14, 7], [18, 3], [20, 9]]],
            [16, [[0, 15], [3, 10], [7, 4], [11, 13], [15, 8], [20, 2]]]
          ]);
  
        return { time, history };
      }
    )
  }


  
  function _params() {
    return (
      {
        numValues: 16,
        lineWidth: 8,
        jitter: 0.5,
        height: 220,
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
  
  function _results( values,timsort) {
    // console.log(values)
    // values = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    // console.log(naiveShuffle(svalues))
    return (
      {
        //insertion: insertionSort(values),
        // quick: quicksort(values),
        // merge: mergesort(values),
        // shell: shellsort(values),
        // heapsort: heapsort(values),
        //counting: countingSort(values),
        // radix: radixsort(values),
        // bitonic: bitonicSort(values),
        //cycle: cyclesort(values),
        timsort: timsort(values),
        // smooth: smoothSort(values),
        // shuffle: naiveShuffle(svalues),
        //fisherYatesShuffle: fisherYatesShuffle(svalues)
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
  
  function _plot(d3, DOM, width, params, makePointsData, $0, genValues) {
    return (
      (result, { maxTime, scales }) => {
        const svg = d3.select(DOM.svg(width, params.height));
  
        const lines = svg.append('g').classed('lines', true)
          .attr('transform', `translate(0,${params.lineWidth})`);
        const data = makePointsData(result, maxTime);
        const polylinePoints = d => d[1].map(([t, y]) => `${scales.x(t)},${scales.y(y)}`).join(' ');
  
        lines.selectAll('.line').data(data)
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
              .attr('stroke', d => scales.color(scales.values(d[0])))
              .attr('stroke-width', `${params.lineWidth}px`)
              .attr('stroke-linecap', 'round')
              .attr('stroke-linejoin', 'round')
              .attr('fill', 'none');
          }))
          .classed('line', true);
  
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
        const maxTime = d3.max(d3.values(results), d => d.time)+2;
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

  
  export default function define(runtime, observer) {
    const main = runtime.module();
    // main.variable(observer("naiveShuffle")).define("naiveShuffle", ["prepare", "swap"], _naiveShuffle);
    // main.variable(observer("fisherYatesShuffle")).define("fisherYatesShuffle", ["swap"], _fisherYatesShuffle);
    // main.variable(observer("riffleShuffle")).define("riffleShuffle", ["swap"], _riffleShuffle);
    // main.variable(observer("riffleShuffle2")).define("riffleShuffle2", ["swap"], _riffleShuffle2);
    // main.variable(observer("riffleShuffle3")).define("riffleShuffle3", ["swap"], _riffleShuffle3);
    // main.variable(observer("insertionSort")).define("insertionSort", ["swap"], _insertionSort);
    // main.variable(observer("cyclesort")).define("cyclesort", _cyclesort);
    // main.variable(observer("countingSort")).define("countingSort", _countingSort);
    // // main.variable(observer("braid")).define("braid", ["prepare", "svalues"], _braid);

    // // main.variable(observer("idQuicksort")).define("idQuicksort", ["md"], _idQuicksort);
    // // main.variable(observer()).define(["plot", "results", "settings"], _36);
    // main.variable(observer("quicksort")).define("quicksort", ["prepare", "swap"], _quicksort);
    // // main.variable(observer("idMergesort")).define("idMergesort", ["md"], _idMergesort);
    // // main.variable(observer()).define(["plot", "results", "settings"], _39);
    // main.variable(observer("mergesort")).define("mergesort", ["prepare"], _mergesort);
    // // main.variable(observer("idShellsort")).define("idShellsort", ["md"], _idShellsort);
    // // main.variable(observer()).define(["plot", "results", "settings"], _42);
    // main.variable(observer("shellsort")).define("shellsort", ["prepare", "swap"], _shellsort);
    // // main.variable(observer("idHeapsort")).define("idHeapsort", ["md"], _idHeapsort);
    // // main.variable(observer()).define(["plot", "results", "settings"], _45);
    // main.variable(observer("heapsort")).define("heapsort", ["prepare", "swap"], _heapsort);
    // // main.variable(observer("idRadixSort")).define("idRadixSort", ["md"], _idRadixSort);
    // // main.variable(observer()).define(["plot", "results", "settings"], _48);
    // main.variable(observer("radixsort")).define("radixsort", ["prepare"], _radixsort);
    // // main.variable(observer("idBitonicSort")).define("idBitonicSort", ["md"], _idBitonicSort);
    // // main.variable(observer()).define(["plot", "results", "settings"], _51);
    // main.variable(observer("bitonicSort")).define("bitonicSort", ["prepare", "swap"], _bitonicSort);
    // main.variable(observer()).define(["md"], _53);
    // main.variable(observer()).define(["md"], _54);
    main.variable(observer("idTimsort")).define("idTimsort", ["md"], _idTimsort);
    main.variable(observer()).define(["plot", "results", "settings"], _56);
    main.variable(observer("timsort")).define("timsort", ["prepare", "swap"], _timsort);
    // main.variable(observer()).define(["md"], _58);
    // main.variable(observer("idSmoothSort")).define("idSmoothSort", ["md"], _idSmoothSort);
    // main.variable(observer()).define(["plot", "results", "settings"], _60);
    // main.variable(observer("smoothSort")).define("smoothSort", ["prepare", "swap"], _smoothSort);
    // main.variable(observer()).define(["md"], _62);
    // main.variable(observer("idSelection")).define("idSelection", ["md"], _idSelection);
    // main.variable(observer()).define(["plot", "resultsN2", "settingsN2"], _64);
    // main.variable(observer("selectionSort")).define("selectionSort", ["prepare", "swap"], _selectionSort);
    // main.variable(observer("idOddEvenSort")).define("idOddEvenSort", ["md"], _idOddEvenSort);
    // main.variable(observer()).define(["plot", "resultsN2", "settingsN2"], _67);
    // main.variable(observer("oddEvenSort")).define("oddEvenSort", ["prepare", "swap"], _oddEvenSort);
    // main.variable(observer("idCocktailSort")).define("idCocktailSort", ["md"], _idCocktailSort);
    // main.variable(observer()).define(["plot", "resultsN2", "settingsN2"], _70);
    // main.variable(observer("cocktailSort")).define("cocktailSort", ["prepare", "swap"], _cocktailSort);
    // main.variable(observer()).define(["md"], _72);
    // main.variable(observer()).define(["md"], _73);
    main.variable(observer("params")).define("params", _params);
    main.define("initial values", ["genValues"], _values);
    main.variable(observer("mutable values")).define("mutable values", ["Mutable", "initial values"], (M, _) => new M(_));
    main.variable(observer("values")).define("values", ["mutable values"], _ => _.generator);
    main.variable(observer("svalues")).define("svalues", ["d3", "values"], _svalues);
    main.variable(observer()).define(["md"], _77);
    main.variable(observer("results")).define("results", ["values", "timsort",  "svalues"], _results);
    main.variable(observer("settings")).define("settings", ["makePlotSettings", "results"], _settings);
    // main.variable(observer("resultsN2")).define("resultsN2", ["selectionSort", "values", "oddEvenSort", "cocktailSort"], _resultsN2);
    // main.variable(observer("settingsN2")).define("settingsN2", ["makePlotSettings", "resultsN2"], _settingsN2);
    main.variable(observer()).define(["md"], _82);
    main.variable(observer("plot")).define("plot", ["d3", "DOM", "width", "params", "makePointsData", "mutable values", "genValues"], _plot);
    main.variable(observer("makePlotSettings")).define("makePlotSettings", ["d3", "values", "width", "params"], _makePlotSettings);
    main.variable(observer("makePointsData")).define("makePointsData", ["params"], _makePointsData);
    main.variable(observer("genValues")).define("genValues", ["d3", "params"], _genValues);
    main.variable(observer("prepare")).define("prepare", _prepare);
    main.variable(observer("swap")).define("swap", _swap);
    main.variable(observer()).define(["md"], _89);
    main.variable(observer("d3")).define("d3", ["require"], _d3);
    main.variable(observer()).define(["md"], _91);
    return main;
  }
  