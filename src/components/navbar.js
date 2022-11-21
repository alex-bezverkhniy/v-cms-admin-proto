import {LitElement, css, html} from 'lit'

export class NavigationBar extends LitElement {    
    static properties = {
        globalSyles: {}
    };

    constructor() {
        super();
        this.globalSyles =  document.styleSheets[0].href;
    }
    render() {
        return html`
        <link rel="stylesheet" href="${this.globalSyles}">         
        <nav>
      <ul>
        <li>
          <a href="#" id="sidebar-open" class="secondary" aria-label="Menu"
            ><svg
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="16px"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line></svg></a>
        </li>
        <li><strong>V Headless CMS</strong></li>
      </ul>
      <ul>
        <li>
          <a
            href="#"
            onclick="event.preventDefault()"
            class="secondary"
            aria-label="Twitter"
            >Login</a
          >
        </li>
      </ul>
    </nav>
        `;
    }
}

customElements.define('nav-bar', NavigationBar);