import "./styles.css";
/* eslint-disable */

function main() {
  const [element, tiles] = generateTiles();
  add_number(tiles);
  add_number(tiles);
  Print(element, tiles);
  _listeners(element, tiles);
}

function generateTiles() {
  const element = document.querySelector(".tiles");
  element.style.setProperty("--size", 4);
  const tiles = Array.from({ length: 4 * 4 }).fill(0);
  return [element, tiles];
}

function add_number(tiles) {
  if (!some(tiles, (x) => x == 0)) return;
  const index = Math.floor(Math.random() * tiles.length);
  const number = Math.random() <= 0.9 ? 2 : 4;
  if (tiles[index] == 0) {
    tiles[index] = number;
  } else {
    add_number(tiles);
  }
}

function _listeners(element, tiles) {
  const f = (evt) => {
    switch (evt.key) {
      case "ArrowUp":
        if (move_up(tiles)) {
          Print(element, tiles);
          if (is_win(tiles)) {
            document.removeEventListener("keydown", f);
            return;
          }
          add_number(tiles);
          Print(element, tiles);
        } else if (is_lose(tiles)) {
          document.removeEventListener("keydown", f);
        }
        return;
      case "ArrowRight":
        if (move_right(tiles)) {
          Print(element, tiles);
          if (is_win(tiles)) {
            document.removeEventListener("keydown", f);
            return;
          }
          add_number(tiles);
          Print(element, tiles);
        } else if (is_lose(tiles)) {
          document.removeEventListener("keydown", f);
        }
        return;
      case "ArrowDown":
        if (move_down(tiles)) {
          Print(element, tiles);
          if (is_win(tiles)) {
            document.removeEventListener("keydown", f);
            return;
          }
          add_number(tiles);
          Print(element, tiles);
        } else if (is_lose(tiles)) {
          document.removeEventListener("keydown", f);
        }
        return;
      case "ArrowLeft":
        if (move_left(tiles)) {
          Print(element, tiles);
          if (is_win(tiles)) {
            document.removeEventListener("keydown", f);
            return;
          }
          add_number(tiles);
          Print(element, tiles);
        } else if (is_lose(tiles)) {
          document.removeEventListener("keydown", f);
        }
        return;
      default:
    }
  };
  document.addEventListener("keydown", f);
}

function Print(element, tiles) {
  element.innerHTML = "";
  for (const x of tiles) {
    const scale = x == 0 ? 0 : Math.log2(x);
    const sat = Math.min(scale * 16, 100);
    const light = Math.max(40, 100 - sat / 2);
    element.innerHTML += `<span class="tile" style="--sat: ${sat}; --light: ${light}">${
      x == 0 ? "" : x
    }</span>`;
  }
}

function move_up(tiles) {
  const prev = cloned(tiles);
  const size = Math.sqrt(tiles.length);
  for (let i = 0; i < size; ++i) {
    const column = filter(tiles, (_, j) => j % size == i);
    const moved = filter(column, (x) => x !== 0);
    const merged = merge_up(moved);
    const padded = concat(
      merged,
      Array.from({ length: size - merged.length }).fill(0)
    );
    for (let j = 0; j < size * size; ++j) {
      if (j % size == i) {
        tiles[j] = padded.shift();
      }
    }
  }
  return !is_equal(prev, tiles);
}
function move_right(tiles) {
  const prev = cloned(tiles);
  const size = Math.sqrt(tiles.length);
  for (let i = 0; i < size; ++i) {
    const row = filter(tiles, (_, j) => Math.trunc(j / size) == i);
    const moved = filter(row, (x) => x !== 0);
    const merged = merge_right(moved);
    const padded = concat(
      Array.from({ length: size - merged.length }).fill(0),
      merged
    );
    for (let j = 0; j < size * size; ++j) {
      if (Math.trunc(j / size) == i) {
        tiles[j] = padded.shift();
      }
    }
  }
  return !is_equal(prev, tiles);
}
function move_down(tiles) {
  const prev = cloned(tiles);
  const size = Math.sqrt(tiles.length);
  for (let i = 0; i < size; ++i) {
    const column = filter(tiles, (_, j) => j % size == i);
    const moved = filter(column, (x) => x !== 0);
    const merged = merge_down(moved);
    const padded = concat(
      Array.from({ length: size - merged.length }).fill(0),
      merged
    );
    for (let j = 0; j < size * size; ++j) {
      if (j % size == i) {
        tiles[j] = padded.shift();
      }
    }
  }
  return !is_equal(prev, tiles);
}
function move_left(tiles) {
  const prev = cloned(tiles);
  const size = Math.sqrt(tiles.length);
  for (let i = 0; i < size; ++i) {
    const row = filter(tiles, (_, j) => Math.trunc(j / size) == i);
    const moved = filter(row, (x) => x !== 0);
    const merged = merge_left(moved);
    const padded = concat(
      merged,
      Array.from({ length: size - merged.length }).fill(0)
    );
    for (let j = 0; j < size * size; ++j) {
      if (Math.trunc(j / size) == i) {
        tiles[j] = padded.shift();
      }
    }
  }
  return !is_equal(prev, tiles);
}

function is_lose(tiles) {
  if (some(tiles, (x) => x == 0)) return false;
  const message = document.querySelector(".message");
  message.innerHTML = "you lose!";
  message.classList.remove("hidden");
  return true;
}

function is_win(tiles) {
  if (!some(tiles, (x) => x == 2048)) return false;
  const message = document.querySelector(".message");
  message.innerHTML = "you win!";
  message.classList.remove("hidden");
  return true;
}

function cloned(tiles) {
  return JSON.parse(JSON.stringify(tiles));
}

function is_equal(left, right) {
  return JSON.stringify(left) == JSON.stringify(right);
}

function merge_up(tiles) {
  for (let i = 0; i < tiles.length - 1; ++i) {
    const current = tiles[i];
    const next = tiles[i + 1];
    if (current == next) {
      tiles[i] = current * 2;
      tiles[i + 1] = 0;
    }
  }
  return filter(tiles, (x) => x !== 0);
}
function merge_right(tiles) {
  for (let i = tiles.length - 1; i > 0; --i) {
    const current = tiles[i];
    const next = tiles[i - 1];
    if (current == next) {
      tiles[i] = current * 2;
      tiles[i - 1] = 0;
    }
  }
  return filter(tiles, (x) => x !== 0);
}
function merge_down(tiles) {
  for (let i = tiles.length - 1; i > 0; --i) {
    const current = tiles[i];
    const next = tiles[i - 1];
    if (current == next) {
      tiles[i] = current * 2;
      tiles[i - 1] = 0;
    }
  }
  return filter(tiles, (x) => x !== 0);
}
function merge_left(tiles) {
  for (let i = 0; i < tiles.length - 1; ++i) {
    const current = tiles[i];
    const next = tiles[i + 1];
    if (current == next) {
      tiles[i] = current * 2;
      tiles[i + 1] = 0;
    }
  }
  return filter(tiles, (x) => x !== 0);
}

function some(xs, f) {
  for (const [i, x] of xs.entries()) {
    if (f(x, i, xs)) return true;
  }
  return false;
}
function filter(xs, f) {
  const ys = [];
  for (const [i, x] of xs.entries()) {
    if (f(x, i, xs)) {
      ys.push(x);
    }
  }
  return ys;
}
function concat(xs, ys) {
  let zs = [];
  for (const x of xs) {
    zs = [...zs, x];
  }
  for (const y of ys) {
    zs.push(y);
  }
  return zs;
}

main();
