import {html, LitElement} from 'lit';

export class BaseComponent extends LitElement {    
    static properties = {
        globalSyles: {},
    };

    constructor() {
        super();
        const url = document.styleSheets[0].href
        this.globalSyles = html`<link rel="stylesheet" href="${url == undefined ? '' : url}">`;
    }
}