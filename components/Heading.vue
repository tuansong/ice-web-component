<template>
  <div>
    <component
      :is="tag"
      :id="anchorValue"
      v-ice:prop-bind="'text'"
      v-ice:prop-type="'text'"
      v-ice:prop-bind-id="propClassId || id"
      :style="inlineStyles"
      class="ice_heading"
      :class="textStyleClass"
    >
      <div class="ice_heading_inner">
        <a
          v-if="anchorValue"
          :href="`#${anchorValue}`"
          class="anchor_holder"
        >
          <i class="bi bi-link-45deg" />
        </a>

        <slot v-if="$slots.default?.()?.length" />
        <span
          v-else
          v-ice:inline-editing="true"
          class="ice_heading_text"
          v-html="transformedHtml"
        />
      </div>
    </component>
  </div>
</template>

<script>
const getTextStyleFormat = (option) => {
  const styles = {};
  switch (option) {
    case 'bold':
      styles.fontWeight = option;
      break;
    case 'italic':
      styles.fontStyle = option;
      break;
    case 'underline':
      styles.textDecoration = option;
      break;
    case 'strikethrough':
      styles.textDecoration = 'line-through';
      break;
    default:
      break;
  }
  return styles;
};

/**
 * Convert text style options to inline style object
 *
 * Ex: { fontSize: 16, fontUnit: 'px', defaultColor: '#000', align: 'center', option: 'bold' }
 * => { fontSize: '16px', color: '#000', textAlign: 'center', fontWeight: 'bold' }
 *
 * @param textStyle
 * @returns {{fontFamily: *, color: null, textAlign: *, lineHeight: null}|{}}
 */
function convertTextInlineStyle(textStyle) {
  if (!textStyle) { return {}; }

  const {
    fontSize,
    fontUnit,
    letterSpacing,
    letterSpacingUnit,
    lineSpacing,
    lineSpacingUnit,
    defaultColor,
    option,
    fontFamily,
    align,
    rotate,
  } = textStyle;

  const styles = {
    fontFamily: fontFamily?.value || null,
    color: defaultColor || null,
    textAlign: align?.value || null,
    transform: rotate?.value || null,
  };

  if (fontSize && Number(fontSize) > 0) {
    styles.fontSize = `${fontSize}${fontUnit?.value || 'px'}`;
  }

  if (lineSpacing && Number(lineSpacing) > 0) {
    styles.lineHeight = `${lineSpacing}${lineSpacingUnit?.value || 'px'}`;
  }

  if (letterSpacing && Number(letterSpacing) > 0) {
    styles.letterSpacing = `${letterSpacing}${letterSpacingUnit?.value || 'px'}`;
  }

  if (rotate) {
    styles.transform = `rotate(${rotate}deg)`;
  }

  if (Array.isArray(option)) {
    option.forEach(({ value }) => {
      Object.assign(styles, getTextStyleFormat(value));
    });
  } else {
    Object.assign(styles, getTextStyleFormat(option?.value));
  }
  return styles;
}

/**
 * Generate anchor ID for Element to scroll to.
 */
function makeAnchorId(text) {
  return `anchor_${text.replaceAll(' ', '_')}`;
}

function i18n(text) {
  console.log({ text });
  if (window.$nuxt) {
    return window.$nuxt.$t(text);
  }

  const i18nData = window.i18n;
  return i18nData ? i18nData[text] : text;
}

// import useSiteStore from '/ice/web-component/stores/site.store.js';

