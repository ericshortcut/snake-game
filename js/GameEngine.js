/**
 * Show main menu (NEW GAME)
 */
function showMainMenu(){
    const buttonConfig = {
        textConfig: {
            text: "< NEW GAME >", x: 250, y: 420
        },
        x: 225,
        y: 300,
        width: 350,
        height: 200,
        visible: true
    };
    createCanvasButtonClickable(buttonConfig, () => {
        startGame();
    });
}
/**
 * Starts a new Game
 */
function startGame() {
    let tick = 100;
    let lastSelectedKey = { lastSelectedKey: 'UP_ARROW' };
    let snake = [{ x: generateRandom(10,40), y: generateRandom(10,40), visible: true }];
    let wall = { left: 0, right: 800, top: 0, bottom: 800 };
    let food = [];
    let score = { points: 0 };
    checkIfCurrentScoreIsGreaterThanPrevious(score);
    getUserInput(lastSelectedKey);
    gameLoop(snake, lastSelectedKey, tick, wall, food, score);
}

/**
 * Apply function according to the selected key.
 * @param \{ lastSelectedKey: <KEY> }   Where <KEY> can be ('UP_ARROW'|'DOWN_ARROW'|'LEFT_ARROW'|'RIGHT_ARROW' or null)
 * @param snakeCurrentPosition Array with snake blocks and current positions.
 * @returns new Snake with positions updated.
 */
function moveSnake({ lastSelectedKey }, snakeCurrentPosition) {
    /**
     * Move snake tail (body) to a new position.
     * @param snake Array with snake blocks and current positions.
     * @private
     * @returns new Snake without head and with positions updated.
     */
    let moveTailNewPosition = (snake) => {
        snake = clone(snake);
        snake.pop();
        return snake;
    }
    /**
     * Boilerplate function to move body and head according to Key pressed.
     * @param snake Array with snake blocks and current positions.
     * @param moveHead Snake's head with position updated.
     * @private
     * @returns new Snake with positions updated.
     */
    let genericMove = (snake, moveHead) => {
        let snakeHead = head(snake);
        let snakeTail = moveTailNewPosition(snake);
        let newSnakeHead = moveHead(snakeHead);
        snake = [newSnakeHead, ...snakeTail];
        return snake;
    }

    /**
     * Inplementation of boilerplate function according to selected action
     */
    const movements = {
        'UP_ARROW': (snake) => {
            return genericMove(snake, (snakeHead) => {
                snakeHead.y--;
                return snakeHead;
            });
        },
        'DOWN_ARROW': (snake) => {
            return genericMove(snake, (snakeHead) => {
                snakeHead.y++;
                return snakeHead;
            });
        },
        'LEFT_ARROW': (snake) => {
            return genericMove(snake, (snakeHead) => {
                snakeHead.x--;
                return snakeHead;
            });
        },
        'RIGHT_ARROW': (snake) => {
            return genericMove(snake, (snakeHead) => {
                snakeHead.x++;
                return snakeHead;
            });
        }
    };

    // Identity is a fallback just in case action is null
    return movements[lastSelectedKey](snakeCurrentPosition) || identity(snakeCurrentPosition);

}

/**
 * Render blocks of visible diamonds.
 * @param blocks Array representing a block.
 */
function render(blocks) {
    blocks.forEach(block => {
        if (block.visible) {
            if (block.points) {
                createDiamond(block.x, block.y, block.color);
            } else {
                createBlock(block.x, block.y, '#00f');
            }

        }
    });
}
/**
 * Render walls to allow player move within red block.
 * @param wall coordinates (left, top, right. and bottom) to make a square representation of a wall.
 */
function renderWall(wall) {
    createRectangle("#game", wall.left, wall.top, wall.right - wall.left, wall.bottom - wall.top, "#fff", 3, "#f00");
}
/**
 * Clears the canvas for a new drawing (game loop).
 */
function clearScreen() {
    createBlock(0, 0, "#fff", 800);
}

/**
 * Updates the score board outside canvas.
 * @param \{points} game current points
 */
function renderScore(score) {
    checkIfCurrentScoreIsGreaterThanPrevious(score);
    const scoreBoard = document.querySelector("#score-board");
    scoreBoard.innerText = `Score: ${score.points}`;
}

/**
 * Execute the function to start and end a new game
 * @param snakeNewPosition Snake Start Position 
 * @param lastSelectedKey First key pressed. Default is { lastSelectedKey: 'UP_ARROW' }
 * @param tick Seconds to redraw screen.
 * @param wall boundry where snake shall not pass. Default is canvas size (800x800)px
 * @param food variable reference to food to be captured by the snake. Default is "[]" empty
 * @param score  game current points. Default is "0" zero
 */
