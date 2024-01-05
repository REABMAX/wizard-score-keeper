import {transformMap} from "../lib/map.js";
import {GuessesSubmitted, RoundFinished, RoundStarted} from "./events.js";
import {Guess} from "./guess.js";
import {PlayerResult} from "./result.js";

export const STATUS_GUESSING = "GUESSING"
export const STATUS_GUESSED = "GUESSED"
export const STATUS_FINISHED = "FINISHED"

export class Round {
    _status = STATUS_GUESSING
    _roundNumber = 1
    _tricksTotal = 1
    _players = new Set()
    _guesses = new Map()
    _results = new Map()
    _events = []
    _scores = new Map()

    constructor(players) {
        this._players = new Set(players)
    }

    next() {
        const round = new Round(this._players)
        round._tricksTotal = this._tricksTotal + 1
        round._roundNumber = this._roundNumber + 1
        round._scores = this._scores
        round._addEvent(new RoundStarted(round._tricksTotal))
        return round
    }

    releaseEvents() {
        const events = this._events
        this._events = []
        return events
    }

    submitGuesses(guesses) {
        if (this._status !== STATUS_GUESSING) {
            throw Error("cannot guess round in status " + this._status)
        }

        guesses.forEach(guess => {
            this._guesses.set(guess.player, new Guess(guess.player, Number(guess.guess)))
        })

        if (!this._assertAllGuessesHaveBeenSet()) {
            throw Error("not all guesses have been set")
        }

        if (!this._assertGuessesDontMatchTotalTricks()) {
            throw Error("guesses must not match total tricks")
        }

        this._status = STATUS_GUESSED

        this._addEvent(new GuessesSubmitted(this._status, transformMap(this._guesses, guess => guess.guess), this._roundNumber))
    }

    enterResults(results) {
        if (this._status !== STATUS_GUESSED) {
            throw Error("cannot add player result when status is " + this._status)
        }

        results.forEach(result => {
            this._results.set(result.player, new PlayerResult(result.player, Number(result.tricks)))
        })

        if (!this._assertAllResultsHaveBeenSet()) {
            throw Error("not all player results have been entered")
        }

        if (!this._assertResultsMatchTotalTricks()) {
            throw Error("results must match total tricks")
        }

        this._calculateScores()

        this._status = STATUS_FINISHED

        this._addEvent(new RoundFinished(this._status, transformMap(this._scores, score => score.score), this._roundNumber))
    }

    _calculateScores() {
        const scores = new Map()
        this._results.forEach(result => {
            const playersGuess = this._guesses.get(result.player)
            const playersScore = result.calculateScore(playersGuess)
            scores.set(result.player, playersScore)
        })
        this._scores = [Array.from(this._scores.values()), Array.from(scores.values())]
            .flatMap(scores => scores)
            .reduce((playerScores, score) => {
                if (playerScores.has(score.player)) {
                    score = playerScores.get(score.player).add(score)
                }
                playerScores.set(score.player, score)
                return playerScores
            }, new Map())
    }

    _assertAllGuessesHaveBeenSet() {
        return this._players.size === this._guesses.size
    }

    _assertGuessesDontMatchTotalTricks() {
        return this._tricksTotal !== Array.from(this._guesses.values()).reduce((previousValue, currentValue) => previousValue + currentValue.guess, 0)
    }

    _assertAllResultsHaveBeenSet() {
        return this._players.size === this._results.size
    }

    _assertResultsMatchTotalTricks() {
        return this._tricksTotal === Array.from(this._results.values()).reduce((previousValue, currentValue) => previousValue + currentValue.tricks, 0)
    }

    _addEvent(event) {
        this._events.push(event)
    }
}