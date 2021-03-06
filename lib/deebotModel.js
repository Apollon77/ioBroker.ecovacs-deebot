/* eslint-disable quotes */

// Useful for features that are implemented in most models
// but should be disabled on some models
const DEFAULT_VALUES = {
    "control.pause": true,
    "control.playSound": true,
    "control.playIamHere": true
};

// Lookup table for features that can be enabled or disabled in adapter config
// It is possible to group them
const CONFIG_FEATURE_STATES = {
    "info.dustbox": "info.dustbox",
    "cleaninglog.channel": "cleaninglog.channel",
    "control.pause": "control.pause",
    "control.playSound": "control.playSound",
    "control.playIamHere": "control.playIamHere",
    "control.resume": "control.resume",
    "control.move": "control.move",
    "control.pauseWhenEnteringSpotArea": "control.experimental",
    "control.pauseWhenLeavingSpotArea": "control.experimental",
    "control.pauseBeforeDockingChargingStation": "control.experimental",
    "control.goToPosition": "control.experimental",
    "map.virtualBoundaries": "map.virtualBoundaries",
    "map.virtualBoundaries.save": "map.virtualBoundaries.write",
    "map.virtualBoundaries.delete": "map.virtualBoundaries.write",
    "map.spotAreas.cleanSpeed": "map.spotAreas.cleanSpeed",
    "map.spotAreas.waterLevel": "map.spotAreas.waterLevel"
};