function gameLoop(snakeNewPosition, lastSelectedKey, tick, wall, food, score) {

    let loop = setInterval(() => {
        clearScreen();
        checkFoodCollision(snakeNewPosition, food, wall, score);
        checkSnakeAndWallCollision(snakeNewPosition, wall, lastSelectedKey);
        checkGameOver(snakeNewPosition, wall, lastSelectedKey, loop)
        snakeNewPosition = moveSnake(lastSelectedKey, snakeNewPosition);
        generateFood(food, wall, snakeNewPosition);
        renderWall(wall);
        render(snakeNewPosition);
        render(food);
        renderScore(score);
    }, tick);

}

/**
 * Check if the snake eat the food
 * @param snakeNewPosition Snake Position
 * @param lastSelectedKey First key pressed. Default is { lastSelectedKey: 'UP_ARROW' }
 * @param wall boundry where snake shall not pass. Default is canvas size (800x800)px
 * @param foodList variable reference to food to be captured by the snake. Default is "[]" empty
 * @param score  game current points. Default is "0" zero
 */
function checkFoodCollision(snakeNewPosition, foodList, wall, score) {
    if (foodList.length == 1) {
        let food = foodList[0];
        if (food.visible) {
            let snakeHead = head(clone(snakeNewPosition));
            // check if snake eate the food
            if (snakeHead.x == food.x && snakeHead.y == food.y) {
                score.points += foodList[0].points;
                if (score.points > 1) {
                    foodList.pop();
                    snakeNewPosition.push(snakeHead);
                    snakeNewPosition.push(snakeHead);
                } else {
                    foodList.pop();
                    snakeNewPosition.push(snakeHead);
                }
            }
            //check if food is outside of walls.
            if (checkCollisionFoodWall(food, wall)) {
                foodList.pop();
            }
        }
    }
}

/**
 * Check if food is outside the boundary (walls) to see if it needs to cancel the current and make a new one.
 * @param wall boundry where snake shall not pass. Default is canvas size (800x800)px
 * @param food variable reference to food to be captured by the snake. Default is "[]" empty
 */
function checkCollisionFoodWall(food, wall) {
    return (food.y * 16) < wall.top
        || (food.y * 16) > wall.bottom
        || (food.x * 16) < wall.left
        || (food.x * 16) > wall.right;
}

/**
 * Given two numbers it generates a random within range.
 * @param min Minimum number.
 * @param max Maximum number.
 * @returns number with a random value between min and max
 */
function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Generates random Hex color
 * @returns rambom Hex color
 */
function generateRandomColor() {
    const red = generateRandom(0,256);
    const green = generateRandom(0,256);
    const blue = generateRandom(0,256);
    const processColors = color => color.toString(16).padStart(2, 0).toUpperCase();
    return "#" + [red, green, blue].map(processColors).join("");
}

/**
 * Generate a new food in a random location with random timeout.
 * It can generate two kinds of food "A" and B. "A" has 1 point and "B" has 9 points.
 * If snake length plus one is pair and the random number is zero we generate a food with 9 points.
 * Otherwise it has 1 point only.
 * @param wall boundry where snake shall not pass. Default is canvas size (800x800)px
 * @param food variable reference to food to be captured by the snake. Default is "[]" empty
 * @param snake Snake Position
 * @returns number with a random value between min and max
 */
function generateFood(food, wall, snake) {
    if (food.length == 0) {
        let visible = false;
        let points = snake.length + 1 % 2 === 0 && generateRandom(0, 2) == 0 ? 9 : 1;
        let x = Math.floor(generateRandom(wall.top, wall.bottom) / 16 + wall.top / 16);
        let y = Math.floor(generateRandom(wall.left, wall.right) / 16 + wall.left / 16);
        let time = generateRandom(4,10);
        let snakeHead = head(snake);
        let color = '#00f';
        food.push({ x, y, visible, points, color });
        
        setTimeout(() => {
            // Special food needs to be within 28px distance
            if (points > 1) {
                const distance = Math.floor(28 / 16);
                food[0].x = generateRandom(snakeHead.x - distance, snakeHead.x + distance );
                food[0].y = generateRandom(snakeHead.y - distance, snakeHead.y + distance);
                // Special food has random color
                food[0].color = generateRandomColor();
            // special food disappears after (1-5) seconds
                setTimeout(() => {
                    food.pop();
                 }, generateRandom(1,6) * 1000);
            }
            food.map(f => f.visible = true);
        }, time * 1000);
    }
}

