const MODAL_WIDTH = 830; // px
const MODAL_HEIGHT = 590; // px
const INTEGRATION_V2 = "V2";

const eventListeners = {};

if (typeof window === "object") {
    window.addEventListener("load", mountOnClickListener);
}

function mountOnClickListener() {
    const tokenContainers = Array.from(
        document.getElementsByClassName("hapi__token-container")
    );
    // Get all DOM elements that have the data attribute "data-hapi-token" inside any found containers.
    const hapiElements = tokenContainers.reduce(
        (accumulator, container) => [
            ...accumulator,
            ...Array.from(
                container.querySelectorAll("[data-hapi-token]").values()
            )
        ],
        []
    );

    // Add HAPI configuration based on attributes
    hapiElements.forEach(setElementConfig);

    const MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

    if (MutationObserver && tokenContainers.length) {
        const observer = new MutationObserver(mutations => {
            mutations
                .filter(
                    ({ target }) =>
                        target.attributes["data-hapi-token"] &&
                        target.attributes["data-hapi-token"].value
                )
                .forEach(({ target }) => {
                    setElementConfig(target);
                });
        });

        tokenContainers.forEach(tokenContainer => {
            observer.observe(tokenContainer, {
                attributes: true,
                attributeFilter: [ "data-hapi-token" ],
                childList: false,
                subtree: true
            });
        });
    }
}

function setElementConfig(element) {
    const token = element.dataset.hapiToken;
    // Default Connect mode is "auth".
    const mode = element.dataset.hapiMode || "auth";
    const baseURL = element.dataset.hapiBaseUrl || "https://hapi-connect.humanapi.co";
    const options = {
        token,
        mode,
        version: INTEGRATION_V2,
        baseURL
    };
    element.addEventListener("click", open.bind(this, options));
}

function load(options) {
    const { logger = () => {} } = options;
    if (document.getElementById("human-api")) return null; // Do nothing if Connect already exists

    /* Reject if options isn't an object */
    if (!options || typeof options !== "object" || Array.isArray(options)) {
        throw new Error("Argument must be an object");
    }

    options.__baseURL = options.baseURL || options.__baseURL || "https://hapi-connect.humanapi.co";

    const humanConnectIFrame = document.createElement("iframe");
    const humanConnectModalOverlay = document.createElement("div");

    if (!options.token) throw new Error("The token attribute is required");
    if (options.version !== INTEGRATION_V2) {
        // eslint-disable-next-line no-console
        console.warn("Deprecation notice: The HumanConnect.open() method will be removed in the future. " +
            "Please use the data attribute 'data-hapi-token' instead. " +
            "See http://myhealthdata.co/connect-guide for details.");
    }

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

        if (options.config) {
            target.src += `&config=${options.config}`;
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

    function cleanupElements() {
        logger("Cleaning up elements");
        document.getElementById("human-api").remove();
        document.getElementById("human-api-connect-modal-overlay").remove();
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
        window.removeEventListener("click", mountOnClickListener);
    }

    function onResize() {
        logger("Responding to window resize");
        const iframe = humanConnectIFrame;

        iframe.style.width = "100%";
        iframe.style.height = "100%";

        if (window.innerWidth >= MODAL_WIDTH && window.innerHeight >= MODAL_HEIGHT) {
            iframe.style.maxHeight = `${MODAL_HEIGHT}px`;
            iframe.style.maxWidth = `${MODAL_WIDTH}px`;
            iframe.style.left = `calc(50% - ${MODAL_WIDTH / 2}px)`;
            iframe.style.top = `calc(50% - ${MODAL_HEIGHT / 2}px)`;
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

        if (!response.type) {
            return;
        }

        const invoke = fn => {
            delete response.type;
            return options[fn] instanceof Function ? options[fn](response) : null;
        };

        switch (response.type.replace("hapi-connect-", "")) {
            case "connect-source":
                if (options.version === INTEGRATION_V2) {
                    emit("connect", response);
                } else {
                    invoke("onConnectSource");
                }
                break;
            case "disconnect-source":
                if (options.version === INTEGRATION_V2) {
                    emit("disconnect", response);
                } else {
                    invoke("onDisconnectSource");
                }
                break;
            case "close":
                if (options.version === INTEGRATION_V2) {
                    emit("close", response);
                } else {
                    invoke("onClose");
                }
                cleanupElements();
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

function open(options = {}) {
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

function on(eventName, eventListener) {
    if (!Array.isArray(eventListeners[eventName])) {
        eventListeners[eventName] = [];
    }
    if (eventListener instanceof Function) {
        eventListeners[eventName].push(eventListener);
    } else {
        // eslint-disable-next-line no-console
        console.error(`Error: Tried to add an event listener for event "${eventName}" that is not a function
        (type: ${typeof eventListener})`);
    }
}

function emit(eventName, ...args) {
    if (Array.isArray(eventListeners[eventName])) {
        eventListeners[eventName].forEach((listener) => {
            if (listener instanceof Function) {
                listener.apply(this, args);
            }
        });
    }
}

module.exports = {
    open,
    on
};
