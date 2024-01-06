import {Round} from "./round.js";
import {GameFinished, GameStarted, PlayerRegistered, PlayerRemoved, RoundFinished} from "./events.js";

const CARDS_COUNT = 60

export const STATUS_GAME_PENDING = "GAME_PENDING"
export const STATUS_GAME_STARTED = "GAME_STARTED"
export const STATUS_GAME_FINISHED = "GAME_FINISHED"

export class Game {
    _status = STATUS_GAME_PENDING
    _id
    _rounds = []
    _players = new Set()
    _eventListeners = new Map()

    constructor(id) {
        this._id = id
        this.addEventListener(RoundFinished.NAME, this._onRoundFinished.bind(this))
    }

    registerPlayer(player) {
        if (this._status !== STATUS_GAME_PENDING) {
            throw Error("could not add player to running game")
        }

        if (this._maximumAmountOfPlayersWasReached()) {
            throw Error("maximum amount of players was reached")
        }

        if (this._players.has(player)) {
            throw Error("could not add player twice")
        }

        this._players.add(player)
        this._fireEvent(new PlayerRegistered([...this._players]))
    }

    removePlayer(player) {
        if (this._status !== STATUS_GAME_PENDING) {
            throw Error("could not remove player from running game")
        }

        if (!this._players.has(player)) {
            throw Error("could not remove non-existent player")
        }

        this._players.delete(player)
        this._fireEvent(new PlayerRemoved([...this._players]))
    }

    start() {
        if (!this._assertMinimumAmountOfPlayers()) {
            throw Error("could not start game since there are not enough players")
        }
        this._rounds.push(new Round(this._players))
        this._status = STATUS_GAME_STARTED
        this._fireEvent(new GameStarted(this._status, this._numberOfRounds(), this._players))
    }

    submitGuesses(guesses) {
        const round = this._currentRound()
        round.submitGuesses(guesses)
        round.releaseEvents().forEach(this._fireEvent.bind(this))
    }

    enterResults(results, wasBombCardPlayed) {
        try {
            const round = this._currentRound()
            round.enterResults(results, wasBombCardPlayed)
            round.releaseEvents().forEach(this._fireEvent.bind(this))
        } catch (e) {
            throw e
        }
    }

    addEventListener(event, listener) {
        if (!this._eventListeners.has(event)) {
            this._eventListeners.set(event, [])
        }

        this._eventListeners.get(event).push(listener)
    }

    _onRoundFinished() {
        if (this._haveAllRoundsBeenPlayed()) {
            this._status = STATUS_GAME_FINISHED
            this._fireEvent(new GameFinished(this._status))
        } else {
            const nextRound = this._currentRound().next()
            this._rounds.push(nextRound)
            nextRound.releaseEvents().forEach(this._fireEvent.bind(this))
        }
    }

    _fireEvent(event) {
        if (!this._eventListeners.has(event.constructor.NAME)) {
            console.debug("no listener was listening on event " + event.constructor.NAME)
            return
        }
        this._eventListeners.get(event.constructor.NAME).forEach((listener) => listener(event))
    }

    _assertMinimumAmountOfPlayers() {
        return this._players.size > 1
    }

    _maximumAmountOfPlayersWasReached() {
        return this._players.size >= 6
    }

    _haveAllRoundsBeenPlayed() {
        return this._rounds.length >= this._numberOfRounds()
    }

    _currentRound() {
        return this._rounds[this._rounds.length - 1]
    }

    _numberOfRounds() {
        return CARDS_COUNT / this._players.size
    }
}