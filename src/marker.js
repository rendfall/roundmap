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
