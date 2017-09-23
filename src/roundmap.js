class RoundMap {
    constructor(options) {
        this.$container = $(options.container);
        this.options = options;

        this.fallingSpeed = 350;
        this.rotateOffset = 1350;

        this.createWorld();
        this.createMarker();

        this.initialize();
        this.setupMouseEvents();
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

    updateWorldPosition(x, y) {
        let newX = this.world.x + x;
        let newY = this.world.y + y;

        this.world.setPosition(newX, newY);
        this.updateMarkerPosition(x, y);
    }

    updateMarkerPosition(x, y) {
        let boundX = this.$container.width();
        let boundY = this.$container.height();
        let newX = this.marker.x + x;
        let newY = this.marker.y + y;

        newX = (newX > boundX) ? this.marker.x : newX;
        newY = (newY > boundY) ? this.marker.y : newY;

        newX = (newX < 0) ? this.marker.x : newX;
        newY = (newY < 0) ? this.marker.y : newY;

        this.marker.setPosition(newX, newY);
    }

    setupMouseEvents() {
        let $marker = this.marker.$host;
        let $world = this.world.$host;
        let markerDragger = new Dragger($marker.get(0));
        let worldDragger = new Dragger($world.get(0));

        markerDragger.onDrag((pos) => {
            this.updateMarkerPosition(pos.diffX, pos.diffY);
        });

        worldDragger.onDrag((pos) => {
            this.updateWorldPosition(pos.diffX, pos.diffY);
        });
    }
} 
