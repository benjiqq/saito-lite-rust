
const { forEach } = require("jszip");
const videoBoxTemplate = require("./video-box.template");
const { setTextRange } = require("typescript");
// import {applyVideoBackground, } from 'virtual-bg';



class VideoBox {

    stream_id = null;
    stream = null;
    placeholderRendered = false;
    stream_rendered = false;
    waitTimer;
    waitSeconds = 0;
    is_connected_creator = false;
    receiving_connection = false

    constructor(app, mod, ui_type, call_type, central, room_code, peer, container_class) {
        this.app = app;
        this.mod = mod;
        this.ui_type = ui_type
        this.call_type = call_type;
        this.central = central;
        this.room_code = room_code;
        this.stream_id = peer
        this.containerClass = container_class
        this.retry_attempt_no = 0

        app.connection.on('mute', (kind, public_key) => {
            if (public_key !== this.stream_id) return;
            if (kind === "video") {
                let name;
                if (public_key === "local") {
                    let public_key = app.wallet.returnPublicKey();
                    name = app.keychain.returnUsername(public_key)
                } else {
                    name = app.keychain.returnUsername(public_key);
                }

                if (name.length > 10) {
                    name = `${name.slice(0, 10)}...`
                }
                this.updateVideoMuteStatus(name);
            }
        })
        app.connection.on('unmute', (kind, public_key) => {
            if (public_key !== this.stream_id) return;
            if (kind === "video") {
                this.removeVideoMuteStatus();
            }
        })

        app.connection.on('disconnect', (kind, peer) => {
            this.disconnectFromPeer(peer)
        })
    }

    render(stream, placeholder_info = null) {
        this.stream = stream;
        if (stream !== null) {
            if (this.stream_id === 'local') {
                this.renderStream({ muted: true });
            } else {
                this.stopWaitTimer();
                this.renderStream({ muted: false })
                this.is_connected_creator = true;
            }
        } else {
            this.renderPlaceholder(placeholder_info);
        }



    }


    attachEvents(app, mod) {
        const video_box = document.querySelector(`#stream${this.stream_id}`);
        if (video_box) {
            // setTimeout(() => {
            //     this.mod.createMediaChannelConnectionWithPeers([this.stream_id], 'large', 'video', this.room_code, false);
            // }, 15000)
            video_box.querySelector('#reconnect-button').onclick = () => {
                this._reconnectCreator(this.stream_id);
                video_box.querySelector('#reconnect-button button').innerHTML = `<span class="lds-dual-ring2"> </span>`
                setTimeout(() => {
                    video_box.querySelector('#reconnect-button').style.opacity = 1;
                }, 30000)
            }

        }
    }



    renderStream({ muted }) {
        if (!document.querySelector(`#stream${this.stream_id}`)) {
            this.app.browser.addElementToClass(videoBoxTemplate(this.stream_id, muted, this.ui_type), this.containerClass);

        }

        const videoBox = document.querySelector(`#stream${this.stream_id}`);
        if (this.call_type === "audio") {
            videoBox.insertAdjacentHTML('beforeend', `<div class="audio-stream"> <i class="fas fa-microphone"></i></div> `);
        } else if (this.call_type === "video") {
            videoBox.firstElementChild.srcObject = this.stream;
        }
    }

    renderPlaceholder(placeholder_info = "negotiating peer connection") {
        if (!document.querySelector(`#stream${this.stream_id}`)) {
            this.app.browser.addElementToClass(videoBoxTemplate(this.stream_id, false, this.ui_type), this.containerClass);
        }
        this.updateConnectionMessage(placeholder_info);
    }

    updateConnectionMessage(message) {
        const video_box = document.querySelector(`#stream${this.stream_id}`);
        if (video_box.querySelector('#connection-message')) {
            video_box.querySelector('#connection-message').innerHTML = `<p>${message}</p> <span class="lds-dual-ring"> </span> `
        } else {
            video_box.insertAdjacentHTML('beforeend', `<div id="connection-message"> <p> ${message} </p> <span class="lds-dual-ring"> </span></div> `);
        }
    }

