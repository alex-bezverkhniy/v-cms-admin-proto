import { LitElement, css, html } from "lit";
import { until } from 'lit/directives/until.js';

import {API} from '../api'

class EntitiesList extends LitElement {    
    static properties = {
        globalSyles: {},
        path: {},
        data: {},
        ordersConf: {}
    };

    static styles = css`
        h3 {
            text-transform: capitalize;      
        } 
    `;

    constructor() {
        super();
        this.apiClient = new API();
        this.ordersConf = {
            orderBy: 'id',
            orderType: 'asc'
        }

        
    }
    
    refreshTable() {
        this.data = this.apiClient.fetchData(this.path, this.ordersConf.orderBy, this.ordersConf.orderType);
    }

    connectedCallback() {
        super.connectedCallback()
        this.globalSyles =  document.styleSheets[0].href;
        this.refreshTable();        
    }

    tableColsHeaders(columns) {
        return html`
        <tr>
            <th scope="col">#</th>                
            ${columns.map((k) => html `
            <th scope="col">
                <a href="#" @click=${this.toggleOrderConf} orderBy=${k}>
                    ${k.replace("_", " ")}
                    ${(this.ordersConf.orderBy == k && this.ordersConf.orderType == 'asc') ?
                    html`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>`                    
                    : html`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                    </svg>`
                    }
                </a>
            </th>
            `)} 
        </tr>
        `
    }

    colValue(val) {
        if (typeof val == "boolean") {
            if (val) {
                return html`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>`;
            } else {
                return html`
                    <svg  width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                        <circle cy="8" cx="8" r="6.25"/>
                        <line x1="4.25" x2="12.25" y1="11.75" y2="3.75"/>
                    </svg>`;
            }
        }
        
        return val;
    }

    render() {
        return html`
        <link rel="stylesheet" href="${this.globalSyles == undefined ? '' : this.globalSyles}">
        <article>
        <h3>${this.path} list</h3>
        ${until(this.data.then((d) => html`
        <!-- <pre>${JSON.stringify(d.schema, null, "\t")}</pre> -->
        <figure>
            <table >
            <thead>
                ${this.tableColsHeaders(d.schema.columns)}
            </thead>
            <tbody>
            ${d.list.map((item, i) => html`
            <tr>
                <th scope="row">${i+1}</th>
                ${d.schema.columns.map((k) => html `
                <td >                    
                ${this.colValue(item[k])}
                </td>
                `)} 
            </tr>
            `)}
            </tbody>
            <tfoot>
                ${this.tableColsHeaders(d.schema.columns)}
            </tfoot>
            </table>
        </figure> 
        </article>
        `), html`Loading...`)} 
        `;
    }

    
    toggleOrderConf(e) {
        const orderBy = e.target.attributes['orderby'] ? e.target.attributes['orderby'].value : 'id';
        this.ordersConf = {
            orderBy: orderBy,
            orderType: this.ordersConf.orderType == 'desc' ? 'asc' : 'desc'
        };
        this.refreshTable();
        e.preventDefault();
    }
    
}

customElements.define('entities-list', EntitiesList);