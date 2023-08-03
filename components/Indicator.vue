<template>
  <div
    class="ice_indicator"
    :style="cssVars"
  >
    <div
      class="ice_indicator_container success false"
      :style="{ color: cssVars.firstColor }">
      <div class="chart-wrapper">
        <div
          v-if="getBarType === 'progressBar'"
          class="chart-wrapper horizontal"
        >
          <p
            v-if="isShowProgress && getTextPosition === 'top'"
            :style="textInlineStyle">
            {{ getProgress }}% complete
          </p>
          <div class="horizontal-progress" :style="horizontalProgressStyle">
            <div :style="`width:${getProgress}%`">
              <span style="animation-duration: 2000ms" :style="{ background: cssVars.firstColor }" />
            </div>
          </div>
          <p
            v-if="isShowProgress && getTextPosition === 'bottom'"
            :style="textInlineStyle">
            {{ getProgress }}% complete
          </p>
        </div>

        <div
          v-else
          class="chart-wrapper circle"
        >
          <p
            v-if="isShowCircleProgressText && getTextPosition === 'top'"
            class="text-center"
            :style="textInlineStyle"
          >
            {{ $t(getCircleProgressText) }}
          </p>
          <figure class="circle-progress">
            <figcaption v-if="isShowProgress">
              <slot>
                <span :style="{ figcaptionStyle }">{{ getProgress }}% </span>
              </slot>
            </figcaption>
            <svg viewBox="0 0 33.83098862 33.83098862">
              <circle
                cx="16.91549431"
                cy="16.91549431"
                r="15.91549431"
                :stroke="cssVars.firstColor"
              />
              <circle
                :stroke-dasharray="`${100 - getProgress},100`"
                cx="16.91549431"
                cy="16.91549431"
                r="15.91549431"
                style="animation-duration: 2000ms"
                :stroke="cssVars.secondColor"
              />
            </svg>
          </figure>
          <p
            v-if="isShowCircleProgressText && getTextPosition === 'bottom'"
            class="text-center"
          >
            {{ getCircleProgressText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function getHexColor(colorObject) {
  if (typeof colorObject == 'string') { return colorObject; }
  const { value = '', label = '' } = colorObject || { value: '', label: '' };
  const hexColor = (label).match(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi);
  return hexColor ? hexColor[0] : value;
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
  examples: [
    { docName: 'Indicator Progress Bar' },
    { barStyle: { progressBar: 'green' }, docName: 'With Different Color' },
  ],
  props: {
    layoutStyle: {
      type: Object,
      default: () => ({}),
      doc: {
        options: {
          type: {
            type: String,
            default: 'progressBar',
            doc: {
              component: 'Select',
              list: [
                {
                  value: 'progressBar',
                  label: 'Horizontal Progress Bar',
                },
                {
                  value: 'circleBar',
                  label: 'Circle Bar',
                },
              ],
            },
          },
        },
      },
    },
    barStyle: {
      type: Object,
      default: () => ({
        progressBar: '#ed5565',
        mainBar: '#eee',
        shadowStyle: {},
      }),
      doc: {
        options: {
          setting: {
            type: String,
            default: 'customized',
            doc: {
              hidden: true,
            },
          },
          mainBar: {
            type: String,
            default: '#eee',
            description: 'Color for main bar',
          },
          progressBar: {
            type: String,
            default: '#ed5565',
            description: 'Color for progress bar',
          },
          progress: {
            type: Number,
            default: 70,
          },
        },
      },
    },
    textStyle: {
      type: Object,
      default: () => ({}),
      doc: {
        hidden: true,
      },
    },
  },
  computed: {
    getBorderColor() {
      return getHexColor(this.borderColor);
    },
    cssVars() {
      const firstColor = this.barStyle?.progressBar || '#ed5565';
      const secondColor = this.barStyle?.mainBar || '#eee';
      const unit = this.textStyle?.unit;
      const unitValue = unit?.value || 'px';
      const shadowStyle = this.barStyle?.shadowStyle || {};
      const position = this.textStyle?.position2 || 'center';

      return {
        firstColor: getHexColor(firstColor),
        secondColor: getHexColor(secondColor),
        color: this.textStyle?.defaultColor || 'inherit',
        textAlign: position?.value,
        boxShadow: getBoxShadowStyle(shadowStyle),
        fontFamily: this.textStyle?.fontFamily || 'inherit',
        fontSize: `${this.textStyle?.fontSize || 'inherit'}${unitValue}`,
      };
    },
    textInlineStyle() {
      return {
        fontFamily: this.cssVars.fontFamily,
        textAlign: this.cssVars.textAlign,
        fontSize: this.cssVars.fontSize,
      };
    },
    horizontalProgressStyle() {
      return {
        backgroundColor: this.cssVars.secondColor,
        boxShadow: this.cssVars.boxShadow,
      };
    },
    figcaptionStyle() {
      return {
        fontFamily: this.cssVars.fontFamily,
        color: this.cssVars.color,
      };
    },
    getBarType() {
      const barType = this.layoutStyle?.type || {};
      return barType?.value || 'progressBar';
    },
    isShowProgress() {
      return this.layoutStyle?.showProgress || true;
    },
    getProgress() {
      return this.barStyle?.progress || '70';
    },
    getTextPosition() {
      const position = this.textStyle?.position1 || {};
      return position?.value || 'bottom';
    },
    getCircleProgressText() {
      return this.layoutStyle?.text || 'Cicle Progess';
    },
    isShowCircleProgressText() {
      return this.layoutStyle?.showText || true;
    },
  },
  methods: {
    getColorClass() {
      const code = this.borderColor?.value;
      return code.replace('text', 'border');
    },
  },
};
</script>
