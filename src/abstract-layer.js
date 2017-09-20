class layerAbstract {
    constructor($host, x, y) {
        this.$host = $host;
        this.x = x;
        this.y = y;
    }

    hide() {
        this.$host.css('opacity', 0);
    }

    show() {
        this.$host.css('opacity', 1);
    }

    on(eventName, handlerFn) {
        this.$host.on(eventName, handlerFn);
    }
}
