<template>
  <div
    v-ice:prop-bind="'image'"
    v-ice:prop-type="'image'"
    :style="divStyle"
    class="ice_image"
  >
    <slot />
    <img
      v-if="!imgSrc"
      :src="defaultImage"
      class="ice_image_el"
      :style="placeholderStyles"
      :alt="imgAlt"
      @load="onImageLoad($event)"
      @error="onImageError($event)"
    >
    <img
      v-else-if="!hrefLink"
      :src="imgSrc"
      :class="imgClass"
      :style="imgStyle"
      :alt="imgAlt"
      @click.prevent="openModal()"
      @load="onImageLoad($event)"
      @error="onImageError($event)"
    >
    <img
      v-else-if="isRoutePush"
      :src="imgSrc"
      :class="imgClass"
      :style="imgStyle"
      :alt="imgAlt"
      @click.prevent="routePush()"
      @load="onImageLoad($event)"
      @error="onImageError($event)"
    >
    <a
      v-else
      :href="hrefLink"
      :target="hrefLinkTarget"
    >
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :class="imgClass"
        :style="imgStyle"
        :alt="imgAlt"
        @load="onImageLoad($event)"
        @error="onImageError($event)"
      >
    </a>
  </div>
</template>

<script>
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

// Temporary import to support web component MET-2174
function getBoPageUrl(page, { $config }) {
  if (page && !page.startsWith('/')) {
    return `${$config.backOfficeUrl}/${page.trim()}`;
  }

  return $config.backOfficeUrl + page.trim();
}

function getBoSiteUrl(page, {
  $config,
} = {}) {
  let url = getBoPageUrl(page, { $config });
  if (!process.client) return url;

  const reqHost = window.location.hostname;
  if (reqHost && $config.baseSiteHost != 'localhost') {
    let host = reqHost;
    const rh = reqHost.split('.');
    if (rh.length > 2) {
      if (rh[rh.length - 1].length == 3) {
        host = `${rh[rh.length - 2]}.${rh[rh.length - 1]}`;
      } else if (rh[rh.length - 1].length == 2 && rh[rh.length - 2].length == 2) {
        host = `${rh[rh.length - 3]}.${rh[rh.length - 2]}.${rh[rh.length - 1]}`;
      } else {
        host = `${rh[rh.length - 2]}.${rh[rh.length - 1]}`;
      }
    }
    if ($config.baseSiteHost != host) {
      url = url.replace($config.baseSiteHost, host);
    }
  }
  return url;
}

// Temporary import to support web component MET-2174
// import useIceStore from '~/stores/ice.store';
// Temporary comment store

function isExternalUrl(value) {
  return value && ['http', '//', 'mailto'].some((i) => value.startsWith(i));
}

function getPageUrl(page, {
  siteId,
  $route,
  $config,
} = {}, store) {
  if (isExternalUrl(page)) { return page; } // if external link return link

  const iceStore = store || {};

  page = page && !page.startsWith('/') ? `/${page}`.trim() : page.trim(); // check '/' exist or not

  let [urlPath, urlQuery] = page.split('?');
  const urlParams = new URLSearchParams(urlQuery);

  for (const k in $route.query) {
    if (!urlParams.has(k)) {
      urlParams.set(k, $route.query[k]);
    }
  }

  const implicitSiteId = $config.implicitSiteId;
  const segments = urlPath.split('/').filter((i) => i);
  const firstSegment = segments[0] || '';

  if (firstSegment && implicitSiteId != siteId && firstSegment.toLowerCase() != implicitSiteId) {
    const listSiteIds = iceStore.listSiteIds;
    if (listSiteIds && !listSiteIds.includes(firstSegment)) {
      segments.unshift(siteId);
    }
  }

  urlPath = `/${segments.join('/')}`;

  const query = urlParams.toString();

  const url = urlPath + (query ? `?${query}` : '');

  return url;
}

function makeAnchorId(text) {
  return `anchor_${text.replaceAll(' ', '_')}`;
}

function linkActionGetLinkType(linkProp) {
  const linkType = linkProp?.linkType;
  return linkType?.value || undefined;
}

export function linkActionGetLinkTarget(linkProp, $isApp) {
  const linkTarget = linkProp?.linkTarget;
  const targetValue = linkTarget?.value || undefined;
  return $isApp ? '_self' : targetValue;
}

