import { i as __toESM, t as __commonJSMin } from '../_runtime.mjs';
import { t as require_dist } from './cookie.mjs';
import {
  _ as OptionalKind,
  a as TransformDecodeError,
  c as Errors,
  d as Unsafe,
  f as Has,
  g as Kind$1,
  h as Set$2,
  i as Decode,
  l as Check,
  m as Has$1,
  n as Encode,
  o as Clean,
  p as Set$1,
  r as Default,
  s as Create,
  t as TypeCompiler,
  u as Type,
  v as TransformKind,
  y as TypeBoxError,
} from './sinclair__typebox.mjs';
//#region ../../node_modules/.pnpm/memoirist@0.4.0/node_modules/memoirist/dist/index.mjs
var createNode = (part, inert) => {
  const inertMap = inert?.length ? {} : null;
  if (inertMap) for (const child of inert) inertMap[child.part.charCodeAt(0)] = child;
  return {
    part,
    store: null,
    inert: inertMap,
    params: null,
    wildcardStore: null,
  };
};
var cloneNode = (node, part) => ({
  ...node,
  part,
});
var createParamNode = (name) => ({
  name,
  store: null,
  inert: null,
});
var Memoirist = class _Memoirist {
  constructor(config = {}) {
    this.config = config;
    if (config.lazy) this.find = this.lazyFind;
    if (config.onParam && !Array.isArray(config.onParam))
      this.config.onParam = [this.config.onParam];
  }
  root = {};
  history = [];
  deferred = [];
  static regex = {
    static: /:.+?(?=\/|$)/,
    params: /:.+?(?=\/|$)/g,
    optionalParams: /(\/:\w+\?)/g,
  };
  lazyFind = (method, url) => {
    if (!this.config.lazy) return this.find;
    this.build();
    return this.find(method, url);
  };
  build() {
    if (!this.config.lazy) return;
    for (const [method, path, store] of this.deferred)
      this.add(method, path, store, {
        lazy: false,
        ignoreHistory: true,
      });
    this.deferred = [];
    this.find = (method, url) => {
      const root = this.root[method];
      if (!root) return null;
      return matchRoute(url, url.length, root, 0, this.config.onParam);
    };
  }
  add(
    method,
    path,
    store,
    { ignoreError = false, ignoreHistory = false, lazy = this.config.lazy } = {},
  ) {
    if (lazy) {
      this.find = this.lazyFind;
      this.deferred.push([method, path, store]);
      return store;
    }
    if (typeof path !== 'string') throw new TypeError('Route path must be a string');
    if (path === '') path = '/';
    else if (path[0] !== '/') path = `/${path}`;
    const isWildcard = path[path.length - 1] === '*';
    const optionalParams = path.match(_Memoirist.regex.optionalParams);
    if (optionalParams) {
      const originalPath = path.replaceAll('?', '');
      this.add(method, originalPath, store, {
        ignoreError,
        ignoreHistory,
        lazy,
      });
      for (let i = 0; i < optionalParams.length; i++) {
        let newPath = path.replace(optionalParams[i], '');
        this.add(method, newPath, store, {
          ignoreError: true,
          ignoreHistory,
          lazy,
        });
      }
      return store;
    }
    if (optionalParams) path = path.replaceAll('?', '');
    if (this.history.find(([m, p, s]) => m === method && p === path)) return store;
    if (isWildcard || (optionalParams && path.charCodeAt(path.length - 1) === 63))
      path = path.slice(0, -1);
    if (!ignoreHistory) this.history.push([method, path, store]);
    const inertParts = path.split(_Memoirist.regex.static);
    const paramParts = path.match(_Memoirist.regex.params) || [];
    if (inertParts[inertParts.length - 1] === '') inertParts.pop();
    let node;
    if (!this.root[method]) node = this.root[method] = createNode('/');
    else node = this.root[method];
    let paramPartsIndex = 0;
    for (let i = 0; i < inertParts.length; ++i) {
      let part = inertParts[i];
      if (i > 0) {
        const param = paramParts[paramPartsIndex++].slice(1);
        if (node.params === null) node.params = createParamNode(param);
        else if (node.params.name !== param)
          if (ignoreError) return store;
          else
            throw new Error(
              `Cannot create route "${path}" with parameter "${param}" because a route already exists with a different parameter name ("${node.params.name}") in the same location`,
            );
        const params = node.params;
        if (params.inert === null) {
          node = params.inert = createNode(part);
          continue;
        }
        node = params.inert;
      }
      for (let j = 0; ; ) {
        if (j === part.length) {
          if (j < node.part.length) {
            const childNode = cloneNode(node, node.part.slice(j));
            Object.assign(node, createNode(part, [childNode]));
          }
          break;
        }
        if (j === node.part.length) {
          if (node.inert === null) node.inert = {};
          const inert = node.inert[part.charCodeAt(j)];
          if (inert) {
            node = inert;
            part = part.slice(j);
            j = 0;
            continue;
          }
          const childNode = createNode(part.slice(j));
          node.inert[part.charCodeAt(j)] = childNode;
          node = childNode;
          break;
        }
        if (part[j] !== node.part[j]) {
          const existingChild = cloneNode(node, node.part.slice(j));
          const newChild = createNode(part.slice(j));
          Object.assign(node, createNode(node.part.slice(0, j), [existingChild, newChild]));
          node = newChild;
          break;
        }
        ++j;
      }
    }
    if (paramPartsIndex < paramParts.length) {
      const name = paramParts[paramPartsIndex].slice(1);
      if (node.params === null) node.params = createParamNode(name);
      else if (node.params.name !== name)
        if (ignoreError) return store;
        else
          throw new Error(
            `Cannot create route "${path}" with parameter "${name}" because a route already exists with a different parameter name ("${node.params.name}") in the same location`,
          );
      if (node.params.store === null) node.params.store = store;
      return node.params.store;
    }
    if (isWildcard) {
      if (node.wildcardStore === null) node.wildcardStore = store;
      return node.wildcardStore;
    }
    if (node.store === null) node.store = store;
    return node.store;
  }
  find(method, url) {
    const root = this.root[method];
    if (!root) return null;
    return matchRoute(url, url.length, root, 0, this.config.onParam);
  }
};
var matchRoute = (url, urlLength, node, startIndex, onParam) => {
  const part = node.part;
  const length = part.length;
  const endIndex = startIndex + length;
  if (length > 1) {
    if (endIndex > urlLength) return null;
    if (length < 15) {
      for (let i = 1, j = startIndex + 1; i < length; ++i, ++j)
        if (part.charCodeAt(i) !== url.charCodeAt(j)) return null;
    } else if (url.slice(startIndex, endIndex) !== part) return null;
  }
  if (endIndex === urlLength) {
    if (node.store !== null)
      return {
        store: node.store,
        params: {},
      };
    if (node.wildcardStore !== null)
      return {
        store: node.wildcardStore,
        params: { '*': '' },
      };
    return null;
  }
  if (node.inert !== null) {
    const inert = node.inert[url.charCodeAt(endIndex)];
    if (inert !== void 0) {
      const route = matchRoute(url, urlLength, inert, endIndex, onParam);
      if (route !== null) return route;
    }
  }
  if (node.params !== null) {
    const { store, name, inert } = node.params;
    const slashIndex = url.indexOf('/', endIndex);
    if (slashIndex !== endIndex) {
      if (slashIndex === -1 || slashIndex >= urlLength) {
        if (store !== null) {
          const params = {};
          params[name] = url.substring(endIndex, urlLength);
          if (onParam)
            for (let i = 0; i < onParam.length; i++) {
              let temp = onParam[i](params[name], name);
              if (temp !== void 0) params[name] = temp;
            }
          return {
            store,
            params,
          };
        }
      } else if (inert !== null) {
        const route = matchRoute(url, urlLength, inert, slashIndex, onParam);
        if (route !== null) {
          route.params[name] = url.substring(endIndex, slashIndex);
          if (onParam)
            for (let i = 0; i < onParam.length; i++) {
              let temp = onParam[i](route.params[name], name);
              if (temp !== void 0) route.params[name] = temp;
            }
          return route;
        }
      }
    }
  }
  if (node.wildcardStore !== null)
    return {
      store: node.wildcardStore,
      params: { '*': url.substring(endIndex, urlLength) },
    };
  return null;
};
//#endregion
//#region ../../node_modules/.pnpm/fast-decode-uri-component@1.0.1/node_modules/fast-decode-uri-component/index.js
var require_fast_decode_uri_component = /* @__PURE__ */ __commonJSMin((exports, module) => {
    var UTF8_ACCEPT = 12;
    var UTF8_REJECT = 0;
    var UTF8_DATA = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 10, 9, 9, 9, 11, 4, 4, 4,
      4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 24, 36, 48, 60,
      72, 84, 96, 0, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24,
      24, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 48, 48, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127,
      63, 63, 63, 0, 31, 15, 15, 15, 7, 7, 7,
    ];
    function decodeURIComponent(uri) {
      var percentPosition = uri.indexOf('%');
      if (percentPosition === -1) return uri;
      var length = uri.length;
      var decoded = '';
      var last = 0;
      var codepoint = 0;
      var startOfOctets = percentPosition;
      var state = UTF8_ACCEPT;
      while (percentPosition > -1 && percentPosition < length) {
        var byte =
          hexCodeToInt(uri[percentPosition + 1], 4) | hexCodeToInt(uri[percentPosition + 2], 0);
        var type = UTF8_DATA[byte];
        state = UTF8_DATA[256 + state + type];
        codepoint = (codepoint << 6) | (byte & UTF8_DATA[364 + type]);
        if (state === UTF8_ACCEPT) {
          decoded += uri.slice(last, startOfOctets);
          decoded +=
            codepoint <= 65535
              ? String.fromCharCode(codepoint)
              : String.fromCharCode(55232 + (codepoint >> 10), 56320 + (codepoint & 1023));
          codepoint = 0;
          last = percentPosition + 3;
          percentPosition = startOfOctets = uri.indexOf('%', last);
        } else if (state === UTF8_REJECT) return null;
        else {
          percentPosition += 3;
          if (percentPosition < length && uri.charCodeAt(percentPosition) === 37) continue;
          return null;
        }
      }
      return decoded + uri.slice(last);
    }
    var HEX = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15,
    };
    function hexCodeToInt(c, shift) {
      var i = HEX[c];
      return i === void 0 ? 255 : i << shift;
    }
    module.exports = decodeURIComponent;
  }),
  isBun = typeof Bun < 'u';
function isCloudflareWorker() {
  try {
    if ((typeof caches < 'u' && typeof caches.default < 'u') || typeof WebSocketPair < 'u')
      return !0;
  } catch {
    return !1;
  }
  return !1;
}
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/universal/file.mjs
var mime = {
    aac: 'audio/aac',
    abw: 'application/x-abiword',
    ai: 'application/postscript',
    arc: 'application/octet-stream',
    avi: 'video/x-msvideo',
    azw: 'application/vnd.amazon.ebook',
    bin: 'application/octet-stream',
    bz: 'application/x-bzip',
    bz2: 'application/x-bzip2',
    csh: 'application/x-csh',
    css: 'text/css',
    csv: 'text/csv',
    doc: 'application/msword',
    dll: 'application/octet-stream',
    eot: 'application/vnd.ms-fontobject',
    epub: 'application/epub+zip',
    gif: 'image/gif',
    htm: 'text/html',
    html: 'text/html',
    ico: 'image/x-icon',
    ics: 'text/calendar',
    jar: 'application/java-archive',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'application/javascript',
    json: 'application/json',
    mid: 'audio/midi',
    midi: 'audio/midi',
    mp2: 'audio/mpeg',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    mpa: 'video/mpeg',
    mpe: 'video/mpeg',
    mpeg: 'video/mpeg',
    mpkg: 'application/vnd.apple.installer+xml',
    odp: 'application/vnd.oasis.opendocument.presentation',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odt: 'application/vnd.oasis.opendocument.text',
    oga: 'audio/ogg',
    ogv: 'video/ogg',
    ogx: 'application/ogg',
    otf: 'font/otf',
    png: 'image/png',
    pdf: 'application/pdf',
    ppt: 'application/vnd.ms-powerpoint',
    rar: 'application/x-rar-compressed',
    rtf: 'application/rtf',
    sh: 'application/x-sh',
    svg: 'image/svg+xml',
    swf: 'application/x-shockwave-flash',
    tar: 'application/x-tar',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    ts: 'application/typescript',
    ttf: 'font/ttf',
    txt: 'text/plain',
    vsd: 'application/vnd.visio',
    wav: 'audio/x-wav',
    weba: 'audio/webm',
    webm: 'video/webm',
    webp: 'image/webp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    xhtml: 'application/xhtml+xml',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.ms-excel',
    xlsx_OLD: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xml: 'application/xml',
    xul: 'application/vnd.mozilla.xul+xml',
    zip: 'application/zip',
    '3gp': 'video/3gpp',
    '3gp_DOES_NOT_CONTAIN_VIDEO': 'audio/3gpp',
    '3gp2': 'video/3gpp2',
    '3gp2_DOES_NOT_CONTAIN_VIDEO': 'audio/3gpp2',
    '7z': 'application/x-7z-compressed',
  },
  getFileExtension = (path) => {
    const index = path.lastIndexOf('.');
    return index === -1 ? '' : path.slice(index + 1);
  };
var createReadStream, stat;
var ElysiaFile = class {
  constructor(path) {
    this.path = path;
    if (isBun) this.value = Bun.file(path);
    else {
      if (!createReadStream || !stat) {
        if (typeof window < 'u') {
          console.warn('Browser environment does not support file');
          return;
        }
        const warnMissing = (name) =>
          console.warn(
            /* @__PURE__ */ new Error(
              `[elysia] \`file\` require \`fs${name ? '.' + name : ''}\` ${name?.includes('.') ? 'module ' : ''}which is not available in this environment`,
            ),
          );
        if (typeof process > 'u' || typeof process.getBuiltinModule != 'function') {
          warnMissing();
          return;
        }
        const fs = process.getBuiltinModule('fs');
        if (!fs) {
          warnMissing();
          return;
        }
        if (typeof fs.createReadStream != 'function') {
          warnMissing();
          return;
        }
        if (typeof fs.promises?.stat != 'function') {
          warnMissing();
          return;
        }
        ((createReadStream = fs.createReadStream), (stat = fs.promises.stat));
      }
      ((this.value = createReadStream(path)), (this.stats = stat(path)));
    }
  }
  get type() {
    return mime[getFileExtension(this.path)] || 'application/octet-stream';
  }
  get length() {
    return isBun ? this.value.size : (this.stats?.then((x) => x.size) ?? 0);
  }
};
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/utils.mjs
var replaceUrlPath = (url, pathname) => {
    const pathStartIndex = url.indexOf('/', 11),
      queryIndex = url.indexOf('?', pathStartIndex);
    return queryIndex === -1
      ? `${url.slice(0, pathStartIndex)}${pathname.charCodeAt(0) === 47 ? '' : '/'}${pathname}`
      : `${url.slice(0, pathStartIndex)}${pathname.charCodeAt(0) === 47 ? '' : '/'}${pathname}${url.slice(queryIndex)}`;
  },
  isClass = (v) =>
    (typeof v == 'function' && /^\s*class\s+/.test(v.toString())) ||
    (v.toString && v.toString().startsWith('[object ') && v.toString() !== '[object Object]') ||
    isNotEmpty(Object.getPrototypeOf(v)),
  isObject = (item) => item && typeof item == 'object' && !Array.isArray(item),
  mergeDeep = (target, source, options) => {
    const skipKeys = options?.skipKeys,
      override = options?.override ?? !0,
      mergeArray = options?.mergeArray ?? !1,
      seen = options?.seen ?? /* @__PURE__ */ new WeakSet();
    if (!isObject(target) || !isObject(source) || seen.has(source)) return target;
    seen.add(source);
    for (const [key, value] of Object.entries(source))
      if (!(skipKeys?.includes(key) || ['__proto__', 'constructor', 'prototype'].includes(key))) {
        if (mergeArray && Array.isArray(value)) {
          target[key] = Array.isArray(target[key])
            ? [...target[key], ...value]
            : (target[key] = value);
          continue;
        }
        if (!isObject(value) || !(key in target) || isClass(value)) {
          if ((override || !(key in target)) && !Object.isFrozen(target))
            try {
              target[key] = value;
            } catch {}
          continue;
        }
        if (!Object.isFrozen(target[key]))
          try {
            target[key] = mergeDeep(target[key], value, {
              skipKeys,
              override,
              mergeArray,
              seen,
            });
          } catch {}
      }
    return (seen.delete(source), target);
  },
  mergeCookie = (a, b) => {
    const v = mergeDeep(Object.assign({}, a), b, {
      skipKeys: ['properties'],
      mergeArray: !1,
    });
    return (v.properties && delete v.properties, v);
  },
  mergeObjectArray = (a, b) => {
    if (!b) return a;
    const array = [],
      checksums = [];
    if (a) {
      Array.isArray(a) || (a = [a]);
      for (const item of a) (array.push(item), item.checksum && checksums.push(item.checksum));
    }
    if (b) {
      Array.isArray(b) || (b = [b]);
      for (const item of b) checksums.includes(item.checksum) || array.push(item);
    }
    return array;
  };
[
  'start',
  'request',
  'parse',
  'transform',
  'resolve',
  'beforeHandle',
  'afterHandle',
  'mapResponse',
  'afterResponse',
  'trace',
  'error',
  'stop',
  'body',
  'headers',
  'params',
  'query',
  'response',
  'type',
  'detail',
].reduce((acc, x) => ((acc[x] = !0), acc), {});
var isRecordNumber = (x) => typeof x == 'object' && Object.keys(x).every((x2) => !isNaN(+x2)),
  mergeResponse = (a, b) =>
    isRecordNumber(a) && isRecordNumber(b)
      ? Object.assign({}, a, b)
      : a && !isRecordNumber(a) && isRecordNumber(b)
        ? Object.assign({ 200: a }, b)
        : (b ?? a),
  mergeSchemaValidator = (a, b) =>
    !a && !b
      ? {
          body: void 0,
          headers: void 0,
          params: void 0,
          query: void 0,
          cookie: void 0,
          response: void 0,
        }
      : {
          body: b?.body ?? a?.body,
          headers: b?.headers ?? a?.headers,
          params: b?.params ?? a?.params,
          query: b?.query ?? a?.query,
          cookie: b?.cookie ?? a?.cookie,
          response: mergeResponse(a?.response, b?.response),
        },
  mergeHook = (a, b) => {
    if (!b) return a ?? {};
    if (!a) return b ?? {};
    if (!Object.values(b).find((x) => x != null)) return { ...a };
    const hook = {
      ...a,
      ...b,
      body: b.body ?? a.body,
      headers: b.headers ?? a.headers,
      params: b.params ?? a.params,
      query: b.query ?? a.query,
      cookie: b.cookie ?? a.cookie,
      response: mergeResponse(a.response, b.response),
      type: a.type || b.type,
      detail: mergeDeep(b.detail ?? {}, a.detail ?? {}),
      parse: mergeObjectArray(a.parse, b.parse),
      transform: mergeObjectArray(a.transform, b.transform),
      beforeHandle: mergeObjectArray(
        mergeObjectArray(fnToContainer(a.resolve, 'resolve'), a.beforeHandle),
        mergeObjectArray(fnToContainer(b.resolve, 'resolve'), b.beforeHandle),
      ),
      afterHandle: mergeObjectArray(a.afterHandle, b.afterHandle),
      mapResponse: mergeObjectArray(a.mapResponse, b.mapResponse),
      afterResponse: mergeObjectArray(a.afterResponse, b.afterResponse),
      trace: mergeObjectArray(a.trace, b.trace),
      error: mergeObjectArray(a.error, b.error),
      standaloneSchema:
        a.standaloneSchema || b.standaloneSchema
          ? a.standaloneSchema && !b.standaloneSchema
            ? a.standaloneSchema
            : b.standaloneSchema && !a.standaloneSchema
              ? b.standaloneSchema
              : [...(a.standaloneSchema ?? []), ...(b.standaloneSchema ?? [])]
          : void 0,
    };
    return (hook.resolve && delete hook.resolve, hook);
  },
  lifeCycleToArray = (a) => {
    (a.parse && !Array.isArray(a.parse) && (a.parse = [a.parse]),
      a.transform && !Array.isArray(a.transform) && (a.transform = [a.transform]),
      a.afterHandle && !Array.isArray(a.afterHandle) && (a.afterHandle = [a.afterHandle]),
      a.mapResponse && !Array.isArray(a.mapResponse) && (a.mapResponse = [a.mapResponse]),
      a.afterResponse && !Array.isArray(a.afterResponse) && (a.afterResponse = [a.afterResponse]),
      a.trace && !Array.isArray(a.trace) && (a.trace = [a.trace]),
      a.error && !Array.isArray(a.error) && (a.error = [a.error]));
    let beforeHandle = [];
    return (
      a.resolve &&
        ((beforeHandle = fnToContainer(
          Array.isArray(a.resolve) ? a.resolve : [a.resolve],
          'resolve',
        )),
        delete a.resolve),
      a.beforeHandle &&
        (beforeHandle.length
          ? (beforeHandle = beforeHandle.concat(
              Array.isArray(a.beforeHandle) ? a.beforeHandle : [a.beforeHandle],
            ))
          : (beforeHandle = Array.isArray(a.beforeHandle) ? a.beforeHandle : [a.beforeHandle])),
      beforeHandle.length && (a.beforeHandle = beforeHandle),
      a
    );
  },
  hasHeaderShorthand = isBun ? 'toJSON' in new Headers() : !1,
  hasSetImmediate = typeof setImmediate == 'function',
  checksum = (s) => {
    let h = 9;
    for (let i = 0; i < s.length; ) h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
    return (h = h ^ (h >>> 9));
  },
  injectChecksum = (checksum2, x) => {
    if (!x) return;
    if (!Array.isArray(x)) {
      const fn = x;
      return (
        checksum2 && !fn.checksum && (fn.checksum = checksum2),
        fn.scope === 'scoped' && (fn.scope = 'local'),
        fn
      );
    }
    const fns = [...x];
    for (const fn of fns)
      (checksum2 && !fn.checksum && (fn.checksum = checksum2),
        fn.scope === 'scoped' && (fn.scope = 'local'));
    return fns;
  },
  mergeLifeCycle = (a, b, checksum2) => ({
    start: mergeObjectArray(a.start, injectChecksum(checksum2, b?.start)),
    request: mergeObjectArray(a.request, injectChecksum(checksum2, b?.request)),
    parse: mergeObjectArray(a.parse, injectChecksum(checksum2, b?.parse)),
    transform: mergeObjectArray(a.transform, injectChecksum(checksum2, b?.transform)),
    beforeHandle: mergeObjectArray(
      mergeObjectArray(fnToContainer(a.resolve, 'resolve'), a.beforeHandle),
      injectChecksum(
        checksum2,
        mergeObjectArray(fnToContainer(b?.resolve, 'resolve'), b?.beforeHandle),
      ),
    ),
    afterHandle: mergeObjectArray(a.afterHandle, injectChecksum(checksum2, b?.afterHandle)),
    mapResponse: mergeObjectArray(a.mapResponse, injectChecksum(checksum2, b?.mapResponse)),
    afterResponse: mergeObjectArray(a.afterResponse, injectChecksum(checksum2, b?.afterResponse)),
    trace: mergeObjectArray(a.trace, injectChecksum(checksum2, b?.trace)),
    error: mergeObjectArray(a.error, injectChecksum(checksum2, b?.error)),
    stop: mergeObjectArray(a.stop, injectChecksum(checksum2, b?.stop)),
  }),
  asHookType = (fn, inject, { skipIfHasType = !1 }) => {
    if (!fn) return fn;
    if (!Array.isArray(fn))
      return (skipIfHasType ? (fn.scope ??= inject) : (fn.scope = inject), fn);
    for (const x of fn) skipIfHasType ? (x.scope ??= inject) : (x.scope = inject);
    return fn;
  },
  filterGlobal = (fn) => {
    if (!fn) return fn;
    if (!Array.isArray(fn))
      switch (fn.scope) {
        case 'global':
        case 'scoped':
          return { ...fn };
        default:
          return { fn };
      }
    const array = [];
    for (const x of fn)
      switch (x.scope) {
        case 'global':
        case 'scoped':
          array.push({ ...x });
          break;
      }
    return array;
  },
  filterGlobalHook = (hook) => ({
    ...hook,
    type: hook?.type,
    detail: hook?.detail,
    parse: filterGlobal(hook?.parse),
    transform: filterGlobal(hook?.transform),
    beforeHandle: filterGlobal(hook?.beforeHandle),
    afterHandle: filterGlobal(hook?.afterHandle),
    mapResponse: filterGlobal(hook?.mapResponse),
    afterResponse: filterGlobal(hook?.afterResponse),
    error: filterGlobal(hook?.error),
    trace: filterGlobal(hook?.trace),
  }),
  StatusMap = {
    Continue: 100,
    'Switching Protocols': 101,
    Processing: 102,
    'Early Hints': 103,
    OK: 200,
    Created: 201,
    Accepted: 202,
    'Non-Authoritative Information': 203,
    'No Content': 204,
    'Reset Content': 205,
    'Partial Content': 206,
    'Multi-Status': 207,
    'Already Reported': 208,
    'Multiple Choices': 300,
    'Moved Permanently': 301,
    Found: 302,
    'See Other': 303,
    'Not Modified': 304,
    'Temporary Redirect': 307,
    'Permanent Redirect': 308,
    'Bad Request': 400,
    Unauthorized: 401,
    'Payment Required': 402,
    Forbidden: 403,
    'Not Found': 404,
    'Method Not Allowed': 405,
    'Not Acceptable': 406,
    'Proxy Authentication Required': 407,
    'Request Timeout': 408,
    Conflict: 409,
    Gone: 410,
    'Length Required': 411,
    'Precondition Failed': 412,
    'Payload Too Large': 413,
    'URI Too Long': 414,
    'Unsupported Media Type': 415,
    'Range Not Satisfiable': 416,
    'Expectation Failed': 417,
    "I'm a teapot": 418,
    'Enhance Your Calm': 420,
    'Misdirected Request': 421,
    'Unprocessable Content': 422,
    Locked: 423,
    'Failed Dependency': 424,
    'Too Early': 425,
    'Upgrade Required': 426,
    'Precondition Required': 428,
    'Too Many Requests': 429,
    'Request Header Fields Too Large': 431,
    'Unavailable For Legal Reasons': 451,
    'Internal Server Error': 500,
    'Not Implemented': 501,
    'Bad Gateway': 502,
    'Service Unavailable': 503,
    'Gateway Timeout': 504,
    'HTTP Version Not Supported': 505,
    'Variant Also Negotiates': 506,
    'Insufficient Storage': 507,
    'Loop Detected': 508,
    'Not Extended': 510,
    'Network Authentication Required': 511,
  },
  InvertedStatusMap = Object.fromEntries(Object.entries(StatusMap).map(([k, v]) => [v, k]));
function removeTrailingEquals(digest) {
  let trimmedDigest = digest;
  for (; trimmedDigest.endsWith('='); ) trimmedDigest = trimmedDigest.slice(0, -1);
  return trimmedDigest;
}
var encoder = new TextEncoder(),
  signCookie = async (val, secret) => {
    if (
      (typeof val == 'object'
        ? (val = JSON.stringify(val))
        : typeof val != 'string' && (val = val + ''),
      secret == null)
    )
      throw new TypeError('Secret key must be provided');
    const secretKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        {
          name: 'HMAC',
          hash: 'SHA-256',
        },
        !1,
        ['sign'],
      ),
      hmacBuffer = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(val));
    return val + '.' + removeTrailingEquals(Buffer.from(hmacBuffer).toString('base64'));
  },
  constantTimeEqual =
    typeof crypto?.timingSafeEqual == 'function'
      ? (a, b) => {
          const ab = Buffer.from(a, 'utf8'),
            bb = Buffer.from(b, 'utf8');
          return ab.length !== bb.length ? !1 : crypto.timingSafeEqual(ab, bb);
        }
      : (a, b) => a === b,
  unsignCookie = async (input, secret) => {
    if (typeof input != 'string') throw new TypeError('Signed cookie string must be provided.');
    const dot = input.lastIndexOf('.');
    if (dot === -1) return secret === null ? input : !1;
    const tentativeValue = input.slice(0, dot);
    return constantTimeEqual(await signCookie(tentativeValue, secret), input) ? tentativeValue : !1;
  },
  insertStandaloneValidator = (hook, name, value) => {
    if (!hook.standaloneValidator?.length || !Array.isArray(hook.standaloneValidator)) {
      hook.standaloneValidator = [{ [name]: value }];
      return;
    }
    const last = hook.standaloneValidator[hook.standaloneValidator.length - 1];
    name in last ? hook.standaloneValidator.push({ [name]: value }) : (last[name] = value);
  },
  parseNumericString = (message) => {
    if (typeof message == 'number') return message;
    if (message.length < 16) {
      if (message.trim().length === 0) return null;
      const length = Number(message);
      return Number.isNaN(length) ? null : length;
    }
    if (message.length === 16) {
      if (message.trim().length === 0) return null;
      const number = Number(message);
      return Number.isNaN(number) || number.toString() !== message ? null : number;
    }
    return null;
  },
  isNumericString = (message) => parseNumericString(message) !== null;
var PromiseGroup = class {
    constructor(onError = console.error, onFinally = () => {}) {
      this.onError = onError;
      this.onFinally = onFinally;
      this.root = null;
      this.promises = [];
    }
    /**
     * The number of promises still being awaited.
     */
    get size() {
      return this.promises.length;
    }
    /**
     * Add a promise to the group.
     * @returns The promise that was added.
     */
    add(promise) {
      return (
        this.promises.push(promise),
        (this.root ||= this.drain()),
        this.promises.length === 1 && this.then(this.onFinally),
        promise
      );
    }
    async drain() {
      for (; this.promises.length > 0; ) {
        try {
          await this.promises[0];
        } catch (error) {
          this.onError(error);
        }
        this.promises.shift();
      }
      this.root = null;
    }
    then(onfulfilled, onrejected) {
      return (this.root ?? Promise.resolve()).then(onfulfilled, onrejected);
    }
  },
  fnToContainer = (fn, subType) => {
    if (!fn) return fn;
    if (!Array.isArray(fn)) {
      if (typeof fn == 'function' || typeof fn == 'string')
        return subType
          ? {
              fn,
              subType,
            }
          : { fn };
      if ('fn' in fn) return fn;
    }
    const fns = [];
    for (const x of fn)
      typeof x == 'function' || typeof x == 'string'
        ? fns.push(
            subType
              ? {
                  fn: x,
                  subType,
                }
              : { fn: x },
          )
        : 'fn' in x && fns.push(x);
    return fns;
  },
  localHookToLifeCycleStore = (a) => (
    a.start && (a.start = fnToContainer(a.start)),
    a.request && (a.request = fnToContainer(a.request)),
    a.parse && (a.parse = fnToContainer(a.parse)),
    a.transform && (a.transform = fnToContainer(a.transform)),
    a.beforeHandle && (a.beforeHandle = fnToContainer(a.beforeHandle)),
    a.afterHandle && (a.afterHandle = fnToContainer(a.afterHandle)),
    a.mapResponse && (a.mapResponse = fnToContainer(a.mapResponse)),
    a.afterResponse && (a.afterResponse = fnToContainer(a.afterResponse)),
    a.trace && (a.trace = fnToContainer(a.trace)),
    a.error && (a.error = fnToContainer(a.error)),
    a.stop && (a.stop = fnToContainer(a.stop)),
    a
  ),
  lifeCycleToFn = (a) => {
    const lifecycle = /* @__PURE__ */ Object.create(null);
    return (
      a.start?.map && (lifecycle.start = a.start.map((x) => x.fn)),
      a.request?.map && (lifecycle.request = a.request.map((x) => x.fn)),
      a.parse?.map && (lifecycle.parse = a.parse.map((x) => x.fn)),
      a.transform?.map && (lifecycle.transform = a.transform.map((x) => x.fn)),
      a.beforeHandle?.map && (lifecycle.beforeHandle = a.beforeHandle.map((x) => x.fn)),
      a.afterHandle?.map && (lifecycle.afterHandle = a.afterHandle.map((x) => x.fn)),
      a.mapResponse?.map && (lifecycle.mapResponse = a.mapResponse.map((x) => x.fn)),
      a.afterResponse?.map && (lifecycle.afterResponse = a.afterResponse.map((x) => x.fn)),
      a.error?.map && (lifecycle.error = a.error.map((x) => x.fn)),
      a.stop?.map && (lifecycle.stop = a.stop.map((x) => x.fn)),
      a.trace?.map ? (lifecycle.trace = a.trace.map((x) => x.fn)) : (lifecycle.trace = []),
      lifecycle
    );
  },
  cloneInference = (inference) => ({
    body: inference.body,
    cookie: inference.cookie,
    headers: inference.headers,
    query: inference.query,
    set: inference.set,
    server: inference.server,
    path: inference.path,
    route: inference.route,
    url: inference.url,
  }),
  redirect = (url, status = 302) => Response.redirect(url, status),
  ELYSIA_FORM_DATA = Symbol('ElysiaFormData'),
  ELYSIA_REQUEST_ID = Symbol('ElysiaRequestId'),
  form = (items) => {
    const formData = new FormData();
    if (((formData[ELYSIA_FORM_DATA] = {}), items))
      for (const [key, value] of Object.entries(items)) {
        if (Array.isArray(value)) {
          formData[ELYSIA_FORM_DATA][key] = [];
          for (const v of value)
            (value instanceof File
              ? formData.append(key, value, value.name)
              : value instanceof ElysiaFile
                ? formData.append(key, value.value, value.value?.name)
                : formData.append(key, value),
              formData[ELYSIA_FORM_DATA][key].push(value));
          continue;
        }
        (value instanceof File
          ? formData.append(key, value, value.name)
          : value instanceof ElysiaFile
            ? formData.append(key, value.value, value.value?.name)
            : formData.append(key, value),
          (formData[ELYSIA_FORM_DATA][key] = value));
      }
    return formData;
  },
  randomId =
    typeof crypto > 'u' || isCloudflareWorker()
      ? () => {
          let result = '';
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (let i = 0; i < 16; i++) result += characters.charAt(Math.floor(Math.random() * 62));
          return result;
        }
      : () => {
          const uuid = crypto.randomUUID();
          return uuid.slice(0, 8) + uuid.slice(24, 32);
        },
  deduplicateChecksum = (array) => {
    if (!array.length) return [];
    const hashes = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      item.checksum &&
        (hashes.includes(item.checksum) && (array.splice(i, 1), i--), hashes.push(item.checksum));
    }
    return array;
  },
  promoteEvent = (events, as = 'scoped') => {
    if (events) {
      if (as === 'scoped') {
        for (const event of events)
          'scope' in event && event.scope === 'local' && (event.scope = 'scoped');
        return;
      }
      for (const event of events) 'scope' in event && (event.scope = 'global');
    }
  },
  getLoosePath = (path) =>
    path.charCodeAt(path.length - 1) === 47 ? path.slice(0, path.length - 1) : path + '/',
  isNotEmpty = (obj) => {
    if (!obj) return !1;
    for (const _ in obj) return !0;
    return !1;
  },
  encodePath = (path, { dynamic = !1 } = {}) => {
    let encoded = encodeURIComponent(path).replace(/%2F/g, '/');
    return (dynamic && (encoded = encoded.replace(/%3A/g, ':').replace(/%3F/g, '?')), encoded);
  },
  supportPerMethodInlineHandler = !!(
    typeof Bun > 'u' || Bun.semver?.satisfies?.(Bun.version, '>=1.2.14')
  );
async function getResponseLength(response) {
  if (response.bodyUsed || !response.body) return 0;
  let length = 0;
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
  }
  return length;
}
var emptySchema = {
  headers: !0,
  cookie: !0,
  query: !0,
  params: !0,
  body: !0,
  response: !0,
};
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/error.mjs
var env$1 = typeof Bun < 'u' ? Bun.env : typeof process < 'u' ? process?.env : void 0,
  ERROR_CODE = Symbol('ElysiaErrorCode'),
  isProduction = (env$1?.NODE_ENV ?? env$1?.ENV) === 'production',
  emptyHttpStatus = {
    101: void 0,
    204: void 0,
    205: void 0,
    304: void 0,
    307: void 0,
    308: void 0,
  };
var ElysiaCustomStatusResponse = class {
    constructor(code, response) {
      const res = response ?? (code in InvertedStatusMap ? InvertedStatusMap[code] : code);
      ((this.code = StatusMap[code] ?? code),
        code in emptyHttpStatus ? (this.response = void 0) : (this.response = res));
    }
  },
  status = (code, response) => new ElysiaCustomStatusResponse(code, response);
var NotFoundError = class extends Error {
  constructor(message) {
    super(message ?? 'NOT_FOUND');
    this.code = 'NOT_FOUND';
    this.status = 404;
  }
};
var ParseError = class extends Error {
  constructor(cause) {
    super('Bad Request', { cause });
    this.code = 'PARSE';
    this.status = 400;
  }
};
var InvalidCookieSignature = class extends Error {
  constructor(key, message) {
    super(message ?? `"${key}" has invalid cookie signature`);
    this.key = key;
    this.code = 'INVALID_COOKIE_SIGNATURE';
    this.status = 400;
  }
};
var mapValueError = (error) => {
  if (!error) return error;
  let { message, path, value, type } = error;
  Array.isArray(path) && (path = path[0]);
  const property = typeof path == 'string' ? path.slice(1).replaceAll('/', '.') : 'unknown',
    isRoot = path === '';
  switch (type) {
    case 42:
      return {
        ...error,
        summary: isRoot
          ? 'Value should not be provided'
          : `Property '${property}' should not be provided`,
      };
    case 45:
      return {
        ...error,
        summary: isRoot ? 'Value is missing' : `Property '${property}' is missing`,
      };
    case 50:
      const quoteIndex = message.indexOf("'"),
        format = message.slice(quoteIndex + 1, message.indexOf("'", quoteIndex + 1));
      return {
        ...error,
        summary: isRoot ? 'Value should be an email' : `Property '${property}' should be ${format}`,
      };
    case 54:
      return {
        ...error,
        summary: `${message.slice(0, 9).trim()} property '${property}' to be ${message.slice(8).trim()} but found: ${value}`,
      };
    case 62:
      const union = error.schema.anyOf.map((x) => `'${x?.format ?? x.type}'`).join(', ');
      return {
        ...error,
        summary: isRoot
          ? `Value should be one of ${union}`
          : `Property '${property}' should be one of: ${union}`,
      };
    default:
      return {
        summary: message,
        ...error,
      };
  }
};
var InvalidFileType = class InvalidFileType extends Error {
  constructor(property, expected, message = `"${property}" has invalid file type`) {
    super(message);
    this.property = property;
    this.expected = expected;
    this.message = message;
    this.code = 'INVALID_FILE_TYPE';
    this.status = 422;
    Object.setPrototypeOf(this, InvalidFileType.prototype);
  }
  toResponse(headers) {
    return isProduction
      ? new Response(
          JSON.stringify({
            type: 'validation',
            on: 'body',
          }),
          {
            status: 422,
            headers: {
              ...headers,
              'content-type': 'application/json',
            },
          },
        )
      : new Response(
          JSON.stringify({
            type: 'validation',
            on: 'body',
            summary: 'Invalid file type',
            message: this.message,
            property: this.property,
            expected: this.expected,
          }),
          {
            status: 422,
            headers: {
              ...headers,
              'content-type': 'application/json',
            },
          },
        );
  }
};
var ValidationError = class ValidationError extends Error {
  constructor(type, validator, value, allowUnsafeValidationDetails = !1, errors) {
    let message = '',
      error,
      expected,
      customError;
    if (
      validator?.provider === 'standard' ||
      '~standard' in validator ||
      (validator.schema && '~standard' in validator.schema)
    ) {
      const standard = ('~standard' in validator ? validator : validator.schema)['~standard'];
      ((error = (errors ?? standard.validate(value).issues)?.[0]),
        isProduction && !allowUnsafeValidationDetails
          ? (message = JSON.stringify({
              type: 'validation',
              on: type,
              found: value,
            }))
          : (message = JSON.stringify(
              {
                type: 'validation',
                on: type,
                property: error.path?.[0] || 'root',
                message: error?.message,
                summary: error?.problem,
                expected,
                found: value,
                errors,
              },
              null,
              2,
            )),
        (customError = error?.message));
    } else {
      (value &&
        typeof value == 'object' &&
        value instanceof ElysiaCustomStatusResponse &&
        (value = value.response),
        (error =
          errors?.First() ??
          ('Errors' in validator
            ? validator.Errors(value).First()
            : Errors(validator, value).First())));
      const accessor = error?.path || 'root',
        schema = validator?.schema ?? validator;
      if (!isProduction && !allowUnsafeValidationDetails)
        try {
          expected = Create(schema);
        } catch (error2) {
          expected = {
            type: 'Could not create expected value',
            message: error2?.message,
            error: error2,
          };
        }
      ((customError =
        error?.schema?.message || error?.schema?.error !== void 0
          ? typeof error.schema.error == 'function'
            ? error.schema.error(
                isProduction && !allowUnsafeValidationDetails
                  ? {
                      type: 'validation',
                      on: type,
                      found: value,
                    }
                  : {
                      type: 'validation',
                      on: type,
                      value,
                      property: accessor,
                      message: error?.message,
                      summary: mapValueError(error)?.summary,
                      found: value,
                      expected,
                      errors:
                        'Errors' in validator
                          ? [...validator.Errors(value)].map(mapValueError)
                          : [...Errors(validator, value)].map(mapValueError),
                    },
                validator,
              )
            : error.schema.error
          : void 0),
        customError !== void 0
          ? (message =
              typeof customError == 'object' ? JSON.stringify(customError) : customError + '')
          : isProduction && !allowUnsafeValidationDetails
            ? (message = JSON.stringify({
                type: 'validation',
                on: type,
                found: value,
              }))
            : (message = JSON.stringify(
                {
                  type: 'validation',
                  on: type,
                  property: accessor,
                  message: error?.message,
                  summary: mapValueError(error)?.summary,
                  expected,
                  found: value,
                  errors:
                    'Errors' in validator
                      ? [...validator.Errors(value)].map(mapValueError)
                      : [...Errors(validator, value)].map(mapValueError),
                },
                null,
                2,
              )));
    }
    super(message);
    this.type = type;
    this.validator = validator;
    this.value = value;
    this.allowUnsafeValidationDetails = allowUnsafeValidationDetails;
    this.code = 'VALIDATION';
    this.status = 422;
    ((this.valueError = error),
      (this.expected = expected),
      (this.customError = customError),
      Object.setPrototypeOf(this, ValidationError.prototype));
  }
  /**
   * Alias of `valueError`
   */
  get messageValue() {
    return this.valueError;
  }
  get all() {
    return this.validator?.provider === 'standard' ||
      '~standard' in this.validator ||
      ('schema' in this.validator && this.validator.schema && '~standard' in this.validator.schema)
      ? ('~standard' in this.validator ? this.validator : this.validator.schema)['~standard']
          .validate(this.value)
          .issues?.map((issue) => ({
            summary: issue.message,
            path: issue.path?.join('.') || 'root',
            message: issue.message,
            value: this.value,
          })) || []
      : 'Errors' in this.validator
        ? [...this.validator.Errors(this.value)].filter((x) => x).map((x) => mapValueError(x))
        : [...Errors(this.validator, this.value)].map(mapValueError);
  }
  static simplifyModel(validator) {
    const model = 'schema' in validator ? validator.schema : validator;
    try {
      return Create(model);
    } catch {
      return model;
    }
  }
  get model() {
    return '~standard' in this.validator
      ? this.validator
      : ValidationError.simplifyModel(this.validator);
  }
  toResponse(headers) {
    return new Response(this.message, {
      status: 400,
      headers: {
        ...headers,
        'content-type': 'application/json',
      },
    });
  }
  /**
   * Utility function to inherit add custom error and keep the original Validation error
   *
   * @since 1.3.14
   *
   * @example
   * ```ts
   * new Elysia()
   *		.onError(({ error, code }) => {
   *			if (code === 'VALIDATION') return error.detail(error.message)
   *		})
   *		.post('/', () => 'Hello World!', {
   *			body: t.Object({
   *				x: t.Number({
   *					error: 'x must be a number'
   *				})
   *			})
   *		})
   * ```
   */
  detail(message, allowUnsafeValidatorDetails = this.allowUnsafeValidationDetails) {
    if (!this.customError) return this.message;
    const value = this.value,
      expected = this.expected,
      errors = this.all;
    return isProduction && !allowUnsafeValidatorDetails
      ? {
          type: 'validation',
          on: this.type,
          found: value,
          message,
        }
      : {
          type: 'validation',
          on: this.type,
          property: this.valueError?.path || 'root',
          message,
          summary: mapValueError(this.valueError)?.summary,
          found: value,
          expected,
          errors,
        };
  }
};
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/type-system/utils.mjs
var tryParse = (v, schema) => {
  try {
    return JSON.parse(v);
  } catch {
    throw new ValidationError('property', schema, v);
  }
};
function createType(kind, func) {
  return (
    Has(kind) || Set$1(kind, func),
    (options = {}) =>
      Unsafe({
        ...options,
        [Kind$1]: kind,
      })
  );
}
var compile = (schema) => {
    try {
      const compiler = TypeCompiler.Compile(schema);
      return (
        (compiler.Create = () => Create(schema)),
        (compiler.Error = (v) => new ValidationError('property', schema, v, compiler.Errors(v))),
        compiler
      );
    } catch {
      return {
        Check: (v) => Check(schema, v),
        CheckThrow: (v) => {
          if (!Check(schema, v))
            throw new ValidationError('property', schema, v, Errors(schema, v));
        },
        Decode: (v) => Decode(schema, v),
        Create: () => Create(schema),
        Error: (v) => new ValidationError('property', schema, v, Errors(schema, v)),
      };
    }
  },
  parseFileUnit = (size) => {
    if (typeof size == 'string')
      switch (size.slice(-1)) {
        case 'k':
          return +size.slice(0, size.length - 1) * 1024;
        case 'm':
          return +size.slice(0, size.length - 1) * 1048576;
        default:
          return +size;
      }
    return size;
  },
  checkFileExtension = (type, extension) =>
    type.startsWith(extension)
      ? !0
      : extension.charCodeAt(extension.length - 1) === 42 &&
        extension.charCodeAt(extension.length - 2) === 47 &&
        type.startsWith(extension.slice(0, -1));
var _fileTypeFromBlobWarn = !1;
var warnIfFileTypeIsNotInstalled = () => {
    _fileTypeFromBlobWarn ||
      (console.warn(
        "[Elysia] Attempt to validate file type without 'file-type'. This may lead to security risks. We recommend installing 'file-type' to properly validate file extension.",
      ),
      (_fileTypeFromBlobWarn = !0));
  },
  loadFileType = async () =>
    import('./_.mjs')
      .then((x) => ((_fileTypeFromBlob = x.fileTypeFromBlob), _fileTypeFromBlob))
      .catch(warnIfFileTypeIsNotInstalled);
var _fileTypeFromBlob,
  fileTypeFromBlob = (file) =>
    _fileTypeFromBlob
      ? _fileTypeFromBlob(file)
      : loadFileType().then((mod) => {
          if (mod) return mod(file);
        }),
  fileType = async (file, extension, name = file?.name ?? '') => {
    if (Array.isArray(file))
      return (await Promise.all(file.map((f) => fileType(f, extension, name))), !0);
    if (!file) return !1;
    const result = await fileTypeFromBlob(file);
    if (!result) throw new InvalidFileType(name, extension);
    if (typeof extension == 'string' && !checkFileExtension(result.mime, extension))
      throw new InvalidFileType(name, extension);
    for (let i = 0; i < extension.length; i++)
      if (checkFileExtension(result.mime, extension[i])) return !0;
    throw new InvalidFileType(name, extension);
  },
  validateFile = (options, value) => {
    if (value instanceof ElysiaFile) return !0;
    if (
      !(value instanceof Blob) ||
      (options.minSize && value.size < parseFileUnit(options.minSize)) ||
      (options.maxSize && value.size > parseFileUnit(options.maxSize))
    )
      return !1;
    if (options.extension) {
      if (typeof options.extension == 'string')
        return checkFileExtension(value.type, options.extension);
      for (let i = 0; i < options.extension.length; i++)
        if (checkFileExtension(value.type, options.extension[i])) return !0;
      return !1;
    }
    return !0;
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/type-system/format.mjs
var fullFormats = {
  date,
  time: getTime(!0),
  'date-time': getDateTime(!0),
  'iso-time': getTime(!1),
  'iso-date-time': getDateTime(!1),
  duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
  uri,
  'uri-reference':
    /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
  'uri-template':
    /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
  url: /^(?:https?|ftp):\/\/(?:[^\s:@]+(?::[^\s@]*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
  email:
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  hostname:
    /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
  ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
  regex,
  uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
  'json-pointer': /^(?:\/(?:[^~/]|~0|~1)*)*$/,
  'json-pointer-uri-fragment': /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
  'relative-json-pointer': /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
  byte,
  int32: {
    type: 'number',
    validate: validateInt32,
  },
  int64: {
    type: 'number',
    validate: validateInt64,
  },
  float: {
    type: 'number',
    validate: validateNumber,
  },
  double: {
    type: 'number',
    validate: validateNumber,
  },
  password: !0,
  binary: !0,
};
function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
  DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function date(str) {
  const matches = DATE.exec(str);
  if (!matches) return !1;
  const year = +matches[1],
    month = +matches[2],
    day = +matches[3];
  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month])
  );
}
var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
function getTime(strictTimeZone) {
  return function (str) {
    const matches = TIME.exec(str);
    if (!matches) return !1;
    const hr = +matches[1],
      min = +matches[2],
      sec = +matches[3],
      tz = matches[4],
      tzSign = matches[5] === '-' ? -1 : 1,
      tzH = +(matches[6] || 0),
      tzM = +(matches[7] || 0);
    if (tzH > 23 || tzM > 59 || (strictTimeZone && !tz)) return !1;
    if (hr <= 23 && min <= 59 && sec < 60) return !0;
    const utcMin = min - tzM * tzSign,
      utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
    return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
  };
}
var parseDateTimeEmptySpace = (str) =>
    str.charCodeAt(str.length - 6) === 32 ? str.slice(0, -6) + '+' + str.slice(-5) : str,
  DATE_TIME_SEPARATOR = /t|\s/i;
function getDateTime(strictTimeZone) {
  const time = getTime(strictTimeZone);
  return function (str) {
    const dateTime = str.split(DATE_TIME_SEPARATOR);
    return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
  };
}
var NOT_URI_FRAGMENT = /\/|:/,
  URI =
    /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
function uri(str) {
  return NOT_URI_FRAGMENT.test(str) && URI.test(str);
}
var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
function byte(str) {
  return ((BYTE.lastIndex = 0), BYTE.test(str));
}
var MIN_INT32 = -(2 ** 31),
  MAX_INT32 = 2 ** 31 - 1;
function validateInt32(value) {
  return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
}
function validateInt64(value) {
  return Number.isInteger(value);
}
function validateNumber() {
  return !0;
}
var Z_ANCHOR = /[^\\]\\Z/;
function regex(str) {
  if (Z_ANCHOR.test(str)) return !1;
  try {
    return (new RegExp(str), !0);
  } catch {
    return !1;
  }
}
/**
 * @license
 *
 * MIT License
 *
 * Copyright (c) 2020 Evgeny Poberezkin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isISO8601 =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  isFormalDate =
    /(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT(?:\+|-)\d{4}\s\([^)]+\)/,
  isShortenDate =
    /^(?:(?:(?:(?:0?[1-9]|[12][0-9]|3[01])[/\s-](?:0?[1-9]|1[0-2])[/\s-](?:19|20)\d{2})|(?:(?:19|20)\d{2}[/\s-](?:0?[1-9]|1[0-2])[/\s-](?:0?[1-9]|[12][0-9]|3[01]))))(?:\s(?:1[012]|0?[1-9]):[0-5][0-9](?::[0-5][0-9])?(?:\s[AP]M)?)?$/,
  _validateDate = fullFormats.date,
  _validateDateTime = fullFormats['date-time'];
(Has$1('date') ||
  Set$2('date', (value) => {
    const temp = parseDateTimeEmptySpace(value).replace(/"/g, '');
    if (
      isISO8601.test(temp) ||
      isFormalDate.test(temp) ||
      isShortenDate.test(temp) ||
      _validateDate(temp)
    ) {
      const date2 = new Date(temp);
      if (!Number.isNaN(date2.getTime())) return !0;
    }
    return !1;
  }),
  Has$1('date-time') ||
    Set$2('date-time', (value) => {
      const temp = value.replace(/"/g, '');
      if (
        isISO8601.test(temp) ||
        isFormalDate.test(temp) ||
        isShortenDate.test(temp) ||
        _validateDateTime(temp)
      ) {
        const date2 = new Date(temp);
        if (!Number.isNaN(date2.getTime())) return !0;
      }
      return !1;
    }),
  Object.entries(fullFormats).forEach((formatEntry) => {
    const [formatName, formatValue] = formatEntry;
    Has$1(formatName) ||
      (formatValue instanceof RegExp
        ? Set$2(formatName, (value) => formatValue.test(value))
        : typeof formatValue == 'function' && Set$2(formatName, formatValue));
  }),
  Has$1('numeric') || Set$2('numeric', (value) => !!value && !isNaN(+value)),
  Has$1('integer') || Set$2('integer', (value) => !!value && Number.isInteger(+value)),
  Has$1('boolean') || Set$2('boolean', (value) => value === 'true' || value === 'false'),
  Has$1('ObjectString') ||
    Set$2('ObjectString', (value) => {
      let start = value.charCodeAt(0);
      if (
        ((start === 9 || start === 10 || start === 32) && (start = value.trimStart().charCodeAt(0)),
        start !== 123 && start !== 91)
      )
        return !1;
      try {
        return (JSON.parse(value), !0);
      } catch {
        return !1;
      }
    }),
  Has$1('ArrayString') ||
    Set$2('ArrayString', (value) => {
      let start = value.charCodeAt(0);
      if (
        ((start === 9 || start === 10 || start === 32) && (start = value.trimStart().charCodeAt(0)),
        start !== 123 && start !== 91)
      )
        return !1;
      try {
        return (JSON.parse(value), !0);
      } catch {
        return !1;
      }
    }));
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/type-system/index.mjs
var t = Object.assign({}, Type);
(createType(
  'UnionEnum',
  (schema, value) =>
    (typeof value == 'number' || typeof value == 'string' || value === null) &&
    schema.enum.includes(value),
),
  createType('ArrayBuffer', (schema, value) => value instanceof ArrayBuffer));
var internalFiles = createType('Files', (options, value) => {
    if (options.minItems && options.minItems > 1 && !Array.isArray(value)) return !1;
    if (!Array.isArray(value)) return validateFile(options, value);
    if (
      (options.minItems && value.length < options.minItems) ||
      (options.maxItems && value.length > options.maxItems)
    )
      return !1;
    for (let i = 0; i < value.length; i++) if (!validateFile(options, value[i])) return !1;
    return !0;
  }),
  internalFormData = createType('ElysiaForm', ({ compiler, ...schema }, value) => {
    if (!(value instanceof FormData)) return !1;
    if (compiler) {
      if (!(ELYSIA_FORM_DATA in value)) throw new ValidationError('property', schema, value);
      if (!compiler.Check(value[ELYSIA_FORM_DATA])) throw compiler.Error(value[ELYSIA_FORM_DATA]);
    }
    return !0;
  }),
  ElysiaType = {
    String: (property) => Type.String(property),
    Numeric: (property) => {
      const compiler = compile(Type.Number(property));
      return t
        .Transform(
          t.Union(
            [
              t.String({
                format: 'numeric',
                default: 0,
              }),
              t.Number(property),
            ],
            property,
          ),
        )
        .Decode((value) => {
          const number = +value;
          if (isNaN(number)) return value;
          if (property && !compiler.Check(number)) throw compiler.Error(number);
          return number;
        })
        .Encode((value) => value);
    },
    NumericEnum(item, property) {
      const compiler = compile(Type.Enum(item, property));
      return t
        .Transform(t.Union([t.String({ format: 'numeric' }), t.Number()], property))
        .Decode((value) => {
          const number = +value;
          if (isNaN(number) || !compiler.Check(number)) throw compiler.Error(number);
          return number;
        })
        .Encode((value) => value);
    },
    Integer: (property) => {
      const compiler = compile(Type.Integer(property));
      return t
        .Transform(
          t.Union(
            [
              t.String({
                format: 'integer',
                default: 0,
              }),
              Type.Integer(property),
            ],
            property,
          ),
        )
        .Decode((value) => {
          const number = +value;
          if (!compiler.Check(number)) throw compiler.Error(number);
          return number;
        })
        .Encode((value) => value);
    },
    Date: (property) => {
      const schema = Type.Date(property),
        compiler = compile(schema),
        _default = property?.default ? new Date(property.default) : void 0;
      return t
        .Transform(
          t.Union(
            [
              Type.Date(property),
              t.String({
                format: 'date-time',
                default: _default?.toISOString(),
              }),
              t.String({
                format: 'date',
                default: _default?.toISOString(),
              }),
              t.Number({ default: _default?.getTime() }),
            ],
            property,
          ),
        )
        .Decode((value) => {
          if (typeof value == 'number') {
            const date2 = new Date(value);
            if (!compiler.Check(date2)) throw compiler.Error(date2);
            return date2;
          }
          if (value instanceof Date) return value;
          const date = new Date(parseDateTimeEmptySpace(value));
          if (!date || isNaN(date.getTime())) throw new ValidationError('property', schema, date);
          if (!compiler.Check(date)) throw compiler.Error(date);
          return date;
        })
        .Encode((value) => {
          if (value instanceof Date) return value.toISOString();
          if (typeof value == 'string') {
            const parsed = new Date(parseDateTimeEmptySpace(value));
            if (isNaN(parsed.getTime())) throw new ValidationError('property', schema, value);
            return parsed.toISOString();
          }
          if (!compiler.Check(value)) throw compiler.Error(value);
          return value;
        });
    },
    BooleanString: (property) => {
      const compiler = compile(Type.Boolean(property));
      return t
        .Transform(
          t.Union(
            [
              t.Boolean(property),
              t.String({
                format: 'boolean',
                default: !1,
              }),
            ],
            property,
          ),
        )
        .Decode((value) => {
          if (typeof value == 'string') return value === 'true';
          if (value !== void 0 && !compiler.Check(value)) throw compiler.Error(value);
          return value;
        })
        .Encode((value) => value);
    },
    ObjectString: (properties, options) => {
      const schema = t.Object(properties, options),
        compiler = compile(schema);
      return t
        .Transform(
          t.Union(
            [
              t.String({
                format: 'ObjectString',
                default: options?.default,
              }),
              schema,
            ],
            { elysiaMeta: 'ObjectString' },
          ),
        )
        .Decode((value) => {
          if (typeof value == 'string') {
            if (value.charCodeAt(0) !== 123) throw new ValidationError('property', schema, value);
            if (!compiler.Check((value = tryParse(value, schema)))) throw compiler.Error(value);
            return compiler.Decode(value);
          }
          return value;
        })
        .Encode((value) => {
          let original;
          if (
            (typeof value == 'string' && (value = tryParse((original = value), schema)),
            !compiler.Check(value))
          )
            throw compiler.Error(value);
          return original ?? JSON.stringify(value);
        });
    },
    ArrayString: (children = t.String(), options) => {
      const schema = t.Array(children, options),
        compiler = compile(schema),
        decode = (value, isProperty = !1) => {
          if (value.charCodeAt(0) === 91) {
            if (!compiler.Check((value = tryParse(value, schema)))) throw compiler.Error(value);
            return compiler.Decode(value);
          }
          if (isProperty) return value;
          throw new ValidationError('property', schema, value);
        };
      return t
        .Transform(
          t.Union(
            [
              t.String({
                format: 'ArrayString',
                default: options?.default,
              }),
              schema,
            ],
            { elysiaMeta: 'ArrayString' },
          ),
        )
        .Decode((value) => {
          if (Array.isArray(value)) {
            let values = [];
            for (let i = 0; i < value.length; i++) {
              const v = value[i];
              if (typeof v == 'string') {
                const t2 = decode(v, !0);
                Array.isArray(t2) ? (values = values.concat(t2)) : values.push(t2);
                continue;
              }
              values.push(v);
            }
            return values;
          }
          return typeof value == 'string' ? decode(value) : value;
        })
        .Encode((value) => {
          let original;
          if (
            (typeof value == 'string' && (value = tryParse((original = value), schema)),
            !compiler.Check(value))
          )
            throw new ValidationError('property', schema, value);
          return original ?? JSON.stringify(value);
        });
    },
    ArrayQuery: (children = t.String(), options) => {
      const schema = t.Array(children, options),
        compiler = compile(schema),
        decode = (value) =>
          value.indexOf(',') !== -1 ? compiler.Decode(value.split(',')) : compiler.Decode([value]);
      return t
        .Transform(
          t.Union([t.String({ default: options?.default }), schema], { elysiaMeta: 'ArrayQuery' }),
        )
        .Decode((value) => {
          if (Array.isArray(value)) {
            let values = [];
            for (let i = 0; i < value.length; i++) {
              const v = value[i];
              if (typeof v == 'string') {
                const t2 = decode(v);
                Array.isArray(t2) ? (values = values.concat(t2)) : values.push(t2);
                continue;
              }
              values.push(v);
            }
            return values;
          }
          return typeof value == 'string' ? decode(value) : value;
        })
        .Encode((value) => {
          let original;
          if (
            (typeof value == 'string' && (value = tryParse((original = value), schema)),
            !compiler.Check(value))
          )
            throw new ValidationError('property', schema, value);
          return original ?? JSON.stringify(value);
        });
    },
    File: createType('File', validateFile),
    Files: (options = {}) =>
      t
        .Transform(internalFiles(options))
        .Decode((value) => (Array.isArray(value) ? value : [value]))
        .Encode((value) => value),
    Nullable: (schema, options) =>
      t.Union([schema, t.Null()], {
        ...options,
        nullable: !0,
      }),
    MaybeEmpty: (schema, options) => t.Union([schema, t.Null(), t.Undefined()], options),
    Cookie: (
      properties,
      {
        domain,
        expires,
        httpOnly,
        maxAge,
        path,
        priority,
        sameSite,
        secure,
        secrets,
        sign,
        ...options
      } = {},
    ) => {
      const v = t.Object(properties, options);
      return (
        (v.config = {
          domain,
          expires,
          httpOnly,
          maxAge,
          path,
          priority,
          sameSite,
          secure,
          secrets,
          sign,
        }),
        v
      );
    },
    UnionEnum: (values, options = {}) => {
      const type = values.every((value) => typeof value == 'string')
        ? { type: 'string' }
        : values.every((value) => typeof value == 'number')
          ? { type: 'number' }
          : values.every((value) => value === null)
            ? { type: 'null' }
            : {};
      if (values.some((x) => typeof x == 'object' && x !== null))
        throw new Error('This type does not support objects or arrays');
      return {
        default: values[0],
        ...options,
        [Kind$1]: 'UnionEnum',
        ...type,
        enum: values,
      };
    },
    NoValidate: (v, enabled = !0) => ((v.noValidate = enabled), v),
    Form: (v, options = {}) => {
      const schema = t.Object(v, {
          default: form({}),
          ...options,
        }),
        compiler = compile(schema);
      return t.Union([schema, internalFormData({ compiler })]);
    },
    ArrayBuffer(options = {}) {
      return {
        default: [1, 2, 3],
        ...options,
        [Kind$1]: 'ArrayBuffer',
      };
    },
    Uint8Array: (options) => {
      const compiler = compile(Type.Uint8Array(options));
      return t
        .Transform(t.Union([t.ArrayBuffer(), Type.Uint8Array(options)]))
        .Decode((value) => {
          if (value instanceof ArrayBuffer) {
            if (!compiler.Check((value = new Uint8Array(value)))) throw compiler.Error(value);
            return value;
          }
          return value;
        })
        .Encode((value) => value);
    },
  };
((t.BooleanString = ElysiaType.BooleanString),
  (t.ObjectString = ElysiaType.ObjectString),
  (t.ArrayString = ElysiaType.ArrayString),
  (t.ArrayQuery = ElysiaType.ArrayQuery),
  (t.Numeric = ElysiaType.Numeric),
  (t.NumericEnum = ElysiaType.NumericEnum),
  (t.Integer = ElysiaType.Integer),
  (t.File = (arg) => (
    arg?.type && loadFileType(),
    ElysiaType.File({
      default: 'File',
      ...arg,
      extension: arg?.type,
      type: 'string',
      format: 'binary',
    })
  )),
  (t.Files = (arg) => (
    arg?.type && loadFileType(),
    ElysiaType.Files({
      ...arg,
      elysiaMeta: 'Files',
      default: 'Files',
      extension: arg?.type,
      type: 'array',
      items: {
        ...arg,
        default: 'Files',
        type: 'string',
        format: 'binary',
      },
    })
  )),
  (t.Nullable = ElysiaType.Nullable),
  (t.MaybeEmpty = ElysiaType.MaybeEmpty),
  (t.Cookie = ElysiaType.Cookie),
  (t.Date = ElysiaType.Date),
  (t.UnionEnum = ElysiaType.UnionEnum),
  (t.NoValidate = ElysiaType.NoValidate),
  (t.Form = ElysiaType.Form),
  (t.ArrayBuffer = ElysiaType.ArrayBuffer),
  (t.Uint8Array = ElysiaType.Uint8Array));
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/sucrose.mjs
var separateFunction = (code) => {
    (code.startsWith('async') && (code = code.slice(5)), (code = code.trimStart()));
    let index = -1;
    if (
      code.charCodeAt(0) === 40 &&
      ((index = code.indexOf('=>', code.indexOf(')'))), index !== -1)
    ) {
      let bracketEndIndex = index;
      for (; bracketEndIndex > 0 && code.charCodeAt(--bracketEndIndex) !== 41; );
      let body = code.slice(index + 2);
      return (
        body.charCodeAt(0) === 32 && (body = body.trimStart()),
        [code.slice(1, bracketEndIndex), body, { isArrowReturn: body.charCodeAt(0) !== 123 }]
      );
    }
    if (/^(\w+)=>/g.test(code) && ((index = code.indexOf('=>')), index !== -1)) {
      let body = code.slice(index + 2);
      return (
        body.charCodeAt(0) === 32 && (body = body.trimStart()),
        [code.slice(0, index), body, { isArrowReturn: body.charCodeAt(0) !== 123 }]
      );
    }
    if (code.startsWith('function')) {
      index = code.indexOf('(');
      const end = code.indexOf(')');
      return [code.slice(index + 1, end), code.slice(end + 2), { isArrowReturn: !1 }];
    }
    const start = code.indexOf('(');
    if (start !== -1) {
      const sep = code.indexOf(
          `
`,
          2,
        ),
        parameter = code.slice(0, sep),
        end = parameter.lastIndexOf(')') + 1,
        body = code.slice(sep + 1);
      return [parameter.slice(start, end), '{' + body, { isArrowReturn: !1 }];
    }
    const x = code.split(
      `
`,
      2,
    );
    return [x[0], x[1], { isArrowReturn: !1 }];
  },
  bracketPairRange = (parameter) => {
    const start = parameter.indexOf('{');
    if (start === -1) return [-1, 0];
    let end = start + 1,
      deep = 1;
    for (; end < parameter.length; end++) {
      const char = parameter.charCodeAt(end);
      if ((char === 123 ? deep++ : char === 125 && deep--, deep === 0)) break;
    }
    return deep !== 0 ? [0, parameter.length] : [start, end + 1];
  },
  bracketPairRangeReverse = (parameter) => {
    const end = parameter.lastIndexOf('}');
    if (end === -1) return [-1, 0];
    let start = end - 1,
      deep = 1;
    for (; start >= 0; start--) {
      const char = parameter.charCodeAt(start);
      if ((char === 125 ? deep++ : char === 123 && deep--, deep === 0)) break;
    }
    return deep !== 0 ? [-1, 0] : [start, end + 1];
  },
  removeColonAlias = (parameter) => {
    for (;;) {
      const start = parameter.indexOf(':');
      if (start === -1) break;
      let end = parameter.indexOf(',', start);
      (end === -1 && (end = parameter.indexOf('}', start) - 1),
        end === -2 && (end = parameter.length),
        (parameter = parameter.slice(0, start) + parameter.slice(end)));
    }
    return parameter;
  },
  retrieveRootparameters = (parameter) => {
    let hasParenthesis = !1;
    (parameter.charCodeAt(0) === 40 && (parameter = parameter.slice(1, -1)),
      parameter.charCodeAt(0) === 123 &&
        ((hasParenthesis = !0), (parameter = parameter.slice(1, -1))),
      (parameter = parameter.replace(/( |\t|\n)/g, '').trim()));
    let parameters = [];
    for (;;) {
      let [start, end] = bracketPairRange(parameter);
      if (start === -1) break;
      (parameters.push(parameter.slice(0, start - 1)),
        parameter.charCodeAt(end) === 44 && end++,
        (parameter = parameter.slice(end)));
    }
    ((parameter = removeColonAlias(parameter)),
      parameter && (parameters = parameters.concat(parameter.split(','))));
    const parameterMap = /* @__PURE__ */ Object.create(null);
    for (const p of parameters) {
      if (p.indexOf(',') === -1) {
        parameterMap[p] = !0;
        continue;
      }
      for (const q of p.split(',')) parameterMap[q.trim()] = !0;
    }
    return {
      hasParenthesis,
      parameters: parameterMap,
    };
  },
  findParameterReference = (parameter, inference) => {
    const { parameters, hasParenthesis } = retrieveRootparameters(parameter);
    return (
      parameters.query && (inference.query = !0),
      parameters.headers && (inference.headers = !0),
      parameters.body && (inference.body = !0),
      parameters.cookie && (inference.cookie = !0),
      parameters.set && (inference.set = !0),
      parameters.server && (inference.server = !0),
      parameters.route && (inference.route = !0),
      parameters.url && (inference.url = !0),
      parameters.path && (inference.path = !0),
      hasParenthesis
        ? `{ ${Object.keys(parameters).join(', ')} }`
        : Object.keys(parameters).join(', ')
    );
  },
  findEndIndex = (type, content, index) => {
    const regex = new RegExp(`${type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\n\\t,; ]`);
    index !== void 0 && (regex.lastIndex = index);
    const match = regex.exec(content);
    return match ? match.index : -1;
  },
  findAlias = (type, body, depth = 0) => {
    if (depth > 5) return [];
    const aliases = [];
    let content = body;
    for (;;) {
      let index = findEndIndex(' = ' + type, content);
      if ((index === -1 && (index = findEndIndex('=' + type, content)), index === -1)) {
        let lastIndex = content.indexOf(' = ' + type);
        if (
          (lastIndex === -1 && (lastIndex = content.indexOf('=' + type)),
          lastIndex + 3 + type.length !== content.length)
        )
          break;
        index = lastIndex;
      }
      const part = content.slice(0, index),
        lastPart = part.lastIndexOf(' ');
      let variable = part.slice(lastPart !== -1 ? lastPart + 1 : -1);
      if (variable === '}') {
        const [start, end] = bracketPairRangeReverse(part);
        (aliases.push(removeColonAlias(content.slice(start, end))),
          (content = content.slice(index + 3 + type.length)));
        continue;
      }
      for (; variable.charCodeAt(0) === 44; ) variable = variable.slice(1);
      for (; variable.charCodeAt(0) === 9; ) variable = variable.slice(1);
      (variable.includes('(') || aliases.push(variable),
        (content = content.slice(index + 3 + type.length)));
    }
    for (const alias of aliases) {
      if (alias.charCodeAt(0) === 123) continue;
      const deepAlias = findAlias(alias, body);
      deepAlias.length > 0 && aliases.push(...deepAlias);
    }
    return aliases;
  },
  extractMainParameter = (parameter) => {
    if (!parameter) return;
    if (parameter.charCodeAt(0) !== 123) return parameter;
    if (((parameter = parameter.slice(2, -2)), !parameter.includes(',')))
      return parameter.indexOf('...') !== -1
        ? parameter.slice(parameter.indexOf('...') + 3)
        : void 0;
    const spreadIndex = parameter.indexOf('...');
    if (spreadIndex !== -1) return parameter.slice(spreadIndex + 3).trimEnd();
  },
  inferBodyReference = (code, aliases, inference) => {
    const access = (type, alias) =>
      new RegExp(`${alias}\\.(${type})|${alias}\\["${type}"\\]|${alias}\\['${type}'\\]`).test(code);
    for (const alias of aliases)
      if (alias) {
        if (alias.charCodeAt(0) === 123) {
          const parameters = retrieveRootparameters(alias).parameters;
          (parameters.query && (inference.query = !0),
            parameters.headers && (inference.headers = !0),
            parameters.body && (inference.body = !0),
            parameters.cookie && (inference.cookie = !0),
            parameters.set && (inference.set = !0),
            parameters.server && (inference.server = !0),
            parameters.url && (inference.url = !0),
            parameters.route && (inference.route = !0),
            parameters.path && (inference.path = !0));
          continue;
        }
        if (
          (!inference.query &&
            (access('query', alias) ||
              code.includes('return ' + alias) ||
              code.includes('return ' + alias + '.query')) &&
            (inference.query = !0),
          !inference.headers && access('headers', alias) && (inference.headers = !0),
          !inference.body && access('body', alias) && (inference.body = !0),
          !inference.cookie && access('cookie', alias) && (inference.cookie = !0),
          !inference.set && access('set', alias) && (inference.set = !0),
          !inference.server && access('server', alias) && (inference.server = !0),
          !inference.route && access('route', alias) && (inference.route = !0),
          !inference.url && access('url', alias) && (inference.url = !0),
          !inference.path && access('path', alias) && (inference.path = !0),
          inference.query &&
            inference.headers &&
            inference.body &&
            inference.cookie &&
            inference.set &&
            inference.server &&
            inference.route &&
            inference.url &&
            inference.path)
        )
          break;
      }
    return aliases;
  },
  isContextPassToFunction = (context, body, inference) => {
    try {
      const captureFunction = new RegExp(`\\w\\((?:.*?)?${context}(?:.*?)?\\)`, 'gs'),
        exactParameter = new RegExp(`${context}(,|\\))`, 'gs'),
        length = body.length;
      let fn;
      for (
        fn = captureFunction.exec(body) + '';
        captureFunction.lastIndex !== 0 &&
        captureFunction.lastIndex < length + (fn ? fn.length : 0);
      ) {
        if (fn && exactParameter.test(fn))
          return (
            (inference.query = !0),
            (inference.headers = !0),
            (inference.body = !0),
            (inference.cookie = !0),
            (inference.set = !0),
            (inference.server = !0),
            (inference.url = !0),
            (inference.route = !0),
            (inference.path = !0),
            !0
          );
        fn = captureFunction.exec(body) + '';
      }
      const nextChar = body.charCodeAt(captureFunction.lastIndex);
      return nextChar === 41 || nextChar === 44
        ? ((inference.query = !0),
          (inference.headers = !0),
          (inference.body = !0),
          (inference.cookie = !0),
          (inference.set = !0),
          (inference.server = !0),
          (inference.url = !0),
          (inference.route = !0),
          (inference.path = !0),
          !0)
        : !1;
    } catch {
      return (
        console.log(
          '[Sucrose] warning: unexpected isContextPassToFunction error, you may continue development as usual but please report the following to maintainers:',
        ),
        console.log('--- body ---'),
        console.log(body),
        console.log('--- context ---'),
        console.log(context),
        !0
      );
    }
  };
var pendingGC,
  caches$1 = {};
var clearSucroseCache = (delay) => {
    delay === null ||
      isCloudflareWorker() ||
      (delay === void 0 && (delay = 295e3),
      pendingGC && clearTimeout(pendingGC),
      (pendingGC = setTimeout(() => {
        ((caches$1 = {}), (pendingGC = void 0), isBun && Bun.gc(!1));
      }, delay)),
      pendingGC.unref?.());
  },
  mergeInference = (a, b) => ({
    body: a.body || b.body,
    cookie: a.cookie || b.cookie,
    headers: a.headers || b.headers,
    query: a.query || b.query,
    set: a.set || b.set,
    server: a.server || b.server,
    url: a.url || b.url,
    route: a.route || b.route,
    path: a.path || b.path,
  }),
  sucrose = (
    lifeCycle,
    inference = {
      query: !1,
      headers: !1,
      body: !1,
      cookie: !1,
      set: !1,
      server: !1,
      url: !1,
      route: !1,
      path: !1,
    },
    settings = {},
  ) => {
    const events = [];
    (lifeCycle.request?.length && events.push(...lifeCycle.request),
      lifeCycle.beforeHandle?.length && events.push(...lifeCycle.beforeHandle),
      lifeCycle.parse?.length && events.push(...lifeCycle.parse),
      lifeCycle.error?.length && events.push(...lifeCycle.error),
      lifeCycle.transform?.length && events.push(...lifeCycle.transform),
      lifeCycle.afterHandle?.length && events.push(...lifeCycle.afterHandle),
      lifeCycle.mapResponse?.length && events.push(...lifeCycle.mapResponse),
      lifeCycle.afterResponse?.length && events.push(...lifeCycle.afterResponse),
      lifeCycle.handler &&
        typeof lifeCycle.handler == 'function' &&
        events.push(lifeCycle.handler));
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (!e) continue;
      const event = typeof e == 'object' ? e.fn : e;
      if (typeof event != 'function') continue;
      const content = event.toString(),
        key = checksum(content),
        cachedInference = caches$1[key];
      if (cachedInference) {
        inference = mergeInference(inference, cachedInference);
        continue;
      }
      clearSucroseCache(settings.gcTime);
      const fnInference = {
          query: !1,
          headers: !1,
          body: !1,
          cookie: !1,
          set: !1,
          server: !1,
          url: !1,
          route: !1,
          path: !1,
        },
        [parameter, body] = separateFunction(content),
        mainParameter = extractMainParameter(findParameterReference(parameter, fnInference));
      if (mainParameter) {
        const aliases = findAlias(mainParameter, body.slice(1, -1));
        aliases.splice(0, -1, mainParameter);
        let code = body;
        (code.charCodeAt(0) === 123 &&
          code.charCodeAt(body.length - 1) === 125 &&
          (code = code.slice(1, -1).trim()),
          isContextPassToFunction(mainParameter, code, fnInference) ||
            inferBodyReference(code, aliases, fnInference),
          !fnInference.query &&
            code.includes('return ' + mainParameter + '.query') &&
            (fnInference.query = !0));
      }
      if (
        (caches$1[key] || (caches$1[key] = fnInference),
        (inference = mergeInference(inference, fnInference)),
        inference.query &&
          inference.headers &&
          inference.body &&
          inference.cookie &&
          inference.set &&
          inference.server &&
          inference.url &&
          inference.route &&
          inference.path)
      )
        break;
    }
    return inference;
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/cookies.mjs
var import_dist = require_dist();
var import_fast_decode_uri_component = /* @__PURE__ */ __toESM(
  require_fast_decode_uri_component(),
  1,
);
var hashString = (str) => {
  let hash = 2166136261;
  const len = str.length;
  for (let i = 0; i < len; i++) ((hash ^= str.charCodeAt(i)), (hash = Math.imul(hash, 16777619)));
  return hash >>> 0;
};
var Cookie = class {
  constructor(name, jar, initial = /* @__PURE__ */ Object.create(null)) {
    this.name = name;
    this.jar = jar;
    this.initial = initial;
  }
  get cookie() {
    return this.jar[this.name] ?? this.initial;
  }
  set cookie(jar) {
    (this.name in this.jar || (this.jar[this.name] = this.initial),
      (this.jar[this.name] = jar),
      (this.valueHash = void 0));
  }
  get setCookie() {
    return (this.name in this.jar || (this.jar[this.name] = this.initial), this.jar[this.name]);
  }
  set setCookie(jar) {
    this.cookie = jar;
  }
  get value() {
    return this.cookie.value;
  }
  set value(value) {
    const current = this.cookie.value;
    if (current !== value) {
      if (
        typeof current == 'object' &&
        current !== null &&
        typeof value == 'object' &&
        value !== null
      )
        try {
          const valueStr = JSON.stringify(value),
            newHash = hashString(valueStr);
          if (this.valueHash !== void 0 && this.valueHash !== newHash) this.valueHash = newHash;
          else {
            if (JSON.stringify(current) === valueStr) {
              this.valueHash = newHash;
              return;
            }
            this.valueHash = newHash;
          }
        } catch {}
      (this.name in this.jar || (this.jar[this.name] = { ...this.initial }),
        (this.jar[this.name].value = value));
    }
  }
  get expires() {
    return this.cookie.expires;
  }
  set expires(expires) {
    this.setCookie.expires = expires;
  }
  get maxAge() {
    return this.cookie.maxAge;
  }
  set maxAge(maxAge) {
    this.setCookie.maxAge = maxAge;
  }
  get domain() {
    return this.cookie.domain;
  }
  set domain(domain) {
    this.setCookie.domain = domain;
  }
  get path() {
    return this.cookie.path;
  }
  set path(path) {
    this.setCookie.path = path;
  }
  get secure() {
    return this.cookie.secure;
  }
  set secure(secure) {
    this.setCookie.secure = secure;
  }
  get httpOnly() {
    return this.cookie.httpOnly;
  }
  set httpOnly(httpOnly) {
    this.setCookie.httpOnly = httpOnly;
  }
  get sameSite() {
    return this.cookie.sameSite;
  }
  set sameSite(sameSite) {
    this.setCookie.sameSite = sameSite;
  }
  get priority() {
    return this.cookie.priority;
  }
  set priority(priority) {
    this.setCookie.priority = priority;
  }
  get partitioned() {
    return this.cookie.partitioned;
  }
  set partitioned(partitioned) {
    this.setCookie.partitioned = partitioned;
  }
  get secrets() {
    return this.cookie.secrets;
  }
  set secrets(secrets) {
    this.setCookie.secrets = secrets;
  }
  update(config) {
    return (
      (this.setCookie = Object.assign(
        this.cookie,
        typeof config == 'function' ? config(this.cookie) : config,
      )),
      this
    );
  }
  set(config) {
    return (
      (this.setCookie = Object.assign(
        {
          ...this.initial,
          value: this.value,
        },
        typeof config == 'function' ? config(this.cookie) : config,
      )),
      this
    );
  }
  remove() {
    if (this.value !== void 0)
      return (
        this.set({
          expires: /* @__PURE__ */ new Date(0),
          maxAge: 0,
          value: '',
        }),
        this
      );
  }
  toString() {
    return typeof this.value == 'object'
      ? JSON.stringify(this.value)
      : (this.value?.toString() ?? '');
  }
};
var createCookieJar = (set, store, initial) => (
    set.cookie || (set.cookie = /* @__PURE__ */ Object.create(null)),
    new Proxy(store, {
      get(_, key) {
        return key in store
          ? new Cookie(key, set.cookie, Object.assign({}, initial ?? {}, store[key]))
          : new Cookie(key, set.cookie, Object.assign({}, initial));
      },
    })
  ),
  parseCookie = async (
    set,
    cookieString,
    { secrets, sign, ...initial } = /* @__PURE__ */ Object.create(null),
  ) => {
    if (!cookieString) return createCookieJar(set, /* @__PURE__ */ Object.create(null), initial);
    const isStringKey = typeof secrets == 'string';
    sign && sign !== !0 && !Array.isArray(sign) && (sign = [sign]);
    const jar = /* @__PURE__ */ Object.create(null),
      cookies = (0, import_dist.parse)(cookieString);
    for (const [name, v] of Object.entries(cookies)) {
      if (v === void 0 || name === '__proto__' || name === 'constructor' || name === 'prototype')
        continue;
      let value = (0, import_fast_decode_uri_component.default)(v);
      if (sign === !0 || sign?.includes(name)) {
        if (!secrets) throw new Error('No secret is provided to cookie plugin');
        if (isStringKey) {
          if (typeof value != 'string') throw new InvalidCookieSignature(name);
          const temp = await unsignCookie(value, secrets);
          if (temp === !1) throw new InvalidCookieSignature(name);
          value = temp;
        } else {
          let decoded = !1;
          for (let i = 0; i < secrets.length; i++) {
            if (typeof value != 'string') throw new InvalidCookieSignature(name);
            const temp = await unsignCookie(value, secrets[i]);
            if (temp !== !1) {
              ((decoded = !0), (value = temp));
              break;
            }
          }
          if (!decoded) throw new InvalidCookieSignature(name);
        }
      }
      if (value) {
        const starts = value.charCodeAt(0),
          ends = value.charCodeAt(value.length - 1);
        if ((starts === 123 && ends === 125) || (starts === 91 && ends === 93))
          try {
            value = JSON.parse(value);
          } catch {}
      }
      ((jar[name] = /* @__PURE__ */ Object.create(null)), (jar[name].value = value));
    }
    return createCookieJar(set, jar, initial);
  },
  serializeCookie = (cookies) => {
    if (!cookies || !isNotEmpty(cookies)) return;
    const set = [];
    for (const [key, property] of Object.entries(cookies)) {
      if (!key || !property) continue;
      const value = property.value;
      value != null &&
        set.push(
          (0, import_dist.serialize)(
            key,
            typeof value == 'object' ? JSON.stringify(value) : value + '',
            property,
          ),
        );
    }
    if (set.length !== 0) return set.length === 1 ? set[0] : set;
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/adapter/utils.mjs
var handleFile = (response, set, request) => {
    if (!isBun && response instanceof Promise)
      return response.then((res) => handleFile(res, set, request));
    const size = response.size,
      rangeHeader = request?.headers.get('range');
    if (rangeHeader) {
      const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
      if (match) {
        if (!match[1] && !match[2])
          return new Response(null, {
            status: 416,
            headers: mergeHeaders(
              new Headers({ 'content-range': `bytes */${size}` }),
              set?.headers ?? {},
            ),
          });
        let start, end;
        if (!match[1] && match[2]) {
          const suffix = parseInt(match[2]);
          ((start = Math.max(0, size - suffix)), (end = size - 1));
        } else
          ((start = match[1] ? parseInt(match[1]) : 0),
            (end = match[2] ? Math.min(parseInt(match[2]), size - 1) : size - 1));
        if (start >= size || start > end)
          return new Response(null, {
            status: 416,
            headers: mergeHeaders(
              new Headers({ 'content-range': `bytes */${size}` }),
              set?.headers ?? {},
            ),
          });
        const contentLength = end - start + 1,
          rangeHeaders = new Headers({
            'accept-ranges': 'bytes',
            'content-range': `bytes ${start}-${end}/${size}`,
            'content-length': String(contentLength),
          });
        return new Response(response.slice(start, end + 1, response.type), {
          status: 206,
          headers: mergeHeaders(rangeHeaders, set?.headers ?? {}),
        });
      }
    }
    const immutable =
        set &&
        (set.status === 206 || set.status === 304 || set.status === 412 || set.status === 416),
      defaultHeader = immutable
        ? {}
        : {
            'accept-ranges': 'bytes',
            'content-range': size ? `bytes 0-${size - 1}/${size}` : void 0,
          };
    if (!set && !size) return new Response(response);
    if (!set) return new Response(response, { headers: defaultHeader });
    if (set.headers instanceof Headers) {
      for (const key of Object.keys(defaultHeader))
        key in set.headers && set.headers.append(key, defaultHeader[key]);
      return (
        immutable && (set.headers.delete('content-length'), set.headers.delete('accept-ranges')),
        new Response(response, set)
      );
    }
    return isNotEmpty(set.headers)
      ? new Response(response, {
          status: set.status,
          headers: Object.assign(defaultHeader, set.headers),
        })
      : new Response(response, {
          status: set.status,
          headers: defaultHeader,
        });
  },
  parseSetCookies = (headers, setCookie) => {
    if (!headers) return headers;
    headers.delete('set-cookie');
    for (let i = 0; i < setCookie.length; i++) {
      const index = setCookie[i].indexOf('=');
      headers.append(
        'set-cookie',
        `${setCookie[i].slice(0, index)}=${setCookie[i].slice(index + 1) || ''}`,
      );
    }
    return headers;
  },
  responseToSetHeaders = (response, set) => {
    if (set?.headers) {
      if (response)
        if (hasHeaderShorthand) Object.assign(set.headers, response.headers.toJSON());
        else
          for (const [key, value] of response.headers.entries())
            key in set.headers && (set.headers[key] = value);
      return (
        set.status === 200 && (set.status = response.status),
        set.headers['content-encoding'] && delete set.headers['content-encoding'],
        set
      );
    }
    if (!response)
      return {
        headers: {},
        status: set?.status ?? 200,
      };
    if (hasHeaderShorthand)
      return (
        (set = {
          headers: response.headers.toJSON(),
          status: set?.status ?? 200,
        }),
        set.headers['content-encoding'] && delete set.headers['content-encoding'],
        set
      );
    set = {
      headers: {},
      status: set?.status ?? 200,
    };
    for (const [key, value] of response.headers.entries())
      key !== 'content-encoding' && key in set.headers && (set.headers[key] = value);
    return set;
  },
  enqueueBinaryChunk = (controller, chunk) =>
    chunk instanceof Blob
      ? chunk.arrayBuffer().then((buffer) => (controller.enqueue(new Uint8Array(buffer)), !0))
      : chunk instanceof Uint8Array
        ? (controller.enqueue(chunk), !0)
        : chunk instanceof ArrayBuffer
          ? (controller.enqueue(new Uint8Array(chunk)), !0)
          : ArrayBuffer.isView(chunk)
            ? (controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)),
              !0)
            : !1,
  createStreamHandler =
    ({ mapResponse, mapCompactResponse }) =>
    async (generator, set, request, skipFormat) => {
      let init = generator.next?.();
      if (
        (set && handleSet(set),
        init instanceof Promise && (init = await init),
        init?.value instanceof ReadableStream)
      )
        generator = init.value;
      else if (init && (typeof init?.done > 'u' || init?.done))
        return set
          ? mapResponse(init.value, set, request)
          : mapCompactResponse(init.value, request);
      const isSSE =
          !skipFormat &&
          (init?.value?.sse ??
            generator?.sse ??
            set?.headers['content-type']?.startsWith('text/event-stream')),
        format = isSSE
          ? (data) => `data: ${data}

`
          : (data) => data,
        contentType = isSSE
          ? 'text/event-stream'
          : init?.value && typeof init?.value == 'object'
            ? 'application/json'
            : 'text/plain';
      set?.headers
        ? (set.headers['transfer-encoding'] || (set.headers['transfer-encoding'] = 'chunked'),
          set.headers['content-type'] || (set.headers['content-type'] = contentType),
          set.headers['cache-control'] || (set.headers['cache-control'] = 'no-cache'))
        : (set = {
            status: 200,
            headers: {
              'content-type': contentType,
              'transfer-encoding': 'chunked',
              'cache-control': 'no-cache',
              connection: 'keep-alive',
            },
          });
      const iterator =
        typeof generator.next == 'function' ? generator : generator[Symbol.asyncIterator]();
      let end = !1;
      return new Response(
        new ReadableStream({
          start(controller) {
            if (
              (request?.signal?.addEventListener('abort', () => {
                ((end = !0), iterator.return?.());
                try {
                  controller.close();
                } catch {}
              }),
              !(
                !init ||
                init.value instanceof ReadableStream ||
                init.value === void 0 ||
                init.value === null
              ))
            )
              if (init.value.toSSE) controller.enqueue(init.value.toSSE());
              else {
                if (enqueueBinaryChunk(controller, init.value)) return;
                if (typeof init.value == 'object')
                  try {
                    controller.enqueue(format(JSON.stringify(init.value)));
                  } catch {
                    controller.enqueue(format(init.value.toString()));
                  }
                else controller.enqueue(format(init.value.toString()));
              }
          },
          async pull(controller) {
            if (end) {
              try {
                controller.close();
              } catch {}
              return;
            }
            try {
              const { value: chunk, done } = await iterator.next();
              if (done || end) {
                try {
                  controller.close();
                } catch {}
                return;
              }
              if (chunk == null) return;
              if (chunk.toSSE) controller.enqueue(chunk.toSSE());
              else {
                if (enqueueBinaryChunk(controller, chunk)) return;
                if (typeof chunk == 'object')
                  try {
                    controller.enqueue(format(JSON.stringify(chunk)));
                  } catch {
                    controller.enqueue(format(chunk.toString()));
                  }
                else controller.enqueue(format(chunk.toString()));
              }
            } catch (error) {
              console.warn(error);
              try {
                controller.close();
              } catch {}
            }
          },
          cancel() {
            ((end = !0), iterator.return?.());
          },
        }),
        set,
      );
    };
async function* streamResponse(response) {
  const body = response.body;
  if (!body) return;
  const reader = body.getReader(),
    decoder = new TextDecoder();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      typeof value == 'string' ? yield value : yield decoder.decode(value);
    }
  } finally {
    reader.releaseLock();
  }
}
var handleSet = (set) => {
  if (
    (typeof set.status == 'string' && (set.status = StatusMap[set.status]),
    set.cookie && isNotEmpty(set.cookie))
  ) {
    const cookie = serializeCookie(set.cookie);
    cookie && (set.headers['set-cookie'] = cookie);
  }
  set.headers['set-cookie'] &&
    Array.isArray(set.headers['set-cookie']) &&
    (set.headers = parseSetCookies(new Headers(set.headers), set.headers['set-cookie']));
};
function mergeHeaders(responseHeaders, setHeaders) {
  const headers = new Headers(responseHeaders);
  if (setHeaders instanceof Headers)
    for (const key of setHeaders.keys())
      if (key === 'set-cookie') {
        if (headers.has('set-cookie')) continue;
        for (const cookie of setHeaders.getSetCookie()) headers.append('set-cookie', cookie);
      } else responseHeaders.has(key) || headers.set(key, setHeaders?.get(key) ?? '');
  else
    for (const key in setHeaders)
      key === 'set-cookie'
        ? headers.append(key, setHeaders[key])
        : responseHeaders.has(key) || headers.set(key, setHeaders[key]);
  return headers;
}
function mergeStatus(responseStatus, setStatus) {
  return (
    typeof setStatus == 'string' && (setStatus = StatusMap[setStatus]),
    responseStatus === 200 ? setStatus : responseStatus
  );
}
var createResponseHandler = (handler) => {
  const handleStream = createStreamHandler(handler);
  return (response, set, request) => {
    const newResponse = new Response(response.body, {
      headers: mergeHeaders(response.headers, set.headers),
      status: mergeStatus(response.status, set.status),
    });
    return !newResponse.headers.has('content-length') &&
      newResponse.headers.get('transfer-encoding') === 'chunked'
      ? handleStream(
          streamResponse(newResponse),
          responseToSetHeaders(newResponse, set),
          request,
          !0,
        )
      : newResponse;
  };
};
async function tee(source, branches = 2) {
  const buffer = [];
  let done = !1,
    waiting = [];
  (async () => {
    for await (const value of source)
      (buffer.push(value), waiting.forEach((w) => w.resolve()), (waiting = []));
    ((done = !0), waiting.forEach((w) => w.resolve()));
  })();
  async function* makeIterator() {
    let i = 0;
    for (;;)
      if (i < buffer.length) yield buffer[i++];
      else {
        if (done) return;
        await new Promise((resolve) => waiting.push({ resolve }));
      }
  }
  return Array.from({ length: branches }, makeIterator);
}
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/adapter/web-standard/handler.mjs
var handleElysiaFile = (file, set = { headers: {} }, request) => {
    const path = file.path,
      contentType = mime[path.slice(path.lastIndexOf('.') + 1)];
    return (
      contentType && (set.headers['content-type'] = contentType),
      file.stats &&
      set.status !== 206 &&
      set.status !== 304 &&
      set.status !== 412 &&
      set.status !== 416
        ? file.stats.then((stat) => {
            const size = stat.size;
            return (
              size !== void 0 &&
                ((set.headers['content-range'] = `bytes 0-${size - 1}/${size}`),
                (set.headers['content-length'] = size)),
              handleFile(file.value, set, request)
            );
          })
        : handleFile(file.value, set, request)
    );
  },
  mapResponse$1 = (response, set, request) => {
    if (isNotEmpty(set.headers) || set.status !== 200 || set.cookie)
      switch ((handleSet(set), response?.constructor?.name)) {
        case 'String':
          return (
            set.headers['content-type'] || (set.headers['content-type'] = 'text/plain'),
            new Response(response, set)
          );
        case 'Array':
        case 'Object':
          return (
            set.headers['content-type'] || (set.headers['content-type'] = 'application/json'),
            new Response(JSON.stringify(response), set)
          );
        case 'ElysiaFile':
          return handleElysiaFile(response, set, request);
        case 'File':
          return handleFile(response, set, request);
        case 'Blob':
          return handleFile(response, set, request);
        case 'ElysiaCustomStatusResponse':
          return ((set.status = response.code), mapResponse$1(response.response, set, request));
        case void 0:
          return response ? new Response(JSON.stringify(response), set) : new Response('', set);
        case 'Response':
          return handleResponse$1(response, set, request);
        case 'Error':
          return errorToResponse$1(response, set);
        case 'Promise':
          return response.then((x) => mapResponse$1(x, set, request));
        case 'Function':
          return mapResponse$1(response(), set, request);
        case 'Number':
        case 'Boolean':
          return new Response(response.toString(), set);
        case 'Cookie':
          return response instanceof Cookie
            ? new Response(response.value, set)
            : new Response(response?.toString(), set);
        case 'FormData':
          return new Response(response, set);
        default:
          if (response instanceof Response) return handleResponse$1(response, set, request);
          if (response instanceof Promise) return response.then((x) => mapResponse$1(x, set));
          if (response instanceof Error) return errorToResponse$1(response, set);
          if (response instanceof ElysiaCustomStatusResponse)
            return ((set.status = response.code), mapResponse$1(response.response, set, request));
          if (typeof response?.next == 'function' || response instanceof ReadableStream)
            return handleStream$1(response, set, request);
          if (typeof response?.then == 'function')
            return response.then((x) => mapResponse$1(x, set));
          if (Array.isArray(response))
            return new Response(JSON.stringify(response), {
              headers: { 'Content-Type': 'application/json' },
            });
          if (typeof response?.toResponse == 'function')
            return mapResponse$1(response.toResponse(), set);
          if ('charCodeAt' in response) {
            const code = response.charCodeAt(0);
            if (code === 123 || code === 91)
              return (
                set.headers['Content-Type'] || (set.headers['Content-Type'] = 'application/json'),
                new Response(JSON.stringify(response), set)
              );
          }
          return new Response(response, set);
      }
    return typeof response?.next == 'function' || response instanceof ReadableStream
      ? handleStream$1(response, set, request)
      : mapCompactResponse$1(response, request);
  },
  mapEarlyResponse$1 = (response, set, request) => {
    if (response != null)
      if (isNotEmpty(set.headers) || set.status !== 200 || set.cookie)
        switch ((handleSet(set), response?.constructor?.name)) {
          case 'String':
            return (
              set.headers['content-type'] || (set.headers['content-type'] = 'text/plain'),
              new Response(response, set)
            );
          case 'Array':
          case 'Object':
            return (
              set.headers['content-type'] || (set.headers['content-type'] = 'application/json'),
              new Response(JSON.stringify(response), set)
            );
          case 'ElysiaFile':
            return handleElysiaFile(response, set, request);
          case 'File':
            return handleFile(response, set, request);
          case 'Blob':
            return handleFile(response, set, request);
          case 'ElysiaCustomStatusResponse':
            return (
              (set.status = response.code), mapEarlyResponse$1(response.response, set, request)
            );
          case void 0:
            return response ? new Response(JSON.stringify(response), set) : void 0;
          case 'Response':
            return handleResponse$1(response, set, request);
          case 'Promise':
            return response.then((x) => mapEarlyResponse$1(x, set));
          case 'Error':
            return errorToResponse$1(response, set);
          case 'Function':
            return mapEarlyResponse$1(response(), set);
          case 'Number':
          case 'Boolean':
            return new Response(response.toString(), set);
          case 'FormData':
            return new Response(response);
          case 'Cookie':
            return response instanceof Cookie
              ? new Response(response.value, set)
              : new Response(response?.toString(), set);
          default:
            if (response instanceof Response) return handleResponse$1(response, set, request);
            if (response instanceof Promise)
              return response.then((x) => mapEarlyResponse$1(x, set));
            if (response instanceof Error) return errorToResponse$1(response, set);
            if (response instanceof ElysiaCustomStatusResponse)
              return (
                (set.status = response.code), mapEarlyResponse$1(response.response, set, request)
              );
            if (typeof response?.next == 'function' || response instanceof ReadableStream)
              return handleStream$1(response, set, request);
            if (typeof response?.then == 'function')
              return response.then((x) => mapEarlyResponse$1(x, set));
            if (typeof response?.toResponse == 'function')
              return mapEarlyResponse$1(response.toResponse(), set);
            if (Array.isArray(response))
              return new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json' },
              });
            if ('charCodeAt' in response) {
              const code = response.charCodeAt(0);
              if (code === 123 || code === 91)
                return (
                  set.headers['Content-Type'] || (set.headers['Content-Type'] = 'application/json'),
                  new Response(JSON.stringify(response), set)
                );
            }
            return new Response(response, set);
        }
      else
        switch (response?.constructor?.name) {
          case 'String':
            return (
              set.headers['content-type'] || (set.headers['content-type'] = 'text/plain'),
              new Response(response)
            );
          case 'Array':
          case 'Object':
            return (
              set.headers['content-type'] || (set.headers['content-type'] = 'application/json'),
              new Response(JSON.stringify(response), set)
            );
          case 'ElysiaFile':
            return handleElysiaFile(response, set, request);
          case 'File':
            return handleFile(response, set, request);
          case 'Blob':
            return handleFile(response, set, request);
          case 'ElysiaCustomStatusResponse':
            return (
              (set.status = response.code), mapEarlyResponse$1(response.response, set, request)
            );
          case void 0:
            return response
              ? new Response(JSON.stringify(response), {
                  headers: { 'content-type': 'application/json' },
                })
              : new Response('');
          case 'Response':
            return response;
          case 'Promise':
            return response.then((x) => {
              const r = mapEarlyResponse$1(x, set);
              if (r !== void 0) return r;
            });
          case 'Error':
            return errorToResponse$1(response, set);
          case 'Function':
            return mapCompactResponse$1(response(), request);
          case 'Number':
          case 'Boolean':
            return new Response(response.toString());
          case 'Cookie':
            return response instanceof Cookie
              ? new Response(response.value, set)
              : new Response(response?.toString(), set);
          case 'FormData':
            return new Response(response);
          default:
            if (response instanceof Response) return response;
            if (response instanceof Promise)
              return response.then((x) => mapEarlyResponse$1(x, set));
            if (response instanceof Error) return errorToResponse$1(response, set);
            if (response instanceof ElysiaCustomStatusResponse)
              return (
                (set.status = response.code), mapEarlyResponse$1(response.response, set, request)
              );
            if (typeof response?.next == 'function' || response instanceof ReadableStream)
              return handleStream$1(response, set, request);
            if (typeof response?.then == 'function')
              return response.then((x) => mapEarlyResponse$1(x, set));
            if (typeof response?.toResponse == 'function')
              return mapEarlyResponse$1(response.toResponse(), set);
            if (Array.isArray(response))
              return new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json' },
              });
            if ('charCodeAt' in response) {
              const code = response.charCodeAt(0);
              if (code === 123 || code === 91)
                return (
                  set.headers['Content-Type'] || (set.headers['Content-Type'] = 'application/json'),
                  new Response(JSON.stringify(response), set)
                );
            }
            return new Response(response);
        }
  },
  mapCompactResponse$1 = (response, request) => {
    switch (response?.constructor?.name) {
      case 'String':
        return new Response(response, { headers: { 'Content-Type': 'text/plain' } });
      case 'Object':
      case 'Array':
        return new Response(JSON.stringify(response), {
          headers: { 'Content-Type': 'application/json' },
        });
      case 'ElysiaFile':
        return handleElysiaFile(response, void 0, request);
      case 'File':
        return handleFile(response, void 0, request);
      case 'Blob':
        return handleFile(response, void 0, request);
      case 'ElysiaCustomStatusResponse':
        return mapResponse$1(response.response, {
          status: response.code,
          headers: {},
        });
      case void 0:
        return response
          ? new Response(JSON.stringify(response), {
              headers: { 'content-type': 'application/json' },
            })
          : new Response('');
      case 'Response':
        return response;
      case 'Error':
        return errorToResponse$1(response);
      case 'Promise':
        return response.then((x) => mapCompactResponse$1(x, request));
      case 'Function':
        return mapCompactResponse$1(response(), request);
      case 'Number':
      case 'Boolean':
        return new Response(response.toString());
      case 'FormData':
        return new Response(response);
      default:
        if (response instanceof Response) return response;
        if (response instanceof Promise)
          return response.then((x) => mapCompactResponse$1(x, request));
        if (response instanceof Error) return errorToResponse$1(response);
        if (response instanceof ElysiaCustomStatusResponse)
          return mapResponse$1(response.response, {
            status: response.code,
            headers: {},
          });
        if (typeof response?.next == 'function' || response instanceof ReadableStream)
          return handleStream$1(response, void 0, request);
        if (typeof response?.then == 'function')
          return response.then((x) => mapCompactResponse$1(x, request));
        if (typeof response?.toResponse == 'function')
          return mapCompactResponse$1(response.toResponse());
        if (Array.isArray(response))
          return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' },
          });
        if ('charCodeAt' in response) {
          const code = response.charCodeAt(0);
          if (code === 123 || code === 91)
            return new Response(JSON.stringify(response), {
              headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(response);
    }
  },
  errorToResponse$1 = (error, set) => {
    if (typeof error?.toResponse == 'function') {
      const raw = error.toResponse(),
        targetSet = set ?? {
          headers: {},
          status: 200,
          redirect: '',
        },
        apply = (resolved) => (
          resolved instanceof Response && (targetSet.status = resolved.status),
          mapResponse$1(resolved, targetSet)
        );
      return typeof raw?.then == 'function' ? raw.then(apply) : apply(raw);
    }
    return new Response(
      JSON.stringify({
        name: error?.name,
        message: error?.message,
        cause: error?.cause,
      }),
      {
        status: set?.status !== 200 ? (set?.status ?? 500) : 500,
        headers: set?.headers,
      },
    );
  },
  createStaticHandler$1 = (handle, hooks, setHeaders = {}) => {
    if (typeof handle == 'function') return;
    const response = mapResponse$1(handle, { headers: setHeaders });
    if (
      !hooks.parse?.length &&
      !hooks.transform?.length &&
      !hooks.beforeHandle?.length &&
      !hooks.afterHandle?.length
    )
      return () => response.clone();
  },
  handleResponse$1 = createResponseHandler({
    mapResponse: mapResponse$1,
    mapCompactResponse: mapCompactResponse$1,
  }),
  handleStream$1 = createStreamHandler({
    mapResponse: mapResponse$1,
    mapCompactResponse: mapCompactResponse$1,
  });
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/adapter/web-standard/index.mjs
var WebStandardAdapter = {
  name: 'web-standard',
  isWebStandard: !0,
  handler: {
    mapResponse: mapResponse$1,
    mapEarlyResponse: mapEarlyResponse$1,
    mapCompactResponse: mapCompactResponse$1,
    createStaticHandler: createStaticHandler$1,
  },
  composeHandler: {
    mapResponseContext: 'c.request',
    preferWebstandardHeaders: !0,
    headers: `c.headers={}
for(const [k,v] of c.request.headers.entries())c.headers[k]=v
`,
    parser: {
      json(isOptional) {
        return isOptional
          ? `try{c.body=await c.request.json()}catch{}
`
          : `c.body=await c.request.json()
`;
      },
      text() {
        return `c.body=await c.request.text()
`;
      },
      urlencoded() {
        return `c.body=parseQuery(await c.request.text())
`;
      },
      arrayBuffer() {
        return `c.body=await c.request.arrayBuffer()
`;
      },
      formData(isOptional) {
        let fnLiteral = `
c.body={}
`;
        return (
          isOptional
            ? (fnLiteral += 'let form;try{form=await c.request.formData()}catch{}')
            : (fnLiteral += `const form=await c.request.formData()
`),
          fnLiteral +
            `const dangerousKeys=new Set(['__proto__','constructor','prototype'])
const isDangerousKey=(k)=>{if(dangerousKeys.has(k))return true;const m=k.match(/^(.+)\\[(\\d+)\\]$/);return m?dangerousKeys.has(m[1]):false}
const parseArrayKey=(k)=>{const m=k.match(/^(.+)\\[(\\d+)\\]$/);return m?{name:m[1],index:parseInt(m[2],10)}:null}
for(const key of form.keys()){if(c.body[key])continue
const value=form.getAll(key)
let finalValue
if(value.length===1){
const sv=value[0]
if(typeof sv==='string'&&(sv.charCodeAt(0)===123||sv.charCodeAt(0)===91)){
try{
const p=JSON.parse(sv)
if(p&&typeof p==='object')finalValue=p
}catch{}
}
if(finalValue===undefined)finalValue=sv
}else finalValue=value
if(Array.isArray(finalValue)){
const stringValue=finalValue.find((entry)=>typeof entry==='string')
const files=typeof File==='undefined'?[]:finalValue.filter((entry)=>entry instanceof File)
if(stringValue&&files.length&&stringValue.charCodeAt(0)===123){
try{
const parsed=JSON.parse(stringValue)
if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed)){
if(!('file' in parsed)&&files.length===1)parsed.file=files[0]
else if(!('files' in parsed)&&files.length>1)parsed.files=files
finalValue=parsed
}
}catch{}
}
}
if(key.includes('.')||key.includes('[')){const keys=key.split('.')
const lastKey=keys.pop()
if(isDangerousKey(lastKey)||keys.some(isDangerousKey))continue
let current=c.body
for(const k of keys){const arrayInfo=parseArrayKey(k)
if(arrayInfo){if(!Array.isArray(current[arrayInfo.name]))current[arrayInfo.name]=[]
const existing=current[arrayInfo.name][arrayInfo.index]
const isFile=typeof File!=='undefined'&&existing instanceof File
if(!existing||typeof existing!=='object'||Array.isArray(existing)||isFile){
let parsed
if(typeof existing==='string'&&existing.charCodeAt(0)===123){
try{parsed=JSON.parse(existing)
if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))parsed=undefined}catch{}
}
current[arrayInfo.name][arrayInfo.index]=parsed||{}
}
current=current[arrayInfo.name][arrayInfo.index]}else{if(!current[k]||typeof current[k]!=='object')current[k]={}
current=current[k]}}
const arrayInfo=parseArrayKey(lastKey)
if(arrayInfo){if(!Array.isArray(current[arrayInfo.name]))current[arrayInfo.name]=[]
current[arrayInfo.name][arrayInfo.index]=finalValue}else{current[lastKey]=finalValue}}else c.body[key]=finalValue}`
        );
      },
    },
  },
  async stop(app, closeActiveConnections) {
    if (!app.server)
      throw new Error("Elysia isn't running. Call `app.listen` to start the server.");
    if (
      app.server &&
      (await app.server.stop(closeActiveConnections), (app.server = null), app.event.stop?.length)
    )
      for (let i = 0; i < app.event.stop.length; i++) app.event.stop[i].fn(app);
  },
  composeGeneralHandler: {
    parameters: 'r',
    createContext(app) {
      let decoratorsLiteral = '',
        fnLiteral = '';
      const defaultHeaders = app.setHeaders;
      for (const key of Object.keys(app.decorator))
        decoratorsLiteral += `,'${key}':decorator['${key}']`;
      const standardHostname = app.config.handler?.standardHostname ?? !0,
        hasTrace = !!app.event.trace?.length;
      return (
        (fnLiteral += `const u=r.url,s=u.indexOf('/',${standardHostname ? 11 : 7}),qi=u.indexOf('?',s+1),p=u.substring(s,qi===-1?undefined:qi)
`),
        hasTrace &&
          (fnLiteral += `const id=randomId()
`),
        (fnLiteral += 'const c={request:r,store,qi,path:p,url:u,redirect,status,set:{headers:'),
        (fnLiteral += Object.keys(defaultHeaders ?? {}).length
          ? 'Object.assign({},app.setHeaders)'
          : 'Object.create(null)'),
        (fnLiteral += ',status:200}'),
        app.inference.server && (fnLiteral += ',get server(){return app.getServer()}'),
        hasTrace && (fnLiteral += ',[ELYSIA_REQUEST_ID]:id'),
        (fnLiteral += decoratorsLiteral),
        (fnLiteral += `}
`),
        fnLiteral
      );
    },
    error404(hasEventHook, hasErrorHook, afterHandle = '') {
      let findDynamicRoute =
        'if(route===null){' +
        afterHandle +
        (hasErrorHook ? '' : 'c.set.status=404') +
        `
return `;
      return (
        hasErrorHook
          ? (findDynamicRoute += `app.handleError(c,notFound,false,${this.parameters})`)
          : (findDynamicRoute += hasEventHook
              ? 'c.response=c.responseValue=new Response(error404Message,{status:c.set.status===200?404:c.set.status,headers:c.set.headers})'
              : 'c.response=c.responseValue=error404.clone()'),
        (findDynamicRoute += '}'),
        {
          declare: hasErrorHook
            ? ''
            : `const error404Message=notFound.message.toString()
const error404=new Response(error404Message,{status:404})
`,
          code: findDynamicRoute,
        }
      );
    },
  },
  composeError: {
    mapResponseContext: '',
    validationError:
      "set.headers['content-type']='application/json';return mapResponse(error.message,set)",
    unknownError: 'set.status=error.status??set.status??500;return mapResponse(error.message,set)',
  },
  listen() {
    return () => {
      throw new Error(
        'WebStandard does not support listen, you might want to export default Elysia.fetch instead',
      );
    };
  },
};
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/adapter/bun/handler.mjs
var mapResponse = (response, set, request) => {
    if (isNotEmpty(set.headers) || set.status !== 200 || set.cookie)
      switch ((handleSet(set), response?.constructor?.name)) {
        case 'String':
          return new Response(response, set);
        case 'Array':
        case 'Object':
          return Response.json(response, set);
        case 'ElysiaFile':
          return handleFile(response.value, set, request);
        case 'File':
          return handleFile(response, set, request);
        case 'Blob':
          return handleFile(response, set, request);
        case 'ElysiaCustomStatusResponse':
          return ((set.status = response.code), mapResponse(response.response, set, request));
        case void 0:
          return response ? Response.json(response, set) : new Response('', set);
        case 'Response':
          return handleResponse(response, set, request);
        case 'Error':
          return errorToResponse(response, set);
        case 'Promise':
          return response.then((x) => mapResponse(x, set, request));
        case 'Function':
          return mapResponse(response(), set, request);
        case 'Number':
        case 'Boolean':
          return new Response(response.toString(), set);
        case 'Cookie':
          return response instanceof Cookie
            ? new Response(response.value, set)
            : new Response(response?.toString(), set);
        case 'FormData':
          return new Response(response, set);
        default:
          if (response instanceof Response) return handleResponse(response, set, request);
          if (response instanceof Promise) return response.then((x) => mapResponse(x, set));
          if (response instanceof Error) return errorToResponse(response, set);
          if (response instanceof ElysiaCustomStatusResponse)
            return ((set.status = response.code), mapResponse(response.response, set, request));
          if (typeof response?.next == 'function' || response instanceof ReadableStream)
            return handleStream(response, set, request);
          if (typeof response?.then == 'function') return response.then((x) => mapResponse(x, set));
          if (Array.isArray(response)) return Response.json(response);
          if (typeof response?.toResponse == 'function')
            return mapResponse(response.toResponse(), set);
          if ('charCodeAt' in response) {
            const code = response.charCodeAt(0);
            if (code === 123 || code === 91) return Response.json(response, set);
          }
          return new Response(response, set);
      }
    return typeof response?.next == 'function' || response instanceof ReadableStream
      ? handleStream(response, set, request)
      : mapCompactResponse(response, request);
  },
  mapEarlyResponse = (response, set, request) => {
    if (response != null)
      if (isNotEmpty(set.headers) || set.status !== 200 || set.cookie)
        switch ((handleSet(set), response?.constructor?.name)) {
          case 'String':
            return new Response(response, set);
          case 'Array':
          case 'Object':
            return Response.json(response, set);
          case 'ElysiaFile':
            return handleFile(response.value, set, request);
          case 'File':
            return handleFile(response, set, request);
          case 'Blob':
            return handleFile(response, set, request);
          case 'ElysiaCustomStatusResponse':
            return (
              (set.status = response.code), mapEarlyResponse(response.response, set, request)
            );
          case void 0:
            return response ? Response.json(response, set) : void 0;
          case 'Response':
            return handleResponse(response, set, request);
          case 'Promise':
            return response.then((x) => mapEarlyResponse(x, set));
          case 'Error':
            return errorToResponse(response, set);
          case 'Function':
            return mapEarlyResponse(response(), set);
          case 'Number':
          case 'Boolean':
            return new Response(response.toString(), set);
          case 'FormData':
            return new Response(response);
          case 'Cookie':
            return response instanceof Cookie
              ? new Response(response.value, set)
              : new Response(response?.toString(), set);
          default:
            if (response instanceof Response) return handleResponse(response, set, request);
            if (response instanceof Promise) return response.then((x) => mapEarlyResponse(x, set));
            if (response instanceof Error) return errorToResponse(response, set);
            if (response instanceof ElysiaCustomStatusResponse)
              return (
                (set.status = response.code), mapEarlyResponse(response.response, set, request)
              );
            if (typeof response?.next == 'function' || response instanceof ReadableStream)
              return handleStream(response, set, request);
            if (typeof response?.then == 'function')
              return response.then((x) => mapEarlyResponse(x, set));
            if (typeof response?.toResponse == 'function')
              return mapEarlyResponse(response.toResponse(), set);
            if (Array.isArray(response)) return Response.json(response);
            if ('charCodeAt' in response) {
              const code = response.charCodeAt(0);
              if (code === 123 || code === 91) return Response.json(response, set);
            }
            return new Response(response, set);
        }
      else
        switch (response?.constructor?.name) {
          case 'String':
            return new Response(response);
          case 'Array':
          case 'Object':
            return Response.json(response, set);
          case 'ElysiaFile':
            return handleFile(response.value, set, request);
          case 'File':
            return handleFile(response, set, request);
          case 'Blob':
            return handleFile(response, set, request);
          case 'ElysiaCustomStatusResponse':
            return (
              (set.status = response.code), mapEarlyResponse(response.response, set, request)
            );
          case void 0:
            return response ? Response.json(response) : new Response('');
          case 'Response':
            return response;
          case 'Promise':
            return response.then((x) => {
              const r = mapEarlyResponse(x, set);
              if (r !== void 0) return r;
            });
          case 'Error':
            return errorToResponse(response, set);
          case 'Function':
            return mapCompactResponse(response(), request);
          case 'Number':
          case 'Boolean':
            return new Response(response.toString());
          case 'Cookie':
            return response instanceof Cookie
              ? new Response(response.value, set)
              : new Response(response?.toString(), set);
          case 'FormData':
            return new Response(response);
          default:
            if (response instanceof Response) return response;
            if (response instanceof Promise) return response.then((x) => mapEarlyResponse(x, set));
            if (response instanceof Error) return errorToResponse(response, set);
            if (response instanceof ElysiaCustomStatusResponse)
              return (
                (set.status = response.code), mapEarlyResponse(response.response, set, request)
              );
            if (typeof response?.next == 'function' || response instanceof ReadableStream)
              return handleStream(response, set, request);
            if (typeof response?.then == 'function')
              return response.then((x) => mapEarlyResponse(x, set));
            if (typeof response?.toResponse == 'function')
              return mapEarlyResponse(response.toResponse(), set);
            if (Array.isArray(response)) return Response.json(response);
            if ('charCodeAt' in response) {
              const code = response.charCodeAt(0);
              if (code === 123 || code === 91) return Response.json(response, set);
            }
            return new Response(response);
        }
  },
  mapCompactResponse = (response, request) => {
    switch (response?.constructor?.name) {
      case 'String':
        return new Response(response);
      case 'Object':
      case 'Array':
        return Response.json(response);
      case 'ElysiaFile':
        return handleFile(response.value, void 0, request);
      case 'File':
        return handleFile(response, void 0, request);
      case 'Blob':
        return handleFile(response, void 0, request);
      case 'ElysiaCustomStatusResponse':
        return mapResponse(response.response, {
          status: response.code,
          headers: {},
        });
      case void 0:
        return response ? Response.json(response) : new Response('');
      case 'Response':
        return response;
      case 'Error':
        return errorToResponse(response);
      case 'Promise':
        return response.then((x) => mapCompactResponse(x, request));
      case 'Function':
        return mapCompactResponse(response(), request);
      case 'Number':
      case 'Boolean':
        return new Response(response.toString());
      case 'FormData':
        return new Response(response);
      default:
        if (response instanceof Response) return response;
        if (response instanceof Promise)
          return response.then((x) => mapCompactResponse(x, request));
        if (response instanceof Error) return errorToResponse(response);
        if (response instanceof ElysiaCustomStatusResponse)
          return mapResponse(response.response, {
            status: response.code,
            headers: {},
          });
        if (typeof response?.next == 'function' || response instanceof ReadableStream)
          return handleStream(response, void 0, request);
        if (typeof response?.then == 'function')
          return response.then((x) => mapCompactResponse(x, request));
        if (typeof response?.toResponse == 'function')
          return mapCompactResponse(response.toResponse());
        if (Array.isArray(response)) return Response.json(response);
        if ('charCodeAt' in response) {
          const code = response.charCodeAt(0);
          if (code === 123 || code === 91) return Response.json(response);
        }
        return new Response(response);
    }
  },
  errorToResponse = (error, set) => {
    if (typeof error?.toResponse == 'function') {
      const raw = error.toResponse(),
        targetSet = set ?? {
          headers: {},
          status: 200,
          redirect: '',
        },
        apply = (resolved) => (
          resolved instanceof Response && (targetSet.status = resolved.status),
          mapResponse(resolved, targetSet)
        );
      return typeof raw?.then == 'function' ? raw.then(apply) : apply(raw);
    }
    return Response.json(
      {
        name: error?.name,
        message: error?.message,
        cause: error?.cause,
      },
      {
        status: set?.status !== 200 ? (set?.status ?? 500) : 500,
        headers: set?.headers,
      },
    );
  },
  createStaticHandler = (handle, hooks, setHeaders = {}) => {
    if (typeof handle == 'function') return;
    const response = mapResponse(handle, { headers: setHeaders });
    if (
      !hooks.parse?.length &&
      !hooks.transform?.length &&
      !hooks.beforeHandle?.length &&
      !hooks.afterHandle?.length
    )
      return () => response.clone();
  },
  handleResponse = createResponseHandler({
    mapResponse,
    mapCompactResponse,
  }),
  handleStream = createStreamHandler({
    mapResponse,
    mapCompactResponse,
  });
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/parse-query.mjs
var KEY_HAS_PLUS = 1,
  KEY_NEEDS_DECODE = 2,
  VALUE_HAS_PLUS = 4,
  VALUE_NEEDS_DECODE = 8;
function parseQueryFromURL(input, startIndex = 0, array, object) {
  const result = /* @__PURE__ */ Object.create(null);
  let flags = 0;
  const inputLength = input.length;
  let startingIndex = startIndex - 1,
    equalityIndex = startingIndex;
  for (let i = 0; i < inputLength; i++)
    switch (input.charCodeAt(i)) {
      case 38:
        (processKeyValuePair(input, i), (startingIndex = i), (equalityIndex = i), (flags = 0));
        break;
      case 61:
        equalityIndex <= startingIndex ? (equalityIndex = i) : (flags |= VALUE_NEEDS_DECODE);
        break;
      case 43:
        equalityIndex > startingIndex ? (flags |= VALUE_HAS_PLUS) : (flags |= KEY_HAS_PLUS);
        break;
      case 37:
        equalityIndex > startingIndex ? (flags |= VALUE_NEEDS_DECODE) : (flags |= KEY_NEEDS_DECODE);
        break;
    }
  return (startingIndex < inputLength && processKeyValuePair(input, inputLength), result);
  function processKeyValuePair(input2, endIndex) {
    const hasBothKeyValuePair = equalityIndex > startingIndex,
      effectiveEqualityIndex = hasBothKeyValuePair ? equalityIndex : endIndex,
      keySlice = input2.slice(startingIndex + 1, effectiveEqualityIndex);
    if (!hasBothKeyValuePair && keySlice.length === 0) return;
    let finalKey = keySlice;
    (flags & KEY_HAS_PLUS && (finalKey = finalKey.replace(/\+/g, ' ')),
      flags & KEY_NEEDS_DECODE &&
        (finalKey = (0, import_fast_decode_uri_component.default)(finalKey) || finalKey));
    let finalValue = '';
    if (hasBothKeyValuePair) {
      let valueSlice = input2.slice(equalityIndex + 1, endIndex);
      (flags & VALUE_HAS_PLUS && (valueSlice = valueSlice.replace(/\+/g, ' ')),
        flags & VALUE_NEEDS_DECODE &&
          (valueSlice = (0, import_fast_decode_uri_component.default)(valueSlice) || valueSlice),
        (finalValue = valueSlice));
    }
    const currentValue = result[finalKey];
    array && array?.[finalKey]
      ? finalValue.charCodeAt(0) === 91
        ? (object && object?.[finalKey]
            ? (finalValue = JSON.parse(finalValue))
            : (finalValue = finalValue.slice(1, -1).split(',')),
          currentValue === void 0
            ? (result[finalKey] = finalValue)
            : Array.isArray(currentValue)
              ? currentValue.push(...finalValue)
              : ((result[finalKey] = finalValue), result[finalKey].unshift(currentValue)))
        : currentValue === void 0
          ? (result[finalKey] = finalValue)
          : Array.isArray(currentValue)
            ? currentValue.push(finalValue)
            : (result[finalKey] = [currentValue, finalValue])
      : (result[finalKey] = finalValue);
  }
}
function parseQueryStandardSchema(input, startIndex = 0) {
  const result = /* @__PURE__ */ Object.create(null);
  let flags = 0;
  const inputLength = input.length;
  let startingIndex = startIndex - 1,
    equalityIndex = startingIndex;
  for (let i = 0; i < inputLength; i++)
    switch (input.charCodeAt(i)) {
      case 38:
        (processKeyValuePair(input, i), (startingIndex = i), (equalityIndex = i), (flags = 0));
        break;
      case 61:
        equalityIndex <= startingIndex ? (equalityIndex = i) : (flags |= VALUE_NEEDS_DECODE);
        break;
      case 43:
        equalityIndex > startingIndex ? (flags |= VALUE_HAS_PLUS) : (flags |= KEY_HAS_PLUS);
        break;
      case 37:
        equalityIndex > startingIndex ? (flags |= VALUE_NEEDS_DECODE) : (flags |= KEY_NEEDS_DECODE);
        break;
    }
  return (startingIndex < inputLength && processKeyValuePair(input, inputLength), result);
  function processKeyValuePair(input2, endIndex) {
    const hasBothKeyValuePair = equalityIndex > startingIndex,
      effectiveEqualityIndex = hasBothKeyValuePair ? equalityIndex : endIndex,
      keySlice = input2.slice(startingIndex + 1, effectiveEqualityIndex);
    if (!hasBothKeyValuePair && keySlice.length === 0) return;
    let finalKey = keySlice;
    (flags & KEY_HAS_PLUS && (finalKey = finalKey.replace(/\+/g, ' ')),
      flags & KEY_NEEDS_DECODE &&
        (finalKey = (0, import_fast_decode_uri_component.default)(finalKey) || finalKey));
    let finalValue = '';
    if (hasBothKeyValuePair) {
      let valueSlice = input2.slice(equalityIndex + 1, endIndex);
      (flags & VALUE_HAS_PLUS && (valueSlice = valueSlice.replace(/\+/g, ' ')),
        flags & VALUE_NEEDS_DECODE &&
          (valueSlice = (0, import_fast_decode_uri_component.default)(valueSlice) || valueSlice),
        (finalValue = valueSlice));
    }
    const currentValue = result[finalKey];
    if (finalValue.charCodeAt(0) === 91 && finalValue.charCodeAt(finalValue.length - 1) === 93) {
      try {
        finalValue = JSON.parse(finalValue);
      } catch {}
      currentValue === void 0
        ? (result[finalKey] = finalValue)
        : Array.isArray(currentValue)
          ? currentValue.push(finalValue)
          : (result[finalKey] = [currentValue, finalValue]);
    } else if (
      finalValue.charCodeAt(0) === 123 &&
      finalValue.charCodeAt(finalValue.length - 1) === 125
    ) {
      try {
        finalValue = JSON.parse(finalValue);
      } catch {}
      currentValue === void 0
        ? (result[finalKey] = finalValue)
        : Array.isArray(currentValue)
          ? currentValue.push(finalValue)
          : (result[finalKey] = [currentValue, finalValue]);
    } else
      (finalValue.includes(',') && (finalValue = finalValue.split(',')),
        currentValue === void 0
          ? (result[finalKey] = finalValue)
          : Array.isArray(currentValue)
            ? currentValue.push(finalValue)
            : (result[finalKey] = [currentValue, finalValue]));
  }
}
function parseQuery(input) {
  const result = /* @__PURE__ */ Object.create(null);
  let flags = 0;
  const inputLength = input.length;
  let startingIndex = -1,
    equalityIndex = -1;
  for (let i = 0; i < inputLength; i++)
    switch (input.charCodeAt(i)) {
      case 38:
        (processKeyValuePair(input, i), (startingIndex = i), (equalityIndex = i), (flags = 0));
        break;
      case 61:
        equalityIndex <= startingIndex ? (equalityIndex = i) : (flags |= VALUE_NEEDS_DECODE);
        break;
      case 43:
        equalityIndex > startingIndex ? (flags |= VALUE_HAS_PLUS) : (flags |= KEY_HAS_PLUS);
        break;
      case 37:
        equalityIndex > startingIndex ? (flags |= VALUE_NEEDS_DECODE) : (flags |= KEY_NEEDS_DECODE);
        break;
    }
  return (startingIndex < inputLength && processKeyValuePair(input, inputLength), result);
  function processKeyValuePair(input2, endIndex) {
    const hasBothKeyValuePair = equalityIndex > startingIndex,
      effectiveEqualityIndex = hasBothKeyValuePair ? equalityIndex : endIndex,
      keySlice = input2.slice(startingIndex + 1, effectiveEqualityIndex);
    if (!hasBothKeyValuePair && keySlice.length === 0) return;
    let finalKey = keySlice;
    (flags & KEY_HAS_PLUS && (finalKey = finalKey.replace(/\+/g, ' ')),
      flags & KEY_NEEDS_DECODE &&
        (finalKey = (0, import_fast_decode_uri_component.default)(finalKey) || finalKey));
    let finalValue = '';
    if (hasBothKeyValuePair) {
      let valueSlice = input2.slice(equalityIndex + 1, endIndex);
      (flags & VALUE_HAS_PLUS && (valueSlice = valueSlice.replace(/\+/g, ' ')),
        flags & VALUE_NEEDS_DECODE &&
          (valueSlice = (0, import_fast_decode_uri_component.default)(valueSlice) || valueSlice),
        (finalValue = valueSlice));
    }
    const currentValue = result[finalKey];
    currentValue === void 0
      ? (result[finalKey] = finalValue)
      : Array.isArray(currentValue)
        ? currentValue.push(finalValue)
        : (result[finalKey] = [currentValue, finalValue]);
  }
}
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/trace.mjs
var ELYSIA_TRACE = Symbol('ElysiaTrace'),
  createProcess = () => {
    const { promise, resolve } = Promise.withResolvers(),
      { promise: end, resolve: resolveEnd } = Promise.withResolvers(),
      { promise: error, resolve: resolveError } = Promise.withResolvers(),
      callbacks = [],
      callbacksEnd = [];
    return [
      (callback) => (callback && callbacks.push(callback), promise),
      (process) => {
        const processes = [],
          resolvers = [];
        let groupError = null;
        for (let i = 0; i < (process.total ?? 0); i++) {
          const { promise: promise2, resolve: resolve2 } = Promise.withResolvers(),
            { promise: end2, resolve: resolveEnd2 } = Promise.withResolvers(),
            { promise: error2, resolve: resolveError2 } = Promise.withResolvers(),
            callbacks2 = [],
            callbacksEnd2 = [];
          (processes.push((callback) => (callback && callbacks2.push(callback), promise2)),
            resolvers.push((process2) => {
              const result2 = {
                ...process2,
                end: end2,
                error: error2,
                index: i,
                onStop(callback) {
                  return (callback && callbacksEnd2.push(callback), end2);
                },
              };
              resolve2(result2);
              for (let i2 = 0; i2 < callbacks2.length; i2++) callbacks2[i2](result2);
              return (error3 = null) => {
                const end3 = performance.now();
                error3 && (groupError = error3);
                const detail = {
                  end: end3,
                  error: error3,
                  get elapsed() {
                    return end3 - process2.begin;
                  },
                };
                for (let i2 = 0; i2 < callbacksEnd2.length; i2++) callbacksEnd2[i2](detail);
                (resolveEnd2(end3), resolveError2(error3));
              };
            }));
        }
        const result = {
          ...process,
          end,
          error,
          onEvent(callback) {
            for (let i = 0; i < processes.length; i++) processes[i](callback);
          },
          onStop(callback) {
            return (callback && callbacksEnd.push(callback), end);
          },
        };
        resolve(result);
        for (let i = 0; i < callbacks.length; i++) callbacks[i](result);
        return {
          resolveChild: resolvers,
          resolve(error2 = null) {
            const end2 = performance.now();
            !error2 && groupError && (error2 = groupError);
            const detail = {
              end: end2,
              error: error2,
              get elapsed() {
                return end2 - process.begin;
              },
            };
            for (let i = 0; i < callbacksEnd.length; i++) callbacksEnd[i](detail);
            (resolveEnd(end2), resolveError(error2));
          },
        };
      },
    ];
  },
  createTracer = (traceListener) => (context) => {
    const [onRequest, resolveRequest] = createProcess(),
      [onParse, resolveParse] = createProcess(),
      [onTransform, resolveTransform] = createProcess(),
      [onBeforeHandle, resolveBeforeHandle] = createProcess(),
      [onHandle, resolveHandle] = createProcess(),
      [onAfterHandle, resolveAfterHandle] = createProcess(),
      [onError, resolveError] = createProcess(),
      [onMapResponse, resolveMapResponse] = createProcess(),
      [onAfterResponse, resolveAfterResponse] = createProcess();
    return (
      traceListener({
        id: context[ELYSIA_REQUEST_ID],
        context,
        set: context.set,
        onRequest,
        onParse,
        onTransform,
        onBeforeHandle,
        onHandle,
        onAfterHandle,
        onMapResponse,
        onAfterResponse,
        onError,
        time: Date.now(),
        store: context.store,
      }),
      {
        request: resolveRequest,
        parse: resolveParse,
        transform: resolveTransform,
        beforeHandle: resolveBeforeHandle,
        handle: resolveHandle,
        afterHandle: resolveAfterHandle,
        error: resolveError,
        mapResponse: resolveMapResponse,
        afterResponse: resolveAfterResponse,
      }
    );
  };
//#endregion
//#region ../../node_modules/.pnpm/exact-mirror@0.2.7_@sinclair+typebox@0.34.48/node_modules/exact-mirror/dist/index.mjs
var Kind = Symbol.for('TypeBox.Kind');
var Hint = Symbol.for('TypeBox.Hint');
var isSpecialProperty = (name) => /( |-|\t|\n|\.|\[|\]|\{|\})/.test(name) || !isNaN(+name[0]);
var joinProperty = (v1, v2, isOptional = false) => {
  if (typeof v2 === 'number') return `${v1}[${v2}]`;
  if (isSpecialProperty(v2)) return `${v1}${isOptional ? '?.' : ''}["${v2}"]`;
  return `${v1}${isOptional ? '?' : ''}.${v2}`;
};
var encodeProperty = (v) => (isSpecialProperty(v) ? `"${v}"` : v);
var sanitize = (key, sanitize2 = 0, schema) => {
  if (schema.type !== 'string' || schema.const || schema.trusted) return key;
  let hof = '';
  for (let i = sanitize2 - 1; i >= 0; i--) hof += `d.h${i}(`;
  return hof + key + ')'.repeat(sanitize2);
};
var mergeObjectIntersection = (schema) => {
  if (
    !schema.allOf ||
    (Kind in schema && (schema[Kind] !== 'Intersect' || schema.type !== 'object'))
  )
    return schema;
  const { allOf, ...newSchema } = schema;
  newSchema.properties = {};
  if (Kind in newSchema) newSchema[Kind] = 'Object';
  for (const type of allOf) {
    if (type.type !== 'object') continue;
    const { properties, required, type: _, [Kind]: __, ...rest } = type;
    if (required)
      newSchema.required = newSchema.required ? newSchema.required.concat(required) : required;
    Object.assign(newSchema, rest);
    for (const property in type.properties)
      newSchema.properties[property] = mergeObjectIntersection(type.properties[property]);
  }
  return newSchema;
};
var handleRecord = (schema, property, instruction) => {
  const child =
    schema.patternProperties['^(.*)$'] ??
    schema.patternProperties[Object.keys(schema.patternProperties)[0]];
  if (!child) return property;
  const i = instruction.array;
  instruction.array++;
  let v = `(()=>{const ar${i}s=Object.keys(${property}),ar${i}v={};for(let i=0;i<ar${i}s.length;i++){const ar${i}p=${property}[ar${i}s[i]];ar${i}v[ar${i}s[i]]=${mirror(child, `ar${i}p`, instruction)}`;
  const optionals = instruction.optionalsInArray[i + 1];
  if (optionals) {
    for (let oi = 0; oi < optionals.length; oi++) {
      const target = `ar${i}v[ar${i}s[i]]${optionals[oi]}`;
      v += `;if(${target}===undefined)delete ${target}`;
    }
    instruction.optionalsInArray[i + 1] = [];
  }
  v += `}return ar${i}v})()`;
  return v;
};
var handleTuple = (schema, property, instruction) => {
  const i = instruction.array;
  instruction.array++;
  const isRoot = property === 'v' && !instruction.unions.length;
  let v = '';
  if (!isRoot) v = `(()=>{`;
  v += `const ar${i}v=[`;
  for (let i2 = 0; i2 < schema.length; i2++) {
    if (i2 !== 0) v += ',';
    v += mirror(
      schema[i2],
      joinProperty(property, i2, instruction.parentIsOptional || instruction.fromUnion),
      instruction,
    );
  }
  v += `];`;
  if (!isRoot) v += `return ar${i}v})()`;
  return v;
};
function deepClone(source, weak = /* @__PURE__ */ new WeakMap()) {
  if (source === null || typeof source !== 'object' || typeof source === 'function') return source;
  if (weak.has(source)) return weak.get(source);
  if (Array.isArray(source)) {
    const copy = new Array(source.length);
    weak.set(source, copy);
    for (let i = 0; i < source.length; i++) copy[i] = deepClone(source[i], weak);
    return copy;
  }
  if (typeof source === 'object') {
    const keys = Object.keys(source).concat(Object.getOwnPropertySymbols(source));
    const cloned = {};
    for (const key of keys) cloned[key] = deepClone(source[key], weak);
    return cloned;
  }
  return source;
}
var handleUnion = (schemas, property, instruction) => {
  if (instruction.TypeCompiler === void 0) {
    if (!instruction.typeCompilerWanred) {
      console.warn(
        /* @__PURE__ */ new Error("[exact-mirror] TypeBox's TypeCompiler is required to use Union"),
      );
      instruction.typeCompilerWanred = true;
    }
    return property;
  }
  instruction.unionKeys[property] = 1;
  const ui = instruction.unions.length;
  const typeChecks = (instruction.unions[ui] = []);
  let v = `(()=>{
`;
  const unwrapRef = (type) => {
    if (!(Kind in type) || !type.$ref) return type;
    if (type[Kind] === 'This') return deepClone(instruction.definitions[type.$ref]);
    else if (type[Kind] === 'Ref')
      if (!instruction.modules)
        console.warn(
          /* @__PURE__ */ new Error(
            '[exact-mirror] modules is required when using nested cyclic reference',
          ),
        );
      else return instruction.modules.Import(type.$ref);
    return type;
  };
  let cleanThenCheck = '';
  for (let i = 0; i < schemas.length; i++) {
    let type = unwrapRef(schemas[i]);
    if (Array.isArray(type.anyOf))
      for (let i2 = 0; i2 < type.anyOf.length; i2++) type.anyOf[i2] = unwrapRef(type.anyOf[i2]);
    else if (type.items)
      if (Array.isArray(type.items))
        for (let i2 = 0; i2 < type.items.length; i2++) type.items[i2] = unwrapRef(type.items[i2]);
      else type.items = unwrapRef(type.items);
    typeChecks.push(TypeCompiler.Compile(type));
    v += `if(d.unions[${ui}][${i}].Check(${property})){return ${mirror(type, property, {
      ...instruction,
      recursion: instruction.recursion + 1,
      parentIsOptional: true,
      fromUnion: true,
    })}}
`;
    cleanThenCheck +=
      (i ? '' : 'let ') +
      'tmp=' +
      mirror(type, property, {
        ...instruction,
        recursion: instruction.recursion + 1,
        parentIsOptional: true,
        fromUnion: true,
      }) +
      `
if(d.unions[${ui}][${i}].Check(tmp))return tmp
`;
  }
  if (cleanThenCheck) v += cleanThenCheck;
  v += `return ${instruction.removeUnknownUnionType ? 'undefined' : property}`;
  return v + `})()`;
};
var mirror = (schema, property, instruction) => {
  if (!schema) return '';
  const isRoot = property === 'v' && !instruction.unions.length;
  if (Kind in schema && schema[Kind] === 'Import' && schema.$ref in schema.$defs)
    return mirror(schema.$defs[schema.$ref], property, {
      ...instruction,
      definitions: Object.assign(instruction.definitions, schema.$defs),
    });
  if (isRoot && schema.type !== 'object' && schema.type !== 'array' && !schema.anyOf)
    return `return ${sanitize('v', instruction.sanitize?.length, schema)}`;
  if (instruction.recursion >= instruction.recursionLimit) return property;
  let v = '';
  if (schema.$id && Hint in schema) instruction.definitions[schema.$id] = schema;
  switch (schema.type) {
    case 'object':
      if (schema[Kind] === 'Record') {
        v = handleRecord(schema, property, instruction);
        break;
      }
      schema = mergeObjectIntersection(schema);
      v += '{';
      if (schema.additionalProperties) v += `...${property},`;
      const keys = Object.keys(schema.properties);
      for (let i2 = 0; i2 < keys.length; i2++) {
        const key = keys[i2];
        let isOptional =
          !schema.required ||
          (schema.required && !schema.required.includes(key)) ||
          Array.isArray(schema.properties[key].anyOf);
        const name = joinProperty(
          property,
          key,
          instruction.parentIsOptional || instruction.fromUnion,
        );
        if (isOptional) {
          const index = instruction.array;
          if (property.startsWith('ar')) {
            const dotIndex = name.indexOf('.');
            let refName;
            if (dotIndex >= 0) refName = name.slice(dotIndex);
            else refName = name.slice(property.length);
            if (refName.startsWith('?.'))
              if (refName.charAt(2) === '[') refName = refName.slice(2);
              else refName = refName.slice(1);
            const array = instruction.optionalsInArray;
            if (array[index]) array[index].push(refName);
            else array[index] = [refName];
          } else instruction.optionals.push(name);
        }
        const child = schema.properties[key];
        if (i2 !== 0) v += ',';
        v += `${encodeProperty(key)}:${isOptional ? `${name}===undefined?undefined:` : ''}${mirror(
          child,
          name,
          {
            ...instruction,
            recursion: instruction.recursion + 1,
            parentIsOptional: isOptional,
          },
        )}`;
      }
      v += '}';
      break;
    case 'array':
      if (schema.items.type !== 'object' && schema.items.type !== 'array') {
        if (Array.isArray(schema.items)) {
          v = handleTuple(schema.items, property, instruction);
          break;
        } else if (isRoot && !Array.isArray(schema.items.anyOf)) return 'return v';
        else if (
          Kind in schema.items &&
          schema.items.$ref &&
          (schema.items[Kind] === 'Ref' || schema.items[Kind] === 'This')
        )
          v = mirror(deepClone(instruction.definitions[schema.items.$ref]), property, {
            ...instruction,
            parentIsOptional: true,
            recursion: instruction.recursion + 1,
          });
        else if (!Array.isArray(schema.items.anyOf)) {
          v = property;
          break;
        }
      }
      const i = instruction.array;
      instruction.array++;
      let reference = property;
      if (isRoot) v = `const ar${i}v=new Array(${property}.length);`;
      else {
        reference = `ar${i}s`;
        v = `((${reference})=>{const ar${i}v=new Array(${reference}.length);`;
      }
      v += `for(let i=0;i<${reference}.length;i++){const ar${i}p=${reference}[i];ar${i}v[i]=${mirror(schema.items, `ar${i}p`, instruction)}`;
      const optionals = instruction.optionalsInArray[i + 1];
      if (optionals) {
        for (let oi = 0; oi < optionals.length; oi++) {
          const target = `ar${i}v[i]${optionals[oi]}`;
          v += `;if(${target}===undefined)delete ${target}`;
        }
        instruction.optionalsInArray[i + 1] = [];
      }
      v += `}`;
      if (!isRoot) v += `return ar${i}v})(${property})`;
      break;
    default:
      if (schema.$ref && schema.$ref in instruction.definitions)
        return mirror(instruction.definitions[schema.$ref], property, instruction);
      if (Array.isArray(schema.anyOf)) {
        v = handleUnion(schema.anyOf, property, instruction);
        break;
      }
      v = sanitize(property, instruction.sanitize?.length, schema);
      break;
  }
  if (!isRoot) return v;
  if (schema.type === 'array') v = `${v}const x=ar0v;`;
  else
    v = `const x=${v}
`;
  for (let i = 0; i < instruction.optionals.length; i++) {
    const key = instruction.optionals[i];
    const prop = key.slice(1);
    v += `if(${key}===undefined`;
    if (instruction.unionKeys[key]) v += `||x${prop}===undefined`;
    const shouldQuestion = prop.charCodeAt(0) !== 63 && schema.type !== 'array';
    v += `)delete x${shouldQuestion ? (prop.charCodeAt(0) === 91 ? '?.' : '?') : ''}${prop}
`;
  }
  return `${v}return x`;
};
var createMirror = (
    schema,
    {
      TypeCompiler: TypeCompiler2,
      modules,
      definitions,
      sanitize: sanitize2,
      recursionLimit = 8,
      removeUnknownUnionType = false,
    } = {},
  ) => {
    const unions = [];
    if (typeof sanitize2 === 'function') sanitize2 = [sanitize2];
    const f = mirror(schema, 'v', {
      optionals: [],
      optionalsInArray: [],
      array: 0,
      parentIsOptional: false,
      unions,
      unionKeys: {},
      TypeCompiler: TypeCompiler2,
      modules,
      definitions: definitions ?? modules?.$defs ?? {},
      sanitize: sanitize2,
      recursion: 0,
      recursionLimit,
      removeUnknownUnionType,
    });
    if (!unions.length && !sanitize2?.length) return Function('v', f);
    let hof;
    if (sanitize2?.length) {
      hof = {};
      for (let i = 0; i < sanitize2.length; i++) hof[`h${i}`] = sanitize2[i];
    }
    return Function(
      'd',
      `return function mirror(v){${f}}`,
    )({
      unions,
      ...hof,
    });
  },
  replaceSchemaTypeFromManyOptions = (schema, options) => {
    if (Array.isArray(options)) {
      let result = schema;
      for (const option of options) result = replaceSchemaTypeFromOption(result, option);
      return result;
    }
    return replaceSchemaTypeFromOption(schema, options);
  },
  replaceSchemaTypeFromOption = (schema, option) => {
    if (option.rootOnly && option.excludeRoot)
      throw new Error("Can't set both rootOnly and excludeRoot");
    if (option.rootOnly && option.onlyFirst)
      throw new Error("Can't set both rootOnly and onlyFirst");
    if (option.rootOnly && option.untilObjectFound)
      throw new Error("Can't set both rootOnly and untilObjectFound");
    const walk = ({ s, isRoot, treeLvl }) => {
      if (!s) return s;
      const skipRoot = isRoot && option.excludeRoot,
        fromKind = option.from[Kind$1];
      if (s.elysiaMeta)
        return option.from.elysiaMeta === s.elysiaMeta && !skipRoot ? option.to(s) : s;
      const shouldTransform = fromKind && s[Kind$1] === fromKind;
      if (
        (!skipRoot && option.onlyFirst && s.type === option.onlyFirst) ||
        (isRoot && option.rootOnly)
      )
        return shouldTransform ? option.to(s) : s;
      if (!isRoot && option.untilObjectFound && s.type === 'object') return s;
      const newWalkInput = {
          isRoot: !1,
          treeLvl: treeLvl + 1,
        },
        withTransformedChildren = { ...s };
      if (
        (s.oneOf &&
          (withTransformedChildren.oneOf = s.oneOf.map((x) =>
            walk({
              ...newWalkInput,
              s: x,
            }),
          )),
        s.anyOf &&
          (withTransformedChildren.anyOf = s.anyOf.map((x) =>
            walk({
              ...newWalkInput,
              s: x,
            }),
          )),
        s.allOf &&
          (withTransformedChildren.allOf = s.allOf.map((x) =>
            walk({
              ...newWalkInput,
              s: x,
            }),
          )),
        s.not &&
          (withTransformedChildren.not = walk({
            ...newWalkInput,
            s: s.not,
          })),
        s.properties)
      ) {
        withTransformedChildren.properties = {};
        for (const [k, v] of Object.entries(s.properties))
          withTransformedChildren.properties[k] = walk({
            ...newWalkInput,
            s: v,
          });
      }
      if (s.items) {
        const items = s.items;
        withTransformedChildren.items = Array.isArray(items)
          ? items.map((x) =>
              walk({
                ...newWalkInput,
                s: x,
              }),
            )
          : walk({
              ...newWalkInput,
              s: items,
            });
      }
      return !skipRoot && fromKind && withTransformedChildren[Kind$1] === fromKind
        ? option.to(withTransformedChildren)
        : withTransformedChildren;
    };
    return walk({
      s: schema,
      isRoot: !0,
      treeLvl: 0,
    });
  };
var _stringToStructureCoercions;
var stringToStructureCoercions = () => (
  _stringToStructureCoercions ||
    (_stringToStructureCoercions = [
      {
        from: t.Object({}),
        to: (schema) => t.ObjectString(schema.properties || {}, schema),
        excludeRoot: !0,
      },
      {
        from: t.Array(t.Any()),
        to: (schema) => t.ArrayString(schema.items || t.Any(), schema),
      },
    ]),
  _stringToStructureCoercions
);
var _queryCoercions;
var queryCoercions = () => (
  _queryCoercions ||
    (_queryCoercions = [
      {
        from: t.Object({}),
        to: (schema) => t.ObjectString(schema.properties ?? {}, schema),
        excludeRoot: !0,
      },
      {
        from: t.Array(t.Any()),
        to: (schema) => t.ArrayQuery(schema.items ?? t.Any(), schema),
      },
    ]),
  _queryCoercions
);
var _coercePrimitiveRoot;
var coercePrimitiveRoot = () => (
  _coercePrimitiveRoot ||
    (_coercePrimitiveRoot = [
      {
        from: t.Number(),
        to: (schema) => t.Numeric(schema),
        rootOnly: !0,
      },
      {
        from: t.Boolean(),
        to: (schema) => t.BooleanString(schema),
        rootOnly: !0,
      },
    ]),
  _coercePrimitiveRoot
);
var _coerceFormData;
var coerceFormData = () => (
  _coerceFormData ||
    (_coerceFormData = [
      {
        from: t.Object({}),
        to: (schema) => t.ObjectString(schema.properties ?? {}, schema),
        onlyFirst: 'object',
        excludeRoot: !0,
      },
      {
        from: t.Array(t.Any()),
        to: (schema) => t.ArrayString(schema.items ?? t.Any(), schema),
        onlyFirst: 'array',
        excludeRoot: !0,
      },
    ]),
  _coerceFormData
);
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/schema.mjs
var isOptional = (schema) =>
    schema
      ? schema?.[Kind$1] === 'Import' && schema.References
        ? schema.References().some(isOptional)
        : (schema.schema && (schema = schema.schema), !!schema && OptionalKind in schema)
      : !1,
  hasAdditionalProperties = (_schema) => {
    if (!_schema) return !1;
    const schema = _schema?.schema ?? _schema;
    if (schema[Kind$1] === 'Import' && _schema.References)
      return _schema.References().some(hasAdditionalProperties);
    if (schema.anyOf) return schema.anyOf.some(hasAdditionalProperties);
    if (schema.someOf) return schema.someOf.some(hasAdditionalProperties);
    if (schema.allOf) return schema.allOf.some(hasAdditionalProperties);
    if (schema.not) return schema.not.some(hasAdditionalProperties);
    if (schema.type === 'object') {
      const properties = schema.properties;
      if ('additionalProperties' in schema) return schema.additionalProperties;
      if ('patternProperties' in schema) return !1;
      for (const key of Object.keys(properties)) {
        const property = properties[key];
        if (property.type === 'object') {
          if (hasAdditionalProperties(property)) return !0;
        } else if (property.anyOf) {
          for (let i = 0; i < property.anyOf.length; i++)
            if (hasAdditionalProperties(property.anyOf[i])) return !0;
        }
        return property.additionalProperties;
      }
      return !1;
    }
    return schema.type === 'array' && schema.items && !Array.isArray(schema.items)
      ? hasAdditionalProperties(schema.items)
      : !1;
  },
  resolveSchema = (schema, models, modules) => {
    if (schema)
      return typeof schema != 'string'
        ? schema
        : modules && schema in modules.$defs
          ? modules.Import(schema)
          : models?.[schema];
  },
  hasType = (type, schema) => {
    if (!schema) return !1;
    if (Kind$1 in schema && schema[Kind$1] === type) return !0;
    if (Kind$1 in schema && schema[Kind$1] === 'Import' && schema.$defs && schema.$ref) {
      const ref = schema.$ref.replace('#/$defs/', '');
      if (schema.$defs[ref]) return hasType(type, schema.$defs[ref]);
    }
    if (schema.anyOf) return schema.anyOf.some((s) => hasType(type, s));
    if (schema.oneOf) return schema.oneOf.some((s) => hasType(type, s));
    if (schema.allOf) return schema.allOf.some((s) => hasType(type, s));
    if (schema.type === 'array' && schema.items)
      return type === 'Files' && Kind$1 in schema.items && schema.items[Kind$1] === 'File'
        ? !0
        : hasType(type, schema.items);
    if (schema.type === 'object') {
      const properties = schema.properties;
      if (!properties) return !1;
      for (const key of Object.keys(properties)) if (hasType(type, properties[key])) return !0;
    }
    return !1;
  },
  hasElysiaMeta = (meta, _schema) => {
    if (!_schema) return !1;
    const schema = _schema?.schema ?? _schema;
    if (schema.elysiaMeta === meta) return !0;
    if (schema[Kind$1] === 'Import' && _schema.References)
      return _schema.References().some((schema2) => hasElysiaMeta(meta, schema2));
    if (schema.anyOf) return schema.anyOf.some((schema2) => hasElysiaMeta(meta, schema2));
    if (schema.someOf) return schema.someOf.some((schema2) => hasElysiaMeta(meta, schema2));
    if (schema.allOf) return schema.allOf.some((schema2) => hasElysiaMeta(meta, schema2));
    if (schema.not) return schema.not.some((schema2) => hasElysiaMeta(meta, schema2));
    if (schema.type === 'object') {
      const properties = schema.properties;
      if (!properties) return !1;
      for (const key of Object.keys(properties)) {
        const property = properties[key];
        if (property.type === 'object') {
          if (hasElysiaMeta(meta, property)) return !0;
        } else if (property.anyOf) {
          for (let i = 0; i < property.anyOf.length; i++)
            if (hasElysiaMeta(meta, property.anyOf[i])) return !0;
        }
        return schema.elysiaMeta === meta;
      }
      return !1;
    }
    return schema.type === 'array' && schema.items && !Array.isArray(schema.items)
      ? hasElysiaMeta(meta, schema.items)
      : !1;
  },
  hasProperty = (expectedProperty, _schema) => {
    if (!_schema) return !1;
    const schema = _schema.schema ?? _schema;
    if (schema[Kind$1] === 'Import' && _schema.References)
      return _schema.References().some((schema2) => hasProperty(expectedProperty, schema2));
    if (schema.anyOf) return schema.anyOf.some((s) => hasProperty(expectedProperty, s));
    if (schema.allOf) return schema.allOf.some((s) => hasProperty(expectedProperty, s));
    if (schema.oneOf) return schema.oneOf.some((s) => hasProperty(expectedProperty, s));
    if (schema.type === 'object') {
      const properties = schema.properties;
      if (!properties) return !1;
      for (const key of Object.keys(properties)) {
        const property = properties[key];
        if (expectedProperty in property) return !0;
        if (property.type === 'object') {
          if (hasProperty(expectedProperty, property)) return !0;
        } else if (property.anyOf) {
          for (let i = 0; i < property.anyOf.length; i++)
            if (hasProperty(expectedProperty, property.anyOf[i])) return !0;
        }
      }
      return !1;
    }
    return expectedProperty in schema;
  },
  hasRef = (schema) => {
    if (!schema) return !1;
    if (schema.oneOf) {
      for (let i = 0; i < schema.oneOf.length; i++) if (hasRef(schema.oneOf[i])) return !0;
    }
    if (schema.anyOf) {
      for (let i = 0; i < schema.anyOf.length; i++) if (hasRef(schema.anyOf[i])) return !0;
    }
    if (schema.oneOf) {
      for (let i = 0; i < schema.oneOf.length; i++) if (hasRef(schema.oneOf[i])) return !0;
    }
    if (schema.allOf) {
      for (let i = 0; i < schema.allOf.length; i++) if (hasRef(schema.allOf[i])) return !0;
    }
    if (schema.not && hasRef(schema.not)) return !0;
    if (schema.type === 'object' && schema.properties) {
      const properties = schema.properties;
      for (const key of Object.keys(properties)) {
        const property = properties[key];
        if (
          hasRef(property) ||
          (property.type === 'array' && property.items && hasRef(property.items))
        )
          return !0;
      }
    }
    return schema.type === 'array' && schema.items && hasRef(schema.items)
      ? !0
      : schema[Kind$1] === 'Ref' && '$ref' in schema;
  },
  hasTransform = (schema) => {
    if (!schema) return !1;
    if (
      schema.$ref &&
      schema.$defs &&
      schema.$ref in schema.$defs &&
      hasTransform(schema.$defs[schema.$ref])
    )
      return !0;
    if (schema.oneOf) {
      for (let i = 0; i < schema.oneOf.length; i++) if (hasTransform(schema.oneOf[i])) return !0;
    }
    if (schema.anyOf) {
      for (let i = 0; i < schema.anyOf.length; i++) if (hasTransform(schema.anyOf[i])) return !0;
    }
    if (schema.allOf) {
      for (let i = 0; i < schema.allOf.length; i++) if (hasTransform(schema.allOf[i])) return !0;
    }
    if (schema.not && hasTransform(schema.not)) return !0;
    if (schema.type === 'object' && schema.properties) {
      const properties = schema.properties;
      for (const key of Object.keys(properties)) {
        const property = properties[key];
        if (
          hasTransform(property) ||
          (property.type === 'array' && property.items && hasTransform(property.items))
        )
          return !0;
      }
    }
    return schema.type === 'array' && schema.items && hasTransform(schema.items)
      ? !0
      : TransformKind in schema;
  },
  createCleaner = (schema) => (value) => {
    if (typeof value == 'object')
      try {
        return Clean(schema, value);
      } catch {}
    return value;
  },
  getSchemaValidator = (
    s,
    {
      models = {},
      dynamic = !1,
      modules,
      normalize = !1,
      additionalProperties = !1,
      forceAdditionalProperties = !1,
      coerce = !1,
      additionalCoerce = [],
      validators,
      sanitize,
    } = {},
  ) => {
    if (((validators = validators?.filter((x) => x)), !s)) {
      if (!validators?.length) return;
      ((s = validators[0]), (validators = validators.slice(1)));
    }
    let doesHaveRef;
    const replaceSchema = (schema2) =>
        coerce
          ? replaceSchemaTypeFromManyOptions(schema2, [
              {
                from: t.Number(),
                to: (options) => t.Numeric(options),
                untilObjectFound: !0,
              },
              {
                from: t.Boolean(),
                to: (options) => t.BooleanString(options),
                untilObjectFound: !0,
              },
              ...(Array.isArray(additionalCoerce) ? additionalCoerce : [additionalCoerce]),
            ])
          : replaceSchemaTypeFromManyOptions(schema2, additionalCoerce),
      mapSchema = (s2) => {
        if (s2 && typeof s2 != 'string' && '~standard' in s2) return s2;
        if (!s2) return;
        let schema2;
        if (typeof s2 != 'string') schema2 = s2;
        else if (
          ((schema2 = modules && s2 in modules.$defs ? modules.Import(s2) : models[s2]), !schema2)
        )
          return;
        const hasAdditionalCoerce = Array.isArray(additionalCoerce)
          ? additionalCoerce.length > 0
          : !!additionalCoerce;
        if (Kind$1 in schema2)
          if (schema2[Kind$1] === 'Import')
            hasRef(schema2.$defs[schema2.$ref]) ||
              ((schema2 = schema2.$defs[schema2.$ref] ?? models[schema2.$ref]),
              (coerce || hasAdditionalCoerce) &&
                ((schema2 = replaceSchema(schema2)),
                '$id' in schema2 &&
                  !schema2.$defs &&
                  (schema2.$id = `${schema2.$id}_coerced_${randomId()}`)));
          else if (hasRef(schema2)) {
            const id = randomId();
            schema2 = t
              .Module({
                ...modules?.$defs,
                [id]: schema2,
              })
              .Import(id);
          } else (coerce || hasAdditionalCoerce) && (schema2 = replaceSchema(schema2));
        return schema2;
      };
    let schema = mapSchema(s),
      _validators = validators;
    if (
      '~standard' in schema ||
      (validators?.length && validators.some((x) => x && typeof x != 'string' && '~standard' in x))
    ) {
      let Check2 = function (value, validated = !1) {
          let v = validated ? value : mainCheck.validate(value);
          if (v instanceof Promise) return v.then((v2) => Check2(v2, !0));
          if (v.issues) return v;
          const values = [];
          return (
            v && typeof v == 'object' && values.push(v.value), runCheckers2(value, 0, values, v)
          );
        },
        runCheckers2 = function (value, startIndex, values, lastV) {
          for (let i = startIndex; i < checkers.length; i++) {
            let v = checkers[i].validate(value);
            if (v instanceof Promise)
              return v.then((resolved) => {
                if (resolved.issues) return resolved;
                const nextValues = [...values];
                return (
                  resolved && typeof resolved == 'object' && nextValues.push(resolved.value),
                  runCheckers2(value, i + 1, nextValues, resolved)
                );
              });
            if (v.issues) return v;
            (v && typeof v == 'object' && values.push(v.value), (lastV = v));
          }
          return mergeValues2(values, lastV);
        },
        mergeValues2 = function (values, lastV) {
          if (!values.length) return { value: lastV };
          if (values.length === 1) return { value: values[0] };
          if (values.length === 2) return { value: mergeDeep(values[0], values[1]) };
          let newValue = mergeDeep(values[0], values[1]);
          for (let i = 2; i < values.length; i++) newValue = mergeDeep(newValue, values[i]);
          return { value: newValue };
        };
      const typeboxSubValidator = (schema2) => {
          let mirror;
          if (normalize === !0 || normalize === 'exactMirror')
            try {
              mirror = createMirror(schema2, {
                TypeCompiler,
                sanitize: sanitize?.(),
                modules,
              });
            } catch {
              (console.warn(
                'Failed to create exactMirror. Please report the following code to https://github.com/elysiajs/elysia/issues',
              ),
                console.warn(schema2),
                (mirror = createCleaner(schema2)));
            }
          const vali = getSchemaValidator(schema2, {
            models,
            modules,
            dynamic,
            normalize,
            additionalProperties: !0,
            forceAdditionalProperties: !0,
            coerce,
            additionalCoerce,
          });
          return (
            (vali.Decode = mirror),
            {
              validate: (v) =>
                vali.Check(v) ? { value: mirror ? mirror(v) : v } : { issues: [...vali.Errors(v)] },
            }
          );
        },
        mainCheck = schema['~standard'] ? schema['~standard'] : typeboxSubValidator(schema);
      let checkers = [];
      if (validators?.length) {
        for (const validator2 of validators)
          if (validator2 && typeof validator2 != 'string') {
            if (validator2?.['~standard']) {
              checkers.push(validator2['~standard']);
              continue;
            }
            if (Kind$1 in validator2) {
              checkers.push(typeboxSubValidator(validator2));
              continue;
            }
          }
      }
      const validator = {
        provider: 'standard',
        schema,
        references: '',
        checkFunc: () => {},
        code: '',
        Check: Check2,
        Errors: (value) => Check2(value)?.then?.((x) => x?.issues),
        Code: () => '',
        Decode: Check2,
        Encode: (value) => value,
        hasAdditionalProperties: !1,
        hasDefault: !1,
        isOptional: !1,
        hasTransform: !1,
        hasRef: !1,
      };
      return (
        (validator.parse = (v) => {
          try {
            return validator.Decode(validator.Clean?.(v) ?? v);
          } catch {
            throw [...validator.Errors(v)].map(mapValueError);
          }
        }),
        (validator.safeParse = (v) => {
          try {
            return {
              success: !0,
              data: validator.Decode(validator.Clean?.(v) ?? v),
              error: null,
            };
          } catch {
            const errors = [...compiled.Errors(v)].map(mapValueError);
            return {
              success: !1,
              data: null,
              error: errors[0]?.summary,
              errors,
            };
          }
        }),
        validator
      );
    } else if (validators?.length) {
      let hasAdditional = !1;
      const { schema: mergedObjectSchema, notObjects } = mergeObjectSchemas([
        schema,
        ..._validators.map(mapSchema),
      ]);
      notObjects &&
        ((schema = t.Intersect([
          ...(mergedObjectSchema ? [mergedObjectSchema] : []),
          ...notObjects.map((x) => {
            const schema2 = mapSchema(x);
            return (
              schema2.type === 'object' &&
                'additionalProperties' in schema2 &&
                (!hasAdditional && schema2.additionalProperties === !1 && (hasAdditional = !0),
                delete schema2.additionalProperties),
              schema2
            );
          }),
        ])),
        schema.type === 'object' && hasAdditional && (schema.additionalProperties = !1));
    } else
      schema.type === 'object' && (!('additionalProperties' in schema) || forceAdditionalProperties)
        ? (schema.additionalProperties = additionalProperties)
        : (schema = replaceSchemaTypeFromManyOptions(schema, {
            onlyFirst: 'object',
            from: t.Object({}),
            to(schema2) {
              return !schema2.properties || 'additionalProperties' in schema2
                ? schema2
                : t.Object(schema2.properties, {
                    ...schema2,
                    additionalProperties: !1,
                  });
            },
          }));
    if (dynamic)
      if (Kind$1 in schema) {
        const validator = {
          provider: 'typebox',
          schema,
          references: '',
          checkFunc: () => {},
          code: '',
          Check: (value) => Check(schema, value),
          Errors: (value) => Errors(schema, value),
          Code: () => '',
          Clean: createCleaner(schema),
          Decode: (value) => Decode(schema, value),
          Encode: (value) => Encode(schema, value),
          get hasAdditionalProperties() {
            return '~hasAdditionalProperties' in this
              ? this['~hasAdditionalProperties']
              : (this['~hasAdditionalProperties'] = hasAdditionalProperties(schema));
          },
          get hasDefault() {
            return '~hasDefault' in this
              ? this['~hasDefault']
              : (this['~hasDefault'] = hasProperty('default', schema));
          },
          get isOptional() {
            return '~isOptional' in this
              ? this['~isOptional']
              : (this['~isOptional'] = isOptional(schema));
          },
          get hasTransform() {
            return '~hasTransform' in this
              ? this['~hasTransform']
              : (this['~hasTransform'] = hasTransform(schema));
          },
          '~hasRef': doesHaveRef,
          get hasRef() {
            return '~hasRef' in this ? this['~hasRef'] : (this['~hasRef'] = hasTransform(schema));
          },
        };
        if (
          (schema.config &&
            ((validator.config = schema.config),
            validator?.schema?.config && delete validator.schema.config),
          normalize && schema.additionalProperties === !1)
        )
          if (normalize === !0 || normalize === 'exactMirror')
            try {
              validator.Clean = createMirror(schema, {
                TypeCompiler,
                sanitize: sanitize?.(),
                modules,
              });
            } catch {
              (console.warn(
                'Failed to create exactMirror. Please report the following code to https://github.com/elysiajs/elysia/issues',
              ),
                console.warn(schema),
                (validator.Clean = createCleaner(schema)));
            }
          else validator.Clean = createCleaner(schema);
        return (
          (validator.parse = (v) => {
            try {
              return validator.Decode(validator.Clean?.(v) ?? v);
            } catch {
              throw [...validator.Errors(v)].map(mapValueError);
            }
          }),
          (validator.safeParse = (v) => {
            try {
              return {
                success: !0,
                data: validator.Decode(validator.Clean?.(v) ?? v),
                error: null,
              };
            } catch {
              const errors = [...compiled.Errors(v)].map(mapValueError);
              return {
                success: !1,
                data: null,
                error: errors[0]?.summary,
                errors,
              };
            }
          }),
          validator
        );
      } else {
        const validator = {
          provider: 'standard',
          schema,
          references: '',
          checkFunc: () => {},
          code: '',
          Check: (v) => schema['~standard'].validate(v),
          Errors(value) {
            const response = schema['~standard'].validate(value);
            if (response instanceof Promise)
              throw Error('Async validation is not supported in non-dynamic schema');
            return response.issues;
          },
          Code: () => '',
          Decode(value) {
            const response = schema['~standard'].validate(value);
            if (response instanceof Promise)
              throw Error('Async validation is not supported in non-dynamic schema');
            return response;
          },
          Encode: (value) => value,
          hasAdditionalProperties: !1,
          hasDefault: !1,
          isOptional: !1,
          hasTransform: !1,
          hasRef: !1,
        };
        return (
          (validator.parse = (v) => {
            try {
              return validator.Decode(validator.Clean?.(v) ?? v);
            } catch {
              throw [...validator.Errors(v)].map(mapValueError);
            }
          }),
          (validator.safeParse = (v) => {
            try {
              return {
                success: !0,
                data: validator.Decode(validator.Clean?.(v) ?? v),
                error: null,
              };
            } catch {
              const errors = [...compiled.Errors(v)].map(mapValueError);
              return {
                success: !1,
                data: null,
                error: errors[0]?.summary,
                errors,
              };
            }
          }),
          validator
        );
      }
    let compiled;
    if (Kind$1 in schema)
      if (
        ((compiled = TypeCompiler.Compile(
          schema,
          Object.values(models).filter((x) => Kind$1 in x),
        )),
        (compiled.provider = 'typebox'),
        schema.config &&
          ((compiled.config = schema.config),
          compiled?.schema?.config && delete compiled.schema.config),
        normalize === !0 || normalize === 'exactMirror')
      )
        try {
          compiled.Clean = createMirror(schema, {
            TypeCompiler,
            sanitize: sanitize?.(),
            modules,
          });
        } catch {
          (console.warn(
            'Failed to create exactMirror. Please report the following code to https://github.com/elysiajs/elysia/issues',
          ),
            console.dir(schema, { depth: null }),
            (compiled.Clean = createCleaner(schema)));
        }
      else normalize === 'typebox' && (compiled.Clean = createCleaner(schema));
    else
      compiled = {
        provider: 'standard',
        schema,
        references: '',
        checkFunc(value) {
          const response = schema['~standard'].validate(value);
          if (response instanceof Promise)
            throw Error('Async validation is not supported in non-dynamic schema');
          return response;
        },
        code: '',
        Check: (v) => schema['~standard'].validate(v),
        Errors(value) {
          const response = schema['~standard'].validate(value);
          if (response instanceof Promise)
            throw Error('Async validation is not supported in non-dynamic schema');
          return response.issues;
        },
        Code: () => '',
        Decode(value) {
          const response = schema['~standard'].validate(value);
          if (response instanceof Promise)
            throw Error('Async validation is not supported in non-dynamic schema');
          return response;
        },
        Encode: (value) => value,
        hasAdditionalProperties: !1,
        hasDefault: !1,
        isOptional: !1,
        hasTransform: !1,
        hasRef: !1,
      };
    return (
      (compiled.parse = (v) => {
        try {
          return compiled.Decode(compiled.Clean?.(v) ?? v);
        } catch {
          throw [...compiled.Errors(v)].map(mapValueError);
        }
      }),
      (compiled.safeParse = (v) => {
        try {
          return {
            success: !0,
            data: compiled.Decode(compiled.Clean?.(v) ?? v),
            error: null,
          };
        } catch {
          const errors = [...compiled.Errors(v)].map(mapValueError);
          return {
            success: !1,
            data: null,
            error: errors[0]?.summary,
            errors,
          };
        }
      }),
      Kind$1 in schema &&
        Object.assign(compiled, {
          get hasAdditionalProperties() {
            return '~hasAdditionalProperties' in this
              ? this['~hasAdditionalProperties']
              : (this['~hasAdditionalProperties'] = hasAdditionalProperties(compiled));
          },
          get hasDefault() {
            return '~hasDefault' in this
              ? this['~hasDefault']
              : (this['~hasDefault'] = hasProperty('default', compiled));
          },
          get isOptional() {
            return '~isOptional' in this
              ? this['~isOptional']
              : (this['~isOptional'] = isOptional(compiled));
          },
          get hasTransform() {
            return '~hasTransform' in this
              ? this['~hasTransform']
              : (this['~hasTransform'] = hasTransform(schema));
          },
          get hasRef() {
            return '~hasRef' in this ? this['~hasRef'] : (this['~hasRef'] = hasRef(schema));
          },
          '~hasRef': doesHaveRef,
        }),
      compiled
    );
  },
  isUnion = (schema) => schema[Kind$1] === 'Union' || (!schema.schema && !!schema.anyOf),
  getSchemaProperties = (schema) => {
    if (!schema) return;
    if (schema.properties) return schema.properties;
    const members = schema.allOf ?? schema.anyOf ?? schema.oneOf;
    if (members) {
      const result = {};
      for (const member of members) {
        const props = getSchemaProperties(member);
        props && Object.assign(result, props);
      }
      return Object.keys(result).length > 0 ? result : void 0;
    }
  },
  mergeObjectSchemas = (schemas) => {
    if (schemas.length === 0)
      return {
        schema: void 0,
        notObjects: [],
      };
    if (schemas.length === 1)
      return schemas[0].type === 'object'
        ? {
            schema: schemas[0],
            notObjects: [],
          }
        : {
            schema: void 0,
            notObjects: schemas,
          };
    let newSchema;
    const notObjects = [];
    let additionalPropertiesIsTrue = !1,
      additionalPropertiesIsFalse = !1;
    for (const schema of schemas) {
      if (schema.type !== 'object') {
        notObjects.push(schema);
        continue;
      }
      if (
        ('additionalProperties' in schema &&
          (schema.additionalProperties === !0
            ? (additionalPropertiesIsTrue = !0)
            : schema.additionalProperties === !1 && (additionalPropertiesIsFalse = !0)),
        !newSchema)
      ) {
        newSchema = schema;
        continue;
      }
      newSchema = {
        ...newSchema,
        ...schema,
        properties: {
          ...newSchema.properties,
          ...schema.properties,
        },
        required: [...(newSchema?.required ?? []), ...(schema.required ?? [])],
      };
    }
    return (
      newSchema &&
        (newSchema.required && (newSchema.required = [...new Set(newSchema.required)]),
        additionalPropertiesIsFalse
          ? (newSchema.additionalProperties = !1)
          : additionalPropertiesIsTrue && (newSchema.additionalProperties = !0)),
      {
        schema: newSchema,
        notObjects,
      }
    );
  },
  getResponseSchemaValidator = (
    s,
    {
      models = {},
      modules,
      dynamic = !1,
      normalize = !1,
      additionalProperties = !1,
      validators = [],
      sanitize,
    },
  ) => {
    if (((validators = validators.filter((x) => x)), !s)) {
      if (!validators?.length) return;
      ((s = validators[0]), (validators = validators.slice(1)));
    }
    let maybeSchemaOrRecord;
    if (typeof s != 'string') maybeSchemaOrRecord = s;
    else if (
      ((maybeSchemaOrRecord = modules && s in modules.$defs ? modules.Import(s) : models[s]),
      !maybeSchemaOrRecord)
    )
      return;
    if (!maybeSchemaOrRecord) return;
    if (Kind$1 in maybeSchemaOrRecord || '~standard' in maybeSchemaOrRecord)
      return {
        200: getSchemaValidator(maybeSchemaOrRecord, {
          modules,
          models,
          additionalProperties,
          dynamic,
          normalize,
          coerce: !1,
          additionalCoerce: [],
          validators: validators.map((x) => x[200]),
          sanitize,
        }),
      };
    const record = {};
    return (
      Object.keys(maybeSchemaOrRecord).forEach((status) => {
        if (isNaN(+status)) return;
        const maybeNameOrSchema = maybeSchemaOrRecord[+status];
        if (typeof maybeNameOrSchema == 'string') {
          if (maybeNameOrSchema in models) {
            const schema = models[maybeNameOrSchema];
            if (!schema) return;
            record[+status] =
              Kind$1 in schema || '~standard' in schema
                ? getSchemaValidator(schema, {
                    modules,
                    models,
                    additionalProperties,
                    dynamic,
                    normalize,
                    coerce: !1,
                    additionalCoerce: [],
                    validators: validators.map((x) => x[+status]),
                    sanitize,
                  })
                : schema;
          }
          return;
        }
        record[+status] =
          Kind$1 in maybeNameOrSchema || '~standard' in maybeNameOrSchema
            ? getSchemaValidator(maybeNameOrSchema, {
                modules,
                models,
                additionalProperties,
                dynamic,
                normalize,
                coerce: !1,
                additionalCoerce: [],
                validators: validators.map((x) => x[+status]),
                sanitize,
              })
            : maybeNameOrSchema;
      }),
      record
    );
  },
  getCookieValidator = ({
    validator,
    modules,
    defaultConfig = {},
    config,
    dynamic,
    normalize = !1,
    models,
    validators,
    sanitize,
  }) => {
    let cookieValidator = validator?.provider
      ? validator
      : getSchemaValidator(validator, {
          modules,
          dynamic,
          models,
          normalize,
          additionalProperties: !0,
          coerce: !0,
          additionalCoerce: stringToStructureCoercions(),
          validators,
          sanitize,
        });
    return (
      cookieValidator
        ? (cookieValidator.config = mergeCookie(cookieValidator.config, config))
        : ((cookieValidator = getSchemaValidator(t.Cookie(t.Any()), {
            modules,
            dynamic,
            models,
            additionalProperties: !0,
            validators,
            sanitize,
          })),
          (cookieValidator.config = defaultConfig)),
      cookieValidator
    );
  },
  unwrapImportSchema = (schema) =>
    schema && schema[Kind$1] === 'Import' && schema.$defs[schema.$ref][Kind$1] === 'Object'
      ? schema.$defs[schema.$ref]
      : schema;
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/compose.mjs
var allocateIf$1 = (value, condition) => (condition ? value : ''),
  defaultParsers = [
    'json',
    'text',
    'urlencoded',
    'arrayBuffer',
    'formdata',
    'application/json',
    'text/plain',
    'application/x-www-form-urlencoded',
    'application/octet-stream',
    'multipart/form-data',
  ],
  createReport = ({ context = 'c', trace = [], addFn }) => {
    if (!trace.length)
      return () => ({
        resolveChild() {
          return () => {};
        },
        resolve() {},
      });
    for (let i = 0; i < trace.length; i++)
      addFn(`let report${i},reportChild${i},reportErr${i},reportErrChild${i};let trace${i}=${context}[ELYSIA_TRACE]?.[${i}]??trace[${i}](${context});
`);
    return (event, { name, total = 0, alias } = {}) => {
      name || (name = 'anonymous');
      const reporter = event === 'error' ? 'reportErr' : 'report';
      for (let i = 0; i < trace.length; i++)
        (addFn(`${alias ? 'const ' : ''}${alias ?? reporter}${i}=trace${i}.${event}({id,event:'${event}',name:'${name}',begin:performance.now(),total:${total}})
`),
          alias &&
            addFn(`${reporter}${i}=${alias}${i}
`));
      return {
        resolve() {
          for (let i = 0; i < trace.length; i++)
            addFn(`${alias ?? reporter}${i}.resolve()
`);
        },
        resolveChild(name2) {
          for (let i = 0; i < trace.length; i++)
            addFn(`${reporter}Child${i}=${reporter}${i}.resolveChild?.shift()?.({id,event:'${event}',name:'${name2}',begin:performance.now()})
`);
          return (binding) => {
            for (let i = 0; i < trace.length; i++)
              addFn(
                binding
                  ? `if(${binding} instanceof Error){${reporter}Child${i}?.(${binding}) }else{${reporter}Child${i}?.()}`
                  : `${reporter}Child${i}?.()
`,
              );
          };
        },
      };
    };
  },
  composeCleaner = ({ schema, name, type, typeAlias = type, normalize, ignoreTryCatch = !1 }) =>
    !normalize || !schema.Clean
      ? ''
      : normalize === !0 || normalize === 'exactMirror'
        ? ignoreTryCatch
          ? `${name}=validator.${typeAlias}.Clean(${name})
`
          : `try{${name}=validator.${typeAlias}.Clean(${name})
}catch{}`
        : normalize === 'typebox'
          ? `${name}=validator.${typeAlias}.Clean(${name})
`
          : '',
  composeValidationFactory = ({
    injectResponse = '',
    normalize = !1,
    validator,
    encodeSchema = !1,
    isStaticResponse = !1,
    hasSanitize = !1,
    allowUnsafeValidationDetails = !1,
  }) => ({
    validate: (type, value = `c.${type}`, error) =>
      `c.set.status=422;throw new ValidationError('${type}',validator.${type},${value},${allowUnsafeValidationDetails}${error ? ',' + error : ''})`,
    response: (name = 'r') => {
      if (isStaticResponse || !validator.response) return '';
      let code =
        injectResponse +
        `
`;
      code += `if(${name} instanceof ElysiaCustomStatusResponse){c.set.status=${name}.code
${name}=${name}.response}if(${name} instanceof Response === false && typeof ${name}?.next !== 'function' && !(${name} instanceof ReadableStream))switch(c.set.status){`;
      for (const [status2, value] of Object.entries(validator.response)) {
        if (
          ((code += `
case ${status2}:
`),
          value.provider === 'standard')
        ) {
          code += `let vare${status2}=validator.response[${status2}].Check(${name})
if(vare${status2} instanceof Promise)vare${status2}=await vare${status2}
if(vare${status2}.issues)throw new ValidationError('response',validator.response[${status2}],${name},${allowUnsafeValidationDetails},vare${status2}.issues)
${name}=vare${status2}.value
c.set.status=${status2}
break
`;
          continue;
        }
        let noValidate = value.schema?.noValidate === !0;
        if (!noValidate && value.schema?.$ref && value.schema?.$defs) {
          const refKey = value.schema.$ref,
            defKey =
              typeof refKey == 'string' && refKey.includes('/') ? refKey.split('/').pop() : refKey;
          value.schema.$defs[defKey]?.noValidate === !0 && (noValidate = !0);
        }
        const appliedCleaner = noValidate || hasSanitize,
          clean = ({ ignoreTryCatch = !1 } = {}) =>
            composeCleaner({
              name,
              schema: value,
              type: 'response',
              typeAlias: `response[${status2}]`,
              normalize,
              ignoreTryCatch,
            });
        appliedCleaner && (code += clean());
        const applyErrorCleaner = !appliedCleaner && normalize && !noValidate;
        (encodeSchema && value.hasTransform && !noValidate
          ? ((code += `try{${name}=validator.response[${status2}].Encode(${name})
`),
            appliedCleaner || (code += clean({ ignoreTryCatch: !0 })),
            (code +=
              `c.set.status=${status2}}catch{` +
              (applyErrorCleaner
                ? `try{
` +
                  clean({ ignoreTryCatch: !0 }) +
                  `${name}=validator.response[${status2}].Encode(${name})
}catch{throw new ValidationError('response',validator.response[${status2}],${name},${allowUnsafeValidationDetails})}`
                : `throw new ValidationError('response',validator.response[${status2}],${name},${allowUnsafeValidationDetails})`) +
              '}'))
          : (appliedCleaner || (code += clean()),
            noValidate ||
              (code += `if(validator.response[${status2}].Check(${name})===false)throw new ValidationError('response',validator.response[${status2}],${name},${allowUnsafeValidationDetails})
c.set.status=${status2}
`)),
          (code += `break
`));
      }
      return code + '}';
    },
  }),
  isAsyncName = (v) => (v?.fn ?? v).constructor.name === 'AsyncFunction',
  matchResponseClone = /=>\s?response\.clone\(/,
  matchFnReturn = /(?:return|=>)\s?\S+\(|a(?:sync|wait)/,
  isAsync = (v) => {
    const isObject = typeof v == 'object';
    if (isObject && v.isAsync !== void 0) return v.isAsync;
    const fn = isObject ? v.fn : v;
    if (fn.constructor.name === 'AsyncFunction' || fn.constructor.name === 'AsyncGeneratorFunction')
      return !0;
    const literal = fn.toString();
    if (matchResponseClone.test(literal)) return (isObject && (v.isAsync = !1), !1);
    const result = matchFnReturn.test(literal);
    return (isObject && (v.isAsync = result), result);
  },
  hasReturn = (v) => {
    const isObject = typeof v == 'object';
    if (isObject && v.hasReturn !== void 0) return v.hasReturn;
    const fnLiteral = isObject ? v.fn.toString() : v.toString(),
      parenthesisEnd = fnLiteral.indexOf(')'),
      arrowIndex = fnLiteral.indexOf('=>', parenthesisEnd);
    if (arrowIndex !== -1) {
      let afterArrow = arrowIndex + 2,
        charCode;
      for (
        ;
        afterArrow < fnLiteral.length &&
        ((charCode = fnLiteral.charCodeAt(afterArrow)) === 32 ||
          charCode === 9 ||
          charCode === 10 ||
          charCode === 13);
      )
        afterArrow++;
      if (afterArrow < fnLiteral.length && fnLiteral.charCodeAt(afterArrow) !== 123)
        return (isObject && (v.hasReturn = !0), !0);
    }
    const result = fnLiteral.includes('return');
    return (isObject && (v.hasReturn = result), result);
  },
  isGenerator = (v) => {
    const fn = v?.fn ?? v;
    return (
      fn.constructor.name === 'AsyncGeneratorFunction' ||
      fn.constructor.name === 'GeneratorFunction'
    );
  },
  coerceTransformDecodeError = (
    fnLiteral,
    type,
    allowUnsafeValidationDetails = !1,
    value = `c.${type}`,
  ) => `try{${fnLiteral}}catch(error){if(error.constructor.name === 'TransformDecodeError'){c.set.status=422
throw error.error ?? new ValidationError('${type}',validator.${type},${value},${allowUnsafeValidationDetails})}}`,
  setImmediateFn = hasSetImmediate ? 'setImmediate' : 'Promise.resolve().then',
  composeHandler = ({
    app,
    path,
    method,
    hooks,
    validator,
    handler,
    allowMeta = !1,
    inference,
  }) => {
    const adapter = app['~adapter'].composeHandler,
      adapterHandler = app['~adapter'].handler,
      isHandleFn = typeof handler == 'function';
    if (!isHandleFn) {
      handler = adapterHandler.mapResponse(handler, { headers: app.setHeaders ?? {} });
      const isResponse =
        handler instanceof Response ||
        (handler?.constructor?.name === 'Response' && typeof handler?.clone == 'function');
      if (
        hooks.parse?.length &&
        hooks.transform?.length &&
        hooks.beforeHandle?.length &&
        hooks.afterHandle?.length
      )
        return isResponse
          ? Function(
              'a',
              `"use strict";
return function(){return a.clone()}`,
            )(handler)
          : Function(
              'a',
              `"use strict";
return function(){return a}`,
            )(handler);
      if (isResponse) {
        const response = handler;
        handler = () => response.clone();
      }
    }
    const handle = isHandleFn ? 'handler(c)' : 'handler',
      hasTrace = !!hooks.trace?.length;
    let fnLiteral = '';
    if (
      ((inference = sucrose(Object.assign({ handler }, hooks), inference, app.config.sucrose)),
      adapter.declare)
    ) {
      const literal = adapter.declare(inference);
      literal && (fnLiteral += literal);
    }
    (inference.server &&
      (fnLiteral += `Object.defineProperty(c,'server',{get:function(){return getServer()}})
`),
      validator.createBody?.(),
      validator.createQuery?.(),
      validator.createHeaders?.(),
      validator.createParams?.(),
      validator.createCookie?.(),
      validator.createResponse?.());
    const hasValidation =
        !!validator.body ||
        !!validator.headers ||
        !!validator.params ||
        !!validator.query ||
        !!validator.cookie ||
        !!validator.response,
      hasQuery = inference.query || !!validator.query,
      requestNoBody = hooks.parse?.length === 1 && hooks.parse[0].fn === 'none',
      hasBody =
        method !== '' &&
        method !== 'GET' &&
        method !== 'HEAD' &&
        (inference.body || !!validator.body || !!hooks.parse?.length) &&
        !requestNoBody,
      defaultHeaders = app.setHeaders,
      hasDefaultHeaders = defaultHeaders && !!Object.keys(defaultHeaders).length,
      hasHeaders =
        inference.headers ||
        !!validator.headers ||
        (adapter.preferWebstandardHeaders !== !0 && inference.body),
      hasCookie = inference.cookie || !!validator.cookie,
      cookieMeta = validator.cookie?.config
        ? mergeCookie(validator?.cookie?.config, app.config.cookie)
        : app.config.cookie;
    let _encodeCookie = '';
    const encodeCookie = () => {
        if (_encodeCookie) return _encodeCookie;
        if (cookieMeta?.sign) {
          if (cookieMeta.secrets === '')
            throw new Error(`cookie secret can't be an empty string at (${method}) ${path}`, {
              cause: `(${method}) ${path}`,
            });
          if (!cookieMeta.secrets)
            throw new Error(`cookie secret must be defined (${method}) ${path}`, {
              cause: `(${method}) ${path}`,
            });
          const secret = cookieMeta.secrets
            ? typeof cookieMeta.secrets == 'string'
              ? cookieMeta.secrets
              : cookieMeta.secrets[0]
            : void 0;
          if (
            ((_encodeCookie += `const _setCookie = c.set.cookie
if(_setCookie){`),
            cookieMeta.sign === !0)
          )
            _encodeCookie += `for(const [key, cookie] of Object.entries(_setCookie)){c.set.cookie[key].value=await signCookie(cookie.value,${secret ? JSON.stringify(secret) : 'undefined'})}`;
          else {
            typeof cookieMeta.sign == 'string' && (cookieMeta.sign = [cookieMeta.sign]);
            for (const name of cookieMeta.sign)
              _encodeCookie += `if(_setCookie[${JSON.stringify(name)}]?.value)c.set.cookie[${JSON.stringify(name)}].value=await signCookie(_setCookie[${JSON.stringify(name)}].value,${secret ? JSON.stringify(secret) : 'undefined'})
`;
          }
          _encodeCookie += `}
`;
        }
        return _encodeCookie;
      },
      normalize = app.config.normalize,
      encodeSchema = app.config.encodeSchema,
      allowUnsafeValidationDetails = app.config.allowUnsafeValidationDetails,
      validation = composeValidationFactory({
        normalize,
        validator,
        encodeSchema,
        isStaticResponse: handler instanceof Response,
        hasSanitize: !!app.config.sanitize,
        allowUnsafeValidationDetails,
      });
    (hasHeaders && (fnLiteral += adapter.headers),
      hasTrace &&
        (fnLiteral += `const id=c[ELYSIA_REQUEST_ID]
`));
    const report = createReport({
      trace: hooks.trace,
      addFn: (word) => {
        fnLiteral += word;
      },
    });
    if (((fnLiteral += 'try{'), hasCookie)) {
      const get = (name, defaultValue) => {
          const value = cookieMeta?.[name] ?? defaultValue;
          return value === void 0
            ? ''
            : value
              ? typeof value == 'string'
                ? `${name}:${JSON.stringify(value)},`
                : value instanceof Date
                  ? `${name}: new Date(${value.getTime()}),`
                  : `${name}:${value},`
              : typeof defaultValue == 'string'
                ? `${name}:"${defaultValue}",`
                : `${name}:${defaultValue},`;
        },
        options = cookieMeta
          ? `{secrets:${cookieMeta.secrets !== void 0 && cookieMeta.secrets !== null ? (typeof cookieMeta.secrets == 'string' ? JSON.stringify(cookieMeta.secrets) : '[' + cookieMeta.secrets.map((x) => JSON.stringify(x)).join(',') + ']') : 'undefined'},sign:${cookieMeta.sign === !0 ? !0 : cookieMeta.sign !== void 0 ? (typeof cookieMeta.sign == 'string' ? JSON.stringify(cookieMeta.sign) : '[' + cookieMeta.sign.map((x) => JSON.stringify(x)).join(',') + ']') : 'undefined'},` +
            get('domain') +
            get('expires') +
            get('httpOnly') +
            get('maxAge') +
            get('path', '/') +
            get('priority') +
            get('sameSite') +
            get('secure') +
            '}'
          : 'undefined';
      hasHeaders
        ? (fnLiteral += `
c.cookie=await parseCookie(c.set,c.headers.cookie,${options})
`)
        : (fnLiteral += `
c.cookie=await parseCookie(c.set,c.request.headers.get('cookie'),${options})
`);
    }
    if (hasQuery) {
      let arrayProperties = {},
        objectProperties = {},
        hasArrayProperty = !1,
        hasObjectProperty = !1;
      if (validator.query?.schema) {
        const properties = getSchemaProperties(unwrapImportSchema(validator.query?.schema));
        if (properties)
          for (const [key, value] of Object.entries(properties))
            (hasElysiaMeta('ArrayQuery', value) &&
              ((arrayProperties[key] = !0), (hasArrayProperty = !0)),
              hasElysiaMeta('ObjectString', value) &&
                ((objectProperties[key] = !0), (hasObjectProperty = !0)));
      }
      fnLiteral += `if(c.qi===-1){c.query=Object.create(null)}else{c.query=parseQueryFromURL(c.url,c.qi+1${hasArrayProperty ? ',' + JSON.stringify(arrayProperties) : hasObjectProperty ? ',undefined' : ''}${hasObjectProperty ? ',' + JSON.stringify(objectProperties) : ''})}`;
    }
    const isAsyncHandler = typeof handler == 'function' && isAsync(handler),
      saveResponse = hasTrace || hooks.afterResponse?.length ? 'c.response=c.responseValue= ' : '',
      responseKeys = Object.keys(validator.response ?? {}),
      hasMultipleResponses = responseKeys.length > 1,
      hasSingle200 =
        responseKeys.length === 0 || (responseKeys.length === 1 && responseKeys[0] === '200'),
      maybeAsync =
        hasCookie ||
        hasBody ||
        isAsyncHandler ||
        !!hooks.parse?.length ||
        !!hooks.afterHandle?.some(isAsync) ||
        !!hooks.beforeHandle?.some(isAsync) ||
        !!hooks.transform?.some(isAsync) ||
        !!hooks.mapResponse?.some(isAsync) ||
        validator.body?.provider === 'standard' ||
        validator.headers?.provider === 'standard' ||
        validator.query?.provider === 'standard' ||
        validator.params?.provider === 'standard' ||
        validator.cookie?.provider === 'standard' ||
        Object.values(validator.response ?? {}).find((x) => x.provider === 'standard'),
      maybeStream =
        (typeof handler == 'function' ? isGenerator(handler) : !1) ||
        !!hooks.beforeHandle?.some(isGenerator) ||
        !!hooks.afterHandle?.some(isGenerator) ||
        !!hooks.transform?.some(isGenerator),
      hasSet =
        inference.cookie ||
        inference.set ||
        hasHeaders ||
        hasTrace ||
        hasMultipleResponses ||
        !hasSingle200 ||
        (isHandleFn && hasDefaultHeaders) ||
        maybeStream;
    let _afterResponse;
    const afterResponse = (hasStream = !0) => {
        if (_afterResponse !== void 0) return _afterResponse;
        if (!hooks.afterResponse?.length && !hasTrace) return '';
        let afterResponse2 = '';
        afterResponse2 +=
          `
${setImmediateFn}(async()=>{if(c.responseValue){if(c.responseValue instanceof ElysiaCustomStatusResponse) c.set.status=c.responseValue.code
` +
          (hasStream
            ? `if(typeof afterHandlerStreamListener!=='undefined')for await(const v of afterHandlerStreamListener){}
`
            : '') +
          `}
`;
        const reporter = createReport({
          trace: hooks.trace,
          addFn: (word) => {
            afterResponse2 += word;
          },
        })('afterResponse', { total: hooks.afterResponse?.length });
        if (hooks.afterResponse?.length && hooks.afterResponse)
          for (let i = 0; i < hooks.afterResponse.length; i++) {
            const endUnit = reporter.resolveChild(hooks.afterResponse[i].fn.name),
              prefix = isAsync(hooks.afterResponse[i]) ? 'await ' : '';
            ((afterResponse2 += `
${prefix}e.afterResponse[${i}](c)
`),
              endUnit());
          }
        return (
          reporter.resolve(),
          (afterResponse2 += `})
`),
          (_afterResponse = afterResponse2)
        );
      },
      mapResponse = (r = 'r') => {
        const after = afterResponse(),
          response = `${maybeStream && maybeAsync ? 'await ' : ''}${hasSet ? 'mapResponse' : 'mapCompactResponse'}(${saveResponse}${r}${hasSet ? ',c.set' : ''}${mapResponseContext})
`;
        return after ? `const _res=${response}` + after + 'return _res' : `return ${response}`;
      },
      mapResponseContext = adapter.mapResponseContext ? `,${adapter.mapResponseContext}` : '';
    ((hasTrace || inference.route) &&
      (fnLiteral += `c.route=\`${path}\`
`),
      (hasTrace || hooks.afterResponse?.length) &&
        (fnLiteral += `let afterHandlerStreamListener
`));
    const parseReporter = report('parse', { total: hooks.parse?.length });
    if (hasBody) {
      const hasBodyInference = !!hooks.parse?.length || inference.body || validator.body;
      (adapter.parser.declare && (fnLiteral += adapter.parser.declare),
        (fnLiteral += `
try{`));
      let parser =
        typeof hooks.parse == 'string'
          ? hooks.parse
          : Array.isArray(hooks.parse) && hooks.parse.length === 1
            ? typeof hooks.parse[0] == 'string'
              ? hooks.parse[0]
              : typeof hooks.parse[0].fn == 'string'
                ? hooks.parse[0].fn
                : void 0
            : void 0;
      if (!parser && validator.body && !hooks.parse?.length) {
        const schema = validator.body.schema;
        schema &&
          schema.anyOf &&
          schema[Kind$1] === 'Union' &&
          schema.anyOf?.length === 2 &&
          schema.anyOf?.find((x) => x[Kind$1] === 'ElysiaForm') &&
          (parser = 'formdata');
      }
      if (parser && defaultParsers.includes(parser)) {
        const reporter = report('parse', { total: hooks.parse?.length }),
          isOptionalBody = !!validator.body?.isOptional;
        switch (parser) {
          case 'json':
          case 'application/json':
            fnLiteral += adapter.parser.json(isOptionalBody);
            break;
          case 'text':
          case 'text/plain':
            fnLiteral += adapter.parser.text(isOptionalBody);
            break;
          case 'urlencoded':
          case 'application/x-www-form-urlencoded':
            fnLiteral += adapter.parser.urlencoded(isOptionalBody);
            break;
          case 'arrayBuffer':
          case 'application/octet-stream':
            fnLiteral += adapter.parser.arrayBuffer(isOptionalBody);
            break;
          case 'formdata':
          case 'multipart/form-data':
            fnLiteral += adapter.parser.formData(isOptionalBody);
            break;
          default:
            parser in app['~parser'] &&
              ((fnLiteral += hasHeaders
                ? "let contentType = c.headers['content-type']"
                : "let contentType = c.request.headers.get('content-type')"),
              (fnLiteral += `
if(contentType){const index=contentType.indexOf(';')
if(index!==-1)contentType=contentType.substring(0,index)}
else{contentType=''}c.contentType=contentType
let result=parser['${parser}'](c, contentType)
if(result instanceof Promise)result=await result
if(result instanceof ElysiaCustomStatusResponse)throw result
if(result!==undefined)c.body=result
delete c.contentType
`));
            break;
        }
        reporter.resolve();
      } else if (hasBodyInference) {
        ((fnLiteral += `
`),
          (fnLiteral += `let contentType
if(c.request.body)`),
          (fnLiteral += hasHeaders
            ? `contentType=c.headers['content-type']
`
            : `contentType=c.request.headers.get('content-type')
`));
        let hasDefaultParser = !1;
        if (hooks.parse?.length)
          fnLiteral += `if(contentType){
const index=contentType.indexOf(';')

if(index!==-1)contentType=contentType.substring(0,index)}else{contentType=''}let used=false
c.contentType=contentType
`;
        else {
          hasDefaultParser = !0;
          const isOptionalBody = !!validator.body?.isOptional;
          fnLiteral +=
            `if(contentType)switch(contentType.charCodeAt(12)){
case 106:` +
            adapter.parser.json(isOptionalBody) +
            `break
case 120:` +
            adapter.parser.urlencoded(isOptionalBody) +
            `break
case 111:` +
            adapter.parser.arrayBuffer(isOptionalBody) +
            `break
case 114:` +
            adapter.parser.formData(isOptionalBody) +
            `break
default:if(contentType.charCodeAt(0)===116){` +
            adapter.parser.text(isOptionalBody) +
            `}break
}`;
        }
        const reporter = report('parse', { total: hooks.parse?.length });
        if (hooks.parse)
          for (let i = 0; i < hooks.parse.length; i++) {
            const name = `bo${i}`;
            if (
              (i !== 0 &&
                (fnLiteral += `
if(!used){`),
              typeof hooks.parse[i].fn == 'string')
            ) {
              const endUnit = reporter.resolveChild(hooks.parse[i].fn),
                isOptionalBody = !!validator.body?.isOptional;
              switch (hooks.parse[i].fn) {
                case 'json':
                case 'application/json':
                  ((hasDefaultParser = !0), (fnLiteral += adapter.parser.json(isOptionalBody)));
                  break;
                case 'text':
                case 'text/plain':
                  ((hasDefaultParser = !0), (fnLiteral += adapter.parser.text(isOptionalBody)));
                  break;
                case 'urlencoded':
                case 'application/x-www-form-urlencoded':
                  ((hasDefaultParser = !0),
                    (fnLiteral += adapter.parser.urlencoded(isOptionalBody)));
                  break;
                case 'arrayBuffer':
                case 'application/octet-stream':
                  ((hasDefaultParser = !0),
                    (fnLiteral += adapter.parser.arrayBuffer(isOptionalBody)));
                  break;
                case 'formdata':
                case 'multipart/form-data':
                  ((hasDefaultParser = !0), (fnLiteral += adapter.parser.formData(isOptionalBody)));
                  break;
                default:
                  fnLiteral += `let ${name}=parser['${hooks.parse[i].fn}'](c,contentType)
if(${name} instanceof Promise)${name}=await ${name}
if(${name}!==undefined){c.body=${name};used=true;}
`;
              }
              endUnit();
            } else {
              const endUnit = reporter.resolveChild(hooks.parse[i].fn.name);
              ((fnLiteral += `let ${name}=e.parse[${i}]
${name}=${name}(c,contentType)
if(${name} instanceof Promise)${name}=await ${name}
if(${name}!==undefined){c.body=${name};used=true}`),
                endUnit());
            }
            if ((i !== 0 && (fnLiteral += '}'), hasDefaultParser)) break;
          }
        if ((reporter.resolve(), !hasDefaultParser)) {
          const isOptionalBody = !!validator.body?.isOptional;
          (hooks.parse?.length &&
            (fnLiteral += `
if(!used){
`),
            (fnLiteral +=
              `switch(contentType){case 'application/json':
` +
              adapter.parser.json(isOptionalBody) +
              `break
case 'text/plain':` +
              adapter.parser.text(isOptionalBody) +
              `break
case 'application/x-www-form-urlencoded':` +
              adapter.parser.urlencoded(isOptionalBody) +
              `break
case 'application/octet-stream':` +
              adapter.parser.arrayBuffer(isOptionalBody) +
              `break
case 'multipart/form-data':` +
              adapter.parser.formData(isOptionalBody) +
              `break
`));
          for (const key of Object.keys(app['~parser']))
            fnLiteral +=
              `case '${key}':let bo${key}=parser['${key}'](c,contentType)
if(bo${key} instanceof Promise)bo${key}=await bo${key}
if(bo${key} instanceof ElysiaCustomStatusResponse){` +
              mapResponse(`bo${key}`) +
              `}if(bo${key}!==undefined)c.body=bo${key}
break
`;
          (hooks.parse?.length && (fnLiteral += '}'), (fnLiteral += '}'));
        }
        hooks.parse?.length &&
          (fnLiteral += `
delete c.contentType`);
      }
      fnLiteral += '}catch(error){throw new ParseError(error)}';
    }
    if ((parseReporter.resolve(), hooks?.transform || hasTrace)) {
      const reporter = report('transform', { total: hooks.transform?.length });
      if (hooks.transform?.length) {
        fnLiteral += `let transformed
`;
        for (let i = 0; i < hooks.transform.length; i++) {
          const transform = hooks.transform[i],
            endUnit = reporter.resolveChild(transform.fn.name);
          ((fnLiteral += isAsync(transform)
            ? `transformed=await e.transform[${i}](c)
`
            : `transformed=e.transform[${i}](c)
`),
            transform.subType === 'mapDerive'
              ? (fnLiteral +=
                  'if(transformed instanceof ElysiaCustomStatusResponse){' +
                  mapResponse('transformed') +
                  `}else{transformed.request=c.request
transformed.store=c.store
transformed.qi=c.qi
transformed.path=c.path
transformed.url=c.url
transformed.redirect=c.redirect
transformed.set=c.set
transformed.error=c.error
c=transformed}`)
              : (fnLiteral +=
                  'if(transformed instanceof ElysiaCustomStatusResponse){' +
                  mapResponse('transformed') +
                  `}else Object.assign(c,transformed)
`),
            endUnit());
        }
      }
      reporter.resolve();
    }
    const fileUnions = [];
    if (validator) {
      if (validator.headers) {
        if (validator.headers.hasDefault)
          for (const [key, value] of Object.entries(Default(validator.headers.schema, {}))) {
            const parsed =
              typeof value == 'object'
                ? JSON.stringify(value)
                : typeof value == 'string'
                  ? `'${value}'`
                  : value;
            parsed !== void 0 &&
              (fnLiteral += `c.headers['${key}']??=${parsed}
`);
          }
        ((fnLiteral += composeCleaner({
          name: 'c.headers',
          schema: validator.headers,
          type: 'headers',
          normalize,
        })),
          validator.headers.isOptional && (fnLiteral += 'if(isNotEmpty(c.headers)){'),
          validator.headers?.provider === 'standard'
            ? (fnLiteral +=
                `let vah=validator.headers.Check(c.headers)
if(vah instanceof Promise)vah=await vah
if(vah.issues){` +
                validation.validate('headers', void 0, 'vah.issues') +
                `}else{c.headers=vah.value}
`)
            : validator.headers?.schema?.noValidate !== !0 &&
              (fnLiteral +=
                'if(validator.headers.Check(c.headers) === false){' +
                validation.validate('headers') +
                '}'),
          validator.headers.hasTransform &&
            (fnLiteral += coerceTransformDecodeError(
              `c.headers=validator.headers.Decode(c.headers)
`,
              'headers',
              allowUnsafeValidationDetails,
            )),
          validator.headers.isOptional && (fnLiteral += '}'));
      }
      if (validator.params) {
        if (validator.params.hasDefault)
          for (const [key, value] of Object.entries(Default(validator.params.schema, {}))) {
            const parsed =
              typeof value == 'object'
                ? JSON.stringify(value)
                : typeof value == 'string'
                  ? `'${value}'`
                  : value;
            parsed !== void 0 &&
              (fnLiteral += `c.params['${key}']??=${parsed}
`);
          }
        (validator.params.provider === 'standard'
          ? (fnLiteral +=
              `let vap=validator.params.Check(c.params)
if(vap instanceof Promise)vap=await vap
if(vap.issues){` +
              validation.validate('params', void 0, 'vap.issues') +
              `}else{c.params=vap.value}
`)
          : validator.params?.schema?.noValidate !== !0 &&
            (fnLiteral +=
              'if(validator.params.Check(c.params)===false){' +
              validation.validate('params') +
              '}'),
          validator.params.hasTransform &&
            (fnLiteral += coerceTransformDecodeError(
              `c.params=validator.params.Decode(c.params)
`,
              'params',
              allowUnsafeValidationDetails,
            )));
      }
      if (validator.query) {
        if (Kind$1 in validator.query?.schema && validator.query.hasDefault)
          for (const [key, value] of Object.entries(Default(validator.query.schema, {}))) {
            const parsed =
              typeof value == 'object'
                ? JSON.stringify(value)
                : typeof value == 'string'
                  ? `'${value}'`
                  : value;
            parsed !== void 0 &&
              (fnLiteral += `if(c.query['${key}']===undefined)c.query['${key}']=${parsed}
`);
          }
        ((fnLiteral += composeCleaner({
          name: 'c.query',
          schema: validator.query,
          type: 'query',
          normalize,
        })),
          validator.query.isOptional && (fnLiteral += 'if(isNotEmpty(c.query)){'),
          validator.query.provider === 'standard'
            ? (fnLiteral +=
                `let vaq=validator.query.Check(c.query)
if(vaq instanceof Promise)vaq=await vaq
if(vaq.issues){` +
                validation.validate('query', void 0, 'vaq.issues') +
                `}else{c.query=vaq.value}
`)
            : validator.query?.schema?.noValidate !== !0 &&
              (fnLiteral +=
                'if(validator.query.Check(c.query)===false){' + validation.validate('query') + '}'),
          validator.query.hasTransform &&
            ((fnLiteral += coerceTransformDecodeError(
              `c.query=validator.query.Decode(c.query)
`,
              'query',
              allowUnsafeValidationDetails,
            )),
            (fnLiteral += coerceTransformDecodeError(
              `c.query=validator.query.Decode(c.query)
`,
              'query',
              allowUnsafeValidationDetails,
            ))),
          validator.query.isOptional && (fnLiteral += '}'));
      }
      if (hasBody && validator.body) {
        (validator.body.hasTransform || validator.body.isOptional) &&
          (fnLiteral += `const isNotEmptyObject=c.body&&(typeof c.body==="object"&&(isNotEmpty(c.body)||c.body instanceof ArrayBuffer))
`);
        const hasUnion = isUnion(validator.body.schema);
        let hasNonUnionFileWithDefault = !1;
        if (validator.body.hasDefault) {
          let value = Default(
            validator.body.schema,
            validator.body.schema.type === 'object' ||
              unwrapImportSchema(validator.body.schema)[Kind$1] === 'Object'
              ? {}
              : void 0,
          );
          const schema = unwrapImportSchema(validator.body.schema);
          if (
            !hasUnion &&
            value &&
            typeof value == 'object' &&
            (hasType('File', schema) || hasType('Files', schema))
          ) {
            hasNonUnionFileWithDefault = !0;
            for (const [k, v] of Object.entries(value))
              (v === 'File' || v === 'Files') && delete value[k];
            isNotEmpty(value) || (value = void 0);
          }
          const parsed =
            typeof value == 'object'
              ? JSON.stringify(value)
              : typeof value == 'string'
                ? `'${value}'`
                : value;
          (value != null &&
            (Array.isArray(value)
              ? (fnLiteral += `if(!c.body)c.body=${parsed}
`)
              : typeof value == 'object'
                ? (fnLiteral += `c.body=Object.assign(${parsed},c.body)
`)
                : (fnLiteral += `c.body=${parsed}
`)),
            (fnLiteral += composeCleaner({
              name: 'c.body',
              schema: validator.body,
              type: 'body',
              normalize,
            })),
            validator.body.provider === 'standard'
              ? (fnLiteral +=
                  `let vab=validator.body.Check(c.body)
if(vab instanceof Promise)vab=await vab
if(vab.issues){` +
                  validation.validate('body', void 0, 'vab.issues') +
                  `}else{c.body=vab.value}
`)
              : validator.body?.schema?.noValidate !== !0 &&
                (validator.body.isOptional
                  ? (fnLiteral +=
                      'if(isNotEmptyObject&&validator.body.Check(c.body)===false){' +
                      validation.validate('body') +
                      '}')
                  : (fnLiteral +=
                      'if(validator.body.Check(c.body)===false){' +
                      validation.validate('body') +
                      '}')));
        } else
          ((fnLiteral += composeCleaner({
            name: 'c.body',
            schema: validator.body,
            type: 'body',
            normalize,
          })),
            validator.body.provider === 'standard'
              ? (fnLiteral +=
                  `let vab=validator.body.Check(c.body)
if(vab instanceof Promise)vab=await vab
if(vab.issues){` +
                  validation.validate('body', void 0, 'vab.issues') +
                  `}else{c.body=vab.value}
`)
              : validator.body?.schema?.noValidate !== !0 &&
                (validator.body.isOptional
                  ? (fnLiteral +=
                      'if(isNotEmptyObject&&validator.body.Check(c.body)===false){' +
                      validation.validate('body') +
                      '}')
                  : (fnLiteral +=
                      'if(validator.body.Check(c.body)===false){' +
                      validation.validate('body') +
                      '}')));
        if (
          (validator.body.hasTransform &&
            (fnLiteral += coerceTransformDecodeError(
              `if(isNotEmptyObject)c.body=validator.body.Decode(c.body)
`,
              'body',
              allowUnsafeValidationDetails,
            )),
          hasUnion && validator.body.schema.anyOf?.length)
        ) {
          const iterator = Object.values(validator.body.schema.anyOf);
          for (let i = 0; i < iterator.length; i++) {
            const type = iterator[i];
            if (hasType('File', type) || hasType('Files', type)) {
              const candidate = getSchemaValidator(type, {
                modules: app.definitions.typebox,
                dynamic: !app.config.aot,
                models: app.definitions.type,
                normalize: app.config.normalize,
                additionalCoerce: coercePrimitiveRoot(),
                sanitize: () => app.config.sanitize,
              });
              if (candidate) {
                const isFirst = fileUnions.length === 0,
                  properties = getSchemaProperties(candidate.schema) ?? getSchemaProperties(type);
                if (!properties) continue;
                const iterator2 = Object.entries(properties);
                let validator2 = isFirst
                  ? `
`
                  : ' else ';
                validator2 += `if(fileUnions[${fileUnions.length}].Check(c.body)){`;
                let validateFile = '',
                  validatorLength = 0;
                for (let i2 = 0; i2 < iterator2.length; i2++) {
                  const [k, v] = iterator2[i2];
                  !v.extension ||
                    (v[Kind$1] !== 'File' && v[Kind$1] !== 'Files') ||
                    (validatorLength && (validateFile += ','),
                    (validateFile += `fileType(c.body.${k},${JSON.stringify(v.extension)},'body.${k}')`),
                    validatorLength++);
                }
                validateFile &&
                  (validatorLength === 1
                    ? (validator2 += `await ${validateFile}
`)
                    : validatorLength > 1 &&
                      (validator2 += `await Promise.all([${validateFile}])
`),
                  (validator2 += '}'),
                  (fnLiteral += validator2),
                  fileUnions.push(candidate));
              }
            }
          }
        } else if (
          hasNonUnionFileWithDefault ||
          (!hasUnion &&
            (hasType('File', unwrapImportSchema(validator.body.schema)) ||
              hasType('Files', unwrapImportSchema(validator.body.schema))))
        ) {
          let validateFile = '';
          const bodyProperties = getSchemaProperties(unwrapImportSchema(validator.body.schema));
          let i = 0;
          if (bodyProperties)
            for (const [k, v] of Object.entries(bodyProperties))
              !v.extension ||
                (v[Kind$1] !== 'File' && v[Kind$1] !== 'Files') ||
                (i && (validateFile += ','),
                (validateFile += `fileType(c.body.${k},${JSON.stringify(v.extension)},'body.${k}')`),
                i++);
          (i &&
            (fnLiteral += `
`),
            i === 1
              ? (fnLiteral += `await ${validateFile}
`)
              : i > 1 &&
                (fnLiteral += `await Promise.all([${validateFile}])
`));
        }
      }
      validator.cookie &&
        ((validator.cookie.config = mergeCookie(validator.cookie.config, app.config.cookie ?? {})),
        (fnLiteral += `let cookieValue={}
for(const [key,value] of Object.entries(c.cookie))cookieValue[key]=value.value
`),
        validator.cookie.isOptional && (fnLiteral += 'if(isNotEmpty(c.cookie)){'),
        validator.cookie.provider === 'standard'
          ? ((fnLiteral +=
              `let vac=validator.cookie.Check(cookieValue)
if(vac instanceof Promise)vac=await vac
if(vac.issues){` +
              validation.validate('cookie', void 0, 'vac.issues') +
              `}else{cookieValue=vac.value}
`),
            (fnLiteral += `for(const k of Object.keys(cookieValue))c.cookie[k].value=cookieValue[k]
`))
          : validator.cookie?.schema?.noValidate !== !0 &&
            ((fnLiteral +=
              'if(validator.cookie.Check(cookieValue)===false){' +
              validation.validate('cookie', 'cookieValue') +
              '}'),
            validator.cookie.hasTransform &&
              (fnLiteral += coerceTransformDecodeError(
                'for(const [key,value] of Object.entries(validator.cookie.Decode(cookieValue))){c.cookie[key].value = value}',
                'cookie',
                allowUnsafeValidationDetails,
              ))),
        validator.cookie.isOptional && (fnLiteral += '}'));
    }
    if (hooks?.beforeHandle || hasTrace) {
      const reporter = report('beforeHandle', { total: hooks.beforeHandle?.length });
      let hasResolve = !1;
      if (hooks.beforeHandle?.length)
        for (let i = 0; i < hooks.beforeHandle.length; i++) {
          const beforeHandle = hooks.beforeHandle[i],
            endUnit = reporter.resolveChild(beforeHandle.fn.name),
            returning = hasReturn(beforeHandle);
          if (beforeHandle.subType === 'resolve' || beforeHandle.subType === 'mapResolve')
            (hasResolve ||
              ((hasResolve = !0),
              (fnLiteral += `
let resolved
`)),
              (fnLiteral += isAsync(beforeHandle)
                ? `resolved=await e.beforeHandle[${i}](c);
`
                : `resolved=e.beforeHandle[${i}](c);
`),
              beforeHandle.subType === 'mapResolve'
                ? (fnLiteral +=
                    'if(resolved instanceof ElysiaCustomStatusResponse){' +
                    mapResponse('resolved') +
                    `}else{resolved.request=c.request
resolved.store=c.store
resolved.qi=c.qi
resolved.path=c.path
resolved.url=c.url
resolved.redirect=c.redirect
resolved.set=c.set
resolved.error=c.error
c=resolved}`)
                : (fnLiteral +=
                    'if(resolved instanceof ElysiaCustomStatusResponse){' +
                    mapResponse('resolved') +
                    `}else Object.assign(c, resolved)
`),
              endUnit());
          else if (!returning)
            ((fnLiteral += isAsync(beforeHandle)
              ? `await e.beforeHandle[${i}](c)
`
              : `e.beforeHandle[${i}](c)
`),
              endUnit());
          else {
            if (
              ((fnLiteral += isAsync(beforeHandle)
                ? `be=await e.beforeHandle[${i}](c)
`
                : `be=e.beforeHandle[${i}](c)
`),
              endUnit('be'),
              (fnLiteral += 'if(be!==undefined){'),
              reporter.resolve(),
              hooks.afterHandle?.length || hasTrace)
            ) {
              report('handle', { name: isHandleFn ? handler.name : void 0 }).resolve();
              const reporter2 = report('afterHandle', { total: hooks.afterHandle?.length });
              if (hooks.afterHandle?.length)
                for (let i2 = 0; i2 < hooks.afterHandle.length; i2++) {
                  const hook = hooks.afterHandle[i2],
                    returning2 = hasReturn(hook),
                    endUnit2 = reporter2.resolveChild(hook.fn.name);
                  ((fnLiteral += `c.response=c.responseValue=be
`),
                    returning2
                      ? ((fnLiteral += isAsync(hook.fn)
                          ? `af=await e.afterHandle[${i2}](c)
`
                          : `af=e.afterHandle[${i2}](c)
`),
                        (fnLiteral += `if(af!==undefined) c.response=c.responseValue=be=af
`))
                      : (fnLiteral += isAsync(hook.fn)
                          ? `await e.afterHandle[${i2}](c, be)
`
                          : `e.afterHandle[${i2}](c, be)
`),
                    endUnit2('af'));
                }
              reporter2.resolve();
            }
            validator.response && (fnLiteral += validation.response('be'));
            const mapResponseReporter = report('mapResponse', { total: hooks.mapResponse?.length });
            if (hooks.mapResponse?.length) {
              fnLiteral += `c.response=c.responseValue=be
`;
              for (let i2 = 0; i2 < hooks.mapResponse.length; i2++) {
                const mapResponse2 = hooks.mapResponse[i2],
                  endUnit2 = mapResponseReporter.resolveChild(mapResponse2.fn.name);
                ((fnLiteral += `if(mr===undefined){mr=${isAsyncName(mapResponse2) ? 'await ' : ''}e.mapResponse[${i2}](c)
if(mr!==undefined)be=c.response=c.responseValue=mr}`),
                  endUnit2());
              }
            }
            (mapResponseReporter.resolve(),
              (fnLiteral += afterResponse()),
              (fnLiteral += encodeCookie()),
              (fnLiteral += `return mapEarlyResponse(${saveResponse}be,c.set${mapResponseContext})}
`));
          }
        }
      reporter.resolve();
    }
    function reportHandler(name) {
      const handleReporter = report('handle', {
        name,
        alias: 'reportHandler',
      });
      return () => {
        hasTrace &&
          ((fnLiteral +=
            'if(r&&(r[Symbol.iterator]||r[Symbol.asyncIterator])&&typeof r.next==="function"){' +
            (maybeAsync ? '' : '(async()=>{') +
            `const stream=await tee(r,3)
r=stream[0]
` +
            (hooks.afterHandle?.length
              ? `c.response=c.responseValue=r
`
              : '') +
            `const listener=stream[1]
` +
            (hasTrace || hooks.afterResponse?.length
              ? `afterHandlerStreamListener=stream[2]
`
              : '') +
            `${setImmediateFn}(async ()=>{if(listener)for await(const v of listener){}
`),
          handleReporter.resolve(),
          (fnLiteral += '})' + (maybeAsync ? '' : '})()') + '}else{'),
          handleReporter.resolve(),
          (fnLiteral += `}
`));
      };
    }
    if (hooks.afterHandle?.length || hasTrace) {
      const resolveHandler = reportHandler(isHandleFn ? handler.name : void 0);
      (hooks.afterHandle?.length
        ? (fnLiteral += isAsyncHandler
            ? `let r=c.response=c.responseValue=await ${handle}
`
            : `let r=c.response=c.responseValue=${handle}
`)
        : (fnLiteral += isAsyncHandler
            ? `let r=await ${handle}
`
            : `let r=${handle}
`),
        resolveHandler());
      const reporter = report('afterHandle', { total: hooks.afterHandle?.length });
      if (hooks.afterHandle?.length)
        for (let i = 0; i < hooks.afterHandle.length; i++) {
          const hook = hooks.afterHandle[i],
            returning = hasReturn(hook),
            endUnit = reporter.resolveChild(hook.fn.name);
          returning
            ? ((fnLiteral += isAsync(hook.fn)
                ? `af=await e.afterHandle[${i}](c)
`
                : `af=e.afterHandle[${i}](c)
`),
              endUnit('af'),
              validator.response
                ? ((fnLiteral += 'if(af!==undefined){'),
                  reporter.resolve(),
                  (fnLiteral += validation.response('af')),
                  (fnLiteral += 'c.response=c.responseValue=af}'))
                : ((fnLiteral += 'if(af!==undefined){'),
                  reporter.resolve(),
                  (fnLiteral += 'c.response=c.responseValue=af}')))
            : ((fnLiteral += isAsync(hook.fn)
                ? `await e.afterHandle[${i}](c)
`
                : `e.afterHandle[${i}](c)
`),
              endUnit());
        }
      (reporter.resolve(),
        hooks.afterHandle?.length &&
          (fnLiteral += `r=c.response
`),
        validator.response && (fnLiteral += validation.response()),
        (fnLiteral += encodeCookie()));
      const mapResponseReporter = report('mapResponse', { total: hooks.mapResponse?.length });
      if (hooks.mapResponse?.length)
        for (let i = 0; i < hooks.mapResponse.length; i++) {
          const mapResponse2 = hooks.mapResponse[i],
            endUnit = mapResponseReporter.resolveChild(mapResponse2.fn.name);
          ((fnLiteral += `mr=${isAsyncName(mapResponse2) ? 'await ' : ''}e.mapResponse[${i}](c)
if(mr!==undefined)r=c.response=c.responseValue=mr
`),
            endUnit());
        }
      (mapResponseReporter.resolve(), (fnLiteral += mapResponse()));
    } else {
      const resolveHandler = reportHandler(isHandleFn ? handler.name : void 0);
      if (validator.response || hooks.mapResponse?.length || hasTrace) {
        ((fnLiteral += isAsyncHandler
          ? `let r=await ${handle}
`
          : `let r=${handle}
`),
          resolveHandler(),
          validator.response && (fnLiteral += validation.response()));
        const mapResponseReporter = report('mapResponse', { total: hooks.mapResponse?.length });
        if (hooks.mapResponse?.length) {
          fnLiteral += `
c.response=c.responseValue=r
`;
          for (let i = 0; i < hooks.mapResponse.length; i++) {
            const mapResponse2 = hooks.mapResponse[i],
              endUnit = mapResponseReporter.resolveChild(mapResponse2.fn.name);
            ((fnLiteral += `
if(mr===undefined){mr=${isAsyncName(mapResponse2) ? 'await ' : ''}e.mapResponse[${i}](c)
if(mr!==undefined)r=c.response=c.responseValue=mr}
`),
              endUnit());
          }
        }
        (mapResponseReporter.resolve(),
          (fnLiteral += encodeCookie()),
          handler instanceof Response
            ? ((fnLiteral += afterResponse()),
              (fnLiteral += inference.set
                ? `if(isNotEmpty(c.set.headers)||c.set.status!==200||c.set.redirect||c.set.cookie)return mapResponse(${saveResponse}${handle}.clone(),c.set${mapResponseContext})
else return ${handle}.clone()`
                : `return ${handle}.clone()`),
              (fnLiteral += `
`))
            : (fnLiteral += mapResponse()));
      } else if (hasCookie || hasTrace) {
        ((fnLiteral += isAsyncHandler
          ? `let r=await ${handle}
`
          : `let r=${handle}
`),
          resolveHandler());
        const mapResponseReporter = report('mapResponse', { total: hooks.mapResponse?.length });
        if (hooks.mapResponse?.length) {
          fnLiteral += `c.response=c.responseValue= r
`;
          for (let i = 0; i < hooks.mapResponse.length; i++) {
            const mapResponse2 = hooks.mapResponse[i],
              endUnit = mapResponseReporter.resolveChild(mapResponse2.fn.name);
            ((fnLiteral += `if(mr===undefined){mr=${isAsyncName(mapResponse2) ? 'await ' : ''}e.mapResponse[${i}](c)
if(mr!==undefined)r=c.response=c.responseValue=mr}`),
              endUnit());
          }
        }
        (mapResponseReporter.resolve(), (fnLiteral += encodeCookie() + mapResponse()));
      } else {
        resolveHandler();
        const handled = isAsyncHandler ? `await ${handle}` : handle;
        handler instanceof Response
          ? ((fnLiteral += afterResponse()),
            (fnLiteral += inference.set
              ? `if(isNotEmpty(c.set.headers)||c.set.status!==200||c.set.redirect||c.set.cookie)return mapResponse(${saveResponse}${handle}.clone(),c.set${mapResponseContext})
else return ${handle}.clone()
`
              : `return ${handle}.clone()
`))
          : (fnLiteral += mapResponse(handled));
      }
    }
    if (
      ((fnLiteral += `
}catch(error){`),
      !maybeAsync && hooks.error?.length && (fnLiteral += 'return(async()=>{'),
      (fnLiteral += `const set=c.set
if(!set.status||set.status<300)set.status=error?.status||500
`),
      hasCookie && (fnLiteral += encodeCookie()),
      hasTrace && hooks.trace)
    )
      for (let i = 0; i < hooks.trace.length; i++)
        fnLiteral += `report${i}?.resolve(error);reportChild${i}?.(error)
`;
    const errorReporter = report('error', { total: hooks.error?.length });
    if (hooks.error?.length) {
      ((fnLiteral += `c.error=error
`),
        hasValidation
          ? (fnLiteral += `if(error instanceof TypeBoxError){c.code="VALIDATION"
c.set.status=422}else{c.code=error.code??error[ERROR_CODE]??"UNKNOWN"}`)
          : (fnLiteral += `c.code=error.code??error[ERROR_CODE]??"UNKNOWN"
`),
        (fnLiteral += `let er
`),
        hooks.mapResponse?.length &&
          (fnLiteral += `let mep
`));
      for (let i = 0; i < hooks.error.length; i++) {
        const endUnit = errorReporter.resolveChild(hooks.error[i].fn.name);
        if (
          (isAsync(hooks.error[i])
            ? (fnLiteral += `er=await e.error[${i}](c)
`)
            : (fnLiteral += `er=e.error[${i}](c)
if(er instanceof Promise)er=await er
`),
          endUnit(),
          hooks.mapResponse?.length)
        ) {
          const mapResponseReporter = report('mapResponse', { total: hooks.mapResponse?.length });
          for (let i2 = 0; i2 < hooks.mapResponse.length; i2++) {
            const mapResponse2 = hooks.mapResponse[i2],
              endUnit2 = mapResponseReporter.resolveChild(mapResponse2.fn.name);
            ((fnLiteral += `c.response=c.responseValue=er
mep=e.mapResponse[${i2}](c)
if(mep instanceof Promise)mep=await mep
if(mep!==undefined)er=mep
`),
              endUnit2());
          }
          mapResponseReporter.resolve();
        }
        if (
          ((fnLiteral += `er=mapEarlyResponse(er,set${mapResponseContext})
`),
          (fnLiteral += 'if(er){'),
          hasTrace && hooks.trace)
        ) {
          for (let i2 = 0; i2 < hooks.trace.length; i2++)
            fnLiteral += `report${i2}.resolve()
`;
          errorReporter.resolve();
        }
        ((fnLiteral += afterResponse(!1)), (fnLiteral += 'return er}'));
      }
    }
    (errorReporter.resolve(),
      (fnLiteral += 'return handleError(c,error,true)'),
      !maybeAsync && hooks.error?.length && (fnLiteral += '})()'),
      (fnLiteral += '}'));
    const adapterVariables = adapter.inject ? Object.keys(adapter.inject).join(',') + ',' : '';
    let init =
      'const {handler,handleError,hooks:e, ' +
      allocateIf$1('validator,', hasValidation) +
      'mapResponse,mapCompactResponse,mapEarlyResponse,isNotEmpty,utils:{' +
      allocateIf$1('parseQuery,', hasBody) +
      allocateIf$1('parseQueryFromURL,', hasQuery) +
      '},error:{' +
      allocateIf$1('ValidationError,', hasValidation) +
      allocateIf$1('ParseError', hasBody) +
      '},fileType,schema,definitions,tee,ERROR_CODE,' +
      allocateIf$1('parseCookie,', hasCookie) +
      allocateIf$1('signCookie,', hasCookie) +
      allocateIf$1('decodeURIComponent,', hasQuery) +
      'ElysiaCustomStatusResponse,' +
      allocateIf$1('ELYSIA_TRACE,', hasTrace) +
      allocateIf$1('ELYSIA_REQUEST_ID,', hasTrace) +
      allocateIf$1('parser,', hooks.parse?.length) +
      allocateIf$1('getServer,', inference.server) +
      allocateIf$1('fileUnions,', fileUnions.length) +
      adapterVariables +
      allocateIf$1('TypeBoxError', hasValidation) +
      `}=hooks
const trace=e.trace
return ${maybeAsync ? 'async ' : ''}function handle(c){`;
    (hooks.beforeHandle?.length &&
      (init += `let be
`),
      hooks.afterHandle?.length &&
        (init += `let af
`),
      hooks.mapResponse?.length &&
        (init += `let mr
`),
      allowMeta &&
        (init += `c.schema=schema
c.defs=definitions
`),
      (fnLiteral = init + fnLiteral + '}'),
      (init = ''));
    try {
      return Function(
        'hooks',
        `"use strict";
` + fnLiteral,
      )({
        handler,
        hooks: lifeCycleToFn(hooks),
        validator: hasValidation ? validator : void 0,
        handleError: app.handleError,
        mapResponse: adapterHandler.mapResponse,
        mapCompactResponse: adapterHandler.mapCompactResponse,
        mapEarlyResponse: adapterHandler.mapEarlyResponse,
        isNotEmpty,
        utils: {
          parseQuery: hasBody ? parseQuery : void 0,
          parseQueryFromURL: hasQuery
            ? validator.query?.provider === 'standard'
              ? parseQueryStandardSchema
              : parseQueryFromURL
            : void 0,
        },
        error: {
          ValidationError: hasValidation ? ValidationError : void 0,
          ParseError: hasBody ? ParseError : void 0,
        },
        fileType,
        schema: app.router.history,
        definitions: app.definitions.type,
        tee,
        ERROR_CODE,
        parseCookie: hasCookie ? parseCookie : void 0,
        signCookie: hasCookie ? signCookie : void 0,
        Cookie: hasCookie ? Cookie : void 0,
        decodeURIComponent: hasQuery ? import_fast_decode_uri_component.default : void 0,
        ElysiaCustomStatusResponse,
        ELYSIA_TRACE: hasTrace ? ELYSIA_TRACE : void 0,
        ELYSIA_REQUEST_ID: hasTrace ? ELYSIA_REQUEST_ID : void 0,
        getServer: inference.server ? () => app.getServer() : void 0,
        fileUnions: fileUnions.length ? fileUnions : void 0,
        TypeBoxError: hasValidation ? TypeBoxError : void 0,
        parser: app['~parser'],
        ...adapter.inject,
      });
    } catch (error) {
      const debugHooks = lifeCycleToFn(hooks);
      return (
        console.log('[Composer] failed to generate optimized handler'),
        console.log('---'),
        console.log({
          handler: typeof handler == 'function' ? handler.toString() : handler,
          instruction: fnLiteral,
          hooks: {
            ...debugHooks,
            transform: debugHooks?.transform?.map?.((x) => x.toString()),
            resolve: debugHooks?.resolve?.map?.((x) => x.toString()),
            beforeHandle: debugHooks?.beforeHandle?.map?.((x) => x.toString()),
            afterHandle: debugHooks?.afterHandle?.map?.((x) => x.toString()),
            mapResponse: debugHooks?.mapResponse?.map?.((x) => x.toString()),
            parse: debugHooks?.parse?.map?.((x) => x.toString()),
            error: debugHooks?.error?.map?.((x) => x.toString()),
            afterResponse: debugHooks?.afterResponse?.map?.((x) => x.toString()),
            stop: debugHooks?.stop?.map?.((x) => x.toString()),
          },
          validator,
          definitions: app.definitions.type,
          error,
        }),
        console.log('---'),
        typeof process?.exit == 'function' && process.exit(1),
        () => new Response('Internal Server Error', { status: 500 })
      );
    }
  },
  createOnRequestHandler = (app, addFn) => {
    let fnLiteral = '';
    const reporter = createReport({
      trace: app.event.trace,
      addFn:
        addFn ??
        ((word) => {
          fnLiteral += word;
        }),
    })('request', { total: app.event.request?.length });
    if (app.event.request?.length) {
      fnLiteral += 'try{';
      for (let i = 0; i < app.event.request.length; i++) {
        const hook = app.event.request[i],
          withReturn = hasReturn(hook),
          maybeAsync = isAsync(hook),
          endUnit = reporter.resolveChild(app.event.request[i].fn.name);
        withReturn
          ? ((fnLiteral += `re=mapEarlyResponse(${maybeAsync ? 'await ' : ''}onRequest[${i}](c),c.set)
`),
            endUnit('re'),
            (fnLiteral += `if(re!==undefined)return re
`))
          : ((fnLiteral += `${maybeAsync ? 'await ' : ''}onRequest[${i}](c)
`),
            endUnit());
      }
      fnLiteral += '}catch(error){return app.handleError(c,error,false)}';
    }
    return (reporter.resolve(), fnLiteral);
  },
  createHoc = (app, fnName = 'map') => {
    const hoc = app.extender.higherOrderFunctions;
    if (!hoc.length) return 'return ' + fnName;
    const adapter = app['~adapter'].composeGeneralHandler;
    let handler = fnName;
    for (let i = 0; i < hoc.length; i++) handler = `hoc[${i}](${handler},${adapter.parameters})`;
    return `return function hocMap(${adapter.parameters}){return ${handler}(${adapter.parameters})}`;
  },
  composeGeneralHandler = (app) => {
    const adapter = app['~adapter'].composeGeneralHandler;
    app.router.http.build();
    const isWebstandard = app['~adapter'].isWebStandard,
      hasTrace = app.event.trace?.length;
    let fnLiteral = '';
    const router = app.router;
    let findDynamicRoute = router.http.root.WS
      ? "const route=router.find(r.method==='GET'&&r.headers.get('upgrade')==='websocket'?'WS':r.method,p)"
      : 'const route=router.find(r.method,p)';
    ((findDynamicRoute += router.http.root.ALL
      ? `??router.find('ALL',p)
`
      : `
`),
      isWebstandard &&
        (findDynamicRoute +=
          'if(r.method==="HEAD"){const route=router.find("GET",p);if(route){c.params=route.params;const _res=route.store.handler?route.store.handler(c):route.store.compile()(c);if(_res)return Promise.resolve(_res).then((_res)=>{if(!_res.headers)_res.headers=new Headers();return getResponseLength(_res).then((length)=>{_res.headers.set("content-length", length);return new Response(null,{status:_res.status,statusText:_res.statusText,headers:_res.headers});})});}}'));
    let afterResponse = `c.error=notFound
`;
    if (app.event.afterResponse?.length && !app.event.error) {
      afterResponse = `
c.error=notFound
`;
      const prefix = app.event.afterResponse.some(isAsync) ? 'async' : '';
      afterResponse += `
${setImmediateFn}(${prefix}()=>{if(c.responseValue instanceof ElysiaCustomStatusResponse) c.set.status=c.responseValue.code
`;
      for (let i = 0; i < app.event.afterResponse.length; i++) {
        const fn2 = app.event.afterResponse[i].fn;
        afterResponse += `
${isAsyncName(fn2) ? 'await ' : ''}afterResponse[${i}](c)
`;
      }
      afterResponse += `})
`;
    }
    app.inference.query &&
      (afterResponse += `
if(c.qi===-1){c.query={}}else{c.query=parseQueryFromURL(c.url,c.qi+1)}`);
    const error404 = adapter.error404(
      !!app.event.request?.length,
      !!app.event.error?.length,
      afterResponse,
    );
    ((findDynamicRoute += error404.code),
      (findDynamicRoute += `
c.params=route.params
if(route.store.handler)return route.store.handler(c)
return route.store.compile()(c)
`));
    let switchMap = '';
    for (const [path, methods] of Object.entries(router.static)) {
      ((switchMap += `case'${path}':`),
        app.config.strictPath !== !0 && (switchMap += `case'${getLoosePath(path)}':`));
      const encoded = encodePath(path);
      (path !== encoded && (switchMap += `case'${encoded}':`),
        (switchMap += 'switch(r.method){'),
        ('GET' in methods || 'WS' in methods) &&
          ((switchMap += "case 'GET':"),
          'WS' in methods &&
            ((switchMap += `if(r.headers.get('upgrade')==='websocket')return ht[${methods.WS}].composed(c)
`),
            'GET' in methods ||
              ('ALL' in methods
                ? (switchMap += `return ht[${methods.ALL}].composed(c)
`)
                : (switchMap += `break map
`))),
          'GET' in methods &&
            (switchMap += `return ht[${methods.GET}].composed(c)
`)),
        isWebstandard &&
          ('GET' in methods || 'ALL' in methods) &&
          !('HEAD' in methods) &&
          (switchMap += `case 'HEAD':return Promise.resolve(ht[${methods.GET ?? methods.ALL}].composed(c)).then(_ht=>getResponseLength(_ht).then((length)=>{_ht.headers.set('content-length', length)
return new Response(null,{status:_ht.status,statusText:_ht.statusText,headers:_ht.headers})
}))
`));
      for (const [method, index] of Object.entries(methods))
        method === 'ALL' ||
          method === 'GET' ||
          method === 'WS' ||
          (switchMap += `case '${method}':return ht[${index}].composed(c)
`);
      ('ALL' in methods
        ? (switchMap += `default:return ht[${methods.ALL}].composed(c)
`)
        : (switchMap += `default:break map
`),
        (switchMap += '}'));
    }
    const maybeAsync = !!app.event.request?.some(isAsync),
      adapterVariables = adapter.inject ? Object.keys(adapter.inject).join(',') + ',' : '';
    ((fnLiteral +=
      `
const {app,mapEarlyResponse,NotFoundError,randomId,handleError,status,redirect,getResponseLength,ElysiaCustomStatusResponse,` +
      allocateIf$1('parseQueryFromURL,', app.inference.query) +
      allocateIf$1('ELYSIA_TRACE,', hasTrace) +
      allocateIf$1('ELYSIA_REQUEST_ID,', hasTrace) +
      adapterVariables +
      `}=data
const store=app.singleton.store
const decorator=app.singleton.decorator
const staticRouter=app.router.static.http
const ht=app.router.history
const router=app.router.http
const trace=app.event.trace?.map(x=>typeof x==='function'?x:x.fn)??[]
const notFound=new NotFoundError()
const hoc=app.extender.higherOrderFunctions.map(x=>x.fn)
`),
      app.event.request?.length &&
        (fnLiteral += `const onRequest=app.event.request.map(x=>x.fn)
`),
      app.event.afterResponse?.length &&
        (fnLiteral += `const afterResponse=app.event.afterResponse.map(x=>x.fn)
`),
      (fnLiteral += error404.declare),
      app.event.trace?.length &&
        (fnLiteral +=
          'const ' +
          app.event.trace.map((_, i) => `tr${i}=app.event.trace[${i}].fn`).join(',') +
          `
`),
      (fnLiteral += `${maybeAsync ? 'async ' : ''}function map(${adapter.parameters}){`),
      app.event.request?.length &&
        (fnLiteral += `let re
`),
      (fnLiteral += adapter.createContext(app)),
      app.event.trace?.length &&
        (fnLiteral +=
          'c[ELYSIA_TRACE]=[' +
          app.event.trace.map((_, i) => `tr${i}(c)`).join(',') +
          `]
`),
      (fnLiteral += createOnRequestHandler(app)),
      switchMap &&
        (fnLiteral +=
          `
map: switch(p){
` +
          switchMap +
          '}'),
      (fnLiteral +=
        findDynamicRoute +
        `}
` +
        createHoc(app)));
    const handleError = composeErrorHandler(app);
    app.handleError = handleError;
    const fn = Function(
      'data',
      `"use strict";
` + fnLiteral,
    )({
      app,
      mapEarlyResponse: app['~adapter'].handler.mapEarlyResponse,
      NotFoundError,
      randomId,
      handleError,
      status,
      redirect,
      getResponseLength,
      ElysiaCustomStatusResponse,
      parseQueryFromURL: app.inference.query ? parseQueryFromURL : void 0,
      ELYSIA_TRACE: hasTrace ? ELYSIA_TRACE : void 0,
      ELYSIA_REQUEST_ID: hasTrace ? ELYSIA_REQUEST_ID : void 0,
      ...adapter.inject,
    });
    return (isBun && Bun.gc(!1), fn);
  },
  composeErrorHandler = (app) => {
    const hooks = app.event;
    let fnLiteral = '';
    const adapter = app['~adapter'].composeError,
      adapterVariables = adapter.inject ? Object.keys(adapter.inject).join(',') + ',' : '',
      hasTrace = !!app.event.trace?.length;
    ((fnLiteral +=
      'const {mapResponse,ERROR_CODE,ElysiaCustomStatusResponse,ValidationError,TransformDecodeError,' +
      allocateIf$1('onError,', app.event.error) +
      allocateIf$1('afterResponse,', app.event.afterResponse) +
      allocateIf$1('trace,', app.event.trace) +
      allocateIf$1('onMapResponse,', app.event.mapResponse) +
      allocateIf$1('ELYSIA_TRACE,', hasTrace) +
      allocateIf$1('ELYSIA_REQUEST_ID,', hasTrace) +
      adapterVariables +
      `}=inject
`),
      (fnLiteral += 'return async function(context,error,skipGlobal){'),
      (fnLiteral += ''),
      hasTrace &&
        (fnLiteral += `const id=context[ELYSIA_REQUEST_ID]
`));
    const report = createReport({
        context: 'context',
        trace: hooks.trace,
        addFn: (word) => {
          fnLiteral += word;
        },
      }),
      afterResponse = () => {
        if (!hooks.afterResponse?.length && !hasTrace) return '';
        let afterResponse2 = '';
        const prefix = hooks.afterResponse?.some(isAsync) ? 'async' : '';
        afterResponse2 += `
${setImmediateFn}(${prefix}()=>{`;
        const reporter = createReport({
          context: 'context',
          trace: hooks.trace,
          addFn: (word) => {
            afterResponse2 += word;
          },
        })('afterResponse', {
          total: hooks.afterResponse?.length,
          name: 'context',
        });
        if (hooks.afterResponse?.length && hooks.afterResponse)
          for (let i = 0; i < hooks.afterResponse.length; i++) {
            const fn = hooks.afterResponse[i].fn,
              endUnit = reporter.resolveChild(fn.name);
            ((afterResponse2 += `
${isAsyncName(fn) ? 'await ' : ''}afterResponse[${i}](context)
`),
              endUnit());
          }
        return (
          reporter.resolve(),
          (afterResponse2 += `})
`),
          afterResponse2
        );
      };
    ((fnLiteral += `const set=context.set
let _r
if(!context.code)context.code=error.code??error[ERROR_CODE]
if(!(context.error instanceof Error))context.error=error
if(error instanceof ElysiaCustomStatusResponse){set.status=error.status=error.code
error.message=error.response}`),
      adapter.declare && (fnLiteral += adapter.declare));
    const saveResponse = hasTrace || hooks.afterResponse?.length ? 'context.response = ' : '';
    if (
      ((fnLiteral += `if(typeof error?.toResponse==='function'&&!(error instanceof ValidationError)&&!(error instanceof TransformDecodeError)){try{let raw=error.toResponse()
if(typeof raw?.then==='function')raw=await raw
if(raw instanceof Response)set.status=raw.status
context.response=context.responseValue=raw
}catch(toResponseError){
}
}
`),
      app.event.error)
    )
      for (let i = 0; i < app.event.error.length; i++) {
        const handler = app.event.error[i],
          response = `${isAsync(handler) ? 'await ' : ''}onError[${i}](context)
`;
        if (((fnLiteral += 'if(skipGlobal!==true&&!context.response){'), hasReturn(handler))) {
          fnLiteral +=
            `_r=${response}
if(_r!==undefined){if(_r instanceof Response){` +
            afterResponse() +
            `return mapResponse(_r,set${adapter.mapResponseContext})}if(_r instanceof ElysiaCustomStatusResponse){error.status=error.code
error.message=error.response}if(set.status===200||!set.status)set.status=error.status
`;
          const mapResponseReporter2 = report('mapResponse', {
            total: hooks.mapResponse?.length,
            name: 'context',
          });
          if (hooks.mapResponse?.length)
            for (let i2 = 0; i2 < hooks.mapResponse.length; i2++) {
              const mapResponse = hooks.mapResponse[i2],
                endUnit = mapResponseReporter2.resolveChild(mapResponse.fn.name);
              ((fnLiteral += `context.response=context.responseValue=_r
_r=${isAsyncName(mapResponse) ? 'await ' : ''}onMapResponse[${i2}](context)
`),
                endUnit());
            }
          (mapResponseReporter2.resolve(),
            (fnLiteral +=
              afterResponse() +
              `return mapResponse(${saveResponse}_r,set${adapter.mapResponseContext})}`));
        } else fnLiteral += response;
        fnLiteral += '}';
      }
    ((fnLiteral +=
      `if(error instanceof ValidationError||error instanceof TransformDecodeError){
if(error.error)error=error.error
set.status=error.status??422
` +
      afterResponse() +
      adapter.validationError +
      `
}
`),
      (fnLiteral +=
        'if(!context.response&&error instanceof Error){' +
        afterResponse() +
        adapter.unknownError +
        `
}`));
    const mapResponseReporter = report('mapResponse', {
      total: hooks.mapResponse?.length,
      name: 'context',
    });
    if (
      ((fnLiteral += `
if(!context.response)context.response=context.responseValue=error.message??error
`),
      hooks.mapResponse?.length)
    ) {
      fnLiteral += `let mr
`;
      for (let i = 0; i < hooks.mapResponse.length; i++) {
        const mapResponse = hooks.mapResponse[i],
          endUnit = mapResponseReporter.resolveChild(mapResponse.fn.name);
        ((fnLiteral += `if(mr===undefined){mr=${isAsyncName(mapResponse) ? 'await ' : ''}onMapResponse[${i}](context)
if(mr!==undefined)error=context.response=context.responseValue=mr}`),
          endUnit());
      }
    }
    (mapResponseReporter.resolve(),
      (fnLiteral +=
        afterResponse() +
        `
return mapResponse(${saveResponse}error,set${adapter.mapResponseContext})}`));
    const mapFn = (x) => (typeof x == 'function' ? x : x.fn);
    return Function(
      'inject',
      `"use strict";
` + fnLiteral,
    )({
      mapResponse: app['~adapter'].handler.mapResponse,
      ERROR_CODE,
      ElysiaCustomStatusResponse,
      ValidationError,
      TransformDecodeError,
      onError: app.event.error?.map(mapFn),
      afterResponse: app.event.afterResponse?.map(mapFn),
      trace: app.event.trace?.map(mapFn),
      onMapResponse: app.event.mapResponse?.map(mapFn),
      ELYSIA_TRACE: hasTrace ? ELYSIA_TRACE : void 0,
      ELYSIA_REQUEST_ID: hasTrace ? ELYSIA_REQUEST_ID : void 0,
      ...adapter.inject,
    });
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/adapter/bun/compose.mjs
var allocateIf = (value, condition) => (condition ? value : ''),
  createContext = (app, route, inference, isInline = !1) => {
    let fnLiteral = '';
    const defaultHeaders = app.setHeaders,
      hasTrace = !!app.event.trace?.length;
    hasTrace &&
      (fnLiteral += `const id=randomId()
`);
    const isDynamic = /[:*]/.test(route.path),
      getQi = `const u=request.url,s=u.indexOf('/',${(app.config.handler?.standardHostname ?? !0) ? 11 : 7}),qi=u.indexOf('?',s+1)
`,
      needsQuery =
        inference.query ||
        !!route.hooks.query ||
        !!route.hooks.standaloneValidator?.find((x) => x.query) ||
        app.event.request?.length;
    needsQuery && (fnLiteral += getQi);
    const getPath = inference.path
      ? isDynamic
        ? 'get path(){' +
          (needsQuery ? '' : getQi) +
          `if(qi===-1)return u.substring(s)
return u.substring(s,qi)
},`
        : `path:'${route.path}',`
      : '';
    ((fnLiteral +=
      allocateIf('const c=', !isInline) +
      '{request,store,' +
      allocateIf('qi,', needsQuery) +
      allocateIf('params:request.params,', isDynamic) +
      getPath +
      allocateIf('url:request.url,', hasTrace || inference.url || needsQuery) +
      'redirect,status,set:{headers:' +
      (isNotEmpty(defaultHeaders) ? 'Object.assign({},app.setHeaders)' : 'Object.create(null)') +
      ',status:200}'),
      inference.server && (fnLiteral += ',get server(){return app.getServer()}'),
      hasTrace && (fnLiteral += ',[ELYSIA_REQUEST_ID]:id'));
    {
      let decoratorsLiteral = '';
      for (const key of Object.keys(app.singleton.decorator))
        decoratorsLiteral += `,'${key}':decorator['${key}']`;
      fnLiteral += decoratorsLiteral;
    }
    return (
      (fnLiteral += `}
`),
      fnLiteral
    );
  },
  createBunRouteHandler = (app, route) => {
    const hasTrace = !!app.event.trace?.length,
      hasHoc = !!app.extender.higherOrderFunctions.length;
    let inference = sucrose(route.hooks, app.inference);
    inference = sucrose({ handler: route.handler }, inference);
    let fnLiteral =
      'const handler=data.handler,app=data.app,store=data.store,decorator=data.decorator,redirect=data.redirect,route=data.route,mapEarlyResponse=data.mapEarlyResponse,' +
      allocateIf('randomId=data.randomId,', hasTrace) +
      allocateIf('ELYSIA_REQUEST_ID=data.ELYSIA_REQUEST_ID,', hasTrace) +
      allocateIf('ELYSIA_TRACE=data.ELYSIA_TRACE,', hasTrace) +
      allocateIf('trace=data.trace,', hasTrace) +
      allocateIf('hoc=data.hoc,', hasHoc) +
      `status=data.status
`;
    (app.event.request?.length &&
      (fnLiteral += `const onRequest=app.event.request.map(x=>x.fn)
`),
      (fnLiteral += `${app.event.request?.find(isAsync) ? 'async' : ''} function map(request){`));
    const needsQuery =
      inference.query ||
      !!route.hooks.query ||
      !!route.hooks.standaloneValidator?.find((x) => x.query);
    return (
      hasTrace || needsQuery || app.event.request?.length
        ? ((fnLiteral += createContext(app, route, inference)),
          (fnLiteral += createOnRequestHandler(app)),
          (fnLiteral += 'return handler(c)}'))
        : (fnLiteral += `return handler(${createContext(app, route, inference, !0)})}`),
      (fnLiteral += createHoc(app)),
      Function(
        'data',
        fnLiteral,
      )({
        app,
        handler: route.compile?.() ?? route.composed,
        redirect,
        status,
        hoc: app.extender.higherOrderFunctions.map((x) => x.fn),
        store: app.store,
        decorator: app.decorator,
        route: route.path,
        randomId: hasTrace ? randomId : void 0,
        ELYSIA_TRACE: hasTrace ? ELYSIA_TRACE : void 0,
        ELYSIA_REQUEST_ID: hasTrace ? ELYSIA_REQUEST_ID : void 0,
        trace: hasTrace ? app.event.trace?.map((x) => x?.fn ?? x) : void 0,
        mapEarlyResponse,
      })
    );
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/adapter/bun/handler-native.mjs
var createNativeStaticHandler = (handle, hooks, set) => {
  if (typeof handle == 'function' || handle instanceof Blob) return;
  if (isHTMLBundle(handle)) return () => handle;
  const response = mapResponse(
    handle instanceof Response
      ? handle.clone()
      : handle instanceof Promise
        ? handle.then((x) => (x instanceof Response ? x.clone() : isHTMLBundle(x) ? () => x : x))
        : handle,
    set ?? { headers: {} },
  );
  if (
    !hooks.parse?.length &&
    !hooks.transform?.length &&
    !hooks.beforeHandle?.length &&
    !hooks.afterHandle?.length
  )
    return response instanceof Promise
      ? response.then((response2) => {
          if (response2) return response2.clone();
        })
      : () => response.clone();
};
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/ws/index.mjs
var websocket = {
  open(ws) {
    ws.data.open?.(ws);
  },
  message(ws, message) {
    ws.data.message?.(ws, message);
  },
  drain(ws) {
    ws.data.drain?.(ws);
  },
  close(ws, code, reason) {
    ws.data.close?.(ws, code, reason);
  },
  ping(ws) {
    ws.data.ping?.(ws);
  },
  pong(ws) {
    ws.data.pong?.(ws);
  },
};
var ElysiaWS = class {
  constructor(raw, data, body = void 0) {
    this.raw = raw;
    this.data = data;
    this.body = body;
    ((this.validator = raw.data?.validator),
      (this.sendText = raw.sendText.bind(raw)),
      (this.sendBinary = raw.sendBinary.bind(raw)),
      (this.close = raw.close.bind(raw)),
      (this.terminate = raw.terminate.bind(raw)),
      (this.publishText = raw.publishText.bind(raw)),
      (this.publishBinary = raw.publishBinary.bind(raw)),
      (this.subscribe = raw.subscribe.bind(raw)),
      (this.unsubscribe = raw.unsubscribe.bind(raw)),
      (this.isSubscribed = raw.isSubscribed.bind(raw)),
      (this.cork = raw.cork.bind(raw)),
      (this.remoteAddress = raw.remoteAddress),
      (this.binaryType = raw.binaryType),
      (this.data = raw.data),
      (this.subscriptions = raw.subscriptions),
      (this.send = this.send.bind(this)),
      (this.ping = this.ping.bind(this)),
      (this.pong = this.pong.bind(this)),
      (this.publish = this.publish.bind(this)));
  }
  /**
   * Sends a message to the client.
   *
   * @param data The data to send.
   * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
   * @example
   * ws.send("Hello!");
   * ws.send("Compress this.", true);
   * ws.send(new Uint8Array([1, 2, 3, 4]));
   */
  send(data, compress) {
    return Buffer.isBuffer(data)
      ? this.raw.send(data, compress)
      : this.validator?.Check(data) === !1
        ? this.raw.send(new ValidationError('message', this.validator, data).message)
        : (typeof data == 'object' && (data = JSON.stringify(data)), this.raw.send(data, compress));
  }
  /**
   * Sends a ping.
   *
   * @param data The data to send
   */
  ping(data) {
    return Buffer.isBuffer(data)
      ? this.raw.ping(data)
      : this.validator?.Check(data) === !1
        ? this.raw.send(new ValidationError('message', this.validator, data).message)
        : (typeof data == 'object' && (data = JSON.stringify(data)), this.raw.ping(data));
  }
  /**
   * Sends a pong.
   *
   * @param data The data to send
   */
  pong(data) {
    return Buffer.isBuffer(data)
      ? this.raw.pong(data)
      : this.validator?.Check(data) === !1
        ? this.raw.send(new ValidationError('message', this.validator, data).message)
        : (typeof data == 'object' && (data = JSON.stringify(data)), this.raw.pong(data));
  }
  /**
   * Sends a message to subscribers of the topic.
   *
   * @param topic The topic name.
   * @param data The data to send.
   * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
   * @example
   * ws.publish("chat", "Hello!");
   * ws.publish("chat", "Compress this.", true);
   * ws.publish("chat", new Uint8Array([1, 2, 3, 4]));
   */
  publish(topic, data, compress) {
    return Buffer.isBuffer(data)
      ? this.raw.publish(topic, data, compress)
      : this.validator?.Check(data) === !1
        ? this.raw.send(new ValidationError('message', this.validator, data).message)
        : (typeof data == 'object' && (data = JSON.stringify(data)),
          this.raw.publish(topic, data, compress));
  }
  get readyState() {
    return this.raw.readyState;
  }
  get id() {
    return this.data.id;
  }
};
var createWSMessageParser = (parse) => {
    const parsers = typeof parse == 'function' ? [parse] : parse;
    return async function (ws, message) {
      if (typeof message == 'string') {
        const start = message?.charCodeAt(0);
        if (start === 34 || start === 47 || start === 91 || start === 123)
          try {
            message = JSON.parse(message);
          } catch {}
        else
          isNumericString(message)
            ? (message = +message)
            : message === 'true'
              ? (message = !0)
              : message === 'false'
                ? (message = !1)
                : message === 'null' && (message = null);
      }
      if (parsers)
        for (let i = 0; i < parsers.length; i++) {
          let temp = parsers[i](ws, message);
          if ((temp instanceof Promise && (temp = await temp), temp !== void 0)) return temp;
        }
      return message;
    };
  },
  createHandleWSResponse = (responseValidator) => {
    const handleWSResponse = (ws, data) => {
      if (data instanceof Promise) return data.then((data2) => handleWSResponse(ws, data2));
      if (Buffer.isBuffer(data)) return ws.send(data.toString());
      if (data === void 0) return;
      const validateResponse = responseValidator
          ? responseValidator.provider === 'standard'
            ? (data2) => responseValidator.schema['~standard'].validate(data2).issues
            : (data2) => responseValidator.Check(data2) === !1
          : void 0,
        send = (datum) => {
          if (validateResponse && validateResponse(datum) === !1)
            return ws.send(new ValidationError('message', responseValidator, datum).message);
          if (typeof datum == 'object') return ws.send(JSON.stringify(datum));
          ws.send(datum);
        };
      if (typeof data?.next != 'function') return void send(data);
      const init = data.next();
      if (init instanceof Promise)
        return (async () => {
          const first = await init;
          if (validateResponse && validateResponse(first))
            return ws.send(new ValidationError('message', responseValidator, first).message);
          if ((send(first.value), !first.done)) for await (const datum of data) send(datum);
        })();
      if ((send(init.value), !init.done)) for (const datum of data) send(datum);
    };
    return handleWSResponse;
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/adapter/bun/index.mjs
var optionalParam = /:.+?\?(?=\/|$)/,
  getPossibleParams = (path) => {
    const match = optionalParam.exec(path);
    if (!match) return [path];
    const routes = [],
      head = path.slice(0, match.index),
      param = match[0].slice(0, -1),
      tail = path.slice(match.index + match[0].length);
    (routes.push(head.slice(0, -1)), routes.push(head + param));
    for (const fragment of getPossibleParams(tail))
      fragment &&
        (fragment.startsWith('/:') || routes.push(head.slice(0, -1) + fragment),
        routes.push(head + param + fragment));
    return routes;
  },
  isHTMLBundle = (handle) =>
    typeof handle == 'object' &&
    handle !== null &&
    (handle.toString() === '[object HTMLBundle]' || typeof handle.index == 'string'),
  supportedMethods = {
    GET: !0,
    HEAD: !0,
    OPTIONS: !0,
    DELETE: !0,
    PATCH: !0,
    POST: !0,
    PUT: !0,
  },
  mapRoutes = (app) => {
    if (!app.config.aot || app.config.systemRouter === !1) return;
    const routes = {},
      add = (route, handler) => {
        const path = encodeURI(route.path);
        routes[path]
          ? routes[path][route.method] || (routes[path][route.method] = handler)
          : (routes[path] = { [route.method]: handler });
      },
      tree = app.routeTree;
    for (const route of app.router.history) {
      if (typeof route.handler != 'function') continue;
      const method = route.method;
      if (
        (method === 'GET' && `WS_${route.path}` in tree) ||
        method === 'WS' ||
        route.path.charCodeAt(route.path.length - 1) === 42 ||
        !(method in supportedMethods)
      )
        continue;
      if (method === 'ALL') {
        `WS_${route.path}` in tree ||
          (routes[route.path] = route.hooks?.config?.mount
            ? route.hooks.trace || app.event.trace || app.extender.higherOrderFunctions
              ? createBunRouteHandler(app, route)
              : route.hooks.mount || route.handler
            : route.handler);
        continue;
      }
      let compiled;
      const handler = app.config.precompile
        ? createBunRouteHandler(app, route)
        : (request) =>
            compiled ? compiled(request) : (compiled = createBunRouteHandler(app, route))(request);
      for (const path of getPossibleParams(route.path))
        add(
          {
            method,
            path,
          },
          handler,
        );
    }
    return routes;
  },
  mergeRoutes = (r1, r2) => {
    if (!r2) return r1;
    for (const key of Object.keys(r2))
      if (r1[key] !== r2[key]) {
        if (!r1[key]) {
          r1[key] = r2[key];
          continue;
        }
        if (r1[key] && r2[key]) {
          if (typeof r1[key] == 'function' || r1[key] instanceof Response) {
            r1[key] = r2[key];
            continue;
          }
          r1[key] = {
            ...r1[key],
            ...r2[key],
          };
        }
      }
    return r1;
  },
  removeTrailingPath = (routes) => {
    for (const key of Object.keys(routes))
      key.length > 1 &&
        key.charCodeAt(key.length - 1) === 47 &&
        ((routes[key.slice(0, -1)] = routes[key]), delete routes[key]);
    return routes;
  },
  BunAdapter = {
    ...WebStandardAdapter,
    name: 'bun',
    handler: {
      mapResponse,
      mapEarlyResponse,
      mapCompactResponse,
      createStaticHandler,
      createNativeStaticHandler,
    },
    composeHandler: {
      ...WebStandardAdapter.composeHandler,
      headers: hasHeaderShorthand
        ? `c.headers=c.request.headers.toJSON()
`
        : `c.headers={}
for(const [k,v] of c.request.headers.entries())c.headers[k]=v
`,
    },
    listen(app) {
      return (options, callback) => {
        if (typeof Bun > 'u')
          throw new Error(
            '.listen() is designed to run on Bun only. If you are running Elysia in other environment please use a dedicated plugin or export the handler via Elysia.fetch',
          );
        if ((app.compile(), typeof options == 'string')) {
          if (!isNumericString(options)) throw new Error('Port must be a numeric value');
          options = parseInt(options);
        }
        const createStaticRoute = (iterator, { withAsync = !1 } = {}) => {
            const staticRoutes = {},
              ops = [];
            for (let [path, route] of Object.entries(iterator))
              if (((path = encodeURI(path)), supportPerMethodInlineHandler)) {
                if (!route) continue;
                for (const [method, value] of Object.entries(route))
                  if (!(!value || !(method in supportedMethods))) {
                    if (value instanceof Promise) {
                      withAsync &&
                        (staticRoutes[path] || (staticRoutes[path] = {}),
                        ops.push(
                          value.then((awaited) => {
                            (awaited instanceof Response && (staticRoutes[path][method] = awaited),
                              isHTMLBundle(awaited) && (staticRoutes[path][method] = awaited));
                          }),
                        ));
                      continue;
                    }
                    (!(value instanceof Response) && !isHTMLBundle(value)) ||
                      (staticRoutes[path] || (staticRoutes[path] = {}),
                      (staticRoutes[path][method] = value));
                  }
              } else {
                if (!route) continue;
                if (route instanceof Promise) {
                  withAsync &&
                    (staticRoutes[path] || (staticRoutes[path] = {}),
                    ops.push(
                      route.then((awaited) => {
                        awaited instanceof Response && (staticRoutes[path] = awaited);
                      }),
                    ));
                  continue;
                }
                if (!(route instanceof Response)) continue;
                staticRoutes[path] = route;
              }
            return withAsync ? Promise.all(ops).then(() => staticRoutes) : staticRoutes;
          },
          routes = removeTrailingPath(
            mergeRoutes(
              mergeRoutes(createStaticRoute(app.router.response), mapRoutes(app)),
              app.config.serve?.routes,
            ),
          ),
          serve =
            typeof options == 'object'
              ? {
                  development: !isProduction,
                  reusePort: !0,
                  idleTimeout: 30,
                  ...app.config.serve,
                  ...options,
                  routes,
                  websocket: {
                    ...app.config.websocket,
                    ...websocket,
                    ...options.websocket,
                  },
                  fetch: app.fetch,
                }
              : {
                  development: !isProduction,
                  reusePort: !0,
                  idleTimeout: 30,
                  ...app.config.serve,
                  routes,
                  websocket: {
                    ...app.config.websocket,
                    ...websocket,
                  },
                  port: options,
                  fetch: app.fetch,
                };
        if (((app.server = Bun.serve(serve)), app.event.start))
          for (let i = 0; i < app.event.start.length; i++) app.event.start[i].fn(app);
        (callback && callback(app.server),
          process.on('beforeExit', async () => {
            if (app.server && (await app.server.stop?.(), (app.server = null), app.event.stop))
              for (let i = 0; i < app.event.stop.length; i++) app.event.stop[i].fn(app);
          }),
          app.promisedModules.then(async () => {
            (app.config.aot, app.compile());
            const routes2 = removeTrailingPath(
              mergeRoutes(
                mergeRoutes(
                  await createStaticRoute(app.router.response, { withAsync: !0 }),
                  mapRoutes(app),
                ),
                app.config.serve?.routes,
              ),
            );
            (app.server?.reload({
              ...serve,
              fetch: app.fetch,
              routes: routes2,
            }),
              Bun?.gc(!1));
          }));
      };
    },
    async stop(app, closeActiveConnections) {
      if (app.server) {
        if (
          (await app.server.stop(closeActiveConnections),
          (app.server = null),
          app.event.stop?.length)
        )
          for (let i = 0; i < app.event.stop.length; i++) app.event.stop[i].fn(app);
      } else
        console.log(
          "Elysia isn't running. Call `app.listen` to start the server.",
          /* @__PURE__ */ new Error().stack,
        );
    },
    ws(app, path, options) {
      const { parse, body, response, ...rest } = options,
        messageValidator = getSchemaValidator(body, {
          modules: app.definitions.typebox,
          models: app.definitions.type,
          normalize: app.config.normalize,
        }),
        validateMessage = messageValidator
          ? messageValidator.provider === 'standard'
            ? (data) => messageValidator.schema['~standard'].validate(data).issues
            : (data) => messageValidator.Check(data) === !1
          : void 0,
        responseValidator = getSchemaValidator(response, {
          modules: app.definitions.typebox,
          models: app.definitions.type,
          normalize: app.config.normalize,
        });
      app.route(
        'WS',
        path,
        async (context) => {
          const server = context.server ?? app.server,
            { set, path: path2, qi, headers, query, params } = context;
          if (((context.validator = responseValidator), options.upgrade))
            if (typeof options.upgrade == 'function') {
              const temp = options.upgrade(context);
              temp instanceof Promise && (await temp);
            } else options.upgrade && Object.assign(set.headers, options.upgrade);
          if (set.cookie && isNotEmpty(set.cookie)) {
            const cookie = serializeCookie(set.cookie);
            cookie && (set.headers['set-cookie'] = cookie);
          }
          set.headers['set-cookie'] &&
            Array.isArray(set.headers['set-cookie']) &&
            (set.headers = parseSetCookies(new Headers(set.headers), set.headers['set-cookie']));
          const handleResponse = createHandleWSResponse(responseValidator),
            parseMessage = createWSMessageParser(parse);
          let _id;
          if (typeof options.beforeHandle == 'function') {
            const result = options.beforeHandle(context);
            result instanceof Promise && (await result);
          }
          const errorHandlers = [
              ...(options.error
                ? Array.isArray(options.error)
                  ? options.error
                  : [options.error]
                : []),
              ...(app.event.error ?? []).map((x) => (typeof x == 'function' ? x : x.fn)),
            ].filter((x) => x),
            hasCustomErrorHandlers = errorHandlers.length > 0,
            handleErrors = hasCustomErrorHandlers
              ? async (ws, error) => {
                  for (const handleError of errorHandlers) {
                    let response2 = handleError(Object.assign(context, { error }));
                    if (
                      (response2 instanceof Promise && (response2 = await response2),
                      await handleResponse(ws, response2),
                      response2)
                    )
                      break;
                  }
                }
              : () => {};
          if (
            !server?.upgrade(context.request, {
              headers: isNotEmpty(set.headers) ? set.headers : void 0,
              data: {
                ...context,
                get id() {
                  return _id || (_id = randomId());
                },
                validator: responseValidator,
                ping(ws, data) {
                  options.ping?.(ws, data);
                },
                pong(ws, data) {
                  options.pong?.(ws, data);
                },
                open: async (ws) => {
                  try {
                    await handleResponse(ws, options.open?.(new ElysiaWS(ws, context)));
                  } catch (error) {
                    handleErrors(ws, error);
                  }
                },
                message: async (ws, _message) => {
                  const message = await parseMessage(ws, _message);
                  if (validateMessage && validateMessage(message)) {
                    const validationError = new ValidationError(
                      'message',
                      messageValidator,
                      message,
                    );
                    return hasCustomErrorHandlers
                      ? handleErrors(ws, validationError)
                      : void ws.send(validationError.message);
                  }
                  try {
                    await handleResponse(
                      ws,
                      options.message?.(new ElysiaWS(ws, context, message), message),
                    );
                  } catch (error) {
                    handleErrors(ws, error);
                  }
                },
                drain: async (ws) => {
                  try {
                    await handleResponse(ws, options.drain?.(new ElysiaWS(ws, context)));
                  } catch (error) {
                    handleErrors(ws, error);
                  }
                },
                close: async (ws, code, reason) => {
                  try {
                    await handleResponse(
                      ws,
                      options.close?.(new ElysiaWS(ws, context), code, reason),
                    );
                  } catch (error) {
                    handleErrors(ws, error);
                  }
                },
              },
            })
          )
            return status(400, 'Expected a websocket connection');
        },
        {
          ...rest,
          websocket: options,
        },
      );
    },
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/universal/env.mjs
var env = isBun ? Bun.env : typeof process < 'u' && process?.env ? process.env : {};
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/dynamic-handle.mjs
var ARRAY_INDEX_REGEX = /^(.+)\[(\d+)\]$/,
  DANGEROUS_KEYS = /* @__PURE__ */ new Set(['__proto__', 'constructor', 'prototype']),
  isDangerousKey = (key) => {
    if (DANGEROUS_KEYS.has(key)) return !0;
    const match = key.match(ARRAY_INDEX_REGEX);
    return match ? DANGEROUS_KEYS.has(match[1]) : !1;
  },
  parseArrayKey = (key) => {
    const match = key.match(ARRAY_INDEX_REGEX);
    return match
      ? {
          name: match[1],
          index: parseInt(match[2], 10),
        }
      : null;
  },
  parseObjectString = (entry) => {
    if (!(typeof entry != 'string' || entry.charCodeAt(0) !== 123))
      try {
        const parsed = JSON.parse(entry);
        if (parsed && typeof parsed == 'object' && !Array.isArray(parsed)) return parsed;
      } catch {
        return;
      }
  },
  setNestedValue = (obj, path, value) => {
    const keys = path.split('.'),
      lastKey = keys.pop();
    if (isDangerousKey(lastKey) || keys.some(isDangerousKey)) return;
    let current = obj;
    for (const key of keys) {
      const arrayInfo2 = parseArrayKey(key);
      if (arrayInfo2) {
        Array.isArray(current[arrayInfo2.name]) || (current[arrayInfo2.name] = []);
        const existing = current[arrayInfo2.name][arrayInfo2.index],
          isFile = typeof File < 'u' && existing instanceof File;
        ((!existing || typeof existing != 'object' || Array.isArray(existing) || isFile) &&
          (current[arrayInfo2.name][arrayInfo2.index] = parseObjectString(existing) ?? {}),
          (current = current[arrayInfo2.name][arrayInfo2.index]));
      } else
        ((!current[key] || typeof current[key] != 'object') && (current[key] = {}),
          (current = current[key]));
    }
    const arrayInfo = parseArrayKey(lastKey);
    arrayInfo
      ? (Array.isArray(current[arrayInfo.name]) || (current[arrayInfo.name] = []),
        (current[arrayInfo.name][arrayInfo.index] = value))
      : (current[lastKey] = value);
  },
  normalizeFormValue = (value) => {
    if (value.length === 1) {
      const stringValue2 = value[0];
      if (
        typeof stringValue2 == 'string' &&
        (stringValue2.charCodeAt(0) === 123 || stringValue2.charCodeAt(0) === 91)
      )
        try {
          const parsed2 = JSON.parse(stringValue2);
          if (parsed2 && typeof parsed2 == 'object') return parsed2;
        } catch {}
      return value[0];
    }
    const stringValue = value.find((entry) => typeof entry == 'string');
    if (!stringValue || typeof File > 'u') return value;
    const files = value.filter((entry) => entry instanceof File);
    if (!files.length || stringValue.charCodeAt(0) !== 123) return value;
    let parsed;
    try {
      parsed = JSON.parse(stringValue);
    } catch {
      return value;
    }
    return typeof parsed != 'object' || parsed === null
      ? value
      : (!('file' in parsed) && files.length === 1
          ? (parsed.file = files[0])
          : !('files' in parsed) && files.length > 1 && (parsed.files = files),
        parsed);
  },
  injectDefaultValues = (typeChecker, obj) => {
    let schema = typeChecker.schema;
    if (!schema) return;
    schema.$defs?.[schema.$ref] && (schema = schema.$defs[schema.$ref]);
    const properties = getSchemaProperties(schema);
    if (properties)
      for (const [key, keySchema] of Object.entries(properties)) obj[key] ??= keySchema.default;
  },
  createDynamicHandler = (app) => {
    const { mapResponse, mapEarlyResponse } = app['~adapter'].handler,
      defaultHeader = app.setHeaders;
    return async (request) => {
      const url = request.url,
        s = url.indexOf('/', 11),
        qi = url.indexOf('?', s + 1),
        path = qi === -1 ? url.substring(s) : url.substring(s, qi),
        set = {
          cookie: {},
          status: 200,
          headers: defaultHeader ? { ...defaultHeader } : {},
        },
        context = Object.assign({}, app.singleton.decorator, {
          set,
          store: app.singleton.store,
          request,
          path,
          qi,
          error: status,
          status,
          redirect,
        });
      let hooks;
      try {
        if (app.event.request)
          for (let i = 0; i < app.event.request.length; i++) {
            const onRequest = app.event.request[i].fn;
            let response2 = onRequest(context);
            if (
              (response2 instanceof Promise && (response2 = await response2),
              (response2 = mapEarlyResponse(response2, set)),
              response2)
            )
              return (context.response = response2);
          }
        const methodKey =
            request.method === 'GET' &&
            request.headers.get('upgrade')?.toLowerCase() === 'websocket'
              ? 'WS'
              : request.method,
          handler =
            app.router.dynamic.find(request.method, path) ??
            app.router.dynamic.find(methodKey, path) ??
            app.router.dynamic.find('ALL', path);
        if (!handler)
          throw (
            (context.query = qi === -1 ? {} : parseQuery(url.substring(qi + 1))),
            new NotFoundError()
          );
        const { handle, validator, content, route } = handler.store;
        if (((hooks = handler.store.hooks), hooks.config?.mount))
          return await hooks.config.mount(request);
        let body;
        if (request.method !== 'GET' && request.method !== 'HEAD')
          if (content)
            switch (content) {
              case 'application/json':
                body = await request.json();
                break;
              case 'text/plain':
                body = await request.text();
                break;
              case 'application/x-www-form-urlencoded':
                body = parseQuery(await request.text());
                break;
              case 'application/octet-stream':
                body = await request.arrayBuffer();
                break;
              case 'multipart/form-data': {
                body = {};
                const form = await request.formData();
                for (const key of form.keys()) {
                  if (body[key]) continue;
                  const finalValue = normalizeFormValue(form.getAll(key));
                  key.includes('.') || key.includes('[')
                    ? setNestedValue(body, key, finalValue)
                    : (body[key] = finalValue);
                }
                break;
              }
            }
          else {
            let contentType;
            if (
              (request.body && (contentType = request.headers.get('content-type')), contentType)
            ) {
              const index = contentType.indexOf(';');
              if (
                (index !== -1 && (contentType = contentType.slice(0, index)),
                (context.contentType = contentType),
                hooks.parse)
              )
                for (let i = 0; i < hooks.parse.length; i++) {
                  const hook = hooks.parse[i].fn;
                  if (typeof hook == 'string')
                    switch (hook) {
                      case 'json':
                      case 'application/json':
                        body = await request.json();
                        break;
                      case 'text':
                      case 'text/plain':
                        body = await request.text();
                        break;
                      case 'urlencoded':
                      case 'application/x-www-form-urlencoded':
                        body = parseQuery(await request.text());
                        break;
                      case 'arrayBuffer':
                      case 'application/octet-stream':
                        body = await request.arrayBuffer();
                        break;
                      case 'formdata':
                      case 'multipart/form-data': {
                        body = {};
                        const form = await request.formData();
                        for (const key of form.keys()) {
                          if (body[key]) continue;
                          const finalValue = normalizeFormValue(form.getAll(key));
                          key.includes('.') || key.includes('[')
                            ? setNestedValue(body, key, finalValue)
                            : (body[key] = finalValue);
                        }
                        break;
                      }
                      default: {
                        const parser = app['~parser'][hook];
                        if (parser) {
                          let temp = parser(context, contentType);
                          if ((temp instanceof Promise && (temp = await temp), temp)) {
                            body = temp;
                            break;
                          }
                        }
                        break;
                      }
                    }
                  else {
                    let temp = hook(context, contentType);
                    if ((temp instanceof Promise && (temp = await temp), temp)) {
                      body = temp;
                      break;
                    }
                  }
                }
              if ((delete context.contentType, body === void 0))
                switch (contentType) {
                  case 'application/json':
                    body = await request.json();
                    break;
                  case 'text/plain':
                    body = await request.text();
                    break;
                  case 'application/x-www-form-urlencoded':
                    body = parseQuery(await request.text());
                    break;
                  case 'application/octet-stream':
                    body = await request.arrayBuffer();
                    break;
                  case 'multipart/form-data': {
                    body = {};
                    const form = await request.formData();
                    for (const key of form.keys()) {
                      if (body[key]) continue;
                      const finalValue = normalizeFormValue(form.getAll(key));
                      key.includes('.') || key.includes('[')
                        ? setNestedValue(body, key, finalValue)
                        : (body[key] = finalValue);
                    }
                    break;
                  }
                }
            }
          }
        ((context.route = route),
          (context.body = body),
          (context.params = handler?.params || void 0),
          (context.query = qi === -1 ? {} : parseQuery(url.substring(qi + 1))),
          (context.headers = {}));
        for (const [key, value] of request.headers.entries()) context.headers[key] = value;
        const cookieMeta = {
            domain: app.config.cookie?.domain ?? validator?.cookie?.config.domain,
            expires: app.config.cookie?.expires ?? validator?.cookie?.config.expires,
            httpOnly: app.config.cookie?.httpOnly ?? validator?.cookie?.config.httpOnly,
            maxAge: app.config.cookie?.maxAge ?? validator?.cookie?.config.maxAge,
            path: app.config.cookie?.path ?? validator?.cookie?.config.path,
            priority: app.config.cookie?.priority ?? validator?.cookie?.config.priority,
            partitioned: app.config.cookie?.partitioned ?? validator?.cookie?.config.partitioned,
            sameSite: app.config.cookie?.sameSite ?? validator?.cookie?.config.sameSite,
            secure: app.config.cookie?.secure ?? validator?.cookie?.config.secure,
            secrets: app.config.cookie?.secrets ?? validator?.cookie?.config.secrets,
            sign: app.config.cookie?.sign ?? validator?.cookie?.config.sign,
          },
          cookieHeaderValue = request.headers.get('cookie');
        context.cookie = await parseCookie(context.set, cookieHeaderValue, cookieMeta);
        const headerValidator = validator?.createHeaders?.();
        headerValidator && injectDefaultValues(headerValidator, context.headers);
        const paramsValidator = validator?.createParams?.();
        paramsValidator && injectDefaultValues(paramsValidator, context.params);
        const queryValidator = validator?.createQuery?.();
        if ((queryValidator && injectDefaultValues(queryValidator, context.query), hooks.transform))
          for (let i = 0; i < hooks.transform.length; i++) {
            const hook = hooks.transform[i];
            let response2 = hook.fn(context);
            if (
              (response2 instanceof Promise && (response2 = await response2),
              response2 instanceof ElysiaCustomStatusResponse)
            ) {
              const result = mapEarlyResponse(response2, context.set);
              if (result) return (context.response = result);
            }
            hook.subType === 'derive' && Object.assign(context, response2);
          }
        if (validator) {
          if (headerValidator) {
            const _header = structuredClone(context.headers);
            for (const [key, value] of request.headers) _header[key] = value;
            if (validator.headers.Check(_header) === !1)
              throw new ValidationError('header', validator.headers, _header);
          } else
            validator.headers?.Decode &&
              (context.headers = validator.headers.Decode(context.headers));
          if (paramsValidator?.Check(context.params) === !1)
            throw new ValidationError('params', validator.params, context.params);
          if (
            (validator.params?.Decode && (context.params = validator.params.Decode(context.params)),
            validator.query?.schema)
          ) {
            let schema = validator.query.schema;
            schema.$defs?.[schema.$ref] && (schema = schema.$defs[schema.$ref]);
            const properties = getSchemaProperties(schema);
            if (properties)
              for (const property of Object.keys(properties)) {
                const value = properties[property];
                (value.type === 'array' || value.items?.type === 'string') &&
                  typeof context.query[property] == 'string' &&
                  context.query[property] &&
                  (context.query[property] = context.query[property].split(','));
              }
          }
          if (queryValidator?.Check(context.query) === !1)
            throw new ValidationError('query', validator.query, context.query);
          if (
            (validator.query?.Decode && (context.query = validator.query.Decode(context.query)),
            validator.createCookie?.())
          ) {
            let cookieValue = {};
            for (const [key, value] of Object.entries(context.cookie))
              cookieValue[key] = value.value;
            if (validator.cookie.Check(cookieValue) === !1)
              throw new ValidationError('cookie', validator.cookie, cookieValue);
            validator.cookie?.Decode && (cookieValue = validator.cookie.Decode(cookieValue));
          }
          if (validator.createBody?.()?.Check(body) === !1)
            throw new ValidationError('body', validator.body, body);
          if (validator.body?.Decode) {
            let decoded = validator.body.Decode(body);
            (decoded instanceof Promise && (decoded = await decoded),
              (context.body = decoded?.value ?? decoded));
          }
        }
        if (hooks.beforeHandle)
          for (let i = 0; i < hooks.beforeHandle.length; i++) {
            const hook = hooks.beforeHandle[i];
            let response2 = hook.fn(context);
            if (
              (response2 instanceof Promise && (response2 = await response2),
              response2 instanceof ElysiaCustomStatusResponse)
            ) {
              const result = mapEarlyResponse(response2, context.set);
              if (result) return (context.response = result);
            }
            if (hook.subType === 'resolve') {
              Object.assign(context, response2);
              continue;
            }
            if (response2 !== void 0) {
              if (((context.response = response2), hooks.afterHandle))
                for (let i2 = 0; i2 < hooks.afterHandle.length; i2++) {
                  let newResponse = hooks.afterHandle[i2].fn(context);
                  (newResponse instanceof Promise && (newResponse = await newResponse),
                    newResponse && (response2 = newResponse));
                }
              const result = mapEarlyResponse(response2, context.set);
              if (result) return (context.response = result);
            }
          }
        let response = typeof handle == 'function' ? handle(context) : handle;
        if (
          (response instanceof Promise && (response = await response), hooks.afterHandle?.length)
        ) {
          context.response = response;
          for (let i = 0; i < hooks.afterHandle.length; i++) {
            let response2 = hooks.afterHandle[i].fn(context);
            response2 instanceof Promise && (response2 = await response2);
            const isCustomStatuResponse = response2 instanceof ElysiaCustomStatusResponse,
              status2 = isCustomStatuResponse
                ? response2.code
                : set.status
                  ? typeof set.status == 'string'
                    ? StatusMap[set.status]
                    : set.status
                  : 200;
            isCustomStatuResponse && ((set.status = status2), (response2 = response2.response));
            const responseValidator = validator?.createResponse?.()?.[status2];
            if (responseValidator?.Check(response2) === !1)
              if (responseValidator?.Clean)
                try {
                  const temp = responseValidator.Clean(response2);
                  if (responseValidator?.Check(temp) === !1)
                    throw new ValidationError('response', responseValidator, response2);
                  response2 = temp;
                } catch (error) {
                  throw error instanceof ValidationError
                    ? error
                    : new ValidationError('response', responseValidator, response2);
                }
              else throw new ValidationError('response', responseValidator, response2);
            if (
              (responseValidator?.Encode &&
                (context.response = response2 = responseValidator.Encode(response2)),
              responseValidator?.Clean)
            )
              try {
                context.response = response2 = responseValidator.Clean(response2);
              } catch {}
            const result = mapEarlyResponse(response2, context.set);
            if (result !== void 0) return (context.response = result);
          }
        } else {
          const isCustomStatuResponse = response instanceof ElysiaCustomStatusResponse,
            status2 = isCustomStatuResponse
              ? response.code
              : set.status
                ? typeof set.status == 'string'
                  ? StatusMap[set.status]
                  : set.status
                : 200;
          isCustomStatuResponse && ((set.status = status2), (response = response.response));
          const responseValidator = validator?.createResponse?.()?.[status2];
          if (responseValidator?.Check(response) === !1)
            if (responseValidator?.Clean)
              try {
                const temp = responseValidator.Clean(response);
                if (responseValidator?.Check(temp) === !1)
                  throw new ValidationError('response', responseValidator, response);
                response = temp;
              } catch (error) {
                throw error instanceof ValidationError
                  ? error
                  : new ValidationError('response', responseValidator, response);
              }
            else throw new ValidationError('response', responseValidator, response);
          if (
            (responseValidator?.Encode && (response = responseValidator.Encode(response)),
            responseValidator?.Clean)
          )
            try {
              response = responseValidator.Clean(response);
            } catch {}
        }
        if (context.set.cookie && cookieMeta?.sign) {
          const secret = cookieMeta.secrets
            ? typeof cookieMeta.secrets == 'string'
              ? cookieMeta.secrets
              : cookieMeta.secrets[0]
            : void 0;
          if (cookieMeta.sign === !0) {
            if (secret)
              for (const [key, cookie] of Object.entries(context.set.cookie))
                context.set.cookie[key].value = await signCookie(cookie.value, secret);
          } else {
            const properties = getSchemaProperties(validator?.cookie?.schema);
            if (secret)
              for (const name of cookieMeta.sign)
                !properties ||
                  !(name in properties) ||
                  (context.set.cookie[name]?.value &&
                    (context.set.cookie[name].value = await signCookie(
                      context.set.cookie[name].value,
                      secret,
                    )));
          }
        }
        return mapResponse((context.response = response), context.set);
      } catch (error) {
        const reportedError =
          error instanceof TransformDecodeError && error.error ? error.error : error;
        return app.handleError(context, reportedError);
      } finally {
        const afterResponses = hooks ? hooks.afterResponse : app.event.afterResponse;
        afterResponses &&
          (hasSetImmediate
            ? setImmediate(async () => {
                for (const afterResponse of afterResponses) await afterResponse.fn(context);
              })
            : Promise.resolve().then(async () => {
                for (const afterResponse of afterResponses) await afterResponse.fn(context);
              }));
      }
    };
  },
  createDynamicErrorHandler = (app) => {
    const { mapResponse } = app['~adapter'].handler;
    return async (context, error) => {
      const errorContext = Object.assign(context, {
        error,
        code: error.code,
      });
      if (
        ((errorContext.set = context.set),
        typeof error?.toResponse == 'function' &&
          !(error instanceof ValidationError) &&
          !(error instanceof TransformDecodeError))
      )
        try {
          let raw = error.toResponse();
          (typeof raw?.then == 'function' && (raw = await raw),
            raw instanceof Response && (context.set.status = raw.status),
            (context.response = raw));
        } catch {}
      if (!context.response && app.event.error)
        for (let i = 0; i < app.event.error.length; i++) {
          let response = app.event.error[i].fn(errorContext);
          if ((response instanceof Promise && (response = await response), response != null))
            return (context.response = mapResponse(response, context.set));
        }
      if (context.response) {
        if (app.event.mapResponse)
          for (let i = 0; i < app.event.mapResponse.length; i++) {
            let response = app.event.mapResponse[i].fn(errorContext);
            (response instanceof Promise && (response = await response),
              response != null && (context.response = response));
          }
        return mapResponse(context.response, context.set);
      }
      return (
        (context.set.status = error.status ?? 500),
        mapResponse(typeof error.cause == 'string' ? error.cause : error.message, context.set)
      );
    };
  };
//#endregion
//#region ../../node_modules/.pnpm/elysia@1.4.28_@sinclair+typ_d7e6c39c88cee01b0637e63507aa1e79/node_modules/elysia/dist/index.mjs
var _a = Symbol.dispose;
var Elysia = class _Elysia {
  constructor(config = {}) {
    this.server = null;
    this.dependencies = {};
    this['~Prefix'] = '';
    this['~Singleton'] = null;
    this['~Definitions'] = null;
    this['~Metadata'] = null;
    this['~Ephemeral'] = null;
    this['~Volatile'] = null;
    this['~Routes'] = null;
    this.singleton = {
      decorator: {},
      store: {},
      derive: {},
      resolve: {},
    };
    this.definitions = {
      typebox: t.Module({}),
      type: {},
      error: {},
    };
    this.extender = {
      macro: {},
      higherOrderFunctions: [],
    };
    this.validator = {
      global: null,
      scoped: null,
      local: null,
      getCandidate() {
        return !this.global && !this.scoped && !this.local
          ? {
              body: void 0,
              headers: void 0,
              params: void 0,
              query: void 0,
              cookie: void 0,
              response: void 0,
            }
          : mergeSchemaValidator(mergeSchemaValidator(this.global, this.scoped), this.local);
      },
    };
    this.standaloneValidator = {
      global: null,
      scoped: null,
      local: null,
    };
    this.event = {};
    this.router = {
      '~http': void 0,
      get http() {
        return (
          this['~http'] ||
            (this['~http'] = new Memoirist({
              lazy: !0,
              onParam: import_fast_decode_uri_component.default,
            })),
          this['~http']
        );
      },
      '~dynamic': void 0,
      get dynamic() {
        return (
          this['~dynamic'] ||
            (this['~dynamic'] = new Memoirist({
              onParam: import_fast_decode_uri_component.default,
            })),
          this['~dynamic']
        );
      },
      static: {},
      response: {},
      history: [],
    };
    this.routeTree = {};
    this.inference = {
      body: !1,
      cookie: !1,
      headers: !1,
      query: !1,
      set: !1,
      server: !1,
      path: !1,
      route: !1,
      url: !1,
    };
    this['~parser'] = {};
    this.handle = async (request) => this.fetch(request);
    this.handleError = async (context, error) =>
      (this.handleError = this.config.aot
        ? composeErrorHandler(this)
        : createDynamicErrorHandler(this))(context, error);
    /**
     * ### listen
     * Assign current instance to port and start serving
     *
     * ---
     * @example
     * ```typescript
     * new Elysia()
     *     .get("/", () => 'hi')
     *     .listen(3000)
     * ```
     */
    this.listen = (options, callback) => (this['~adapter'].listen(this)(options, callback), this);
    /**
     * ### stop
     * Stop server from serving
     *
     * ---
     * @example
     * ```typescript
     * const app = new Elysia()
     *     .get("/", () => 'hi')
     *     .listen(3000)
     *
     * // Sometime later
     * app.stop()
     * ```
     *
     * @example
     * ```typescript
     * const app = new Elysia()
     *     .get("/", () => 'hi')
     *     .listen(3000)
     *
     * app.stop(true) // Abruptly any requests inflight
     * ```
     */
    this.stop = async (closeActiveConnections) => (
      await this['~adapter'].stop?.(this, closeActiveConnections), this
    );
    this[_a] = () => {
      this.server && this.stop();
    };
    (config.tags &&
      (config.detail
        ? (config.detail.tags = config.tags)
        : (config.detail = { tags: config.tags })),
      (this.config = {
        aot: env.ELYSIA_AOT !== 'false',
        nativeStaticResponse: !0,
        encodeSchema: !0,
        normalize: !0,
        ...config,
        prefix: config.prefix
          ? config.prefix.charCodeAt(0) === 47
            ? config.prefix
            : `/${config.prefix}`
          : void 0,
        cookie: {
          path: '/',
          ...config?.cookie,
        },
        experimental: config?.experimental ?? {},
        seed: config?.seed === void 0 ? '' : config?.seed,
      }),
      (this['~adapter'] = config.adapter ?? (typeof Bun < 'u' ? BunAdapter : WebStandardAdapter)),
      config?.analytic &&
        (config?.name || config?.seed !== void 0) &&
        (this.telemetry = { stack: /* @__PURE__ */ new Error().stack }));
  }
  get store() {
    return this.singleton.store;
  }
  get decorator() {
    return this.singleton.decorator;
  }
  get routes() {
    return this.router.history;
  }
  getGlobalRoutes() {
    return this.router.history;
  }
  getGlobalDefinitions() {
    return this.definitions;
  }
  getServer() {
    return this.server;
  }
  getParent() {
    return null;
  }
  get promisedModules() {
    return (
      this._promisedModules || (this._promisedModules = new PromiseGroup(console.error, () => {})),
      this._promisedModules
    );
  }
  env(model, _env = env) {
    if (
      getSchemaValidator(model, {
        modules: this.definitions.typebox,
        dynamic: !0,
        additionalProperties: !0,
        coerce: !0,
        sanitize: () => this.config.sanitize,
      }).Check(_env) === !1
    ) {
      const error = new ValidationError('env', model, _env);
      throw new Error(
        error.all.map((x) => x.summary).join(`
`),
      );
    }
    return this;
  }
  /**
   * @private DO_NOT_USE_OR_YOU_WILL_BE_FIRED
   * @version 1.1.0
   *
   * ! Do not use unless you know exactly what you are doing
   * ? Add Higher order function to Elysia.fetch
   */
  wrap(fn) {
    return (
      this.extender.higherOrderFunctions.push({
        checksum: checksum(
          JSON.stringify({
            name: this.config.name,
            seed: this.config.seed,
            content: fn.toString(),
          }),
        ),
        fn,
      }),
      this
    );
  }
  get models() {
    const models = {};
    for (const name of Object.keys(this.definitions.type))
      models[name] = getSchemaValidator(this.definitions.typebox.Import(name), {
        models: this.definitions.type,
      });
    return ((models.modules = this.definitions.typebox), models);
  }
  add(method, path, handle, localHook, options) {
    const skipPrefix = options?.skipPrefix ?? !1,
      allowMeta = options?.allowMeta ?? !1;
    ((localHook ??= {}), this.applyMacro(localHook));
    let standaloneValidators = [];
    if (
      (localHook.standaloneValidator &&
        (standaloneValidators = standaloneValidators.concat(localHook.standaloneValidator)),
      this.standaloneValidator.local &&
        (standaloneValidators = standaloneValidators.concat(this.standaloneValidator.local)),
      this.standaloneValidator.scoped &&
        (standaloneValidators = standaloneValidators.concat(this.standaloneValidator.scoped)),
      this.standaloneValidator.global &&
        (standaloneValidators = standaloneValidators.concat(this.standaloneValidator.global)),
      path !== '' && path.charCodeAt(0) !== 47 && (path = '/' + path),
      this.config.prefix && !skipPrefix && (path = this.config.prefix + path),
      localHook?.type)
    )
      switch (localHook.type) {
        case 'text':
          localHook.type = 'text/plain';
          break;
        case 'json':
          localHook.type = 'application/json';
          break;
        case 'formdata':
          localHook.type = 'multipart/form-data';
          break;
        case 'urlencoded':
          localHook.type = 'application/x-www-form-urlencoded';
          break;
        case 'arrayBuffer':
          localHook.type = 'application/octet-stream';
          break;
        default:
          break;
      }
    const instanceValidator = this.validator.getCandidate(),
      cloned = {
        body: localHook?.body ?? instanceValidator?.body,
        headers: localHook?.headers ?? instanceValidator?.headers,
        params: localHook?.params ?? instanceValidator?.params,
        query: localHook?.query ?? instanceValidator?.query,
        cookie: localHook?.cookie ?? instanceValidator?.cookie,
        response: localHook?.response ?? instanceValidator?.response,
      },
      shouldPrecompile =
        this.config.precompile === !0 ||
        (typeof this.config.precompile == 'object' && this.config.precompile.compose === !0),
      createValidator = () => {
        const models = this.definitions.type,
          dynamic = !this.config.aot,
          normalize = this.config.normalize,
          modules = this.definitions.typebox,
          sanitize = () => this.config.sanitize,
          cookieValidator = () => {
            if (cloned.cookie || standaloneValidators.find((x) => x.cookie))
              return getCookieValidator({
                modules,
                validator: cloned.cookie,
                defaultConfig: this.config.cookie,
                normalize,
                config: cloned.cookie?.config ?? {},
                dynamic,
                models,
                validators: standaloneValidators.map((x) => x.cookie),
                sanitize,
              });
          };
        return shouldPrecompile
          ? {
              body: getSchemaValidator(cloned.body, {
                modules,
                dynamic,
                models,
                normalize,
                additionalCoerce: (() => {
                  const resolved = resolveSchema(cloned.body, models, modules);
                  return resolved &&
                    Kind$1 in resolved &&
                    (hasType('File', resolved) || hasType('Files', resolved))
                    ? coerceFormData()
                    : coercePrimitiveRoot();
                })(),
                validators: standaloneValidators.map((x) => x.body),
                sanitize,
              }),
              headers: getSchemaValidator(cloned.headers, {
                modules,
                dynamic,
                models,
                additionalProperties: !0,
                coerce: !0,
                additionalCoerce: stringToStructureCoercions(),
                validators: standaloneValidators.map((x) => x.headers),
                sanitize,
              }),
              params: getSchemaValidator(cloned.params, {
                modules,
                dynamic,
                models,
                coerce: !0,
                additionalCoerce: stringToStructureCoercions(),
                validators: standaloneValidators.map((x) => x.params),
                sanitize,
              }),
              query: getSchemaValidator(cloned.query, {
                modules,
                dynamic,
                models,
                normalize,
                coerce: !0,
                additionalCoerce: queryCoercions(),
                validators: standaloneValidators.map((x) => x.query),
                sanitize,
              }),
              cookie: cookieValidator(),
              response: getResponseSchemaValidator(cloned.response, {
                modules,
                dynamic,
                models,
                normalize,
                validators: standaloneValidators.map((x) => x.response),
                sanitize,
              }),
            }
          : {
              createBody() {
                return this.body
                  ? this.body
                  : (this.body = getSchemaValidator(cloned.body, {
                      modules,
                      dynamic,
                      models,
                      normalize,
                      additionalCoerce: (() => {
                        const resolved = resolveSchema(cloned.body, models, modules);
                        return resolved &&
                          Kind$1 in resolved &&
                          (hasType('File', resolved) || hasType('Files', resolved))
                          ? coerceFormData()
                          : coercePrimitiveRoot();
                      })(),
                      validators: standaloneValidators.map((x) => x.body),
                      sanitize,
                    }));
              },
              createHeaders() {
                return this.headers
                  ? this.headers
                  : (this.headers = getSchemaValidator(cloned.headers, {
                      modules,
                      dynamic,
                      models,
                      normalize,
                      additionalProperties: !normalize,
                      coerce: !0,
                      additionalCoerce: stringToStructureCoercions(),
                      validators: standaloneValidators.map((x) => x.headers),
                      sanitize,
                    }));
              },
              createParams() {
                return this.params
                  ? this.params
                  : (this.params = getSchemaValidator(cloned.params, {
                      modules,
                      dynamic,
                      models,
                      normalize,
                      coerce: !0,
                      additionalCoerce: stringToStructureCoercions(),
                      validators: standaloneValidators.map((x) => x.params),
                      sanitize,
                    }));
              },
              createQuery() {
                return this.query
                  ? this.query
                  : (this.query = getSchemaValidator(cloned.query, {
                      modules,
                      dynamic,
                      models,
                      normalize,
                      coerce: !0,
                      additionalCoerce: queryCoercions(),
                      validators: standaloneValidators.map((x) => x.query),
                      sanitize,
                    }));
              },
              createCookie() {
                return this.cookie ? this.cookie : (this.cookie = cookieValidator());
              },
              createResponse() {
                return this.response
                  ? this.response
                  : (this.response = getResponseSchemaValidator(cloned.response, {
                      modules,
                      dynamic,
                      models,
                      normalize,
                      validators: standaloneValidators.map((x) => x.response),
                      sanitize,
                    }));
              },
            };
      };
    ((instanceValidator.body ||
      instanceValidator.cookie ||
      instanceValidator.headers ||
      instanceValidator.params ||
      instanceValidator.query ||
      instanceValidator.response) &&
      (localHook = mergeHook(localHook, instanceValidator)),
      localHook.tags &&
        (localHook.detail
          ? (localHook.detail.tags = localHook.tags)
          : (localHook.detail = { tags: localHook.tags })),
      isNotEmpty(this.config.detail) &&
        (localHook.detail = mergeDeep(Object.assign({}, this.config.detail), localHook.detail)));
    const hooks = isNotEmpty(this.event)
      ? mergeHook(this.event, localHookToLifeCycleStore(localHook))
      : { ...lifeCycleToArray(localHookToLifeCycleStore(localHook)) };
    if (
      (standaloneValidators.length &&
        Object.assign(hooks, { standaloneValidator: standaloneValidators }),
      this.config.aot === !1)
    ) {
      const validator = createValidator();
      this.router.dynamic.add(method, path, {
        validator,
        hooks,
        content: localHook?.type,
        handle,
        route: path,
      });
      const encoded = encodePath(path, { dynamic: !0 });
      if (
        (path !== encoded &&
          this.router.dynamic.add(method, encoded, {
            validator,
            hooks,
            content: localHook?.type,
            handle,
            route: path,
          }),
        !this.config.strictPath)
      ) {
        const loosePath = getLoosePath(path);
        this.router.dynamic.add(method, loosePath, {
          validator,
          hooks,
          content: localHook?.type,
          handle,
          route: path,
        });
        loosePath !== encodePath(loosePath) &&
          this.router.dynamic.add(method, loosePath, {
            validator,
            hooks,
            content: localHook?.type,
            handle,
            route: path,
          });
      }
      this.router.history.push({
        method,
        path,
        composed: null,
        handler: handle,
        compile: void 0,
        hooks,
      });
      return;
    }
    const adapter = this['~adapter'].handler,
      nativeStaticHandler =
        typeof handle != 'function'
          ? () => {
              const context = {
                redirect,
                request: this['~adapter'].isWebStandard
                  ? new Request(`http://ely.sia${path}`, { method })
                  : void 0,
                server: null,
                set: { headers: Object.assign({}, this.setHeaders) },
                status,
                store: this.store,
              };
              try {
                this.event.request?.map((x) => {
                  if (typeof x.fn == 'function') return x.fn(context);
                  if (typeof x == 'function') return x(context);
                });
              } catch (error) {
                let res;
                ((context.error = error),
                  this.event.error?.some((x) => {
                    if (typeof x.fn == 'function') return (res = x.fn(context));
                    if (typeof x == 'function') return (res = x(context));
                  }),
                  res !== void 0 && (handle = res));
              }
              const fn = adapter.createNativeStaticHandler?.(handle, hooks, context.set);
              return fn instanceof Promise
                ? fn.then((fn2) => {
                    if (fn2) return fn2;
                  })
                : fn?.();
            }
          : void 0,
      useNativeStaticResponse = this.config.nativeStaticResponse === !0,
      addResponsePath = (path2) => {
        !useNativeStaticResponse ||
          !nativeStaticHandler ||
          (supportPerMethodInlineHandler
            ? this.router.response[path2]
              ? (this.router.response[path2][method] = nativeStaticHandler())
              : (this.router.response[path2] = { [method]: nativeStaticHandler() })
            : (this.router.response[path2] = nativeStaticHandler()));
      };
    addResponsePath(path);
    let _compiled;
    const compile = () => {
      if (_compiled) return _compiled;
      const compiled = composeHandler({
        app: this,
        path,
        method,
        hooks,
        validator: createValidator(),
        handler:
          typeof handle != 'function' && typeof adapter.createStaticHandler != 'function'
            ? () => handle
            : handle,
        allowMeta,
        inference: this.inference,
      });
      return (
        this.router.history[index] && (_compiled = this.router.history[index].composed = compiled),
        compiled
      );
    };
    let oldIndex;
    if (`${method}_${path}` in this.routeTree)
      for (let i = 0; i < this.router.history.length; i++) {
        const route2 = this.router.history[i];
        if (route2.path === path && route2.method === method) {
          oldIndex = i;
          break;
        }
      }
    else this.routeTree[`${method}_${path}`] = this.router.history.length;
    const index = oldIndex ?? this.router.history.length,
      route = this.router.history,
      mainHandler = shouldPrecompile
        ? compile()
        : (ctx) => (_compiled ? _compiled(ctx) : (route[index].composed = compile())(ctx));
    oldIndex !== void 0
      ? (this.router.history[oldIndex] = Object.assign(
          {
            method,
            path,
            composed: mainHandler,
            compile,
            handler: handle,
            hooks,
          },
          standaloneValidators.length ? { standaloneValidators } : void 0,
          localHook.webSocket ? { websocket: localHook.websocket } : void 0,
        ))
      : this.router.history.push(
          Object.assign(
            {
              method,
              path,
              composed: mainHandler,
              compile,
              handler: handle,
              hooks,
            },
            localHook.webSocket ? { websocket: localHook.websocket } : void 0,
          ),
        );
    const handler = {
        handler: shouldPrecompile ? route[index].composed : void 0,
        compile() {
          return (this.handler = compile());
        },
      },
      staticRouter = this.router.static,
      isStaticPath = path.indexOf(':') === -1 && path.indexOf('*') === -1;
    if (method === 'WS') {
      if (isStaticPath) {
        path in staticRouter
          ? (staticRouter[path][method] = index)
          : (staticRouter[path] = { [method]: index });
        return;
      }
      (this.router.http.add('WS', path, handler),
        this.config.strictPath || this.router.http.add('WS', getLoosePath(path), handler));
      const encoded = encodePath(path, { dynamic: !0 });
      path !== encoded && this.router.http.add('WS', encoded, handler);
      return;
    }
    if (isStaticPath)
      (path in staticRouter
        ? (staticRouter[path][method] = index)
        : (staticRouter[path] = { [method]: index }),
        this.config.strictPath || addResponsePath(getLoosePath(path)));
    else {
      if ((this.router.http.add(method, path, handler), !this.config.strictPath)) {
        const loosePath = getLoosePath(path);
        (addResponsePath(loosePath), this.router.http.add(method, loosePath, handler));
      }
      const encoded = encodePath(path, { dynamic: !0 });
      path !== encoded &&
        (this.router.http.add(method, encoded, handler), addResponsePath(encoded));
    }
  }
  headers(header) {
    return header
      ? (this.setHeaders || (this.setHeaders = {}),
        (this.setHeaders = mergeDeep(this.setHeaders, header)),
        this)
      : this;
  }
  /**
   * ### start | Life cycle event
   * Called after server is ready for serving
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onStart(({ server }) => {
   *         console.log("Running at ${server?.url}:${server?.port}")
   *     })
   *     .listen(3000)
   * ```
   */
  onStart(handler) {
    return (this.on('start', handler), this);
  }
  onRequest(handler) {
    return (this.on('request', handler), this);
  }
  onParse(options, handler) {
    return handler
      ? this.on(options, 'parse', handler)
      : typeof options == 'string'
        ? this.on('parse', this['~parser'][options])
        : this.on('parse', options);
  }
  /**
   * ### parse | Life cycle event
   * Callback function to handle body parsing
   *
   * If truthy value is returned, will be assigned to `context.body`
   * Otherwise will skip the callback and look for the next one.
   *
   * Equivalent to Express's body parser
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onParse((request, contentType) => {
   *         if(contentType === "application/json")
   *             return request.json()
   *     })
   * ```
   */
  parser(name, parser) {
    return ((this['~parser'][name] = parser), this);
  }
  onTransform(options, handler) {
    return handler ? this.on(options, 'transform', handler) : this.on('transform', options);
  }
  resolve(optionsOrResolve, resolve) {
    resolve || ((resolve = optionsOrResolve), (optionsOrResolve = { as: 'local' }));
    const hook = {
      subType: 'resolve',
      fn: resolve,
    };
    return this.onBeforeHandle(optionsOrResolve, hook);
  }
  mapResolve(optionsOrResolve, mapper) {
    mapper || ((mapper = optionsOrResolve), (optionsOrResolve = { as: 'local' }));
    const hook = {
      subType: 'mapResolve',
      fn: mapper,
    };
    return this.onBeforeHandle(optionsOrResolve, hook);
  }
  onBeforeHandle(options, handler) {
    return handler ? this.on(options, 'beforeHandle', handler) : this.on('beforeHandle', options);
  }
  onAfterHandle(options, handler) {
    return handler ? this.on(options, 'afterHandle', handler) : this.on('afterHandle', options);
  }
  mapResponse(options, handler) {
    return handler ? this.on(options, 'mapResponse', handler) : this.on('mapResponse', options);
  }
  onAfterResponse(options, handler) {
    return handler ? this.on(options, 'afterResponse', handler) : this.on('afterResponse', options);
  }
  /**
   * ### After Handle | Life cycle event
   * Intercept request **after** main handler is called.
   *
   * If truthy value is returned, will be assigned as `Response`
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onAfterHandle((context, response) => {
   *         if(typeof response === "object")
   *             return JSON.stringify(response)
   *     })
   * ```
   */
  trace(options, handler) {
    (handler || ((handler = options), (options = { as: 'local' })),
      Array.isArray(handler) || (handler = [handler]));
    for (const fn of handler) this.on(options, 'trace', createTracer(fn));
    return this;
  }
  error(name, error) {
    switch (typeof name) {
      case 'string':
        return ((error.prototype[ERROR_CODE] = name), (this.definitions.error[name] = error), this);
      case 'function':
        return ((this.definitions.error = name(this.definitions.error)), this);
    }
    for (const [code, error2] of Object.entries(name))
      ((error2.prototype[ERROR_CODE] = code), (this.definitions.error[code] = error2));
    return this;
  }
  /**
   * ### Error | Life cycle event
   * Called when error is thrown during processing request
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onError(({ code }) => {
   *         if(code === "NOT_FOUND")
   *             return "Path not found :("
   *     })
   * ```
   */
  onError(options, handler) {
    return handler ? this.on(options, 'error', handler) : this.on('error', options);
  }
  /**
   * ### stop | Life cycle event
   * Called after server stop serving request
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onStop((app) => {
   *         cleanup()
   *     })
   * ```
   */
  onStop(handler) {
    return (this.on('stop', handler), this);
  }
  on(optionsOrType, typeOrHandlers, handlers) {
    let type;
    switch (typeof optionsOrType) {
      case 'string':
        ((type = optionsOrType), (handlers = typeOrHandlers));
        break;
      case 'object':
        ((type = typeOrHandlers),
          !Array.isArray(typeOrHandlers) &&
            typeof typeOrHandlers == 'object' &&
            (handlers = typeOrHandlers));
        break;
    }
    Array.isArray(handlers)
      ? (handlers = fnToContainer(handlers))
      : typeof handlers == 'function'
        ? (handlers = [{ fn: handlers }])
        : (handlers = [handlers]);
    const handles = handlers;
    for (const handle of handles)
      ((handle.scope = typeof optionsOrType == 'string' ? 'local' : (optionsOrType?.as ?? 'local')),
        (type === 'resolve' || type === 'derive') && (handle.subType = type));
    type !== 'trace' &&
      (this.inference = sucrose(
        { [type]: handles.map((x) => x.fn) },
        this.inference,
        this.config.sucrose,
      ));
    for (const handle of handles) {
      const fn = asHookType(handle, 'global', { skipIfHasType: !0 });
      switch (
        ((this.config.name || this.config.seed) &&
          (fn.checksum = checksum(this.config.name + JSON.stringify(this.config.seed))),
        type)
      ) {
        case 'start':
          ((this.event.start ??= []), this.event.start.push(fn));
          break;
        case 'request':
          ((this.event.request ??= []), this.event.request.push(fn));
          break;
        case 'parse':
          ((this.event.parse ??= []), this.event.parse.push(fn));
          break;
        case 'transform':
          ((this.event.transform ??= []), this.event.transform.push(fn));
          break;
        case 'derive':
          ((this.event.transform ??= []), this.event.transform.push(fnToContainer(fn, 'derive')));
          break;
        case 'beforeHandle':
          ((this.event.beforeHandle ??= []), this.event.beforeHandle.push(fn));
          break;
        case 'resolve':
          ((this.event.beforeHandle ??= []),
            this.event.beforeHandle.push(fnToContainer(fn, 'resolve')));
          break;
        case 'afterHandle':
          ((this.event.afterHandle ??= []), this.event.afterHandle.push(fn));
          break;
        case 'mapResponse':
          ((this.event.mapResponse ??= []), this.event.mapResponse.push(fn));
          break;
        case 'afterResponse':
          ((this.event.afterResponse ??= []), this.event.afterResponse.push(fn));
          break;
        case 'trace':
          ((this.event.trace ??= []), this.event.trace.push(fn));
          break;
        case 'error':
          ((this.event.error ??= []), this.event.error.push(fn));
          break;
        case 'stop':
          ((this.event.stop ??= []), this.event.stop.push(fn));
          break;
      }
    }
    return this;
  }
  as(type) {
    return (
      promoteEvent(this.event.parse, type),
      promoteEvent(this.event.transform, type),
      promoteEvent(this.event.beforeHandle, type),
      promoteEvent(this.event.afterHandle, type),
      promoteEvent(this.event.mapResponse, type),
      promoteEvent(this.event.afterResponse, type),
      promoteEvent(this.event.trace, type),
      promoteEvent(this.event.error, type),
      type === 'scoped'
        ? ((this.validator.scoped = mergeSchemaValidator(
            this.validator.scoped,
            this.validator.local,
          )),
          (this.validator.local = null),
          this.standaloneValidator.local !== null &&
            ((this.standaloneValidator.scoped ||= []),
            this.standaloneValidator.scoped.push(...this.standaloneValidator.local),
            (this.standaloneValidator.local = null)))
        : type === 'global' &&
          ((this.validator.global = mergeSchemaValidator(
            this.validator.global,
            mergeSchemaValidator(this.validator.scoped, this.validator.local),
          )),
          (this.validator.scoped = null),
          (this.validator.local = null),
          this.standaloneValidator.local !== null &&
            ((this.standaloneValidator.scoped ||= []),
            this.standaloneValidator.scoped.push(...this.standaloneValidator.local),
            (this.standaloneValidator.local = null)),
          this.standaloneValidator.scoped !== null &&
            ((this.standaloneValidator.global ||= []),
            this.standaloneValidator.global.push(...this.standaloneValidator.scoped),
            (this.standaloneValidator.scoped = null))),
      this
    );
  }
  /**
   * ### group
   * Encapsulate and group path with prefix
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .group('/v1', app => app
   *         .get('/', () => 'Hi')
   *         .get('/name', () => 'Elysia')
   *     })
   * ```
   */
  group(prefix, schemaOrRun, run) {
    const instance = new _Elysia({
      ...this.config,
      prefix: '',
    });
    ((instance.singleton = { ...this.singleton }),
      (instance.definitions = { ...this.definitions }),
      (instance.getServer = () => this.getServer()),
      (instance.inference = cloneInference(this.inference)),
      (instance.extender = { ...this.extender }),
      (instance['~parser'] = this['~parser']),
      (instance.standaloneValidator = {
        local: [...(this.standaloneValidator.local ?? [])],
        scoped: [...(this.standaloneValidator.scoped ?? [])],
        global: [...(this.standaloneValidator.global ?? [])],
      }));
    const isSchema = typeof schemaOrRun == 'object',
      sandbox = (isSchema ? run : schemaOrRun)(instance);
    return (
      (this.singleton = mergeDeep(this.singleton, instance.singleton)),
      (this.definitions = mergeDeep(this.definitions, instance.definitions)),
      sandbox.event.request?.length &&
        (this.event.request = [...(this.event.request || []), ...(sandbox.event.request || [])]),
      sandbox.event.mapResponse?.length &&
        (this.event.mapResponse = [
          ...(this.event.mapResponse || []),
          ...(sandbox.event.mapResponse || []),
        ]),
      this.model(sandbox.definitions.type),
      Object.values(instance.router.history).forEach(({ method, path, handler, hooks }) => {
        if (((path = (isSchema ? '' : (this.config.prefix ?? '')) + prefix + path), isSchema)) {
          const { body, headers, query, params, cookie, response, ...hook } = schemaOrRun,
            localHook = hooks;
          this.applyMacro(hook);
          const hasStandaloneSchema = body || headers || query || params || cookie || response;
          this.add(
            method,
            path,
            handler,
            mergeHook(hook, {
              ...localHook,
              error: localHook.error
                ? Array.isArray(localHook.error)
                  ? [...(localHook.error ?? []), ...(sandbox.event.error ?? [])]
                  : [localHook.error, ...(sandbox.event.error ?? [])]
                : sandbox.event.error,
              standaloneValidator:
                hook.standaloneValidator || localHook.standaloneValidator || hasStandaloneSchema
                  ? [
                      ...(hook.standaloneValidator ?? []),
                      ...(localHook.standaloneValidator ?? []),
                      ...(hasStandaloneSchema
                        ? [
                            {
                              body,
                              headers,
                              query,
                              params,
                              cookie,
                              response,
                            },
                          ]
                        : []),
                    ]
                  : void 0,
            }),
            void 0,
          );
        } else
          this.add(method, path, handler, mergeHook(hooks, { error: sandbox.event.error }), {
            skipPrefix: !0,
          });
      }),
      this
    );
  }
  /**
   * ### guard
   * Encapsulate and pass hook into all child handler
   *
   * ---
   * @example
   * ```typescript
   * import { t } from 'elysia'
   *
   * new Elysia()
   *     .guard({
   *          body: t.Object({
   *              username: t.String(),
   *              password: t.String()
   *          })
   *     }, app => app
   *         .get("/", () => 'Hi')
   *         .get("/name", () => 'Elysia')
   *     })
   * ```
   */
  guard(hook, run) {
    if (!run) {
      if (typeof hook == 'object') {
        (this.applyMacro(hook),
          hook.detail &&
            (this.config.detail
              ? (this.config.detail = mergeDeep(Object.assign({}, this.config.detail), hook.detail))
              : (this.config.detail = hook.detail)),
          hook.tags &&
            (this.config.detail
              ? (this.config.detail.tags = hook.tags)
              : (this.config.detail = { tags: hook.tags })));
        const type = hook.as ?? 'local';
        if (hook.schema === 'standalone') {
          this.standaloneValidator[type] || (this.standaloneValidator[type] = []);
          const response = hook?.response
            ? typeof hook.response == 'string' ||
              Kind$1 in hook.response ||
              '~standard' in hook.response
              ? { 200: hook.response }
              : hook?.response
            : void 0;
          this.standaloneValidator[type].push({
            body: hook.body,
            headers: hook.headers,
            params: hook.params,
            query: hook.query,
            response,
            cookie: hook.cookie,
          });
        } else
          this.validator[type] = {
            body: hook.body ?? this.validator[type]?.body,
            headers: hook.headers ?? this.validator[type]?.headers,
            params: hook.params ?? this.validator[type]?.params,
            query: hook.query ?? this.validator[type]?.query,
            response: hook.response ?? this.validator[type]?.response,
            cookie: hook.cookie ?? this.validator[type]?.cookie,
          };
        return (
          hook.parse && this.on({ as: type }, 'parse', hook.parse),
          hook.transform && this.on({ as: type }, 'transform', hook.transform),
          hook.derive && this.on({ as: type }, 'derive', hook.derive),
          hook.beforeHandle && this.on({ as: type }, 'beforeHandle', hook.beforeHandle),
          hook.resolve && this.on({ as: type }, 'resolve', hook.resolve),
          hook.afterHandle && this.on({ as: type }, 'afterHandle', hook.afterHandle),
          hook.mapResponse && this.on({ as: type }, 'mapResponse', hook.mapResponse),
          hook.afterResponse && this.on({ as: type }, 'afterResponse', hook.afterResponse),
          hook.error && this.on({ as: type }, 'error', hook.error),
          this
        );
      }
      return this.guard({}, hook);
    }
    const instance = new _Elysia({
      ...this.config,
      prefix: '',
    });
    ((instance.singleton = { ...this.singleton }),
      (instance.definitions = { ...this.definitions }),
      (instance.inference = cloneInference(this.inference)),
      (instance.extender = { ...this.extender }),
      (instance.getServer = () => this.getServer()));
    const sandbox = run(instance);
    if (
      ((this.singleton = mergeDeep(this.singleton, instance.singleton)),
      (this.definitions = mergeDeep(this.definitions, instance.definitions)),
      (sandbox.getServer = () => this.server),
      sandbox.event.request?.length &&
        (this.event.request = [...(this.event.request || []), ...(sandbox.event.request || [])]),
      sandbox.event.mapResponse?.length &&
        (this.event.mapResponse = [
          ...(this.event.mapResponse || []),
          ...(sandbox.event.mapResponse || []),
        ]),
      this.model(sandbox.definitions.type),
      Object.values(instance.router.history).forEach(
        ({ method, path, handler, hooks: localHook }) => {
          const { body, headers, query, params, cookie, response, ...guardHook } = hook,
            hasStandaloneSchema = body || headers || query || params || cookie || response;
          this.add(
            method,
            path,
            handler,
            mergeHook(guardHook, {
              ...localHook,
              error: localHook.error
                ? Array.isArray(localHook.error)
                  ? [...(localHook.error ?? []), ...(sandbox.event.error ?? [])]
                  : [localHook.error, ...(sandbox.event.error ?? [])]
                : sandbox.event.error,
              standaloneValidator: hasStandaloneSchema
                ? [
                    ...(localHook.standaloneValidator ?? []),
                    {
                      body,
                      headers,
                      query,
                      params,
                      cookie,
                      response,
                    },
                  ]
                : localHook.standaloneValidator,
            }),
          );
        },
      ),
      instance.promisedModules.size > 0)
    ) {
      let processedUntil = instance.router.history.length;
      for (const promise of instance.promisedModules.promises)
        this.promisedModules.add(
          promise.then(() => {
            const { body, headers, query, params, cookie, response, ...guardHook } = hook,
              hasStandaloneSchema = body || headers || query || params || cookie || response,
              startIndex = processedUntil;
            processedUntil = instance.router.history.length;
            for (let i = startIndex; i < instance.router.history.length; i++) {
              const { method, path, handler, hooks: localHook } = instance.router.history[i];
              this.add(
                method,
                path,
                handler,
                mergeHook(guardHook, {
                  ...localHook,
                  error: localHook.error
                    ? Array.isArray(localHook.error)
                      ? [...(localHook.error ?? []), ...(sandbox.event.error ?? [])]
                      : [localHook.error, ...(sandbox.event.error ?? [])]
                    : sandbox.event.error,
                  standaloneValidator: hasStandaloneSchema
                    ? [
                        ...(localHook.standaloneValidator ?? []),
                        {
                          body,
                          headers,
                          query,
                          params,
                          cookie,
                          response,
                        },
                      ]
                    : localHook.standaloneValidator,
                }),
              );
            }
          }),
        );
    }
    return this;
  }
  /**
   * ### use
   * Merge separate logic of Elysia with current
   *
   * ---
   * @example
   * ```typescript
   * const plugin = (app: Elysia) => app
   *     .get('/plugin', () => 'hi')
   *
   * new Elysia()
   *     .use(plugin)
   * ```
   */
  use(plugin) {
    if (!plugin) return this;
    if (Array.isArray(plugin)) {
      let app = this;
      for (const p of plugin) app = app.use(p);
      return app;
    }
    return plugin instanceof Promise
      ? (this.promisedModules.add(
          plugin
            .then((plugin2) => {
              if (typeof plugin2 == 'function') return plugin2(this);
              if (plugin2 instanceof _Elysia) return this._use(plugin2).compile();
              if (plugin2.constructor?.name === 'Elysia') return this._use(plugin2).compile();
              if (typeof plugin2.default == 'function') return plugin2.default(this);
              if (plugin2.default instanceof _Elysia) return this._use(plugin2.default);
              if (plugin2.constructor?.name === 'Elysia') return this._use(plugin2.default);
              if (plugin2.constructor?.name === '_Elysia') return this._use(plugin2.default);
              try {
                return this._use(plugin2.default);
              } catch (error) {
                throw (
                  console.error(
                    'Invalid plugin type. Expected Elysia instance, function, or module with "default" as Elysia instance or function that returns Elysia instance.',
                  ),
                  error
                );
              }
            })
            .then((v) => (v && typeof v.compile == 'function' && v.compile(), v)),
        ),
        this)
      : this._use(plugin);
  }
  propagatePromiseModules(plugin) {
    if (plugin.promisedModules.size <= 0) return this;
    for (const promise of plugin.promisedModules.promises)
      this.promisedModules.add(
        promise.then((v) => {
          if (!v) return;
          const t3 = this._use(v);
          return t3 instanceof Promise
            ? t3.then((v2) => {
                v2 ? v2.compile() : v.compile();
              })
            : v.compile();
        }),
      );
    return this;
  }
  _use(plugin) {
    if (typeof plugin == 'function') {
      const instance = plugin(this);
      return instance instanceof Promise
        ? (this.promisedModules.add(
            instance
              .then((plugin2) => {
                if (plugin2 instanceof _Elysia) {
                  ((plugin2.getServer = () => this.getServer()),
                    (plugin2.getGlobalRoutes = () => this.getGlobalRoutes()),
                    (plugin2.getGlobalDefinitions = () => this.getGlobalDefinitions()),
                    plugin2.model(this.definitions.type),
                    plugin2.error(this.definitions.error));
                  for (const { method, path, handler, hooks } of Object.values(
                    plugin2.router.history,
                  ))
                    this.add(method, path, handler, hooks, void 0);
                  return plugin2 === this
                    ? void 0
                    : (this.propagatePromiseModules(plugin2), plugin2);
                }
                return typeof plugin2 == 'function'
                  ? plugin2(this)
                  : typeof plugin2.default == 'function'
                    ? plugin2.default(this)
                    : this._use(plugin2);
              })
              .then((v) => (v && typeof v.compile == 'function' && v.compile(), v)),
          ),
          this)
        : instance;
    }
    this.propagatePromiseModules(plugin);
    const name = plugin.config.name,
      seed = plugin.config.seed;
    if (
      ((plugin.getParent = () => this),
      (plugin.getServer = () => this.getServer()),
      (plugin.getGlobalRoutes = () => this.getGlobalRoutes()),
      (plugin.getGlobalDefinitions = () => this.getGlobalDefinitions()),
      plugin.standaloneValidator?.scoped &&
        (this.standaloneValidator.local
          ? (this.standaloneValidator.local = this.standaloneValidator.local.concat(
              plugin.standaloneValidator.scoped,
            ))
          : (this.standaloneValidator.local = plugin.standaloneValidator.scoped)),
      plugin.standaloneValidator?.global &&
        (this.standaloneValidator.global
          ? (this.standaloneValidator.global = this.standaloneValidator.global.concat(
              plugin.standaloneValidator.global,
            ))
          : (this.standaloneValidator.global = plugin.standaloneValidator.global)),
      isNotEmpty(plugin['~parser']) &&
        (this['~parser'] = {
          ...plugin['~parser'],
          ...this['~parser'],
        }),
      plugin.setHeaders && this.headers(plugin.setHeaders),
      name)
    ) {
      name in this.dependencies || (this.dependencies[name] = []);
      const current = seed !== void 0 ? checksum(name + JSON.stringify(seed)) : 0;
      this.dependencies[name].some(({ checksum: checksum3 }) => current === checksum3) ||
        ((this.extender.macro = {
          ...this.extender.macro,
          ...plugin.extender.macro,
        }),
        (this.extender.higherOrderFunctions = this.extender.higherOrderFunctions.concat(
          plugin.extender.higherOrderFunctions,
        )));
    } else
      (isNotEmpty(plugin.extender.macro) &&
        (this.extender.macro = {
          ...this.extender.macro,
          ...plugin.extender.macro,
        }),
        plugin.extender.higherOrderFunctions.length &&
          (this.extender.higherOrderFunctions = this.extender.higherOrderFunctions.concat(
            plugin.extender.higherOrderFunctions,
          )));
    if (plugin.extender.higherOrderFunctions.length) {
      deduplicateChecksum(this.extender.higherOrderFunctions);
      const hofHashes = [];
      for (let i = 0; i < this.extender.higherOrderFunctions.length; i++) {
        const hof = this.extender.higherOrderFunctions[i];
        hof.checksum &&
          (hofHashes.includes(hof.checksum) &&
            (this.extender.higherOrderFunctions.splice(i, 1), i--),
          hofHashes.push(hof.checksum));
      }
      hofHashes.length = 0;
    }
    ((this.inference = mergeInference(this.inference, plugin.inference)),
      isNotEmpty(plugin.singleton.decorator) && this.decorate(plugin.singleton.decorator),
      isNotEmpty(plugin.singleton.store) && this.state(plugin.singleton.store),
      isNotEmpty(plugin.definitions.type) && this.model(plugin.definitions.type),
      isNotEmpty(plugin.definitions.error) && this.error(plugin.definitions.error),
      isNotEmpty(plugin.extender.macro) &&
        (this.extender.macro = {
          ...this.extender.macro,
          ...plugin.extender.macro,
        }));
    for (const { method, path, handler, hooks } of Object.values(plugin.router.history))
      this.add(method, path, handler, hooks);
    if (name) {
      name in this.dependencies || (this.dependencies[name] = []);
      const current = seed !== void 0 ? checksum(name + JSON.stringify(seed)) : 0;
      if (this.dependencies[name].some(({ checksum: checksum3 }) => current === checksum3))
        return this;
      (this.dependencies[name].push(
        this.config?.analytic
          ? {
              name: plugin.config.name,
              seed: plugin.config.seed,
              checksum: current,
              dependencies: plugin.dependencies,
              stack: plugin.telemetry?.stack,
              routes: plugin.router.history,
              decorators: plugin.singleton,
              store: plugin.singleton.store,
              error: plugin.definitions.error,
              derive: plugin.event.transform
                ?.filter((x) => x?.subType === 'derive')
                .map((x) => ({
                  fn: x.toString(),
                  stack: /* @__PURE__ */ new Error().stack ?? '',
                })),
              resolve: plugin.event.transform
                ?.filter((x) => x?.subType === 'resolve')
                .map((x) => ({
                  fn: x.toString(),
                  stack: /* @__PURE__ */ new Error().stack ?? '',
                })),
            }
          : {
              name: plugin.config.name,
              seed: plugin.config.seed,
              checksum: current,
              dependencies: plugin.dependencies,
            },
      ),
        isNotEmpty(plugin.event) &&
          (this.event = mergeLifeCycle(this.event, filterGlobalHook(plugin.event), current)));
    } else
      isNotEmpty(plugin.event) &&
        (this.event = mergeLifeCycle(this.event, filterGlobalHook(plugin.event)));
    return (
      plugin.validator.global &&
        (this.validator.global = mergeHook(this.validator.global, { ...plugin.validator.global })),
      plugin.validator.scoped &&
        (this.validator.local = mergeHook(this.validator.local, { ...plugin.validator.scoped })),
      this
    );
  }
  macro(macroOrName, macro) {
    if (typeof macroOrName == 'string' && !macro) throw new Error('Macro function is required');
    return (
      typeof macroOrName == 'string'
        ? (this.extender.macro[macroOrName] = macro)
        : (this.extender.macro = {
            ...this.extender.macro,
            ...macroOrName,
          }),
      this
    );
  }
  applyMacro(localHook, appliable = localHook, { iteration = 0, applied = {} } = {}) {
    if (iteration >= 16) return;
    const macro = this.extender.macro;
    for (let [key, value] of Object.entries(appliable)) {
      if (!(key in macro)) continue;
      const macroHook = typeof macro[key] == 'function' ? macro[key](value) : macro[key];
      if (!macroHook || (typeof macro[key] == 'object' && value === !1)) return;
      const seed = checksum(key + JSON.stringify(macroHook.seed ?? value));
      if (!(seed in applied)) {
        applied[seed] = !0;
        for (let [k, value2] of Object.entries(macroHook))
          if (k !== 'seed') {
            if (k in emptySchema) {
              (insertStandaloneValidator(localHook, k, value2), delete localHook[key]);
              continue;
            }
            if (k === 'introspect') {
              (value2?.(localHook), delete localHook[key]);
              continue;
            }
            if (k === 'detail') {
              (localHook.detail || (localHook.detail = {}),
                (localHook.detail = mergeDeep(localHook.detail, value2, { mergeArray: !0 })),
                delete localHook[key]);
              continue;
            }
            if (k in macro) {
              (this.applyMacro(
                localHook,
                { [k]: value2 },
                {
                  applied,
                  iteration: iteration + 1,
                },
              ),
                delete localHook[key]);
              continue;
            }
            switch (
              ((k === 'derive' || k === 'resolve') &&
                typeof value2 == 'function' &&
                (value2 = {
                  fn: value2,
                  subType: k,
                }),
              typeof localHook[k])
            ) {
              case 'function':
                localHook[k] = [localHook[k], value2];
                break;
              case 'object':
                Array.isArray(localHook[k])
                  ? localHook[k].push(value2)
                  : (localHook[k] = [localHook[k], value2]);
                break;
              case 'undefined':
                localHook[k] = value2;
                break;
            }
            delete localHook[key];
          }
      }
    }
  }
  mount(path, handleOrConfig, config) {
    if (path instanceof _Elysia || typeof path == 'function' || path.length === 0 || path === '/') {
      const run =
          typeof path == 'function'
            ? path
            : path instanceof _Elysia
              ? path.compile().fetch
              : handleOrConfig instanceof _Elysia
                ? handleOrConfig.compile().fetch
                : typeof handleOrConfig == 'function'
                  ? handleOrConfig
                  : (() => {
                      throw new Error('Invalid handler');
                    })(),
        handler2 = ({ request, path: path2 }) =>
          run(new Request(replaceUrlPath(request.url, path2), request));
      return (
        this.route('ALL', '/*', handler2, {
          parse: 'none',
          ...config,
          detail: {
            ...config?.detail,
            hide: !0,
          },
          config: { mount: run },
        }),
        this
      );
    }
    const handle =
        handleOrConfig instanceof _Elysia
          ? handleOrConfig.compile().fetch
          : typeof handleOrConfig == 'function'
            ? handleOrConfig
            : (() => {
                throw new Error('Invalid handler');
              })(),
      length =
        (typeof path == 'string' && this.config.prefix ? this.config.prefix + path : path).length -
        (path.endsWith('*') ? 1 : 0),
      handler = ({ request, path: path2 }) =>
        handle(new Request(replaceUrlPath(request.url, path2.slice(length) || '/'), request));
    return (
      this.route('ALL', path, handler, {
        parse: 'none',
        ...config,
        detail: {
          ...config?.detail,
          hide: !0,
        },
        config: { mount: handle },
      }),
      this.route('ALL', path + (path.endsWith('/') ? '*' : '/*'), handler, {
        parse: 'none',
        ...config,
        detail: {
          ...config?.detail,
          hide: !0,
        },
        config: { mount: handle },
      }),
      this
    );
  }
  /**
   * ### get
   * Register handler for path with method [GET]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .get('/', () => 'hi')
   *     .get('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  get(path, handler, hook) {
    return (this.add('GET', path, handler, hook), this);
  }
  /**
   * ### post
   * Register handler for path with method [POST]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .post('/', () => 'hi')
   *     .post('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  post(path, handler, hook) {
    return (this.add('POST', path, handler, hook), this);
  }
  /**
   * ### put
   * Register handler for path with method [PUT]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .put('/', () => 'hi')
   *     .put('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  put(path, handler, hook) {
    return (this.add('PUT', path, handler, hook), this);
  }
  /**
   * ### patch
   * Register handler for path with method [PATCH]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .patch('/', () => 'hi')
   *     .patch('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  patch(path, handler, hook) {
    return (this.add('PATCH', path, handler, hook), this);
  }
  /**
   * ### delete
   * Register handler for path with method [DELETE]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .delete('/', () => 'hi')
   *     .delete('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  delete(path, handler, hook) {
    return (this.add('DELETE', path, handler, hook), this);
  }
  /**
   * ### options
   * Register handler for path with method [POST]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .options('/', () => 'hi')
   *     .options('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  options(path, handler, hook) {
    return (this.add('OPTIONS', path, handler, hook), this);
  }
  /**
   * ### all
   * Register handler for path with method [ALL]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .all('/', () => 'hi')
   *     .all('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  all(path, handler, hook) {
    return (this.add('ALL', path, handler, hook), this);
  }
  /**
   * ### head
   * Register handler for path with method [HEAD]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .head('/', () => 'hi')
   *     .head('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  head(path, handler, hook) {
    return (this.add('HEAD', path, handler, hook), this);
  }
  /**
   * ### connect
   * Register handler for path with method [CONNECT]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .connect('/', () => 'hi')
   *     .connect('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  connect(path, handler, hook) {
    return (this.add('CONNECT', path, handler, hook), this);
  }
  /**
   * ### route
   * Register handler for path with method [ROUTE]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .route('/', () => 'hi')
   *     .route('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  route(method, path, handler, hook) {
    return (this.add(method.toUpperCase(), path, handler, hook, hook?.config), this);
  }
  /**
   * ### ws
   * Register handler for path with method [ws]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .ws('/', {
   *         message(ws, message) {
   *             ws.send(message)
   *         }
   *     })
   * ```
   */
  ws(path, options) {
    return (
      this['~adapter'].ws
        ? this['~adapter'].ws(this, path, options)
        : console.warn("Current adapter doesn't support WebSocket"),
      this
    );
  }
  /**
   * ### state
   * Assign global mutatable state accessible for all handler
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .state('counter', 0)
   *     .get('/', (({ counter }) => ++counter)
   * ```
   */
  state(options, name, value) {
    name === void 0
      ? ((value = options), (options = { as: 'append' }), (name = ''))
      : value === void 0 &&
        (typeof options == 'string'
          ? ((value = name), (name = options), (options = { as: 'append' }))
          : typeof options == 'object' && ((value = name), (name = '')));
    const { as } = options;
    if (typeof name != 'string') return this;
    switch (typeof value) {
      case 'object':
        return !value || !isNotEmpty(value)
          ? this
          : name
            ? (name in this.singleton.store
                ? (this.singleton.store[name] = mergeDeep(this.singleton.store[name], value, {
                    override: as === 'override',
                  }))
                : (this.singleton.store[name] = value),
              this)
            : value === null
              ? this
              : ((this.singleton.store = mergeDeep(this.singleton.store, value, {
                  override: as === 'override',
                })),
                this);
      case 'function':
        return (
          name
            ? (as === 'override' || !(name in this.singleton.store)) &&
              (this.singleton.store[name] = value)
            : (this.singleton.store = value(this.singleton.store)),
          this
        );
      default:
        return (
          (as === 'override' || !(name in this.singleton.store)) &&
            (this.singleton.store[name] = value),
          this
        );
    }
  }
  /**
   * ### decorate
   * Define custom method to `Context` accessible for all handler
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .decorate('getDate', () => Date.now())
   *     .get('/', (({ getDate }) => getDate())
   * ```
   */
  decorate(options, name, value) {
    name === void 0
      ? ((value = options), (options = { as: 'append' }), (name = ''))
      : value === void 0 &&
        (typeof options == 'string'
          ? ((value = name), (name = options), (options = { as: 'append' }))
          : typeof options == 'object' && ((value = name), (name = '')));
    const { as } = options;
    if (typeof name != 'string') return this;
    switch (typeof value) {
      case 'object':
        return name
          ? (name in this.singleton.decorator
              ? (this.singleton.decorator[name] = mergeDeep(this.singleton.decorator[name], value, {
                  override: as === 'override',
                }))
              : (this.singleton.decorator[name] = value),
            this)
          : value === null
            ? this
            : ((this.singleton.decorator = mergeDeep(this.singleton.decorator, value, {
                override: as === 'override',
              })),
              this);
      case 'function':
        return (
          name
            ? (as === 'override' || !(name in this.singleton.decorator)) &&
              (this.singleton.decorator[name] = value)
            : (this.singleton.decorator = value(this.singleton.decorator)),
          this
        );
      default:
        return (
          (as === 'override' || !(name in this.singleton.decorator)) &&
            (this.singleton.decorator[name] = value),
          this
        );
    }
  }
  derive(optionsOrTransform, transform) {
    transform || ((transform = optionsOrTransform), (optionsOrTransform = { as: 'local' }));
    const hook = {
      subType: 'derive',
      fn: transform,
    };
    return this.onTransform(optionsOrTransform, hook);
  }
  model(name, model) {
    const onlyTypebox = (a) => {
      const res = {};
      for (const key in a) '~standard' in a[key] || (res[key] = a[key]);
      return res;
    };
    switch (typeof name) {
      case 'object':
        const parsedTypebox = {},
          kvs = Object.entries(name);
        if (!kvs.length) return this;
        for (const [key, value] of kvs)
          key in this.definitions.type ||
            ('~standard' in value
              ? (this.definitions.type[key] = value)
              : ((parsedTypebox[key] = this.definitions.type[key] = value),
                (parsedTypebox[key].$id ??= `#/components/schemas/${key}`)));
        return (
          (this.definitions.typebox = t.Module({
            ...this.definitions.typebox.$defs,
            ...parsedTypebox,
          })),
          this
        );
      case 'function':
        const result = name(this.definitions.type);
        return (
          (this.definitions.type = result),
          (this.definitions.typebox = t.Module(onlyTypebox(result))),
          this
        );
      case 'string':
        if (!model) break;
        if (((this.definitions.type[name] = model), '~standard' in model)) return this;
        const newModel = {
          ...model,
          id: model.$id ?? `#/components/schemas/${name}`,
        };
        return (
          (this.definitions.typebox = t.Module({
            ...this.definitions.typebox.$defs,
            ...newModel,
          })),
          this
        );
    }
    return model
      ? ((this.definitions.type[name] = model),
        '~standard' in model
          ? this
          : ((this.definitions.typebox = t.Module({
              ...this.definitions.typebox.$defs,
              [name]: model,
            })),
            this))
      : this;
  }
  Ref(key) {
    return t.Ref(key);
  }
  mapDerive(optionsOrDerive, mapper) {
    mapper || ((mapper = optionsOrDerive), (optionsOrDerive = { as: 'local' }));
    const hook = {
      subType: 'mapDerive',
      fn: mapper,
    };
    return this.onTransform(optionsOrDerive, hook);
  }
  affix(base, type, word) {
    if (word === '') return this;
    const delimieter = ['_', '-', ' '],
      capitalize = (word2) => word2[0].toUpperCase() + word2.slice(1),
      joinKey =
        base === 'prefix'
          ? (prefix, word2) =>
              delimieter.includes(prefix.at(-1) ?? '') ? prefix + word2 : prefix + capitalize(word2)
          : delimieter.includes(word.at(-1) ?? '')
            ? (suffix, word2) => word2 + suffix
            : (suffix, word2) => word2 + capitalize(suffix),
      remap = (type2) => {
        const store = {};
        switch (type2) {
          case 'decorator':
            for (const key in this.singleton.decorator)
              store[joinKey(word, key)] = this.singleton.decorator[key];
            this.singleton.decorator = store;
            break;
          case 'state':
            for (const key in this.singleton.store)
              store[joinKey(word, key)] = this.singleton.store[key];
            this.singleton.store = store;
            break;
          case 'model':
            for (const key in this.definitions.type)
              store[joinKey(word, key)] = this.definitions.type[key];
            this.definitions.type = store;
            break;
          case 'error':
            for (const key in this.definitions.error)
              store[joinKey(word, key)] = this.definitions.error[key];
            this.definitions.error = store;
            break;
        }
      },
      types = Array.isArray(type) ? type : [type];
    for (const type2 of types.some((x) => x === 'all')
      ? ['decorator', 'state', 'model', 'error']
      : types)
      remap(type2);
    return this;
  }
  prefix(type, word) {
    return this.affix('prefix', type, word);
  }
  suffix(type, word) {
    return this.affix('suffix', type, word);
  }
  compile() {
    return (
      this['~adapter'].beforeCompile?.(this),
      this['~adapter'].isWebStandard
        ? ((this._handle = this.config.aot
            ? composeGeneralHandler(this)
            : createDynamicHandler(this)),
          Object.defineProperty(this, 'fetch', {
            value: this._handle,
            configurable: !0,
            writable: !0,
          }),
          typeof this.server?.reload == 'function' &&
            this.server.reload({
              ...this.server,
              fetch: this.fetch,
            }),
          this)
        : (typeof this.server?.reload == 'function' && this.server.reload(this.server || {}),
          (this._handle = composeGeneralHandler(this)),
          this)
    );
  }
  /**
   * Use handle can be either sync or async to save performance.
   *
   * Beside benchmark purpose, please use 'handle' instead.
   */
  get fetch() {
    const fetch = this.config.aot ? composeGeneralHandler(this) : createDynamicHandler(this);
    return (
      Object.defineProperty(this, 'fetch', {
        value: fetch,
        configurable: !0,
        writable: !0,
      }),
      fetch
    );
  }
  /**
   * Wait until all lazy loaded modules all load is fully
   */
  get modules() {
    return this.promisedModules;
  }
};
//#endregion
export { Elysia as t };
