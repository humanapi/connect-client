!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.humanapiConnectClient=t():e.humanapiConnectClient=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.open=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(document.getElementById("human-api"))return null;if(!e.token)throw new Error("token option is required for spawning connect");e.__baseURL=e.__baseURL||"https://hapi-connect.humanapi.co",e.onFinish=e.finish,e.onClose=e.close,e.onError=e.error;window.addEventListener("message",function(t){var n=t.data;"hapi-connect-close"===n.type&&(document.getElementById("human-api").remove(),document.getElementById("human-api-connect-modal-overlay").remove(),e.onClose&&e.onClose(n));"hapi-connect-error"===n.type&&e.onError&&e.onError(n.error)},!1);var t=document.createElement("iframe");t.src=e.__baseURL+"/?token="+e.token,e.mode&&(t.src=t.src+"&mode="+e.mode);t.id="human-api",t.style.position="fixed",t.style.zIndex="9999",t.style.margin="0",t.style.padding="0",t.style.border="none",t.style.visibility="visible",t.style.background="#fff url("+e.__baseURL+"/images/data-source-type-icons/launch-connect-text.svg) no-repeat center center";var n=function(){window.innerWidth>=700&&window.innerHeight>=500?(t.style.height="100%",t.style.maxHeight="500px",t.style.width="100%",t.style.maxWidth="700px",t.style.borderRadius="8px",t.style.left="calc(50% - 350px)",t.style.top="calc(50% - 250px)",t.style.borderRadius="8px"):(t.style.width="100%",t.style.maxWidth="100%",t.style.height="100%",t.style.maxHeight="100%",t.style.top="0",t.style.left="0",t.style.borderRadius="none")};n(),window.addEventListener("resize",n);var o=document.createElement("div");o.id="human-api-connect-modal-overlay",o.style.position="fixed",o.style.width="100%",o.style.height="100%",o.style.top="0",o.style.backgroundColor="#333",o.style.opacity="0.6";var r=document.getElementsByTagName("body")[0]||document.documentElement;r.appendChild(t),r.appendChild(o)}}])});