const SUPPORTED_STATES = {
    "115": {
        "name": "DEEBOT OZMO/PRO 930 Series",
        "control.resume": true,
        "control.cleanSpeed": false,
        "info.dustbox": true,
        "info.sleepStatus": true,
        "map.deebotPosition": true,
        "map.chargePosition": true,
        "cleaninglog.channel": true,
        "map": true,
        "map.currentMapName": true,
        "map.currentMapIndex": true,
        "map.currentMapMID": true,
        "map.spotAreas": true,
        "map.deebotPositionCurrentSpotAreaID": true,
        "map.lastUsedAreaValues": true,
        "consumable.reset": true,
        "control.doNotDisturb": true,
        "control.continuousCleaning": true
    },
    "yna5xi": {
        "name": "DEEBOT OZMO 950 Series",
        "control.resume": true,
        "control.cleanSpeed": true,
        "control.relocate": true,
        "info.dustbox": false,
        "info.sleepStatus": true,
        "info.network.ip": true,
        "info.network.wifiSSID": true,
        "info.network.wifiSignal": true,
        "info.network.mac": true,
        "map": true,
        "map.currentMapName": true,
        "map.currentMapIndex": true,
        "map.currentMapMID": true,
        "map.relocationState": true,
        "map.deebotPosition": true,
        "map.deebotPositionIsInvalid": true,
        "map.deebotPositionCurrentSpotAreaID": true,
        "map.chargePosition": true,
        "map.spotAreas": true,
        "map.mapImage": true,
        "cleaninglog.channel": true,
        "cleaninglog.lastCleaningMap": true,
        "map.lastUsedAreaValues" : true,
        "control.volume": true,
        "consumable.reset": true
    },
    "vi829v": {
        "name": "DEEBOT OZMO 920",
        "deviceClassLink": "yna5xi"
    },
    "9rft3c": {
        "name": "DEEBOT OZMO T5",
        "deviceClassLink": "yna5xi"
    },
    "h18jkh": {
        "name": "DEEBOT OZMO T8",
        "control.resume": true,
        "control.cleanSpeed": true,
        "control.relocate": true,
        "info.dustbox": false,
        "info.sleepStatus": true,
        "info.network.ip": true,
        "info.network.wifiSSID": true,
        "info.network.wifiSignal": true,
        "info.network.mac": true,
        "map": true,
        "map.currentMapName": true,
        "map.currentMapIndex": true,
        "map.currentMapMID": true,
        "map.relocationState": true,
        "map.deebotPosition": true,
        "map.deebotPositionIsInvalid": true,
        "map.deebotPositionCurrentSpotAreaID": true,
        "map.chargePosition": true,
        "map.spotAreas": true,
        "cleaninglog.channel": true,
        "cleaninglog.lastCleaningMap": true,
        "map.lastUsedAreaValues" : true,
        "control.volume": true,
        "consumable.reset": true
    },
    "x5d34r": {
        "name": "DEEBOT OZMO T8 AIVI",
        "deviceClassLink": "h18jkh"
    },
    "b742vd": {
        "name": "DEEBOT OZMO T8",
        "deviceClassLink": "h18jkh"
    },
    "0bdtzz": {
        "name": "DEEBOT OZMO T8 PURE",
        "deviceClassLink": "h18jkh"
    },
    "fqxoiu": {
        "name": "DEEBOT OZMO T8+",
        "deviceClassLink": "h18jkh"
    },
    "55aiho": {
        "name": "DEEBOT OZMO T8+",
        "deviceClassLink": "h18jkh"
    },
    "wgxm70": {
        "name": "DEEBOT T8",
        "deviceClassLink": "h18jkh"
    },
    "bs40nz": {
        "name": "DEEBOT T8 AIVI",
        "deviceClassLink": "h18jkh"
    },
    "a1nNMoAGAsH": {
        "name": "DEEBOT T8 MAX",
        "deviceClassLink": "h18jkh"
    },
    "vdehg6": {
        "name": "DEEBOT T8 AIVI +",
        "deviceClassLink": "h18jkh"
    },
    "no61kx": {
        "name": "DEEBOT T8 POWER",
        "deviceClassLink": "h18jkh"
    },
    "ucn2xe": {
        "name": "DEEBOT T9",
        "deviceClassLink": "h18jkh"
    },
    "lhbd50": {
        "name": "DEEBOT T9+",
        "deviceClassLink": "h18jkh"
    },
    "jffnlf": {
        "name": "DEEBOT N3 MAX",
        "deviceClassLink": "h18jkh"
    },
    "r5zxjr": {
        "name": "DEEBOT N7",
        "deviceClassLink": "h18jkh"
    },
    "n6cwdb": {
        "name": "DEEBOT N8",
        "deviceClassLink": "h18jkh"
    },
    "r5y7re": {
        "name": "DEEBOT N8",
        "deviceClassLink": "h18jkh"
    },
    "ty84oi": {
        "name": "DEEBOT N8",
        "deviceClassLink": "h18jkh"
    },
    "36xnxf": {
        "name": "DEEBOT N8",
        "deviceClassLink": "h18jkh"
    },
    "snxbvc": {
        "name": "DEEBOT N8 PRO",
        "deviceClassLink": "h18jkh"
    },
    "yu362x": {
        "name": "DEEBOT N8 PRO",
        "deviceClassLink": "h18jkh"
    },
    "7bryc5": {
        "name": "DEEBOT N8+",
        "deviceClassLink": "h18jkh"
    },
    "b2jqs4": {
        "name": "DEEBOT N8+",
        "deviceClassLink": "h18jkh"
    },
    "123": {
        "name": "DEEBOT Slim2 Series",
        "control.pause": false,
        "control.playSound": false,
        "control.playIamHere": false,
        "info.dustbox": false,
        "info.network.ip": true,
        "info.network.wifiSSID": true,
        "control.cleanSpeed": false,
        "map": false
    },
    "126": {
        "name": "DEEBOT N79",
        "cleaninglog.channel": false
    },
    "155": {
        "name": "DEEBOT N79S/SE",
        "control.cleanSpeed": true
    },
    "165": {
        "name": "DEEBOT N79T/W",
        "control.cleanSpeed": true,
        "cleaninglog.channel": false
    },
    "uv242z": {
        "name": "DEEBOT 710",
        "control.pause": false,
        "info.dustbox": true,
        "map.deebotPosition": true
    },
    "ls1ok3": {
        "name": "DEEBOT 900 Series",
        "control.resume": true,
        "map.deebotPosition": true,
        "map.chargePosition": true,
        "map": true,
        "map.currentMapName": true,
        "map.currentMapIndex": true,
        "map.currentMapMID": true,
        "map.spotAreas": true,
        "map.deebotPositionCurrentSpotAreaID": true,
        "map.lastUsedAreaValues" : true,
        "control.cleanSpeed": true,
        "cleaninglog.channel": true,
        "cleaninglog.lastCleaningMap": true,
        "info.dustbox": false,
        "info.sleepStatus": true,
        "consumable.reset": true,
        "control.doNotDisturb": true,
        "control.continuousCleaning": true
    },
    "y79a7u": {
        "name": "DEEBOT OZMO 900 Series",
        "control.resume": true,
        "control.cleanSpeed": true,
        "map": true,
        "map.currentMapName": true,
        "map.currentMapIndex": true,
        "map.currentMapMID": true,
        "map.deebotPosition": true,
        "map.deebotPositionIsInvalid": true,
        "map.deebotPositionCurrentSpotAreaID": true,
        "map.chargePosition": true,
        "map.spotAreas": true,
        "cleaninglog.channel": true,
        "cleaninglog.lastCleaningMap": true,
        "map.lastUsedAreaValues" : true
    },
    "ipzjy0": {
        "name": "DEEBOT U2",
        "control.cleanSpeed": true,
        "control.playSound": false
    },
    "rvo6ev": {
        "name": "DEEBOT U2",
        "deviceClassLink": "ipzjy0"
    },
    "wlqdkp": {
        "name": "DEEBOT U2",
        "deviceClassLink": "ipzjy0"
    },
    "nq9yhl": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "y2qy3m": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "7j1tu6": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "ts2ofl": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "c0lwyn": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "d4v1pm": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "u6eqoa": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "12baap": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "u4h1uk": {
        "name": "DEEBOT U2 PRO",
        "deviceClassLink": "ipzjy0"
    },
    "1zqysa": {
        "name": "DEEBOT U2 POWER",
        "deviceClassLink": "ipzjy0"
    },
    "chmi0g": {
        "name": "DEEBOT U2 POWER",
        "deviceClassLink": "ipzjy0"
    },
    "02uwxm": {
        "name": "DEEBOT OZMO Slim10 Series",
        "control.playIamHere": false
    }
};

