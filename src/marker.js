class Marker extends layerAbstract {
    constructor($elRef, x, y) {
        super($elRef, x, y);
    }

    setPosition(x, y) {
        super.setPosition(x, y);
        this.$elRef.style.left = `${x}px`;
        this.$elRef.style.top = `${y}px`;
    }

    dropAt(x, y, speed = 0) {
        let styleRef = this.$elRef.style;

        // styleRef.opacity = 0;
        // styleRef.left = `${x}px`;
        // styleRef.top = `${y - 100}px`;

        styleRef.opacity = 1;
        styleRef.top = `${y}px`;
    }
}
