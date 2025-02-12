function _idTop(md) {
  return (
    md`# Shuffling Algorithms`
  )
}

function _2(md) {
  return (
    md`
A fork of stwind's wonderful https://observablehq.com/@stwind/sorting-algorithms to add
- shuffling algorithms,
- colors that vary in brightness uniformly, which although not as pretty as the original, helps to further clarify the sort order, and
- a function to concat multiple sorts and shuffles.

The charts in this notebook use two different time scales:
- the first 19 charts use a common time scale.
- the last three charts use a common time scale that is different from the first 19.

Implications:
- time-based comparisons between the first 19 and the last 3 are invalid.
- because the first 19 use a common time scale, the fastest algorithms have their steps more compressed than they would if they were scaled to use their own maximum time.

The charts in this notebook show time running horizontally from left-to-right.

Charts in an Observable notebook seem have a maximum width.

Implications:

Because these visualizations have a maximum width, 
- they are limited to only be able to show a limited number of values or stripes -- any more values and the longer-running sorts would not have time to finish before running off the right edge, and
- they make it difficult to appreciate the difference between some algorithms, such as Naive and Fisher-Yates shuffles.

See the next notebook https://observablehq.com/@jonhelfman/shuffling-algorithms/2 for a vertical option that addresses these issues.

`
  )
}

function _3(md) {
  return (
    md`### Naive Shuffle`
  )
}

function _4(plot, results, settings) {
  return (
    plot(results.shuffle, settings)
  )
}

function _5(results) {
  return (
    results.shuffle
  )
}

function _6(settings) {
  return (
    settings
  )
}

function _7(md) {
  return (
    md`### Fisher-Yates Shuffle`
  )
}

function _8(prepare, svalues, plot, fisherYatesShuffle, settings) {
  const { copy, history } = prepare(svalues);
  return plot(fisherYatesShuffle(copy, history), settings)
}


function _9(md) {
  return (
    md`### Riffle Shuffle

Clearly wrong`
  )
}

function _10(prepare, svalues, plot, riffleShuffle, settings) {
  const { copy, history } = prepare(svalues);
  return plot(riffleShuffle(copy, history), settings)
}


function _11(md) {
  return (
    md`### Riffle Shuffle2
Closer to expected`
  )
}

function _12(prepare, svalues, plot, riffleShuffle2, settings) {
  const { copy, history } = prepare(svalues);
  return plot(riffleShuffle2(copy, history), settings)
}


function _13(md) {
  return (
    md`### Riffle Shuffle3

Add some randomness`
  )
}

function _14(prepare, svalues, plot, riffleShuffle3, settings) {
  const { copy, history } = prepare(svalues);
  return plot(riffleShuffle3(copy, history), settings)
}


function _idInsertion(md) {
  return (
    md`### Insertion Sort`
  )
}

function _16(prepare, values, plot, insertionSort, settings) {
  const { copy, history } = prepare(values);
  return plot(insertionSort(copy, history), settings)
}


function _idCyclesort(md) {
  return (
    md`### Cycle Sort`
  )
}

function _18(prepare, values, plot, cyclesort, settings) {
  const { copy, history } = prepare(values);
  return plot(cyclesort(copy, history), settings)
}


function _isCountingsort(md) {
  return (
    md`### Counting Sort`
  )
}

function _20(prepare, values, plot, countingSort, settings) {
  const { copy, history } = prepare(values);
  return plot(countingSort(copy, history), settings)
}


function _naiveShuffle(prepare, swap) {
  return (
    (values) => {
      const n = values.length;
      const { copy, history } = prepare(values);
      let time = 1;
      for (let i = 0; i < n; i++) {
        const j = Math.floor(Math.random() * n)
        swap(i, j, time++, copy, history);
      }
      return { time, history };
    }
  )
}

function _fisherYatesShuffle(swap) {
  return (
    (values, history = new Map(), time = 1) => {
      const n = values.length;
      const copy = values.map(v => v)
      for (let i = 1; i < n; i++) {
        const j = Math.floor(Math.random() * (i + 1))
        swap(i, j, time++, copy, history);
      }
      return { copy, history, time };
    }
  )
}

function _riffleShuffle(swap) {
  return (
    (values, history = new Map(), time = 1) => {
      const n = values.length;
      const copy = values.map(v => v)

      let i = Math.floor(values.length / 2)
      let j = values.length - 1
      while (i > 0) {
        swap(i--, j--, time++, copy, history);
      }
      return { copy, history, time };
    }
  )
}

