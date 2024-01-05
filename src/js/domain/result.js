import {Score} from "./score.js";

export class PlayerResult {
    _player
    _tricks
    constructor(player, tricks) {
        this._player = player
        this._tricks = tricks
    }
    get player() { return this._player }
    get tricks() { return this._tricks }
    calculateScore(guess) {
        return Score.fromTricksAndGuess(this._player, this._tricks, guess.guess)
    }
}