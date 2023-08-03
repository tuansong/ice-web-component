import * as Vue from 'https://unpkg.com/vue@3/dist/vue.runtime.esm-browser.prod.js';
import { loadModule } from 'https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js';

(() => {
  const ICE = {
    async loadWebComponents({ components = {} } = {}) {
      const options = {
        moduleCache: {
          vue: Vue
        },
        async getFile(url) {
          const res = await fetch(url);

          if (!res.ok) {
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
          }

          return {
            getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
          }
        },
        addStyle(textContent) {
          const style = Object.assign(document.createElement('style'), { textContent });
          const ref = document.head.getElementsByTagName('style')[0] || null;
          document.head.insertBefore(style, ref);
        },
      }
  
      const list = {}

      for (const k in components) {
        list['IceWeb' + k] = Vue.defineCustomElement(await loadModule(components[k], options))
      }

      function kebabCase(str) {
        return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
      }

      Vue.createApp({
        setup() {
          // Register as Web Components
          Object.entries(list).forEach(([k, v]) => {
            window.customElements.define(kebabCase(k), v)
          })
          
          return {}
        },
      }).mount(document.createElement('div'));

      return this
    }
  }
  
  window.ICE = ICE;
})();