class Model {
    constructor(deviceClass, config) {
        this.deviceClass = deviceClass;
        this.config = config;
    }

    getDeviceClass() {
        if (SUPPORTED_STATES[this.deviceClass]) {
            if (Object.prototype.hasOwnProperty.call(SUPPORTED_STATES[this.deviceClass], 'deviceClassLink')) {
                return SUPPORTED_STATES[this.deviceClass].deviceClassLink;
            }
        }
        return this.deviceClass;
    }

    isSupportedFeature(state) {
        if (this.getDeviceClass() && this.config) {
            let configOptionName = state;
            let configOptionVal = '';
            if (Object.prototype.hasOwnProperty.call(CONFIG_FEATURE_STATES, state)) {
                configOptionName = CONFIG_FEATURE_STATES[state];
                if (this.config['feature.' + configOptionName]) {
                    configOptionVal = this.config['feature.' + configOptionName];
                }
            }
            if ((configOptionVal === '') && Object.prototype.hasOwnProperty.call(SUPPORTED_STATES, this.getDeviceClass())) {
                const features = SUPPORTED_STATES[this.getDeviceClass()];
                if (Object.prototype.hasOwnProperty.call(features, state)) {
                    return features[state];
                }
            }
            else if (parseInt(configOptionVal) === 1) {
                return true;
            }
        }
        if (Object.prototype.hasOwnProperty.call(DEFAULT_VALUES, state)) {
            return DEFAULT_VALUES[state];
        }
        return false;
    }
}

module.exports = Model;
