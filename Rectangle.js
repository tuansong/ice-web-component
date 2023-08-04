import * as Vue from 'https://unpkg.com/vue@3/dist/vue.runtime.esm-browser.prod.js';
import { loadModule } from 'https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js';

(async () => {
  const componentSource = `
%3Ctemplate%3E%0A%20%20%3Cdiv%0A%20%20%20%20v-ice:prop-type=%22'children'%22%0A%20%20%20%20:style=%22inlineStyles%22%0A%20%20%20%20class=%22ice_rectangle%22%0A%20%20%20%20:class=%22%7B%20no_content:%20!hasSlot%20%7D%22%0A%20%20%3E%0A%20%20%20%20%3Cslot%20/%3E%0A%20%20%3C/div%3E%0A%3C/template%3E%0A%0A%3Cscript%3E%0Afunction%20getBoxShadowStyle(styles,%20important)%20%7B%0A%20%20if%20(styles%20==%20null%20%7C%7C%20!styles?.enable)%20return%20null;%0A%0A%20%20const%20%7B%0A%20%20%20%20x,%20y,%20blur,%20spread,%20color,%20sizeUnit,%0A%20%20%7D%20=%20styles;%0A%0A%20%20const%20unit%20=%20sizeUnit%20&&%20sizeUnit.value%20?%20sizeUnit.value%20:%20'px';%0A%0A%20%20return%20%60$%7Bx%7D$%7Bunit%7D%20$%7By%7D$%7Bunit%7D%20$%7Bblur%7D$%7Bunit%7D%20$%7Bspread%7D$%7Bunit%7D%20$%7Bcolor%7D%20$%7Bimportant%20?%20'!important'%20:%20''%7D%60;%0A%7D%0A%0A%0Aexport%20default%20%7B%0A%20%20description:%20'%60Rectangle%60%20Element',%0A%20%20examples:%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20docName:%20'Basic%20Rectangle',%0A%20%20%20%20%20%20rectangleStyle:%20%7B%0A%20%20%20%20%20%20%20%20backgroundColor:%20'#EEEEEE',%0A%20%20%20%20%20%20%20%20borderStyle:%20%7B%20enable:%20false%20%7D,%0A%20%20%20%20%20%20%20%20radiusStyle:%201,%0A%20%20%20%20%20%20%20%20shadowStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20enable:%20false,%20color:%20null,%20x:%201,%20y:%201,%20blur:%201,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%20%20%7B%0A%20%20%20%20%20%20docName:%20'Rectangle%20Dotted%20Type',%0A%20%20%20%20%20%20rectangleStyle:%20%7B%0A%20%20%20%20%20%20%20%20backgroundColor:%20'purple',%0A%20%20%20%20%20%20%20%20borderStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20enable:%20true,%20color:%20'#FFEB3BF2',%20size:%20null,%20type:%20%7B%20value:%20'dotted',%20label:%20'Dotted'%20%7D,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20radiusStyle:%2010,%0A%20%20%20%20%20%20%20%20shadowStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20enable:%20true,%20color:%20'#2A1055E6',%20x:%201,%20y:%201,%20blur:%201,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%20%20%7B%0A%20%20%20%20%20%20docName:%20'Rectangle%20Ridge%20Type',%0A%20%20%20%20%20%20rectangleStyle:%20%7B%0A%20%20%20%20%20%20%20%20backgroundColor:%20'green',%0A%20%20%20%20%20%20%20%20borderStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20enable:%20true,%20color:%20'#FFEB3BF2',%20size:%20null,%20type:%20%7B%20value:%20'ridge',%20label:%20'Ridge'%20%7D,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20radiusStyle:%2010,%0A%20%20%20%20%20%20%20%20shadowStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20enable:%20true,%20color:%20'#2A1055E6',%20x:%201,%20y:%201,%20blur:%201,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%5D,%0A%20%20props:%20%7B%0A%20%20%20%20rectangleStyle:%20%7B%0A%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20default:%20()%20=%3E%20(%7B%0A%20%20%20%20%20%20%20%20backgroundColor:%20'#eee',%0A%20%20%20%20%20%20%20%20borderStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20color:%20'#4A4A4A',%0A%20%20%20%20%20%20%20%20%20%20size:%20'1',%0A%20%20%20%20%20%20%20%20%20%20type:%20'solid',%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20shadowStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20enable:%20false,%0A%20%20%20%20%20%20%20%20%20%20color:%20'#eee',%0A%20%20%20%20%20%20%20%20%20%20x:%201,%0A%20%20%20%20%20%20%20%20%20%20y:%201,%0A%20%20%20%20%20%20%20%20%20%20blur:%201,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D),%0A%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20options:%20%7B%0A%20%20%20%20%20%20%20%20%20%20backgroundColor:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20%20%20%20%20%20%20default:%20'#EEEEEE',%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20borderStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20options:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20enable:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20Boolean,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20default:%20'purple',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20hidden:%20true,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20size:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20component:%20'Radio',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20list:%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'solid',%20label:%20'Solid'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'dotted',%20label:%20'Dotted'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'dashed',%20label:%20'Dashed'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'double',%20label:%20'Double'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'groove',%20label:%20'Groove'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'ridge',%20label:%20'Ridge'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'inset',%20label:%20'Inset'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20value:%20'outset',%20label:%20'Outset'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%0A%20%20%20%20%20%20%20%20%20%20radiusStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%0A%20%20%20%20%20%20%20%20%20%20shadowStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20options:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20enable:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20Boolean,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20hidden:%20true,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20x:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20y:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20blur:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%20%20styles:%20%7B%0A%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20default:%20()%20=%3E%20(%7B%0A%20%20%20%20%20%20%20%20height:%20'50px',%0A%20%20%20%20%20%20%7D),%0A%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20hidden:%20true,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%7D,%0A%20%20data()%20%7B%0A%20%20%20%20return%20%7B%0A%20%20%20%20%20%20hasSlots:%20false,%0A%20%20%20%20%7D;%0A%20%20%7D,%0A%20%20computed:%20%7B%0A%20%20%20%20inlineStyles()%20%7B%0A%20%20%20%20%20%20const%20backgroundColor%20=%20this.rectangleStyle?.backgroundColor%20%7C%7C%20null;%0A%20%20%20%20%20%20const%20borderStyle%20=%20this.rectangleStyle?.borderStyle%20%7C%7C%20%7B%7D;%0A%20%20%20%20%20%20const%20shadowStyle%20=%20this.rectangleStyle?.shadowStyle%20%7C%7C%20%7B%7D;%0A%20%20%20%20%20%20const%20radiusStyle%20=%20this.rectangleStyle?.radiusStyle%20%7C%7C%200;%0A%20%20%20%20%20%20const%20%7B%20color,%20size,%20type%20=%20%7B%7D%20%7D%20=%20borderStyle;%0A%20%20%20%20%20%20const%20enableBorder%20=%20borderStyle.enable%20%7C%7C%20false;%0A%20%20%20%20%20%20const%20borderType%20=%20type?.value%20%7C%7C%20'solid';%0A%0A%20%20%20%20%20%20const%20extendStyles%20=%20%7B%7D;%0A%20%20%20%20%20%20enableBorder%0A%20%20%20%20%20%20%20%20&&%20(extendStyles.border%20=%20%60$%7Bsize%7Dpx%20$%7BborderType%7D%20$%7Bcolor%7D%20!important%60);%0A%0A%20%20%20%20%20%20return%20%7B%0A%20%20%20%20%20%20%20%20...this.styles,%0A%20%20%20%20%20%20%20%20minHeight:%20this.styles.height%20!=%20null%20?%20this.styles.height%20:%20null,%0A%20%20%20%20%20%20%20%20backgroundColor,%0A%20%20%20%20%20%20%20%20borderRadius:%20%60$%7BradiusStyle%7Dpx%60,%0A%20%20%20%20%20%20%20%20boxShadow:%20getBoxShadowStyle(shadowStyle),%0A%20%20%20%20%20%20%20%20...extendStyles,%0A%20%20%20%20%20%20%7D;%0A%20%20%20%20%7D,%0A%20%20%20%20hasSlot()%20%7B%0A%20%20%20%20%20%20return%20this.$slots.default%20&&%20this.$slots.default().length%20%3E%200;%0A%20%20%20%20%7D,%0A%20%20%7D,%0A%7D;%0A%3C/script%3E%0A
`

const options = {
  moduleCache: {
    vue: Vue
  },
  async getFile(url) {
    if (url == 'Rectangle.vue') {
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
    const style = Object.assign(document.createElement('style'), { textContent });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },
}

const componentName = 'IceWebRectangle'
const componentCode = Vue.defineCustomElement(await loadModule('Rectangle.vue', options))

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