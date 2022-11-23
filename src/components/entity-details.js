import { html } from "lit";
import { BaseComponent } from "./base-component";

class EntityDetails extends BaseComponent {
    dlgStatus;

    static properties ={        
        opened: {type: Boolean},
        path: {},
        data: {},
    }
    constructor() {
        super();        
        this.data = {
            entity: {
                id: -1
            }
        }
        this.opened = false;
        console.log(this.opened);
    }

    render() {
        return html`
        ${this.globalSyles}
<dialog class=${this.opened ? 'modal-is-open' : ''} ${this.opened ? 'open="true"' : ''}>
  <article>
    <header>
      <a href="#close" aria-label="Close" class="close" @click=${this.close}></a>
      ${this.path} details
    </header>
    <p>
      ${this.data != undefined ? this.data.entity.id : ''}
    </p>
  </article>
</dialog>                
        `
    }

    close(e) {
        this.opened = false;
        e.preventDefault();
    }
}

customElements.define('entity-details', EntityDetails);