function _riffleShuffle2(swap) {
  return (
    (values, history = new Map(), time = 1) => {
      const n = values.length;
      const copy = values.map(v => v)

      let i = Math.floor(values.length / 2)
      let j = 0
      while (i < values.length) {
        swap(i, j, time++, copy, history);
        i += 2
        j += 2
      }
      return { copy, history, time };
    }
  )
}

function _riffleShuffle3(swap) {
  return (
    (values, history = new Map(), time = 1) => {
      const n = values.length;
      const copy = values.map(v => v)

      let i = Math.floor(values.length / 2)
      let j = 0
      while (i < values.length) {
        swap(i, j, time++, copy, history);
        i += 1 + Math.floor(Math.random() * 2)
        j += 1 + Math.floor(Math.random() * 2)
      }
      return { copy, history, time };
    }
  )
}

function _insertionSort(swap) {
  return (
    (values, history = new Map(), time = 1) => {
      const n = values.length;
      //const { copy, history } = prepare(values);
      const copy = values.map(d => d)

      //let time = 1;
      for (let i = 1; i < n; i++) {
        let j = i;
        while (j > 0 && copy[j] < copy[j - 1]) {
          swap(j, --j, time++, copy, history);
        }
      }
      return { copy, history, time };
    }
  )
}

function _cyclesort() {
  return (
    (values, history = new Map(), time = 1) => {
      //const { copy, history } = prepare(values);
      //let time = 1;
      const copy = values.map(v => v)

      for (let i = 0; i < values.length; i++) {
        if (copy[i] != i) {
          let prev = copy[i], n = prev;

          for (; n != i; n = prev) {
            const tmp = copy[n];
            history.get(prev).push([time++, n]);
            copy[n] = prev;
            prev = tmp;
          }

          history.get(prev).push([time++, n]);
          copy[n] = prev;
        }
      }

      return { copy, history, time };
    }
  )
}

function _countingSort() {
  return (
    (values, history = new Map(), time = 1) => {
      const n = values.length;
      //const { copy, history } = prepare(values);
      //let time = 1;
      const copy = values.map(v => v)

      for (let i = 0; i < n; i++) {
        if (copy[i] != i) {
          history.get(i).push([time++, i]);
          copy[i] = i;
        }
      }

      return { copy, history, time };
    }
  )
}

function _29(md) {
  return (
    md`### Experimental Braid function to run multiple sorts and shuffles`
  )
}

function _braid(prepare, svalues) {
  return (
    function braid(alglist) {
      let { copy, history } = prepare(svalues);
      let time = 1
      alglist.forEach(a => {
        const rc = a(copy, history, time);
        copy = rc.copy
        history = rc.history
        time = rc.time
      })

      return { copy, history, time }
    }
  )
}

function _31(plot, braid, riffleShuffle, riffleShuffle2, countingSort, riffleShuffle3, settings) {
  return plot(braid([riffleShuffle, riffleShuffle2, countingSort, riffleShuffle3, countingSort]), settings)
}


function _32(plot, braid, fisherYatesShuffle, riffleShuffle2, settings) {
  return plot(braid([fisherYatesShuffle, riffleShuffle2]), settings)
}


function _33(plot, braid, riffleShuffle3, countingSort, cyclesort, fisherYatesShuffle, settings) {
  return plot(braid([riffleShuffle3, countingSort, riffleShuffle3, cyclesort, fisherYatesShuffle]), settings)
}


function _34(md) {
  return (
    md`## Below are unchanged from original notebook`
  )
}

function _idQuicksort(md) {
  return (
    md`### Quicksort [▲](#idTop)`
  )
}

function _36(plot, results, settings) {
  return (
    plot(results.quick, settings)
  )
}

function _quicksort(prepare, swap) {
  return (
    values => {
      const { copy, history } = prepare(values);
      let time = 1;

      function partition(left, right, pivot) {
        const v = copy[pivot];
        swap(pivot, --right, ++time, copy, history);
        for (let i = left; i < right; i++) {
          if (copy[i] <= v) {
            swap(i, left++, ++time, copy, history);
          }
        }
        swap(left, right, ++time, copy, history);
        return left;
      }

      function sort(left, right) {
        if (left < right - 1) {
          const pivot = partition(left, right, (left + right) >> 1);
          sort(left, pivot);
          sort(pivot + 1, right);
        }
      }

      sort(0, values.length);
      return { time, history }
    }
  )
}

function _idMergesort(md) {
  return (
    md`### Mergesort [▲](#idTop)`
  )
}

