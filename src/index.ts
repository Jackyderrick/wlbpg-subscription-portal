var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var __freeze = Object.freeze;
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __template = /* @__PURE__ */ __name((cooked, raw) => __freeze(__defProp2(cooked, "raw", { value: __freeze(raw || cooked.slice()) })), "__template");
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
var Ban = [
  "svg",
  defaultAttributes,
  [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m4.9 4.9 14.2 14.2" }]
  ]
];
var Ellipsis = [
  "svg",
  defaultAttributes,
  [
    ["circle", { cx: "12", cy: "12", r: "1" }],
    ["circle", { cx: "19", cy: "12", r: "1" }],
    ["circle", { cx: "5", cy: "12", r: "1" }]
  ]
];
var Info = [
  "svg",
  defaultAttributes,
  [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }]
  ]
];
var Layers = [
  "svg",
  defaultAttributes,
  [
    [
      "path",
      {
        d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
      }
    ],
    ["path", { d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" }],
    ["path", { d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" }]
  ]
];
var LogOut = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
    ["polyline", { points: "16 17 21 12 16 7" }],
    ["line", { x1: "21", x2: "9", y1: "12", y2: "12" }]
  ]
];
var Pencil = [
  "svg",
  defaultAttributes,
  [
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ],
    ["path", { d: "m15 5 4 4" }]
  ]
];
var Plus = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "M12 5v14" }]
  ]
];
var Receipt = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
    ["path", { d: "M12 17.5v-11" }]
  ]
];
var RefreshCw = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
    ["path", { d: "M21 3v5h-5" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
    ["path", { d: "M8 16H3v5" }]
  ]
];
var Search = [
  "svg",
  defaultAttributes,
  [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }]
  ]
];
var Settings = [
  "svg",
  defaultAttributes,
  [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ]
];
var Users = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
    ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }]
  ]
];
var X = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }]
  ]
];
var admin_styles_default = String.raw`
:root{font-family:Arial,"Microsoft YaHei",sans-serif;font-size:16px;line-height:1.4;letter-spacing:0;color:#111827;background:#fff;color-scheme:light;--blue:#1958ed;--line:#edf0f4;--muted:#6b7280}
*{box-sizing:border-box}body{margin:0}button,input,select,textarea{font:inherit}button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:8px 13px;border:1px solid #dddfe6;border-radius:6px;background:#fff;color:inherit;cursor:pointer}button:hover{background:#f5f7fb}button:disabled{opacity:.5;cursor:not-allowed}button:focus-visible,a:focus-visible{outline:3px solid #a5c2ff;outline-offset:2px}input,select,textarea{width:100%;min-width:0;padding:9px 12px;border:1px solid #d6d9e1;border-radius:6px;background:#fff;color:inherit}input:focus,select:focus,textarea:focus{outline:2px solid #adc5ff;border-color:var(--blue)}label{display:block}label input,label select,label textarea{margin-top:7px}input[type=checkbox]{width:18px;height:18px;margin:0;accent-color:var(--blue);cursor:pointer;vertical-align:middle}.primary{background:var(--blue);border-color:var(--blue);color:#fff}.primary:hover{background:#124cd7}.icon{width:36px;min-height:36px;padding:7px;flex:none;border:0;background:transparent}.link{padding:4px 0;min-height:28px;color:var(--blue);background:transparent;border:0;font-weight:600}.danger{color:#d63e3e}.muted{color:var(--muted);font-weight:400}.hidden,[hidden]{display:none!important}.sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
h1,h2,h3,p{margin:0}h1{font-size:28px;line-height:36px;font-weight:700}h2{font-size:21px;line-height:28px}h3{font-size:20px;line-height:28px}p{line-height:1.5}
header{height:60px;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:0 28px;border-bottom:1px solid #e6e8ed}.brand{display:flex;align-items:center;gap:14px;font-size:23px;font-weight:700}.brandmark{width:36px;height:36px;border-radius:7px;display:grid;place-items:center;background:var(--blue);color:white}.brandmark svg{width:24px;height:24px}.header-right{display:flex;align-items:center;gap:8px}.header-right time{font-size:17px;white-space:nowrap}.header-right>.icon{width:28px;min-height:30px;padding:4px}.shell{display:grid;grid-template-columns:200px minmax(0,1fr);min-height:calc(100vh - 60px)}
nav{padding:24px 9px;background:#f7f9fd;border-right:1px solid #e8ebf1}nav h2{font-size:20px;line-height:28px;margin:0 12px 22px}nav button{justify-content:flex-start;width:100%;min-height:48px;padding:10px 17px;margin:0 0 2px;border:0;background:transparent;font-size:17px;gap:14px}nav button svg{width:22px;height:22px;color:#626b78}nav button.active{background:#e7edff;color:var(--blue);box-shadow:inset 3px 0 var(--blue);font-weight:600}nav button.active svg{color:var(--blue)}
.workspace{display:grid;grid-template-columns:minmax(0,1fr);min-width:0}.workspace.with-detail{grid-template-columns:minmax(0,1fr) 400px}.content{min-width:0;padding:24px 20px;display:flex;flex-direction:column}.page-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:20px;border-bottom:1px solid var(--line)}.page-heading p{margin-top:4px;font-size:18px;color:var(--muted);line-height:26px}.page-heading .primary{min-width:140px;height:44px;font-weight:600}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:24px;margin:14px 0 30px}.search{position:relative;flex:1;min-width:180px}.search svg{position:absolute;left:13px;top:11px;color:#77808e;width:19px;height:19px}.search input{height:40px;margin:0;padding:8px 10px 8px 42px;font-size:14px}.filters{display:flex;gap:8px;flex:none}.filters button{height:40px;white-space:nowrap;padding:8px 13px;background:#fafbfc;font-weight:550}.filters .active{color:var(--blue);border-color:var(--blue);background:#f3f6ff;box-shadow:0 0 0 1px #1958ed19}
.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;text-align:left}th,td{border-bottom:1px solid var(--line);padding:10px 9px;font-size:16px;vertical-align:middle}th{height:44px;background:#f7f8fb;font-weight:500;color:#505a6b;white-space:nowrap}#usersView th,#usersView td{padding:10px 8px}#usersView tbody tr{height:72px}#usersView th:first-child{width:40px}#usersView th:nth-child(2){width:25%}#usersView th:nth-child(3){width:18%}#usersView th:nth-child(4){width:27%}#usersView th:nth-child(5){width:10%}#usersView th:last-child{width:14%}.selection-cell{text-align:center}td strong{display:block;font-weight:650;line-height:22px;margin-bottom:3px;overflow-wrap:anywhere}.date-cell{white-space:nowrap}.row-actions{display:flex;align-items:center;gap:14px}.row-actions .icon{width:25px;min-height:30px;padding:3px;color:#586171}.row-actions .icon svg{width:21px;height:21px}tr[data-user]{cursor:pointer}tr[data-user]:hover{background:#f7f9ff}tr.selected{background:#e8efff}.badge{display:inline-block;padding:3px 10px;font-size:15px;font-weight:550;line-height:21px;border-radius:16px;background:#e3f5e9;color:#29824e;white-space:nowrap}.badge.soon{background:#fff0dc;color:#b77b2d}.badge.expired{background:#ffe7e7;color:#d24343}.badge.disabled{background:#edf0f4;color:#697386}.mobile-expiry{display:none}.empty{padding:40px 15px;text-align:center;color:var(--muted)}.footer{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px;color:var(--muted);margin-top:20px}.pager{display:flex;align-items:center;gap:8px}.pager button{font-size:13px;min-height:30px;padding:4px 8px}
aside{min-width:0;border-left:1px solid #e1e4eb;background:#fff;padding:20px}.aside-heading{display:flex;align-items:center;justify-content:space-between;min-height:44px;padding-bottom:14px;margin-bottom:16px;border-bottom:1px solid var(--line)}.aside-heading .icon{width:24px;min-height:28px;padding:2px;color:#707887}.identity{display:flex;align-items:center;justify-content:space-between;gap:12px}.identity h2{font-size:24px;line-height:30px;overflow-wrap:anywhere}.identity p{font-size:18px;line-height:24px;color:#5e6676}.facts{margin:14px 0 24px}.fact{display:grid;grid-template-columns:124px minmax(0,1fr);align-items:center;min-height:38px;padding:6px 0;border-bottom:1px solid var(--line);gap:8px}.fact>span:last-child{overflow-wrap:anywhere;text-align:left}.fact .badge{justify-self:start}.fact .email-value{display:flex;align-items:center;justify-content:space-between;gap:8px}.fact .email-value>span{overflow-wrap:anywhere}.fact .link{font-size:16px;min-height:24px;flex:none}.renew-section h3{margin-bottom:16px}.segments{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:14px}.segments button{min-height:40px;border-radius:0;background:#fafbfc;padding:7px 4px}.segments button:first-child{border-radius:6px 0 0 6px}.segments button:last-child{border-radius:0 6px 6px 0}.segments button+button{border-left:0}.segments .active{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600}.notice{display:flex;gap:7px;align-items:center;font-size:14px;line-height:22px;color:#d34444;margin:14px 0 16px}.notice svg{width:18px;height:18px;flex:none}.preview{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:48px;background:#eaf0ff;border-radius:6px;padding:10px 14px;margin:16px 0 24px}.preview strong{font-size:18px;color:#1953d1;text-align:right;white-space:nowrap}.wide{width:100%;height:44px;font-size:18px;font-weight:600}.renew-section>p.muted{font-size:14px;margin-top:10px;line-height:22px}.section-end{padding-top:16px;margin-top:18px;border-top:1px solid var(--line)}.section-end>.link{font-size:16px;font-weight:400;gap:8px}.extra-details{margin-top:28px;border-top:1px solid var(--line);padding-top:16px}.extra-details summary{cursor:pointer;color:#677184;font-size:14px}.detail-tabs{display:flex;gap:8px;margin:16px 0 10px}.detail-tabs button{font-size:14px;min-height:32px;padding:5px 10px}.detail-list{max-height:240px;overflow:auto}.detail-item{padding:10px 0;border-bottom:1px solid var(--line);font-size:14px;overflow-wrap:anywhere}.detail-item p{margin-top:4px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.form-grid label{font-weight:550}.full{grid-column:1/-1}dialog{width:min(540px,calc(100% - 32px));max-height:90vh;overflow:auto;border:1px solid #e2e5ec;border-radius:8px;padding:24px}dialog::backdrop{background:#17284255}.dialog-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.dialog-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}#confirmationText{margin-top:16px}.login{width:min(400px,calc(100% - 32px));margin:100px auto}.login h1{margin-bottom:28px}.login button{margin-top:20px;width:100%}.error{color:#bd2828;background:#fff0f0;padding:12px;border-radius:6px;overflow-wrap:anywhere}#message{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#182131;color:white;padding:12px 20px;border-radius:6px;z-index:10;max-width:90vw;overflow-wrap:anywhere}#message.error{background:#b72e2e}#createdLink{overflow-wrap:anywhere}.settings{max-width:650px}.settings .fact{grid-template-columns:180px 1fr;padding:18px 0}.actions-heading{display:flex;gap:8px}.row-menu{position:fixed;z-index:8;min-width:140px;padding:5px;border:1px solid #e0e5ed;border-radius:6px;background:#fff;box-shadow:0 5px 18px #15223b1a}.row-menu button{width:100%;justify-content:flex-start;border:0;font-size:14px}.list-context{margin-top:auto;padding-top:30px;font-size:13px;color:var(--muted)}
.shell{height:calc(100dvh - 60px);min-height:0;overflow:hidden}.workspace{height:100%;min-height:0}.content,aside{overflow-y:auto;min-height:0;scrollbar-width:thin}aside{scrollbar-width:none}nav{display:flex;flex-direction:column}.nav-tools{display:flex;gap:8px;margin-top:auto;padding:20px 12px 0}.nav-tools button{width:36px;min-height:36px;padding:7px;justify-content:center;margin:0}.header-right time{font-size:17px}.toolbar{margin-bottom:32px}#usersView{display:flex;flex-direction:column;flex:1}#usersView table{table-layout:fixed}#usersView th:first-child{width:44px}#usersView th:nth-child(2){width:24.375%}#usersView th:nth-child(3){width:17.5%}#usersView th:nth-child(4){width:26.25%}#usersView th:nth-child(5){width:10.625%}#usersView th:last-child{width:14.375%}#usersView .footer{margin-top:auto;padding-top:20px}.list-context{margin-top:12px;padding-top:0}.selection-cell{text-align:left}
@media(min-width:1500px){.workspace.with-detail{grid-template-columns:minmax(0,1fr) 400px}.content{padding-left:28px;padding-right:28px}.toolbar{justify-content:flex-start}.search{max-width:400px}}
@media(max-width:1119px){.shell{grid-template-columns:180px minmax(0,1fr)}.workspace.with-detail{grid-template-columns:minmax(0,1fr)}.toolbar{flex-wrap:wrap;gap:12px}.search{max-width:none}.content{padding:24px 20px}aside{position:fixed;top:60px;right:0;bottom:0;width:400px;max-width:100%;overflow:auto;z-index:3;box-shadow:-12px 0 36px #13254120}body:has(.workspace.with-detail){overflow:hidden}.aside-heading{position:sticky;top:-20px;background:#fff;z-index:2;padding-top:12px}}
@media(max-width:650px){:root{font-size:14px}header{padding:0 14px}.brand{font-size:17px;gap:10px}.header-right time{display:none}.header-right>.icon{width:28px}.shell{display:block}nav{display:flex;gap:3px;padding:6px;border-right:0;border-bottom:1px solid var(--line)}nav h2{display:none}nav button{flex:1;width:auto;min-width:0;min-height:40px;margin:0;padding:8px 4px;gap:4px;font-size:12px;white-space:nowrap}nav button svg{width:16px;height:16px}.content{padding:22px 14px}h1{font-size:23px;line-height:30px}.page-heading{align-items:flex-start}.page-heading p{font-size:12px;line-height:18px}.page-heading .primary{min-width:100px;height:40px;padding:8px;font-size:14px}.toolbar{margin:18px 0;gap:12px}.search{width:100%;flex-basis:100%}.search input{font-size:13px}.filters{gap:5px}.filters button{font-size:13px;padding:7px 10px;min-height:36px;height:36px}#usersView table{table-layout:fixed}#usersView th,#usersView td{font-size:14px;padding:12px 6px}#usersView th:first-child,#usersView td:first-child,#usersView th:nth-child(4),#usersView td:nth-child(4),#usersView th:nth-child(5),#usersView td:nth-child(5){display:none}#usersView th:nth-child(2){width:44%}#usersView th:nth-child(3){width:27%}#usersView th:last-child{width:29%}.mobile-expiry{display:block;margin-top:5px;font-size:12px;line-height:1.6;color:var(--muted)}.row-actions{gap:3px}.row-actions .link{font-size:14px}.row-actions .icon{width:25px}.badge{font-size:12px;padding:3px 6px}.footer{align-items:flex-start;flex-wrap:wrap}aside{top:0;width:100%;padding:20px}.fact{grid-template-columns:116px minmax(0,1fr);font-size:15px}.preview strong{font-size:16px}.notice{font-size:13px}.form-grid{grid-template-columns:1fr}.full{grid-column:auto}.settings .fact{grid-template-columns:1fr;gap:8px}.list-context{display:none}}
@media(max-width:650px){.shell{height:auto;min-height:calc(100dvh - 60px);overflow:visible}.workspace{height:auto}.content{overflow:visible}nav{flex-direction:row}.nav-tools{display:none}#usersView th:nth-child(2){width:44%}#usersView th:nth-child(3){width:27%}#usersView th:last-child{width:29%}#usersView .footer{margin-top:20px}}
.dns-result{margin-top:16px;padding:12px;border-radius:6px;background:#e8f5ed;color:#236d43;line-height:1.6;overflow-wrap:anywhere}
.dns-result.error{background:#fff0f0;color:#bd2828}#dnsError{margin-top:16px}
`;
var icon = /* @__PURE__ */ __name2((nodes) => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + nodes[2].map(([tag, attrs]) => "<" + tag + " " + Object.entries(attrs).map(([key, value]) => key + '="' + value + '"').join(" ") + "></" + tag + ">").join("") + "</svg>", "icon");
var icons = Object.fromEntries(Object.entries({ Users, Layers, Receipt, Settings, Plus, Search, X, RefreshCw, LogOut, Ban, Pencil, MoreHorizontal: Ellipsis, Info }).map(([key, value]) => [key, icon(value)]));
var _a;
var admin_page_default = String.raw(_a || (_a = __template(['<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>\u8BA2\u9605\u7BA1\u7406\u5DE5\u4F5C\u53F0</title>\n<style>', '</style></head><body>\n<header><div class="brand"><span class="brandmark">', '</span>\u9AD8\u6548\u7BA1\u7406\u5DE5\u4F5C\u53F0</div><div class="header-right"><time id="clock" class="muted"></time></div></header>\n<form id="login" class="login"><h1>\u7BA1\u7406\u5458\u767B\u5F55</h1><label>\u7BA1\u7406\u5458\u5BC6\u94A5<input id="secret" type="password" required autocomplete="current-password"></label><button class="primary">\u8FDB\u5165\u540E\u53F0</button><p id="loginError" class="error" hidden></p></form>\n<div id="app" class="shell" hidden><nav aria-label="\u7BA1\u7406\u5BFC\u822A"><h2>\u8BA2\u9605\u7BA1\u7406</h2><button data-view="users" class="active">', '\u7528\u6237\u7BA1\u7406</button><button data-view="plans"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>\u5957\u9910\u7BA1\u7406</button><button data-view="upstreams">', '\u4E0A\u6E38\u8BA2\u9605</button><button data-view="orders">', '\u8BA2\u5355\u8BB0\u5F55</button><button data-view="settings">', '\u7CFB\u7EDF\u8BBE\u7F6E</button><div class="nav-tools"><button class="icon" id="refresh" title="\u5237\u65B0\u6570\u636E" aria-label="\u5237\u65B0\u6570\u636E">', '</button><button class="icon" id="logout" title="\u9000\u51FA\u767B\u5F55" aria-label="\u9000\u51FA\u767B\u5F55">', '</button></div></nav>\n<div class="workspace" id="workspace"><main class="content"><div class="page-heading"><div><h1 id="pageTitle">\u7528\u6237\u7BA1\u7406</h1><p id="pageSubtitle">\u7BA1\u7406\u7528\u6237\u3001\u6709\u6548\u671F\u4E0E\u5206\u4EAB\u6743\u9650</p></div><button id="newButton" class="primary">', '<span>\u65B0\u5EFA\u7528\u6237</span></button></div>\n<section id="usersView"><div class="toolbar"><label class="search" aria-label="\u641C\u7D22\u7528\u6237">', '<input id="search" type="search" placeholder="\u641C\u7D22\u7528\u6237\u540D\u3001\u90AE\u7BB1\u6216 ID\uFF08\u5982 #26\uFF09"></label><div class="filters" id="filters"><button data-filter="all" class="active">\u5168\u90E8</button><button data-filter="soon">\u5373\u5C06\u5230\u671F</button><button data-filter="expired">\u5DF2\u5230\u671F</button><button data-filter="disabled">\u5DF2\u505C\u7528</button></div></div><div class="table-wrap"><table><thead><tr><th class="selection-cell"><span class="sr-only">\u9009\u62E9\u7528\u6237</span></th><th>\u7528\u6237</th><th>\u6709\u6548\u72B6\u6001</th><th>\u5230\u671F\u65F6\u95F4</th><th>\u8BBE\u5907</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="userRows"></tbody></table></div><div class="footer"><span id="userCount"></span><div class="pager"><button id="prevUsers">\u4E0A\u4E00\u9875</button><span id="userPage"></span><button id="nextUsers">\u4E0B\u4E00\u9875</button></div></div></section>\n<section id="plansView" hidden><div class="table-wrap"><table><thead><tr><th>\u5957\u9910\u6863\u4F4D</th><th>\u4EF7\u683C / \u5468\u671F</th><th>\u8282\u70B9\u4E0A\u9650</th><th>\u5DF2\u6307\u5B9A\u4E13\u5C5E\u8282\u70B9</th><th>\u5BA2\u6237\u7AEF\u663E\u793A</th><th>\u5F53\u524D\u7528\u6237\u6570</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="planRows"></tbody></table></div></section>\n<section id="upstreamsView" hidden><div class="table-wrap"><table><thead><tr><th>\u540D\u79F0</th><th>\u8282\u70B9</th><th>\u6700\u8FD1\u540C\u6B65</th><th>\u72B6\u6001</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="upRows"></tbody></table></div></section>\n<section id="ordersView" hidden><div class="table-wrap"><table><thead><tr><th>\u8BA2\u5355\u53F7</th><th>\u7528\u6237</th><th>\u5957\u9910</th><th>\u91D1\u989D</th><th>\u72B6\u6001</th><th>\u521B\u5EFA\u65F6\u95F4</th></tr></thead><tbody id="orderRows"></tbody></table></div><div class="footer"><span id="orderPage"></span><div class="pager"><button id="prevOrders">\u4E0A\u4E00\u9875</button><button id="nextOrders">\u4E0B\u4E00\u9875</button></div></div></section>\n<section id="settingsView" class="settings" hidden><div class="fact"><span>App Base URL</span><span id="baseUrl"></span></div><div class="fact"><span>\u65F6\u95F4\u663E\u793A</span><span>Asia/Shanghai\uFF08UTC+8\uFF09</span></div><div class="fact"><span>\u7528\u6237\u5217\u8868\u8303\u56F4</span><span>\u6700\u8FD1 500 \u4F4D\u7528\u6237</span></div><div class="fact"><span>\u4E0A\u6E38\u6570\u91CF</span><span id="upCount"></span></div><div class="section-end"><button id="settingsLogout">', '\u9000\u51FA\u767B\u5F55</button></div></section>\n</main><aside id="detail" hidden aria-label="\u7528\u6237\u8BE6\u60C5"></aside></div></div>\n<dialog id="editor" aria-labelledby="editorTitle"><div class="dialog-heading"><h2 id="editorTitle"></h2><button class="icon" id="closeEditor" aria-label="\u5173\u95ED">', '</button></div><form id="editorForm"><div id="editorFields" class="form-grid"></div><div class="dialog-actions"><button type="button" id="cancelEditor">\u53D6\u6D88</button><button class="primary" id="saveEditor">\u4FDD\u5B58</button></div><p id="formError" class="error" hidden></p></form><p id="createdLink" hidden></p></dialog>\n<dialog id="confirmation" aria-labelledby="confirmationTitle"><h2 id="confirmationTitle">\u786E\u8BA4\u64CD\u4F5C</h2><p id="confirmationText"></p><div class="dialog-actions"><button id="confirmationCancel">\u53D6\u6D88</button><button id="confirmationAccept" class="primary">\u786E\u8BA4\u6267\u884C</button></div></dialog>\n<div id="rowMenu" class="row-menu" role="menu" hidden><button role="menuitem" data-menu-action="detail">\u7528\u6237\u8BE6\u60C5</button><button role="menuitem" data-menu-action="edit">\u7F16\u8F91\u8D44\u6599</button><button role="menuitem" data-menu-action="dns">\u8282\u70B9\u4E0E DNS</button></div>\n<dialog id="dnsEditor" aria-labelledby="dnsTitle"><div class="dialog-heading"><h2 id="dnsTitle">\u8282\u70B9\u4E0E DNS</h2><button class="icon" id="closeDns" aria-label="\u5173\u95ED\u8282\u70B9\u7BA1\u7406">', '</button></div><form id="dnsForm"><div class="fact"><span>\u7528\u6237</span><span id="dnsUser"></span></div><div class="fact"><span>\u6709\u6548 DNS / \u989D\u5EA6</span><span id="dnsCounts"></span></div><label style="margin-top:14px">\u6240\u5C5E\u5957\u9910\u6863\u4F4D<select id="dnsPlanId" style="margin-top:4px"></select></label><label style="margin-top:14px">\u76EE\u6807\u8282\u70B9\u6570\u91CF<input id="dnsLimit" type="number" min="1" max="20" step="1" required></label><div style="margin-top:14px"><label style="font-weight:600">\u6307\u5B9A\u4E13\u5C5E\u8282\u70B9\uFF08\u53EF\u9009\uFF09\uFF1A</label><div id="dnsNodeList" style="max-height:180px;overflow-y:auto;border:1px solid #d6d9e1;border-radius:6px;padding:8px;margin-top:6px;background:#f9fafb;font-size:13px"></div><small class="muted" style="display:block;margin-top:4px">\u52FE\u9009\u540E\u8BE5\u7528\u6237\u4EC5\u4E0B\u53D1\u9009\u4E2D\u7684\u4E13\u5C5E\u8282\u70B9\uFF1B\u82E5\u5168\u4E0D\u52FE\u9009\u5219\u6309\u4E0A\u6E38\u8282\u70B9\u6C60\u81EA\u52A8\u5206\u914D\u3002</small></div><p id="dnsResult" class="dns-result" role="status" hidden></p><p id="dnsError" class="error" hidden></p><div class="dialog-actions"><button type="button" id="fillDns" title="\u6309\u5F53\u524D\u5DF2\u4FDD\u5B58\u989D\u5EA6\u8865\u9F50 DNS">\u8865\u9F50 DNS</button><button class="primary" id="saveDns">\u4FDD\u5B58\u5E76\u5206\u914D</button></div></form></dialog>\n<dialog id="planEditor" aria-labelledby="planEditorTitle"><div class="dialog-heading"><h2 id="planEditorTitle">\u5957\u9910\u8282\u70B9\u4E0E\u53C2\u6570\u8BBE\u7F6E</h2><button class="icon" id="closePlanEditor" aria-label="\u5173\u95ED"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div><form id="planForm"><div class="form-grid"><label id="planEditIdWrap">\u5957\u9910\u6807\u8BC6 ID<input id="planEditId" type="text" placeholder="\u5982 pro_monthly" pattern="[A-Za-z0-9_-]+" required></label><label>\u5957\u9910\u540D\u79F0<input id="planEditName" type="text" required></label><label>\u4EF7\u683C\uFF08\u5143\uFF09<input id="planEditPrice" type="number" min="0" step="0.01" required></label><label>\u6709\u6548\u5929\u6570<input id="planEditDays" type="number" min="1" max="3650" step="1" required></label><label>\u8282\u70B9\u989D\u5EA6\u4E0A\u9650<input id="planEditNodeLimit" type="number" min="1" max="20" step="1" required></label></div><label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:14px;cursor:pointer"><input type="checkbox" id="planEditEnabled" checked style="width:auto"><span><strong>\u5728\u5BA2\u6237\u7AEF\u5E94\u7528\u4E2D\u663E\u793A\uFF08\u4E0A\u67B6\u552E\u5356\uFF09</strong><small class="muted" style="display:block">\u5F00\u542F\u540E\u5BA2\u6237\u7AEF\u8D2D\u4E70\u5217\u8868\u4E2D\u53EF\u89C1\uFF1B\u5173\u95ED\u540E\u5BA2\u6237\u7AEF\u9690\u85CF\uFF0C\u4F46\u7BA1\u7406\u5458\u4ECD\u53EF\u540E\u53F0\u624B\u52A8\u5206\u914D</small></span></label><div style="margin-top:14px"><div style="display:flex;justify-content:space-between;align-items:center"><label style="font-weight:600">\u6307\u5B9A\u8BE5\u5957\u9910\u4E13\u5C5E\u8282\u70B9\uFF1A</label><span style="font-size:13px"><button type="button" class="link" id="planSelectAll">\u5168\u9009</button> \xB7 <button type="button" class="link" id="planClearAll">\u6E05\u7A7A</button></span></div><div id="planNodeList" style="max-height:220px;overflow-y:auto;border:1px solid #d6d9e1;border-radius:6px;padding:8px;margin-top:6px;background:#f9fafb;font-size:13px"></div><small class="muted" style="display:block;margin-top:4px">\u52FE\u9009\u540E\uFF0C\u5F00\u901A\u6216\u5F52\u5C5E\u8BE5\u5957\u9910\u7684\u7528\u6237\u5C06\u81EA\u52A8\u4ECE\u6240\u9009\u8282\u70B9\u4E2D\u5206\u914D DNS\uFF1B\u82E5\u5168\u4E0D\u52FE\u9009\u5219\u4ECE\u5168\u5C40\u8282\u70B9\u6C60\u5206\u914D\u3002</small></div><label id="planSyncUsersWrap" style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:14px;cursor:pointer"><input type="checkbox" id="planSyncUsers" checked style="width:auto"><span>\u4FDD\u5B58\u540E\u7ACB\u5373\u540C\u6B65\u66F4\u65B0\u8BE5\u5957\u9910\u4E0B\u73B0\u6709\u6709\u6548\u7528\u6237\u7684 DNS \u8282\u70B9</span></label><p id="planError" class="error" hidden></p><div class="dialog-actions"><button type="button" id="cancelPlanEditor">\u53D6\u6D88</button><button class="primary" id="savePlanBtn">\u4FDD\u5B58\u5E76\u5E94\u7528</button></div></form></dialog>\n<div id="message" role="status" hidden></div>\n<script>\nconst I=', `;
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stamp=x=>{if(!x)return '\u2014';const v=String(x);return v.includes('T')||/[zZ]|[+]dd:dd$/.test(v)?v:v.replace(' ','T')+'Z'};
const fmt=x=>!x?'\u2014':new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(stamp(x))).replaceAll('/','-');
const now=()=>Date.now();let key=sessionStorage.getItem('adminKey')||localStorage.getItem('adminKey')||'',data={users:[],upstreams:[],plans:[],availableNodes:[]},view='users',filter='all',userPage=1,orderPage=1,selected=null,detail=null,detailTab='devices',days=30,editorMode='',busy=false,detailRequest=0,messageTimer,initialSelection=false,menuUser=null;
function notify(text,error=false){clearTimeout(messageTimer);$('#message').textContent=text;$('#message').classList.toggle('error',error);$('#message').hidden=false;messageTimer=setTimeout(()=>$('#message').hidden=true,6000)}
async function call(path,opt={}){const r=await fetch(path,{...opt,headers:{'Content-Type':'application/json',Authorization:'Bearer '+key}});const d=await r.json();if(!r.ok){if(r.status===401){sessionStorage.removeItem('adminKey');localStorage.removeItem('adminKey');$('#app').hidden=true;$('#login').hidden=false}throw new Error(d.error||'\u8BF7\u6C42\u5931\u8D25\uFF08'+r.status+'\uFF09')}return d}
function state(u){if(u.status==='disabled')return 'disabled';const left=Date.parse(stamp(u.expires_at))-now();if(u.status==='expired'||left<=0)return 'expired';return left<=3*86400000?'soon':'active'}
const statusName={active:'\u4F7F\u7528\u4E2D',soon:'\u5373\u5C06\u5230\u671F',expired:'\u5DF2\u5230\u671F',disabled:'\u5DF2\u505C\u7528'};
const badge=u=>'<span class="badge '+state(u)+'">'+statusName[state(u)]+'</span>';
const defaultPlans=[{id:'trial_1d',name:'\u4F53\u9A8C',nodeLimit:5},{id:'basic_monthly',name:'\u57FA\u7840',nodeLimit:10},{id:'advanced_monthly',name:'\u9AD8\u7EA7',nodeLimit:15},{id:'residential_monthly',name:'\u5BB6\u5BBD',nodeLimit:20}];
const getPlans=()=>data.plans?.length?data.plans:defaultPlans;
const normPlan=id=>['standard_monthly','standard_quarterly','standard_yearly'].includes(id)?'advanced_monthly':(id||'trial_1d');
const planName=id=>{const p=getPlans().find(x=>x.id===normPlan(id));return p?p.name:normPlan(id)};
const planBadge=id=>'<span class="badge" style="margin-left:6px;background:#eef2ff;color:#1958ed;font-weight:500">'+esc(planName(id))+'</span>';
function renderUsers(){
  const q=$('#search').value.trim().toLowerCase().replace(/^#/,'').replace(/[\uff01-\uff5e]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0)).replace(/\u3002/g,'.').replace(/\u3000/g,' ');
  const list=data.users.filter(u=>(filter==='all'||state(u)===filter)&&(!q||[u.name,u.email,u.nickname,String(u.id)].some(v=>String(v||'').toLowerCase().includes(q))));
  const pages=Math.max(1,Math.ceil(list.length/20));userPage=Math.min(userPage,pages);
  $('#userRows').innerHTML=list.slice((userPage-1)*20,userPage*20).map(u=>'<tr data-user="'+u.id+'" tabindex="0" aria-selected="'+(selected===u.id)+'" class="'+(selected===u.id?'selected':'')+'"><td class="selection-cell"><input type="checkbox" data-pick="'+u.id+'" aria-label="\u67E5\u770B '+esc(u.name)+' \u7684\u8BE6\u60C5" '+(selected===u.id?'checked':'')+'></td><td><strong>'+esc(u.name)+'</strong><span class="muted">#'+u.id+'</span>'+planBadge(u.plan_id)+(u.email?'<div class="muted" style="font-size:12px;line-height:1.3;margin-top:2px">'+esc(u.email)+'</div>':'')+'<span class="mobile-expiry">'+fmt(u.expires_at)+'</span></td><td>'+badge(u)+'</td><td class="date-cell">'+fmt(u.expires_at)+'</td><td>'+Number(u.device_count||0)+'</td><td><div class="row-actions"><button class="link" data-open="'+u.id+'">\u7EED\u671F</button><button class="icon" title="\u66F4\u591A\u64CD\u4F5C" aria-label="'+esc(u.name)+' \u66F4\u591A\u64CD\u4F5C" aria-haspopup="menu" data-menu="'+u.id+'">'+I.MoreHorizontal+'</button></div></td></tr>').join('')||'<tr><td colspan="6" class="empty">\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u7528\u6237</td></tr>';
  $('#userCount').textContent='\u5171 '+list.length+' \u4F4D\u7528\u6237';$('#userPage').textContent=userPage+' / '+pages;$('#prevUsers').disabled=userPage===1;$('#nextUsers').disabled=userPage===pages;
}
function renderUpstreams(){$('#upRows').innerHTML=data.upstreams.map(u=>'<tr><td>'+esc(u.name)+'</td><td>'+u.node_count+'</td><td>'+fmt(u.last_synced_at)+'</td><td>'+(u.last_error?'<span class="danger">'+esc(u.last_error)+'</span>':'<span class="badge">\u6B63\u5E38</span>')+'</td><td><div class="row-actions"><button data-sync="'+u.id+'">'+I.RefreshCw+'\u540C\u6B65</button><button class="link danger" data-delete-upstream="'+u.id+'" data-upstream-name="'+esc(u.name)+'">\u5220\u9664</button></div></td></tr>').join('')||'<tr><td colspan="5" class="empty">\u6682\u65E0\u4E0A\u6E38\u8BA2\u9605</td></tr>'}
function renderPlans(){
  const nodesMap=new Map((data.availableNodes||[]).map(n=>[Number(n.id),n]));
  const defaultIds=['trial_1d','basic_monthly','advanced_monthly','residential_monthly'];
  $('#planRows').innerHTML=getPlans().map(p=>{
    const isEnabled=p.enabled!==false&&p.enabled!==0;
    const selIds=p.selectedNodeIds||[];
    const matchedNames=selIds.map(id=>nodesMap.get(Number(id))?.name).filter(Boolean);
    const nodeSummary=selIds.length?'<div><strong>\u5DF2\u6307\u5B9A '+selIds.length+' \u4E2A\u8282\u70B9</strong><p class="muted" style="margin:2px 0 0;font-size:12px">'+esc(matchedNames.slice(0,5).join(' / '))+(matchedNames.length>5?' \u7B49':'')+'</p></div>':'<span class="muted">\u672A\u6307\u5B9A\uFF08\u9ED8\u8BA4\u5168\u5C40\u6C60\uFF09</span>';
    const statusBadge=isEnabled?'<span class="badge active">\u25CF \u663E\u793A\u4E2D</span>':'<span class="badge disabled">\u25CB \u5DF2\u9690\u85CF</span>';
    const toggleBtn='<button class="link '+(isEnabled?'danger':'')+'" data-toggle-plan="'+esc(p.id)+'" data-enabled="'+(isEnabled?'0':'1')+'">'+(isEnabled?'\u4E0B\u67B6':'\u4E0A\u67B6')+'</button>';
    const isCustom=!defaultIds.includes(p.id);
    const deleteBtn=isCustom?'<button class="link danger" data-delete-plan="'+esc(p.id)+'" data-plan-name="'+esc(p.name)+'">\u5220\u9664</button>':'';
    return '<tr><td><strong>'+esc(p.name)+'</strong> <span class="muted">'+esc(p.id)+'</span></td><td>\xA5'+((p.amountCents||0)/100).toFixed(2)+' / '+(p.days||30)+' \u5929</td><td>'+(p.nodeLimit||10)+' \u4E2A</td><td>'+nodeSummary+'</td><td>'+statusBadge+'</td><td>'+Number(p.userCount||0)+' \u4F4D\u7528\u6237</td><td><div class="row-actions"><button class="primary" data-edit-plan="'+esc(p.id)+'">\u7F16\u8F91 / \u8282\u70B9</button>'+toggleBtn+deleteBtn+'</div></td></tr>';
  }).join('')||'<tr><td colspan="7" class="empty">\u6682\u65E0\u5957\u9910</td></tr>';
}
async function load(){data=await call('/api/dashboard');sessionStorage.setItem('adminKey',key);localStorage.removeItem('adminKey');$('#login').hidden=true;$('#app').hidden=false;renderUsers();renderUpstreams();renderPlans();$('#upCount').textContent=data.upstreams.length;$('#baseUrl').textContent=location.origin;if(view==='orders')await loadOrders();if(!initialSelection){initialSelection=true;if(innerWidth>=1120&&data.users.length)await openUser(data.users[0].id)}}
async function openUser(id){const ticket=++detailRequest;selected=id;days=30;detail=null;renderUsers();$('#workspace').classList.add('with-detail');$('#detail').hidden=false;$('#detail').innerHTML='<div class="aside-heading"><h2>\u7528\u6237\u8BE6\u60C5</h2><button class="icon" data-close title="\u5173\u95ED\u8BE6\u60C5" aria-label="\u5173\u95ED\u8BE6\u60C5">'+I.X+'</button></div><p class="muted">\u6B63\u5728\u52A0\u8F7D\u2026</p>';try{const result=await call('/api/users/'+id);if(ticket!==detailRequest)return;detail=result;renderDetail()}catch(e){if(ticket===detailRequest){closeDetail();throw e}}}
function closeDetail(){++detailRequest;selected=null;detail=null;$('#detail').hidden=true;$('#workspace').classList.remove('with-detail');renderUsers()}
function renderDetail(){
  const u=detail.user,p=detail.profile,summary=data.users.find(x=>x.id===u.id)||{},disabled=u.status==='disabled';
  $('#detail').innerHTML='<div class="aside-heading"><h2>\u7528\u6237\u8BE6\u60C5</h2><button class="icon" data-close title="\u5173\u95ED\u8BE6\u60C5" aria-label="\u5173\u95ED\u8BE6\u60C5">'+I.X+'</button></div>'+
  '<div class="identity"><div><h2>'+esc(u.name)+'</h2><p>#'+u.id+'</p></div>'+badge(u)+'</div>'+
  '<div class="facts"><div class="fact"><span>\u8D26\u53F7\u72B6\u6001</span><span class="badge '+(disabled?'disabled':'')+'">'+(disabled?'\u5DF2\u505C\u7528':'\u5DF2\u542F\u7528')+'</span></div>'+
  '<div class="fact"><span>\u8BA2\u9605\u72B6\u6001</span>'+badge(u)+'</div><div class="fact"><span>\u6240\u5C5E\u5957\u9910</span><span class="email-value"><span>'+esc(planName(u.plan_id))+'</span><button class="link" data-edit="'+u.id+'">\u5207\u6362</button></span></div><div class="fact"><span>\u5230\u671F\u65F6\u95F4</span><span>'+fmt(u.expires_at)+'</span></div>'+
  '<div class="fact"><span>\u90AE\u7BB1</span><span class="email-value"><span>'+esc(p.email||'\u672A\u586B\u5199')+'</span><button class="link" data-edit="'+u.id+'">\u7F16\u8F91</button></span></div>'+
  '<div class="fact"><span>\u8BBE\u5907 / \u4E0A\u9650</span><span class="email-value"><span>'+Number(summary.device_count??detail.devices.length)+' / '+(u.device_limit||2)+'</span><button class="link" id="viewDevices">\u67E5\u770B\u8BBE\u5907</button></span></div>'+
  '<div class="fact"><span>\u8BA2\u5355</span><span>'+Number(summary.order_count??detail.orders.length)+'</span></div>'+
  '<div class="fact"><span>DNS\u8BB0\u5F55</span><span class="email-value"><span>'+Number(u.dns_count||0)+' / '+Number(u.node_limit)+'</span><button class="link" id="manageDns">\u7BA1\u7406</button></span></div></div>'+
  '<section class="renew-section"><h3>\u7EED\u671F</h3><div class="segments">'+[1,7,30,0].map(n=>'<button data-days="'+n+'" class="'+(n===days?'active':'')+'">'+(n?n+'\u5929':'\u81EA\u5B9A\u4E49')+'</button>').join('')+'</div>'+
  '<label id="customDays" '+(days?'hidden':'')+'>\u7EED\u671F\u5929\u6570<input id="dayCount" type="number" value="30" min="1" max="3650" step="1"></label>'+
  '<p class="notice">'+I.Info+(disabled?'\u8D26\u53F7\u5DF2\u505C\u7528\uFF0C\u8BF7\u5148\u542F\u7528\u540E\u7EED\u671F':Date.parse(stamp(u.expires_at))<=now()?'\u5DF2\u5230\u671F\uFF0C\u6309\u5F53\u524D\u65F6\u95F4\u91CD\u65B0\u8BA1\u65F6':'\u4F7F\u7528\u4E2D\uFF0C\u4ECE\u539F\u5230\u671F\u65F6\u95F4\u987A\u5EF6')+'</p>'+
  '<div class="preview"><span>\u65B0\u5230\u671F\u65F6\u95F4</span><strong id="renewPreview"></strong></div><button class="primary wide" id="confirmRenew" '+(disabled?'disabled':'')+'>\u786E\u8BA4\u7EED\u671F</button><p class="muted">\u672C\u6B21\u4EC5\u5EF6\u957F\u6709\u6548\u671F\u3002</p></section>'+
  '<div class="section-end"><button class="link '+(disabled?'':'danger')+'" id="toggleStatus">'+I.Ban+(disabled?'\u542F\u7528\u8D26\u53F7':'\u505C\u7528\u8D26\u53F7')+'</button></div>'+
  '<details class="extra-details"><summary>\u8BBE\u5907\u3001\u8BA2\u5355\u4E0E\u8282\u70B9\u660E\u7EC6</summary><p class="muted">\u8282\u70B9\u989D\u5EA6\uFF1A'+Number(u.node_limit)+'</p><div class="detail-tabs">'+['devices','orders','dns'].map((v,i)=>'<button data-detail-tab="'+v+'" class="'+(detailTab===v?'primary':'')+'">'+['\u8BBE\u5907','\u8BA2\u5355','DNS'][i]+'</button>').join('')+'</div><div class="detail-list" id="detailItems"></div></details>';
  renderDetailItems();preview();
}
function renderDetailItems(){const rows=detailTab==='devices'?detail.devices:detailTab==='orders'?detail.orders:detail.dnsRecords;$('#detailItems').innerHTML=rows.map(r=>'<div class="detail-item">'+(detailTab==='devices'?'<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><strong>'+esc(r.model||r.platform||'\u672A\u77E5\u8BBE\u5907')+'</strong><p>\u8BBE\u5907 ID\uFF1A#'+esc(r.id)+' \xB7 '+esc(r.platform||'')+'</p><p class="muted">\u6700\u8FD1\u5728\u7EBF '+fmt(r.last_seen_at)+'</p></div><button class="link danger" data-kick-device="'+r.id+'">\u8E22\u4E0B\u7EBF</button></div>':detailTab==='orders'?'<strong>'+esc(r.order_no)+'</strong><p>'+esc(r.plan_id)+' \xB7 '+esc(orderStatus(r.status))+' \xB7 '+(r.amount_cents/100).toFixed(2)+' '+esc(r.currency)+'</p>':'<strong>'+esc(r.hostname)+'</strong><p>'+esc(r.node_name)+' \xB7 '+esc(r.status)+'</p>')+'</div>').join('')||'<p class="muted">\u6682\u65E0\u8BB0\u5F55</p>'}
function expiry(){const count=days||Number($('#dayCount')?.value);if(!Number.isInteger(count)||count<1||count>3650)throw new Error('\u7EED\u671F\u5929\u6570\u5FC5\u987B\u4E3A 1 \u5230 3650 \u7684\u6574\u6570');return new Date(Math.max(now(),Date.parse(stamp(detail.user.expires_at)))+count*86400000).toISOString()}
function preview(){try{$('#renewPreview').textContent=fmt(expiry())}catch{$('#renewPreview').textContent='\u8BF7\u8F93\u5165\u6709\u6548\u5929\u6570'}}
const orderStatus=s=>({paid:'\u5DF2\u652F\u4ED8',pending:'\u5F85\u652F\u4ED8',created:'\u5F85\u652F\u4ED8',cancelled:'\u5DF2\u53D6\u6D88',failed:'\u5931\u8D25',expired:'\u5DF2\u8FC7\u671F'}[s]||s);
async function loadOrders(){const d=await call('/api/admin/orders?page='+orderPage);$('#orderRows').innerHTML=d.orders.map(o=>'<tr><td>'+esc(o.order_no)+'</td><td>'+esc(o.user_name)+' <button class="link" data-order-user="'+o.user_id+'">#'+o.user_id+'</button></td><td>'+esc(o.plan_id)+'</td><td>'+(o.amount_cents/100).toFixed(2)+' '+esc(o.currency)+'</td><td>'+esc(orderStatus(o.status))+'</td><td class="date-cell">'+fmt(o.created_at)+'</td></tr>').join('')||'<tr><td colspan="6" class="empty">\u6682\u65E0\u8BA2\u5355</td></tr>';$('#orderPage').textContent='\u7B2C '+orderPage+' \u9875';$('#prevOrders').disabled=orderPage===1;$('#nextOrders').disabled=!d.hasMore}
async function setView(next){view=next;closeDetail();document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));['users','plans','upstreams','orders','settings'].forEach(v=>$('#'+v+'View').hidden=v!==view);const titles={users:['\u7528\u6237\u7BA1\u7406','\u7BA1\u7406\u7528\u6237\u3001\u6709\u6548\u671F\u4E0E\u5206\u4EAB\u6743\u9650'],plans:['\u5957\u9910\u7BA1\u7406','\u7EDF\u4E00\u7BA1\u7406\u5957\u9910\u53C2\u6570\u3001\u5BA2\u6237\u7AEF\u4E0A\u67B6\u663E\u793A\u4E0E\u4E13\u5C5E\u8282\u70B9\u6C60'],upstreams:['\u4E0A\u6E38\u8BA2\u9605','\u8BA2\u9605\u6765\u6E90\u4E0E\u8282\u70B9\u540C\u6B65'],orders:['\u8BA2\u5355\u8BB0\u5F55','\u652F\u4ED8\u8BA2\u5355\u4E0E\u4F1A\u5458\u5957\u9910'],settings:['\u7CFB\u7EDF\u8BBE\u7F6E','\u5F53\u524D\u670D\u52A1\u4E0E\u7BA1\u7406\u5458\u4F1A\u8BDD']};$('#pageTitle').textContent=titles[view][0];$('#pageSubtitle').textContent=titles[view][1];$('#newButton').hidden=!['users','upstreams','plans'].includes(view);$('#newButton span').textContent=view==='upstreams'?'\u6DFB\u52A0\u4E0A\u6E38':(view==='plans'?'\u65B0\u5EFA\u5957\u9910':'\u65B0\u5EFA\u7528\u6237');if(view==='orders')await loadOrders()}
function field(label,name,value='',type='text',required=false){return '<label>'+label+'<input name="'+name+'" type="'+type+'" value="'+esc(value)+'" '+(required?'required':'')+'></label>'}
function showEditor(mode){editorMode=mode;$('#formError').hidden=true;$('#createdLink').hidden=true;$('#editorForm').hidden=false;$('#editorTitle').textContent=mode==='user'?'\u65B0\u5EFA\u7528\u6237':mode==='upstream'?'\u6DFB\u52A0\u4E0A\u6E38':'\u7F16\u8F91\u7528\u6237';let html='';if(mode==='user'){html=field('\u7528\u6237\u540D','name','','text',true)+'<label>\u6240\u5C5E\u5957\u9910<select name="planId" required>'+getPlans().map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>').join('')+'</select></label><label>\u4E0A\u6E38<select name="upstreamId" required>'+data.upstreams.map(u=>'<option value="'+u.id+'">'+esc(u.name)+'</option>').join('')+'</select></label>'+field('\u6709\u6548\u671F\u81F3\uFF08\u672C\u5730\u65F6\u95F4\uFF09','expiresAt','','datetime-local',true)+'<label>\u8282\u70B9\u989D\u5EA6<input name="nodeLimit" type="number" min="1" max="20" value="5" required></label><label>\u8BBE\u5907\u6570\u91CF\u4E0A\u9650<input name="deviceLimit" type="number" min="1" max="50" value="2" required></label>'}else if(mode==='upstream'){html=field('\u540D\u79F0','name','','text',true)+'<label class="full">\u8BA2\u9605\u5730\u5740 \u6216 \u8282\u70B9\u94FE\u63A5 (vless / trojan / vmess / ss)<textarea name="subscriptionUrl" rows="4" placeholder="\u652F\u6301\u8F93\u5165 HTTPS \u8BA2\u9605\u5730\u5740\uFF0C\u6216\u7C98\u8D34\u8282\u70B9\u94FE\u63A5 (vless/trojan/vmess/ss\uFF0C\u652F\u6301 Base64)" required style="margin-top:7px;width:100%"></textarea></label>'}else{const u=detail.user,p=detail.profile,curPlan=normPlan(u.plan_id);html=field('\u7528\u6237\u540D','name',u.name,'text',true)+'<label>\u6240\u5C5E\u5957\u9910<select name="planId">'+getPlans().map(pl=>'<option value="'+esc(pl.id)+'" '+(pl.id===curPlan?'selected':'')+'>'+esc(pl.name)+'</option>').join('')+'</select></label>'+field('\u90AE\u7BB1','email',p.email||'','email')+field('\u624B\u673A\u53F7','phone',p.phone||'')+field('\u6635\u79F0','nickname',p.nickname||'')+'<label>\u8BBE\u5907\u6570\u91CF\u4E0A\u9650<input name="deviceLimit" type="number" min="1" max="50" step="1" value="'+(u.device_limit||2)+'" required></label><label class="full">\u5907\u6CE8<textarea name="remark" rows="3">'+esc(p.remark||'')+'</textarea></label>'}$('#editorFields').innerHTML=html;$('#editor').showModal()}
async function saveEditor(e){e.preventDefault();if(busy)return;busy=true;$('#saveEditor').disabled=true;try{const f=Object.fromEntries(new FormData(e.target));if(editorMode==='user'){const d=await call('/api/users',{method:'POST',body:JSON.stringify({...f,upstreamId:Number(f.upstreamId),nodeLimit:Number(f.nodeLimit),deviceLimit:Number(f.deviceLimit||2),expiresAt:new Date(f.expiresAt).toISOString()})});await load();$('#editorForm').hidden=true;$('#createdLink').hidden=false;$('#createdLink').textContent='\u8BA2\u9605\u5730\u5740\uFF08\u4EC5\u663E\u793A\u672C\u6B21\uFF09\uFF1A'+d.subscriptionUrl}else if(editorMode==='upstream'){const raw=f.subscriptionUrl.trim();if(!raw)throw new Error('\u8BF7\u8F93\u5165\u8BA2\u9605\u5730\u5740\u6216\u8282\u70B9\u94FE\u63A5');const isHttp=raw.startsWith('http://')||raw.startsWith('https://'),isNode=['vless://','vmess://','trojan://','ss://','hysteria2://','hy2://','tuic://','anytls://'].some(p=>raw.includes(p));if(!isHttp&&!isNode&&raw.length<20)throw new Error('\u8BF7\u8F93\u5165\u6709\u6548\u7684 HTTPS \u8BA2\u9605\u5730\u5740\uFF0C\u6216\u7C98\u8D34\u4EE5 vless/vmess/trojan/ss \u5F00\u5934\u7684\u8282\u70B9\u94FE\u63A5');const res=await call('/api/upstreams',{method:'POST',body:JSON.stringify({name:f.name.trim(),subscriptionUrl:raw})});await load();$('#editor').close();if(res.importedNodes){notify('\u5DF2\u76F4\u63A5\u5F55\u5165 '+res.importedNodes+' \u4E2A\u8282\u70B9');return}}else{const id=selected;await call('/api/users/'+id,{method:'PATCH',body:JSON.stringify({name:f.name,planId:f.planId,deviceLimit:Number(f.deviceLimit||2),profile:{email:f.email,phone:f.phone,nickname:f.nickname,remark:f.remark}})});await load();await openUser(id);$('#editor').close()}notify('\u4FDD\u5B58\u6210\u529F')}catch(err){$('#formError').textContent=err.message;$('#formError').hidden=false}finally{busy=false;$('#saveEditor').disabled=false}}
function showDnsEditor(){
  $('#dnsUser').textContent=detail.user.name+' (#'+detail.user.id+')';
  $('#dnsCounts').textContent=Number(detail.user.dns_count||0)+' / '+detail.user.node_limit;
  const curPlan=normPlan(detail.user.plan_id);$('#dnsPlanId').innerHTML=getPlans().map(p=>'<option value="'+esc(p.id)+'" '+(p.id===curPlan?'selected':'')+'>'+esc(p.name)+'</option>').join('');$('#dnsLimit').value=detail.user.node_limit;$('#dnsResult').hidden=true;
  const inactive=detail.user.status!=='active'||Date.parse(stamp(detail.user.expires_at))<=now();
  $('#dnsError').hidden=!inactive;$('#dnsError').textContent=inactive?'\u8D26\u53F7\u5DF2\u5230\u671F\u6216\u505C\u7528\uFF0C\u8BF7\u5148\u7EED\u671F\u6216\u542F\u7528\u8D26\u53F7\u3002':'';
  $('#saveDns').disabled=inactive;$('#fillDns').disabled=inactive;$('#dnsLimit').disabled=inactive;
  const sel=detail.selectedNodeIds||[],nodes=detail.availableNodes||[];
  if(!nodes.length){
    $('#dnsNodeList').innerHTML='<span class="muted">\u6682\u65E0\u53EF\u5206\u914D\u8282\u70B9</span>';
  }else{
    $('#dnsNodeList').innerHTML=nodes.map(n=>{
      const chk=sel.includes(n.id)?'checked':'';
      return '<label style="display:flex;align-items:center;gap:8px;padding:3px 0;cursor:pointer"><input type="checkbox" value="'+n.id+'" '+chk+'><span><strong>'+esc(n.name)+'</strong> <small class="muted">('+esc(n.protocol)+' \xB7 '+esc(n.upstream_name||'\u4E0A\u6E38#'+n.upstream_id)+')</small></span></label>';
    }).join('');
  }
  $('#dnsEditor').showModal();
}
async function manageDns(save){
  if(busy)return;busy=true;$('#saveDns').disabled=true;$('#fillDns').disabled=true;
  $('#dnsError').hidden=true;$('#dnsResult').hidden=true;
  try{
    const id=selected,nodeLimit=Number($('#dnsLimit').value),current=detail.user.node_limit;
    if(save&&(!Number.isInteger(nodeLimit)||nodeLimit<1||nodeLimit>20))throw new Error('\u8282\u70B9\u6570\u91CF\u5FC5\u987B\u4E3A 1 \u5230 20 \u7684\u6574\u6570');
    if(save&&nodeLimit<current&&!await askConfirmation('\u8282\u70B9\u989D\u5EA6\u5C06\u4ECE '+current+' \u964D\u4E3A '+nodeLimit+'\uFF1B\u8D85\u51FA\u65B0\u989D\u5EA6\u7684 DNS \u5C06\u5220\u9664\u3002\u786E\u8BA4\u8C03\u6574\uFF1F'))return;
    const planId=$('#dnsPlanId').value;const selectedNodeIds=Array.from(document.querySelectorAll('#dnsNodeList input[type="checkbox"]:checked')).map(cb=>Number(cb.value));const result=await call('/api/users/'+id+'/dns',{method:'POST',body:JSON.stringify(save?{nodeLimit,planId,selectedNodeIds}:{planId,selectedNodeIds})});
    $('#dnsResult').textContent='\u6709\u6548 DNS '+result.activeDnsCount+' / '+result.nodeLimit+'\uFF1B\u65B0\u589E '+result.created+'\uFF0C\u5220\u9664 '+result.removed+'\uFF0C\u5931\u8D25 '+result.failed+'\u3002'+(result.warning||'');
    $('#dnsResult').className=result.ok?'dns-result':'dns-result error';$('#dnsResult').hidden=false;
    $('#dnsCounts').textContent=result.activeDnsCount+' / '+result.nodeLimit;$('#dnsLimit').value=result.nodeLimit;
    await load();await openUser(id);
  }catch(e){$('#dnsError').textContent=e.message;$('#dnsError').hidden=false}
  finally{busy=false;const inactive=detail?.user.status!=='active'||!(Date.parse(stamp(detail?.user.expires_at))>now());$('#saveDns').disabled=inactive;$('#fillDns').disabled=inactive}
}
$('#closeDns').onclick=()=>{if(!busy)$('#dnsEditor').close()};
function openPlanEditor(planId){
  const isNew=!planId;
  const p=isNew?{id:'',name:'',amountCents:0,days:30,nodeLimit:10,enabled:true,selectedNodeIds:[]}:getPlans().find(x=>x.id===planId);
  if(!p)return;
  $('#planEditorTitle').textContent=isNew?'\u65B0\u5EFA\u5957\u9910':'\u5957\u9910\u8282\u70B9\u4E0E\u53C2\u6570\u8BBE\u7F6E';
  const idInput=$('#planEditId');
  idInput.value=p.id||'';
  idInput.readOnly=!isNew;
  $('#planEditName').value=p.name||'';
  $('#planEditPrice').value=((p.amountCents||0)/100).toFixed(2);
  $('#planEditDays').value=p.days||30;
  $('#planEditNodeLimit').value=p.nodeLimit||10;
  $('#planEditEnabled').checked=p.enabled!==false&&p.enabled!==0;
  $('#planSyncUsersWrap').hidden=isNew;
  $('#planSyncUsers').checked=!isNew;
  $('#planError').hidden=true;
  const sel=p.selectedNodeIds||[],nodes=data.availableNodes||[];
  if(!nodes.length){
    $('#planNodeList').innerHTML='<span class="muted">\u6682\u65E0\u53EF\u5206\u914D\u8282\u70B9\uFF0C\u8BF7\u5148\u5728\u300C\u4E0A\u6E38\u8BA2\u9605\u300D\u4E2D\u5BFC\u5165\u8282\u70B9</span>';
  }else{
    $('#planNodeList').innerHTML=nodes.map(n=>{
      const chk=sel.includes(Number(n.id))?'checked':'';
      return '<label style="display:flex;align-items:center;gap:8px;padding:3px 0;cursor:pointer"><input type="checkbox" value="'+n.id+'" '+chk+'><span><strong>'+esc(n.name)+'</strong> <small class="muted">('+esc(n.protocol)+' \xB7 '+esc(n.upstream_name)+')</small></span></label>';
    }).join('');
  }
  $('#planEditor').showModal();
}
$('#plansView').addEventListener('click',async e=>{
  const editBtn=e.target.closest('[data-edit-plan]');
  if(editBtn&&!busy){openPlanEditor(editBtn.dataset.editPlan);return;}
  const toggleBtn=e.target.closest('[data-toggle-plan]');
  if(toggleBtn&&!busy){
    const pid=toggleBtn.dataset.togglePlan;
    const targetEnabled=toggleBtn.dataset.enabled==='1';
    action(async()=>{
      await call('/api/plans/'+pid,{method:'POST',body:JSON.stringify({enabled:targetEnabled,syncUsers:false})});
      await load();
      notify('\u5957\u9910\u5DF2'+(targetEnabled?'\u4E0A\u67B6\u5E76\u5728\u5BA2\u6237\u7AEF\u663E\u793A':'\u4E0B\u67B6\u5E76\u5728\u5BA2\u6237\u7AEF\u9690\u85CF'));
    },toggleBtn);
    return;
  }
  const delBtn=e.target.closest('[data-delete-plan]');
  if(delBtn&&!busy){
    const pid=delBtn.dataset.deletePlan;
    const pname=delBtn.dataset.planName||pid;
    if(!await askConfirmation('\u786E\u8BA4\u8981\u5220\u9664\u5957\u9910\u300C'+pname+'\u300D\u5417\uFF1F\u8BE5\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002'))return;
    action(async()=>{
      await call('/api/plans/'+pid,{method:'DELETE'});
      await load();
      notify('\u5957\u9910\u300C'+pname+'\u300D\u5DF2\u6210\u529F\u5220\u9664');
    },delBtn);
    return;
  }
});
$('#closePlanEditor').onclick=()=>{if(!busy)$('#planEditor').close()};
$('#cancelPlanEditor').onclick=()=>{if(!busy)$('#planEditor').close()};
$('#planSelectAll').onclick=()=>document.querySelectorAll('#planNodeList input[type="checkbox"]').forEach(cb=>cb.checked=true);
$('#planClearAll').onclick=()=>document.querySelectorAll('#planNodeList input[type="checkbox"]').forEach(cb=>cb.checked=false);
$('#planForm').onsubmit=async e=>{
  e.preventDefault();if(busy)return;busy=true;$('#savePlanBtn').disabled=true;$('#planError').hidden=true;
  try{
    const planId=$('#planEditId').value.trim();
    if(!planId)throw new Error('\u8BF7\u8F93\u5165\u5957\u9910\u6807\u8BC6 ID');
    const name=$('#planEditName').value.trim();
    if(!name)throw new Error('\u8BF7\u8F93\u5165\u5957\u9910\u540D\u79F0');
    const amountCents=Math.round(Number($('#planEditPrice').value||0)*100);
    const days=Number($('#planEditDays').value||30);
    const nodeLimit=Number($('#planEditNodeLimit').value||10);
    const enabled=$('#planEditEnabled').checked;
    const syncUsers=$('#planSyncUsers').checked;
    const selectedNodeIds=Array.from(document.querySelectorAll('#planNodeList input[type="checkbox"]:checked')).map(cb=>Number(cb.value));
    const res=await call('/api/plans/'+planId,{method:'POST',body:JSON.stringify({name,amountCents,days,nodeLimit,enabled,selectedNodeIds,syncUsers})});
    let totalSynced=Number(res.syncedUsers||0);
    if(Array.isArray(res.pendingUserIds)&&res.pendingUserIds.length){
      for(const uid of res.pendingUserIds){
        try{await call('/api/users/'+uid+'/dns',{method:'POST',body:JSON.stringify({})});totalSynced++;}catch{}
      }
    }
    await load();
    $('#planEditor').close();
    notify('\u5957\u9910\u300C'+name+'\u300D\u5DF2\u4FDD\u5B58\uFF08\u5DF2\u6307\u5B9A '+selectedNodeIds.length+' \u4E2A\u8282\u70B9'+(syncUsers?'\uFF0C\u540C\u6B65\u66F4\u65B0 '+totalSynced+' \u4F4D\u7528\u6237':'')+'\uFF09');
  }catch(err){
    $('#planError').textContent=err.message;$('#planError').hidden=false;
  }finally{
    busy=false;$('#savePlanBtn').disabled=false;
  }
};

$('#dnsEditor').oncancel=e=>{if(busy)e.preventDefault()};
$('#dnsForm').onsubmit=e=>{e.preventDefault();manageDns(true)};$('#fillDns').onclick=()=>manageDns(false);
$('#detail').addEventListener('click',e=>{if(e.target.closest('#manageDns')&&!busy)showDnsEditor()});
$('#detail').addEventListener('click',async e=>{
  const kickBtn=e.target.closest('[data-kick-device]');
  if(kickBtn&&!busy){
    const devId=kickBtn.dataset.kickDevice;
    if(!await askConfirmation('\u786E\u8BA4\u8981\u5C06\u8BE5\u8BBE\u5907\u8E22\u4E0B\u7EBF\u5417\uFF1F\u8BE5\u8BBE\u5907\u5C06\u9000\u51FA\u767B\u5F55\u5E76\u89E3\u9664\u7ED1\u5B9A\u3002'))return;
    action(async()=>{
      await call('/api/users/'+selected+'/devices/'+devId+'/kick',{method:'POST'});
      await load();
      await openUser(selected);
      notify('\u8BBE\u5907\u5DF2\u8E22\u4E0B\u7EBF');
    },kickBtn);
    return;
  }
  if(!e.target.closest('#viewDevices')||busy)return;
  detailTab='devices';
  const records=$('#detail .extra-details');records.open=true;
  records.querySelectorAll('[data-detail-tab]').forEach(b=>b.classList.toggle('primary',b.dataset.detailTab===detailTab));
  renderDetailItems();
  records.scrollIntoView?.({block:'nearest'});
});
async function action(fn,button){if(busy)return;busy=true;if(button)button.disabled=true;try{await fn()}catch(e){notify(e.message,true)}finally{busy=false;if(button?.isConnected)button.disabled=false}}
function askConfirmation(text){return new Promise(resolve=>{const dialog=$('#confirmation');$('#confirmationText').textContent=text;const finish=accepted=>{dialog.oncancel=null;$('#confirmationCancel').onclick=null;$('#confirmationAccept').onclick=null;dialog.close();resolve(accepted)};dialog.oncancel=e=>{e.preventDefault();finish(false)};$('#confirmationCancel').onclick=()=>finish(false);$('#confirmationAccept').onclick=()=>finish(true);dialog.showModal()})}
$('#rowMenu').onclick=e=>{const item=e.target.closest('[data-menu-action]');if(!item)return;$('#rowMenu').hidden=true;action(async()=>{await openUser(menuUser);if(item.dataset.menuAction==='edit')showEditor('edit');if(item.dataset.menuAction==='dns')showDnsEditor()})};
document.addEventListener('click',e=>{if(!e.target.closest('#rowMenu')&&!e.target.closest('[data-menu]'))$('#rowMenu').hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#rowMenu').hidden=true});
function logout(){key='';sessionStorage.removeItem('adminKey');localStorage.removeItem('adminKey');location.reload()}
$('#login').onsubmit=e=>{e.preventDefault();key=$('#secret').value.trim();action(async()=>{try{await load();$('#secret').value='';$('#loginError').hidden=true}catch(err){$('#loginError').textContent=err.message;$('#loginError').hidden=false}},e.submitter)};
$('#logout').onclick=logout;$('#settingsLogout').onclick=logout;$('#refresh').onclick=e=>action(async()=>{const id=selected;await load();if(id)await openUser(id);notify('\u5DF2\u5237\u65B0')},e.currentTarget);
$('#search').oninput=()=>{userPage=1;renderUsers()};$('#filters').onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;userPage=1;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderUsers()};
document.querySelector('nav').onclick=e=>{const b=e.target.closest('[data-view]');if(b)action(()=>setView(b.dataset.view),b)};
$('#userRows').onclick=e=>{const more=e.target.closest('[data-menu]'),row=e.target.closest('[data-user]');if(!row||busy)return;if(more){menuUser=Number(more.dataset.menu);const rect=more.getBoundingClientRect(),menu=$('#rowMenu');menu.style.left=Math.max(8,Math.min(rect.right-140,innerWidth-152))+'px';menu.style.top=Math.min(rect.bottom+5,innerHeight-108)+'px';menu.hidden=false;return}if(e.target.matches('[data-pick]')&&selected===Number(row.dataset.user)){closeDetail();return}action(()=>openUser(Number(row.dataset.user)))};$('#userRows').onkeydown=e=>{if(e.target.matches('tr')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();action(()=>openUser(Number(e.target.dataset.user)))}};
$('#prevUsers').onclick=()=>{userPage--;renderUsers()};$('#nextUsers').onclick=()=>{userPage++;renderUsers()};$('#prevOrders').onclick=e=>action(async()=>{orderPage--;await loadOrders()},e.currentTarget);$('#nextOrders').onclick=e=>action(async()=>{orderPage++;await loadOrders()},e.currentTarget);
$('#orderRows').onclick=e=>{const b=e.target.closest('[data-order-user]');if(b)action(async()=>{await setView('users');await openUser(Number(b.dataset.orderUser))})};
$('#upRows').onclick=async e=>{const del=e.target.closest('[data-delete-upstream]');if(del&&!busy){const id=del.dataset.deleteUpstream,name=del.dataset.upstreamName||'';if(!await askConfirmation('\u786E\u8BA4\u8981\u5220\u9664\u4E0A\u6E38\u300C'+name+'\u300D\u5417\uFF1F\u5220\u9664\u540E\u8BE5\u4E0A\u6E38\u4E0B\u7684\u8282\u70B9\u53CA\u5173\u8054 DNS \u5C06\u88AB\u6E05\u7406\u3002'))return;action(async()=>{const res=await call('/api/upstreams/'+id,{method:'DELETE'});if(Array.isArray(res.pendingUserIds)){for(const uid of res.pendingUserIds){try{await call('/api/users/'+uid+'/dns',{method:'POST',body:JSON.stringify({})})}catch{}}}await load();notify('\u4E0A\u6E38\u300C'+name+'\u300D\u5DF2\u5220\u9664\u5E76\u8865\u9F50\u7528\u6237 DNS')},del);return}const b=e.target.closest('[data-sync]');if(b)action(async()=>{const d=await call('/api/upstreams/'+b.dataset.sync+'/sync',{method:'POST'});await load();notify('\u540C\u6B65\u5B8C\u6210\uFF1A'+d.found+' \u4E2A\u8282\u70B9')},b)};
$('#newButton').onclick=()=>{if(view==='plans')openPlanEditor(null);else showEditor(view==='upstreams'?'upstream':'user')};$('#closeEditor').onclick=()=>$('#editor').close();$('#cancelEditor').onclick=()=>$('#editor').close();$('#editorForm').onsubmit=saveEditor;
$('#detail').oninput=e=>{if(e.target.id==='dayCount')preview()};$('#detail').onclick=e=>{const b=e.target.closest('button');if(!b||busy)return;if(b.hasAttribute('data-close'))return closeDetail();if(b.dataset.edit)return showEditor('edit');if(b.hasAttribute('data-days')){days=Number(b.dataset.days);renderDetail();return}if(b.dataset.detailTab){detailTab=b.dataset.detailTab;document.querySelectorAll('[data-detail-tab]').forEach(x=>x.classList.toggle('primary',x===b));renderDetailItems();return}if(b.id==='confirmRenew'){const id=selected;action(async()=>{const expiresAt=expiry();if(!await askConfirmation('\u786E\u8BA4\u7EED\u671F\u81F3 '+fmt(expiresAt)+'\uFF1F\u8282\u70B9\u989D\u5EA6\u4FDD\u6301\u4E0D\u53D8\u3002'))return;const result=await call('/api/users/'+id+'/renew',{method:'POST',body:JSON.stringify({expiresAt})});await load();await openUser(id);notify(result.failed?'\u6709\u6548\u671F\u5DF2\u66F4\u65B0\uFF0C\u4F46\u90E8\u5206 DNS \u914D\u7F6E\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5': '\u7EED\u671F\u6210\u529F',Boolean(result.failed))},b)}if(b.id==='toggleStatus'){const id=selected,disabled=detail.user.status==='disabled';action(async()=>{if(!await askConfirmation(disabled?'\u786E\u8BA4\u542F\u7528\u8BE5\u8D26\u53F7\uFF1F':'\u786E\u8BA4\u505C\u7528\u8D26\u53F7\u5E76\u79FB\u9664\u5176 DNS\uFF1F'))return;if(disabled)await call('/api/users/'+id,{method:'PATCH',body:JSON.stringify({status:'active'})});else await call('/api/users/'+id+'/disable',{method:'POST'});await load();await openUser(id);notify(disabled?'\u8D26\u53F7\u5DF2\u542F\u7528':'\u8D26\u53F7\u5DF2\u505C\u7528')},b)}};
function clock(){$('#clock').textContent=fmt(new Date().toISOString())+'\uFF08\u4E0A\u6D77\uFF09'}clock();setInterval(clock,30000);setInterval(()=>{if(!$('#app').hidden){renderUsers();if(detail)preview()}},60000);if(key)action(load);
<\/script></body></html>`])), admin_styles_default, icons.Layers, icons.Users, icons.Layers, icons.Receipt, icons.Settings, icons.RefreshCw, icons.LogOut, icons.Plus, icons.Search, icons.LogOut, icons.X, icons.X, JSON.stringify(icons));
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
var encoder = new TextEncoder();
function b64decode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  return decodeURIComponent(Array.from(atob(padded), (c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""));
}
__name(b64decode, "b64decode");
__name2(b64decode, "b64decode");
__name22(b64decode, "b64decode");
function b64encode(value) {
  const bytes = encoder.encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
__name(b64encode, "b64encode");
__name2(b64encode, "b64encode");
__name22(b64encode, "b64encode");
async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256, "sha256");
__name2(sha256, "sha256");
__name22(sha256, "sha256");
var INFO_NODE_NAME_REGEX = /(\u5269\u4F59\u6D41\u91CF|\u8DDD\u79BB\u4E0B\u6B21\u91CD\u7F6E|\u5957\u9910\u5230\u671F|\u5BFC\u822A\u9875|\u5B98\u7F51\u5730\u5740|\u6700\u65B0\u5B98\u7F51|\u9632\u6B62\u5931\u8054|\u8FC7\u671F\u65F6\u95F4|\u6D41\u91CF\u5269\u4F59)/i;
function subscriptionText(input) {
  const trimmed = input.trim();
  if (/^(vless|vmess|trojan|ss|hysteria2|hy2|tuic|anytls):\/\//m.test(trimmed)) return trimmed;
  try {
    const decoded = b64decode(trimmed);
    return /^(vless|vmess|trojan|ss|hysteria2|hy2|tuic|anytls):\/\//m.test(decoded) ? decoded : trimmed;
  } catch {
    return trimmed;
  }
}
__name(subscriptionText, "subscriptionText");
__name2(subscriptionText, "subscriptionText");
__name22(subscriptionText, "subscriptionText");
function displayName(uri, fallback) {
  const fragment = uri.split("#", 2)[1];
  if (!fragment) return fallback;
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}
__name(displayName, "displayName");
__name2(displayName, "displayName");
__name22(displayName, "displayName");
async function parseSubscription(input) {
  const lines = subscriptionText(input).split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const result = [];
  for (const originalUri of lines) {
    try {
      if (originalUri.startsWith("vmess://")) {
        const json2 = JSON.parse(b64decode(originalUri.slice(8)));
        const server2 = String(json2.add ?? "");
        if (!server2) continue;
        const name2 = String(json2.ps ?? server2);
        if (INFO_NODE_NAME_REGEX.test(name2)) continue;
        const stable2 = `vmess|${server2}|${String(json2.port ?? "")}|${String(json2.id ?? "")}|${String(json2.path ?? "")}|${String(json2.host ?? "")}`;
        result.push({ fingerprint: (await sha256(stable2)).slice(0, 24), name: name2, protocol: "vmess", server: server2, originalUri });
        continue;
      }
      const protocol = originalUri.split(":", 1)[0].toLowerCase();
      if (!["vless", "trojan", "ss", "hysteria2", "hy2", "tuic", "anytls"].includes(protocol)) continue;
      const url = new URL(originalUri);
      const server = url.hostname;
      if (!server) continue;
      const name = displayName(originalUri, server);
      if (INFO_NODE_NAME_REGEX.test(name)) continue;
      const stable = `${protocol}|${server}|${url.port}|${url.username}|${url.search}`;
      result.push({ fingerprint: (await sha256(stable)).slice(0, 24), name, protocol, server, originalUri });
    } catch {
    }
  }
  return result;
}
__name(parseSubscription, "parseSubscription");
__name2(parseSubscription, "parseSubscription");
__name22(parseSubscription, "parseSubscription");
function connectionIdentity(originalUri, protocol) {
  if (protocol === "vmess") {
    const json2 = JSON.parse(b64decode(originalUri.slice(8)));
    delete json2.ps;
    const normalized = Object.fromEntries(Object.entries(json2).sort(([left], [right]) => left.localeCompare(right)));
    return `vmess|${JSON.stringify(normalized)}`;
  }
  const url = new URL(originalUri);
  url.hash = "";
  return `${protocol}|${url.toString()}`;
}
__name(connectionIdentity, "connectionIdentity");
__name2(connectionIdentity, "connectionIdentity");
__name22(connectionIdentity, "connectionIdentity");
function rewriteNode(originalUri, protocol, hostname, name) {
  if (protocol === "vmess") {
    const json2 = JSON.parse(b64decode(originalUri.slice(8)));
    const origHost = String(json2.add ?? "");
    if (origHost && dnsType(origHost) === "CNAME" && !json2.sni && !json2.host) {
      json2.sni = origHost;
    }
    json2.add = hostname;
    if (name) json2.ps = name;
    return `vmess://${b64encode(JSON.stringify(json2))}`;
  }
  const url = new URL(originalUri);
  const origHost = url.hostname;
  if (
    origHost &&
    dnsType(origHost) === "CNAME" &&
    ["vless", "trojan", "hysteria2", "hy2", "tuic", "anytls"].includes(String(protocol || "").toLowerCase()) &&
    !url.searchParams.get("sni") &&
    !url.searchParams.get("servername") &&
    !url.searchParams.get("peer")
  ) {
    url.searchParams.set("sni", origHost);
  }
  url.hostname = hostname;
  if (name) url.hash = name;
  return url.toString();
}
__name(rewriteNode, "rewriteNode");
__name2(rewriteNode, "rewriteNode");
__name22(rewriteNode, "rewriteNode");
function encodeSubscription(lines) {
  return b64encode(lines.join("\n"));
}
__name(encodeSubscription, "encodeSubscription");
__name2(encodeSubscription, "encodeSubscription");
__name22(encodeSubscription, "encodeSubscription");
function dnsType(server) {
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(server)) return "A";
  if (server.includes(":")) return "AAAA";
  return "CNAME";
}
__name(dnsType, "dnsType");
__name2(dnsType, "dnsType");
__name22(dnsType, "dnsType");
var jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
var encoder2 = new TextEncoder();
var appPlans = [
  { id: "trial_1d", name: "\u4F53\u9A8C", amountCents: 100, currency: "CNY", days: 1, nodeLimit: 5, trafficGb: 5, sortOrder: 1 },
  { id: "basic_monthly", name: "\u57FA\u7840", amountCents: 1990, currency: "CNY", days: 30, nodeLimit: 10, trafficGb: 100, sortOrder: 2 },
  { id: "advanced_monthly", name: "\u9AD8\u7EA7", amountCents: 2990, currency: "CNY", days: 30, nodeLimit: 15, trafficGb: 300, sortOrder: 3 },
  { id: "residential_monthly", name: "\u5BB6\u5BBD", amountCents: 5990, currency: "CNY", days: 30, nodeLimit: 20, trafficGb: 500, sortOrder: 4 }
];
function normalizePlanId(planId) {
  const id = String(planId || "").trim();
  if (!id) return "trial_1d";
  if (id === "standard_monthly" || id === "standard_quarterly" || id === "standard_yearly") return "advanced_monthly";
  return id;
}
__name(normalizePlanId, "normalizePlanId");
async function loadAppPlans(env, includeDisabled = false) {
  try {
    const query = includeDisabled
      ? "SELECT id,name,amount_cents,currency,days,node_limit,traffic_gb,sort_order,enabled FROM app_plans ORDER BY sort_order ASC,id ASC"
      : "SELECT id,name,amount_cents,currency,days,node_limit,traffic_gb,sort_order,enabled FROM app_plans WHERE enabled=1 ORDER BY sort_order ASC,id ASC";
    const rows = await env.DB.prepare(query).all();
    if (rows?.results?.length) {
      return rows.results.map((r) => ({
        id: r.id,
        name: r.name,
        amountCents: Number(r.amount_cents),
        currency: r.currency || "CNY",
        days: Number(r.days),
        nodeLimit: Number(r.node_limit),
        trafficGb: Number(r.traffic_gb),
        sortOrder: Number(r.sort_order || 0),
        enabled: Boolean(r.enabled)
      }));
    }
  } catch {}
  return appPlans.map((p) => ({ ...p, enabled: true }));
}
__name(loadAppPlans, "loadAppPlans");
var defaultAppUpdate = {
  versionCode: 730,
  versionName: "1.14.0",
  apkUrl: "",
  releaseUrl: "https://www.wlbpg.com",
  title: "\u53D1\u73B0\u65B0\u7248\u672C",
  message: "",
  force: false,
  sha256: ""
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}
__name(json, "json");
__name2(json, "json");
__name22(json, "json");
async function body(request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 1e6) throw new Error("\u8BF7\u6C42\u5185\u5BB9\u8FC7\u5927");
  return request.json();
}
__name(body, "body");
__name2(body, "body");
__name22(body, "body");
async function hash(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder2.encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hash, "hash");
__name2(hash, "hash");
__name22(hash, "hash");
function utcDay(value = /* @__PURE__ */ new Date()) {
  return value.toISOString().slice(0, 10);
}
__name(utcDay, "utcDay");
__name2(utcDay, "utcDay");
__name22(utcDay, "utcDay");
function deviceKind(userAgent) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "\u5176\u4ED6";
}
__name(deviceKind, "deviceKind");
__name2(deviceKind, "deviceKind");
__name22(deviceKind, "deviceKind");
async function recordSubscriptionAccess(request, env, userId) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const userAgent = request.headers.get("User-Agent") ?? "";
  const day = utcDay();
  const salt = env.ACCESS_LOG_SALT || `${env.ADMIN_SECRET}|subscription-access`;
  const fingerprint = await hash(`${salt}|${day}|${ip}|${userAgent}`);
  const country = request.cf?.country ? String(request.cf.country).slice(0, 2) : "";
  await env.DB.prepare(`INSERT INTO subscription_access_daily
    (user_id,access_date,fingerprint,device_kind,country,first_seen_at,last_seen_at,hits)
    VALUES(?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,1)
    ON CONFLICT(user_id,access_date,fingerprint) DO UPDATE SET
      last_seen_at=CURRENT_TIMESTAMP,hits=hits+1,country=excluded.country,device_kind=excluded.device_kind`).bind(userId, day, fingerprint, deviceKind(userAgent), country).run();
}
__name(recordSubscriptionAccess, "recordSubscriptionAccess");
__name2(recordSubscriptionAccess, "recordSubscriptionAccess");
__name22(recordSubscriptionAccess, "recordSubscriptionAccess");
async function accessSummary(env, userId) {
  const [summary, recent] = await Promise.all([
    env.DB.prepare(`SELECT
      COUNT(DISTINCT CASE WHEN access_date>=date('now','-1 day') THEN fingerprint END) AS devices_24h,
      COUNT(DISTINCT fingerprint) AS devices_7d,
      MAX(last_seen_at) AS last_seen_at,
      COALESCE(SUM(hits),0) AS hits_7d
      FROM subscription_access_daily
      WHERE user_id=? AND access_date>=date('now','-6 day')`).bind(userId).first(),
    env.DB.prepare(`SELECT access_date,device_kind,country,first_seen_at,last_seen_at,hits
      FROM subscription_access_daily WHERE user_id=? AND access_date>=date('now','-6 day')
      ORDER BY last_seen_at DESC LIMIT 30`).bind(userId).all()
  ]);
  return { summary: summary ?? { devices_24h: 0, devices_7d: 0, last_seen_at: null, hits_7d: 0 }, recent: recent.results };
}
__name(accessSummary, "accessSummary");
__name2(accessSummary, "accessSummary");
__name22(accessSummary, "accessSummary");
function randomToken(bytes = 24) {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...data)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(randomToken, "randomToken");
__name2(randomToken, "randomToken");
__name22(randomToken, "randomToken");
function randomCode() {
  const data = crypto.getRandomValues(new Uint32Array(1));
  return String(data[0] % 1e6).padStart(6, "0");
}
__name(randomCode, "randomCode");
__name2(randomCode, "randomCode");
__name22(randomCode, "randomCode");
async function secureEqual(a, b) {
  const [ah, bh] = await Promise.all([hash(a), hash(b)]);
  let diff = 0;
  for (let i = 0; i < ah.length; i++) diff |= ah.charCodeAt(i) ^ bh.charCodeAt(i);
  return diff === 0;
}
__name(secureEqual, "secureEqual");
__name2(secureEqual, "secureEqual");
__name22(secureEqual, "secureEqual");
async function authorized(request, env) {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  return secureEqual(supplied, env.ADMIN_SECRET);
}
__name(authorized, "authorized");
__name2(authorized, "authorized");
__name22(authorized, "authorized");
function appPublicBase(request, env) {
  return (env.PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/$/, "");
}
__name(appPublicBase, "appPublicBase");
__name2(appPublicBase, "appPublicBase");
__name22(appPublicBase, "appPublicBase");
function appPaymentBase(env) {
  return (env.PAYMENT_API_BASE || "").replace(/\/$/, "");
}
__name(appPaymentBase, "appPaymentBase");
__name2(appPaymentBase, "appPaymentBase");
__name22(appPaymentBase, "appPaymentBase");
function appPaymentConfigured(env) {
  return Boolean(appPaymentBase(env) && env.PAYMENT_PID && env.PAYMENT_KEY);
}
__name(appPaymentConfigured, "appPaymentConfigured");
__name2(appPaymentConfigured, "appPaymentConfigured");
__name22(appPaymentConfigured, "appPaymentConfigured");
function appPaymentSign(env, values) {
  const source = Object.entries(values).filter(([key, value]) => key !== "sign" && key !== "sign_type" && value !== "").sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => `${key}=${value}`).join("&");
  return md5(`${source}${env.PAYMENT_KEY || ""}`);
}
__name(appPaymentSign, "appPaymentSign");
__name2(appPaymentSign, "appPaymentSign");
__name22(appPaymentSign, "appPaymentSign");
function md5(value) {
  function add32(a, b) {
    return a + b & 4294967295;
  }
  __name(add32, "add32");
  __name2(add32, "add32");
  __name22(add32, "add32");
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32(a << s | a >>> 32 - s, b);
  }
  __name(cmn, "cmn");
  __name2(cmn, "cmn");
  __name22(cmn, "cmn");
  function ff(a, b, c, d, x, s, t) {
    return cmn(b & c | ~b & d, a, b, x, s, t);
  }
  __name(ff, "ff");
  __name2(ff, "ff");
  __name22(ff, "ff");
  function gg(a, b, c, d, x, s, t) {
    return cmn(b & d | c & ~d, a, b, x, s, t);
  }
  __name(gg, "gg");
  __name2(gg, "gg");
  __name22(gg, "gg");
  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  __name(hh, "hh");
  __name2(hh, "hh");
  __name22(hh, "hh");
  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  __name(ii, "ii");
  __name2(ii, "ii");
  __name22(ii, "ii");
  function md5cycle(state2, block) {
    let [a, b, c, d] = state2;
    a = ff(a, b, c, d, block[0], 7, -680876936);
    d = ff(d, a, b, c, block[1], 12, -389564586);
    c = ff(c, d, a, b, block[2], 17, 606105819);
    b = ff(b, c, d, a, block[3], 22, -1044525330);
    a = ff(a, b, c, d, block[4], 7, -176418897);
    d = ff(d, a, b, c, block[5], 12, 1200080426);
    c = ff(c, d, a, b, block[6], 17, -1473231341);
    b = ff(b, c, d, a, block[7], 22, -45705983);
    a = ff(a, b, c, d, block[8], 7, 1770035416);
    d = ff(d, a, b, c, block[9], 12, -1958414417);
    c = ff(c, d, a, b, block[10], 17, -42063);
    b = ff(b, c, d, a, block[11], 22, -1990404162);
    a = ff(a, b, c, d, block[12], 7, 1804603682);
    d = ff(d, a, b, c, block[13], 12, -40341101);
    c = ff(c, d, a, b, block[14], 17, -1502002290);
    b = ff(b, c, d, a, block[15], 22, 1236535329);
    a = gg(a, b, c, d, block[1], 5, -165796510);
    d = gg(d, a, b, c, block[6], 9, -1069501632);
    c = gg(c, d, a, b, block[11], 14, 643717713);
    b = gg(b, c, d, a, block[0], 20, -373897302);
    a = gg(a, b, c, d, block[5], 5, -701558691);
    d = gg(d, a, b, c, block[10], 9, 38016083);
    c = gg(c, d, a, b, block[15], 14, -660478335);
    b = gg(b, c, d, a, block[4], 20, -405537848);
    a = gg(a, b, c, d, block[9], 5, 568446438);
    d = gg(d, a, b, c, block[14], 9, -1019803690);
    c = gg(c, d, a, b, block[3], 14, -187363961);
    b = gg(b, c, d, a, block[8], 20, 1163531501);
    a = gg(a, b, c, d, block[13], 5, -1444681467);
    d = gg(d, a, b, c, block[2], 9, -51403784);
    c = gg(c, d, a, b, block[7], 14, 1735328473);
    b = gg(b, c, d, a, block[12], 20, -1926607734);
    a = hh(a, b, c, d, block[5], 4, -378558);
    d = hh(d, a, b, c, block[8], 11, -2022574463);
    c = hh(c, d, a, b, block[11], 16, 1839030562);
    b = hh(b, c, d, a, block[14], 23, -35309556);
    a = hh(a, b, c, d, block[1], 4, -1530992060);
    d = hh(d, a, b, c, block[4], 11, 1272893353);
    c = hh(c, d, a, b, block[7], 16, -155497632);
    b = hh(b, c, d, a, block[10], 23, -1094730640);
    a = hh(a, b, c, d, block[13], 4, 681279174);
    d = hh(d, a, b, c, block[0], 11, -358537222);
    c = hh(c, d, a, b, block[3], 16, -722521979);
    b = hh(b, c, d, a, block[6], 23, 76029189);
    a = hh(a, b, c, d, block[9], 4, -640364487);
    d = hh(d, a, b, c, block[12], 11, -421815835);
    c = hh(c, d, a, b, block[15], 16, 530742520);
    b = hh(b, c, d, a, block[2], 23, -995338651);
    a = ii(a, b, c, d, block[0], 6, -198630844);
    d = ii(d, a, b, c, block[7], 10, 1126891415);
    c = ii(c, d, a, b, block[14], 15, -1416354905);
    b = ii(b, c, d, a, block[5], 21, -57434055);
    a = ii(a, b, c, d, block[12], 6, 1700485571);
    d = ii(d, a, b, c, block[3], 10, -1894986606);
    c = ii(c, d, a, b, block[10], 15, -1051523);
    b = ii(b, c, d, a, block[1], 21, -2054922799);
    a = ii(a, b, c, d, block[8], 6, 1873313359);
    d = ii(d, a, b, c, block[15], 10, -30611744);
    c = ii(c, d, a, b, block[6], 15, -1560198380);
    b = ii(b, c, d, a, block[13], 21, 1309151649);
    a = ii(a, b, c, d, block[4], 6, -145523070);
    d = ii(d, a, b, c, block[11], 10, -1120210379);
    c = ii(c, d, a, b, block[2], 15, 718787259);
    b = ii(b, c, d, a, block[9], 21, -343485551);
    state2[0] = add32(state2[0], a);
    state2[1] = add32(state2[1], b);
    state2[2] = add32(state2[2], c);
    state2[3] = add32(state2[3], d);
  }
  __name(md5cycle, "md5cycle");
  __name2(md5cycle, "md5cycle");
  __name22(md5cycle, "md5cycle");
  const bytes = Array.from(new TextEncoder().encode(value));
  const originalBits = bytes.length * 8;
  bytes.push(128);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push(Math.floor(originalBits / 2 ** (8 * i)) & 255);
  const state = [1732584193, -271733879, -1732584194, 271733878];
  for (let i = 0; i < bytes.length; i += 64) {
    const block = Array.from({ length: 16 }, (_, j) => bytes[i + j * 4] | bytes[i + j * 4 + 1] << 8 | bytes[i + j * 4 + 2] << 16 | bytes[i + j * 4 + 3] << 24);
    md5cycle(state, block);
  }
  return state.flatMap((n) => [n & 255, n >>> 8 & 255, n >>> 16 & 255, n >>> 24 & 255]).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(md5, "md5");
