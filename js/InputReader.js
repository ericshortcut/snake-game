/**
 * Processes the user input arrows (once it changes).
 *
 * @param \{ lastSelectedKey: <KEY> }   Where <KEY> can be ('UP_ARROW'|'DOWN_ARROW'|'LEFT_ARROW'|'RIGHT_ARROW' or null)
 * @listens onkeydown
 */
function getUserInput(user) {
    const input = {
        38: 'UP_ARROW',
        40: 'DOWN_ARROW',
        37: 'LEFT_ARROW',
        39: 'RIGHT_ARROW'
    };
    document.onkeydown = function (e) {
        e = e || window.event;
        let validInput = input[e.keyCode];
        if (validInput) {
            user.lastSelectedKey = validInput;
        }
    };
}