function _39(plot, results, settings) {
  return (
    plot(results.merge, settings)
  )
}

function _mergesort(prepare) {
  return (
    values => {
      const n = values.length;
      const { copy, history } = prepare(values);
      let time = 1;

      function sort(lo, hi) {
        if (lo == hi - 1) return;

        const mid = (lo + hi) >> 1;
        sort(lo, mid);
        sort(mid, hi);

        let i = lo, j = mid;
        while (i < j && j < hi) {
          if (copy[i] < copy[j]) {
            i++;
          } else {
            time++;
            const t = copy[j];

            for (let k = j; k > i; k--) {
              history.get(copy[k - 1]).push([time, k]);
              copy[k] = copy[k - 1];
            }

            history.get(t).push([time++, i]);
            copy[i] = t;
            i++; j++;
          }
        }
      }

      sort(0, n);
      return { time, history };
    }
  )
}

function _idShellsort(md) {
  return (
    md`### Shellsort [▲](#idTop)`
  )
}

function _42(plot, results, settings) {
  return (
    plot(results.shell, settings)
  )
}

function _shellsort(prepare, swap) {
  return (
    values => {
      const n = values.length;
      const { copy, history } = prepare(values);
      let time = 1;
      let h = 1;
      while (h < n / 3) h = h * 3 - 1;

      while (h >= 1) {
        for (let i = h; i < n; i++) {
          for (let j = i; j >= h && copy[j] < copy[j - h]; j -= h) {
            swap(j, j - h, ++time, copy, history);
          }
        }

        h = Math.floor(h / 3);
      }
      return { time, history };
    }
  )
}

function _idHeapsort(md) {
  return (
    md`### Heapsort [▲](#idTop)`
  )
}

function _45(plot, results, settings) {
  return (
    plot(results.heapsort, settings)
  )
}

function _heapsort(prepare, swap) {
  return (
    values => {
      const n = values.length;
      const { copy, history } = prepare(values);
      let time = 1;

      function sink(i, n) {
        let child = (i << 1) + 1;
        while (child < n) {
          if (child + 1 < n && copy[child] < copy[child + 1])
            child++;

          if (copy[child] > copy[i]) {
            swap(i, child, time++, copy, history);
          } else {
            break;
          }
          i = child;
          child = (i << 1) + 1;
        }
      }

      for (let i = Math.floor(n / 2); i >= 0; i--) {
        sink(i, n);
      }

      let end = n - 1;
      while (end > 0) {
        swap(0, end, time++, copy, history);
        sink(0, end--);
      }

      return { time, history };
    }
  )
}

function _idRadixSort(md) {
  return (
    md`### Radix Sort [▲](#idTop)`
  )
}

function _48(plot, results, settings) {
  return (
    plot(results.radix, settings)
  )
}

function _radixsort(prepare) {
  return (
    values => {
      const { copy, history } = prepare(values);
      let time = 1;

      function sort(base) {
        const counts = Array(10).fill(0);
        for (const v of copy) {
          const key = Math.floor(v / base) % 10;
          counts[key]++;
        }

        for (let i = 1; i < 10; i++)
          counts[i] += counts[i - 1];

        const cp = copy.slice();
        for (let i = cp.length - 1; i >= 0; i--) {
          const v = cp[i];
          const key = Math.floor(v / base) % 10;
          const pos = --counts[key];

          history.get(v).push([time++, pos]);
          copy[pos] = v;
        }
      }

      for (let exp = 1; exp < 100; exp *= 10)
        sort(exp);

      return { time, history };
    }
  )
}

function _idBitonicSort(md) {
  return (
    md`### Bitonic Sort [▲](#idTop)`
  )
}

function _51(plot, results, settings) {
  return (
    plot(results.bitonic, settings)
  )
}

function _bitonicSort(prepare, swap) {
  return (
    values => {
      const { copy, history } = prepare(values);
      let time = 1;

      function comp(i, j, asc) {
        if (copy[i] > copy[j] == asc) {
          swap(i, j, time++, copy, history);
        }
      }

      function merge(lo, n, asc) {
        if (n > 1) {
          const k = n / 2;
          for (let i = lo; i < lo + k; i++) {
            comp(i, i + k, asc);
          }
          merge(lo, k, asc);
          merge(lo + k, k, asc);
        }
      }

      function sort(lo, n, asc) {
        if (n > 1) {
          const k = n / 2;
          sort(lo, k, true);
          sort(lo + k, k, false);
          merge(lo, n, asc);
        }
      }

      sort(0, values.length, true);
      return { time, history };
    }
  )
}

