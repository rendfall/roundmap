
let settings = {
    initCoords: { 
        marker:{ left: 150, top: 150 }, 
        world: { left: 0, top: 0 }
    },
    container: '#canvas',
    rotate: 2500,
    markerFalling: 350,
    zoom: 1
};

let $this = $('#canvas');

class RoundMap {
    constructor() {
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
        this.marker.selector = $this.find('.marker-point');
        this.world.selector = $this.find('.world');
        
        // init animate 
        this.marker.selector.hide();
        this.world.selector.animate({
            'background-position': (this.world.selector.width() * -5)+'px'
        }, {
            duration: settings.rotate/2,
            complete: () => {
                this.marker.selector.show();
                this.moveTo(settings.initCoords);
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
                this.world.left = this.world.left % $this.width();
                this.world.top = this.world.top % $this.height();

                this.world.selector.css({
                    'background-position': (this.world.left * settings.zoom)+ 'px ' +(this.world.top * settings.zoom) + 'px'
                    //'background-position-y': this.world.top+'px' 
                });
                break;

            case('marker'):
                this.marker.left += diffX;
                this.marker.top += diffY;
                this.marker.left = this.marker.left < 0 ? 0 : this.marker.left;
                this.marker.left = this.marker.left > $this.width() ? $this.width() : this.marker.left;

                this.marker.top = this.marker.top < 0 ? 0 : this.marker.top;
                this.marker.top = this.marker.top > $this.height() ? $this.height() : this.marker.top;
                           
                this.marker.selector.css({
                    'left': (this.marker.left * settings.zoom)+'px', 
                    'top': (this.marker.top * settings.zoom)+'px'
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
                'left': (settings.zoom * this.marker.left)+'px', 
                'top': (settings.zoom * (this.marker.top-100)) +'px'
            });
        
        // animate
        this.world.selector.animate({
            'background-position': (settings.zoom * this.world.left)+ 'px ' +(settings.zoom * this.world.top)+'px'
        }, {
            duration: settings.rotate/4,
            complete: () => {
                this.marker.selector
                .animate({
                    opacity: 1,
                    top: (settings.zoom * this.marker.top)+'px'
                }, settings.markerFalling);
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