export function linkActionGetLinkUrl(linkProp, {
  siteId,
  $route,
  $config,
}) {
  const linkType = linkActionGetLinkType(linkProp);
  const linkValue = linkProp?.linkValue || '';

  switch (linkType) {
    case 'anchor': {
      const targetAnchor = linkProp?.targetAnchor;
      return makeAnchorId(targetAnchor?.value || ''); }
    case 'email':
      return `mailto:${linkValue}`;
    case 'phone':
      return `tel:${linkValue}`;
    case 'bo':
      return getBoSiteUrl(linkValue, { config });
    case 'landingPage':
    case 'profilePage':
    case 'surveyPage': {
      const pageUrl = linkProp?.page?.item?.url;
      const urlValue = pageUrl?.value || '';
      return getPageUrl(urlValue, {
        siteId,
        $route,
        $config,
      }); }
    // Deprecated, only support for old version
    case 'page': {
      const page = linkProp?.page?.value || '';
      return getPageUrl(page, {
        siteId,
        $route,
        $config,
      }); }
    case 'url':
    case 'document':
      return getPageUrl(linkValue, {
        siteId,
        $route,
        $config,
      });
    case 'none':
      return `${'javascript'}:void()`;
    default:
      return '';
  }
}
export function linkActionHasLinkSetting(linkProp) {
  const linkType = linkActionGetLinkType(linkProp);
  return linkType && linkType !== 'none';
}
export function trackingLinkClick(linkProp) {
  if (!linkProp?.page) return;

  this.$axios.request({
    url: '/svc/service/click',
    params: {
      id: linkProp?.id,
      page: linkActionGetLinkUrl(linkProp),
    },
  });
}
export function executeRedirectLink(linkProp, callback) {
  if (this.$inEditor && !this.$inPreview) return;

  trackingLinkClick(linkProp);
  const url = linkActionGetLinkUrl(linkProp);
  if (!url) return;

  const linkTarget = linkActionGetLinkTarget(linkProp);
  window.open(url, linkTarget);

  if (callback) callback();
}


