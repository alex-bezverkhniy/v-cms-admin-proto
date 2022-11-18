import {LitElement, css, html} from 'lit'
import {live} from 'lit/directives/live.js'
import { until } from 'lit/directives/until.js';

const operations = {
    neq: '!=', 
    eq: '=', 
    gt: '>', 
    lt: '<', 
    ge: '>=', 
    le: '<=', 
    like:'like', 
    in:'in'
}

const loadUsersSchema = async () => {
    const resp = await fetch('/api/schema/users/');
    const json = await resp.json();
    // await new Promise((r) => setTimeout(() => r(), 1000));
    return json;
}
const loadUsersData = async (orderBy, orderType) => {
    const resp = await fetch(`/api/users/?order_by=${orderBy}&order_type=${orderType}`);
    const json = await resp.json();
    return json;
}

const fetchData = async (orderBy, orderType) => {
    return Promise.all([
        loadUsersData(orderBy, orderType),
        loadUsersSchema()
    ]).then((arr) => {
        const schema = arr[1];
        const fields = Object.keys(schema.properties);
        const hiddenFields = fields.flatMap((f) => { 
            if (schema.properties[f].is_hidden) {
                return f;
            }
        }).filter(f => f != undefined);
        
        return {list: arr[0], schema: {
                ...schema,
                title: schema.title,
                required: schema.required,
                fields: fields,
                columns: fields.filter(f => !hiddenFields.includes(f) && schema.properties[f].format != "password" ),
                hiddenFields: hiddenFields,
            }
        };
    })
}

export class UsersList extends LitElement {
    static shadowRootOptions = {...{ mode: "open" }, delegatesFocus: true};

    static properties = {
        data: {state: true},
        ordersConf: {}
    };

    static styles = css`
    @import url('src/css/pico.min.css');
    figure {
        margin: 0;
    }
    table {
        margin-top: 0;
        margin-bottom: var(--typography-spacing-vertical);
        color: var(--color);
        font-style: normal;
        font-weight: var(--font-weight);
        font-size: var(--font-size);
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        text-indent: 0;
    }
    [type="checkbox"][role="switch"], tfoot td, tfoot th, thead td, thead th {
	    --border-width: 3px;
    }
    td, th {
        text-transform: capitalize;
        padding: calc(var(--spacing) / 2) var(--spacing);
        border-bottom: var(--border-width) solid var(--table-border-color);
        color: var(--color);
        font-weight: var(--font-weight);
        font-size: var(--font-size);
        text-align: left;
        text-align: start;
    }
    details {
        display: block;
        margin-bottom: var(--spacing);
        padding-bottom: var(--spacing);
        border-bottom: var(--border-width) solid var(--accordion-border-color);
    }
    details[open] > summary::after {
        transform: rotate(0);
    }
    details summary[role="button"]::after {
        height: calc(1rem * var(--line-height, 1.5));
        background-image: var(--icon-chevron-button);
    }
    details summary::after {
        display: block;
        width: 1rem;
        height: 1rem;
        -webkit-margin-start: calc(var(--spacing, 1rem) * 0.5);
        margin-inline-start: calc(var(--spacing, 1rem) * 0.5);
        float: right;
        transform: rotate(-90deg);
        background-image: var(--icon-chevron);
        background-position: right center;
        background-size: 1rem auto;
        background-repeat: no-repeat;
        content: "";
        transition: transform var(--transition);
    }
    [role="button"]:focus, button:focus, input[type="button"]:focus, input[type="reset"]:focus, input[type="submit"]:focus {
        --box-shadow: var(--button-hover-box-shadow, 0 0 0 rgba(0, 0, 0, 0)), 0 0 0 var(--outline-width) var(--primary-focus);
    }
    [role="button"]:is([aria-current], :hover, :active, :focus), button:is([aria-current], :hover, :active, :focus), input[type="button"]:is([aria-current], :hover, :active, :focus), input[type="reset"]:is([aria-current], :hover, :active, :focus), input[type="submit"]:is([aria-current], :hover, :active, :focus) {
        --background-color: var(--primary-hover);
        --border-color: var(--primary-hover);
        --box-shadow: var(--button-hover-box-shadow, 0 0 0 rgba(0, 0, 0, 0));
        --color: var(--primary-inverse);
    }
    [role="button"], button, input[type="button"], input[type="reset"], input[type="submit"] {
        --background-color: var(--primary);
        --border-color: var(--primary);
        --color: var(--primary-inverse);
        --box-shadow: var(--button-box-shadow, 0 0 0 rgba(0, 0, 0, 0));
        padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
        border: var(--border-width) solid var(--border-color);
        border-radius: var(--border-radius);
        outline: 0;
        background-color: var(--background-color);
        box-shadow: var(--box-shadow);
        color: var(--color);
        font-weight: var(--font-weight);
        font-size: 1rem;
        line-height: var(--line-height);
        text-align: center;
        cursor: pointer;
        transition: background-color var(--transition), border-color var(--transition), color var(--transition), box-shadow var(--transition);
    }
    [role="button"] {
        display: inline-block;
        text-decoration: none;
    }
    `;

    constructor() {
        super();
        this.data = fetchData('id', 'desc');
        this.ordersConf = {
            orderBy: 'id',
            orderType: 'asc'
        }
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

    filterForm() {
        return html`
        <details>
            <summary role="button">            
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
                </svg>
                Filters
            </summary>
            <div class="grid">
                <label for="filter_by">Filter By
                    <select id="filter_by" name="filter_by" required>
                        <option value="" selected>Select a column</option>
                    </select>
                </label>
                <label for="filter_by_op">Operation
                    <select id="filter_by_op" name="filter_by_op" required>                        
                        <option value="" selected>Select a operation</option>
                       
                    </select>
                </label>
            </div>
        </details>
        `;
    }

    refreshTable() {
        this.data = fetchData(this.ordersConf.orderBy, this.ordersConf.orderType);
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

    render() {
        return html`
            <h2>Users:</h2>  
            ${this.filterForm()}          
            <!-- <pre>${until(this.data.then((d) => JSON.stringify(d.schema, null, "\t")), html`Loading...`)} </pre> -->
        ${until(this.data.then((d) => html`
            <figure>
            <table>
            <thead>
                ${this.tableColsHeaders(d.schema.columns)}
            </thead>
            <tbody>
            ${d.list.map((item, i) => html`
            <tr>
                <th scope="row">${i+1}</th>
                ${d.schema.columns.map((k) => html `
                <td scope="col">                    
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
        `), html`Loading...`)}`;
    }
}

customElements.define('users-list', UsersList);