function _53(md) {
  return (
    md`

Refererences

* [Bitonic Sort - GeeksforGeeks](https://www.geeksforgeeks.org/bitonic-sort/)
* [Bitonic sort](http://www.iti.fh-flensburg.de/lang/algorithmen/sortieren/bitonic/bitonicen.htm)
`
  )
}

function _54(md) {
  return (
    md`

References

* [Cyclesort - a curious little sorting algorithm](https://corte.si/posts/code/cyclesort/index.html)
`
  )
}

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
      // const { copy, history } = prepare(values);
      let time = 1;
      const RUN = 4;

      // function insertionSort(l, r) {
      //   for (let i = l + 1; i < r; i++) {
      //     let j = i;
      //     while (j > l && copy[j] < copy[j - 1]) {
      //       swap(j, --j, time++, copy, history);
      //     }
      //   }
      // }

      // function merge(l, mid, r) {
      //   let i = l, j = mid;
      //   while (i < j && j < r) {
      //     if (copy[i] < copy[j]) {
      //       i++;
      //     } else {
      //       time++;
      //       const t = copy[j];

      //       for (let k = j; k > i; k--) {
      //         history.get(copy[k - 1]).push([time, k]);
      //         copy[k] = copy[k - 1];
      //       }

      //       history.get(t).push([time++, i]);
      //       copy[i] = t;
      //       i++; j++;
      //     }
      //   }
      // }

      // for (let i = 0; i < n; i += RUN) {
      //   insertionSort(i, i + RUN);
      // }

      // for (let size = RUN; size < n; size *= 2) {
      //   for (let i = 0; i < n; i += size * 2) {
      //     merge(i, i + size, Math.min(n, i + size * 2));
      //   }
      // }
      const history = new Map([
        [1, [[0, 0], [3, 5], [7, 2], [12, 8], [15, 1], [20, 6]]], // 元素1在时间步数0时位于索引0，在时间步数3时移动到索引5，等等
        [2, [[0, 1], [4, 9], [8, 3], [11, 12], [14, 7], [20, 11]]], // 元素2在时间步数0时位于索引1，在时间步数4时移动到索引9，等等
        [3, [[0, 2], [2, 10], [6, 4], [10, 14], [16, 0], [20, 8]]], // 元素3在时间步数0时位于索引2，在时间步数2时移动到索引10，等等
        [4, [[0, 3], [5, 1], [9, 13], [13, 6], [17, 15], [20, 12]]], // 元素4在时间步数0时位于索引3，在时间步数5时移动到索引1，等等
        [5, [[0, 4], [6, 7], [10, 1], [14, 10], [18, 13], [20, 5]]], // 元素5在时间步数0时位于索引4，在时间步数6时移动到索引7，等等
        [6, [[0, 5], [3, 8], [8, 2], [12, 11], [16, 3], [20, 9]]], // 元素6在时间步数0时位于索引5，在时间步数3时移动到索引8，等等
        [7, [[0, 6], [4, 12], [9, 5], [13, 14], [17, 1], [20, 10]]], // 元素7在时间步数0时位于索引6，在时间步数4时移动到索引12，等等
        [8, [[0, 7], [5, 3], [10, 9], [15, 1], [19, 12], [20, 13]]], // 元素8在时间步数0时位于索引7，在时间步数5时移动到索引3，等等
        [9, [[0, 8], [2, 14], [7, 6], [11, 2], [15, 10], [20, 14]]], // 元素9在时间步数0时位于索引8，在时间步数2时移动到索引14，等等
        [10, [[0, 9], [4, 1], [8, 13], [12, 7], [16, 3], [20, 15]]], // 元素10在时间步数0时位于索引9，在时间步数4时移动到索引1，等等
        [11, [[0, 10], [6, 12], [11, 4], [15, 8], [19, 2], [20, 0]]], // 元素11在时间步数0时位于索引10，在时间步数6时移动到索引12，等等
        [12, [[0, 11], [3, 1], [7, 14], [11, 5], [16, 9], [20, 10]]], // 元素12在时间步数0时位于索引11，在时间步数3时移动到索引1，等等
        [13, [[0, 12], [5, 8], [9, 3], [13, 11], [17, 6], [20, 1]]], // 元素13在时间步数0时位于索引12，在时间步数5时移动到索引8，等等
        [14, [[0, 13], [4, 6], [8, 10], [12, 2], [16, 14], [20, 5]]], // 元素14在时间步数0时位于索引13，在时间步数4时移动到索引6，等等
        [15, [[0, 14], [6, 1], [10, 12], [14, 7], [18, 3], [20, 9]]], // 元素15在时间步数0时位于索引14，在时间步数6时移动到索引1，等等
        [16, [[0, 15], [3, 10], [7, 4], [11, 13], [15, 8], [20, 2]]]  // 元素16在时间步数0时位于索引15，在时间步数3时移动到索引10，等等
      ]);

      return { time, history };
    }
  )
}

