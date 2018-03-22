class World extends layerAbstract {
    constructor($elRef, x, y) {
        super($elRef, x, y);
    }

    get width() {
        return this.$elRef.clientWidth;
    }

    get height() {
        return this.$elRef.clientHeight;
    }

    spinTo(x, y, speed, offset = 0) {
        let $elRef = this.$elRef;
        let start = `${x}px ${y}px`;
        let end = `${offset}px ${offset}px`;

        return animate($elRef, {
            backgroundPosition: [end, start]
        }, speed);
    }

    setPosition(x, y) {
        super.setPosition(x, y);
        this.$elRef.style.backgroundPosition = `${x}px ${y}px`;
    }
}
