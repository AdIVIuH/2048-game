import "./styles.css";

/* eslint-disable */

// class Game depends on these constants
const UP = "UP";
const RIGHT = "RIGHT";
const DOWN = "DOWN";
const LEFT = "LEFT";

let GAME;

class Game {
  constructor(onStateChange, onWin, onLose) {
    this.onStateChange = onStateChange;
    this.onWin = onWin;
    this.onLose = onLose;
  }

  start(size) {
    this.size = size;
    this.tiles = Array.from({ length: size * size }).fill(0);
    this._add_number();
    this._add_number();
  }

  make_movement(direction) {
    if (this.is_win() || this.is_lose()) return;

    this.oldTiles = this.tiles;
    this._update_state(direction);

    if (!this._tilesUpdated()) {
      if (!this.is_win()) this._add_number();
      this.onStateChange();
    }

    if (this.is_win()) {
      this.onWin();
    }

    if (this.is_lose()) {
      this.onLose();
    }

    return this.tiles;
  }

  is_lose() {
    return !this.tiles.some(x => x === 0);
  }

  is_win() {
    return this.tiles.some(x => x === 2048);
  }

  // recursion fixed
  _add_number() {
    if (!this.tiles.some(x => x === 0)) return;

    let emptiesIndexies = this.tiles
      .map((x, i) => ({
        i, x
      }))
      .filter(el => el.x === 0)
      .map(el => el.i);

    const index = emptiesIndexies[Math.floor(Math.random() * emptiesIndexies.length)];
    this.tiles[index] = Math.random() <= 0.9 ? 2 : 4;
  }

  _update_state(direction) {
    const newState = [...this.tiles];
    const size = Math.sqrt(this.tiles.length);
    for (let i = 0; i < size; ++i) {
      let isHorizontal = direction === RIGHT || direction === LEFT;
      let isLine = index => isHorizontal ? Math.trunc(index / size) === i : index % size === i;
      const line = this.tiles.filter((t, j) => isLine(j));
      const moved = line.filter(x => x !== 0);
      const merged = this._merge(moved);
      const empty = Array.from({ length: size - merged.length }).fill(0);
      const padded = direction === UP || direction === LEFT ? merged.concat(empty) : empty.concat(merged);
      for (let j = 0; j < size * size; ++j) {
        if (isLine(j)) {
          newState[j] = padded.shift();
        }
      }
    }

    this.tiles = newState;
  }

  _merge(array) {
    for (let i = 0; i < array.length - 1; ++i) {
      const current = array[i];
      const next = array[i + 1];
      if (current === next) {
        array[i] = current * 2;
        array[i + 1] = 0;
      }
    }
    return array.filter(t => t !== 0);
  }

  _tilesUpdated() {
    return JSON.stringify(this.oldTiles) === JSON.stringify(this.tiles);
  }
}

function main() {
  let size = 4;
  GAME = new Game(onStateChangeHandler, onWinHandler, onLoseHandler);
  GAME.start(size);

  initializeTiles(size);
}

function initializeTiles(size) {
  const element = document.querySelector(".tiles");
  element.style.setProperty("--size", size);
  print(element, GAME.tiles);

  add_listeners();
}

function add_listeners() {
  document.addEventListener("keydown", keydown_handler);
}

function keydown_handler(e) {
  let direction = get_direction_by_key(e.key);
  if (!direction) return;

  GAME.make_movement(direction);
}

function onStateChangeHandler() {
  const element = document.querySelector(".tiles");
  print(element, this.tiles);
}

function onLoseHandler() {
  document.removeEventListener("keydown", keydown_handler);
  show_message("you lose!");
}

function onWinHandler() {
  document.removeEventListener("keydown", keydown_handler);
  show_message("you win!");
}

function get_direction_by_key(key) {
  switch (key) {
    case "ArrowUp":
      return UP;
    case "ArrowRight":
      return RIGHT;
    case "ArrowDown":
      return DOWN;
    case "ArrowLeft":
      return LEFT;
    default:
      return;
  }
}

function print(element, tiles) {
  element.innerHTML = "";
  for (const tileValue of tiles) {
    const scale = tileValue === 0 ? 0 : Math.log2(tileValue);
    const sat = Math.min(scale * 16, 100);
    const light = Math.max(40, 100 - sat / 2);
    element.innerHTML += `<span class="tile" style="--sat: ${sat}; --light: ${light}">${tileValue === 0 ? "" : tileValue}</span>`;
  }
}

function show_message(message) {
  const messageElement = document.querySelector(".message");
  messageElement.innerHTML = message;
  messageElement.classList.remove("hidden");
}

main();
