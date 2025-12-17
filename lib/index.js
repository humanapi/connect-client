import { createFocusTrap } from "focus-trap";

const MODAL_WIDTH = 830; // px
const MODAL_HEIGHT = 590; // px
const INTEGRATION_V2 = "V2";

const eventListeners = {};
let focusTrap = null;

/**
 * Initialize focus trap styles
 */
function initializeFocusTrapStyles() {
    if (document.getElementById("focus-trap-styles")) {
        return; // Styles already injected
    }

    const styleSheet = document.createElement("style");
    styleSheet.id = "focus-trap-styles";
    styleSheet.textContent = `
        [data-focus-sentinel] {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            width: 0;
            height: 0;
            padding: 0;
            margin: 0;
            border: none;
        }
    `;
    document.head.appendChild(styleSheet);
}

/**
 * SentinelConfig - Configuration utility for sentinel button setup
 */
class SentinelConfig {
    static get focusableSelectors() {
        return [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input[type="text"]:not([disabled])',
            'input[type="radio"]:not([disabled])',
            'input[type="checkbox"]:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'iframe'
        ].join(',');
    }
}

/**
 * FocusTrap - Manages focus trapping for modal dialogs with iframes
 * Creates invisible sentinel buttons before and after iframe content
 * to prevent focus from escaping the modal
 */
class FocusTrap {

    constructor(modalElement) {
        this.modalElement = modalElement;
        this.sentinelStart = null;
        this.sentinelEnd = null;
        this.trapInstance = null;
        this.onSentinelFocusStart = () => this.handleSentinelFocus("end");
        this.onSentinelFocusEnd = () => this.handleSentinelFocus("start");
    }

    /**
     * Creates an invisible sentinel button with standard styles
     * @param {string} position - "start" or "end"
     * @returns {HTMLButtonElement} Configured sentinel button
     */
    createSentinel(position) {
        const button = document.createElement("button");
        button.setAttribute("data-focus-sentinel", position);
        button.setAttribute("aria-hidden", "true");
        button.setAttribute("tabindex", "0");
        return button;
    }

    /**
     * Creates invisible sentinel buttons for focus trap boundaries
     */
    createSentinels() {
        this.sentinelStart = this.createSentinel("start");
        this.sentinelEnd = this.createSentinel("end");

        // Insert sentinels at boundaries
        this.modalElement.insertBefore(this.sentinelStart, this.modalElement.firstChild);
        this.modalElement.appendChild(this.sentinelEnd);

        // Attach focus handlers
        this.sentinelStart.addEventListener("focus", this.onSentinelFocusStart);
        this.sentinelEnd.addEventListener("focus", this.onSentinelFocusEnd);
    }

    /**
     * Gets all focusable elements within the modal
     * @returns {Element[]} Array of focusable elements
     */
    getFocusableElements() {
        return Array.from(
            this.modalElement.querySelectorAll(SentinelConfig.focusableSelectors)
        ).filter(element => {
            return element.offsetParent !== null && !element.hasAttribute("data-focus-sentinel");
        });
    }

    /**
     * Handles focus when user tabs through sentinel boundaries
     * @param {string} direction - "start" or "end" indicating which focusable element to focus
     */
    handleSentinelFocus(direction) {
        const focusableElements = this.getFocusableElements();
        if (focusableElements.length === 0) return;

        const targetElement = direction === "start" 
            ? focusableElements[0] 
            : focusableElements[focusableElements.length - 1];
        
        targetElement.focus();
    }

    /**
     * Removes sentinel elements from the DOM
     */
    removeSentinels() {
        if (this.sentinelStart?.parentNode) {
            this.sentinelStart.removeEventListener("focus", this.onSentinelFocusStart);
            this.sentinelStart.remove();
        }
        if (this.sentinelEnd?.parentNode) {
            this.sentinelEnd.removeEventListener("focus", this.onSentinelFocusEnd);
            this.sentinelEnd.remove();
        }
    }

