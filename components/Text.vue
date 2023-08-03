<template>
  <div
    v-ice:prop-bind="'textProperties.text'"
    v-ice:prop-bind-id="textProperties.id"
    v-ice:prop-type="'text'"
    :style="inlineStyles"
    class="ice_text"
    :class="textStyleClass"
  >
    <slot v-if="$slots.default?.()?.length" />
    <div
      v-else
      v-ice:inline-editing="true"
      class="ice_text_content"
      v-html="text"
    />
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

function i18n(text) {
  console.log({ text });
  if (window.$nuxt) {
    return window.$nuxt.$t(text);
  }

  const i18nData = window.i18n;
  return i18nData ? i18nData[text] : text;
}


export default {
  description: '`Text` Element',
  examples: [
    {
      docName: 'Default Text',
      textProperties: {
        text: 'Enter text here',
        label: 'Enter text here',
        textStyle: {
          setting: {
            value: 'preset', label: 'Preset',
          },
        },
      },
    },
    {
      docName: 'Text with background color',
      textProperties: {
        backgroundColor: 'green', text: 'Enter text here', label: 'Enter text here',
      },
      textStyle: { setting: { value: 'preset', label: 'Preset' } },
    },
    {
      docName: 'Text color with background color',
      textProperties: {
        backgroundColor: 'purple', text: 'Enter text here', label: 'Enter text here',
      },
      textStyle: { setting: { value: 'customized', label: 'Customized' }, defaultColor: '#fff', option: { value: 'bold', label: '' } },
    },
  ],
  props: {
    textProperties: {
      type: Object,
      default: () => ({
        id: null,
        text: null,
        backgroundColor: '',
      }),
      doc: {
        options: {
          text: {
            type: String,
            default: 'Text Element',
          },
          backgroundColor: {
            default: 'purple',
            doc: {
              hidden: true,
            },
          },
          tagType: {
            type: String,
            doc: {
              component: 'Radio',
              list: [
                {
                  label: '<p>Paragraph</p>',
                  value: 'p',
                },
                {
                  label: '<span>Span</span>',
                  value: 'span',
                },
                {
                  label: '<div>Div</div>',
                  value: 'div',
                },
              ],
            },
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
        align: { value: '' },
        option: { value: '' },
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
            default: '#fff',
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
  },
  computed: {
    text() {
      const text = i18n(this.textProperties?.text || '');
      const textAlign = this.textStyle?.align?.value || 'left';
      return textAlign == 'justify'
        ? text.split('').map((val) => `<span>${val}</span>`).join('')
        : text;
    },
    inlineStyles() {
      const styles = convertTextInlineStyle(this.textStyle);
      styles.maxWidth = '100%';
      styles.backgroundColor = this.textProperties?.backgroundColor || null;
      return styles;
    },
    textStyleClass() {
      const classes = [];
      if (!this.textStyle) return classes;

      const {
        preset, fontSizeClass, lineSpacingClass, letterSpacingClass,
      } = this.textStyle;

      let className = preset?.value;
      if (className) classes.push(className);

      className = fontSizeClass?.value;
      if (className) classes.push(className);

      className = lineSpacingClass?.value;
      if (className) classes.push(className);

      className = letterSpacingClass?.value;
      if (className) classes.push(className);

      return classes;
    },
  },

  methods: {},
};
</script>
