import { html, LitElement } from "lit";

class ThemeSwitcher extends LitElement {

  static properties = {
    globalSyles: {},
    _scheme: "auto",
    change: {
      light: "<i>Turn on dark mode</i>",
      dark: "<i>Turn off dark mode</i>"
    },
    buttonsTarget: ".theme-switcher",
    localStorageKey: "picoPreferedColorScheme",
  }

  constructor() {
    super();
    this.globalSyles =  document.styleSheets[0].href;
    this.scheme = this.schemeFromLocalStorage;
    this.schemeToLocalStorage();
  }

  get schemeFromLocalStorage() {
    return void 0 !== window.localStorage &&
      null !== window.localStorage.getItem(this.localStorageKey)
      ? window.localStorage.getItem(this.localStorageKey)
      : this._scheme;
  }

  get preferedColorScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  set scheme(e) {
    "auto" == e
      ? "dark" == this.preferedColorScheme
        ? (this._scheme = "dark")
        : (this._scheme = "light")
      : ("dark" != e && "light" != e) || (this._scheme = e),
      this.applyScheme(),
      this.schemeToLocalStorage();
  }

  get scheme() {
    return this._scheme;
  }

  schemeToLocalStorage() {
    void 0 !== window.localStorage &&
      window.localStorage.setItem(this.localStorageKey, this.scheme);
  }
  
  applyScheme() {
    document.querySelector("html").setAttribute("data-theme", this.scheme),
      document.querySelectorAll(this.buttonsTarget).forEach((e) => {
        var t =
          "dark" == this.scheme ? this.change.dark : this.change.light;
        (e.innerHTML = t),
          e.setAttribute("aria-label", t.replace(/<[^>]*>?/gm, ""));
      });
  }

  render() {
    return html`
    <link rel="stylesheet" href="${this.globalSyles == undefined ? '' : this.globalSyles}">
    <button @click=${this._toggleSchema} class="contrast switcher theme-switcher" aria-label="Turn off dark mode"><i>Turn off dark mode</i></button>
    `;
  }

  _toggleSchema(e) {    
      "dark" == this.scheme
        ? (this.scheme = "light")
        : (this.scheme = "dark");    
  }
}

customElements.define('theme-switcher', ThemeSwitcher);