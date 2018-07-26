export function open(options = {}) {
    if (document.getElementById("human-api")) {
        return null;
    }

    if (!options.token) {
        throw new Error("token option is required for spawning connect");
    }
    options.__baseURL = options.__baseURL || "https://hapi-connect.humanapi.co";
    options.onFinish = options.finish;
    options.onClose = options.close;
    options.onError = options.error;

    const onMessageReceived = event => {
        const response = event.data;
        if (response.type === "hapi-connect-close") {
            document.getElementById("human-api").remove();
            document.getElementById("human-api-connect-modal-overlay").remove();
            if (options.onClose) {
                options.onClose(response);
            }
        }
        if (response.type === "hapi-connect-error") {
            if (options.onError) {
                options.onError(response.error);
            }
        }
    };
    window.addEventListener("message", onMessageReceived, false);
    const iframe = document.createElement("iframe");
    const minWidth = 700;
    const maxWidth = 700;
    const minHeight = 500;
    const maxHeight = 500;

    iframe.src = `${options.__baseURL}/?token=${options.token}`;

    if (options.mode) {
        iframe.src = `${iframe.src}&mode=${options.mode}`;
    }

    iframe.id = "human-api";
    iframe.style.position = "fixed";
    iframe.style.zIndex = "9999";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.style.border = "none";
    iframe.style.visibility = "visible";
    iframe.style.background = `#fff url(${
        options.__baseURL
    }/images/data-source-type-icons/launch-connect-text.svg) no-repeat center center`;

    const resizeStyling = () => {
        // applies to iPad/desktop
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
        // mobile defaults are at 100%
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
    resizeStyling();

    window.addEventListener("resize", resizeStyling);

    // adding div for transparent overlay behind iframe
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "human-api-connect-modal-overlay";
    modalOverlay.style.position = "fixed";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.top = "0";
    modalOverlay.style.backgroundColor = "#333";
    modalOverlay.style.opacity = "0.6";

    const body = document.getElementsByTagName("body")[0] || document.documentElement;
    body.appendChild(iframe);
    body.appendChild(modalOverlay);
}