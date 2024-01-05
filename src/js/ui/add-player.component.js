import {PlayerRegistered, PlayerRemoved} from "../domain/events.js"

const template = document.createElement("template")
template.innerHTML = `
<form class="register-player" action="">
    <input type="text" name="name" placeholder="Player name">
    <button type="submit">Add player</button>
</form>

<div class="error-container"></div>

<ul class="registered-players">
</ul>
`

const playerTemplate = document.createElement("template")
playerTemplate.innerHTML = `
    <li class="player">
        <form class="remove-player" action="">
            <button type="submit">X</button>     
        </form>
    </li>
`

export class AddPlayerComponent extends HTMLElement {
    _game
    _form
    _errorContainer
    _playerList

    constructor(game) {
        super()
        this._game = game
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true))
        this._form = this.querySelector(".register-player")
        this._playerList = this.querySelector(".registered-players")
        this._errorContainer = this.querySelector(".error-container")

        this._game.addEventListener(PlayerRegistered.NAME, (event) => {
            this._redrawPlayersList(event.players)
            this.querySelector("input").value = ""
        })

        this._game.addEventListener(PlayerRemoved.NAME, (event) => {
            this._redrawPlayersList(event.players)
        })

        this._form.addEventListener("submit", (event) => {
            event.preventDefault()
            this._hideError()
            const data = new FormData(this._form)
            this._registerPlayer(data)
        })
    }

    _registerPlayer(formData) {
        const playerName = formData.get("name")
        if (!playerName) {
            this._drawError("player name must not be empty")
            return
        }

        try {
            this._game.registerPlayer(playerName)
        } catch (e) {
            this._drawError(e)
        }
    }

    _removePlayer(playerName) {
        try {
            this._game.removePlayer(playerName)
        } catch (e) {
            this._drawError(e)
        }
    }

    _drawError(message) {
        this._errorContainer.replaceChildren(document.createTextNode(message))
        this._errorContainer.style.display = "block"
    }

    _hideError() {
        this._errorContainer.style.display = "none"
    }

    _redrawPlayersList(players) {
        const list = new DocumentFragment()
        players.map((player) => {
            const playerElement = playerTemplate.content.cloneNode(true)
            const li = playerElement.querySelector(".player")
            li.insertBefore(this.ownerDocument.createTextNode(player), li.firstChild)
            const form = playerElement.querySelector("form")
            form.addEventListener("submit", (event) => {
                event.preventDefault()
                this._removePlayer(player)
            })
            return playerElement
        }).forEach(element => list.appendChild(element))
        this._playerList.replaceChildren(list)
    }
}

customElements.define("add-player", AddPlayerComponent)