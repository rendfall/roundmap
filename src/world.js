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
        let start = { t: offset };
        let stop = { t: 0 };
        let $elRef = this.$elRef;

        return new Promise((resolve, reject) => {
            $elRef.style.backgroundPosition = `${x}px ${y}px`;
            resolve();
        });
    }

    setPosition(x, y) {
        super.setPosition(x, y);
        this.$elRef.style.backgroundPosition = `${x}px ${y}px`;
    }
}
