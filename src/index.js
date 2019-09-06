/* Utility functions */
const Event = type => type.replace('hapi-connect-', '');
const invoke = fn => (...args) => fn instanceof Function ? fn(...args) : null;

function polyfill() {
    // IE11 polyfill to remove DOM element
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

function validateParams(options) {
    if (document.getElementById("human-api")) {
        return null;
    }

    /* Reject if no token was provided */
    if (!options.token) {
        throw new Error("The token attribute is required");
    }

    /* Reject if options isn't an object */
    if (typeof options !== "object" || Array.isArray(options)) {
        throw new Error("Argument must be an object");
    }


    return Object.assign(
        options,
        { __baseURL: options.baseURL || "https://hapi-connect.humanapi.co" },
    );
}

function buildIFrame(target, options) {
    console.log(options);
    const iframe = document.createElement("iframe");

    const maxWidth = 700;
    const maxHeight = 500;

    target.src = `${options.__baseURL}/?token=${options.token}`;

    if (options.inviteSessionId) {
        // pisId - Portal Invite Session Id
        target.src = `${target.src}&pisId=${options.inviteSessionId}`;
    }

    if (options.mode) {
        target.src = `${target.src}&mode=${options.mode}`;
    }

    if (options.mode === "select") {
        const preseededSources = options.preseededSources || [];
        target.src = `${target.src}&clientId=${options.clientId}&preseededSources=${btoa(
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


    onResize();
    window.addEventListener("resize", onResize);

    return target;
}

function buildModalOverlay(target, options) {
    const modalOverlay = document.createElement("div");
    const opacity = options && options.overlayOpacity ? options.overlayOpacity : "0.6";

    target.id = "human-api-connect-modal-overlay";
    target.style.position = "fixed";
    target.style.width = "100%";
    target.style.height = "100%";
    target.style.top = "0";
    // adding z-index to target so that it will render just under the connect.
    target.style.zIndex = 9990;
    target.style.backgroundColor = "#333";
    target.style.opacity = opacity;

    return target;
}

function cleanupIFrame(response) {
    document.getElementById("human-api").remove();
    document.getElementById("human-api-connect-modal-overlay").remove();
    delete response.type;
}

function unmount() {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("message", onMessage, false);
}

/* Event handlers */
function onResize() {
    const iframe = document.getElementById("human-api") || this;
    const minWidth = 700;
    const minHeight = 500;

    // Applies to iPad/desktop
    if (window.innerWidth >= minWidth && window.innerHeight >= minHeight) {
        iframe.style.height = "100%";
        iframe.style.maxHeight = `${maxHeight}px`;
        iframe.style.width = "100%";
        iframe.style.maxWidth = `${maxWidth}px`;
        iframe.style.borderRadius = "8px";
        iframe.style.left = "calc(50% - 350px)";
        iframe.style.top = "calc(50% - 250px)";
        iframe.style.borderRadius = "8px";
    }
    // Mobile defaults are at 100%
    else {
        iframe.style.width = "100%";
        iframe.style.maxWidth = "100%";
        iframe.style.height = "100%";
        iframe.style.maxHeight = "100%";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.borderRadius = "none";
    }
};

/* Handle window.postMessage from child iframe */
function onMessage(event) {
    const response = event.data;
    const type = Event(response.type);

    switch (response.type) {
        case 'connect-source':
            invoke(options.onConnectSource)(response);
            break;
        case 'disconnect-source':
            invoke(options.onDisconnectSource)(response);
            break;
        case 'close':
            cleanup();
            invoke(options.onClose)(response);
            unmount();

            break;
        default: break;
    }
}

export function open(opts = {}) {
    polyfill();

    try {
        const options = validateParams(opts);

        window.addEventListener("message", onMessage, false);

        const iframe = buildIFrame(document.createElement("iframe"), options);
        const modalOverlay = buildModalOverlay(document.createElement("div"), options);

        /* Spawn */
        const body = document.getElementsByTagName("body")[0] || document.documentElement;
        body.appendChild(iframe);
        body.appendChild(modalOverlay);
    } catch (err) {
        throw err;
    }

}

