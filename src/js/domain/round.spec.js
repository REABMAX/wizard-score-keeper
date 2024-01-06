import {Round, STATUS_FINISHED, STATUS_GUESSED} from "./round.js";
import {GuessesSubmitted, RoundFinished} from "./events.js";

describe("round", () => {
    const players = ["john", "mary", "joana"]

    describe("next round", () => {
        it("total tricks of a new round always do match the round number", () => {
            // given
            const round = new Round(players)
            round._tricksTotal--

            // when
            const nextRound = round.next()

            // then
            expect(nextRound._tricksTotal).toEqual(nextRound._roundNumber)
        })

        it("initializes new round with last round's score", () => {
            // given
            const round = new Round(players)

            // when
            const nextRound = round.next()

            // then
            expect(nextRound._scores).toStrictEqual(round._scores)
        })
    })

    describe("guessing", () => {
        it("throws error when status is not GUESSING", () => {
            // given
            const round = new Round(players)
            round._status = STATUS_GUESSED
            const guesses = [{
                player: players[0],
                guess: 1,
            }, {
                player: players[1],
                guess: 0,
            }, {
                player: players[2],
                guess: 1,
            }]

            // when, then
            expect(() => {
                round.submitGuesses(guesses)
            }).toThrowError()
        })

        it("throws error when not all needed guesses have been set", () => {
            // given
            const round = new Round(players)
            const guesses = [{
                player: players[0],
                guess: 0,
            }]

            // when, then
            expect(() => {
                round.submitGuesses(guesses)
            }).toThrowError()
        })

        it("throws error when guesses do match total tricks exactly", () => {
            // given
            const round = new Round(players)
            const guesses = [{
                player: players[0],
                guess: 1,
            }, {
                player: players[1],
                guess: 0,
            }, {
                player: players[2],
                guess: 0,
            }]

            // when, then
            expect(() => {
                round.submitGuesses(guesses)
            }).toThrowError()
        })

        it("throws error when guesses contain negative guess", () => {
            // given
            const round = new Round(players)
            const guesses = [{
                player: players[0],
                guess: 1,
            }, {
                player: players[1],
                guess: -2,
            }, {
                player: players[2],
                guess: 0,
            }]

            // when, then
            expect(() => {
                round.submitGuesses(guesses)
            }).toThrowError()
        })

        it("produces GuessesSubmitted event on success", () => {
            // given
            const round = new Round(players)
            const guesses = [{
                player: players[0],
                guess: 1,
            }, {
                player: players[1],
                guess: 0,
            }, {
                player: players[2],
                guess: 1,
            }]

            // when
            round.submitGuesses(guesses)

            // then
            const event = round.releaseEvents().find(event => event instanceof GuessesSubmitted)
            const expectedGuesses = new Map([
                [guesses[0].player, guesses[0].guess],
                [guesses[1].player, guesses[1].guess],
                [guesses[2].player, guesses[2].guess],
            ])
            expect(event).not.toBeUndefined()
            expect(event.status).toBe(STATUS_GUESSED)
            expect(event.guesses).toStrictEqual(expectedGuesses)
        })
    })

    describe("entering results", () => {
        it("throws error when status is not GUESSED", () => {
            // given
            const round = new Round(players)
            const results = [{
                player: players[0],
                tricks: 1,
            }, {
                player: players[1],
                tricks: 0,
            }, {
                player: players[2],
                tricks: 0,
            }]

            // when, then
            expect(() => {
                round.enterResults(results, false)
            }).toThrowError()
        })

        it("throws error when not all results have been entered", () => {
            // given
            const round = new Round(players)
            round._status = STATUS_GUESSED
            const results = [{
                player: players[0],
                tricks: 1
            }]

            // when, then
            expect(() => {
                round.enterResults(results, false)
            }).toThrowError()
        })

        it("throws error when results do not match total tricks", () => {
            // given
            const round = new Round(players)
            round._status = STATUS_GUESSED
            const results = [{
                player: players[0],
                tricks: 1,
            }, {
                player: players[1],
                tricks: 0,
            }, {
                player: players[2],
                tricks: 1,
            }]

            // when, then
            expect(() => {
                round.enterResults(results, false)
            }).toThrowError()
        })

        it("throws error when results contain negative tricks", () => {
            // given
            const round = new Round(players)
            round._status = STATUS_GUESSED
            const results = [{
                player: players[0],
                tricks: 1,
            }, {
                player: players[1],
                tricks: -2,
            }, {
                player: players[2],
                tricks: 1,
            }]

            // when, then
            expect(() => {
                round.enterResults(results, false)
            }).toThrowError()
        })

        it("takes into account if bomb card was played which means the amount of total tricks is one less", () => {
            // given
            const round = new Round(players)
            const setting = [{
                player: players[0],
                guess: 1,
                tricks: 0,
                score: 30,
            }, {
                player: players[1],
                guess: 1,
                tricks: 0,
                score: -10,
            }, {
                player: players[2],
                guess: 0,
                tricks: 0,
                score: 20,
            }]
            round.submitGuesses(setting.map(({player, guess}) => ({player: player, guess: guess})))

            // when
            round.enterResults(setting.map(({player, tricks}) => ({player: player, tricks: tricks})), true)

            // then
            const event = round.releaseEvents().find(event => event instanceof RoundFinished)
            expect(event).not.toBeUndefined()
            expect(event.status).toBe(STATUS_FINISHED)
        })

        it("produces RoundFinished event on success", () => {
            // given
            const round = new Round(players)
            const setting = [{
                player: players[0],
                guess: 1,
                tricks: 1,
                score: 30,
            }, {
                player: players[1],
                guess: 1,
                tricks: 0,
                score: -10,
            }, {
                player: players[2],
                guess: 0,
                tricks: 0,
                score: 20,
            }]
            round.submitGuesses(setting.map(({player, guess}) => ({player: player, guess: guess})))

            // when
            round.enterResults(setting.map(({player, tricks}) => ({player: player, tricks: tricks})), false)

            // then
            const event = round.releaseEvents().find(event => event instanceof RoundFinished)
            const expectedScores = new Map([
                [setting[0].player, setting[0].score],
                [setting[1].player, setting[1].score],
                [setting[2].player, setting[2].score],
            ])
            expect(event).not.toBeUndefined()
            expect(event.status).toBe(STATUS_FINISHED)
            expect(event.scores).toStrictEqual(expectedScores)
        })
    })
})