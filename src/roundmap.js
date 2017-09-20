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