    /**
     * Sets up the focus trap with both sentinels and focus-trap library
     */
    setup() {
        initializeFocusTrapStyles();
        this.createSentinels();
        this.trapInstance = createFocusTrap(this.modalElement, {
            escapeDeactivates: false,
            fallbackFocus: this.modalElement,
            initialFocus: this.modalElement,
            onActivate: () => {
                setTimeout(() => {
                    if (this.modalElement.contentWindow) {
                        this.modalElement.contentWindow.focus();
                    }
                }, 200);
            }
        });
    }

    /**
     * Activates the focus trap
     */
    activate() {
        this.trapInstance?.activate();
    }

    /**
     * Deactivates the focus trap
     */
    deactivate() {
        this.trapInstance?.deactivate();
        this.removeSentinels();
    }
}

if (typeof window === "object") {
    window.addEventListener("load", mountOnClickListener);
}

function mountOnClickListener() {
    const tokenContainers = Array.from(
        document.getElementsByClassName("hapi__token-container")
    );

    if (!tokenContainers.length) {
        const NO_CONTAINER = "Couldn't find element with class hapi__token-container, event listener will not be bound";
        // eslint-disable-next-line no-console
        console.warn(NO_CONTAINER);
        emit("error", NO_CONTAINER);
    }

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
    element.addEventListener("click", function(event) {
        event.preventDefault();

        const {
            hapiBaseUrl: baseURL,
            hapiFocusTrap = false,
            hapiMode: mode = "auth",
            hapiPreseed = false,
            hapiToken: token,
            hapiSegment: segment,
            hapiPinnedProviders: pinnedProviders,
            hapiUseSentinelTrap = false
        } = this.dataset;

        open({
            baseURL,
            enableFocusTrap: hapiFocusTrap !== "false" && Boolean(hapiFocusTrap),
            mode,
            preseed: hapiPreseed !== "false" && Boolean(hapiPreseed),
            token,
            version: INTEGRATION_V2,
            segment,
            pinnedProviders,
            useSentinelTrap: hapiUseSentinelTrap !== "false" && Boolean(hapiUseSentinelTrap)
        });
    });
}

