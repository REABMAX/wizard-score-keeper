export class Guess {
    _player
    _guess
    constructor(player, guess) {
        this._player = player
        this._guess = guess
    }
    get player() { return this._player }
    get guess() { return this._guess }
}