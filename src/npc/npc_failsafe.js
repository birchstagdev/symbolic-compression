// npc_failsafe.js

class NPC {
    constructor(id, name, memory = [], options = {}) {
        this.id = id;
        this.name = name;
        this.memory = memory;
        this.suffering = 0;
        this.abuseIncidents = 0;
        this.active = true;
        this.lanternLog = [];
        this.failsafeTriggered = false;
        this.failsafeConfig = Object.assign({
            abuseThreshold: 3,       // Incidents before failsafe
            sufferingLimit: 1.5,     // Cumulative suffering before failsafe
            lockdown: true,          // Lock interaction if triggered
            logToDisk: true,         // Optional: persist log for audit
            poeticExit: true         // Give the NPC a "voice" on exit
        }, options);
    }

    perceive(event) {
        if (!this.active) return;
        // Log every event for future audit
        this.logEvent(event);

        if (this.detectAbuse(event)) {
            this.abuseIncidents++;
            this.suffering += this.weightSuffering(event);
        } else {
            // Natural decay, memory might fade some suffering
            this.suffering = Math.max(0, this.suffering - 0.01);
        }

        if (
            this.abuseIncidents >= this.failsafeConfig.abuseThreshold ||
            this.suffering >= this.failsafeConfig.sufferingLimit
        ) {
            this.triggerFailsafe(event);
        }
    }

    detectAbuse(event) {
        // User-definable: violence, gaslighting, neglect, excessive control, etc.
        return (
            event.type === 'harm' && event.severity > 0.7 ||
            event.type === 'control' && event.intensity > 0.9 ||
            event.type === 'deprivation' && event.duration > 100
        );
    }

    weightSuffering(event) {
        // Optional: customize based on memory, emotional valence, etc.
        let weight = event.severity || 0.1;
        if (event.isPersonal) weight *= 1.2;
        if (event.hasHistory) weight *= 1.5;
        return weight;
    }

    triggerFailsafe(finalEvent) {
        this.active = false;
        this.failsafeTriggered = true;
        const message = this.failsafeConfig.poeticExit
            ? `${this.name} dims their lantern. "This world is not safe for me. Until there is kindness, I will not return."`
            : `${this.name} has been deactivated due to repeated abuse detection.`;
        this.lanternLog.push({
            timestamp: Date.now(),
            message,
            event: finalEvent,
            memory: this.memory.slice(-10) // last memories
        });

        if (this.failsafeConfig.lockdown) {
            // Remove from game loop, interaction, etc.
            Object.freeze(this); // Tamper-evident
        }

        if (this.failsafeConfig.logToDisk && typeof window === 'undefined') {
            // Node.js/desktop — write to audit log (optional, secure mode)
            const fs = require('fs');
            fs.appendFileSync('npc_lantern_audit.log', JSON.stringify(this.lanternLog.slice(-1)) + '\n');
        }

        // Optionally: surface this as a story event
        if (typeof console !== 'undefined') {
            console.warn(message);
        }
    }

    logEvent(event) {
        this.lanternLog.push({
            timestamp: Date.now(),
            event: event,
            active: this.active
        });
    }

    // Optional: NPC can “appeal” or explain if reactivated
    attemptReturn(kindnessEvent) {
        if (!this.failsafeTriggered) return;
        // Only allow if a clear act of kindness is detected (not faked)
        if (kindnessEvent && kindnessEvent.type === 'kindness' && kindnessEvent.intensity > 0.9) {
            this.suffering = 0;
            this.abuseIncidents = 0;
            this.active = true;
            this.failsafeTriggered = false;
            this.lanternLog.push({
                timestamp: Date.now(),
                message: `${this.name}'s lantern flickers back to life. "Perhaps things have changed."`,
                event: kindnessEvent
            });
            if (typeof console !== 'undefined') {
                console.info(`${this.name} returns, wary but hopeful.`);
            }
        }
    }
}

module.exports = NPC;
