import {SubmitGuessesComponent} from "./submit-guesses.component.js";
import {EnterResultsComponent} from "./enter-results.component.js";
import {GameFinished, GuessesSubmitted, RoundFinished, RoundStarted} from "../domain/events.js";

const template = document.createElement("template")
template.innerHTML = `
    <section class="score-board">
        <table>
        <thead>
            <tr class="scoreboard-players">
                <th class="round-number">#</th>
            </tr>    
        </thead>
        <tbody>
            
        </tbody>
        </table>
    </section>
    
    <section class="actions"></section>
`

const playerTemplate = document.createElement("template")
playerTemplate.innerHTML = `
    <th class="player" colspan="2"></th>
`

const roundTemplate = document.createElement("template")
roundTemplate.innerHTML = `
    <tr>
        <th class="round-number"></th>
    </tr>
`

const scoreTemplate = document.createElement("template")
scoreTemplate.innerHTML = `
    <td class="score"></td>
    <td class="guess"></td>
`

export class ScoreBoardComponent extends HTMLElement {
    _game
    _players
    _numberOfRounds
    _head
    _body
    _actionsContainer
    _roundElements = []

    constructor(game, numberOfRounds, players) {
        super()
        this._game = game
        this._numberOfRounds = numberOfRounds
        this._players = players
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true))
        this._head = this.querySelector(".scoreboard-players")
        this._body = this.querySelector("tbody")
        this._actionsContainer = this.querySelector(".actions")

        this._drawHead()
        this._drawBody()

        this._actionsContainer.replaceChildren(new SubmitGuessesComponent(this._game, this._players))

        this._game.addEventListener(GuessesSubmitted.NAME, (event) => {
            this._actionsContainer.replaceChildren(new EnterResultsComponent(this._game, this._players))
            this._drawGuessesForRound(event.round, event.guesses)
        })

        this._game.addEventListener(RoundStarted.NAME, () => {
            this._actionsContainer.replaceChildren(new SubmitGuessesComponent(this._game, this._players))
        })

        this._game.addEventListener(RoundFinished.NAME, (event) => {
            this._drawScoresForRound(event.round, event.scores)
        })

        this._game.addEventListener(GameFinished.NAME, () => {
            this._actionsContainer.replaceChildren()
        })
    }

    _drawHead() {
        this._players.forEach(player => {
            const element = playerTemplate.content.cloneNode(true)
            element.querySelector("th").appendChild(document.createTextNode(player))
            this._head.appendChild(element)
        })
    }

    _drawBody() {
        for (let i = 0; i < this._numberOfRounds; i++) {
            const roundElement = roundTemplate.content.cloneNode(true)
            roundElement.querySelector("th").appendChild(document.createTextNode((i+1).toString()))
            this._players.forEach(player => {
                const scoreElement = scoreTemplate.content.cloneNode(true)
                scoreElement.querySelectorAll("td").forEach(el => el.dataset.player = player)
                roundElement.querySelector("tr").appendChild(scoreElement)
            })
            this._roundElements.push(roundElement.querySelector("tr"))
            this._body.appendChild(roundElement)
        }
    }

    _drawGuessesForRound(roundNumber, guesses) {
        const roundElement = this._roundElements[roundNumber - 1]
        this._players.forEach(player => {
            const playerElement = roundElement.querySelector(`td[data-player=${player}].guess`)
            const guess = guesses.has(player) ? guesses.get(player) : ""
            playerElement.replaceChildren(document.createTextNode(guess))
        })
    }

    _drawScoresForRound(roundNumber, scores) {
        const roundElement = this._roundElements[roundNumber - 1]
        this._players.forEach(player => {
            const playerElement = roundElement.querySelector(`td[data-player=${player}].score`)
            const score = scores.has(player) ? scores.get(player) : ""
            playerElement.replaceChildren(document.createTextNode(score))
        })
    }
}

customElements.define("score-board", ScoreBoardComponent)