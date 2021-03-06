'use strict';

class Queue {
    constructor(adapter, name = 'queue', timeoutValue = 250, duplicateCheck = true) {
        this.adapter = adapter;
        this.name = name;
        this.timeoutValue = timeoutValue;
        this.duplicateCheck = duplicateCheck;
        this.entries = [];
    }

    createForId(channelName, stateName, val) {
        this.resetQueue();
        let quantity = 1;
        if ((channelName === 'control') && (stateName === 'spotArea')) {
            quantity = this.adapter.spotAreaCleanings;
            this.adapter.log.info('[cleaningQueue] Number of spotArea cleanings: ' + quantity);
        }
        // We start at 2 because first run already executed
        for (let c = 2; c <= quantity; c++) {
            this.add(stateName, 'start', val);
        }
    }

    add(cmd, arg1 = null, arg2 = null, arg3 = null) {
        if (this.duplicateCheck) {
            for (let i = 0; i < this.entries.length; i++) {
                const entryObject = this.entries[i];
                if ((entryObject['cmd'] === cmd) && (entryObject['arg1'] === arg1) && (entryObject['arg2'] === arg2) && (entryObject['arg3'] === arg3)) {
                    this.adapter.log.silly('[' + this.name + '] Skipping ' + cmd);
                    return;
                }
            }
        }
        this.entries.push({
            cmd: cmd,
            arg1: arg1,
            arg2: arg2,
            arg3: arg3
        });
        this.adapter.log.silly('[' + this.name + '] Added ' + cmd + ' to the queue (' + this.entries.length + ')');
    }

    addGetCleanLogs() {
        if (this.adapter.getModel().isSupportedFeature('cleaninglog.channel')) {
            this.adapter.cleaningLogAcknowledged = false;
            this.add('GetCleanSum');
            this.add('GetCleanLogs');
        }
    }

    addGetLifespan() {
        if (this.adapter.vacbot.hasMainBrush()) {
            this.add('GetLifeSpan', 'main_brush');
        }
        this.add('GetLifeSpan', 'side_brush');
        this.add('GetLifeSpan', 'filter');
    }

    addOnOff() {
        if (this.adapter.getModel().isSupportedFeature('control.doNotDisturb')) {
            this.add('GetOnOff', 'do_not_disturb');
        }
        if (this.adapter.getModel().isSupportedFeature('control.continuousCleaning')) {
            this.add('GetOnOff', 'continuous_cleaning');
        }
    }

    run(cmd, arg1 = null, arg2 = null, arg3 = null) {
        this.add(cmd, arg1, arg2, arg3);
        this.runAll();
    }

    runAll() {
        this.startNextItemFromQueue(true);
    }

    startNextItemFromQueue(runAll = false) {
        const queued = this.entries[0];
        if (queued) {
            this.entries.shift();
            if (queued.arg1 && queued.arg2 && queued.arg3) {
                this.adapter.vacbot.run(queued.cmd, queued.arg1, queued.arg2, queued.arg3);
                this.adapter.log.debug('[' + this.name + '] startNextItemFromQueue: ' + queued.cmd + ', ' + queued.arg1 + ', ' + queued.arg2 + ', ' + queued.arg3);
            } else if (queued.arg1 && queued.arg2) {
                this.adapter.vacbot.run(queued.cmd, queued.arg1, queued.arg2);
                this.adapter.log.debug('[' + this.name + '] startNextItemFromQueue: ' + queued.cmd + ', ' + queued.arg1 + ', ' + queued.arg2);
            } else if (queued.arg1) {
                this.adapter.vacbot.run(queued.cmd, queued.arg1);
                this.adapter.log.debug('[' + this.name + '] startNextItemFromQueue: ' + queued.cmd + ', ' + queued.arg1);
            } else {
                this.adapter.vacbot.run(queued.cmd);
                this.adapter.log.debug('[' + this.name + '] startNextItemFromQueue: ' + queued.cmd);
            }
            this.adapter.log.silly('[' + this.name + '] startNextItemFromQueue: Removed ' + queued.cmd + ' from ' + this.name + ' (' + this.entries.length + ' left)');
        }
        if (runAll && !this.isEmpty()) {
            setTimeout(() => {
                this.startNextItemFromQueue(true);
            }, this.timeoutValue);
        }
    }

    isEmpty() {
        return (this.entries.length === 0);
    }

    notEmpty() {
        return (!this.isEmpty());
    }

    resetQueue() {
        this.entries.splice(0, this.entries.length);
        this.entries = [];
    }
}

module.exports = Queue;
