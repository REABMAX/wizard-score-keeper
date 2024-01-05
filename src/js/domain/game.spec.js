import {Game, STATUS_GAME_STARTED} from "./game.js";
import {GameStarted, PlayerRegistered, PlayerRemoved} from "./events.js";

describe("game", () => {
    describe("registering a player", () => {
        let game
        beforeEach(() => {
            game = new Game("id")
        })

        it("will produce a PlayerRegistered event containing all players on success", () => {
            // given
            const listener = jest.fn()
            game.addEventListener(PlayerRegistered.NAME, listener)
            const player1 = "john"
            const player2 = "mary"

            // when
            game.registerPlayer(player1)
            game.registerPlayer(player2)

            // then
            const expectedLastEvent = new PlayerRegistered(["john", "mary"])
            expect(listener).toHaveBeenCalledTimes(2)
            expect(listener).toHaveBeenLastCalledWith(expectedLastEvent)
        })

        it("will register player only once", () => {
            // given
            const listener = jest.fn()
            const player = "john"
            game.addEventListener(PlayerRegistered.NAME, listener)

            // when
            expect(() => {
                game.registerPlayer(player)
                game.registerPlayer(player)
            }).toThrowError()

            // then
            expect(listener).toHaveBeenCalledTimes(1)
        })

        it("will throw an error when Game has already been started", () => {
            // given
            game._status = STATUS_GAME_STARTED

            // when, then
            expect(() => {
                game.registerPlayer(player)
            }).toThrowError()
        })
    })

    describe("removing a player", () => {
        let game
        const player1 = "john"
        const player2 = "mary"

        beforeEach(() => {
            game = new Game("id")
            game.registerPlayer(player1)
            game.registerPlayer(player2)
        })

        it("will produce a PlayerRemoved event containing all players on success", () => {
            // given
            const listener = jest.fn()
            game.addEventListener(PlayerRemoved.NAME, listener)

            // when
            game.removePlayer(player1)

            // then
            const expectedEvent = new PlayerRemoved([player2])
            expect(listener).toHaveBeenCalledTimes(1)
            expect(listener).toHaveBeenCalledWith(expectedEvent)
        })

        it("will throw an error if the player to-be-remove does not exist", () => {
            // given
            const listener = jest.fn()
            game.addEventListener(PlayerRemoved.NAME, listener)

            // when, then
            expect(() => {
                game.removePlayer("does-not-exist")
            }).toThrowError()

            expect(listener).not.toHaveBeenCalled()
        })

        it("will throw an error if game has already been started", () => {
            // given
            const listener = jest.fn()
            game.addEventListener(PlayerRemoved.NAME, listener)
            game._status = STATUS_GAME_STARTED

            // when, then
            expect(() => {
                game.removePlayer("does-not-exist")
            }).toThrowError()

            expect(listener).not.toHaveBeenCalled()
        })
    })

    describe("starting the game", () => {
        it("will produce a GameStarted event with the correct amount of rounds", () => {
            const testMatrix = [
                {players: ["john", "max", "joana", "mary"], rounds: 15,},
                {players: ["john", "max", "joana",], rounds: 20,},
                {players: ["john", "max",], rounds: 30,},
            ]

            testMatrix.forEach(({players, rounds}) => {
                // given
                const game = new Game("id")
                const listener = jest.fn()
                game.addEventListener(GameStarted.NAME, listener)
                players.forEach((player) => game.registerPlayer(player))

                // when
                game.start()

                // then
                const expectedEvent = new GameStarted(STATUS_GAME_STARTED, rounds, new Set(players))
                expect(listener).toHaveBeenCalledTimes(1)
                expect(listener).toHaveBeenCalledWith(expectedEvent)
            })
        })
    })
})