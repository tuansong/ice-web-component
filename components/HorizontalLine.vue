<template>
  <div
    :style="inlineStyles"
    class="ice_horizontal_line"
  >
    <hr :style="borderStyle">
  </div>
</template>

<script>
function getFlexHorizontalAlign(align) {
  switch (align) {
    case 'left':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
  }
}

function getFlexVerticalAlign(align) {
  switch (align) {
    case 'top':
      return 'flex-start';
    case 'middle':
      return 'center';
    case 'bottom':
      return 'flex-end';
  }
}

function getPositionFixedHorizontal(value) {
  switch (value) {
    case 'left':
      return { left: '0', transform: '' };
    case 'center':
      return { left: '50%', transform: 'translateX(-50%)' };
    case 'right':
      return { left: '100%', translate: 'translateX(-100%)' };
  }
}

function getPositionFixedVertical(value) {
  switch (value) {
    case 'top':
      return { top: '0', transform: '' };
    case 'middle':
      return { top: '50%', transform: 'translateY(-50%)' };
    case 'bottom':
      return { top: '100%', transform: 'translateY(-100%)' };
  }
}

function getBlockHorizontalAlign(value) {
  switch (value) {
    case 'left':
      return { display: 'table', marginRight: 'auto' };
    case 'center':
      return { display: 'table', marginLeft: 'auto', marginRight: 'auto' };
    case 'right':
      return { display: 'table', marginLeft: 'auto' };
    case 'inline':
      return { display: 'inline-block', verticalAlign: 'middle' };
  }
}
/**
 * Some props name is not native CSS name e.g. horiztonalAlign, verticalAlign, ...
 *
 * This will convert to CSS Styles
 *
 * ICE Core:
 *
 * foCommonLayout
 * foFlexLayout
 * foFloatingLayout
 * foImageLayout
 */
function buildInlineStyles(...args) {
  const data = Object.assign({}, ...args);
  const result = {};

  for (const k in data) {
    const value = data[k]?.value || null;

    switch (k) {
      case 'flexHorizontalAlign':
        {
          const direction = data?.flexDirection?.value || 'column';

          if (direction == 'row') {
            result.justifyContent = getFlexHorizontalAlign(value);
          } else {
            result.alignItems = getFlexHorizontalAlign(value);
          }
        }
        break;
      case 'flexVerticalAlign':
        {
          const direction = data?.flexDirection?.value || 'column';
          if (direction == 'row') {
            result.alignItems = getFlexVerticalAlign(value);
          } else {
            result.justifyContent = getFlexVerticalAlign(value);
          }
        }
        break;
      case 'horizontalPosition':
        {
          const position = data?.position?.value || '';

          if (position == 'fixed') {
            const { left, transform } = getPositionFixedHorizontal(value);
            result.left = left;
            result.transform = `${(result.transform || '')} ${transform}`;
          }
        }
        break;
      case 'verticalPosition':
        {
          const position = data?.position?.value || '';

          if (position == 'fixed') {
            const { top, transform } = getPositionFixedVertical(value);
            result.top = top;
            result.transform = `${(result.transform || '')} ${transform}`;
          }
        }
        break;
      case 'blockHorizontalAlign':
        {
          const styles = getBlockHorizontalAlign(value);
          Object.assign(result, styles);
        }
        break;
      default:
        result[k] = value;
    }
  }

  return Object.entries(result).reduce((r, [k, v]) => {
    if (v != null) {
      r[k] = v;
    }

    return r;
  }, {});
}

function getBoxShadowStyle(styles, important) {
  if (styles == null || !styles?.enable) return null;

  const {
    x, y, blur, spread, color, sizeUnit,
  } = styles;

  const unit = sizeUnit && sizeUnit.value ? sizeUnit.value : 'px';

  return `${x}${unit} ${y}${unit} ${blur}${unit} ${spread}${unit} ${color} ${important ? '!important' : ''}`;
}


export default {
  description: '`HorizontalLine` Element',
  examples: [
    { docName: 'Basic Line', horizontalLineStyle: { borderStyle: { color: 'purple', size: '5px', type: 'solid' } } },
    {
      docName: 'Line Angle and Shadow',
      horizontalLineStyle: {
        borderStyle: { color: 'green', size: '5px', type: 'solid' },
        angleStyle: 3,
        shadowStyle: {
          color: '#280B4E', enable: true, x: 1, y: 1, blur: 1,
        },
      },
    },
    {
      docName: 'Line Style - Dot',
      horizontalLineStyle: {
        borderStyle: {
          color: 'red', size: '15px', type: 'dotted', enable: true,
        },
        shadowStyle: {
          color: '#280B4E', enable: true, x: 1, y: 1, blur: 1,
        },
      },
    },
  ],
  props: {
    horizontalLineStyle: {
      type: Object,
      default: () => ({
        borderStyle: {
          color: '',
          size: 1,
          type: 'solid',
        },
        shadowStyle: {},
        angleStyle: 0,
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
    alignment: {
      type: Object,
      default: () => ({
        blockHorizontalAlign: 'center',
      }),
      doc: {
        hidden: true,
      },
    },
    styles: {
      type: Object,
      default: () => ({
        width: '100%',
        height: null,
      }),
      doc: {
        hidden: true,
      },
    },
  },

  computed: {
    borderStyle() {
      const borderStyle = this.horizontalLineStyle?.borderStyle || {};

      const { size, type } = borderStyle;
      const borderColor = borderStyle.color || null;
      const borderType = type?.value || 'solid';

      const shadowStyle = this.horizontalLineStyle?.shadowStyle || {};

      return {
        borderTopWidth: (size || null) && `${size}px`,
        borderColor: borderColor || null,
        borderStyle: borderType || null,
        boxShadow: getBoxShadowStyle(shadowStyle),
      };
    },
    inlineStyles() {
      const angleStyle = this.horizontalLineStyle?.angleStyle || 0;

      return {
        transform: `rotate(${angleStyle}deg)`,
        ...buildInlineStyles(this.styles, this.alignment),
        width: this.styles.width || '100%',

        // need a small gap to be able to select component in BO
        padding: this.$$inEditor ? '5px 0' : null,
      };
    },
  },
};
</script>