__name2(md5, "md5");
__name22(md5, "md5");
async function appSession(request, env) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (!token) return null;
  const session = await env.DB.prepare("SELECT user_id,device_id,expires_at,revoked_at FROM app_sessions WHERE token_hash=?").bind(await hash(token)).first();
  if (!session || session.revoked_at || Date.parse(session.expires_at) <= Date.now()) return null;
  await env.DB.prepare("UPDATE app_sessions SET last_seen_at=CURRENT_TIMESTAMP WHERE token_hash=?").bind(await hash(token)).run();
  return session;
}
__name(appSession, "appSession");
__name2(appSession, "appSession");
__name22(appSession, "appSession");
async function requireAppSession(request, env) {
  const session = await appSession(request, env);
  return session ?? json({ error: "unauthorized" }, 401);
}
__name(requireAppSession, "requireAppSession");
__name2(requireAppSession, "requireAppSession");
__name22(requireAppSession, "requireAppSession");
function appPaymentFields(request, env, order, plan) {
  const base = appPublicBase(request, env);
  const fields = {
    pid: String(env.PAYMENT_PID || ""),
    out_trade_no: order.order_no,
    notify_url: `${base}/api/app/payment/notify`,
    return_url: `${base}/api/app/payment/return?order=${encodeURIComponent(order.order_no)}`,
    name: plan.name,
    money: (order.amount_cents / 100).toFixed(2),
    param: String(order.user_id)
  };
  const metadata = safeJsonParse(String(order.metadata_json || "{}"), {});
  const payType = metadata.paymentType || "";
  if (["alipay", "wxpay"].includes(payType)) fields.type = payType;
  fields.sign = appPaymentSign(env, fields);
  fields.sign_type = "MD5";
  return fields;
}
__name(appPaymentFields, "appPaymentFields");
__name2(appPaymentFields, "appPaymentFields");
__name22(appPaymentFields, "appPaymentFields");
function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
__name(safeJsonParse, "safeJsonParse");
__name2(safeJsonParse, "safeJsonParse");
__name22(safeJsonParse, "safeJsonParse");
function dnsPools(env) {
  const fallback = [{ suffix: env.DNS_SUFFIX, zoneId: env.CF_ZONE_ID, maxRecords: 190 }];
  try {
    const parsed = JSON.parse(env.DNS_POOLS || "[]");
    const pools = parsed.filter((pool) => /^[a-z0-9.-]+$/i.test(pool.suffix) && /^[a-f0-9]{32}$/i.test(pool.zoneId) && Number.isInteger(pool.maxRecords) && pool.maxRecords > 0);
    return pools.length ? pools : fallback;
  } catch {
    return fallback;
  }
}
__name(dnsPools, "dnsPools");
__name2(dnsPools, "dnsPools");
__name22(dnsPools, "dnsPools");
function localizedNodeName(name, upstreamId) {
  const countries = [
    ["United States", "\u7F8E\u56FD"],
    ["Malaysia", "\u9A6C\u6765\u897F\u4E9A"],
    ["Singapore", "\u65B0\u52A0\u5761"],
    ["Japan", "\u65E5\u672C"],
    ["Korea", "\u97E9\u56FD"],
    ["Netherlands", "\u8377\u5170"],
    ["United Kingdom", "\u82F1\u56FD"],
    ["Hong Kong", "\u9999\u6E2F"],
    ["Taiwan", "\u53F0\u6E7E"],
    ["Germany", "\u5FB7\u56FD"]
  ];
  const flag = name.match(/^\p{Regional_Indicator}{2}/u)?.[0] ?? "";
  const rest = name.slice(flag.length).trim();
  for (const [english, chinese] of countries) {
    if (rest.startsWith(english)) {
      const suffix = rest.slice(english.length).trim();
      return `\u8282\u70B9 \xB7 ${flag}${chinese}${suffix ? ` ${suffix}` : ""}${upstreamId === 2 ? " \xB7 \u7EBF\u8DEF\u4E8C" : ""}`;
    }
  }
  return `\u8282\u70B9 \xB7 ${flag}${rest}${upstreamId === 2 ? " \xB7 \u7EBF\u8DEF\u4E8C" : ""}`;
}
__name(localizedNodeName, "localizedNodeName");
__name2(localizedNodeName, "localizedNodeName");
__name22(localizedNodeName, "localizedNodeName");
async function cfDns(env, zoneId, method, path = "", payload) {
  env.__subrequests = (env.__subrequests || 0) + 1;
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records${path}`, {
    method,
    headers: { authorization: `Bearer ${env.CF_API_TOKEN}`, "content-type": "application/json" },
    body: payload === void 0 ? void 0 : JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok || result.success !== true) {
    const err = new Error(`Cloudflare DNS \u8BF7\u6C42\u5931\u8D25\uFF1A${JSON.stringify(result.errors ?? response.status)}`);
    err.cfErrors = result.errors || [];
    err.httpStatus = response.status;
    throw err;
  }
  return result;
}
__name(cfDns, "cfDns");
__name2(cfDns, "cfDns");
__name22(cfDns, "cfDns");
async function createDns(env, pool, hostname, server) {
  const recordBody = { type: dnsType(server), name: hostname, content: server, ttl: 60, proxied: false, comment: "dns-sub-share managed" };
  try {
    const result = await cfDns(env, pool.zoneId, "POST", "", recordBody);
    return String(result.result?.id ?? "");
  } catch (err) {
    const codes = (err.cfErrors || []).map((e) => Number(e.code));
    if (codes.includes(81053) || codes.includes(81057) || codes.includes(81058)) {
      const list = await cfDns(env, pool.zoneId, "GET", `?name=${encodeURIComponent(hostname)}`);
      const existing = list.result?.[0];
      if (existing?.id) {
        await cfDns(env, pool.zoneId, "PATCH", `/${existing.id}`, recordBody);
        return String(existing.id);
      }
    }
    throw err;
  }
}
__name(createDns, "createDns");
__name2(createDns, "createDns");
__name22(createDns, "createDns");
async function deleteDns(env, zoneId, recordId) {
  if (!recordId) return;
  try {
    await cfDns(env, zoneId, "DELETE", `/${recordId}`);
  } catch (err) {
    const codes = (err.cfErrors || []).map((e) => Number(e.code));
    if (err.httpStatus === 404 || codes.includes(81044)) return;
    throw err;
  }
}
__name(deleteDns, "deleteDns");
__name2(deleteDns, "deleteDns");
__name22(deleteDns, "deleteDns");
async function pickDnsPool(env) {
  const pools = dnsPools(env);
  const usage = await env.DB.prepare("SELECT COALESCE(zone_id, ?) zone_id, COUNT(*) total FROM user_dns_records WHERE status='active' GROUP BY COALESCE(zone_id, ?)").bind(env.CF_ZONE_ID, env.CF_ZONE_ID).all();
  const counts = new Map(usage.results.map((row) => [row.zone_id, Number(row.total)]));
  const available = pools.filter((pool) => (counts.get(pool.zoneId) || 0) < pool.maxRecords);
  if (!available.length) throw new Error("\u6240\u6709\u8282\u70B9\u57DF\u540D\u6C60\u5747\u5DF2\u8FBE\u5230\u5BB9\u91CF\u4E0A\u9650");
  return available.sort((a, b) => (counts.get(a.zoneId) || 0) / a.maxRecords - (counts.get(b.zoneId) || 0) / b.maxRecords)[0];
}
__name(pickDnsPool, "pickDnsPool");
__name2(pickDnsPool, "pickDnsPool");
__name22(pickDnsPool, "pickDnsPool");
async function syncUpstream(env, upstreamId) {
  const upstream = await env.DB.prepare("SELECT subscription_url FROM upstreams WHERE id=? AND enabled=1").bind(upstreamId).first();
  if (!upstream) throw new Error("\u4E0A\u6E38\u4E0D\u5B58\u5728\u6216\u5DF2\u505C\u7528");
  if (upstream.subscription_url.startsWith("manual://")) {
    const b64 = upstream.subscription_url.slice(9);
    if (b64 && b64 !== "stored") {
      try {
        const raw = decodeURIComponent(escape(atob(b64)));
        const nodes = await parseSubscription(raw);
        if (nodes.length > 0) {
          await env.DB.batch([
            env.DB.prepare("UPDATE nodes SET active=0 WHERE upstream_id=?").bind(upstreamId),
            ...nodes.map((node) => env.DB.prepare(`INSERT INTO nodes(upstream_id,fingerprint,name,protocol,original_server,original_uri,active,updated_at)
              VALUES(?,?,?,?,?,?,1,CURRENT_TIMESTAMP)
              ON CONFLICT(upstream_id,fingerprint) DO UPDATE SET name=excluded.name,protocol=excluded.protocol,original_server=excluded.original_server,original_uri=excluded.original_uri,active=1,updated_at=CURRENT_TIMESTAMP`).bind(upstreamId, node.fingerprint, localizedNodeName(node.name, upstreamId), node.protocol, node.server, node.originalUri))
          ]);
        }
      } catch {
      }
    }
    const count = await env.DB.prepare("SELECT COUNT(*) count FROM nodes WHERE upstream_id=? AND active=1").bind(upstreamId).first();
    await env.DB.prepare("UPDATE upstreams SET last_synced_at=CURRENT_TIMESTAMP,last_error=NULL WHERE id=?").bind(upstreamId).run();
    return { found: Number(count?.count || 0) };
  }
  try {
    const response = await fetch(upstream.subscription_url, { headers: { "user-agent": "dns-sub-share/0.1" }, signal: AbortSignal.timeout(15e3) });
    if (!response.ok) throw new Error(`\u4E0A\u6E38\u8FD4\u56DE HTTP ${response.status}`);
    const text = await response.text();
    if (text.length > 5e6) throw new Error("\u4E0A\u6E38\u8BA2\u9605\u8D85\u8FC7 5 MB");
    const nodes = await parseSubscription(text);
    if (!nodes.length) throw new Error("\u672A\u89E3\u6790\u5230\u652F\u6301\u7684\u8282\u70B9");
    await env.DB.batch([
      env.DB.prepare("UPDATE nodes SET active=0 WHERE upstream_id=?").bind(upstreamId),
      ...nodes.map((node) => env.DB.prepare(`INSERT INTO nodes(upstream_id,fingerprint,name,protocol,original_server,original_uri,active,updated_at)
        VALUES(?,?,?,?,?,?,1,CURRENT_TIMESTAMP)
        ON CONFLICT(upstream_id,fingerprint) DO UPDATE SET name=excluded.name,protocol=excluded.protocol,original_server=excluded.original_server,original_uri=excluded.original_uri,active=1,updated_at=CURRENT_TIMESTAMP`).bind(upstreamId, node.fingerprint, localizedNodeName(node.name, upstreamId), node.protocol, node.server, node.originalUri))
    ]);
    await env.DB.prepare("UPDATE upstreams SET last_synced_at=CURRENT_TIMESTAMP,last_error=NULL WHERE id=?").bind(upstreamId).run();
    return { found: nodes.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await env.DB.prepare("UPDATE upstreams SET last_error=? WHERE id=?").bind(message, upstreamId).run();
    throw error;
  }
}
__name(syncUpstream, "syncUpstream");
__name2(syncUpstream, "syncUpstream");
__name22(syncUpstream, "syncUpstream");
async function reconcileUpstream(env, upstreamId) {
  const stale = await env.DB.prepare(`SELECT d.id,d.cloudflare_record_id,d.zone_id FROM user_dns_records d JOIN nodes n ON n.id=d.node_id
    WHERE n.upstream_id=? AND n.active=0 AND d.status='active'`).bind(upstreamId).all();
  for (const row of stale.results) {
    try {
      await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
      await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(row.id).run();
    } catch (error) {
      await env.DB.prepare("UPDATE user_dns_records SET status='error',last_error=? WHERE id=?").bind(error instanceof Error ? error.message : String(error), row.id).run();
    }
  }
  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT OR IGNORE INTO user_selected_nodes(user_id, node_id)
        SELECT s.user_id, n_new.id FROM user_selected_nodes s
        JOIN nodes n_old ON n_old.id = s.node_id
        JOIN nodes n_new ON n_new.upstream_id = n_old.upstream_id AND n_new.name = n_old.name AND n_new.active = 1
        WHERE n_old.upstream_id = ? AND n_old.active = 0`).bind(upstreamId),
      env.DB.prepare("DELETE FROM user_selected_nodes WHERE node_id IN (SELECT id FROM nodes WHERE upstream_id = ? AND active = 0)").bind(upstreamId),
      env.DB.prepare(`INSERT OR IGNORE INTO plan_selected_nodes(plan_id, node_id)
        SELECT p.plan_id, n_new.id FROM plan_selected_nodes p
        JOIN nodes n_old ON n_old.id = p.node_id
        JOIN nodes n_new ON n_new.upstream_id = n_old.upstream_id AND n_new.name = n_old.name AND n_new.active = 1
        WHERE n_old.upstream_id = ? AND n_old.active = 0`).bind(upstreamId),
      env.DB.prepare("DELETE FROM plan_selected_nodes WHERE node_id IN (SELECT id FROM nodes WHERE upstream_id = ? AND active = 0)").bind(upstreamId)
    ]);
  } catch {}
  const users = await env.DB.prepare(`SELECT DISTINCT u.id,u.name,u.upstream_id,u.expires_at,u.status,u.node_limit,u.plan_id,u.dns_revision
    FROM users u
    WHERE u.status='active' AND u.expires_at>datetime('now') AND (
      u.upstream_id=? OR EXISTS(
        SELECT 1 FROM user_selected_nodes s JOIN nodes n ON n.id=s.node_id
        WHERE s.user_id=u.id AND n.upstream_id=?
      ) OR EXISTS(
        SELECT 1 FROM plan_selected_nodes p JOIN nodes n ON n.id=p.node_id
        WHERE p.plan_id=COALESCE(u.plan_id, 'trial_1d') AND n.upstream_id=?
      )
    )`).bind(upstreamId, upstreamId, upstreamId).all();
  for (const user of users.results) await provisionUser(env, user);
}
__name(reconcileUpstream, "reconcileUpstream");
__name2(reconcileUpstream, "reconcileUpstream");
__name22(reconcileUpstream, "reconcileUpstream");
async function syncAllUpstreams(env) {
  const rows = await env.DB.prepare("SELECT id FROM upstreams WHERE enabled=1").all();
  for (const row of rows.results) {
    try {
      await syncUpstream(env, row.id);
      await reconcileUpstream(env, row.id);
    } catch (error) {
      console.error(JSON.stringify({ event: "upstream_sync_error", upstreamId: row.id, error: error instanceof Error ? error.message : String(error) }));
    }
  }
  return rows.results.length;
}
__name(syncAllUpstreams, "syncAllUpstreams");
__name2(syncAllUpstreams, "syncAllUpstreams");
__name22(syncAllUpstreams, "syncAllUpstreams");
async function provisionUser(env, user, { prune = true } = {}) {
  const limit = Math.max(1, Math.min(20, user.node_limit || 10));
  let planId = user.plan_id;
  if (!planId) {
    try {
      const uRow = await env.DB.prepare("SELECT plan_id FROM users WHERE id=?").bind(user.id).first();
      planId = uRow?.plan_id || "trial_1d";
    } catch {
      planId = "trial_1d";
    }
  }
  planId = normalizePlanId(planId);
  const selected = await env.DB.prepare("SELECT node_id FROM user_selected_nodes WHERE user_id=?").bind(user.id).all();
  let rawAllowedIds = (selected.results || []).map((row) => Number(row.node_id));
  if (!rawAllowedIds.length) {
    try {
      const planSelected = await env.DB.prepare("SELECT node_id FROM plan_selected_nodes WHERE plan_id=?").bind(planId).all();
      rawAllowedIds = (planSelected.results || []).map((row) => Number(row.node_id));
    } catch {}
  }
  let allowedIds = [];
  if (rawAllowedIds.length > 0) {
    const resolved = await env.DB.prepare(`SELECT DISTINCT n_act.id FROM nodes n_sel
      JOIN nodes n_act ON (n_act.id = n_sel.id OR (n_act.upstream_id = n_sel.upstream_id AND n_act.name = n_sel.name))
      WHERE n_sel.id IN (${rawAllowedIds.map(() => "?").join(",")}) AND n_act.active = 1`).bind(...rawAllowedIds).all();
    allowedIds = (resolved.results || []).map((r) => Number(r.id));
  }
  const errorRows = await env.DB.prepare("SELECT id,node_id,cloudflare_record_id,zone_id FROM user_dns_records WHERE user_id=? AND status='error'").bind(user.id).all();
  for (const erow of errorRows.results || []) {
    if ((env.__subrequests || 0) >= 38) break;
    try {
      if (erow.cloudflare_record_id) {
        await deleteDns(env, erow.zone_id || env.CF_ZONE_ID, erow.cloudflare_record_id);
      }
      await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(erow.id).run();
    } catch {}
  }
  const activeRows = await env.DB.prepare("SELECT id,node_id,cloudflare_record_id,zone_id FROM user_dns_records WHERE user_id=? AND status='active' ORDER BY created_at,id").bind(user.id).all();
  let active = activeRows.results || [];
  let disallowedRemoved = 0, disallowedFailed = 0;
  if (prune && rawAllowedIds.length > 0) {
    const kept = [];
    for (const row of active) {
      if (!allowedIds.includes(Number(row.node_id))) {
        if ((env.__subrequests || 0) >= 38) {
          kept.push(row);
          continue;
        }
        try {
          await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
          await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(row.id).run();
          disallowedRemoved++;
        } catch (error) {
          disallowedFailed++;
          await env.DB.prepare("UPDATE user_dns_records SET status='error',last_error=? WHERE id=?").bind(error instanceof Error ? error.message : String(error), row.id).run();
        }
      } else {
        kept.push(row);
      }
    }
    active = kept;
  }
  async function pruneExtras() {
    if (!prune) return { removed: 0, failed: 0 };
    const latest = await env.DB.prepare("SELECT id,cloudflare_record_id,zone_id FROM user_dns_records WHERE user_id=? AND status='active' ORDER BY created_at,id").bind(user.id).all();
    const extras = latest.results.slice(limit);
    let removed2 = 0, failed2 = 0;
    for (const row of extras) {
      try {
        await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
        await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(row.id).run();
        removed2++;
      } catch (error) {
        failed2++;
        await env.DB.prepare("UPDATE user_dns_records SET status='error',last_error=? WHERE id=?").bind(error instanceof Error ? error.message : String(error), row.id).run();
      }
    }
    return { removed: removed2, failed: failed2 };
  }
  __name(pruneExtras, "pruneExtras");
  __name2(pruneExtras, "pruneExtras");
  __name22(pruneExtras, "pruneExtras");
  if (active.length >= limit) {
    const pruned2 = await pruneExtras();
    return { created: 0, removed: disallowedRemoved + pruned2.removed, failed: disallowedFailed + pruned2.failed };
  }
  const activeNodeIds = active.map((row) => row.node_id);
  const fill = limit - active.length;
  const excludeSql = activeNodeIds.length ? ` AND id NOT IN (${activeNodeIds.map(() => "?").join(",")})` : "";
  const nodes = rawAllowedIds.length ? (allowedIds.length ? await env.DB.prepare(`SELECT id,fingerprint,name,protocol,original_server,original_uri FROM nodes WHERE active=1 AND id IN (${allowedIds.map(() => "?").join(",")})${excludeSql} ORDER BY RANDOM() LIMIT ?`).bind(...allowedIds, ...activeNodeIds, fill).all() : { results: [] }) : await env.DB.prepare(`SELECT id,fingerprint,name,protocol,original_server,original_uri FROM nodes WHERE upstream_id=? AND active=1${excludeSql} ORDER BY RANDOM() LIMIT ?`).bind(user.upstream_id, ...activeNodeIds, fill).all();
  let created = 0, failed = 0;
  for (const node of nodes.results) {
    const existing = await env.DB.prepare("SELECT id,status FROM user_dns_records WHERE user_id=? AND node_id=?").bind(user.id, node.id).first();
    if (existing?.status === "active") continue;
    const label = `u${user.id}-r${user.dns_revision}-${node.fingerprint.slice(0, 10)}-${node.id}`;
    const pool = await pickDnsPool(env);
    const hostname = `${label}.${pool.suffix}`;
    try {
      const recordId = await createDns(env, pool, hostname, node.original_server);
      await env.DB.prepare(`INSERT INTO user_dns_records(user_id,node_id,hostname,record_type,record_content,cloudflare_record_id,zone_id,status,last_error)
        VALUES(?,?,?,?,?,?,?, 'active',NULL)
        ON CONFLICT(user_id,node_id) DO UPDATE SET hostname=excluded.hostname,record_type=excluded.record_type,record_content=excluded.record_content,cloudflare_record_id=excluded.cloudflare_record_id,zone_id=excluded.zone_id,status='active',last_error=NULL`).bind(user.id, node.id, hostname, dnsType(node.original_server), node.original_server, recordId, pool.zoneId).run();
      created++;
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      await env.DB.prepare(`INSERT INTO user_dns_records(user_id,node_id,hostname,record_type,record_content,zone_id,status,last_error)
        VALUES(?,?,?,?,?,?,'error',?) ON CONFLICT(user_id,node_id) DO UPDATE SET status='error',last_error=excluded.last_error,zone_id=excluded.zone_id`).bind(user.id, node.id, hostname, dnsType(node.original_server), node.original_server, pool.zoneId, message).run();
    }
  }
  const pruned = await pruneExtras();
  return { created, removed: disallowedRemoved + pruned.removed, failed: failed + disallowedFailed + pruned.failed };
}
__name(provisionUser, "provisionUser");
__name2(provisionUser, "provisionUser");
__name22(provisionUser, "provisionUser");
async function deprovisionUser(env, userId) {
  const rows = await env.DB.prepare("SELECT id,hostname,cloudflare_record_id,zone_id FROM user_dns_records WHERE user_id=? AND status IN ('active','error')").bind(userId).all();
  let removed = 0, failed = 0;
  for (const row of rows.results) {
    try {
      await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
      await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(row.id).run();
      removed++;
    } catch (error) {
      failed++;
      await env.DB.prepare("UPDATE user_dns_records SET status='error',last_error=? WHERE id=?").bind(error instanceof Error ? error.message : String(error), row.id).run();
    }
  }
  return { removed, failed };
}
__name(deprovisionUser, "deprovisionUser");
__name2(deprovisionUser, "deprovisionUser");
__name22(deprovisionUser, "deprovisionUser");
async function expireUsers(env) {
  const users = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE status='active' AND expires_at<=datetime('now')").all();
  for (const user of users.results) {
    await deprovisionUser(env, user.id);
    await env.DB.prepare("UPDATE users SET status='expired' WHERE id=?").bind(user.id).run();
  }
  return users.results.length;
}
__name(expireUsers, "expireUsers");
__name2(expireUsers, "expireUsers");
__name22(expireUsers, "expireUsers");
function effectiveMembership(user, paidOrder, paidPlan) {
  const expiresAt = user.expires_at;
  const expiresMs = Date.parse(expiresAt || "");
  const now = Date.now();
  const validUntilFuture = Number.isFinite(expiresMs) && expiresMs > now;
  const active = user.status === "active" && validUntilFuture;
  const remainingSeconds = active ? Math.max(0, Math.floor((expiresMs - now) / 1e3)) : 0;
  const paid = Boolean(paidOrder && active);
  return {
    active,
    paid,
    status: active ? "active" : user.status === "disabled" ? "disabled" : "expired",
    expiresAt,
    remainingSeconds,
    planId: paidPlan?.id ?? (paid ? paidOrder?.plan_id ?? null : null),
    planName: paidPlan?.name ?? null
  };
}
__name(effectiveMembership, "effectiveMembership");
__name2(effectiveMembership, "effectiveMembership");
__name22(effectiveMembership, "effectiveMembership");
async function appUserPayload(request, env, userId, deviceId) {
  const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,COALESCE(device_limit,2) device_limit,COALESCE(plan_id,'trial_1d') plan_id,dns_revision FROM users WHERE id=?").bind(userId).first();
  if (!user) return { error: "user_not_found" };
  if (user.status === "active" && Date.parse(user.expires_at || "") <= Date.now()) {
    await deprovisionUser(env, user.id);
    await env.DB.prepare("UPDATE users SET status='expired' WHERE id=?").bind(user.id).run();
    user.status = "expired";
  }
  const paidOrder = await env.DB.prepare(`
    SELECT plan_id,amount_cents,currency,updated_at
    FROM app_orders
    WHERE user_id=? AND status='paid'
    ORDER BY updated_at DESC,id DESC
    LIMIT 1
  `).bind(userId).first();
  const profile = await userProfile(env, userId);
  const device = deviceId ? await env.DB.prepare("SELECT id,platform,app_version,model,created_at,last_seen_at,subscription_token FROM app_devices WHERE id=?").bind(deviceId).first() : await env.DB.prepare("SELECT id,platform,app_version,model,created_at,last_seen_at,subscription_token FROM app_devices WHERE user_id=? ORDER BY id DESC LIMIT 1").bind(userId).first();
  const token = String(device?.subscription_token || "");
  const expiresAt = user.expires_at;
  const configRevision = String(user.dns_revision ?? 0);
  const plansList = await loadAppPlans(env);
  const effectivePlanId = normalizePlanId(user.plan_id || paidOrder?.plan_id || "trial_1d");
  const paidPlan = paidOrder ? (plansList.find((plan) => plan.id === normalizePlanId(paidOrder.plan_id)) || plansList.find((plan) => plan.id === effectivePlanId)) : plansList.find((plan) => plan.id === effectivePlanId);
  const membership = effectiveMembership(user, paidOrder, paidPlan);
  const isPaid = membership.paid;
  return {
    configRevision,
    dnsRevision: configRevision,
    revision: configRevision,
    user: { id: user.id, name: user.name, status: user.status, expiresAt, nodeLimit: user.node_limit, dnsRevision: configRevision, profile },
    device: device ? {
      id: device.id,
      platform: device.platform,
      appVersion: device.app_version,
      model: device.model,
      createdAt: device.created_at,
      lastSeenAt: device.last_seen_at
    } : null,
    plan: {
      type: isPaid ? "paid" : "trial",
      id: paidPlan?.id ?? "trial",
      name: paidPlan?.name ?? (isPaid ? "\u4F1A\u5458\u5957\u9910" : "\u57FA\u7840\u4F53\u9A8C"),
      nodeLimit: user.node_limit,
      expiresAt,
      remainingSeconds: membership.remainingSeconds,
      amountCents: paidOrder?.amount_cents ?? 0,
      currency: paidOrder?.currency ?? "CNY",
      paidAt: paidOrder?.updated_at ?? null
    },
    membership,
    traffic: { usedBytes: 0, limitBytes: null },
    subscription: token ? {
      tokenHint: token.slice(0, 8),
      status: user.status,
      expiresAt,
      activeDnsRecords: await activeDnsCount(env, user.id),
      configRevision,
      dnsRevision: configRevision,
      revision: configRevision,
      url: `${appPublicBase(request, env)}/api/subscription/${token}`
    } : null,
    config: { revision: configRevision, dnsRevision: configRevision }
  };
}
__name(appUserPayload, "appUserPayload");
__name2(appUserPayload, "appUserPayload");
__name22(appUserPayload, "appUserPayload");
async function userProfile(env, userId) {
  const profile = await env.DB.prepare("SELECT email,normalized_email,email_bound_at,phone,nickname,remark,created_at,updated_at FROM app_user_profiles WHERE user_id=?").bind(userId).first();
  return profile ? { ...profile, emailBound: Boolean(profile.normalized_email), emailBoundAt: profile.email_bound_at } : { email: null, normalized_email: null, email_bound_at: null, emailBound: false, emailBoundAt: null, phone: null, nickname: null, remark: null, created_at: null, updated_at: null };
}
__name(userProfile, "userProfile");
__name2(userProfile, "userProfile");
__name22(userProfile, "userProfile");
function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return email || null;
}
__name(normalizeEmail, "normalizeEmail");
__name2(normalizeEmail, "normalizeEmail");
__name22(normalizeEmail, "normalizeEmail");
async function emailCodeHash(env, email, code, purpose) {
  return hash(`${env.ADMIN_SECRET || "email-code"}|${purpose}|${normalizeEmail(email)}|${String(code).trim()}`);
}
__name(emailCodeHash, "emailCodeHash");
__name2(emailCodeHash, "emailCodeHash");
__name22(emailCodeHash, "emailCodeHash");
async function sendEmailCode(env, email, code, purpose) {
  if (!env.EMAIL_API_URL || !env.EMAIL_API_TOKEN) return { configured: false };
  const subject = purpose === "recover" ? "\u6062\u590D\u4F60\u7684\u8D26\u53F7" : "\u7ED1\u5B9A\u4F60\u7684\u90AE\u7BB1";
  const text = `\u4F60\u7684\u9A8C\u8BC1\u7801\u662F ${code}\uFF0C10 \u5206\u949F\u5185\u6709\u6548\u3002`;
  const payload = String(env.EMAIL_API_URL).includes("resend.com") ? {
    from: env.EMAIL_FROM || "WLBPG <noreply@5858188.xyz>",
    to: [email],
    subject,
    text
  } : { to: email, subject, text };
  const response = await fetch(env.EMAIL_API_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${env.EMAIL_API_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  return { configured: true, ok: response.ok, status: response.status };
}
__name(sendEmailCode, "sendEmailCode");
__name2(sendEmailCode, "sendEmailCode");
__name22(sendEmailCode, "sendEmailCode");
function cleanProfileInput(input) {
  const email = input.email == null ? null : String(input.email).trim().slice(0, 120);
  const normalizedEmail = email ? normalizeEmail(email) : null;
  const phone = input.phone == null ? null : String(input.phone).trim().slice(0, 40);
  const nickname = input.nickname == null ? null : String(input.nickname).trim().slice(0, 80);
  const remark = input.remark == null ? null : String(input.remark).trim().slice(0, 500);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "invalid_email" };
  if (phone && !/^[0-9+()\-\s]{5,40}$/.test(phone)) return { error: "invalid_phone" };
  return { email, normalizedEmail, phone, nickname, remark };
}
__name(cleanProfileInput, "cleanProfileInput");
__name2(cleanProfileInput, "cleanProfileInput");
__name22(cleanProfileInput, "cleanProfileInput");
async function upsertUserProfile(env, userId, input) {
  const clean = cleanProfileInput(input);
  if (clean.error) return clean;
  if (clean.normalizedEmail) {
    const occupied = await env.DB.prepare("SELECT user_id FROM app_user_profiles WHERE normalized_email=? AND user_id<>?").bind(clean.normalizedEmail, userId).first();
    if (occupied) return { error: "email_already_bound" };
  }
  await env.DB.prepare(`INSERT INTO app_user_profiles(user_id,email,normalized_email,email_bound_at,phone,nickname,remark)
    VALUES(?,?,?,?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET
      email=COALESCE(excluded.email,email),
      normalized_email=COALESCE(excluded.normalized_email,normalized_email),
      email_bound_at=CASE WHEN excluded.normalized_email IS NOT NULL THEN CURRENT_TIMESTAMP ELSE email_bound_at END,
      phone=COALESCE(excluded.phone,phone),
      nickname=COALESCE(excluded.nickname,nickname),
      remark=COALESCE(excluded.remark,remark),
      updated_at=CURRENT_TIMESTAMP`).bind(userId, clean.email, clean.normalizedEmail, clean.normalizedEmail ? (/* @__PURE__ */ new Date()).toISOString() : null, clean.phone, clean.nickname, clean.remark).run();
  return userProfile(env, userId);
}
__name(upsertUserProfile, "upsertUserProfile");
__name2(upsertUserProfile, "upsertUserProfile");
__name22(upsertUserProfile, "upsertUserProfile");
async function activeDnsCount(env, userId) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM user_dns_records WHERE user_id=? AND status='active'").bind(userId).first();
  return Number(row?.count || 0);
}
__name(activeDnsCount, "activeDnsCount");
__name2(activeDnsCount, "activeDnsCount");
__name22(activeDnsCount, "activeDnsCount");
async function appApi(request, env, url) {
  if (request.method === "GET" && url.pathname === "/api/app/update") {
    const versionCode = Number(env.APP_UPDATE_VERSION_CODE || defaultAppUpdate.versionCode);
    const versionName = String(env.APP_UPDATE_VERSION_NAME || defaultAppUpdate.versionName);
    const apkUrl = String(env.APP_UPDATE_APK_URL || defaultAppUpdate.apkUrl);
    const releaseUrl = String(env.APP_UPDATE_RELEASE_URL || apkUrl || defaultAppUpdate.releaseUrl);
    const message = String(env.APP_UPDATE_MESSAGE || defaultAppUpdate.message);
    const force = String(env.APP_UPDATE_FORCE || "").toLowerCase() === "true";
    return json({
      versionCode,
      versionName,
      force,
      title: String(env.APP_UPDATE_MESSAGE ? "\u53D1\u73B0\u65B0\u7248\u672C" : defaultAppUpdate.title),
      message,
      releaseNotes: message,
      apkUrl,
      downloadUrl: apkUrl,
      releaseUrl,
      sha256: String(env.APP_UPDATE_SHA256 || defaultAppUpdate.sha256)
    });
  }
  if (request.method === "GET" && url.pathname === "/api/app/plans") {
    return json({ plans: await loadAppPlans(env) });
  }
  if (request.method === "POST" && url.pathname === "/api/app/email/recover/request-code") {
    const input = await body(request);
    const clean = cleanProfileInput({ email: input.email });
    if (clean.error || !clean.email || !clean.normalizedEmail) return json({ error: clean.error || "email_required" }, 400);
    const profile = await env.DB.prepare("SELECT user_id FROM app_user_profiles WHERE normalized_email=?").bind(clean.normalizedEmail).first();
    const expiresAt = new Date(Date.now() + 10 * 6e4).toISOString();
    if (profile) {
      const code = randomCode();
      await env.DB.prepare("INSERT INTO app_email_codes(user_id,email,normalized_email,purpose,code_hash,expires_at) VALUES(?,?,?,?,?,?)").bind(profile.user_id, clean.email, clean.normalizedEmail, "recover", await emailCodeHash(env, clean.email, code, "recover"), expiresAt).run();
      await sendEmailCode(env, clean.email, code, "recover");
    }
    return json({ ok: true, purpose: "recover", email: clean.email, expiresAt });
  }
  if (request.method === "POST" && url.pathname === "/api/app/email/recover/verify") {
    const input = await body(request);
    const clean = cleanProfileInput({ email: input.email });
    const deviceUUID = String(input.device_uuid || "").trim().toLowerCase();
    if (clean.error || !clean.email || !clean.normalizedEmail) return json({ error: clean.error || "email_required" }, 400);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(deviceUUID)) return json({ error: "invalid_device_uuid" }, 400);
    const codeHash = await emailCodeHash(env, clean.email, input.code, "recover");
    const row = await env.DB.prepare(`SELECT id,user_id FROM app_email_codes
      WHERE normalized_email=? AND purpose='recover' AND code_hash=? AND consumed_at IS NULL AND expires_at>?
      ORDER BY id DESC LIMIT 1`).bind(clean.normalizedEmail, codeHash, (/* @__PURE__ */ new Date()).toISOString()).first();
    if (!row) return json({ error: "invalid_or_expired_code" }, 400);
    const deviceHash = await hash(deviceUUID);
    let device = await env.DB.prepare("SELECT id,user_id,subscription_token FROM app_devices WHERE device_uuid_hash=?").bind(deviceHash).first();
    const tokenDevice = await env.DB.prepare("SELECT subscription_token,platform,app_version,model FROM app_devices WHERE user_id=? ORDER BY id DESC LIMIT 1").bind(row.user_id).first();
    const subscriptionToken = tokenDevice?.subscription_token || randomToken();
    if (device && device.user_id !== row.user_id) {
      await env.DB.prepare("UPDATE app_devices SET user_id=?,subscription_token=?,last_seen_at=CURRENT_TIMESTAMP WHERE id=?").bind(row.user_id, subscriptionToken, device.id).run();
    } else if (!device) {
      const result = await env.DB.prepare("INSERT INTO app_devices(user_id,device_uuid_hash,subscription_token,platform,app_version,model) VALUES(?,?,?,?,?,?)").bind(row.user_id, deviceHash, subscriptionToken, String(input.platform || "android"), String(input.app_version || ""), String(input.device_model || "")).run();
      device = { id: Number(result.meta.last_row_id), user_id: row.user_id, subscription_token: subscriptionToken };
    }
    await enforceDeviceLimit(env, row.user_id, device.id);
    await env.DB.prepare("UPDATE app_email_codes SET consumed_at=CURRENT_TIMESTAMP WHERE id=?").bind(row.id).run();
    const accessToken = randomToken();
    const sessionExpiresAt = new Date(Date.now() + 30 * 864e5).toISOString();
    await env.DB.prepare("INSERT INTO app_sessions(user_id,device_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(row.user_id, device.id, await hash(accessToken), sessionExpiresAt).run();
    return json({ ...await appUserPayload(request, env, row.user_id, device.id), access_token: accessToken, accessTokenExpiresAt: sessionExpiresAt });
  }
  if (request.method === "POST" && url.pathname === "/api/app/bootstrap") {
    const input = await body(request);
    const deviceUUID = String(input.device_uuid || "").trim().toLowerCase();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(deviceUUID)) return json({ error: "invalid_device_uuid" }, 400);
    const deviceHash = await hash(deviceUUID);
    const platform = String(input.platform || "android").trim().toLowerCase();
    const isDesktop = ["windows", "mac", "macos", "linux", "web", "desktop", "pc"].some((p) => platform.includes(p));
    const guestPrefix = isDesktop ? "Web Guest" : "App Guest";
    let device = await env.DB.prepare("SELECT id,user_id,subscription_token FROM app_devices WHERE device_uuid_hash=?").bind(deviceHash).first();
    if (!device) {
      const upstream = await env.DB.prepare("SELECT id FROM upstreams WHERE enabled=1 ORDER BY id LIMIT 1").first();
      if (!upstream) return json({ error: "no_upstream_available" }, 503);
      const subscriptionToken = randomToken();
      const expiresAt = new Date(Date.now() + 3 * 864e5).toISOString();
      const userResult = await env.DB.prepare("INSERT INTO users(name,token_hash,token_hint,upstream_id,expires_at,node_limit,device_limit,plan_id) VALUES(?,?,?,?,?,?,2,'trial_1d')").bind(`${guestPrefix} ${subscriptionToken.slice(0, 6)}`, await hash(subscriptionToken), subscriptionToken.slice(0, 8), upstream.id, expiresAt, 5).run();
      const userId = Number(userResult.meta.last_row_id);
      const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,COALESCE(plan_id,'trial_1d') plan_id,dns_revision FROM users WHERE id=?").bind(userId).first();
      if (user) await provisionUser(env, user);
      const deviceResult = await env.DB.prepare("INSERT INTO app_devices(user_id,device_uuid_hash,subscription_token,platform,app_version,model) VALUES(?,?,?,?,?,?)").bind(userId, deviceHash, subscriptionToken, platform, String(input.app_version || ""), String(input.device_model || "")).run();
      device = { id: Number(deviceResult.meta.last_row_id), user_id: userId, subscription_token: subscriptionToken };
    } else {
      await env.DB.prepare("UPDATE app_devices SET platform=?,app_version=?,model=?,last_seen_at=CURRENT_TIMESTAMP WHERE id=?").bind(platform, String(input.app_version || ""), String(input.device_model || ""), device.id).run();
    }
    const accessToken = randomToken();
    const sessionExpiresAt = new Date(Date.now() + 30 * 864e5).toISOString();
    await env.DB.prepare("INSERT INTO app_sessions(user_id,device_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(device.user_id, device.id, await hash(accessToken), sessionExpiresAt).run();
    return json({ ...await appUserPayload(request, env, device.user_id, device.id), access_token: accessToken, accessTokenExpiresAt: sessionExpiresAt }, 201);
  }
  if (request.method === "GET" && url.pathname === "/api/app/me") {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    return json(await appUserPayload(request, env, session.user_id, session.device_id));
  }
  if (request.method === "GET" && url.pathname === "/api/app/email/status") {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const profile = await userProfile(env, session.user_id);
    return json({ email: profile.email, emailBound: profile.emailBound, emailBoundAt: profile.emailBoundAt });
  }
  if (request.method === "POST" && url.pathname === "/api/app/email/request-code") {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const input = await body(request);
    const clean = cleanProfileInput({ email: input.email });
    if (clean.error || !clean.email || !clean.normalizedEmail) return json({ error: clean.error || "email_required" }, 400);
    const occupied = await env.DB.prepare("SELECT user_id FROM app_user_profiles WHERE normalized_email=? AND user_id<>?").bind(clean.normalizedEmail, session.user_id).first();
    if (occupied) return json({ error: "email_already_bound" }, 409);
    const code = randomCode();
    const expiresAt = new Date(Date.now() + 10 * 6e4).toISOString();
    await env.DB.prepare("INSERT INTO app_email_codes(user_id,email,normalized_email,purpose,code_hash,expires_at) VALUES(?,?,?,?,?,?)").bind(session.user_id, clean.email, clean.normalizedEmail, "bind", await emailCodeHash(env, clean.email, code, "bind"), expiresAt).run();
    const delivery = await sendEmailCode(env, clean.email, code, "bind");
    return json({ ok: true, purpose: "bind", email: clean.email, expiresAt, deliveryConfigured: delivery.configured, delivered: delivery.ok === true });
  }
  if (request.method === "POST" && url.pathname === "/api/app/email/verify-bind") {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const input = await body(request);
    const clean = cleanProfileInput({ email: input.email, nickname: input.nickname });
    if (clean.error || !clean.email || !clean.normalizedEmail) return json({ error: clean.error || "email_required" }, 400);
    const codeHash = await emailCodeHash(env, clean.email, input.code, "bind");
    const row = await env.DB.prepare(`SELECT id FROM app_email_codes
      WHERE user_id=? AND normalized_email=? AND purpose='bind' AND code_hash=? AND consumed_at IS NULL AND expires_at>?
      ORDER BY id DESC LIMIT 1`).bind(session.user_id, clean.normalizedEmail, codeHash, (/* @__PURE__ */ new Date()).toISOString()).first();
    if (!row) return json({ error: "invalid_or_expired_code" }, 400);
    const profile = await upsertUserProfile(env, session.user_id, { email: clean.email, nickname: clean.nickname });
    if (profile.error) return json({ error: profile.error }, profile.error === "email_already_bound" ? 409 : 400);
    await env.DB.prepare("UPDATE app_email_codes SET consumed_at=CURRENT_TIMESTAMP WHERE id=?").bind(row.id).run();
    return json({ ok: true, email: profile.email, emailBound: profile.emailBound, emailBoundAt: profile.emailBoundAt, user: (await appUserPayload(request, env, session.user_id, session.device_id)).user });
  }
  if (request.method === "POST" && (url.pathname === "/api/app/email/bind" || url.pathname === "/api/app/bind-email")) {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const input = await body(request);
    if (!input.email) return json({ error: "email_required" }, 400);
    const profile = await upsertUserProfile(env, session.user_id, { email: input.email, nickname: input.nickname });
    if (profile.error) return json({ error: profile.error }, profile.error === "email_already_bound" ? 409 : 400);
    if (input.nickname) {
      await env.DB.prepare("UPDATE users SET name=? WHERE id=? AND (name LIKE 'App Guest %' OR name LIKE 'Web Guest %')").bind(String(input.nickname).trim().slice(0, 80), session.user_id).run();
    }
    return json({ ok: true, email: profile.email, emailBound: profile.emailBound, emailBoundAt: profile.emailBoundAt, user: (await appUserPayload(request, env, session.user_id, session.device_id)).user });
  }
  if (request.method === "POST" && (url.pathname === "/api/app/profile" || url.pathname === "/api/app/bind")) {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const input = await body(request);
    const profile = await upsertUserProfile(env, session.user_id, input);
    if (profile.error) return json({ error: profile.error }, profile.error === "email_already_bound" ? 409 : 400);
    if (input.nickname) {
      await env.DB.prepare("UPDATE users SET name=? WHERE id=? AND (name LIKE 'App Guest %' OR name LIKE 'Web Guest %')").bind(String(input.nickname).trim().slice(0, 80), session.user_id).run();
    }
    return json({ profile, user: (await appUserPayload(request, env, session.user_id, session.device_id)).user });
  }
  if (request.method === "POST" && url.pathname === "/api/app/order") {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const input = await body(request);
    const planId = String(input.planId || input.plan_id || input.plan || "").trim();
    const plansList = await loadAppPlans(env);
    const plan = plansList.find((item) => item.id === planId || item.id === normalizePlanId(planId));
    if (!plan) return json({ error: "invalid_plan" }, 400);
    const paymentType = String(input.paymentType || input.pay_type || input.channel || "cashier").trim();
    if (!["cashier", "alipay", "wxpay"].includes(paymentType)) return json({ error: "invalid_payment_type" }, 400);
    const provider = paymentType === "alipay" ? "alipay" : paymentType === "wxpay" ? "wechat" : "manual";
    const orderNo = `A${Date.now()}${randomToken(4)}`;
    await env.DB.prepare("INSERT INTO app_orders(order_no,user_id,plan_id,provider,status,amount_cents,currency,metadata_json) VALUES(?,?,?,?,?,?,?,?)").bind(orderNo, session.user_id, plan.id, provider, "pending", plan.amountCents, plan.currency, JSON.stringify({ paymentType })).run();
    const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency,metadata_json FROM app_orders WHERE order_no=?").bind(orderNo).first();
    return json({
      order: order ? appOrderPayload(request, env, order, plan) : null,
      paymentConfigured: appPaymentConfigured(env)
    }, 201);
  }
  const orderMatch = url.pathname.match(/^\/api\/app\/order\/([^/]+)$/);
  if (request.method === "GET" && orderMatch) {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency,metadata_json FROM app_orders WHERE order_no=? OR id=?").bind(orderMatch[1], Number(orderMatch[1]) || -1).first();
    if (!order || order.user_id !== session.user_id) return json({ error: "order_not_found" }, 404);
    const plansList = await loadAppPlans(env);
    const plan = plansList.find((item) => item.id === order.plan_id || item.id === normalizePlanId(order.plan_id)) || plansList[0];
    return json({ order: appOrderPayload(request, env, order, plan) });
  }
  return null;
}
__name(appApi, "appApi");
__name2(appApi, "appApi");
__name22(appApi, "appApi");
function appOrderPayload(request, env, order, plan) {
  const payUrl = `${appPublicBase(request, env)}/app-pay/${encodeURIComponent(order.order_no)}`;
  return {
    id: order.id,
    orderNo: order.order_no,
    planId: order.plan_id,
    status: order.status,
    amountCents: order.amount_cents,
    currency: order.currency,
    payUrl,
    paymentUrl: payUrl,
    checkoutUrl: payUrl,
    plan
  };
}
__name(appOrderPayload, "appOrderPayload");
__name2(appOrderPayload, "appOrderPayload");
__name22(appOrderPayload, "appOrderPayload");
async function appPaymentPage(request, env, orderNo) {
  const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency,metadata_json FROM app_orders WHERE order_no=?").bind(orderNo).first();
  if (!order) return new Response("Order not found", { status: 404 });
  if (order.status === "paid") return new Response('<!doctype html><meta charset="utf-8"><p>Payment already completed. You can return to the app.</p>', { headers: { "content-type": "text/html; charset=utf-8" } });
  if (!appPaymentConfigured(env)) return new Response('<!doctype html><meta charset="utf-8"><p>Payment is not configured. Please set PAYMENT_API_BASE, PAYMENT_PID and PAYMENT_KEY.</p>', { status: 503, headers: { "content-type": "text/html; charset=utf-8" } });
  const plansList = await loadAppPlans(env);
    const plan = plansList.find((item) => item.id === order.plan_id || item.id === normalizePlanId(order.plan_id)) || plansList[0];
  const fields = appPaymentFields(request, env, order, plan);
  const inputs = Object.entries(fields).map(([key, value]) => `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}">`).join("");
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><title>Pay</title></head><body><form id="pay" method="post" action="${escapeHtml(appPaymentBase(env))}/submit.php">${inputs}<button type="submit">Continue to pay</button></form><script>document.getElementById('pay').submit();<\/script></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
__name(appPaymentPage, "appPaymentPage");
__name2(appPaymentPage, "appPaymentPage");
__name22(appPaymentPage, "appPaymentPage");
async function appPaymentReturn(request, env) {
  const orderNo = new URL(request.url).searchParams.get("order") || "";
  const order = orderNo ? await env.DB.prepare("SELECT status FROM app_orders WHERE order_no=?").bind(orderNo).first() : null;
  const paid = order?.status === "paid";
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Payment</title><style>body{font-family:system-ui,sans-serif;margin:0;display:grid;min-height:100vh;place-items:center;background:#f7faf7;color:#102016}.card{width:min(420px,calc(100vw - 32px));border:1px solid #dfe8de;border-radius:18px;background:white;padding:28px;box-shadow:0 18px 50px #10201614}h1{font-size:22px;margin:0 0 10px}p{color:#5d6b61;line-height:1.7}</style></head><body><main class="card"><h1>${paid ? "\u652F\u4ED8\u5DF2\u786E\u8BA4" : "\u652F\u4ED8\u5904\u7406\u4E2D"}</h1><p>${paid ? "\u4F1A\u5458\u5DF2\u5F00\u901A\uFF0C\u8BF7\u8FD4\u56DE\u5916\u8D38\u52A0\u901F\u5668\u5E76\u5237\u65B0\u8BA2\u9605\u3002" : "\u5982\u679C\u5DF2\u7ECF\u5B8C\u6210\u652F\u4ED8\uFF0C\u8BF7\u7A0D\u7B49\u7247\u523B\u540E\u8FD4\u56DE App \u70B9\u51FB\u201C\u6211\u5DF2\u652F\u4ED8\uFF0C\u5237\u65B0\u8BA2\u9605\u201D\u3002"}</p></main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
__name(appPaymentReturn, "appPaymentReturn");
__name2(appPaymentReturn, "appPaymentReturn");
__name22(appPaymentReturn, "appPaymentReturn");
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
}
__name(escapeHtml, "escapeHtml");
__name2(escapeHtml, "escapeHtml");
__name22(escapeHtml, "escapeHtml");
async function appPaymentCallback(request, env) {
  const values = request.method === "POST" ? Array.from((await request.formData()).entries()).reduce((acc, [key, value]) => {
    acc[key] = String(value);
    return acc;
  }, {}) : Object.fromEntries(new URL(request.url).searchParams.entries());
  if (!appPaymentConfigured(env)) return new Response("fail", { status: 503 });
  if (String(values.pid || "") !== String(env.PAYMENT_PID || "") || !values.sign || !await secureEqual(values.sign, appPaymentSign(env, values))) return new Response("fail", { status: 400 });
  const orderNo = String(values.out_trade_no || "");
  const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency FROM app_orders WHERE order_no=?").bind(orderNo).first();
  if (!order) return new Response("fail", { status: 404 });
  const paid = String(values.trade_status || "").toUpperCase() === "TRADE_SUCCESS" || String(values.status || "").toLowerCase() === "paid";
  if (!paid || Number(values.money) !== Number((order.amount_cents / 100).toFixed(2))) return new Response("fail", { status: 400 });
  const plansList = await loadAppPlans(env);
    const plan = plansList.find((item) => item.id === order.plan_id || item.id === normalizePlanId(order.plan_id)) || plansList[0];
  const providerOrderId = String(values.trade_no || "");
  if (order.status === "paid") {
    const existing = await env.DB.prepare("SELECT order_id,applied_at FROM app_order_grants WHERE order_id=?").bind(order.id).first();
    if (!existing) {
      try {
        const legacy = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(order.user_id).first();
        if (legacy) await provisionUser(env, legacy);
      } catch (error) {
        console.log(JSON.stringify({ event: "payment_provision_error", order: order.order_no, error: error instanceof Error ? error.message : String(error) }));
      }
      return new Response("success", { headers: { "content-type": "text/plain; charset=utf-8" } });
    }
  }
  const current = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(order.user_id).first();
  if (!current) return new Response("fail", { status: 404 });
  const baseMs = Math.max(Date.now(), Date.parse(current.expires_at || "") || 0);
  const frozenExpiresAt = new Date(baseMs + plan.days * 864e5).toISOString();
  await env.DB.batch([
    env.DB.prepare("UPDATE app_orders SET status='paid',provider_order_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='paid'").bind(providerOrderId, order.id),
    env.DB.prepare("INSERT OR IGNORE INTO app_order_grants(order_id,user_id,plan_id,days,base_expires_at,expires_at) VALUES(?,?,?,?,?,?)").bind(order.id, order.user_id, plan.id, plan.days, new Date(baseMs).toISOString(), frozenExpiresAt)
  ]);
  const grant = await env.DB.prepare("SELECT order_id,user_id,plan_id,days,base_expires_at,expires_at,applied_at FROM app_order_grants WHERE order_id=?").bind(order.id).first();
  if (!grant) return new Response("fail", { status: 500 });
  if (!grant.applied_at) {
    await env.DB.batch([
      env.DB.prepare("UPDATE users SET expires_at=strftime('%Y-%m-%dT%H:%M:%fZ', datetime(CASE WHEN julianday(expires_at)>julianday('now') THEN expires_at ELSE 'now' END, '+' || ? || ' days')),status='active',plan_id=?,node_limit=MAX(COALESCE(node_limit,0),?) WHERE id=? AND EXISTS(SELECT 1 FROM app_order_grants WHERE order_id=? AND applied_at IS NULL)").bind(grant.days, normalizePlanId(plan.id), plan.nodeLimit, order.user_id, order.id),
      env.DB.prepare("UPDATE app_order_grants SET applied_at=CURRENT_TIMESTAMP WHERE order_id=? AND applied_at IS NULL").bind(order.id)
    ]);
    await env.DB.prepare("UPDATE app_order_grants SET expires_at=(SELECT expires_at FROM users WHERE id=?) WHERE order_id=?").bind(order.user_id, order.id).run();
  }
  try {
    if (plan.id !== "trial_1d") await deprovisionUser(env, order.user_id);
    const updated = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(order.user_id).first();
    if (updated) await provisionUser(env, updated);
  } catch (error) {
    console.log(JSON.stringify({ event: "payment_provision_error", order: order.order_no, error: error instanceof Error ? error.message : String(error) }));
  }
  return new Response("success", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
__name(appPaymentCallback, "appPaymentCallback");
__name2(appPaymentCallback, "appPaymentCallback");
__name22(appPaymentCallback, "appPaymentCallback");

async function enforceDeviceLimit(env, userId, currentDeviceId = null) {
  const user = await env.DB.prepare("SELECT id, device_limit FROM users WHERE id=?").bind(userId).first();
  const limit = Math.max(1, Number(user?.device_limit ?? 2));
  const rows = await env.DB.prepare("SELECT id, last_seen_at FROM app_devices WHERE user_id=? ORDER BY last_seen_at ASC, id ASC").bind(userId).all();
  const allDevices = rows.results || [];
  if (allDevices.length > limit) {
    const candidateDevices = currentDeviceId ? allDevices.filter(d => d.id !== currentDeviceId) : allDevices;
    const toEvictCount = allDevices.length - limit;
    const toEvict = candidateDevices.slice(0, toEvictCount);
    for (const dev of toEvict) {
      try {
        await env.DB.prepare("UPDATE app_sessions SET revoked_at=CURRENT_TIMESTAMP WHERE device_id=? AND revoked_at IS NULL").bind(dev.id).run();
        await env.DB.prepare("DELETE FROM app_sessions WHERE device_id=?").bind(dev.id).run();
        await env.DB.prepare("DELETE FROM app_devices WHERE id=?").bind(dev.id).run();
      } catch (err) {
        console.error("enforceDeviceLimit error:", err);
      }
    }
  }
}
__name(enforceDeviceLimit, "enforceDeviceLimit");

async function adminUserDetail(env, userId) {
  const user = await env.DB.prepare(`SELECT u.id,u.name,u.upstream_id,u.expires_at,u.status,u.node_limit,COALESCE(u.device_limit, 2) device_limit,COALESCE(u.plan_id, 'trial_1d') plan_id,u.dns_revision,u.token_hint,u.created_at,
      p.email,p.phone,p.nickname,p.remark,p.updated_at profile_updated_at,
      (SELECT COUNT(*) FROM user_dns_records WHERE user_id=u.id AND status='active') dns_count
    FROM users u LEFT JOIN app_user_profiles p ON p.user_id=u.id
    WHERE u.id=?`).bind(userId).first();
  if (!user) return null;
  const [devices, orders, dns, access, selectedNodes, availableNodes] = await Promise.all([
    env.DB.prepare("SELECT id,platform,app_version,model,created_at,last_seen_at FROM app_devices WHERE user_id=? ORDER BY last_seen_at DESC,id DESC LIMIT 20").bind(userId).all(),
    env.DB.prepare("SELECT id,order_no,plan_id,provider,status,amount_cents,currency,provider_order_id,created_at,updated_at FROM app_orders WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT 30").bind(userId).all(),
    env.DB.prepare(`SELECT d.id,d.hostname,d.record_type,d.status,d.last_error,d.created_at,n.name node_name,n.protocol
      FROM user_dns_records d LEFT JOIN nodes n ON n.id=d.node_id
      WHERE d.user_id=? ORDER BY d.created_at DESC LIMIT 50`).bind(userId).all(),
    accessSummary(env, userId),
    env.DB.prepare("SELECT node_id FROM user_selected_nodes WHERE user_id=?").bind(userId).all(),
    env.DB.prepare(`SELECT n.id, n.name, n.protocol, u.name as upstream_name, u.id as upstream_id
      FROM nodes n JOIN upstreams u ON u.id=n.upstream_id
      WHERE n.active=1 AND u.enabled=1 ORDER BY u.id, n.id`).all()
  ]);
  return {
    user,
    profile: { email: user.email, phone: user.phone, nickname: user.nickname, remark: user.remark, updatedAt: user.profile_updated_at },
    devices: devices.results,
    orders: orders.results,
    dnsRecords: dns.results,
    access,
    selectedNodeIds: selectedNodes.results.map((r) => r.node_id),
    planSelectedNodeIds: (await env.DB.prepare("SELECT node_id FROM plan_selected_nodes WHERE plan_id=?").bind(normalizePlanId(user.plan_id)).all()).results.map((r) => r.node_id),
    availableNodes: availableNodes.results
  };
}
__name(adminUserDetail, "adminUserDetail");
__name2(adminUserDetail, "adminUserDetail");
__name22(adminUserDetail, "adminUserDetail");
async function adminUpdateUser(request, env, userId) {
  const input = await body(request);
  const existing = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,COALESCE(device_limit,2) device_limit,COALESCE(plan_id,'trial_1d') plan_id,dns_revision FROM users WHERE id=?").bind(userId).first();
  if (!existing) return json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
  const name = input.name == null ? existing.name : String(input.name).trim().slice(0, 80);
  const expiresAt = input.expiresAt == null ? existing.expires_at : new Date(input.expiresAt).toISOString();
  if (!name) return json({ error: "\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
  if (Number.isNaN(Date.parse(expiresAt))) return json({ error: "\u5230\u671F\u65F6\u95F4\u65E0\u6548" }, 400);
  const planId = input.planId == null ? existing.plan_id : normalizePlanId(input.planId);
  const plansList = await loadAppPlans(env, true);
  const targetPlan = plansList.find((p) => p.id === planId);
  const defaultLimitForPlan = planId !== existing.plan_id && targetPlan ? targetPlan.nodeLimit : existing.node_limit;
  const nodeLimit = input.nodeLimit == null ? defaultLimitForPlan : Math.max(1, Math.min(20, Number(input.nodeLimit || defaultLimitForPlan)));
  const deviceLimit = input.deviceLimit == null ? (existing.device_limit ?? 2) : Math.max(1, Math.min(50, Number(input.deviceLimit || existing.device_limit || 2)));
  const status = input.status == null ? existing.status : String(input.status);
  if (!["active", "disabled", "expired"].includes(status)) return json({ error: "\u72B6\u6001\u65E0\u6548" }, 400);
  await env.DB.prepare("UPDATE users SET name=?,expires_at=?,node_limit=?,device_limit=?,plan_id=?,status=? WHERE id=?").bind(name, expiresAt, nodeLimit, deviceLimit, planId, status, userId).run();
  if (deviceLimit < (existing.device_limit ?? 2)) {
    await enforceDeviceLimit(env, userId);
  }
  if (input.profile && typeof input.profile === "object") {
    const profile = await upsertUserProfile(env, userId, input.profile);
    if (profile.error) return json({ error: profile.error }, 400);
  }
  if (status === "disabled") await deprovisionUser(env, userId);
  if (status === "active") {
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(userId).first();
    if (user && Date.parse(user.expires_at) > Date.now()) await provisionUser(env, user);
  }
  return json(await adminUserDetail(env, userId));
}
__name(adminUpdateUser, "adminUpdateUser");
__name2(adminUpdateUser, "adminUpdateUser");
__name22(adminUpdateUser, "adminUpdateUser");
async function adminManageDns(request, env, userId) {
  let input;
  try {
    input = await body(request);
  } catch {
    return json({ error: "\u8BF7\u6C42\u5185\u5BB9\u5FC5\u987B\u4E3A JSON \u5BF9\u8C61" }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "\u8BF7\u6C42\u5185\u5BB9\u5FC5\u987B\u4E3A JSON \u5BF9\u8C61" }, 400);
  const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(userId).first();
  if (!user) return json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
  const nodeLimit = input.nodeLimit === void 0 ? user.node_limit : input.nodeLimit;
  if (!Number.isInteger(nodeLimit) || nodeLimit < 1 || nodeLimit > 20) return json({ error: "\u8282\u70B9\u989D\u5EA6\u5FC5\u987B\u4E3A 1 \u5230 20 \u7684\u6574\u6570" }, 400);
  if (user.status !== "active" || !(Date.parse(user.expires_at) > Date.now())) return json({ error: "\u8D26\u53F7\u5DF2\u5230\u671F\u6216\u505C\u7528\uFF0C\u8BF7\u5148\u7EED\u671F\u6216\u542F\u7528\u8D26\u53F7" }, 409);
  const countActive = /* @__PURE__ */ __name2(async () => Number((await env.DB.prepare("SELECT COUNT(*) count FROM user_dns_records WHERE user_id=? AND status='active'").bind(userId).first())?.count || 0), "countActive");
  const before = await countActive();
  const prune = nodeLimit < user.node_limit;
  if (Array.isArray(input.selectedNodeIds)) {
    const cleanIds = Array.from(new Set(input.selectedNodeIds.map(Number).filter(Number.isInteger)));
    await env.DB.prepare("DELETE FROM user_selected_nodes WHERE user_id=?").bind(userId).run();
    for (const nid of cleanIds) {
      await env.DB.prepare("INSERT OR IGNORE INTO user_selected_nodes(user_id, node_id) VALUES(?,?)").bind(userId, nid).run();
    }
    if (cleanIds.length > 0) {
      const activeRows = await env.DB.prepare("SELECT id,node_id,cloudflare_record_id,zone_id FROM user_dns_records WHERE user_id=? AND status='active'").bind(userId).all();
      for (const row of activeRows.results) {
        if (!cleanIds.includes(row.node_id)) {
          try {
            await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
            await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(row.id).run();
          } catch (e) {
          }
        }
      }
    }
  }
  if (input.planId !== void 0) {
    const cleanPlanId = normalizePlanId(input.planId);
    await env.DB.prepare("UPDATE users SET plan_id=? WHERE id=?").bind(cleanPlanId, userId).run();
    user.plan_id = cleanPlanId;
  }
  if (input.nodeLimit !== void 0) {
    await env.DB.prepare("UPDATE users SET node_limit=? WHERE id=?").bind(nodeLimit, userId).run();
    user.node_limit = nodeLimit;
  }
  let result = { created: 0, removed: 0, failed: 0 }, warning = null;
  try {
    result = await provisionUser(env, user, { prune: true });
  } catch (error) {
    result.failed++;
    warning = error instanceof Error ? error.message : "DNS \u5206\u914D\u5931\u8D25";
  }
  const activeDnsCount2 = await countActive();
  if (warning) {
    result.created = Math.max(0, activeDnsCount2 - before);
    result.removed = Math.max(0, before - activeDnsCount2);
  }
  const missing = Math.max(0, nodeLimit - activeDnsCount2);
  if (result.failed || missing) warning = [warning, result.failed ? "\u90E8\u5206 DNS \u64CD\u4F5C\u5931\u8D25" : null, missing ? `\u4ECD\u7F3A ${missing} \u6761\uFF0C\u8BF7\u68C0\u67E5\u53EF\u7528\u8282\u70B9\u6216 DNS \u914D\u7F6E\u540E\u91CD\u8BD5` : null].filter(Boolean).join("\uFF1B");
  return json({ ok: result.failed === 0 && missing === 0, nodeLimit, activeDnsCount: activeDnsCount2, missing, ...result, warning });
}
__name(adminManageDns, "adminManageDns");
__name2(adminManageDns, "adminManageDns");
async function adminUpdatePlan(request, env, rawPlanId) {
  const planId = String(rawPlanId || "").trim();
  if (!planId || !/^[A-Za-z0-9_-]{2,32}$/.test(planId)) {
    return json({ error: "\u5957\u9910\u6807\u8BC6 ID \u683C\u5F0F\u4E0D\u6B63\u786E\uFF082-32 \u4F4D\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u6216\u8FDE\u5B57\u7B26\uFF09" }, 400);
  }
  const input = await body(request);
  const plans = await loadAppPlans(env, true);
  const existing = plans.find((p) => p.id === planId);
  const name = input.name == null ? (existing ? existing.name : planId) : String(input.name).trim().slice(0, 40);
  if (!name) return json({ error: "\u5957\u9910\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
  const amountCents = input.amountCents == null ? (existing ? existing.amountCents : 0) : Math.max(0, Math.round(Number(input.amountCents)));
  const days = input.days == null ? (existing ? existing.days : 30) : Math.max(1, Math.min(3650, Math.round(Number(input.days))));
  const nodeLimit = input.nodeLimit == null ? (existing ? existing.nodeLimit : 10) : Math.max(1, Math.min(20, Math.round(Number(input.nodeLimit))));
  const trafficGb = input.trafficGb == null ? (existing ? existing.trafficGb : 100) : Math.max(1, Math.round(Number(input.trafficGb)));
  const enabled = input.enabled == null ? (existing ? (existing.enabled ? 1 : 0) : 1) : (input.enabled ? 1 : 0);
  const sortOrder = existing ? (existing.sortOrder || 0) : (plans.length + 1);

  await env.DB.prepare(`INSERT INTO app_plans(id,name,amount_cents,currency,days,node_limit,traffic_gb,sort_order,enabled,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name,amount_cents=excluded.amount_cents,days=excluded.days,node_limit=excluded.node_limit,traffic_gb=excluded.traffic_gb,enabled=excluded.enabled,updated_at=CURRENT_TIMESTAMP`)
    .bind(planId, name, amountCents, existing?.currency || "CNY", days, nodeLimit, trafficGb, sortOrder, enabled).run();
  if (Array.isArray(input.selectedNodeIds)) {
    const cleanIds = Array.from(new Set(input.selectedNodeIds.map(Number).filter(Number.isInteger)));
    await env.DB.prepare("DELETE FROM plan_selected_nodes WHERE plan_id=?").bind(planId).run();
    for (const nid of cleanIds) {
      await env.DB.prepare("INSERT OR IGNORE INTO plan_selected_nodes(plan_id, node_id) VALUES(?,?)").bind(planId, nid).run();
    }
  }
  let syncedUsers = 0;
  const pendingUserIds = [];
  if (input.syncUsers !== false) {
    const activeUsers = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,plan_id,dns_revision FROM users WHERE status='active' AND expires_at>datetime('now') AND COALESCE(plan_id,'trial_1d')=?").bind(planId).all();
    for (const u of activeUsers.results || []) {
      if ((env.__subrequests || 0) >= 25) {
        pendingUserIds.push(u.id);
        continue;
      }
      try {
        await provisionUser(env, u, { prune: true });
        syncedUsers++;
      } catch {
        pendingUserIds.push(u.id);
      }
    }
  }
  return json({ ok: true, planId, syncedUsers, pendingUserIds });
}
__name(adminUpdatePlan, "adminUpdatePlan");

async function api(request, env, url) {
  if (!await authorized(request, env)) return json({ error: "\u672A\u6388\u6743" }, 401);
  if (request.method === "POST" && url.pathname === "/api/maintenance/expire") {
    return json({ expired: await expireUsers(env) });
  }
  if (request.method === "GET" && url.pathname === "/api/dashboard") {
    await expireUsers(env);
    const [upstreams, users, plansList, planNodesRows, availableNodesRows] = await Promise.all([
      env.DB.prepare("SELECT id,name,enabled,last_synced_at,last_error,(SELECT COUNT(*) FROM nodes WHERE upstream_id=upstreams.id AND active=1) node_count FROM upstreams ORDER BY id DESC").all(),
      env.DB.prepare(`SELECT u.id,u.name,u.upstream_id,u.expires_at,u.status,u.node_limit,COALESCE(u.device_limit, 2) device_limit,COALESCE(u.plan_id, 'trial_1d') plan_id,u.token_hint,u.created_at,
        p.email,p.phone,p.nickname,p.remark,
        CASE WHEN u.status='active' AND strftime('%s',u.expires_at)>strftime('%s','now') THEN strftime('%s',u.expires_at)-strftime('%s','now') ELSE 0 END remaining_seconds,
        (SELECT COUNT(*) FROM user_dns_records WHERE user_id=u.id AND status='active') dns_count,
        (SELECT COUNT(*) FROM user_dns_records WHERE user_id=u.id AND status='error') error_dns_count,
        (SELECT COUNT(*) FROM app_devices WHERE user_id=u.id) device_count,
        (SELECT MAX(last_seen_at) FROM app_devices WHERE user_id=u.id) last_seen_at,
        (SELECT COUNT(*) FROM app_orders WHERE user_id=u.id) order_count,
        (SELECT status FROM app_orders WHERE user_id=u.id ORDER BY created_at DESC,id DESC LIMIT 1) last_order_status,
        (SELECT plan_id FROM app_orders WHERE user_id=u.id AND status='paid' ORDER BY updated_at DESC,id DESC LIMIT 1) paid_plan_id
        FROM users u LEFT JOIN app_user_profiles p ON p.user_id=u.id
        ORDER BY u.id DESC LIMIT 500`).all(),
      loadAppPlans(env, true),
      env.DB.prepare("SELECT plan_id, node_id FROM plan_selected_nodes").all().catch(() => ({ results: [] })),
      env.DB.prepare("SELECT n.id, n.name, n.protocol, u.name as upstream_name, u.id as upstream_id FROM nodes n JOIN upstreams u ON u.id=n.upstream_id WHERE n.active=1 AND u.enabled=1 ORDER BY u.id, n.id").all().catch(() => ({ results: [] }))
    ]);
    const activeNodes = availableNodesRows.results || [];
    const rawPlanNodes = planNodesRows.results || [];
    const plansWithNodes = plansList.map((p) => {
      const rawIds = rawPlanNodes.filter((r) => r.plan_id === p.id).map((r) => Number(r.node_id));
      const userCount = (users.results || []).filter((u) => normalizePlanId(u.plan_id) === p.id).length;
      return { ...p, selectedNodeIds: rawIds, userCount };
    });
    return json({ upstreams: upstreams.results, users: users.results, plans: plansWithNodes, availableNodes: activeNodes, dnsSuffix: env.DNS_SUFFIX });
  }
  const planManageMatch = url.pathname.match(/^\/api\/plans\/([A-Za-z0-9_-]+)$/);
  if ((request.method === "POST" || request.method === "PATCH") && planManageMatch) {
    return adminUpdatePlan(request, env, planManageMatch[1]);
  }
  if (request.method === "DELETE" && planManageMatch) {
    const planId = planManageMatch[1];
    const defaultIds = ["trial_1d", "basic_monthly", "advanced_monthly", "residential_monthly"];
    if (defaultIds.includes(planId)) {
      return json({ error: "\u7CFB\u7EDF\u9ED8\u8BA4\u5957\u9910\u4E0D\u53EF\u5220\u9664\uFF0C\u5982\u9700\u505C\u7528\u8BF7\u70B9\u51FB\u300C\u4E0B\u67B6\u300D\u9690\u85CF" }, 400);
    }
    const userCount = await env.DB.prepare("SELECT COUNT(*) as count FROM users WHERE COALESCE(plan_id, 'trial_1d')=?").bind(planId).first();
    if (userCount && Number(userCount.count) > 0) {
      return json({ error: `\u8BE5\u5957\u9910\u4E0B\u4ECD\u6709 ${userCount.count} \u4F4D\u7528\u6237\u5173\u8054\uFF0C\u65E0\u6CD5\u76F4\u63A5\u5220\u9664\u3002\u8BF7\u5148\u8FC1\u79FB\u7528\u6237\u6216\u70B9\u51FB\u300C\u4E0B\u67B6\u300D\u9690\u85CF` }, 400);
    }
    await env.DB.prepare("DELETE FROM plan_selected_nodes WHERE plan_id=?").bind(planId).run();
    await env.DB.prepare("DELETE FROM app_plans WHERE id=?").bind(planId).run();
    return json({ ok: true });
  }
  const kickDeviceMatch = url.pathname.match(/^\/api\/users\/(\d+)\/devices\/(\d+)\/kick$/);
  if (request.method === "POST" && kickDeviceMatch) {
    const userId = Number(kickDeviceMatch[1]);
    const deviceId = Number(kickDeviceMatch[2]);
    const dev = await env.DB.prepare("SELECT id FROM app_devices WHERE id=? AND user_id=?").bind(deviceId, userId).first();
    if (!dev) return json({ error: "\u8BBE\u5907\u4E0D\u5B58\u5728\u6216\u4E0D\u5C5E\u4E8E\u8BE5\u7528\u6237" }, 404);
    await env.DB.prepare("UPDATE app_sessions SET revoked_at=CURRENT_TIMESTAMP WHERE device_id=? AND revoked_at IS NULL").bind(deviceId).run();
    await env.DB.prepare("DELETE FROM app_sessions WHERE device_id=?").bind(deviceId).run();
    await env.DB.prepare("DELETE FROM app_devices WHERE id=?").bind(deviceId).run();
    return json({ ok: true });
  }
  const dnsManageMatch = url.pathname.match(/^\/api\/users\/(\d+)\/dns$/);
  if (request.method === "POST" && dnsManageMatch) return adminManageDns(request, env, Number(dnsManageMatch[1]));
  const userDetailMatch = url.pathname.match(/^\/api\/users\/(\d+)$/);
  if (request.method === "GET" && url.pathname === "/api/admin/orders") {
    const page = Math.max(1, Math.min(1e5, Math.floor(Number(url.searchParams.get("page")) || 1)));
    const orders = await env.DB.prepare(`SELECT o.id,o.order_no,o.user_id,o.plan_id,o.status,o.amount_cents,o.currency,o.created_at,u.name user_name
      FROM app_orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.id DESC LIMIT 50 OFFSET ?`).bind((page - 1) * 50).all();
    return json({ orders: orders.results, page, hasMore: orders.results.length === 50 });
  }
  if (request.method === "GET" && userDetailMatch) {
    const detail = await adminUserDetail(env, Number(userDetailMatch[1]));
    return detail ? json(detail) : json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
  }
  if (request.method === "PATCH" && userDetailMatch) {
    return adminUpdateUser(request, env, Number(userDetailMatch[1]));
  }
  const accessMatch = url.pathname.match(/^\/api\/users\/(\d+)\/accesses$/);
  if (request.method === "GET" && accessMatch) {
    const userId = Number(accessMatch[1]);
    const exists = await env.DB.prepare("SELECT id FROM users WHERE id=?").bind(userId).first();
    if (!exists) return json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
    return json(await accessSummary(env, userId));
  }
  if (request.method === "POST" && url.pathname === "/api/upstreams") {
    const input = await body(request);
    const name = input.name?.trim();
    const raw = input.subscriptionUrl?.trim();
    if (!name || !raw) return json({ error: "\u540D\u79F0\u548C\u8BA2\u9605\u5730\u5740/\u8282\u70B9\u94FE\u63A5\u5FC5\u586B" }, 400);
    if (/^https?:\/\//i.test(raw)) {
      const result = await env.DB.prepare("INSERT INTO upstreams(name,subscription_url) VALUES(?,?)").bind(name, raw).run();
      return json({ id: result.meta.last_row_id }, 201);
    } else {
      const parsedNodes = await parseSubscription(raw);
      if (parsedNodes.length === 0) {
        return json({ error: "\u672A\u80FD\u8BC6\u522B\u51FA\u6709\u6548\u8282\u70B9\u94FE\u63A5\uFF0C\u8BF7\u786E\u4FDD\u5305\u542B vless://\u3001vmess://\u3001trojan://\u3001ss:// \u6216\u6807\u51C6 Base64" }, 400);
      }
      const b64Payload = btoa(unescape(encodeURIComponent(raw)));
      const manualUrl = "manual://" + (b64Payload.length <= 4e3 ? b64Payload : "stored");
      const result = await env.DB.prepare("INSERT INTO upstreams(name,subscription_url) VALUES(?,?)").bind(name, manualUrl).run();
      const upstreamId = Number(result.meta.last_row_id);
      const statements = parsedNodes.map(
        (node) => env.DB.prepare(`INSERT INTO nodes(upstream_id,fingerprint,name,protocol,original_server,original_uri,active,updated_at)
          VALUES(?,?,?,?,?,?,1,CURRENT_TIMESTAMP)
          ON CONFLICT(upstream_id,fingerprint) DO UPDATE SET name=excluded.name,protocol=excluded.protocol,original_server=excluded.original_server,original_uri=excluded.original_uri,active=1,updated_at=CURRENT_TIMESTAMP`).bind(upstreamId, node.fingerprint, localizedNodeName(node.name, upstreamId), node.protocol, node.server, node.originalUri)
      );
      await env.DB.batch(statements);
      await env.DB.prepare("UPDATE upstreams SET last_synced_at=CURRENT_TIMESTAMP,last_error=NULL WHERE id=?").bind(upstreamId).run();
      return json({ id: upstreamId, importedNodes: parsedNodes.length }, 201);
    }
  }
  const syncMatch = url.pathname.match(/^\/api\/upstreams\/(\d+)\/sync$/);
  if (request.method === "POST" && syncMatch) {
    const upstreamId = Number(syncMatch[1]);
    const result = await syncUpstream(env, upstreamId);
    await reconcileUpstream(env, upstreamId);
    return json(result);
  }
  const deleteUpstreamMatch = url.pathname.match(/^\/api\/upstreams\/(\d+)(?:\/delete)?$/);
  if ((request.method === "DELETE" || request.method === "POST") && deleteUpstreamMatch) {
    const upstreamId = Number(deleteUpstreamMatch[1]);
    const upstream = await env.DB.prepare("SELECT id, name FROM upstreams WHERE id=?").bind(upstreamId).first();
    if (!upstream) return json({ error: "\u4E0A\u6E38\u4E0D\u5B58\u5728" }, 404);
    const fallback = await env.DB.prepare("SELECT id FROM upstreams WHERE id!=? ORDER BY enabled DESC, id ASC LIMIT 1").bind(upstreamId).first();
    const refUsers = await env.DB.prepare("SELECT COUNT(*) count FROM users WHERE upstream_id=?").bind(upstreamId).first();
    if (Number(refUsers?.count || 0) > 0 && !fallback) {
      return json({ error: "\u8BE5\u4E0A\u6E38\u662F\u5F53\u524D\u552F\u4E00\u4E0A\u6E38\u4E14\u4ECD\u6709\u5173\u8054\u7528\u6237\uFF0C\u8BF7\u5148\u6DFB\u52A0\u5176\u4ED6\u4E0A\u6E38\u540E\u518D\u5220\u9664" }, 409);
    }
    const activeDnsRows = await env.DB.prepare(`SELECT d.id, d.user_id, d.cloudflare_record_id, d.zone_id
      FROM user_dns_records d JOIN nodes n ON n.id = d.node_id
      WHERE n.upstream_id = ? AND d.status = 'active'`).bind(upstreamId).all();
    const affectedUserIds = new Set();
    let removedDns = 0;
    for (const row of activeDnsRows.results || []) {
      affectedUserIds.add(Number(row.user_id));
      if ((env.__subrequests || 0) < 30) {
        try {
          await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
          removedDns++;
        } catch {}
      }
    }
    if (fallback) {
      const directUsers = await env.DB.prepare("SELECT id FROM users WHERE upstream_id=? AND status='active' AND expires_at>datetime('now')").bind(upstreamId).all();
      for (const u of directUsers.results || []) affectedUserIds.add(Number(u.id));
      await env.DB.prepare("UPDATE users SET upstream_id=? WHERE upstream_id=?").bind(fallback.id, upstreamId).run();
    }
    await env.DB.batch([
      env.DB.prepare("DELETE FROM user_selected_nodes WHERE node_id IN (SELECT id FROM nodes WHERE upstream_id=?)").bind(upstreamId),
      env.DB.prepare("DELETE FROM plan_selected_nodes WHERE node_id IN (SELECT id FROM nodes WHERE upstream_id=?)").bind(upstreamId),
      env.DB.prepare("DELETE FROM user_dns_records WHERE node_id IN (SELECT id FROM nodes WHERE upstream_id=?)").bind(upstreamId),
      env.DB.prepare("DELETE FROM nodes WHERE upstream_id=?").bind(upstreamId),
      env.DB.prepare("DELETE FROM upstreams WHERE id=?").bind(upstreamId)
    ]);
    const pendingUserIds = [];
    for (const uid of affectedUserIds) {
      if ((env.__subrequests || 0) >= 28) {
        pendingUserIds.push(uid);
        continue;
      }
      try {
        const u = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,plan_id,dns_revision FROM users WHERE id=? AND status='active' AND expires_at>datetime('now')").bind(uid).first();
        if (u) await provisionUser(env, u, { prune: true });
      } catch {
        pendingUserIds.push(uid);
      }
    }
    return json({ ok: true, removedDns, pendingUserIds });
  }
  if (request.method === "POST" && url.pathname === "/api/users") {
    const input = await body(request);
    if (!input.name || !input.upstreamId || !input.expiresAt || Number.isNaN(Date.parse(input.expiresAt))) return json({ error: "\u7528\u6237\u3001\u4E0A\u6E38\u548C\u5230\u671F\u65F6\u95F4\u5FC5\u586B" }, 400);
    const token = randomToken();
    const nodeLimit = Math.max(1, Math.min(20, Number(input.nodeLimit || 5)));
    const deviceLimit = Math.max(1, Math.min(50, Number(input.deviceLimit || 2)));
    const planId = normalizePlanId(input.planId || "trial_1d");
    const result = await env.DB.prepare("INSERT INTO users(name,token_hash,token_hint,upstream_id,expires_at,node_limit,device_limit,plan_id) VALUES(?,?,?,?,?,?,?,?)").bind(input.name.trim(), await hash(token), token.slice(0, 6), input.upstreamId, new Date(input.expiresAt).toISOString(), nodeLimit, deviceLimit, planId).run();
    const userId = Number(result.meta.last_row_id);
    const selectedNodeIds = Array.from(new Set((input.selectedNodeIds || []).map(Number).filter(Number.isInteger))).slice(0, nodeLimit);
    for (const nodeId of selectedNodeIds) {
      const usePool = input.pool || selectedNodeIds.length > 0;
      const sql = usePool ? "INSERT OR IGNORE INTO user_selected_nodes(user_id,node_id) SELECT ?,id FROM nodes WHERE id=? AND active=1" : "INSERT OR IGNORE INTO user_selected_nodes(user_id,node_id) SELECT ?,id FROM nodes WHERE id=? AND upstream_id=? AND active=1";
      const statement = usePool ? env.DB.prepare(sql).bind(userId, nodeId) : env.DB.prepare(sql).bind(userId, nodeId, input.upstreamId);
      await statement.run();
    }
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(userId).first();
    const provision = user ? await provisionUser(env, user) : { created: 0, failed: 0 };
    return json({ id: userId, token, subscriptionUrl: `${new URL(request.url).origin}/s/${token}`, ...provision }, 201);
  }
  if (request.method === "GET" && url.pathname === "/api/nodes") {
    const upstreamParam = url.searchParams.get("upstreamId");
    if (upstreamParam && url.searchParams.get("scope") === "upstream") {
      const upstreamId = Math.max(1, Number(upstreamParam));
      const nodes2 = await env.DB.prepare("SELECT id,name,protocol FROM nodes WHERE upstream_id=? AND active=1 ORDER BY id").bind(upstreamId).all();
      return json({ nodes: nodes2.results, pooled: false });
    }
    const rows = await env.DB.prepare(`SELECT n.id,n.fingerprint,n.name,n.protocol,n.original_server,n.original_uri,n.upstream_id,u.name source_name
      FROM nodes n JOIN upstreams u ON u.id=n.upstream_id
      WHERE n.active=1 AND u.enabled=1 ORDER BY u.id,n.id`).all();
    const seen = /* @__PURE__ */ new Set();
    const nodes = rows.results.filter((node) => {
      const key = connectionIdentity(node.original_uri, node.protocol);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map((node) => ({ id: node.id, name: node.name, protocol: node.protocol, sourceName: node.source_name }));
    return json({ nodes, pooled: true });
  }
  const disableMatch = url.pathname.match(/^\/api\/users\/(\d+)\/disable$/);
  if (request.method === "POST" && disableMatch) {
    const id = Number(disableMatch[1]);
    const result = await deprovisionUser(env, id);
    await env.DB.prepare("UPDATE users SET status='disabled' WHERE id=?").bind(id).run();
    return json(result);
  }
  const forceRefreshMatch = url.pathname.match(/^\/api\/users\/(\d+)\/force-subscription-refresh$/);
  if (request.method === "POST" && forceRefreshMatch) {
    const id = Number(forceRefreshMatch[1]);
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(id).first();
    if (!user) return json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
    if (user.status !== "active" || Date.parse(user.expires_at) <= Date.now()) return json({ error: "\u4EC5\u53EF\u5F3A\u5236\u66F4\u65B0\u6709\u6548\u8BA2\u9605" }, 409);
    const removed = await deprovisionUser(env, id);
    if (removed.failed) return json({ error: `\u65E7 DNS \u5220\u9664\u5931\u8D25\uFF1A${removed.failed} \u6761\uFF0C\u8BF7\u91CD\u8BD5`, ...removed }, 502);
    await env.DB.prepare("UPDATE users SET dns_revision=dns_revision+1 WHERE id=?").bind(id).run();
    const refreshed = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(id).first();
    const provision = refreshed ? await provisionUser(env, refreshed) : { created: 0, failed: 1 };
    if (provision.failed) return json({ error: `\u65B0 DNS \u521B\u5EFA\u5931\u8D25\uFF1A${provision.failed} \u6761`, ...removed, ...provision }, 502);
    return json({ ok: true, revision: refreshed?.dns_revision, ...removed, ...provision });
  }
  const renewMatch = url.pathname.match(/^\/api\/users\/(\d+)\/renew$/);
  if (request.method === "POST" && renewMatch) {
    const id = Number(renewMatch[1]);
    const input = await body(request);
    if (!input.expiresAt || Number.isNaN(Date.parse(input.expiresAt))) return json({ error: "\u5230\u671F\u65F6\u95F4\u65E0\u6548" }, 400);
    const existing = await env.DB.prepare("SELECT id,node_limit,expires_at,status FROM users WHERE id=?").bind(id).first();
    if (!existing) return json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
    if (Date.parse(input.expiresAt) <= Math.max(Date.now(), Date.parse(existing.expires_at))) return json({ error: "\u7EED\u671F\u65F6\u95F4\u5FC5\u987B\u665A\u4E8E\u5F53\u524D\u6709\u6548\u671F\u548C\u5F53\u524D\u65F6\u95F4" }, 400);
    if (existing.status === "disabled") return json({ error: "\u8BF7\u5148\u542F\u7528\u8D26\u53F7\u518D\u7EED\u671F" }, 409);
    const nodeLimit = input.nodeLimit == null ? existing.node_limit : Number(input.nodeLimit);
    if (!Number.isInteger(nodeLimit) || nodeLimit < 1 || nodeLimit > 20) return json({ error: "\u8282\u70B9\u6570\u91CF\u5FC5\u987B\u4E3A 1 \u5230 20 \u7684\u6574\u6570" }, 400);
    await env.DB.prepare("UPDATE users SET expires_at=?,status='active',node_limit=? WHERE id=?").bind(new Date(input.expiresAt).toISOString(), nodeLimit, id).run();
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(id).first();
    return json(user ? await provisionUser(env, user) : { error: "\u7528\u6237\u4E0D\u5B58\u5728" }, user ? 200 : 404);
  }
  return json({ error: "\u63A5\u53E3\u4E0D\u5B58\u5728" }, 404);
}
__name(api, "api");
__name2(api, "api");
__name22(api, "api");
async function subscription(request, env, token) {
  const user = await env.DB.prepare("SELECT id,status,expires_at FROM users WHERE token_hash=?").bind(await hash(token)).first();
  if (!user) return new Response("\u8BA2\u9605\u4E0D\u5B58\u5728", { status: 404 });
  if (user.status !== "active" || Date.parse(user.expires_at) <= Date.now()) {
    if (user.status === "active") {
      await deprovisionUser(env, user.id);
      await env.DB.prepare("UPDATE users SET status='expired' WHERE id=?").bind(user.id).run();
    }
    return new Response("\u8BA2\u9605\u5DF2\u5230\u671F\u6216\u505C\u7528", { status: 410 });
  }
  await recordSubscriptionAccess(request, env, user.id);
  const rows = await env.DB.prepare(`SELECT n.name,n.protocol,n.original_uri,d.hostname FROM user_dns_records d JOIN nodes n ON n.id=d.node_id
    WHERE d.user_id=? AND d.status='active' AND n.active=1 ORDER BY n.name`).bind(user.id).all();
  const encoded = encodeSubscription(rows.results.map((row) => rewriteNode(row.original_uri, row.protocol, row.hostname, row.name)));
  return new Response(encoded, { headers: { "content-type": "text/plain; charset=utf-8", "subscription-userinfo": `expire=${Math.floor(Date.parse(user.expires_at) / 1e3)}`, "cache-control": "no-store" } });
}
__name(subscription, "subscription");
__name2(subscription, "subscription");
__name22(subscription, "subscription");
var emailTestHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Email Test</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#152238;background:#f5f7fb}body{margin:0}.wrap{max-width:760px;margin:40px auto;padding:0 18px}.card{background:white;border:1px solid #e5e9f0;border-radius:12px;padding:20px;margin:16px 0;box-shadow:0 6px 22px #1831530a}label{display:block;margin:12px 0 6px;font-weight:650}input,button,textarea{box-sizing:border-box;width:100%;padding:11px 12px;border:1px solid #ccd3df;border-radius:8px;font:inherit}button{background:#2265e5;color:white;border:0;cursor:pointer;margin-top:10px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.muted{color:#667085}pre{white-space:pre-wrap;background:#101828;color:#e6edf3;border-radius:10px;padding:14px;min-height:120px}</style></head><body><main class="wrap"><h1>\u90AE\u7BB1\u7ED1\u5B9A\u6D4B\u8BD5</h1><p class="muted">\u4E34\u65F6\u6D4B\u8BD5\u9875\u3002\u9700\u8981\u7C98\u8D34 App bootstrap \u6216\u767B\u5F55\u540E\u62FF\u5230\u7684 access_token\u3002</p><section class="card"><label>Access Token</label><textarea id="token" rows="3" placeholder="Bearer token\uFF0C\u4E0D\u9700\u8981\u5199 Bearer"></textarea><label>\u90AE\u7BB1</label><input id="email" placeholder="user@example.com"><label>\u9A8C\u8BC1\u7801</label><input id="code" placeholder="\u6536\u5230\u90AE\u4EF6\u540E\u7684 6 \u4F4D\u9A8C\u8BC1\u7801"><div class="grid"><button onclick="sendCode()">\u53D1\u9001\u7ED1\u5B9A\u9A8C\u8BC1\u7801</button><button onclick="verifyBind()">\u9A8C\u8BC1\u5E76\u7ED1\u5B9A</button><button onclick="status()">\u67E5\u8BE2\u7ED1\u5B9A\u72B6\u6001</button><button onclick="me()">\u67E5\u8BE2 /me</button></div></section><section class="card"><h2>\u7ED3\u679C</h2><pre id="out"></pre></section></main><script>
const out=document.querySelector('#out');function show(x){out.textContent=typeof x==='string'?x:JSON.stringify(x,null,2)}function headers(){return {'content-type':'application/json','authorization':'Bearer '+document.querySelector('#token').value.trim()}}
async function call(path,body){const r=await fetch(path,{method:body?'POST':'GET',headers:headers(),body:body?JSON.stringify(body):undefined});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}show({status:r.status,response:d});return d}
async function sendCode(){await call('/api/app/email/request-code',{email:email.value.trim()})}
async function verifyBind(){await call('/api/app/email/verify-bind',{email:email.value.trim(),code:code.value.trim()})}
async function status(){await call('/api/app/email/status')}
async function me(){await call('/api/app/me')}
<\/script></body></html>`;
var DESKTOP_RELEASES = [
  {
    platform: "windows",
    version: "4.2.0",
    build: 40200,
    url: "https://pub-a875cd2b61b44fd0b04710f9bb172bdb.r2.dev/desktop/%E5%A4%96%E8%B4%B8%E5%8A%A0%E9%80%9F%E5%99%A8.exe",
    size: 48795538,
    sha256: "10563ae1b93865fb4f642b6be45329c4187777385b1a6a0796856f89a92b7a1f",
    notes: "Windows \u5BA2\u6237\u7AEF\u4F18\u5316\uFF1A\u5B89\u88C5\u4E0E\u66F4\u65B0\u5168\u7A0B\u96F6 UAC \u63D0\u6743\uFF0C\u652F\u6301\u76F4\u63A5\u8986\u76D6\u5347\u7EA7\uFF1B\u4F18\u5316\u672C\u5730\u8FD0\u884C\u73AF\u5883\u7A33\u5B9A\u6027\u3002",
    published_at: "2026-11-13T14:20:00Z"
  }
];
var APPCAST_TITLE = "\u5916\u8D38\u52A0\u901F\u5668";
function appcastEscape(v) {
  return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
__name(appcastEscape, "appcastEscape");
function buildAppcastXml(releases) {
  var items = [];
  for (var i = 0; i < releases.length; i++) {
    var r = releases[i];
    if (!r || !r.version || !r.url) continue;
    var os = String(r.platform || "windows").toLowerCase();
    if (os === "win" || os === "win32") os = "windows";
    if (os !== "windows" && os !== "macos" && os !== "linux") continue;
    var enclosure = '<enclosure url="' + appcastEscape(r.url) + '" sparkle:version="' + appcastEscape(r.version) + '" sparkle:os="' + os + '" length="' + (r.size || 0) + '" type="application/octet-stream" />';
    var notes = r.notes ? "<description>" + appcastEscape(r.notes) + "</description><sparkle:releaseNotesLink>" + appcastEscape(r.notes) + "</sparkle:releaseNotesLink>" : "";
    items.push("<item><title>Version " + appcastEscape(r.version) + "</title><pubDate>" + appcastEscape(r.published_at || (/* @__PURE__ */ new Date()).toUTCString()) + "</pubDate>" + notes + enclosure + "</item>");
  }
  return '<?xml version="1.0" encoding="utf-8"?>\n<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle" xmlns:dc="http://purl.org/dc/elements/1.1/">\n<channel><title>' + APPCAST_TITLE + "</title><link>https://app.5858188.xyz/appcast.xml</link><description>Desktop updates</description><language>zh-cn</language>" + items.join("") + "</channel></rss>\n";
}
__name(buildAppcastXml, "buildAppcastXml");
async function appcastResponse(request, env) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET, HEAD" } });
  }
  var version = env?.APP_UPDATE_WINDOWS_VERSION || "4.3.0";
  var notes = env?.APP_UPDATE_WINDOWS_NOTES || "【新版本体验】外贸加速器 v4.3.0 正式发布！新增左侧独立设置中心，优化分流与节点稳定性。";
  var url = env?.APP_UPDATE_WINDOWS_URL || "https://pub-a875cd2b61b44fd0b04710f9bb172bdb.r2.dev/desktop/%E5%A4%96%E8%B4%B8%E5%8A%A0%E9%80%9F%E5%99%A8.exe";
  var releases = [
    {
      platform: "windows",
      version: version,
      build: 40300,
      url: url,
      size: 48795538,
      notes: notes,
      published_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  var body2 = buildAppcastXml(releases);
  var digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(body2));
  var etag = '"' + Array.from(new Uint8Array(digest)).map(function(b) {
    return b.toString(16).padStart(2, "0");
  }).join("") + '"';
  var headers = new Headers({ "content-type": "application/xml; charset=utf-8", "cache-control": "no-cache", "x-content-type-options": "nosniff", "etag": etag });
  if (request.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });
  return new Response(request.method === "HEAD" ? null : body2, { headers });
}
__name(appcastResponse, "appcastResponse");
var index_default = {
  async fetch(request, env) {
    env.__subrequests = 0;
    try {
      const url = new URL(request.url);
      if (url.pathname === "/appcast.xml") return appcastResponse(request, env);
      if (url.pathname === "/app" || url.pathname === "/app/" || url.pathname === "/download/app" || url.pathname === "/api/app/download" || url.pathname === "/api/app/latest.apk") {
        const apkUrl = env.APP_UPDATE_APK_URL || "https://pub-a875cd2b61b44fd0b04710f9bb172bdb.r2.dev/android/waimao-accelerator-latest.apk";
        return Response.redirect(apkUrl, 302);
      }
      const paymentPath = url.pathname.replace(/\/+$/, "") || "/";
      if (paymentPath === "/api/app/payment/notify") return appPaymentCallback(request, env);
      if (paymentPath === "/api/app/payment/return") return appPaymentReturn(request, env);
      if (url.pathname.startsWith("/api/app/")) {
        const response = await appApi(request, env, url);
        if (response) return response;
      }
      const appPayMatch = url.pathname.match(/^\/app-pay\/([^/]+)$/);
      if (request.method === "GET" && appPayMatch) return appPaymentPage(request, env, decodeURIComponent(appPayMatch[1]));
      const appSubscriptionMatch = url.pathname.match(/^\/api\/subscription\/([A-Za-z0-9_-]{20,})$/);
      if (request.method === "GET" && appSubscriptionMatch) return subscription(request, env, appSubscriptionMatch[1]);
      if (url.pathname.startsWith("/api/")) return api(request, env, url);
      const match = url.pathname.match(/^\/s\/([A-Za-z0-9_-]{20,})$/);
      if (request.method === "GET" && match) return subscription(request, env, match[1]);
      if (request.method === "GET" && url.pathname === "/app-email-test") return new Response(emailTestHtml, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" } });
      if (request.method === "GET" && url.pathname === "/") return new Response(admin_page_default, { headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" } });
      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error(JSON.stringify({ event: "request_error", error: error instanceof Error ? error.message : String(error) }));
      return json({ error: error instanceof Error ? error.message : "\u670D\u52A1\u5668\u9519\u8BEF" }, 500);
    }
  },
  async scheduled(controller, env) {
    if (controller.cron === "7 * * * *") {
      const upstreams = await syncAllUpstreams(env);
      console.log(JSON.stringify({ event: "sync_complete", upstreams }));
      return;
    }
    const now = /* @__PURE__ */ new Date();
    if (now.getUTCHours() === 19 && now.getUTCMinutes() < 5) {
      const result = await env.DB.prepare("DELETE FROM subscription_access_daily WHERE access_date<date('now','-30 day')").run();
      console.log(JSON.stringify({ event: "access_log_retention_complete", deleted: result.meta.changes }));
    }
    const expired = await expireUsers(env);
    console.log(JSON.stringify({ event: "expiry_complete", expired }));
  }
};
export {
  index_default as default
};
/*! Bundled license information:

lucide/dist/esm/defaultAttributes.js:
lucide/dist/esm/icons/ban.js:
lucide/dist/esm/icons/ellipsis.js:
lucide/dist/esm/icons/info.js:
lucide/dist/esm/icons/layers.js:
lucide/dist/esm/icons/log-out.js:
lucide/dist/esm/icons/pencil.js:
lucide/dist/esm/icons/plus.js:
lucide/dist/esm/icons/receipt.js:
lucide/dist/esm/icons/refresh-cw.js:
lucide/dist/esm/icons/search.js:
lucide/dist/esm/icons/settings.js:
lucide/dist/esm/icons/users.js:
lucide/dist/esm/icons/x.js:
lucide/dist/esm/lucide.js:
  (**
   * @license lucide v0.468.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
