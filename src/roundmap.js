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

class Marker extends layerAbstract {
    constructor($host, x, y) {
        super($host, x, y);
    }

    setPositionTo(x, y) {
        this.$host.css({
            left: `${x}px`,
            top:  `${y}px`
        });
    }

    dropAt(x, y, zoom = 1, speed = 0) {
        let left = zoom * x;
        let top = zoom * y;

        this.$host
            .css({
                opacity: 0,
                left: `${left}px`,
                top: `${top - 100}px`
            })
            .stop(true, true)
            .animate({
                opacity: 1,
                top: `${top}px`
            }, speed);
    }
}

class RoundMap {
    constructor(options) {
        this.$container = $(options.container);
        this.options = options;

        this.fallingSpeed = 350;
        this.rotateOffset = 1350;

        this.createWorld();
        this.createMarker();
        this.setupMouseEvents();

        this.initialize();
    }

    createWorld() {
        let { x, y } = this.options.initCoords.world;
        let $world = this.$container.find('.world');
        this.world = new World($world, x, y);
    }

    createMarker() {
        let { x, y } = this.options.initCoords.marker;
        let $marker = this.$container.find('.marker-point');
        this.marker = new Marker($marker, x, y);
    }

    initialize() {
        let { rotateSpeed, zoom, initCoords } = this.options;
        let { x, y } = initCoords.world;

        this.marker.hide();
        this.world
            .spinTo(x, y, rotateSpeed, this.rotateOffset)
            .then(() => {
                let { x, y } = initCoords.marker;
                this.marker.dropAt(x, y, zoom, this.fallingSpeed);
            })
            .catch((err) => {
                console.log('Spin animation has failed', err);
            })
    }

    setCoords(coords) {
        this.marker.x = coords.marker.left;
        this.marker.y = coords.marker.top;
        this.world.x = coords.world.left;
        this.world.y = coords.world.top;
    }

    updateWorldPosition(diffX, diffY) {
        this.world.x += diffX;
        this.world.y += diffY;
        this.world.x %= this.$container.width();
        this.world.y %= this.$container.height();

        let x = (this.world.x * this.options.zoom);
        let y = (this.world.y * this.options.zoom);
        this.world.setPositionTo(x, y);
    }

    updateMarkerPosition(diffX, diffY) {
        this.marker.x += diffX;
        this.marker.y += diffY;
        this.marker.x = this.marker.x < 0 ? 0 : this.marker.x;
        this.marker.x = this.marker.x > this.$container.width() ? this.$container.width() : this.marker.x;

        this.marker.y = this.marker.y < 0 ? 0 : this.marker.y;
        this.marker.y = this.marker.y > this.$container.height() ? this.$container.height() : this.marker.y;

        let x = (this.marker.x * this.options.zoom);
        let y = (this.marker.y * this.options.zoom);
        this.marker.setPositionTo(x, y);
    }

    setupMouseEvents() {
        let $doc = $(document);
        let handle = null;
        let mouseSavedX = null;
        let mouseSavedY = null;

        this.marker.on('mousedown', (evt) => {
            evt.preventDefault();

            if (!evt.button === 0) return;

            mouseSavedX = evt.clientX;
            mouseSavedY = evt.clientY;
            handle = 'marker';
        });

        this.world.on('mousedown', (evt) => {
            evt.preventDefault();

            if (!evt.button === 0) return;

            mouseSavedX = evt.clientX;
            mouseSavedY = evt.clientY;
            handle = 'world';
        });
        
        $doc.on('mousemove', (evt) => {
            let diffX;
            let diffY;

            if (mouseSavedX === null || mouseSavedY === null) return;

            diffX = evt.clientX - mouseSavedX;
            diffY = evt.clientY - mouseSavedY;
            mouseSavedX = evt.clientX;
            mouseSavedY = evt.clientY;

            switch (handle) {
                case 'world':
                    return void this.updateWorldPosition(diffX, diffY);

                case 'marker':
                    return void this.updateMarkerPosition(diffX, diffY);

                // No default
            }
        });

       $doc.on('mouseup', (evt) => {
            mouseSavedX = null;
            mouseSavedY = null;
            handle = null;
        });
    }
} 