export default {
  description: '`Heading` Element as basic Headline. It is most used in Section such as Card Section',
  examples: [
    { docName: 'Heading h1', tagType: 'h1', headingStyle: { backgroundColor: 'rgba(73,204,144,.1)' } },
    {
      docName: 'Heading h2 and Text Align Center', tagType: 'h2', headingStyle: { backgroundColor: 'rgba(252,161,48,.1)' }, textStyle: { align: 'center' },
    },
    { docName: 'Heading h3', tagType: 'h3', headingStyle: { backgroundColor: 'rgba(97,175,254,.1)' } },
    { docName: 'Heading h4', tagType: 'h4', headingStyle: { backgroundColor: 'rgba(249,62,62,0.1)' } },
    { docName: 'Heading h5', tagType: 'h5', headingStyle: { backgroundColor: 'rgba(249,62,62,0.1)' } },
  ],
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
    propClassId: {
      type: [String, Number],
      default: null,
    },
    anchor: {
      type: [String, Object],
      default: null,
    },
    text: {
      type: String,
      default: '',

      doc: {
        default: 'Heading Element',
      },
    },
    tagType: {
      type: [String, Object],
      default: 'h1',

      doc: {
        component: 'Radio',
        list: [
          { label: 'h1', value: 'h1' },
          { label: 'h2', value: 'h2' },
          { label: 'h3', value: 'h3' },
          { label: 'h4', value: 'h4' },
          { label: 'h5', value: 'h5' },
        ],
      },
    },
    headingStyle: {
      type: Object,
      default: () => ({
        backgroundColor: '',
      }),

      doc: {
        options: {
          backgroundColor: {
            type: String,
          },
        },
      },
    },
    textStyle: {
      type: Object,
      default: () => ({
        fontFamily: '',
        fontSize: null,
        fontUnit: null,
        letterSpacing: null,
        letterSpacingUnit: null,
        lineSpacing: null,
        lineSpacingUnit: null,
        character: '',
        defaultColor: '',
        align: '',
        option: '',
      }),

      doc: {
        options: {
          fontFamily: {
            type: String,
          },
          fontSize: {
            type: Number,
          },
          fontUnit: {
            type: Object,
          },
          letterSpacing: {
            type: Number,
          },
          letterSpacingUnit: {
            type: Object,
          },
          lineSpacing: {
            type: Number,
          },
          lineSpacingUnit: {
            type: Object,
          },
          character: {
            type: Number,
          },
          defaultColor: {
            type: String,
          },
          align: {
            type: String,
            doc: {
              component: 'Radio',
              list: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
          },
        },
      },
    },
    layout: {
      type: Object,
      default: () => ({}),

      doc: {
        hidden: true,
      },
    },
    design: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    // const { $t } = useNuxtApp();t
    // const siteStore = useSiteStore();
    return {
      // siteStore,
      // i18n: $t,
    };
  },
  computed: {
    tag() {
      return this.tagType?.value || this.tagType || 'h1';
    },
    anchorValue() {
      const anchorLink = this.anchor?.value || '';
      return anchorLink && makeAnchorId(anchorLink);
    },
    themeStyles() {
      const design = this.design;
      const tag = this.tag;

      const unit = design[`${tag}Unit`];

      return {
        fontFamily: design[`${tag}Font`],
        color: design[`${tag}Color`],
        fontSize: (design[`${tag}FontSize`] + unit) || null,
        lineHeight: (design[`${tag}LineSpacing`] + unit) || null,
      };
    },
    inlineStyles() {
      const styles = convertTextInlineStyle(this.textStyle);
      styles.maxWidth = '100%';
      styles.backgroundColor = this.headingStyle?.backgroundColor || null;
      styles.width = this.layout?.width || null;
      styles.height = this.layout?.height || null;

      Object.entries(this.themeStyles).forEach(([k, v]) => {
        if (!styles[k] && v) {
          styles[k] = v;
        }
      });

      if (this.textStyle?.rotate) {
        /* It must be inline-block to be able to use transform: rotate */
        styles.display = 'inline-block';
      }

      return styles;
    },
    textStyleClass() {
      const classes = [];
      if (!this.textStyle) return classes;

      const {
        preset, fontSizeClass, lineSpacingClass, letterSpacingClass,
      } = this.textStyle;

      let className = preset?.value || {};
      if (className) classes.push(className);

      className = fontSizeClass?.value || {};
      if (className) classes.push(className);

      className = lineSpacingClass?.value || {};
      if (className) classes.push(className);

      className = letterSpacingClass?.value || {};
      if (className) classes.push(className);

      return classes;
    },
    displayText() {
      const text = i18n(this.text || '');

      const maxCharaters = (this.textStyle || {}).character;

      if (!maxCharaters) {
        return text;
      }

      const shouldElipsis = text.length > maxCharaters;

      return shouldElipsis ? `${text.substr(0, maxCharaters)}...` : text;
    },
    transformedHtml() {
      /* MET-2265: Inline elements cannot contain block level elements */
      const pattern = /^<(p|h1|h2|h3|h4|h5|h6)\b[^>]*>(.*?)<\/(p|h1|h2|h3|h4|h5|h6)>$/i;
      return this.displayText.replace(pattern, (_, content) => `<span style="width: 100%">${content}</span>`);
    },
  },
};
</script>