    updateReconnectionButton(show) {
        const video_box = document.querySelector(`#stream${this.stream_id}`);
        if (show) {
            // show reconnection button
            this.removeConnectionMessage();
            video_box.querySelector('#reconnect-button').style.opacity = 1;
            console.log(video_box.querySelector('#reconnect-button'));

        } else {
            setTimeout(() => {
                if (video_box.querySelector('#reconnect-button')) {
                    video_box.querySelector('#reconnect-button').style.opacity = 0;
                    video_box.querySelector('#reconnect-button button').innerHTML = ""
                    video_box.querySelector('#reconnect-button button').textContent = "connect"
                }
            }, 3000)
        }
    }

    removeConnectionMessage() {
        const video_box = document.querySelector(`#stream${this.stream_id}`);
        if (video_box.querySelector('#connection-message')) {
            video_box.querySelectorAll('#connection-message').forEach(item => {
                item.parentElement.removeChild(video_box.querySelector('#connection-message'));
            })
        }
    }

    updateVideoMuteStatus(message) {
        const video_box = document.querySelector(`#stream${this.stream_id}`);
        if (video_box.querySelector('#video-mute-message')) {
            video_box.querySelector('#video-mute-message').innerHTML = `<p>${message}</p>`
        } else {
            video_box.insertAdjacentHTML('beforeend', `<div id="video-mute-message"> <p> ${message} </p></div> `);
        }
    }

    removeVideoMuteStatus() {
        const video_box = document.querySelector(`#stream${this.stream_id}`);
        if (video_box.querySelector('#video-mute-message')) {
            video_box.querySelectorAll('#video-mute-message').forEach(item => {
                item.parentElement.removeChild(video_box.querySelector('#video-mute-message'));
            })
        }
    }



    async handleConnectionStateChange(peer, connectionState) {

        let video_box = document.querySelector(`#stream${this.stream_id}`);
        let connection_message = document.querySelector('#connection-message');
        if (!video_box) return;
        switch (connectionState) {
            case "connecting":
                if (this.stream_rendered) return;
                this.updateConnectionMessage(`starting ${this.call_type} chat `);
                break;
            case "connected":
                if (this.stream) {
                    this.removeConnectionMessage();
                    if (this.streamExists()) {
                        // this.renderStream({ muted: false });
                        // this.stream_rendered = true;
                        this.stopWaitTimer()
                    }
                }
                break;
            case "disconnected":
                console.log(`#stream${this.stream_id}`, "stream id")
                this.stream = null
                this.stream_rendered = false;
                video_box.firstElementChild.srcObject = this.stream

                siteMessage(`connection with ${this.stream_id} unstable`, 5000);
                if (this.is_creator) {
                    this.updateReconnectionButton(true)
                    this.is_connected_creator = false;
                } else {
                    // this.reconnectRecipient(peer)
                    this._reconnectRecipient(this.stream_id)
                }
                break;
            case "failed":

                break;
            case "ten_seconds":
                this.updateConnectionMessage('negotiating peer connection')
                break
            case "twenty_seconds":
                this.updateConnectionMessage('trying alternative route')
                break


            default:
                break;
        }
    }

    startWaitTimer(is_creator = false) {
        this.attachEvents(this.app, this.mod)
        if (!is_creator) {
            this.receiving_connection = true;
        }

        setTimeout(() => {
            if (is_creator && !this.is_connected_creator) {
                const video_box = document.querySelector(`#stream${this.stream_id}`);
                if (video_box) {
                    video_box.querySelector('#reconnect-button').style.opacity = 1;
                }
            }

        }, 60000)


        let peer = this.stream_id;
        this.is_creator = is_creator;

        this.stopWaitTimer();
        this.waitTimer = setInterval(() => {
            // console.log(this.waitSeconds, is_creator)
            console.log(this.waitSeconds)
            this.waitSeconds += 1;
            if (this.waitSeconds === 10) {
                this.handleConnectionStateChange(peer, 'ten_seconds', is_creator)
            }
            if (this.waitSeconds === 20) {
                this.handleConnectionStateChange(peer, 'twenty_seconds', is_creator)
            }
            if (this.waitSeconds === 50) {
                this.stopWaitTimer();
                // this.retry_attempt_no += 1;
                // if (this.retry_attempt_no > 2) {
                //     console.log('could not establish connection');
                //     this.disconnectFromPeer(peer, "cannot connect, please check network");
                //     return;
                // }

                if (is_creator) {
                    this._reconnectCreator(peer)
                } else {
                    this._reconnectRecipient(peer)
                }
            }
        }, 1000)
    }

