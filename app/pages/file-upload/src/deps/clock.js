export default class Clock {

    #getUnit(ms) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const seconds = Math.floor((ms - Date.now()) / 1000);

        if (seconds < 60) {
            return rtf.format(seconds, 'second');
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return rtf.format(minutes, 'minute');

        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return rtf.format(hours, 'hour');

        const days = Math.floor(hours / 24);
        return rtf.format(days, 'day');
    }

    start(onTick) {
        this.ms = Date.now();
        this.intervalId = setInterval(() => {
            const took = this.#getUnit(this.ms)
            onTick(took);
        });
        return
    }

    stop() {
        clearInterval(this.intervalId);
        return
    }
}
