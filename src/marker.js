class Marker extends layerAbstract {
    constructor($host, x, y) {
        super($host, x, y);
    }

    setPosition(x, y) {
        super.setPosition(x, y);
        this.$host.css({
            left: `${x}px`,
            top:  `${y}px`
        });
    }

    dropAt(x, y, speed = 0) {
        this.$host
            .css({
                opacity: 0,
                left: `${x}px`,
                top: `${y - 100}px`
            })
            .stop(true, true)
            .animate({
                opacity: 1,
                top: `${y}px`
            }, speed);
    }
}
