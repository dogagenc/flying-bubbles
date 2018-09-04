function DrawFont(context) {
  const patterns = [[1],[,1],[,,1],[1,1],[1,,1],[,1,1],[1,1,1],[,,],[1,1,1,1,1],[1,,,1],[1,,,,1]];
  const letters = {
    A: [6,4,4,6,4],
    B: [3,4,6,4,3],
    C: [6,0,0,0,6],
    D: [3,4,4,4,3],
    E: [6,0,6,0,6],
    F: [6,0,3,0,0],
    G: [5,0,[1,,1,1],9,5],
    H: [4,4,6,4,4],
    I: [6,1,1,1,6],
    J: [6,2,2,4,6],
    K: [4,4,3,4,4],
    L: [0,0,0,0,6],
    M: [8,[1,,1,,1],[1,,1,,1],10,10],
    N: [9,[1,1,,1],[1,,1,1],9,9],
    O: [6,4,4,4,6],
    P: [6,4,6,0,0],
    Q: [5,[1,,,1],9,[1,,1,1],[1,1,1,1]],
    R: [3,4,4,3,4],
    S: [6,0,6,2,6],
    T: [6,1,1,1,1],
    U: [4,4,4,4,6],
    V: [10,10,[,1,,1],[,1,,1],2],
    W: [[1,,1,,1],[1,,1,,1],[1,,1,,1],[1,,1,,1],[1,1,,1,1]],
    X: [10,[,1,,1],2,[,1,,1],10],
    Y: [4,4,1,1,1],
    Z: [8,[,,,1],2,1,8],
    0: [6,4,4,4,6],
    1: [1,1,1,1,1],
    2: [6,2,6,0,6],
    3: [6,2,6,2,6],
    4: [0,0,4,6,2],
    5: [6,0,6,2,6],
    6: [6,0,6,4,6],
    7: [6,2,2,2,2],
    8: [6,4,6,4,6],
    9: [6,4,6,2,6],
    ' ': [7,7,7,7,7],
    '/': [[,,,,1],[,,,1],2,1,0],
    '.': [[,1,1,1,],8,8,8,[,1,1,1,]],
    '-': [7,7,6],
    '>': [1, 2, [1,1,1,1], 2, 1]
  };

  this.drawText = (text, size, x, y, color) => {
      context.fillStyle = color;

      text.toUpperCase().split('')
        .reduce((needed, letter) => [...needed, letters[letter]], [])
        .reduce((tracker, letter) => {
          if (!letter) return tracker;

          letter.forEach(row => {
            row = Array.isArray(row) ? row : patterns[row];
            row.forEach((col, i) => col && context.fillRect(tracker.x + i * size, tracker.y, size, size));
            tracker.d = Math.max(tracker.d, row.length * size);
            tracker.y += size;
          });

          return { x: tracker.x + size + tracker.d, y, d: 0 };
        }, { x, y, d: 0 });
  };
};
