import { r as HTTPResponse } from '../_libs/h3+rou3+srvx.mjs';
//#region #nitro/virtual/renderer-template
var rendererTemplate = () =>
  new HTTPResponse(
    '<!doctype html>\n<html lang="">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" href="https://assets.viyuni.top/viyuni.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Song List - Viyuni</title>\n    <script type="module" crossorigin src="/assets/index-CrFumm45.js"><\/script>\n    <link rel="stylesheet" crossorigin href="/assets/index-x4gjaMX1.css">\n  </head>\n  <body>\n    <div id="app"></div>\n  </body>\n</html>\n',
    { headers: { 'content-type': 'text/html; charset=utf-8' } },
  );
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_@void_5f641374ec6551ac415033051a3dd0ef/node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
function renderIndexHTML(event) {
  return rendererTemplate(event.req);
}
//#endregion
export { renderIndexHTML as default };
