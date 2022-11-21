import {LitElement, html, css} from 'lit';
import './components/navbar'
import './components/navmenu'

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
        <nav-menu>
            <nav-bar></nav-bar>
        </nav-menu>
        `;
    }
}

customElements.define('home-page', HomePage);