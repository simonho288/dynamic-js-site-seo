import {LitElement, html, css} from 'https://unpkg.com/lit-element/lit-element.js?module';

export class IndexPage extends LitElement {
  static get styles() {
    return css`
      .main {
        color: #333;
      }
      .dataList {
        height: 500px;
        border: 1px solid lightgray;
        overflow: scroll;
      }
      .dataList img {
        width: 300px;
        height: auto;
      }
    `;
  }

  constructor() {
    super();
    this._dbRecords = null;
  }

  createRenderRoot() {
    const urlParams = new URLSearchParams(window.location.search);
    let isCrawler = urlParams.get('crawler') == 1;
    if (isCrawler) {
      return this;
    } else {
      return super.createRenderRoot(); // Same as: return this.attachShadow({mo$
    }
  }

  async connectedCallback() {
    await super.connectedCallback();

    // Metatags for SEO
    this.createMetaTag([
      { name: 'description' }, { content: 'This webpage is an example to show how to make a dynamic Javascript webpage at the top of Google Search' },
    ]);

    // Call backend API to simulate getting database records
    let res = await fetch('/get-database-records', {
      method: 'GET',
    });
    res = await res.json();
    this._dbRecords = res;
    await this.requestUpdate();
  }

  createMetaTag(values) {
    let meta = document.createElement('meta');
    for (let i = 0; i < values.length; ++i) {
      let value = values[i];
      for (let title in value) {
        meta.setAttribute(title, value[title]);
        // document.head.appendChild(meta);
      }
    }
    document.getElementsByTagName('head')[0].appendChild(meta);
  }  

  render() {
    // When the db records are not get, it shows "Loading data..."
    return html`
      <div class="main">
        <h1>Top SEO Example Webpage</h1>
        <p>This webpage is an example to show how to make a dynamic Javascript webpage at the top of Google Search</p>
        <h3>Example Database records from backend.</h3>
        <div class="dataList">
          ${this._dbRecords
            ? html`
              <ul>
                ${this._dbRecords.map(r => html`<li><img src="${r.img}"><p>${r.name} - ${r.detail}</p></li>`)}
              </ul>
            `
            : html`<p>Loading data...</p>`
          }
        </div>
      </div>
    `;
  }
}

customElements.define('index-page', IndexPage);