    stopWaitTimer() {
        if (this.waitTimer) {
            clearInterval(this.waitTimer);
            this.waitSeconds = 0;
        }
    }




    remove() {

    }

    streamExists() {
        return this.stream;
    }

    disconnectFromPeer(peer, message = "disconnected from call") {
        if (peer !== this.stream_id) return;
        document.querySelector(`#stream${this.stream_id}`).parentElement.removeChild(document.querySelector(`#stream${this.stream_id}`));
        this.mod.ChatManagerLarge.disconnectOtherPeer(peer);
        siteMessage(`${peer} ${message}`, 5000);

    }

    checkOnlineStatus = async () => {
        try {
            const online = await fetch("https://get.geojs.io/v1/ip/country.json?ip=8.8.8.8");
            return online.status >= 200 && online.status < 300; // either true or false
        } catch (err) {
            return false; // definitely offline
        }
    };


    reconnectCreator = (peer) => {
        const stun_mod = this.app.modules.returnModule('Stun');
        let checkOnlineInterval = setInterval(async () => {
            let online = await this.checkOnlineStatus();
            if (!online) {
                this.updateConnectionMessage('please check internet connectivity');
            }
            else {
                clearInterval(checkOnlineInterval);
                this.updateConnectionMessage('sending connection request');

                // check if other peer is online, then send a connection.
                let id = this.app.crypto.stringToBase64(JSON.stringify(peer));
                let command = {
                    name: 'PING',
                    id,
                    status: null,
                    room_code: this.room_code,
                    callback: () => {
                        const stun_mod = this.app.modules.returnModule('Stun');
                        stun_mod.createMediaChannelConnectionWithPeers([peer], 'large', 'video', stun_mod.room_code, false);
                    }
                }
                this.mod.saveCommand(command);
                let my_pub_key = this.app.wallet.returnPublicKey();
                this.mod.sendCommandToPeerTransaction(peer, my_pub_key, command);

                let count = 0;
                const checkPingInterval = setInterval(() => {
                    stun_mod.commands.forEach(c => {
                        if (c.id === command.id) {
                            if (command.status === "success") {
                                command.callback();
                                clearInterval(checkPingInterval);
                                stun_mod.deleteCommand(command);
                            } else if (command.status === "failed") {
                                this.disconnectFromPeer(peer, "cannot reconnect, peer not available");
                                console.log('connection to peer failed');
                                clearInterval(checkPingInterval);
                                stun_mod.deleteCommand(command);
                            } else {
                                if (count === 5) {
                                    command = {
                                        name: 'PING',
                                        id,
                                        status: null,
                                        room_code: this.room_code,
                                        callback: () => {
                                            const stun_mod = this.app.modules.returnModule('Stun');
                                            stun_mod.createMediaChannelConnectionWithPeers([peer], 'large', 'video', stun_mod.room_code, false);
                                        }
                                    }
                                    this.mod.saveCommand(command);
                                    this.mod.sendCommandToPeerTransaction(peer, my_pub_key, command);
                                    // console.log('sending command again');
                                }
                                if (count === 10) {
                                    this.disconnectFromPeer(peer, "cannot reconnect, peer not available");
                                    clearInterval(checkPingInterval);
                                    stun_mod.deleteCommand(command);
                                }
                            }
                        }
                    })
                    count++;
                }, 2000)
            }
        }, 2000)
    }

