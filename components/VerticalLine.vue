<template>
  <div
    v-ice:prop-type="'children'"
    class="ice_vertical_line"
  >
    <div :style="inlineStyles" />
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
    { docName: 'Basic Line', verticalLineStyle: { borderStyle: { color: 'purple', size: '5', type: 'solid' } } },
    {
      docName: 'Line Angle and Shadow',
      verticalLineStyle: {
        borderStyle: { color: 'green', size: '5', type: 'solid' },
        angleStyle: 5,
        shadowStyle: {
          color: '#280B4E', enable: true, x: 1, y: 1, blur: 1,
        },
      },
    },
    {
      docName: 'Line Style - Dashed',
      verticalLineStyle: {
        borderStyle: {
          color: '#9C27B0E6', size: '3', type: { value: 'dotted', label: 'Dotted' }, enable: true,
        },
        shadowStyle: {
          color: '#280B4E', enable: true, x: 1, y: 1, blur: 1,
        },
      },
    },
  ],
  props: {
    verticalLineStyle: {
      type: Object,
      default: () => ({
        shadowStyle: {},
        angleStyle: 0,
        borderStyle: {
          color: '#000',
          size: 2,
          type: 'solid',
        },
      }),
      doc: {
        options: {
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
                  default: 5,
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
          shadowStyle: {
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
          angleStyle: {
            type: Number,
          },
        },
      },
    },
  },

  computed: {
    inlineStyles() {
      const borderStyle = this.verticalLineStyle?.borderStyle || {};
      const shadowStyle = this.verticalLineStyle?.shadowStyle || {};
      const angleStyle = this.verticalLineStyle?.angleStyle || 0;
      const enableBorder = borderStyle.enable || null;
      const { color, size, type = {} } = borderStyle;
      const borderType = type?.value || 'solid';
      const borderLeft = enableBorder ? `${size}px ${borderType} ${color}` : '1px solid';

      return {
        height: '100%',
        position: 'absolute',
        left: 0,
        transform: `rotate(${angleStyle}deg)`,
        borderLeft,
        boxShadow: getBoxShadowStyle(shadowStyle),

        // need a small gap to be able to select component in BO
        padding: this.$$inEditor ? '5px 0' : null,
      };
    },
  },
};
</script>
