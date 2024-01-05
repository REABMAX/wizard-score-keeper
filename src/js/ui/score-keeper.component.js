import {Game} from "../domain/game.js";
import {AddPlayerComponent} from "./add-player.component.js";
import {StartGameComponent} from "./start-game.component.js";
import {ScoreBoardComponent} from "./score-board.component.js";
import {GameStarted} from "../domain/events.js";

class ScoreKeeperComponent extends HTMLElement {
    _game
    _playerArea
    _gameArea

    constructor() {
        super();
    }

    connectedCallback() {
        this._game = new Game("id")

        this._playerArea = this.getElementsByClassName("player-area")[0]
        if (!this._playerArea) {
            console.error("could not initialize Wizard Score Keeper: Could not find player area (.player-area)")
        }
        this._playerArea.replaceChildren(new AddPlayerComponent(this._game))

        this._gameArea = this.getElementsByClassName("game-area")[0]
        if (!this._playerArea) {
            console.error("could not initialize Wizard Score Keeper: Could not find game area (.game-area)")
        }
        this._gameArea.replaceChildren(new StartGameComponent(this._game))

        this._game.addEventListener(GameStarted.NAME, (event) => {
            this._playerArea.style.display = "none"
            this._gameArea.replaceChildren(new ScoreBoardComponent(this._game, event.numberOfRounds, event.players))
        })

        console.log("wizard score keeper initialized")
    }
}

customElements.define("wizard-score-keeper", ScoreKeeperComponent)