    reconnectRecipient(peer) {
        let count = 0
        let checkOnlineInterval = setInterval(async () => {
            let online = await this.checkOnlineStatus();
            if (!online) {
                this.updateConnectionMessage('please check internet connectivity');
            } else {
                clearInterval(checkOnlineInterval)
                const stun_mod = this.app.modules.returnModule('Stun');
                this.updateConnectionMessage('accepting connection request');
                let id = this.app.crypto.stringToBase64(JSON.stringify(peer));
                console.log('connecting to id: ', id)
                let command = {
                    name: 'PING',
                    id,
                    status: null,
                    room_code: this.room_code,
                    callback: () => { }
                }
                this.mod.saveCommand(command);
                let my_pub_key = this.app.wallet.returnPublicKey();
                this.mod.sendCommandToPeerTransaction(peer, my_pub_key, command);

                let count = 0;
                const checkPingInterval = setInterval(() => {
                    stun_mod.commands.forEach(c => {
                        if (c.id === command.id) {
                            if (command.status === "success") {
                                command.callback();
                                clearInterval(checkPingInterval)
                                stun_mod.deleteCommand(command);
                            } else if (command.status === "failed") {
                                this.disconnectFromPeer(peer, "cannot reconnect, peer not available");
                                clearInterval(checkPingInterval);
                            } else {
                                if (count === 5) {
                                    command = {
                                        name: 'PING',
                                        id,
                                        status: null,
                                        room_code: this.room_code,
                                        callback: () => { }
                                    }
                                    this.mod.saveCommand(command);
                                    this.mod.sendCommandToPeerTransaction(peer, my_pub_key, command);
                                }
                                if (count === 10) {
                                    this.disconnectFromPeer(peer, "cannot reconnect, peer not available");
                                    clearInterval(checkPingInterval);
                                    stun_mod.deleteCommand(command);
                                }
                            }
                        }
                    })
                    count++;
                }, 2000)
            }
        }, 2000)
    }


    _reconnectRecipient(peer) {
        let count = 0
        this.updateConnectionMessage("awaiting connection");
        this.receiving_connection = false;
        let interval = setInterval(() => {
            if (count === 60) {
                if (!this.receiving_connection) {
                    this.disconnectFromPeer(peer, "no connection received");
                }
                clearInterval(interval);
            }
            count++;
        }, 1000)
    }


    _reconnectCreator = (peer) => {
        this.updateReconnectionButton(false);
        const stun_mod = this.app.modules.returnModule('Stun');
        let checkOnlineInterval = setInterval(async () => {
            let online = await this.checkOnlineStatus();
            if (!online) {
                this.updateConnectionMessage('please check internet connectivity');
            }
            else {
                clearInterval(checkOnlineInterval);
                this.updateConnectionMessage('sending connection request');
                // check if other peer is online, then send a connection.
                let id = this.app.crypto.stringToBase64(JSON.stringify(peer));
                let command = {
                    name: 'PING',
                    id,
                    status: null,
                    room_code: this.room_code,
                    callback: () => {
                        const stun_mod = this.app.modules.returnModule('Stun');
                        stun_mod.createMediaChannelConnectionWithPeers([peer], 'large', 'video', stun_mod.room_code, false);
                    }
                }
                this.mod.saveCommand(command);
                let my_pub_key = this.app.wallet.returnPublicKey();
                this.mod.sendCommandToPeerTransaction(peer, my_pub_key, command);

                let count = 0;
                const checkPingInterval = setInterval(() => {
                    stun_mod.commands.forEach(c => {
                        if (c.id === command.id) {
                            if (command.status === "success") {
                                command.callback();
                                clearInterval(checkPingInterval);
                                stun_mod.deleteCommand(command);
                            } else if (command.status === "failed") {
                                this.disconnectFromPeer(peer, "cannot reconnect, peer not available");
                                console.log('connection to peer failed');
                                clearInterval(checkPingInterval);
                                stun_mod.deleteCommand(command);
                            } else {
                                this.updateReconnectionButton(true);
                                // if (count === 5) {
                                //     command = {
                                //         name: 'PING',
                                //         id,
                                //         status: null,
                                //         room_code: this.room_code,
                                //         callback: () => {
                                //             const stun_mod = this.app.modules.returnModule('Stun');
                                //             stun_mod.createMediaChannelConnectionWithPeers([peer], 'large', 'video', stun_mod.room_code, false);
                                //         }
                                //     }
                                //     this.mod.saveCommand(command);
                                //     this.mod.sendCommandToPeerTransaction(peer, my_pub_key, command);
                                // }
                                // if (count === 10) {
                                //     this.disconnectFromPeer("cannot reconnect, user is offline");
                                //     clearInterval(checkPingInterval);
                                //     stun_mod.deleteCommand(command);
                                // }
                            }
                        }
                    })
                    count++;
                }, 1000)
            }
        }, 2000)
    }



}


module.exports = VideoBox;
