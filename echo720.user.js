// ==UserScript==
// @name     Echo720
// @version  0.0.1
// @grant    GM_xmlhttpRequest
// @grant    unsafeWindow
// @namespace    http://tampermonkey.net/
// @description  Echo360 Mod for no flash player
// @author       Shravan Lal
// @match      *://*/*
// ==/UserScript==

class Echo720Loader {
    constructor() {
        if (this.isEchoPage()) {
            this.bootstrapWhenReady();
        }
    }

    isEchoPage() {
        for (const node of document.childNodes) {
            if (node.nodeName === "#comment" && node.textContent.trim().endsWith("Echo360 Inc.")) {
                return true;
            }
        }
        return false;
    }

    isEchoLoaded() {
        return document.querySelector(".echo360-page-wrapper") !== null;
    }

    setVisible(visible) {
        if (visible) {
            this.mountDiv.style.display = "block";
            this.mainDiv.style.display = "none";
            document.body.classList.add("echo720__body--app-visible");
        } else {
            this.mountDiv.style.display = "none";
            this.mainDiv.style.display = "block";
            document.body.classList.remove("echo720__body--app-visible");
        }
    }

    bootstrapWhenReady() {
        const maxWait = 10000;
        const interval = 50;
        let waited = 0;
        let handle = setInterval(() => {
            console.log(waited);
            waited += interval;
            if (this.isEchoLoaded()) {
                clearInterval(handle);
                this.bootstrap().catch(console.error);
            } else if (waited >= maxWait) {
                clearInterval(handle);
                console.error("could not find echo");
            }
        }, interval);
    }

    async bootstrap() {

        this.mountDiv = document.createElement('div');
        this.mountDiv.style.display = "none";
        const appDiv = document.createElement('div');
        appDiv.id = "echo720-app"
        this.mountDiv.appendChild(appDiv);
        document.body.appendChild(this.mountDiv);

        const styles = document.createElement('style');
        styles.innerHTML = `
            .echo720__body--app-visible {
                background-color: white !important;
            }
            .echo720__launch-button {
                margin: 0 10px;
            }
            .echo720__launch-button--active {
                font-weight: bold;
                color: #c408e0;
            }
        `;
        document.head.appendChild(styles);

        const scriptResponse = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: this.consts.urls.root + this.consts.urls.mainScript,
                onload(result) {
                    resolve(result);
                },
                onerror(error) {
                    reject(error);
                }
            })
        });

        this.mainDiv = document.getElementById("main");
        const toolbarButtons = document.querySelector(".echo360-toolbar .right");
        toolbarButtons.innerHTML = `
        <table cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td>
                        <div class="echo720__launch-button" id="echo720-launch-button">Loading Echo720...</div>
                    </td>
                </tr>
            </tbody>
        </table>
        ` +  toolbarButtons.innerHTML;
        const launchButton = document.getElementById("echo720-launch-button");

        const launchPromise = new Promise((resolve, reject) => {
            this.appMounted = resolve;
        });

        const scriptElem = document.createElement('script');
        scriptElem.innerHTML = scriptResponse.responseText;
        document.body.appendChild(scriptElem);

        await launchPromise;
        launchButton.addEventListener("click", () => {
            this.setVisible(true);
        });
        launchButton.innerText = "Launch Echo720";
        launchButton.classList.add("echo720__launch-button--active");
    }
}

Echo720Loader.prototype.consts = {
    api: {
        details: (section, presentation) => `/ess/client/api/sections/${section}/presentations/${presentation}/details.json`,
    },
    urls: {
        root: `http://localhost:8080`,
        mainScript: `/dist/build.js`
    }
}

unsafeWindow.echo720Loader = new Echo720Loader();
