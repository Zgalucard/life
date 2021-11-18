// соседние, "дружественные" клетки
const FRIENDS_CELLS = [
    [-1, -1], [1, 1],
    [-1, 0], [0, -1],
    [-1, 1], [1, -1],
    [1, 0], [0, 1],
];
// конструктор для игры
function Life(canvas) {
    // размер клетки
    this.cellSize = 5;
    // длинна массива поля
    this.y = 100;
    // длинна вложенных массивов в поле
    this.x = 100;
    // канвас
    this.canvas = canvas;
    // контекст канваса
    this.ctx = canvas.getContext('2d');
    // состояние игры
    this.isPlay = false
    // поле
    this.area = Array(this.y).fill(false).map(() => Array(this.x).fill(false));

    // закрашиваем фигуру
    this.fillRect = function(x = 0, y = 0) {
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }

    // функция отрисовки
    this.draw = function() {
        // очищаем поле
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // закрашиваем нужные клетки
        this.area.forEach((line, y) => line.forEach((cell, x) => cell && this.fillRect(x, y)));
    }

    // проверяем жива ли клетка
    this.isAlive = function(pointX = 0, pointY = 0) {
        const count = FRIENDS_CELLS.reduce((sum, diff) => {
            const x = pointX - diff[0];
            const y = pointY - diff[1];

            return (x < 0 || x >= this.area[0].length || y < 0 || y >= this.area.length) ? sum : sum + this.area[y][x];
        }, 0);

        return this.area[pointY][pointX] ? (count === 2 || count === 3) : count === 3;
    }

    // заменяем массив поля, на новый массив
    this.areaChange = function(array = [[]]) {
        // заменяем значения поля на значения нового массива
        this.area.splice(0, array.length, ...array)
        // отрисовываем новое поле
        this.draw();
    }

    // запускаем игру
    this.start = function(tick = 100) {
        // если игра запущена, ничего не делаем
        if (this.game) return;

        // запускаем игру
        this.game = setInterval(() => {
            // изменяем поле
            this.area = this.area.map((row, y) => row.map((cell, x) => this.isAlive(x, y)));
            // отрисовывем поле
            this.draw();
        }, tick);
        // меняем состоянии запуска игры
        this.isPlay = true
    }

    // останавливаем игру
    this.stop = function() {
        // продолжаем если игра запущена
        if (this.game) {
            // очищаем интервал
            clearInterval(this.game);
            // обнуляем игру
            this.game = null;
            // меняем состояние игры
            this.isPlay = false
        }
    }
}

// получаем канвас
const canvas = document.querySelector('#game_canvas');

// создаём новый инстанс игры
const game = new Life(canvas);

// получаем ползунок для заполняемого контента
const rangeSlider = document.querySelector('#range');
// отображаемое значение ползунка
const rangeValueView = document.querySelector('#range_value');
// внутреннее значение ползунка
let rangeValue = rangeSlider.value / 10;
// отображаем значение по умолчанию
rangeValueView.innerHTML = rangeValue * 10;

// вешаем событие на изменение ползунка
rangeSlider.addEventListener('change', e => {
    // получаем значение
    rangeValue = e.target.value / 10;
    // отображаем значение
    rangeValueView.innerHTML = e.target.value
})

// кнопка старта игры
const startBtn = document.querySelector('#button_start');
// кнопка новой игры
const newGameBtn = document.querySelector('#button_new_game');

// вешаем на кнопку старта событие
startBtn.addEventListener('click', () => {
    // в зависимости от состояния игры, решаем, начинаем или останавливаем игру
    game.isPlay ? game.stop() : game.start();
});

// вешаем событие на кнопку новой игры
newGameBtn.addEventListener('click', () => {
    // останавливаем игру
    game.stop();
    // генерируем случайное поле
    game.areaChange(Array(game.y).fill(Array(game.x).fill(false)).map(line => line.map(() => Math.random() > rangeValue ? false : true))
    );
});
