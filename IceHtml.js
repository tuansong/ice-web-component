import * as Vue from 'https://unpkg.com/vue@3/dist/vue.runtime.esm-browser.prod.js';
import { loadModule } from 'https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js';

(async () => {
  const componentSource = `
%3Ctemplate%3E%0A%20%20%3Cdiv%0A%20%20%20%20v-ice:prop-bind=%22'html'%22%0A%20%20%20%20v-ice:prop-type=%22'html'%22%0A%20%20%20%20:style=%22inlineStyles%22%0A%20%20%20%20class=%22ice_html%22%0A%20%20%20%20v-html=%22renderedHTML%22%0A%20%20/%3E%0A%3C/template%3E%0A%0A%3Cscript%3E%0Afunction%20getBoxShadowStyle(styles,%20important)%20%7B%0A%20%20if%20(styles%20==%20null%20%7C%7C%20!styles?.enable)%20return%20null;%0A%0A%20%20const%20%7B%0A%20%20%20%20x,%20y,%20blur,%20spread,%20color,%20sizeUnit,%0A%20%20%7D%20=%20styles;%0A%0A%20%20const%20unit%20=%20sizeUnit%20&&%20sizeUnit.value%20?%20sizeUnit.value%20:%20'px';%0A%0A%20%20return%20%60$%7Bx%7D$%7Bunit%7D%20$%7By%7D$%7Bunit%7D%20$%7Bblur%7D$%7Bunit%7D%20$%7Bspread%7D$%7Bunit%7D%20$%7Bcolor%7D%20$%7Bimportant%20?%20'!important'%20:%20''%7D%60;%0A%7D%0A%0Afunction%20i18n(text)%20%7B%0A%20%20if%20(process.client)%20%7B%20//%20Temporary%20$t%20not%20support%20SSR%0A%20%20%20%20if%20(window.$nuxt)%20%7B%0A%20%20%20%20%20%20return%20window.$nuxt.$t(text);%0A%20%20%20%20%7D%0A%0A%20%20%20%20const%20i18nData%20=%20window.i18n;%0A%20%20%20%20return%20i18nData%20&&%20i18nData%5Btext%5D%20?%20i18nData%5Btext%5D%20:%20text;%0A%20%20%7D%0A%20%20return%20text;%0A%7D%0A%0A%0Aexport%20default%20%7B%0A%20%20examples:%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20type:%20'text',%0A%20%20%20%20%20%20html:%20'%3Ch1%20style=%22padding:1rem%22%3EShadow%20around%20box%3C/h1%3E',%0A%20%20%20%20%20%20shadowStyle:%20%7B%0A%20%20%20%20%20%20%20%20color:%20'#280B4E',%0A%20%20%20%20%20%20%20%20enable:%20true,%0A%20%20%20%20%20%20%20%20x:%200,%0A%20%20%20%20%20%20%20%20y:%200,%0A%20%20%20%20%20%20%20%20blur:%205,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20docName:%20'Example%20for%20%3Ch1%20style=%22padding:1rem%22%3EShadow%20around%20box%3C/h1%3E',%0A%20%20%20%20%7D,%0A%20%20%20%20%7B%0A%20%20%20%20%20%20type:%20'code',%0A%20%20%20%20%20%20htmlCode:%20'%3Ch1%20style=%22padding:1rem%22%3ECode%20editor%3C/h1%3E',%0A%20%20%20%20%20%20docName:%20'Example%20for%20%3Ch1%20style=%22padding:1rem%22%3ECode%20editor%3C/h1%3E',%0A%20%20%20%20%7D,%0A%20%20%5D,%0A%0A%20%20props:%20%7B%0A%20%20%20%20type:%20%7B%0A%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20default:%20null,%0A%20%20%20%20%7D,%0A%20%20%20%20html:%20%7B%0A%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20default:%20'',%0A%20%20%20%20%7D,%0A%20%20%20%20htmlCode:%20%7B%0A%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20default:%20'',%0A%20%20%20%20%7D,%0A%20%20%20%20shadowStyle:%20%7B%0A%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20default:%20null,%0A%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20hidden:%20true,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%7D,%0A%20%20computed:%20%7B%0A%20%20%20%20inlineStyles()%20%7B%0A%20%20%20%20%20%20return%20%7B%0A%20%20%20%20%20%20%20%20boxShadow:%20getBoxShadowStyle(this.shadowStyle),%0A%20%20%20%20%20%20%7D;%0A%20%20%20%20%7D,%0A%20%20%20%20renderedHTML()%20%7B%0A%20%20%20%20%20%20const%20htmlType%20=%20this.type?.value%20%7C%7C%20'text';%0A%20%20%20%20%20%20let%20htmlContext;%0A%20%20%20%20%20%20switch%20(htmlType)%20%7B%0A%20%20%20%20%20%20%20%20case%20'code':%0A%20%20%20%20%20%20%20%20%20%20htmlContext%20=%20this.htmlCode;%0A%20%20%20%20%20%20%20%20%20%20break;%0A%20%20%20%20%20%20%20%20default:%0A%20%20%20%20%20%20%20%20%20%20htmlContext%20=%20this.html;%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20return%20i18n(htmlContext);%0A%20%20%20%20%7D,%0A%20%20%7D,%0A%7D;%0A%3C/script%3E%0A
`

const options = {
  moduleCache: {
    vue: Vue,
  },
  async getFile(url) {
    if (url == 'Html.vue') {
      return Promise.resolve(decodeURI(componentSource));
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw Object.assign(new Error(res.statusText + ' ' + url), { res });
    }
    return {
      getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
    }
  },
  addStyle(textContent) {
    options.styles = ''.concat(textContent);
  },
}

const componentName = 'IceWebHtml'
const componentObj = await loadModule('Html.vue', options)
const componentCode = Vue.defineCustomElement({ ...componentObj, styles: [options.styles] })

function kebabCase(str) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

Vue.createApp({
  setup() {
    // Register as Web Components
    window.customElements.define(kebabCase(componentName), componentCode)
    return {}
  },
}).mount(document.createElement('div'));
})();