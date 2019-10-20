'use strict';

const utils = require('@iobroker/adapter-core');
const sucks = require('sucks');
const nodeMachineId = require('node-machine-id');
const EcoVacsAPI = sucks.EcoVacsAPI;
const VacBot = sucks.VacBot;

class EcovacsDeebot extends utils.Adapter {

    constructor(options) {
        super({
            ...options,
            name: 'ecovacs-deebot',
        });

        this.on('ready', this.onReady.bind(this));
        this.on('objectChange', this.onObjectChange.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.deviceName = null;
        this.vacbot = null;
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Reset the connection indicator during startup
        this.setState('info.connection', false);
        this.connect();
        this.subscribeStates('*');
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            this.setState('info.connection', false);
            this.log.info('cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed object changes
     * @param {string} id
     * @param {ioBroker.Object | null | undefined} obj
     */
    onObjectChange(id, obj) {
        if (obj) {
            // The object was changed
            this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        } else {
            // The object was deleted
            this.log.info(`object ${id} deleted`);
        }
    }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {

        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
        if ((this.getStateById(id) !== 'timestampOfLastStateChange') && (this.getStateById(id) !== 'dateOfLastStateChange')) {
            this.setState('info.timestampOfLastStateChange', Math.floor(Date.now()/1000));
            this.setState('info.dateOfLastStateChange', this.formatDate(new Date(), "TT.MM.JJJJ SS:mm:ss"));
        }

        let channel = this.getChannelById(id);
        if (channel === 'control') {
            let state = this.getStateById(id);
            switch (state) {
                case 'clean':
                case 'stop':
                case 'edge':
                case 'spot':
                case 'charge':
                    this.vacbot.run(state);
                    break;
            }
        }
    }

    getChannelById(id) {
        let channel = id.split('.')[3];
        return channel;
    }

    getStateById(id) {
        let state = id.split('.')[4];
        return state;
    }

    async connect() {
        this.setState('info.error', '');

        if ((!this.config.email)||(!this.config.password)||(!this.config.countrycode)) {
            this.error('Missing values in adapter config',true);
            return;
        }
        const password_hash = EcoVacsAPI.md5(this.config.password);
        const device_id = EcoVacsAPI.md5(nodeMachineId.machineIdSync());
        const countries = sucks.countries;
        const continent = countries[this.config.countrycode.toUpperCase()].continent.toLowerCase();

        const api = new EcoVacsAPI(device_id, this.config.countrycode, continent);
        api.connect(this.config.email, password_hash).then(() => {
            api.devices().then((devices) => {
                this.log.info("Devices:" + JSON.stringify(devices));
                let vacuum = devices[0];
                this.deviceName = vacuum.nick;
                this.createStates();
                this.vacbot = new VacBot(api.uid, EcoVacsAPI.REALM, api.resource, api.user_access_token, vacuum, continent);
                this.vacbot.on('ready', (event) => {
                    this.vacbot.on('ChargeState', (chargestatus) => {
                        this.setState('info.chargestatus', chargestatus);
                        if (chargestatus === 'charging') {
                            this.setState('info.cleanstatus', '');
                        }
                    });
                    this.vacbot.on('CleanReport', (cleanstatus) => {
                        this.setState('info.cleanstatus', cleanstatus);
                        if (cleanstatus === 'auto') {
                            this.setState('info.chargestatus', '');
                        }
                    });
                    this.vacbot.on('BatteryInfo', (batterystatus) => {
                        this.setState('info.battery', Math.round(batterystatus*100));
                    });
                    // Doesn't seem to work...
                    this.vacbot.on('Error', (message) => {
                        this.error(message,false);
                    });
                });
                this.vacbot.connect_and_wait_until_ready();
                this.setState('info.connection', true);
            });
        }).catch((e) => {
            this.error('Failure in connecting!',true);
        });
    }

    error(message,stop) {
        if (stop) {
            this.setState(this.deviceName + '.info.connection', false);
        }
        this.setState('info.error', message);
        this.log.error(message);
    }

    async createStates() {
        const buttons = new Map();
        buttons.set('clean', 'start automatic cleaning');
        buttons.set('edge', 'start edge cleaning');
        buttons.set('spot', 'start spot cleaning');
        buttons.set('stop', 'stop cleaning');
        buttons.set('charge', 'go back to charging station');
        for (const [objectName, name] of buttons) {
            await this.setObjectNotExists('.control.'+objectName, {
                type: 'state',
                common: {
                    name: name,
                    type: 'boolean',
                    role: 'button',
                    read: true,
                    write: true
                },
                native: {},
            });
        }
        await this.setObjectNotExists('.info.deviceName', {
            type: 'state',
            common: {
                name: 'Name of the device',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
                def: this.deviceName
            },
            native: {},
        });
        await this.setObjectNotExists('.info.timestampOfLastStateChange', {
            type: 'state',
            common: {
                name: 'Timestamp of last state change',
                type: 'state',
                role: 'value.datetime',
                read: true,
                write: true
            },
            native: {},
        });
        await this.setObjectNotExists('.info.dateOfLastStateChange', {
            type: 'state',
            common: {
                name: 'Human readable timestamp of last state change',
                type: 'state',
                role: 'value.datetime',
                read: true,
                write: false
            },
            native: {},
        });
        await this.setObjectNotExists('.info.battery', {
            type: 'state',
            common: {
                name: 'Battery status',
                type: 'integer',
                role: 'value.battery',
                read: true,
                write: false,
                unit: '%'
            },
            native: {},
        });
        await this.setObjectNotExists('.info.connection', {
            type: 'state',
            common: {
                name: 'Connection status',
                type: 'boolean',
                role: 'indicator.connected',
                read: true,
                write: false
            },
            native: {},
        });
        await this.setObjectNotExists(this.deviceName + '.info.cleanstatus', {
            type: 'state',
            common: {
                name: 'Clean status',
                type: 'string',
                role: 'indicator.status',
                read: true,
                write: false
            },
            native: {},
        });
        await this.setObjectNotExists(this.deviceName + '.info.chargestatus', {
            type: 'state',
            common: {
                name: 'Charge status',
                type: 'string',
                role: 'indicator.status',
                read: true,
                write: false
            },
            native: {},
        });
        await this.setObjectNotExists(this.deviceName + '.info.error', {
            type: 'state',
            common: {
                name: 'Error messages',
                type: 'string',
                role: 'indicator.error',
                read: true,
                write: false
            },
            native: {},
        });
    }
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new EcovacsDeebot(options);
} else {
    // otherwise start the instance directly
    new EcovacsDeebot();
}