export default {
  examples: [
    {
      image: '/common/img/background-01.jpeg',
      imageMobile: '/common/img/background-02.png',
      imageAction: {
        link: {
          linkType: 'page',
          linkTarget: '_blank',
          linkValue: 'https://dev.justten.io/ice/',
        },
      },
      alt: 'ICE Image supports different image for mobile and desktop and open link action',
      docName: 'Support different image for mobile and desktop and open link action',
    },
    {
      docName: 'Default placeholder when there is no image provided',
    },
    {
      image: '/common/img/not_exist_image.png',
      alt: 'ICE Image Error Placeholder',
      docName: 'Default error image when it is failed to display',
    },
  ],
  props: {
    image: {
      type: [String, Object],
      default: '',
      doc: {
        type: String,
        default: '/common/img/background-01.jpeg',
      },
    },
    imageMobile: {
      type: [String, Object],
      default: '',
      doc: {
        hidden: true,
      },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imageMobileUrl: {
      type: String,
      default: '',
    },
    opacity: {
      type: [Number, Object],
      default: () => ({
        opacity: 10,
      }),
    },
    alt: {
      type: String,
      default: '',
    },
    imageStyle: {
      type: Object,
      default: () => ({
        borderStyle: {
          enable: false,
          type: {
            value: 'solid',
          },
        },
        shadowStyle: {},
        grow: false,
        backgroundColor: '',
        objectFit: 'none',
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
                  type: String,
                },
                size: {
                  type: Number,
                },
                type: {
                  type: String,
                  doc: {
                    component: 'Select',
                    list: [{ value: 'solid', label: 'Solid' },
                      { value: 'dotted', label: 'Dotted' },
                      { value: 'dashed', label: 'Dashed' },
                      { value: 'double', label: 'Double' },
                      { value: 'groove', label: 'Groove' },
                      { value: 'ridge', label: 'Ridge' },
                      { value: 'inset', label: 'Inset' },
                      { value: 'outset', label: 'Outset' }],
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
                  type: String,
                },
                blur: {
                  type: Number,
                },
                x: {
                  type: Number,
                },
                y: {
                  type: Number,
                },
              },
            },
          },
          radius: {
            type: Number,
          },
        },
      },
    },
    imageAction: {
      type: Object,
      default: () => ({
        enlargerView: false,
      }),
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
    imageLayout: {
      type: Object,
      default: () => ({}),
      doc: {
        hidden: true,
      },
    },
    useFullWidth: {
      type: Boolean,
      default: false,
    },
    appConfig: {
      type: Object,
      default: () => ({}),
    },
    store: {
      type: Object,
      default: () => ({}),
    },
    link: {
      type: Object,
      default: null,
      doc: {
        hidden: true,
      },
    },
  },
  emits: ['willReady', 'didReady'],
  data() {
    return {
      errorSrc: '',
    };
  },

  computed: {
    config() {
      return this.appConfig?.$config || this.$config;
    },
    route() {
      return this.appConfig?.$route || this.$route;
    },
    siteId() {
      return this.appConfig?.siteId || this.$$siteId;
    },
    defaultImage() {
      return this.config.image_default;
    },
    imgAlt() {
      return this.alt;
    },
    imgSrc() {
      if (this.errorSrc) {
        return this.errorSrc;
      }

      if (this.$$isMobile || !(this.image || this.imageUrl)) {
        if (this.imageMobile) {
          return getFileUrl(this.imageMobile, { $config: this.config });
        } if (this.imageMobileUrl) {
          return this.imageMobileUrl;
        }
      }

      return getFileUrl(this.image, { $config: this.config }) || this.imageUrl;
    },
    holderStyle() {
      return { position: 'absolute' };
    },
    imgClass() {
      const classes = [
        {
          'cursor-pointer': this.isEnlargerView,
          ice_image_full_width: this.useFullWidth,
        },
      ];

      const grow = this.imageStyle?.grow;

      if (grow) {
        classes.push('ice_image_grow');
      }

      return classes;
    },
    imgAction() {
      return this.imageAction?.link;
    },
    placeholderStyles() {
      return {
        width: this.layout?.width,
        height: this.layout?.height,
        objectFit: 'none',
        backgroundColor: '#D4D4D4',
      };
    },
    imgStyle() {
      const opacity = this.opacity?.opacity || this.opacity || 10;
      const borderStyle = this.imageStyle?.borderStyle || {};
      const enableBorder = borderStyle.enable || false;
      const shadowStyle = this.imageStyle?.shadowStyle || {};
      const borderRadius = this.imageStyle?.radius || null;
      const background = this.imageStyle?.backgroundColor || null;
      const borderType = borderStyle?.type?.value || 'solid';
      const width = this.layout?.width;
      const height = this.layout?.height;

      const { color, size } = borderStyle;

      const border = enableBorder ? `${size}px ${borderType} ${color} !important` : null;

      return {
        opacity: opacity / 10,
        borderRadius: borderRadius != null ? `${borderRadius}px` : null,
        background,
        width,
        height,
        border,
        boxShadow: getBoxShadowStyle(shadowStyle),
        display: 'inline-block',
      };
    },
    divStyle() {
      const styles = this.imageLayout;
      const textAlign = styles?.textAlign;
      const display = styles?.display;
      const horizontalAlign = textAlign?.value || 'center';
      const displayMethod = display?.value || 'block';

      return {
        display: displayMethod,
        textAlign: horizontalAlign,
        position: 'relative',
      };
    },
    hrefLink() {
      const test = linkActionGetLinkUrl(this.imgAction, this.appConfig);
      return test;
    },
    hrefLinkTarget() {
      return linkActionGetLinkTarget(this.imgAction, this.$$isApp);
    },
    isEnlargerView() {
      return this.imageAction?.enlargerView || false;
    },
    isRoutePush() {
      return linkActionGetLinkType(this.imgAction) === 'page' && (!this.hrefLinkTarget || !this.hrefLinkTarget === '_self');
    },
  },
  mounted() {
    this.$emit('willReady');
  },
  created() {
    this.$emit('willReady');
  },
  methods: {
    onImageLoad(e) {
      const el = e.target || e.path[0];

      if (el && el.naturalHeight <= 1 && el.naturalHeight <= 1) {
        this.errorSrc = this.config.image_error;
      }

      this.$emit('didReady');
    },
    onImageError(e) {
      const el = e.target || e.path[0];

      if (el && el.naturalHeight <= 1 && el.naturalHeight <= 1) {
        this.errorSrc = this.config.image_error;
      }

      this.$emit('didReady');
    },
    // Not support web component yet
    openModal() {
      if (!this.isEnlargerView) {
        return;
      }

      this.$modal.show({
        component: 'Reg-DefaultImagePreviewModal',
        props: {
          src: this.imgSrc,
        },
        wrapperProps: {
          noStyle: true,
          clickCloseOutside: true,
        },
      });
    },
    routePush() {
      this.$router.push({
        path: getPageUrl(
          this.hrefLink,
          {
            siteId: unref(this.siteId),
            $route: this.route,
            $config: this.config,
            store: this.store,
          },
        ),
      });
    },
  },
};
</script>
