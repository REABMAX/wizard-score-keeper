import {STATUS_GAME_STARTED} from "./game.js";

export class GameStarted {
    _status
    _numberOfRounds
    _players
    constructor(status, numberOfRounds, players) {
        this._status = status
        this._numberOfRounds = numberOfRounds
        this._players = players
    }
    get numberOfRounds() { return this._numberOfRounds }
    get players() { return this._players }
    wasGameStarted() {
        return this._status === STATUS_GAME_STARTED
    }
    static NAME = "game-started"
}

export class GameFinished {
    _status
    constructor(status) {
        this._status = status
    }
    get status() { return this._status }
    static NAME = "game-finished"
}

export class PlayerRegistered {
    _players
    constructor(players) {
        this._players = players
    }
    get players() { return this._players }
    static NAME = "player-registered"
}

export class PlayerRemoved {
    _players
    constructor(players) {
        this._players = players
    }
    get players() { return this._players }
    static NAME = "player-removed"
}

export class GuessesSubmitted {
    _status
    _guesses
    _round
    constructor(status, guesses, round) {
        this._status = status
        this._guesses = guesses
        this._round = round
    }

    get status() { return this._status }
    get guesses() { return this._guesses }
    get round() { return this._round }
    static NAME = "guesses-submitted"
}

export class RoundStarted {
    _tricksTotal
    constructor(tricksTotal) {
        this._tricksTotal = tricksTotal
    }
    static NAME = "round-started"
}

export class RoundFinished {
    _status
    _scores
    _round
    constructor(status, scores, round) {
        this._status = status
        this._scores = scores
        this._round = round
    }

    get status() { return this._status }
    get scores() { return this._scores }
    get round() { return this._round }
    static NAME = "round-finished"
}