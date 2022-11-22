import {LitElement, html, css} from 'lit';
import './components/navbar'
import './components/navmenu'

class HomePage extends LitElement {
    static properties = {
        globalSyles: {},
        path: {}
    };

    static styles = css`
        h3 {
            text-transform: capitalize;      
        }
    `;

    constructor() {
        super();
        const start = window.location.href.lastIndexOf('#') + 1
        const end = window.location.href.length
        this.globalSyles =  document.styleSheets[0].href;
        this.path = start == 0 ? 'Home' : window.location.href.substring(start);

    }

    render() {
        return html`
        <link rel="stylesheet" href="${this.globalSyles}">
        <span @clicked=${this._routeHandler}>        
        <nav-menu>
            <nav-bar></nav-bar>            
        </nav-menu>
        </span>
        <article>
        <h3>${this.path}</h3>
        </article>
        `;
    }

    _routeHandler(e) {        
        this.path = e.detail.pagePath;
    }
}

customElements.define('home-page', HomePage);