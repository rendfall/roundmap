class layerAbstract {
    constructor($host, x, y) {
        this.$host = $host;
        this.setPosition(x, y);
    }

    hide() {
        this.$host.css('opacity', 0);
    }

    show() {
        this.$host.css('opacity', 1);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    on(eventName, handlerFn) {
        this.$host.on(eventName, handlerFn);
    }
}
