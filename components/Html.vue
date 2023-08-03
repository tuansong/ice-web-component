<template>
  <div
    v-ice:prop-bind="'html'"
    v-ice:prop-type="'html'"
    :style="inlineStyles"
    class="ice_html"
    v-html="renderedHTML"
  />
</template>

<script>
function getBoxShadowStyle(styles, important) {
  if (styles == null || !styles?.enable) return null;

  const {
    x, y, blur, spread, color, sizeUnit,
  } = styles;

  const unit = sizeUnit && sizeUnit.value ? sizeUnit.value : 'px';

  return `${x}${unit} ${y}${unit} ${blur}${unit} ${spread}${unit} ${color} ${important ? '!important' : ''}`;
}

function i18n(text) {
  console.log({ text });
  if (window.$nuxt) {
    return window.$nuxt.$t(text);
  }

  const i18nData = window.i18n;
  return i18nData ? i18nData[text] : text;
}


export default {
  examples: [
    {
      type: 'text',
      html: '<h1 style="padding:1rem">Shadow around box</h1>',
      shadowStyle: {
        color: '#280B4E',
        enable: true,
        x: 0,
        y: 0,
        blur: 5,
      },
      docName: 'Example for <h1 style="padding:1rem">Shadow around box</h1>',
    },
    {
      type: 'code',
      htmlCode: '<h1 style="padding:1rem">Code editor</h1>',
      docName: 'Example for <h1 style="padding:1rem">Code editor</h1>',
    },
  ],

  props: {
    type: {
      type: Object,
      default: null,
    },
    html: {
      type: String,
      default: '',
    },
    htmlCode: {
      type: String,
      default: '',
    },
    shadowStyle: {
      type: Object,
      default: null,
      doc: {
        hidden: true,
      },
    },
  },
  computed: {
    inlineStyles() {
      return {
        boxShadow: getBoxShadowStyle(this.shadowStyle),
      };
    },
    renderedHTML() {
      const htmlType = this.type?.value || 'text';
      let htmlContext;
      switch (htmlType) {
        case 'code':
          htmlContext = this.htmlCode;
          break;
        default:
          htmlContext = this.html;
      }
      return i18n(htmlContext);
    },
  },
};
</script>
