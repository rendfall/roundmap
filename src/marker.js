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
        let initialTop = parseInt(styleRef.top) - 100 + 'px';
        let finialTop = styleRef.top;
        styleRef.top = initialTop;

        animate(this.$elRef, {
            opacity: [0, 1],
            top: [initialTop, finialTop]
        }, speed);
    }
}
