class Dragger {
    static mouseClicked(buttonCode) {
        let check = (n) => (buttonCode === n);
        return {
            get isPrimary() { return check(0); }, //Main button pressed, usually the left button or the un-initialized state
            get isMiddle() { return check(1); }, // Auxiliary button pressed, usually the wheel button or the middle button (if present)
            get isSecondary() { return check(2); }, // Secondary button pressed, usually the right button
            get isSide() { return check(3); },// Fourth button, typically the Browser Back button
            get isExtra() { return check(4); } // Fifth button, typically the Browser Forward button
        }
    }

    constructor($elRef) {
        this.$element = $elRef;
    }

    onDrag(callbackFn) {
        this.$element.addEventListener('mousedown', (evt) => {
            if (Dragger.mouseClicked(evt.button).isPrimary) {
                this.startDrag(evt, callbackFn);
            }
        });
    }

    startDrag(evt, callbackFn) {
        evt.preventDefault();

        let x = evt.clientX;
        let y = evt.clientY;

        function stopDrag() {
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseup', stopDrag);
        }

        function updatePosition(evt) {
            evt.preventDefault();

            let diffX = evt.clientX - x;
            let diffY = evt.clientY - y;
            x = evt.clientX;
            y = evt.clientY;

            if (typeof callbackFn === 'function') {
                callbackFn.call(callbackFn, { diffX, diffY });
            }
        }

        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('mousemove', updatePosition);
    }
}