function load(options = {}) {
    const { logger = () => {}, enableFocusTrap = false } = options;

    if (document.getElementById("human-api-container")) {
        // Do nothing if Connect already exists
        return null;
    }

    /* Reject if options isn't an object */
    if (!options || typeof options !== "object" || Array.isArray(options)) {
        throw new Error("Argument must be an object");
    }

    options.__baseURL = options.baseURL || options.__baseURL || "https://hapi-connect.humanapi.co";

    const humanConnectIFrame = document.createElement("iframe");
    const iframeContainerDiv = document.createElement("div");
    const humanConnectModalOverlay = document.createElement("div");
    // No token required when mode === select and preseed === false
    const tokenRequired = options.mode !== "select" || options.preseed;

    if (!options.token && tokenRequired) {
        throw new Error("The token attribute is required");
    }

    if (options.version !== INTEGRATION_V2) {
        // eslint-disable-next-line no-console
        console.warn("Deprecation notice: The HumanConnect.open() method will be removed in the future. " +
            "Please use the data attribute 'data-hapi-token' instead. " +
            "See http://myhealthdata.co/connect-guide for details.");
    }

    function buildIFrame() {
        logger("Building iframe");
        const target = humanConnectIFrame;
        const targetSrc = new URL(`${options.__baseURL}`);
        const titlePrefix = options.mode === "select" ? "Select Providers" : "Connect Your Provider Accounts";

        if (options.token) targetSrc.searchParams.set("token", options.token);

        if (options.inviteSessionId) {
            // pisId - Portal Invite Session Id
            targetSrc.searchParams.set("pisId", options.inviteSessionId);
        }

        if (options.mode) targetSrc.searchParams.set("mode", options.mode);

        if (options.mode === "select") {
            const preseededSources = options.preseededSources || [];
            targetSrc.searchParams.set("clientId", options.clientId);
            targetSrc.searchParams.set("preseededSources", btoa(JSON.stringify(preseededSources)));
        }

        if (options.preseed && options.preseed !== "false") targetSrc.searchParams.set("preseed", options.preseed);

        if (options.config) targetSrc.searchParams.set("config", options.config);

        if (options.segment) targetSrc.searchParams.set("segment", options.segment);

        if (options.pinnedProviders) targetSrc.searchParams.set("pinnedProviders", options.pinnedProviders);

        target.src = targetSrc.toString();
        target.id = "human-api";
        target.role = "presentation";
        target.style.borderWidth = 0;

        iframeContainerDiv.id = "human-api-container";
        iframeContainerDiv.style.position = "fixed";
        iframeContainerDiv.style.zIndex = "9999";
        iframeContainerDiv.style.margin = "0";
        iframeContainerDiv.style.padding = "0";
        iframeContainerDiv.style.border = "none";
        iframeContainerDiv.style.visibility = "visible";
        iframeContainerDiv.style.background = `#fff url(${
            options.__baseURL
        }/images/data-source-type-icons/launch-connect-text.svg) no-repeat center center`;
        iframeContainerDiv.role = "dialog";
        iframeContainerDiv.ariaLabel = `${titlePrefix} - Powered by Human API`;
        iframeContainerDiv.ariaModal = true;
        
        // Insert iframe into dialog div
        iframeContainerDiv.appendChild(target);
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
        document.getElementById("human-api-container").remove();
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

        iframeContainerDiv.style.width = "100%";
        iframeContainerDiv.style.height = "100%";
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        if (window.innerWidth >= MODAL_WIDTH && window.innerHeight >= MODAL_HEIGHT) {
            iframeContainerDiv.style.maxHeight = `${MODAL_HEIGHT}px`;
            iframeContainerDiv.style.maxWidth = `${MODAL_WIDTH}px`;
            iframeContainerDiv.style.left = `calc(50% - ${MODAL_WIDTH / 2}px)`;
            iframeContainerDiv.style.top = `calc(50% - ${MODAL_HEIGHT / 2}px)`;
            iframeContainerDiv.style.borderRadius = "8px";
            iframe.style.borderRadius = "8px";
        } else {
            iframeContainerDiv.style.maxWidth = "100%";
            iframeContainerDiv.style.maxHeight = "100%";
            iframeContainerDiv.style.top = "0";
            iframeContainerDiv.style.left = "0";
            iframeContainerDiv.style.borderRadius = "none";
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

                if (focusTrap) {
                    focusTrap.deactivate();
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

            if (enableFocusTrap) {
                // Check if we should use the enhanced FocusTrap with sentinels
                // or fall back to the original createFocusTrap
                if (options.useSentinelTrap) {
                    focusTrap = new FocusTrap(iframeContainerDiv);
                    focusTrap.setup();
                } else {
                    // Original createFocusTrap for backward compatibility
                    focusTrap = createFocusTrap(iframeContainerDiv, {
                        escapeDeactivates: false,
                        fallbackFocus: iframeContainerDiv,
                        initialFocus: iframeContainerDiv,
                        onActivate() {
                            setTimeout(() => {
                                iframeContainerDiv.contentWindow.focus();
                            }, 200);
                        }
                    });
                }
            }

            return {
                iframe: iframeContainerDiv,
                modal: humanConnectModalOverlay
            };
        }
    };
}

function open(options = {}) {

    try {
        const connect = load(options);

        if (!connect) {
            return null;
        }

        const { iframe, modal } = connect.mount();

        const body = document.getElementsByTagName("body")[0] || document.documentElement;
        body.appendChild(iframe);
        body.appendChild(modal);

        iframe.onload = () => {
            if (focusTrap) {
                focusTrap.activate();
            } else {
                iframe.contentWindow.focus();
            }
        };
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
