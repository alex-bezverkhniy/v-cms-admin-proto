import {LitElement, css, html} from 'lit'

export class NavigationMenu extends LitElement {    
    static properties = {
        globalSyles: {},
        isOpen: false,
        showClass: {},
    };
    constructor() {
        super();
        this.globalSyles =  document.styleSheets[0].href;
        this.showClass = 'hide';
    }
    render() {
        return html`
        <link rel="stylesheet" href="${this.globalSyles == undefined ? '' : this.globalSyles}">        
    <div @toggled=${this._toggleMenu} ><slot></slot></div>    
    <aside id="sidebar-menu" class="${this.showClass}">
      <nav>
        <button @click=${this._toggleMenu} id="sidebar-close" aria-label="Open menu">
          <svg
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <ul>
          <li><a @click=${this._linkHandler} href="#home">Home</a></li>
          <li><a @click=${this._linkHandler} href="#users">Users</a></li>
          <li><a href="">Content</a></li>
          <li><a href="">Dark</a></li>
        </ul>
      </nav>
    </aside>
        `
    }

    _linkHandler(e) {
      const start = window.location.href.lastIndexOf('#') + 1      
      const detail = {pagePath: e.target.href.substring(start)};
      const event = new CustomEvent('clicked', {
          detail,
          bubbles: true,
          composed: true,
          cancelable: true,
      });
      this.dispatchEvent(event);
      this._toggleMenu(e);
      if (event.defaultPrevented) {
          e.preventDefault();
      }
    }

    _toggleMenu(e) {      
        this.isOpen = !this.isOpen;
        this.showClass = this.isOpen ? 'selected' : 'dismiss';
    }

}

customElements.define('nav-menu', NavigationMenu);