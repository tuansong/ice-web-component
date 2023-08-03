<template>
  <div
    v-ice:prop-type="'children'"
    :style="inlineStyles"
    class="ice_rectangle"
    :class="{ no_content: !hasSlot }"
  >
    <slot />
  </div>
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


export default {
  description: '`Rectangle` Element',
  examples: [
    {
      docName: 'Basic Rectangle',
      rectangleStyle: {
        backgroundColor: '#EEEEEE',
        borderStyle: { enable: false },
        radiusStyle: 1,
        shadowStyle: {
          enable: false, color: null, x: 1, y: 1, blur: 1,
        },
      },
    },
    {
      docName: 'Rectangle Dotted Type',
      rectangleStyle: {
        backgroundColor: 'purple',
        borderStyle: {
          enable: true, color: '#FFEB3BF2', size: null, type: { value: 'dotted', label: 'Dotted' },
        },
        radiusStyle: 10,
        shadowStyle: {
          enable: true, color: '#2A1055E6', x: 1, y: 1, blur: 1,
        },
      },
    },
    {
      docName: 'Rectangle Ridge Type',
      rectangleStyle: {
        backgroundColor: 'green',
        borderStyle: {
          enable: true, color: '#FFEB3BF2', size: null, type: { value: 'ridge', label: 'Ridge' },
        },
        radiusStyle: 10,
        shadowStyle: {
          enable: true, color: '#2A1055E6', x: 1, y: 1, blur: 1,
        },
      },
    },
  ],
  props: {
    rectangleStyle: {
      type: Object,
      default: () => ({
        backgroundColor: '#eee',
        borderStyle: {
          color: '#4A4A4A',
          size: '1',
          type: 'solid',
        },
        shadowStyle: {
          enable: false,
          color: '#eee',
          x: 1,
          y: 1,
          blur: 1,
        },
      }),
      doc: {
        options: {
          backgroundColor: {
            type: String,
            default: '#EEEEEE',
          },
          borderStyle: {
            type: Object,
            doc: {
              options: {
                enable: {
                  type: Boolean,
                },
                color: {
                  default: 'purple',
                  doc: {
                    hidden: true,
                  },
                },
                size: {
                  type: Number,
                },
                type: {
                  type: Number,
                  doc: {
                    component: 'Radio',
                    list: [
                      { value: 'solid', label: 'Solid' },
                      { value: 'dotted', label: 'Dotted' },
                      { value: 'dashed', label: 'Dashed' },
                      { value: 'double', label: 'Double' },
                      { value: 'groove', label: 'Groove' },
                      { value: 'ridge', label: 'Ridge' },
                      { value: 'inset', label: 'Inset' },
                      { value: 'outset', label: 'Outset' },
                    ],
                  },
                },
              },
            },
          },

          radiusStyle: {
            type: Number,
          },

          shadowStyle: {
            type: Object,
            doc: {
              options: {
                enable: {
                  type: Boolean,
                },
                color: {
                  doc: {
                    hidden: true,
                  },
                },
                x: {
                  type: Number,
                },
                y: {
                  type: Number,
                },
                blur: {
                  type: Number,
                },
              },
            },
          },
        },
      },
    },
    styles: {
      type: Object,
      default: () => ({
        height: '50px',
      }),
      doc: {
        hidden: true,
      },
    },
  },
  data() {
    return {
      hasSlots: false,
    };
  },
  computed: {
    inlineStyles() {
      const backgroundColor = this.rectangleStyle?.backgroundColor || null;
      const borderStyle = this.rectangleStyle?.borderStyle || {};
      const shadowStyle = this.rectangleStyle?.shadowStyle || {};
      const radiusStyle = this.rectangleStyle?.radiusStyle || 0;
      const { color, size, type = {} } = borderStyle;
      const enableBorder = borderStyle.enable || false;
      const borderType = type?.value || 'solid';

      const extendStyles = {};
      enableBorder
        && (extendStyles.border = `${size}px ${borderType} ${color} !important`);

      return {
        ...this.styles,
        minHeight: this.styles.height != null ? this.styles.height : null,
        backgroundColor,
        borderRadius: `${radiusStyle}px`,
        boxShadow: getBoxShadowStyle(shadowStyle),
        ...extendStyles,
      };
    },
    hasSlot() {
      return this.$slots.default && this.$slots.default().length > 0;
    },
  },
};
</script>
