/**
 * Template function to create Reactangle.
 * @param canvasId Canvas' name where rectangle needs to render
 * @param x X coordinate.
 * @param y Y coordinate.
 * @param width rectangle's width.
 * @param height rectangle's height.
 * @param backgroundColor  Hexadecimal color.
 * @param lineWidth rectangle's border width.
 * @param strokeColor rectangle's border color.
 */
function createRectangle(canvasId, x, y, width, height, backgroundColor, lineWidth, strokeColor){
    const canvas = document.querySelector(canvasId);
    const context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle = backgroundColor;
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor || backgroundColor;
    context.fillRect(x, y, width, height);
    context.rect(x, y, width, height);
    context.stroke();
}

/**
 * Create a Block with given X and Y coordinates with a color (hex) according set to a dimension (scale)
 * @param indexX X coordinate.
 * @param indexY Y coordinate.
 * @param color Hexadecimal color.
 * @param scale Scale which block needs to be rendered. Default '16'.
 */
function createBlock(indexX, indexY, color, scale = 16){
    createRectangle("#game", indexX * scale, indexY * scale, scale, scale, color, 2, '#fff');
}

/**
 * Create a Diamond with given X and Y coordinates with a color (hex) according set to a dimension (scale).
 * @param indexX X coordinate.
 * @param indexY Y coordinate.
 * @param color Hexadecimal color.
 * @param scale Scale which block needs to be rendered. Default '16'.
 */
function createDiamond(indexX, indexY, color, scale = 16){
    const canvas = document.querySelector("#game");
    const context = canvas.getContext("2d");
    context.fillStyle = color;
    context.beginPath();
    context.moveTo((indexX * scale) + scale / 2, (indexY * scale));
    context.lineTo((indexX * scale), (indexY * scale) + scale / 2);
    context.lineTo((indexX * scale) + scale, (indexY * scale) + scale / 2); 
    context.closePath();
    context.moveTo((indexX * scale) + scale, (indexY * scale) + scale / 2); 
    context.lineTo((indexX * scale), (indexY * scale) + scale / 2); 
    context.lineTo((indexX * scale) + scale / 2, (indexY * scale) + scale); 
    context.fill();
}

/**
 * Create a Diamond with given X and Y coordinates with a color (hex) according set to a dimension (scale).
 * @param indexX X coordinate.
 * @param indexY Y coordinate.
 * @param color Hexadecimal color.
 * @param scale Scale which block needs to be rendered. Default '16'.
 */
function createText(x, y, text, color = "#000", font = "18px Arial"){
    const canvas = document.querySelector("#game");
    const context = canvas.getContext("2d");
    context.font = font;
    context.fillStyle = color;
    context.fillText(text, x, y);
}