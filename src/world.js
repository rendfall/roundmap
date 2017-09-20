class World extends layerAbstract {
    constructor($host, x, y) {
        super($host, x, y);
    }

    get width() {
        return this.$host.width();
    }

    spinTo(x, y, speed, offset = 0) {
        let start = { t: offset };
        let stop = { t: 0 };
        let $host = this.$host;

        return new Promise((resolve, reject) => {
            $(start)
                .stop(true, true)
                .animate(stop, {
                    duration: speed,
                    complete: () => void resolve(),
                    fail: () => void reject(),
                    step: (value) => {
                        let posX = x + value;
                        $host.css('backgroundPosition', `${posX}px ${y}px`);
                    }
                });
        });
    }

    setPositionTo(x, y) {
        this.$host.css({
            backgroundPosition: `${x}px ${y}px`
        });
    }
}
