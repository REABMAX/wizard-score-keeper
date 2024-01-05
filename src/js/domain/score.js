const SUCCESS_BASE_POINTS = 20
const SUCCESS_ADD_POINTS = 10
const FAILURE_POINTS = -10

export class Score {
    _player
    _score
    constructor(player, score) {
        this._player = player
        this._score = score
    }
    static fromTricksAndGuess(player, tricks, guess) {
        let score
        if (tricks === guess) {
            score = SUCCESS_BASE_POINTS + (tricks * SUCCESS_ADD_POINTS)
        } else {
            const difference = tricks > guess ? tricks - guess : guess - tricks
            score = difference * FAILURE_POINTS
        }
        return new Score(player, score)
    }
    get player() { return this._player }
    get score() { return this._score }
    add(otherScore) {
        return new Score(this._player, this._score + otherScore.score)
    }
}