/**
 * It reverts the current action to allow player's snake to recovery from wall collision.
 * @param key current key direction
 * @returns "UP_ARROW" returns "DOWN_ARROW".
 * @returns "LEFT_ARROW" returns "RIGHT_ARROW".
 * @returns "DOWN_ARROW" returns "UP_ARROW".
 * @returns "RIGHT_ARROW" returns "LEFT_ARROW".
 */
function makeTheRevertAction(key) {
    const opositeOf = {
        "UP_ARROW": "DOWN_ARROW",
        "LEFT_ARROW": "RIGHT_ARROW",
        "DOWN_ARROW": "UP_ARROW",
        "RIGHT_ARROW": "LEFT_ARROW"
    };
    key.lastSelectedKey = opositeOf[key.lastSelectedKey];
}

/**
 * Checks wheather the wall has invalid values (top is smaller than bottom or right is less than left)
 * @returns Boolean
 */
function checkWallIsSmall(wall) {
    return wall.left > wall.right - wall.left || wall.top > wall.bottom - wall.top;
}

/**
 * Checks wheather the game as ended and shows "Game Over" function
 * @returns Boolean
 */
function checkGameOver(snakeNewPosition, wall, lastSelectedKey, gameLoop) {

    if ( checkSnakeHeadTailCollision(snakeNewPosition, lastSelectedKey) || checkWallIsSmall(wall)) {
        clearInterval(gameLoop);
        const buttonConfig = {
            textConfig: {
                text: "Play again!", x: 310, y: 420
            },
            x: 250,
            y: 300,
            width: 300,
            height: 200,
            visible: true
        };
        createCanvasButtonClickable(buttonConfig, () => {
            startGame();
        });
    }

}

/**
 * Renders a text Message
 */
function renderMessage(text) {
    console.log(`RENDER: ${text}`)
}

/**
 * Checks if snake collided with itself
 * @returns Boolean
 */
function checkSnakeHeadTailCollision(snake, lastSelectedKey) {
    let snakeCloned = clone(snake);
    let snakeTail = tail(snake);
    let snakeHead = head(moveSnake(lastSelectedKey, snakeCloned));
    return (snakeTail.filter(t => t.x == snakeHead.x && t.y == snakeHead.y).length === 1);
}


/**
 * Checks if snake has collided with wall. If so, it reverses the snake direction.
 */
function checkSnakeAndWallCollision(snake, wall, lastSelectedKey) {

    let snakeHead = head(moveSnake(lastSelectedKey, clone(snake)));
    let collisionDetected = false;
    if (snakeHead.y < wall.top / 16) {
        wall.bottom -= 113;
        collisionDetected = true;
    }
    if (snakeHead.y > wall.bottom / 16) {
        wall.top += 113;
        collisionDetected = true;
    }
    if (snakeHead.x < wall.left / 16) {
        wall.right -= 113;
        collisionDetected = true;
    }
    if (snakeHead.x > wall.right / 16) {
        wall.left += 113;
        collisionDetected = true;
    }

    if (collisionDetected) {
        makeTheRevertAction(lastSelectedKey);
        snake = snake.reverse();
    }
}

/**
 * Updates the score board's color.
 * @param \{points} game current points
 */
function checkIfCurrentScoreIsGreaterThanPrevious({points}){
    const db = database("snake-game");
    const previousScore = parseInt(db.get("previous-score")) || 0;
    if (previousScore < points) {
        db.store("previous-score", points);
        const scoreBoard = document.querySelector("#score-board")
        scoreBoard.style.color = "#00f";
    }
}

/**
 * Create a clickable canvas button
 * @param
 */
function createCanvasButtonClickable({textConfig,x,y,width,height,visible}, callback){
    setTimeout(() => {
        const canvas = document.querySelector("#game");
        const canvasBoundary = canvas.getBoundingClientRect();
        const clickEventListener = (event) =>{
            const _x = event.x - canvasBoundary.left; 
            const _y = event.y - canvasBoundary.top; 
            if (_x >= x && _x <= x + width && _y >= x && _y <= y + height && visible){
                callback({_x,_y});
            }
        };
        clearScreen();
        createRectangle("#game", x, y, width, height, "#fff", 10, "#000");
        createText(textConfig.x,textConfig.y, textConfig.text, '#000', "40px Georgia");
        canvas.removeEventListener('click', clickEventListener );
        canvas.addEventListener('click', clickEventListener );
    }, 0);
}