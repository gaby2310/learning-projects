const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 4;
const cellsVertical = 3;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLenghtX = width / cellsHorizontal;
const unitLenghtY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, width / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, width / 2, 2, height, { isStatic: true }),
];
World.add(world, walls);

// Maze generation

const shuffle = (arr) => {
  let counter = arr.lenght;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
  // Verifica daca am vizitat casuta la [row, column], apoi return
  if (grid[row][column] === true) {
    return;
  }

  // Marcheaza casuta ca fiind vizitata
  grid[row][column] = true;

  // Fa o lista random a vecinilor
  const neighbors = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left'],
  ]);

  // For each neighbor....
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;

    // Verifica daca vecinul este in spatiul de lucru
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue;
    }

    // Daca a fost vizitat, continua cu urmatorul
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    // Sterge peretele in functie de directia aleasa
    if (direction === 'left') {
      verticals[row][column - 1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }
    stepThroughCell(nextRow, nextColumn);
  }
  // Viziteaza urmatoarea celula
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open === true) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLenghtX + unitLenghtX / 2,
      rowIndex * unitLenghtY + unitLenghtY,
      unitLenghtX,
      0.5,
      {
        isStatic: true,
        label: 'wall',
        render: {
          fillStyle: 'yellow',
        },
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open === true) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLenghtX + unitLenghtX,
      rowIndex * unitLenghtY + unitLenghtY / 2,
      0.5,
      unitLenghtY,
      {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: 'yellow',
        },
      }
    );
    World.add(world, wall);
  });
});

//Goal
const goal = Bodies.rectangle(
  width - unitLenghtX / 2,
  height - unitLenghtY / 2,
  unitLenghtX / 3,
  unitLenghtY / 3,
  {
    isStatic: true,
    label: 'goal',
    render: {
      fillStyle: 'green',
    },
  }
);
World.add(world, goal);

//Ball

const ballRadius = Math.min(unitLenghtX, unitLenghtY) / 4;
const ball = Bodies.circle(unitLenghtX / 2, unitLenghtY / 2, ballRadius, {
  label: 'ball',
  render: {
    fillStyle: 'purple',
  },
});
World.add(world, ball);

// Keyboard
document.addEventListener('keydown', (event) => {
  const { x, y } = ball.velocity;

  if (event.keyCode === 87) {
    Body.setVelocity(ball, { x: x, y: y - 5 });
  }

  if (event.keyCode === 83) {
    Body.setVelocity(ball, { x: x, y: y + 5 });
  }

  if (event.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y: y });
  }

  if (event.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y: y });
  }
});

// Collision

Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((collision) => {
    const labels = ['ball', 'goal'];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector('.winner').classList.remove('hidden');
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