function _58(md) {
  return (
    md`
References

* [Timsort - Wikipedia](https://en.wikipedia.org/wiki/Timsort)
* [Visualising Sorting Algorithms: Python's timsort](https://corte.si/posts/code/timsort/index.html)
  * [Timsort - a study in grayscale](https://corte.si/posts/code/timsort-grayscale/index.html)
* [The Case for Timsort - Richard Scheiwe - Medium](https://medium.com/@rscheiwe/the-case-for-timsort-349d5ce1e414)
* [Timsort: The Fastest sorting algorithm for real-world problems.](https://dev.to/s_awdesh/timsort-fastest-sorting-algorithm-for-real-world-problems--2jhd)
* [TimSort - GeeksforGeeks](https://www.geeksforgeeks.org/timsort/)
* [timsort.txt](https://bugs.python.org/file4451/timsort.txt)
* [[1805.08612] On the Worst-Case Complexity of TimSort](https://arxiv.org/abs/1805.08612)
* [timsort/cpp-TimSort: A C++ implementation of timsort](https://github.com/timsort/cpp-TimSort)
`
  )
}

function _idSmoothSort(md) {
  return (
    md`### Smooth Sort [▲](#idTop)`
  )
}

function _60(plot, results, settings) {
  return (
    plot(results.smooth, settings)
  )
}

