import polyfill from "./polyfill"; polyfill();

const MODAL_WIDTH = 700; // px
const MODAL_HEIGHT = 500; // px

function load(options) {
    const { logger = () => {} } = options;
    if (document.getElementById("human-api")) return null; // Do nothing if Connect already exists
    if (!options.token) throw new Error("The token attribute is required");

    /* Reject if options isn't an object */
    if (!options || typeof options !== "object" || Array.isArray(options)) {
        throw new Error("Argument must be an object");
    }

    options.__baseURL = options.baseURL || "https://hapi-connect.humanapi.co";

    const humanConnectIFrame = document.createElement("iframe");
    const humanConnectModalOverlay = document.createElement("div");

    function buildIFrame() {
        logger("Building iframe");
        const target = humanConnectIFrame;

        target.src = `${options.__baseURL}/?token=${options.token}`;

        if (options.inviteSessionId) {
            target.src += `&pisId=${options.inviteSessionId}`; // pisId - Portal Invite Session Id
        }

        if (options.mode) target.src += `&mode=${options.mode}`;

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
    }

    function buildModalOverlay() {
        logger("Building modal overlay");
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
    }

    function cleanupElements(response) {
        logger("Cleaning up elements");
        document.getElementById("human-api").remove();
        document.getElementById("human-api-connect-modal-overlay").remove();
        delete response.type;
    }

    function mountListeners() {
        logger("Mounting listeners");
        window.addEventListener("message", onMessage, false);
        window.addEventListener("resize", onResize);
    }

    function unmountListeners() {
        logger("Unmounting listeners");
        window.removeEventListener("resize", onResize);
        window.removeEventListener("message", onMessage, false);
    }

    function onResize() {
        logger("Responding to window resize");
        const iframe = humanConnectIFrame;

        iframe.style.width = "100%";
        iframe.style.height = "100%";

        if (window.innerWidth >= MODAL_WIDTH && window.innerHeight >= MODAL_HEIGHT) {
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
        const response = event.data;
        logger("Responding to postMessage", response);

        const invoke = fn => options[fn] instanceof Function && options[fn](response) || null;

        switch (response.type.replace("hapi-connect-", "")) {
            case "connect-source":
                invoke("onConnectSource");
                break;
            case "disconnect-source":
                invoke("onDisconnectSource");
                break;
            case "close":
                cleanupElements(response);
                invoke("onConnectClose");
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
    try {
        const connect = load(options);
        if (!connect) return null;

        const { iframe, modal } = connect.mount();

        const body = document.getElementsByTagName("body")[0] || document.documentElement;
        body.appendChild(iframe);
        body.appendChild(modal);
    } catch (err) {
        console.error({ err }, err.stack); // eslint-disable-line
        throw err;
    }
}
