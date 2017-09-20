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
        super($host, x, y)
    }

    get width() {
        return this.$host.width();
    }

    spinTo(x, y, speed) {
        return new Promise((resolve, reject) => {
            this.$host.animate({
                'background-position': `${x}px ${y}px`
            }, {
                duration: speed,
                complete: () => resolve()
            });
        });
    }

    setPositionTo(x, y) {
        this.$host.css({
            'background-position': `${x}px ${y}px`
        });
    }
}

class Marker extends layerAbstract {
    constructor($host, x, y) {
        super($host, x, y)
    }

    setPositionTo(x, y) {
        this.$host.css({
            left: `${x}px`,
            top:  `${y}px`
        });
    }

    dropAt(x, y, zoom = 1, speed = 350) {
        let left = zoom * x;
        let top = zoom * y;

        this.$host
            .css({
                opacity: 0,
                left: `${left}px`,
                top: `${top - 100}px`
            })
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

        this.createWorld(0, 0);
        this.createMarker(0, 0);
        this.initialize();
    }

    createWorld(x, y) {
        let $world = this.$container.find('.world');
        this.world = new World($world, x, y);
    }

    createMarker(x, y) {
        let $marker = this.$container.find('.marker-point');
        this.marker = new Marker($marker, x, y);
        this.marker.hide();
    }

    initialize() {
        let offset = (this.world.width * -5);
        let speed = this.options.rotateSpeed / 2;

        this.world.spinTo(offset, speed)
            .then(() => {
                this.moveTo(this.options.initCoords);
            })

        this.setupMouseEvents();
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

    moveTo(coords) {
        this.setCoords(coords);

        // animate
        let pos = (this.options.zoom * this.world.x)+ 'px ' +(this.options.zoom * this.world.y);
        let speed = this.options.rotateSpeed / 4;

        this.world.spinTo(pos).then(() => {
            let x = this.marker.x;
            let y = this.marker.y;
            this.marker.dropAt(x, y, this.options.zoom, this.fallingSpeed);
        });
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