function _smoothSort(prepare, swap) {
  class Shapes {
    static get LN() {
      return [
        1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 753, 1219, 1973,
        3193, 5167, 8361, 13529, 21891, 35421, 57313, 92735, 150049, 242785,
        392835, 635621, 1028457, 1664079, 2692537, 4356617, 7049155, 11405773,
        18454929, 29860703, 48315633, 78176337, 126491971, 204668309, 331160281,
        535828591, 866988873, 1402817465, 2269806339, 3672623805
      ];
    }

    static leftChild(tree) {
      return tree[0] > 1 ? [tree[0] - 1, tree[1]] : undefined;
    }

    static rightChild(tree) {
      return tree[0] > 1 ? [tree[0] - 2, tree[1] + Shapes.LN[tree[0] - 1]] : undefined;
    }

    static rootOffset(tree) {
      return tree[1] + Shapes.LN[tree[0]] - 1;
    }

    constructor() {
      this.trees = [];
    }

    push() {
      const n = this.trees.length;
      if (!this.canCollapse()) {
        if (n == 0) {
          this.trees.push([1, 0]);
        } else {
          const last = this.trees[n - 1];
          if (last[0] == 1) {
            this.trees.push([0, last[1] + 1]);
          } else {
            this.trees.push([1, last[1] + Shapes.LN[last[0]]]);
          }
        }
      } else {
        this.collapseLast();
      }
    }

    pop() {
      const last = this.trees.pop();
      if (last && last[0] > 1) {
        this.trees.push([last[0] - 1, last[1]]);
        this.trees.push([last[0] - 2, last[1] + Shapes.LN[last[0] - 1]]);
      }
    }

    collapseLast() {
      this.trees.pop();
      const last = this.trees.pop();
      this.trees.push([last[0] + 1, last[1]]);
    }

    canCollapse() {
      if (this.trees.length < 2) return false;

      const n = this.trees.length;
      const tree1 = this.trees[n - 1], tree2 = this.trees[n - 2];
      return tree1[0] + 1 == tree2[0];
    }
  }

  return values => {
    const n = values.length;
    const { copy, history } = prepare(values);
    let time = 1;

    const shapes = new Shapes();

    function balance(tree) {
      let left = Shapes.leftChild(tree);
      let right = Shapes.rightChild(tree);
      if (left) {
        const p = Shapes.rootOffset(tree);
        const l = Shapes.rootOffset(left);
        const r = Shapes.rootOffset(right);

        if (copy[l] > copy[p] && copy[l] > copy[r]) {
          swap(l, p, ++time, copy, history);
          balance(left);
        } else if (copy[r] > copy[p]) {
          swap(r, p, ++time, copy, history);
          balance(right);
        }
      }
    }

    function shouldSwapHeaps(i, j) {
      const tree1 = shapes.trees[i];
      const tree2 = shapes.trees[j];
      const left = Shapes.leftChild(tree1);
      const right = Shapes.rightChild(tree1);

      const a = Shapes.rootOffset(tree1);
      const b = Shapes.rootOffset(tree2);

      if (copy[a] < copy[b]) {
        if (!left || copy[Shapes.rootOffset(left)] < copy[b]) {
          return !right || copy[Shapes.rootOffset(right)] < copy[b];
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    function swapHeaps(i, j) {
      const a = Shapes.rootOffset(shapes.trees[i]);
      const b = Shapes.rootOffset(shapes.trees[j]);
      swap(a, b, ++time, copy, history);
    }

    function rectify(i) {
      if (shapes.trees.length == 1) {
        balance(shapes.trees[0]);
      } else if (shapes.trees.length > 1) {
        let cur = i;
        for (let j = i - 1; j >= 0; j--) {
          if (shouldSwapHeaps(cur, j)) {
            swapHeaps(cur, j);
            cur = j;
          }
        }
        balance(shapes.trees[cur]);
      }
    }

    for (let i = 0; i < n; i++) {
      shapes.push();
      rectify(shapes.trees.length - 1);
    }

    for (let i = 0; i < n; i++) {
      const before = shapes.trees.length;
      shapes.pop();
      if (before < shapes.trees.length) {
        rectify(shapes.trees.length - 2);
        rectify(shapes.trees.length - 1);
      }
    }

    return { time, history };
  }
}


function _62(md) {
  return (
    md`
This implementation is a port of [bowd/smoothsort](https://github.com/bowd/smoothsort), originally written in Rust.

References

* [Smoothsort - Wikipedia](https://en.wikipedia.org/wiki/Smoothsort)
* [Smoothsort Demystified](http://www.keithschwarz.com/smoothsort/)
* [E.W.Dijkstra Archive: Smoothsort, an alternative for sorting in situ (EWD 796a)](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD07xx/EWD796a.html)
* [Smoothsort in Rust — BOWD](https://www.bowd.io/smoothsort-rust/)
  * [Leonardo numbers and Math I wish I knew — BOWD](https://www.bowd.io/leonardo-numbers)
  * [Leonardo heaps and how they work — BOWD](https://www.bowd.io/leonardo-heaps/)
`
  )
}

function _idSelection(md) {
  return (
    md`### Selection Sort [▲](#idTop)`
  )
}

function _64(plot, resultsN2, settingsN2) {
  return (
    plot(resultsN2.selection, settingsN2)
  )
}

function _selectionSort(prepare, swap) {
  return (
    values => {
      const n = values.length;
      const { copy, history } = prepare(values);
      let time = 1;

      for (let i = 0; i < n; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
          if (copy[j] < copy[min]) {
            min = j;
          }
          time++;
        }

        if (i != min) {
          swap(i, min, time, copy, history);
        }
      }
      return { time, history };
    }
  )
}

function _idOddEvenSort(md) {
  return (
    md`### Odd Even Sort [▲](#idTop)`
  )
}

function _67(plot, resultsN2, settingsN2) {
  return (
    plot(resultsN2.oddeven, settingsN2)
  )
}

function _oddEvenSort(prepare, swap) {
  return (
    values => {
      const n = values.length;
      const { copy, history } = prepare(values);
      let time = 1, done = false;

      while (!done) {
        done = true;
        for (let start = 0; start < 2; start++) {
          for (let i = start; i < n - 1; i += 2) {
            time++
            if (copy[i] > copy[i + 1]) {
              swap(i, i + 1, time, copy, history);
              done = false;
            }
          }
        }
      }

      return { time, history };
    }
  )
}

function _idCocktailSort(md) {
  return (
    md`### Cocktail Sort [▲](#idTop)`
  )
}

function _70(plot, resultsN2, settingsN2) {
  return (
    plot(resultsN2.cocktail, settingsN2)
  )
}

function _cocktailSort(prepare, swap) {
  return (
    values => {
      const n = values.length;
      const { copy, history } = prepare(values);
      let time = 1, swapped = true, start = 0, end = n;

      while (swapped) {
        swapped = false;
        for (let i = start; i < end; i++) {
          time++;
          if (copy[i] > copy[i + 1]) {
            swap(i, i + 1, time, copy, history);
            swapped = true;
          }
        }

        if (!swapped) break;
        swapped = false;

        end--;
        for (let i = end; i >= start; i--) {
          time++;
          if (copy[i] > copy[i + 1]) {
            swap(i, i + 1, time, copy, history);
            swapped = true;
          }
        }
        start++;
      }

      return { time, history };
    }
  )
}

function _72(md) {
  return (
    md`## Misc`
  )
}

function _73(md) {
  return (
    md`### Data`
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

function _results(quicksort, values, mergesort, shellsort, heapsort, radixsort, bitonicSort, timsort, smoothSort, naiveShuffle, svalues) {
  // console.log(values)
  values = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  // console.log(naiveShuffle(svalues))
  return (
    {
      //insertion: insertionSort(values),
      quick: quicksort(values),
      merge: mergesort(values),
      shell: shellsort(values),
      heapsort: heapsort(values),
      //counting: countingSort(values),
      radix: radixsort(values),
      bitonic: bitonicSort(values),
      //cycle: cyclesort(values),
      timsort: timsort(values),
      smooth: smoothSort(values),
      shuffle: naiveShuffle(svalues),
      //fisherYatesShuffle: fisherYatesShuffle(svalues)
    }
  )
}

function _settings(makePlotSettings, results) {
  return (
    makePlotSettings(results)
  )
}

function _resultsN2(selectionSort, values, oddEvenSort, cocktailSort) {
  return (
    {
      selection: selectionSort(values),
      oddeven: oddEvenSort(values),
      cocktail: cocktailSort(values),
    }
  )
}

function _settingsN2(makePlotSettings, resultsN2) {
  return (
    makePlotSettings(resultsN2)
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

function _91(md) {
  return (
    md`## References

* [cortesi/sortvis: Sorting algorithm visualisation with Cairo](https://github.com/cortesi/sortvis)
  * [Visualising Sorting Algorithms](https://corte.si/posts/code/visualisingsorting/index.html)
* [Visualizing Algorithms](https://bost.ocks.org/mike/algorithms/)
  * [Quicksort V - bl.ocks.org](https://bl.ocks.org/mbostock/6dcc9a177065881b1bc4)
* [Sorting algorithm - Wikipedia](https://en.wikipedia.org/wiki/Sorting_algorithm)
* [Big-O Algorithm Complexity Cheat Sheet](https://www.bigocheatsheet.com/)
* [SORTING](http://sorting.at/)
* [BonzaiThePenguin/WikiSort](https://github.com/BonzaiThePenguin/WikiSort)
`
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("idTop")).define("idTop", ["md"], _idTop);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["plot", "results", "settings"], _4);
  main.variable(observer()).define(["results"], _5);
  main.variable(observer()).define(["settings"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["prepare", "svalues", "plot", "fisherYatesShuffle", "settings"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["prepare", "svalues", "plot", "riffleShuffle", "settings"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["prepare", "svalues", "plot", "riffleShuffle2", "settings"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["prepare", "svalues", "plot", "riffleShuffle3", "settings"], _14);
  main.variable(observer("idInsertion")).define("idInsertion", ["md"], _idInsertion);
  main.variable(observer()).define(["prepare", "values", "plot", "insertionSort", "settings"], _16);
  main.variable(observer("idCyclesort")).define("idCyclesort", ["md"], _idCyclesort);
  main.variable(observer()).define(["prepare", "values", "plot", "cyclesort", "settings"], _18);
  main.variable(observer("isCountingsort")).define("isCountingsort", ["md"], _isCountingsort);
  main.variable(observer()).define(["prepare", "values", "plot", "countingSort", "settings"], _20);
  main.variable(observer("naiveShuffle")).define("naiveShuffle", ["prepare", "swap"], _naiveShuffle);
  main.variable(observer("fisherYatesShuffle")).define("fisherYatesShuffle", ["swap"], _fisherYatesShuffle);
  main.variable(observer("riffleShuffle")).define("riffleShuffle", ["swap"], _riffleShuffle);
  main.variable(observer("riffleShuffle2")).define("riffleShuffle2", ["swap"], _riffleShuffle2);
  main.variable(observer("riffleShuffle3")).define("riffleShuffle3", ["swap"], _riffleShuffle3);
  main.variable(observer("insertionSort")).define("insertionSort", ["swap"], _insertionSort);
  main.variable(observer("cyclesort")).define("cyclesort", _cyclesort);
  main.variable(observer("countingSort")).define("countingSort", _countingSort);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("braid")).define("braid", ["prepare", "svalues"], _braid);
  main.variable(observer()).define(["plot", "braid", "riffleShuffle", "riffleShuffle2", "countingSort", "riffleShuffle3", "settings"], _31);
  main.variable(observer()).define(["plot", "braid", "fisherYatesShuffle", "riffleShuffle2", "settings"], _32);
  main.variable(observer()).define(["plot", "braid", "riffleShuffle3", "countingSort", "cyclesort", "fisherYatesShuffle", "settings"], _33);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("idQuicksort")).define("idQuicksort", ["md"], _idQuicksort);
  main.variable(observer()).define(["plot", "results", "settings"], _36);
  main.variable(observer("quicksort")).define("quicksort", ["prepare", "swap"], _quicksort);
  main.variable(observer("idMergesort")).define("idMergesort", ["md"], _idMergesort);
  main.variable(observer()).define(["plot", "results", "settings"], _39);
  main.variable(observer("mergesort")).define("mergesort", ["prepare"], _mergesort);
  main.variable(observer("idShellsort")).define("idShellsort", ["md"], _idShellsort);
  main.variable(observer()).define(["plot", "results", "settings"], _42);
  main.variable(observer("shellsort")).define("shellsort", ["prepare", "swap"], _shellsort);
  main.variable(observer("idHeapsort")).define("idHeapsort", ["md"], _idHeapsort);
  main.variable(observer()).define(["plot", "results", "settings"], _45);
  main.variable(observer("heapsort")).define("heapsort", ["prepare", "swap"], _heapsort);
  main.variable(observer("idRadixSort")).define("idRadixSort", ["md"], _idRadixSort);
  main.variable(observer()).define(["plot", "results", "settings"], _48);
  main.variable(observer("radixsort")).define("radixsort", ["prepare"], _radixsort);
  main.variable(observer("idBitonicSort")).define("idBitonicSort", ["md"], _idBitonicSort);
  main.variable(observer()).define(["plot", "results", "settings"], _51);
  main.variable(observer("bitonicSort")).define("bitonicSort", ["prepare", "swap"], _bitonicSort);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer("idTimsort")).define("idTimsort", ["md"], _idTimsort);
  main.variable(observer()).define(["plot", "results", "settings"], _56);
  main.variable(observer("timsort")).define("timsort", ["prepare", "swap"], _timsort);
  main.variable(observer()).define(["md"], _58);
  main.variable(observer("idSmoothSort")).define("idSmoothSort", ["md"], _idSmoothSort);
  main.variable(observer()).define(["plot", "results", "settings"], _60);
  main.variable(observer("smoothSort")).define("smoothSort", ["prepare", "swap"], _smoothSort);
  main.variable(observer()).define(["md"], _62);
  main.variable(observer("idSelection")).define("idSelection", ["md"], _idSelection);
  main.variable(observer()).define(["plot", "resultsN2", "settingsN2"], _64);
  main.variable(observer("selectionSort")).define("selectionSort", ["prepare", "swap"], _selectionSort);
  main.variable(observer("idOddEvenSort")).define("idOddEvenSort", ["md"], _idOddEvenSort);
  main.variable(observer()).define(["plot", "resultsN2", "settingsN2"], _67);
  main.variable(observer("oddEvenSort")).define("oddEvenSort", ["prepare", "swap"], _oddEvenSort);
  main.variable(observer("idCocktailSort")).define("idCocktailSort", ["md"], _idCocktailSort);
  main.variable(observer()).define(["plot", "resultsN2", "settingsN2"], _70);
  main.variable(observer("cocktailSort")).define("cocktailSort", ["prepare", "swap"], _cocktailSort);
  main.variable(observer()).define(["md"], _72);
  main.variable(observer()).define(["md"], _73);
  main.variable(observer("params")).define("params", _params);
  main.define("initial values", ["genValues"], _values);
  main.variable(observer("mutable values")).define("mutable values", ["Mutable", "initial values"], (M, _) => new M(_));
  main.variable(observer("values")).define("values", ["mutable values"], _ => _.generator);
  main.variable(observer("svalues")).define("svalues", ["d3", "values"], _svalues);
  main.variable(observer()).define(["md"], _77);
  main.variable(observer("results")).define("results", ["quicksort", "values", "mergesort", "shellsort", "heapsort", "radixsort", "bitonicSort", "timsort", "smoothSort", "naiveShuffle", "svalues"], _results);
  main.variable(observer("settings")).define("settings", ["makePlotSettings", "results"], _settings);
  main.variable(observer("resultsN2")).define("resultsN2", ["selectionSort", "values", "oddEvenSort", "cocktailSort"], _resultsN2);
  main.variable(observer("settingsN2")).define("settingsN2", ["makePlotSettings", "resultsN2"], _settingsN2);
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
