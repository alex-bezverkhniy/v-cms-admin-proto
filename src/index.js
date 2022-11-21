import {LitElement, html, css} from 'lit';
import './components/navbar'

class HomePage extends LitElement {
    static properties = {
        globalSyles: {}
    };



    constructor() {
        super();
        this.globalSyles =  document.styleSheets[0].href;
    }
    render(h) {
        return html`
        <link rel="stylesheet" href="${this.globalSyles}"> 
        <nav-bar></nav-bar>
        `;
    }
}

customElements.define('home-page', HomePage);