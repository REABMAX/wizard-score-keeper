const template = document.createElement("template")
template.innerHTML = `
    <div class="error-container"></div>
    <form class="enter-results-form" action="">
        <button type="submit">Enter results</button>
    </form>
`

const playerTemplate = document.createElement("template")
playerTemplate.innerHTML = `
    <label>Player name</label>
    <input type="number" name="player" min="0" value="0">
`

export class EnterResultsComponent extends HTMLElement {
    _game
    _players
    _form
    _errorContainer

    constructor(game, players) {
        super()
        this._game = game
        this._players = players
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true))
        this._form = this.querySelector(".enter-results-form")
        this._errorContainer = this.querySelector(".error-container")
        this._drawForm()

        this._form.addEventListener("submit", (event) => {
            event.preventDefault()
            this._hideError()
            this._enterResults(new FormData(this._form))
        })
    }

    _drawForm() {
        const wrapper = document.createDocumentFragment()
        this._players.forEach(player => {
            const element = playerTemplate.content.cloneNode(true)
            element.querySelector("label").replaceChildren(document.createTextNode(player))
            element.querySelector("input").name = player
            wrapper.appendChild(element)
        })
        this._form.insertBefore(wrapper, this._form.firstChild)
    }

    _drawError(message) {
        this._errorContainer.replaceChildren(document.createTextNode(message))
        this._errorContainer.style.display = "block"
    }

    _hideError() {
        this._errorContainer.style.display = "none"
    }

    _enterResults(form) {
        try {
            const results = Array.from(this._players).map(player => ({
                player: player,
                tricks: form.get(player)
            }))
            this._game.enterResults(results)
        } catch (e) {
            this._drawError(e)
        }
    }
}

customElements.define("enter-results", EnterResultsComponent)