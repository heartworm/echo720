// ==UserScript==
// @name     Echo720
// @version  1523695424292
// @grant    GM_xmlhttpRequest
// @grant    unsafeWindow
// @namespace    https://github.com/heartworm/echo720
// @description  A flashless UI for Echo360 Lectures.
// @author       Shravan Lal
// @match      *://*/*
// @connect     raw.githubusercontent.com
// ==/UserScript==

"use strict";

class Echo720Loader {
    constructor() {
        if (this.isEchoPage()) {
            console.log("Waiting for Echo to load");
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
            this.echoDiv.style.display = "none";
            document.body.classList.add("echo720__body--app-visible");
        } else {
            this.mountDiv.style.display = "none";
            this.echoDiv.style.display = "block";
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

    async getResource(path) {
        console.log("requesting " + path);
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://raw.githubusercontent.com/heartworm/echo720/master/dist/" + path,
                overrideMimeType: "text/plain",
                onload(result) {
                    resolve(result);
                },
                onerror(error) {
                    reject(error);
                }
            });
        });

        if (!(200 <= response.status && response.status <= 299)) {
            console.error(response);
            throw `Got non OK status code when downloading script: ` + response.status;
        }
        return response.responseText;
    }

    async mountApp() {
        const mountPromise = new Promise((resolve, reject) => {
            this.appMounted = resolve;
        });
        const scriptElem = document.createElement('script');
        scriptElem.innerHTML = await this.getResource("main.js");
        document.body.appendChild(scriptElem);
        await mountPromise;
    }

    async injectMainStyles() {
        const styles = document.createElement('style');
        styles.innerHTML = await this.getResource("main.css");
        document.head.appendChild(styles);
    }

    modifyIFrame() {
        let currentWindow = unsafeWindow;
        while (currentWindow.frameElement !== null) {
            console.log(currentWindow);
            const frame = currentWindow.frameElement;
            frame.setAttribute("allowfullscreen", "allowfullscreen");
            frame.style.position = "absolute";
            frame.style.left = '0';
            frame.style.top  = '0';
            currentWindow = currentWindow.parent;
        }
    }

    createAppContainer() {
        const mountDiv = document.createElement('div');
        mountDiv.style.display = "none";
        const appDiv = document.createElement('div');
        appDiv.id = "echo720-app"
        mountDiv.appendChild(appDiv);
        document.body.appendChild(mountDiv);   
        return mountDiv;
    }

    createLaunchButton() {
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
        return document.getElementById("echo720-launch-button");
    }

    setLaunchButtonReady() {
        this.launchButton.innerText = "Launch Echo720";
        this.launchButton.classList.add("echo720__launch-button--active");        
        this.launchButton.addEventListener("click", () => {
            this.setVisible(true);
        });
    }

    async bootstrap() {
        this.modifyIFrame();
        this.echoDiv = document.getElementById("main");
        this.mountDiv = this.createAppContainer();
        await this.injectMainStyles();
        this.launchButton = this.createLaunchButton();
        await this.mountApp();
        this.setLaunchButtonReady();
    }
}

unsafeWindow.echo720Loader = new Echo720Loader();
