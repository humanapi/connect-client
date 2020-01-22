(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HumanConnect"] = factory();
	else
		root["HumanConnect"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _polyfill = __webpack_require__(/*! ./polyfill */ \"./lib/polyfill.js\");\n\nvar _polyfill2 = _interopRequireDefault(_polyfill);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n(0, _polyfill2.default)();\n\nvar MODAL_WIDTH = 830; // px\nvar MODAL_HEIGHT = 590; // px\n\nvar eventListeners = {};\nvar sessionToken = void 0;\n\nwindow.addEventListener(\"load\", mountOnClickListener);\n\nfunction mountOnClickListener() {\n    // Get all DOM elements that have the data attribute \"data-hapi-token\"\n    var hapiElements = Array.from(document.querySelectorAll(\"[data-hapi-token]\").values());\n    // Add HAPI configuration based on attributes\n    hapiElements.forEach(addConfig);\n}\n\nfunction addConfig(element) {\n    var token = element.dataset.hapiToken;\n    // Default Connect mode\n    var mode = \"auth\";\n    if (element.dataset.hapiMode) {\n        console.log(\"Connect mode: \" + element.dataset.hapiMode);\n        mode = element.dataset.hapiMode;\n    }\n    var options = {\n        token: token,\n        mode: mode,\n        newMethod: true\n    };\n    element.addEventListener(\"click\", open.bind(this, options));\n}\n\nfunction load(options) {\n    var _options$logger = options.logger,\n        logger = _options$logger === undefined ? function () {} : _options$logger;\n\n    if (document.getElementById(\"human-api\")) return null; // Do nothing if Connect already exists\n\n    /* Reject if options isn't an object */\n    if (!options || (typeof options === \"undefined\" ? \"undefined\" : _typeof(options)) !== \"object\" || Array.isArray(options)) {\n        throw new Error(\"Argument must be an object\");\n    }\n\n    options.__baseURL = options.baseURL || options.__baseURL || \"https://hapi-connect.humanapi.co\";\n\n    var humanConnectIFrame = document.createElement(\"iframe\");\n    var humanConnectModalOverlay = document.createElement(\"div\");\n\n    /* Try to find the element with the data-hapi-token attribute to extract the token from.\n        If no element is found, fall back to the old method.\n    */\n\n    if (!options.newMethod) {\n        console.warn(\"Deprecation notice: Support for passing the session token as a parameter for the HumanConnect.open() method will be removed in the future. Please use the data attribute 'data-hapi-token' instead. See https://reference.humanapi.co/docs/web-guide#section-launch-connect-in-the-browser for details\");\n        if (!options.token) throw new Error(\"The token attribute is required\");\n        sessionToken = options.token;\n    }\n\n    function buildIFrame() {\n        logger(\"Building iframe\");\n        var target = humanConnectIFrame;\n\n        target.src = options.__baseURL + \"/?token=\" + sessionToken;\n\n        if (options.inviteSessionId) {\n            target.src += \"&pisId=\" + options.inviteSessionId; // pisId - Portal Invite Session Id\n        }\n\n        if (options.mode) target.src += \"&mode=\" + options.mode;\n\n        if (options.mode === \"select\") {\n            var preseededSources = options.preseededSources || [];\n            target.src += \"&clientId=\" + options.clientId + \"&preseededSources=\" + btoa(JSON.stringify(preseededSources));\n        }\n\n        if (options.config) {\n            target.src += \"&config=\" + options.config;\n        }\n\n        target.id = \"human-api\";\n        target.style.position = \"fixed\";\n        target.style.zIndex = \"9999\";\n        target.style.margin = \"0\";\n        target.style.padding = \"0\";\n        target.style.border = \"none\";\n        target.style.visibility = \"visible\";\n        target.style.background = \"#fff url(\" + options.__baseURL + \"/images/data-source-type-icons/launch-connect-text.svg) no-repeat center center\";\n\n        /* Call the resize handler on mount */\n        onResize();\n    }\n\n    function buildModalOverlay() {\n        logger(\"Building modal overlay\");\n        var target = humanConnectModalOverlay;\n        var opacity = options.overlayOpacity || \"0.6\";\n\n        target.id = \"human-api-connect-modal-overlay\";\n        target.style.position = \"fixed\";\n        target.style.width = \"100%\";\n        target.style.height = \"100%\";\n        target.style.top = \"0\";\n        target.style.zIndex = 9990; // Should render under Connect iframe (9999) but above everything else\n        target.style.backgroundColor = \"#333\";\n        target.style.opacity = opacity;\n    }\n\n    function cleanupElements() {\n        logger(\"Cleaning up elements\");\n        document.getElementById(\"human-api\").remove();\n        document.getElementById(\"human-api-connect-modal-overlay\").remove();\n    }\n\n    function mountListeners() {\n        logger(\"Mounting listeners\");\n        window.addEventListener(\"message\", onMessage, false);\n        window.addEventListener(\"resize\", onResize);\n    }\n\n    function unmountListeners() {\n        logger(\"Unmounting listeners\");\n        window.removeEventListener(\"resize\", onResize);\n        window.removeEventListener(\"message\", onMessage, false);\n        window.removeEventListener(\"click\", mountOnClickListener);\n    }\n\n    function onResize() {\n        logger(\"Responding to window resize\");\n        var iframe = humanConnectIFrame;\n\n        iframe.style.width = \"100%\";\n        iframe.style.height = \"100%\";\n\n        if (window.innerWidth >= MODAL_WIDTH && window.innerHeight >= MODAL_HEIGHT) {\n            iframe.style.maxHeight = MODAL_HEIGHT + \"px\";\n            iframe.style.maxWidth = MODAL_WIDTH + \"px\";\n            iframe.style.left = \"calc(50% - \" + MODAL_WIDTH / 2 + \"px)\";\n            iframe.style.top = \"calc(50% - \" + MODAL_HEIGHT / 2 + \"px)\";\n            iframe.style.borderRadius = \"8px\";\n        } else {\n            iframe.style.maxWidth = \"100%\";\n            iframe.style.maxHeight = \"100%\";\n            iframe.style.top = \"0\";\n            iframe.style.left = \"0\";\n            iframe.style.borderRadius = \"none\";\n        }\n    }\n\n    /* Handle window.postMessage from child iframe */\n    function onMessage(event) {\n        var response = event.data;\n        logger(\"Responding to postMessage\", response);\n\n        var invoke = function invoke(fn) {\n            delete response.type;\n            return options[fn] instanceof Function ? options[fn](response) : null;\n        };\n\n        switch (response.type.replace(\"hapi-connect-\", \"\")) {\n            case \"connect-source\":\n                invoke(\"onConnectSource\");\n                break;\n            case \"disconnect-source\":\n                invoke(\"onDisconnectSource\");\n                break;\n            case \"close\":\n                invoke(\"onClose\");\n                emit(\"close\", []);\n                cleanupElements();\n                unmountListeners();\n                break;\n            default:\n                break;\n        }\n    }\n\n    return {\n        mount: function mount() {\n            buildIFrame();\n            buildModalOverlay();\n            mountListeners();\n\n            return {\n                iframe: humanConnectIFrame,\n                modal: humanConnectModalOverlay\n            };\n        }\n    };\n}\n\nfunction open() {\n    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    try {\n        console.log(\"Open with options: \" + JSON.stringify(options));\n        var connect = load(options);\n        if (!connect) return null;\n\n        var _connect$mount = connect.mount(),\n            iframe = _connect$mount.iframe,\n            modal = _connect$mount.modal;\n\n        var body = document.getElementsByTagName(\"body\")[0] || document.documentElement;\n        body.appendChild(iframe);\n        body.appendChild(modal);\n    } catch (err) {\n        console.error({ err: err }, err.stack); // eslint-disable-line\n        throw err;\n    }\n}\n\nfunction on(eventName, eventListener) {\n    if (_typeof(eventListeners[eventName]) !== \"object\") {\n        eventListeners[eventName] = [];\n    }\n    eventListeners[eventName].push(eventListener);\n}\n\nfunction emit(eventName) {\n    var _this = this;\n\n    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n        args[_key - 1] = arguments[_key];\n    }\n\n    if (_typeof(eventListeners[eventName]) === \"object\") {\n        eventListeners[eventName].forEach(function (listener) {\n            return listener.apply(_this, args);\n        });\n    }\n}\n\nmodule.exports = {\n    open: open,\n    on: on\n};\n\n//# sourceURL=webpack://HumanConnect/./lib/index.js?");

/***/ }),

/***/ "./lib/polyfill.js":
/*!*************************!*\
  !*** ./lib/polyfill.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = polyfill;\nfunction polyfill() {\n    /* IE11 polyfill to remove DOM elements */\n    Element.prototype.remove = function () {\n        this.parentElement.removeChild(this);\n    };\n    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {\n        for (var i = this.length - 1; i >= 0; i--) {\n            if (this[i] && this[i].parentElement) {\n                this[i].parentElement.removeChild(this[i]);\n            }\n        }\n    };\n}\n\n//# sourceURL=webpack://HumanConnect/./lib/polyfill.js?");

/***/ })

/******/ });
});