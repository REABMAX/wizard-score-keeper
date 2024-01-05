import {Score} from "./score.js";

describe("score", () => {
    it("calculates correct score from guess and tricks", () => {
        // given
        const player = "john"
        const textMatrix = [
            { guess: 1, tricks: 1, score: 30 },
            { guess: 0, tricks: 1, score: -10 },
            { guess: 1, tricks: 2, score: -10 },
            { guess: 2, tricks: 2, score: 40 },
            { guess: 2, tricks: 0, score: -20 },
        ]

        textMatrix.forEach(({guess, tricks, score}) => {
            // when
            const s = Score.fromTricksAndGuess(player, tricks, guess)
            // then
            expect(s.score).toEqual(score)
        })
    })

    it("adds scores correctly", () => {
        // given
        const player = "mary"
        const textMatrix = [
            { score1: 20, score2: -10, result: 10 },
            { score1: 30, score2: 20, result: 50 },
            { score1: 10, score2: -10, result: 0 },
            { score1: -10, score2: -20, result: -30 },
        ]

        textMatrix.forEach(({score1, score2, result}) => {
            // when
            const score = new Score(player, score1)
            const otherScore = new Score(player, score2)
            const resultScore = score.add(otherScore)
            // then
            expect(resultScore.score).toEqual(result)
        })
    })
})