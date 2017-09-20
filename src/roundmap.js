class RoundMap {
    constructor(options) {
        this.$host = $(options.container);
        this.options = options;
        this.marker = {
            selector: null,
            left: 0,
            top: 0
        };
        this.world = {
            selector: null,
            left: 0,
            top: 0
        };

        this.init();
    }

    init() {
        this.marker.selector = this.$host.find('.marker-point');
        this.world.selector = this.$host.find('.world');
        
        // init animate 
        this.marker.selector.hide();
        this.world.selector.animate({
            'background-position': (this.world.selector.width() * -5)+'px'
        }, {
            duration: this.options.rotate/2,
            complete: () => {
                this.marker.selector.show();
                this.moveTo(this.options.initCoords);
            }
        });

        this.addEvents()
    }

    setCoords(coords) {
        this.marker.left = coords.marker.left;
        this.marker.top = coords.marker.top;
        this.world.left = coords.world.left;
        this.world.top = coords.world.top;
    }

    addOffset(el, diffX, diffY) {
        switch(el){
            case('world'):
                this.world.left += diffX;
                this.world.top += diffY;
                this.world.left = this.world.left % this.$host.width();
                this.world.top = this.world.top % this.$host.height();

                this.world.selector.css({
                    'background-position': (this.world.left * this.options.zoom)+ 'px ' +(this.world.top * this.options.zoom) + 'px'
                    //'background-position-y': this.world.top+'px' 
                });
                break;

            case('marker'):
                this.marker.left += diffX;
                this.marker.top += diffY;
                this.marker.left = this.marker.left < 0 ? 0 : this.marker.left;
                this.marker.left = this.marker.left > this.$host.width() ? this.$host.width() : this.marker.left;

                this.marker.top = this.marker.top < 0 ? 0 : this.marker.top;
                this.marker.top = this.marker.top > this.$host.height() ? this.$host.height() : this.marker.top;
                           
                this.marker.selector.css({
                    'left': (this.marker.left * this.options.zoom)+'px', 
                    'top': (this.marker.top * this.options.zoom)+'px'
                });
            break;
        }
    }

    moveTo(coords) {
        this.setCoords(coords);
        
        // Hide and set marker 
        this.marker.selector
            .css({
                'opacity': 0,
                'left': (this.options.zoom * this.marker.left)+'px', 
                'top': (this.options.zoom * (this.marker.top-100)) +'px'
            });
        
        // animate
        this.world.selector.animate({
            'background-position': (this.options.zoom * this.world.left)+ 'px ' +(this.options.zoom * this.world.top)+'px'
        }, {
            duration: this.options.rotate/4,
            complete: () => {
                this.marker.selector
                .animate({
                    opacity: 1,
                    top: (this.options.zoom * this.marker.top)+'px'
                }, this.options.markerFalling);
            }
        });
    }

    addEvents() {
        let handle = null;
        let mouseSavedX = null;
        let mouseSavedY = null;

        this.marker.selector.mousedown((e) => {
            if (e.button==0) {
                mouseSavedX = e.clientX;
                mouseSavedY = e.clientY;
                
                handle = 'marker';
            }
            e.preventDefault();
        });
        
        this.world.selector.mousedown((e) => {
            if (e.button==0) {
                mouseSavedX = e.clientX;
                mouseSavedY = e.clientY;
                
                handle = 'world';
            }
            e.preventDefault();
        });
        
        $(document).mousemove((e) => {
            let diffX, diffY;
            if (mouseSavedX===null || mouseSavedY===null) {
                return;
            }
            diffX = e.clientX - mouseSavedX;
            diffY = e.clientY - mouseSavedY;
            mouseSavedX = e.clientX;
            mouseSavedY = e.clientY;

            this.addOffset(handle, diffX, diffY);
        });
        
        $(document).mouseup((e) => {
            mouseSavedX = null;
            mouseSavedY = null;
            handle = null;
        });
    }
} 
