import {LitElement, html, css} from 'lit';
import './components/navbar'
import './components/navmenu'
import './components/entities-list'
import {API} from './api'

class HomePage extends LitElement {
    apiClient;

    static properties = {
        globalSyles: {},
        path: {},
        data: {},
    };

    static styles = css`
        h3 {
            text-transform: capitalize;      
        }
    `;

    constructor() {
        super();
        const start = window.location.href.lastIndexOf('#') + 1;
        const path = window.location.href.substring(start);
        this.globalSyles =  document.styleSheets[0].href;
        this.path = path == '' ? 'home' : path;

        this.apiClient = new API()
    }

    render() {
        return html`
        <link rel="stylesheet" href="${this.globalSyles == undefined ? '' : this.globalSyles}">        
        <span @clicked=${this._routeHandler}>        
        <nav-menu>
            <nav-bar></nav-bar>            
        </nav-menu>
        </span>
        <main class="container">            
            ${this.path !== 'home' ? 
            html`<entities-list path=${this.path}></entities-list>`
            : 
            html`<h3>${this.path}</h3>`
            }
        </main>
        `;
    }

    fetchData(path) {
        this.listData = this.apiClient.fetchData(path)
    }

    _routeHandler(e) {        
        this.path = e.detail.pagePath;
        this.fetchData(this.path);
    }
}

customElements.define('home-page', HomePage);