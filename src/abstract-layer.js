class layerAbstract {
    constructor($elRef, x, y) {
        this.$elRef = $elRef;
        this.setPosition(x, y);
    }

    hide() {
        this.$elRef.style.opacity = 0;
    }

    show() {
        this.$elRef.style.opacity = 1;
    }

    getElement() {
        return this.$elRef;
    }

    getPosition() {
        return { 
            x: this.x,
            y: this.y
        };
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    on(eventName, handlerFn) {
        this.$elRef.addEventListener(eventName, handlerFn);
    }
}
