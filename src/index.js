/* eslint-disable no-console */
/* Modal properties */
const MODAL_WIDTH = 700; // px
const MODAL_HEIGHT = 500; // px

/* Utility functions */
const Type = event => event.replace("hapi-connect-", "");
const invoke = fn => (...args) => fn instanceof Function ? fn(...args) : null; // eslint-disable-line
const isDesktopOrTablet = viewport => viewport.innerWidth >= MODAL_WIDTH && viewport.innerHeight >= MODAL_HEIGHT;
const log = console.log.bind(null, "humanapi-connect-client:");

function polyfill() {
    /* IE11 polyfill to remove DOM elements */
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };
}

function load(options) {
    if (document.getElementById("human-api")) return null; // Do nothing if Connect already exists
    if (!options.token) throw new Error("The token attribute is required");

    /* Reject if options isn't an object */
    if (!options || typeof options !== "object" || Array.isArray(options)) {
        throw new Error("Argument must be an object");
    }

    options.__baseURL = options.baseURL || "https://hapi-connect.staging.humanapi.co";

    const humanConnectIFrame = document.createElement("iframe");
    const humanConnectModalOverlay = document.createElement("div");

    function buildIFrame() {
        log("Building iframe");
        const target = humanConnectIFrame;

        target.src = `${options.__baseURL}/?token=${options.token}`;

        if (options.inviteSessionId) {
            // pisId - Portal Invite Session Id
            target.src += `&pisId=${options.inviteSessionId}`;
        }

        if (options.mode) {
            target.src += `&mode=${options.mode}`;
        }

        if (options.mode === "select") {
            const preseededSources = options.preseededSources || [];
            target.src += `&clientId=${options.clientId}&preseededSources=${btoa(
                JSON.stringify(preseededSources)
            )}`;
        }

        target.id = "human-api";
        target.style.position = "fixed";
        target.style.zIndex = "9999";
        target.style.margin = "0";
        target.style.padding = "0";
        target.style.border = "none";
        target.style.visibility = "visible";
        target.style.background = `#fff url(${
            options.__baseURL
        }/images/data-source-type-icons/launch-connect-text.svg) no-repeat center center`;

        /* Call the resize handler on mount */
        onResize();

        return target;
    }

    function buildModalOverlay() {
        log("Building modal overlay");
        const target = humanConnectModalOverlay;
        const opacity = options.overlayOpacity || "0.6";

        target.id = "human-api-connect-modal-overlay";
        target.style.position = "fixed";
        target.style.width = "100%";
        target.style.height = "100%";
        target.style.top = "0";
        target.style.zIndex = 9990; // Should render under Connect iframe (9999) but above everything else
        target.style.backgroundColor = "#333";
        target.style.opacity = opacity;

        return target;
    }

    function cleanupElements(response) {
        log("Cleaning up elements");
        document.getElementById("human-api").remove();
        document.getElementById("human-api-connect-modal-overlay").remove();
        delete response.type;
    }

    function mountListeners() {
        log("Mounting listeners");
        window.addEventListener("message", onMessage, false);
        window.addEventListener("resize", onResize);
    }

    function unmountListeners() {
        log("Unmounting listeners");
        window.removeEventListener("resize", onResize);
        window.removeEventListener("message", onMessage, false);
    }

    function onResize(event) {
        log("Responding to window resize");
        const iframe = humanConnectIFrame;

        iframe.style.width = "100%";
        iframe.style.height = "100%";

        if (isDesktopOrTablet(window)) {
            iframe.style.maxHeight = `${MODAL_HEIGHT}px`;
            iframe.style.maxWidth = `${MODAL_WIDTH}px`;
            iframe.style.left = "calc(50% - 350px)";
            iframe.style.top = "calc(50% - 250px)";
            iframe.style.borderRadius = "8px";
        } else {
            iframe.style.maxWidth = "100%";
            iframe.style.maxHeight = "100%";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.borderRadius = "none";
        }
    }

    /* Handle window.postMessage from child iframe */
    function onMessage(event) {
        log("Responding to postMessage");
        const response = event.data;
        log(response);

        switch (Type(response.type)) {
            case "connect-source":
                invoke(options.onConnectSource)(response);
                break;
            case "disconnect-source":
                invoke(options.onDisconnectSource)(response);
                break;
            case "close":
                cleanupElements();
                invoke(options.onClose)(response);
                unmountListeners();
                break;
            default: break;
        }
    }

    return {
        mount() {
            buildIFrame();
            buildModalOverlay();
            mountListeners();

            return {
                iframe: humanConnectIFrame,
                modal: humanConnectModalOverlay
            };
        }
    };
}

export function open(options = {}) {
    polyfill();

    try {
        const connect = load(options);
        if (!connect) return null;

        const { iframe, modal } = connect.mount();

        /* Spawn */
        const body = document.getElementsByTagName("body")[0] || document.documentElement;
        body.appendChild(iframe);
        body.appendChild(modal);
    } catch (err) {
        log({ err }, err.stack);
        throw err;
    }
}
