const template = document.createElement("template")
template.innerHTML = `
    <section>
        <div class="error-container"></div>
        <form class="start-game-form" action="">
            <button type="submit">Start game</button>
        </form>
    </section>
`

export class StartGameComponent extends HTMLElement {
    _game
    _form
    _errorContainer

    constructor(game) {
        super()
        this._game = game
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true))
        this._form = this.querySelector(".start-game-form")
        this._errorContainer = this.querySelector(".error-container")

        this._form.addEventListener("submit", (event) => {
            event.preventDefault()
            this._hideError()
            try {
                this._game.start()
            } catch (e) {
                this._drawError(e)
            }
        })
    }

    _drawError(message) {
        this._errorContainer.replaceChildren(document.createTextNode(message))
        this._errorContainer.style.display = "block"
    }

    _hideError() {
        this._errorContainer.style.display = "none"
    }
}

customElements.define("start-game", StartGameComponent)