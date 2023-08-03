import * as Vue from 'https://unpkg.com/vue@3/dist/vue.runtime.esm-browser.prod.js';
import { loadModule } from 'https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js';

(async () => {
  const componentSource = `
%3Ctemplate%3E%0A%20%20%3Cdiv%0A%20%20%20%20v-ice:prop-bind=%22'textProperties.text'%22%0A%20%20%20%20v-ice:prop-bind-id=%22textProperties.id%22%0A%20%20%20%20v-ice:prop-type=%22'text'%22%0A%20%20%20%20:style=%22inlineStyles%22%0A%20%20%20%20class=%22ice_text%22%0A%20%20%20%20:class=%22textStyleClass%22%0A%20%20%3E%0A%20%20%20%20%3Cslot%20v-if=%22$slots.default?.()?.length%22%20/%3E%0A%20%20%20%20%3Cdiv%0A%20%20%20%20%20%20v-else%0A%20%20%20%20%20%20v-ice:inline-editing=%22true%22%0A%20%20%20%20%20%20class=%22ice_text_content%22%0A%20%20%20%20%20%20v-html=%22text%22%0A%20%20%20%20/%3E%0A%20%20%3C/div%3E%0A%3C/template%3E%0A%0A%3Cscript%3E%0Aconst%20getTextStyleFormat%20=%20(option)%20=%3E%20%7B%0A%20%20const%20styles%20=%20%7B%7D;%0A%20%20switch%20(option)%20%7B%0A%20%20%20%20case%20'bold':%0A%20%20%20%20%20%20styles.fontWeight%20=%20option;%0A%20%20%20%20%20%20break;%0A%20%20%20%20case%20'italic':%0A%20%20%20%20%20%20styles.fontStyle%20=%20option;%0A%20%20%20%20%20%20break;%0A%20%20%20%20case%20'underline':%0A%20%20%20%20%20%20styles.textDecoration%20=%20option;%0A%20%20%20%20%20%20break;%0A%20%20%20%20case%20'strikethrough':%0A%20%20%20%20%20%20styles.textDecoration%20=%20'line-through';%0A%20%20%20%20%20%20break;%0A%20%20%20%20default:%0A%20%20%20%20%20%20break;%0A%20%20%7D%0A%20%20return%20styles;%0A%7D;%0A%0A/**%0A%20*%20Convert%20text%20style%20options%20to%20inline%20style%20object%0A%20*%0A%20*%20Ex:%20%7B%20fontSize:%2016,%20fontUnit:%20'px',%20defaultColor:%20'#000',%20align:%20'center',%20option:%20'bold'%20%7D%0A%20*%20=%3E%20%7B%20fontSize:%20'16px',%20color:%20'#000',%20textAlign:%20'center',%20fontWeight:%20'bold'%20%7D%0A%20*%0A%20*%20@param%20textStyle%0A%20*%20@returns%20%7B%7BfontFamily:%20*,%20color:%20null,%20textAlign:%20*,%20lineHeight:%20null%7D%7C%7B%7D%7D%0A%20*/%0Afunction%20convertTextInlineStyle(textStyle)%20%7B%0A%20%20if%20(!textStyle)%20%7B%20return%20%7B%7D;%20%7D%0A%0A%20%20const%20%7B%0A%20%20%20%20fontSize,%0A%20%20%20%20fontUnit,%0A%20%20%20%20letterSpacing,%0A%20%20%20%20letterSpacingUnit,%0A%20%20%20%20lineSpacing,%0A%20%20%20%20lineSpacingUnit,%0A%20%20%20%20defaultColor,%0A%20%20%20%20option,%0A%20%20%20%20fontFamily,%0A%20%20%20%20align,%0A%20%20%20%20rotate,%0A%20%20%7D%20=%20textStyle;%0A%0A%20%20const%20styles%20=%20%7B%0A%20%20%20%20fontFamily:%20fontFamily?.value%20%7C%7C%20null,%0A%20%20%20%20color:%20defaultColor%20%7C%7C%20null,%0A%20%20%20%20textAlign:%20align?.value%20%7C%7C%20null,%0A%20%20%20%20transform:%20rotate?.value%20%7C%7C%20null,%0A%20%20%7D;%0A%0A%20%20if%20(fontSize%20&&%20Number(fontSize)%20%3E%200)%20%7B%0A%20%20%20%20styles.fontSize%20=%20%60$%7BfontSize%7D$%7BfontUnit?.value%20%7C%7C%20'px'%7D%60;%0A%20%20%7D%0A%0A%20%20if%20(lineSpacing%20&&%20Number(lineSpacing)%20%3E%200)%20%7B%0A%20%20%20%20styles.lineHeight%20=%20%60$%7BlineSpacing%7D$%7BlineSpacingUnit?.value%20%7C%7C%20'px'%7D%60;%0A%20%20%7D%0A%0A%20%20if%20(letterSpacing%20&&%20Number(letterSpacing)%20%3E%200)%20%7B%0A%20%20%20%20styles.letterSpacing%20=%20%60$%7BletterSpacing%7D$%7BletterSpacingUnit?.value%20%7C%7C%20'px'%7D%60;%0A%20%20%7D%0A%0A%20%20if%20(rotate)%20%7B%0A%20%20%20%20styles.transform%20=%20%60rotate($%7Brotate%7Ddeg)%60;%0A%20%20%7D%0A%0A%20%20if%20(Array.isArray(option))%20%7B%0A%20%20%20%20option.forEach((%7B%20value%20%7D)%20=%3E%20%7B%0A%20%20%20%20%20%20Object.assign(styles,%20getTextStyleFormat(value));%0A%20%20%20%20%7D);%0A%20%20%7D%20else%20%7B%0A%20%20%20%20Object.assign(styles,%20getTextStyleFormat(option?.value));%0A%20%20%7D%0A%20%20return%20styles;%0A%7D%0A%0Afunction%20i18n(text)%20%7B%0A%20%20console.log(%7B%20text%20%7D);%0A%20%20if%20(window.$nuxt)%20%7B%0A%20%20%20%20return%20window.$nuxt.$t(text);%0A%20%20%7D%0A%0A%20%20const%20i18nData%20=%20window.i18n;%0A%20%20return%20i18nData%20?%20i18nData%5Btext%5D%20:%20text;%0A%7D%0A%0A%0Aexport%20default%20%7B%0A%20%20description:%20'%60Text%60%20Element',%0A%20%20examples:%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20docName:%20'Default%20Text',%0A%20%20%20%20%20%20textProperties:%20%7B%0A%20%20%20%20%20%20%20%20text:%20'Enter%20text%20here',%0A%20%20%20%20%20%20%20%20label:%20'Enter%20text%20here',%0A%20%20%20%20%20%20%20%20textStyle:%20%7B%0A%20%20%20%20%20%20%20%20%20%20setting:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20value:%20'preset',%20label:%20'Preset',%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%20%20%7B%0A%20%20%20%20%20%20docName:%20'Text%20with%20background%20color',%0A%20%20%20%20%20%20textProperties:%20%7B%0A%20%20%20%20%20%20%20%20backgroundColor:%20'green',%20text:%20'Enter%20text%20here',%20label:%20'Enter%20text%20here',%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20textStyle:%20%7B%20setting:%20%7B%20value:%20'preset',%20label:%20'Preset'%20%7D%20%7D,%0A%20%20%20%20%7D,%0A%20%20%20%20%7B%0A%20%20%20%20%20%20docName:%20'Text%20color%20with%20background%20color',%0A%20%20%20%20%20%20textProperties:%20%7B%0A%20%20%20%20%20%20%20%20backgroundColor:%20'purple',%20text:%20'Enter%20text%20here',%20label:%20'Enter%20text%20here',%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20textStyle:%20%7B%20setting:%20%7B%20value:%20'customized',%20label:%20'Customized'%20%7D,%20defaultColor:%20'#fff',%20option:%20%7B%20value:%20'bold',%20label:%20''%20%7D%20%7D,%0A%20%20%20%20%7D,%0A%20%20%5D,%0A%20%20props:%20%7B%0A%20%20%20%20textProperties:%20%7B%0A%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20default:%20()%20=%3E%20(%7B%0A%20%20%20%20%20%20%20%20id:%20null,%0A%20%20%20%20%20%20%20%20text:%20null,%0A%20%20%20%20%20%20%20%20backgroundColor:%20'',%0A%20%20%20%20%20%20%7D),%0A%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20options:%20%7B%0A%20%20%20%20%20%20%20%20%20%20text:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20%20%20%20%20%20%20default:%20'Text%20Element',%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20backgroundColor:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20default:%20'purple',%0A%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20hidden:%20true,%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20tagType:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20component:%20'Radio',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20list:%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20label:%20'%3Cp%3EParagraph%3C/p%3E',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value:%20'p',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20label:%20'%3Cspan%3ESpan%3C/span%3E',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value:%20'span',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20label:%20'%3Cdiv%3EDiv%3C/div%3E',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value:%20'div',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%20%20textStyle:%20%7B%0A%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20default:%20()%20=%3E%20(%7B%0A%20%20%20%20%20%20%20%20fontFamily:%20'',%0A%20%20%20%20%20%20%20%20fontSize:%20null,%0A%20%20%20%20%20%20%20%20fontUnit:%20null,%0A%20%20%20%20%20%20%20%20letterSpacing:%20null,%0A%20%20%20%20%20%20%20%20letterSpacingUnit:%20null,%0A%20%20%20%20%20%20%20%20lineSpacing:%20null,%0A%20%20%20%20%20%20%20%20lineSpacingUnit:%20null,%0A%20%20%20%20%20%20%20%20character:%20'',%0A%20%20%20%20%20%20%20%20defaultColor:%20'',%0A%20%20%20%20%20%20%20%20align:%20%7B%20value:%20''%20%7D,%0A%20%20%20%20%20%20%20%20option:%20%7B%20value:%20''%20%7D,%0A%20%20%20%20%20%20%7D),%0A%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20options:%20%7B%0A%20%20%20%20%20%20%20%20%20%20fontFamily:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20fontSize:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20fontUnit:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20letterSpacing:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20letterSpacingUnit:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20lineSpacing:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20lineSpacingUnit:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Object,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20character:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20Number,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20defaultColor:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20%20%20%20%20%20%20default:%20'#fff',%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20align:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20type:%20String,%0A%20%20%20%20%20%20%20%20%20%20%20%20doc:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20component:%20'Radio',%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20list:%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20label:%20'Left',%20value:%20'left'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20label:%20'Center',%20value:%20'center'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%20label:%20'Right',%20value:%20'right'%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5D,%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%7D,%0A%20%20%7D,%0A%20%20computed:%20%7B%0A%20%20%20%20text()%20%7B%0A%20%20%20%20%20%20const%20text%20=%20i18n(this.textProperties?.text%20%7C%7C%20'');%0A%20%20%20%20%20%20const%20textAlign%20=%20this.textStyle?.align?.value%20%7C%7C%20'left';%0A%20%20%20%20%20%20return%20textAlign%20==%20'justify'%0A%20%20%20%20%20%20%20%20?%20text.split('').map((val)%20=%3E%20%60%3Cspan%3E$%7Bval%7D%3C/span%3E%60).join('')%0A%20%20%20%20%20%20%20%20:%20text;%0A%20%20%20%20%7D,%0A%20%20%20%20inlineStyles()%20%7B%0A%20%20%20%20%20%20const%20styles%20=%20convertTextInlineStyle(this.textStyle);%0A%20%20%20%20%20%20styles.maxWidth%20=%20'100%25';%0A%20%20%20%20%20%20styles.backgroundColor%20=%20this.textProperties?.backgroundColor%20%7C%7C%20null;%0A%20%20%20%20%20%20return%20styles;%0A%20%20%20%20%7D,%0A%20%20%20%20textStyleClass()%20%7B%0A%20%20%20%20%20%20const%20classes%20=%20%5B%5D;%0A%20%20%20%20%20%20if%20(!this.textStyle)%20return%20classes;%0A%0A%20%20%20%20%20%20const%20%7B%0A%20%20%20%20%20%20%20%20preset,%20fontSizeClass,%20lineSpacingClass,%20letterSpacingClass,%0A%20%20%20%20%20%20%7D%20=%20this.textStyle;%0A%0A%20%20%20%20%20%20let%20className%20=%20preset?.value;%0A%20%20%20%20%20%20if%20(className)%20classes.push(className);%0A%0A%20%20%20%20%20%20className%20=%20fontSizeClass?.value;%0A%20%20%20%20%20%20if%20(className)%20classes.push(className);%0A%0A%20%20%20%20%20%20className%20=%20lineSpacingClass?.value;%0A%20%20%20%20%20%20if%20(className)%20classes.push(className);%0A%0A%20%20%20%20%20%20className%20=%20letterSpacingClass?.value;%0A%20%20%20%20%20%20if%20(className)%20classes.push(className);%0A%0A%20%20%20%20%20%20return%20classes;%0A%20%20%20%20%7D,%0A%20%20%7D,%0A%0A%20%20methods:%20%7B%7D,%0A%7D;%0A%3C/script%3E%0A
`

const options = {
  moduleCache: {
    vue: Vue
  },
  async getFile(url) {
    if (url == 'Text.vue') {
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

const componentName = 'IceWebText'
const componentCode = Vue.defineCustomElement(await loadModule('Text.vue', options))

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