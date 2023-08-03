<template>
  <div
    class="ice_video"
    :class="[videoStyleClass]"
  >
    <video
      v-if="isVideoUploaded"
      id="ice-video"
      ref="video"
      playsinline
      :src="videoSource"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :controls="showControls"
      :poster="videoThumbnail"
      :style="inlineStyles"
      @pause="pause"
      @click="play"
    />
    <iframe
      v-else
      :src="videoUrl"
      :style="inlineStyles"
      allow="autoplay"
      title=""
    />
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

function isExternalUrl(value) {
  return value && ['http', '//', 'mailto'].some((i) => value.startsWith(i));
}

function getFileUrl(data, { $config }) {
  const fileUrl = $config ? $config.fileUrl : window.location.origin;
  const fileHost = $config ? $config.fileHost : window.location.host;
  if (!data) {
    return '';
  }

  if (data.image) {
    data = data.image;
  }

  let url = data.storePath || data.imageUrl || data;

  if (!url || typeof url !== 'string') { return ''; }

  if (url.includes(';base64')) {
    return url;
  }

  if (url.startsWith('http') && !url.startsWith(fileUrl)) {
    return url;
  }

  if (url.startsWith('http') || url.startsWith('/')) {
    if (url.lastIndexOf('http') != 0) {
      const apiDomain = `${fileUrl}/`;
      url = url.replace(apiDomain, '');
    }

    const extension = url.includes('.') && url.substring(url.indexOf('.') + 1);

    if (extension && extension.includes('/')) {
      url = url.substring(0, url.lastIndexOf('/'));
    }

    return url;
  }

  // const protocol = 'http://'
  const protocol = '//'; // use the current open web browser protocol

  const result = url.startsWith(fileHost) ? `${protocol}${url}` : `${fileUrl}/${url}`;

  return result;
}

function getBoxShadowStyle(styles, important) {
  if (styles == null || !styles?.enable) return null;

  const {
    x, y, blur, spread, color, sizeUnit,
  } = styles;

  const unit = sizeUnit && sizeUnit.value ? sizeUnit.value : 'px';

  return `${x}${unit} ${y}${unit} ${blur}${unit} ${spread}${unit} ${color} ${important ? '!important' : ''}`;
}

/*
  * Return a searching dom inside shadow root of web component
  *
  * @param {number} id The ID of web component.
  * @param {string} target The id or class of the searching element.
*/
function shadowDomSelector(id, target) {
  if (!document) return null;

  const wcElement = document.getElementById(id);
  if (!target) return wcElement;
  return wcElement && wcElement.shadowRoot?.querySelector(target);
}


export default {
  description: '`Video` Element',
  examples: [
    {
      docName: 'Default Video',
      videoProperties: {
        autoplay: false,
        description: 'hello world',
        displayControls: true,
        loop: false,
        muted: false,
        option: { value: 'upload', label: 'Upload' },
        videoThumbnail: null,
        videoUpload: null,
      },
      videoStyle: {
        borderStyle: { enable: false },
        shadowStyle: {
          blur: 1,
          color: null,
          enable: false,
          x: 1,
          y: 1,
        },
      },
    },
    {
      docName: 'Video with embeded URL',
      styles: {
        height: '400px',
      },
      videoProperties: {
        autoplay: false,
        description: 'hello world',
        displayControls: true,
        loop: false,
        muted: false,
        label: 'https://youtu.be/VIGbEik__0Q',
        videoUrl: 'https://youtu.be/VIGbEik__0Q',
        option: { value: 'url', label: 'Url' },
      },
      videoStyle: {
        borderStyle: { enable: false },
        shadowStyle: {
          blur: 1,
          color: null,
          enable: false,
          x: 1,
          y: 1,
        },
      },
    },
  ],
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
    videoStyle: {
      type: Object,
      default: () => ({}),
      doc: {
        hidden: true,
      },
    },
    videoProperties: {
      type: Object,
      default: () => ({}),
      doc: {
        options: {
          option: {
            type: String,
            default: 'url',
            doc: {
              hidden: true,
            },
          },
          videoUrl: {
            type: String,
            default: 'https://youtu.be/VIGbEik__0Q',
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
    styles: {
      type: Object,
      default: () => ({}),
      doc: {
        hidden: true,
      },
    },
  },
  data() {
    return {
      isPlaying: false,
    };
  },
  computed: {
    videoSource() {
      const videoUpload = this.videoProperties?.videoUpload;
      return getFileUrl(videoUpload, { $config: this.$config });
    },
    videoUploadOption() {
      const option = this.videoProperties?.option || {};
      return option?.value || 'url';
    },
    videoUrl() {
      const url = this.videoProperties?.videoUrl;
      if (isExternalUrl(url)) {
        return this.convertYoutubeEmbedUrl(url);
      }

      return getFileUrl(url, { $config: this.$config });
    },
    videoThumbnail() {
      const videoThumbnail = this.videoProperties?.videoThumbnail;
      return getFileUrl(videoThumbnail, { $config: this.$config }) || (!this.videoSource ? '/common/img/placeholder.png' : undefined);
    },
    videoStyleClass() {
      return {
        ice_video_no_padding: this.isVideoUploaded || (this.$$inEditor && this.layout?.height),
        ice_video_iframe: !this.isVideoUploaded,
        ice_video_playing: this.autoplay || this.isPlaying || !this.isVideoUploaded,
      };
    },
    loop() {
      return this.videoProperties?.loop;
    },
    muted() {
      return this.autoplay ? true : this.videoProperties?.muted;
    },
    showControls() {
      const displayControls = this.videoProperties?.displayControls;
      if (this.videoUploadOption === 'url') {
        return displayControls;
      }
      return this.isPlaying && displayControls;
    },
    autoplay() {
      return this.videoProperties?.autoplay;
    },
    inlineStyles() {
      const borderStyle = this.videoStyle?.borderStyle || {};
      const shadowStyle = this.videoStyle?.shadowStyle || {};
      const { color, size } = borderStyle;
      const enableBorder = borderStyle.enable || null;

      return buildInlineStyles(
        {
          border: enableBorder && `${size}px ${color}`,
          boxShadow: getBoxShadowStyle(shadowStyle),
        },
        this.styles,
        this.layout,
      );
    },
    isVideoUploaded() {
      return this.videoUploadOption === 'upload' || this.videoUrl === '';
    },
  },
  methods: {
    convertYoutubeEmbedUrl(url) {
      if (url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const ENCODE_LENGTH = 11;

        if (match && match[2].length === ENCODE_LENGTH) {
          let youtubeLink = `https://www.youtube.com/embed/${match[2]}?`;
          youtubeLink += `autoplay=${this.autoplay ? '1' : '0'}`;
          youtubeLink += `&mute=${this.muted || this.autoplay ? '1' : '0'}`;
          this.loop && (youtubeLink += `&playlist=${match[2]}&loop=1`);
          youtubeLink += `&controls=${this.showControls ? '1' : '0'}`;
          youtubeLink += '&showinfo=0&modestbranding=1&rel=0';

          return youtubeLink;
        }
        return url;
      }
      return '';
    },
    play(e) {
      e.preventDefault();
      e.stopPropagation();
      const video = window.$nuxt ? this.$refs.video : shadowDomSelector(this.id, '#ice-video');
      if (!this.isPlaying) {
        video.play();
      } else {
        video.pause();
      }
      this.isPlaying = !this.isPlaying;
    },
    pause(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.isPlaying) {
        /* To hide controls in case video paused without clicking on it */
        this.isPlaying = false;
      }
    },
  },
};
</script>
