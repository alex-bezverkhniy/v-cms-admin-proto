import { css, html } from "lit";
import { until } from 'lit/directives/until.js';
import { BaseComponent } from "./base-component";
import './entity-details'

import {API} from '../api'

class EntitiesList extends BaseComponent {    
    isOpenClass;
    openingClass;
    closingClass;
    animationDuration;
    visibleModal;
    


    static properties = {
        path: {},
        data: {},
        ordersConf: {},
        selectedEntityIdx: -1,
    };

    static styles = css`
        h3 {
            text-transform: capitalize;      
        } 
        th>details {
            min-width: 3em;
        }
        th>details>summary {
            min-width: 2em;
        }
    `;

    constructor() {
        super();

        this.apiClient = new API();
        this.ordersConf = {
            orderBy: 'id',
            orderType: 'asc'
        }

        this.isOpenClass = 'modal-is-open';
        this.openingClass = 'modal-is-opening';
        this.closingClass = 'modal-is-closing';
        this.animationDuration = 400; // ms
        this.visibleModal;   
        this.selectedEntityIdx = -1; 
    }
    
    refreshTable() {
        this.data = this.apiClient.fetchData(this.path, this.ordersConf.orderBy, this.ordersConf.orderType);
    }

    connectedCallback() {
        super.connectedCallback() 
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
        ${this.globalSyles}
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
                <th scope="row">               
                    <!-- Button to trigger the modal -->
                <details role="list" dir="rtl">
                    <summary aria-haspopup="listbox" role="link">${i+1}</summary>
                    <ul role="listbox">
                    <li>
                        <a title="edit" @click=${this.toggleModal} index=${i} href="#details" role="link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>                        
                        </a>
                    </li>
                    <li>
                        <a title="details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>                        
                        </a>
                    </li>
                    </ul>
                </details>
                </th>
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
        <!-- Modal -->
        <dialog id="modal-dlg">
        <article>
            <a href="#close"
            aria-label="Close"
            class="close"
            
            @click=${this.toggleModal}>
            </a>
            <h3>details</h3>
            ${until(this.data.then((d) => html`
            idx: ${this.selectedEntityIdx}
            
            <p>
            Cras sit amet maximus risus. 
            Pellentesque sodales odio sit amet augue finibus pellentesque. 
            Nullam finibus risus non semper euismod.
            </p>
            `), html`Loading...`)} 
            <footer>
            <a href="#close"
                role="button"
                class="secondary"
                @click=${this.toggleModal}>
                Close
            </a>      
            </footer>
        </article>
        </dialog>
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
    
    // Toggle modal
    toggleModal (event){
        event.stopPropagation();
        this.selectedEntityIdx = event.target.attributes['index'] ? event.target.attributes['index'].value : -1
        console.log('idx', event.target.attributes['index'].value );
        const modal = this.renderRoot.getElementById("modal-dlg");
        (typeof(modal) != 'undefined' && modal != null)
          && this.isModalOpen(modal) ? this.closeModal(modal) : this.openModal(modal)
        event.preventDefault();
        }
      
    // Is modal open
    isModalOpen(modal) {
        return modal.hasAttribute('open') && modal.getAttribute('open') != 'false' ? true : false;
    }
  
    // Open modal
    openModal(modal) {
        modal.setAttribute('open', true);
    }
    
    // Close modal
    closeModal(modal) {
        this.visibleModal = null;
        modal.removeAttribute('open');
    }
    
}

customElements.define('entities-list', EntitiesList);