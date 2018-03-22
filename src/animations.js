// http://easings.net/#easeInOutQuart
//  t: current time
//  b: beginning value
//  c: change in value
//  d: duration  
function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

function parsePropValue(propValue) {
    let matched = String(propValue).match(/(\d+)([a-zA-Z]+)/);
    return { 
        value: Number(matched[1]),
        unit: matched[2]
    }
}

function animate($elRef, styleList, duration = 300) {
    return new Promise((resolve, reject) => {
        let from = 0;
        let to = 1;
        let computedStyles = window.getComputedStyle($elRef);

        function getElementStyle(name) {
            return $elRef.style[name] || computedStyles[name];
        }

        function updateStyle(name, range, value) {
            let getValue = () => { 
                let from = parseInt(range[0]);
                let to = parseInt(range[1]);
                return from + ((to - from) * value); 
            }
            
            if (name === 'opacity') {
                $elRef.style[name] = getValue();
            } else {
                let currentValue = getElementStyle(name);
                let parsed = parsePropValue(currentValue);
                let result = `${getValue()}${parsed.unit}`;
                $elRef.style[name] = result;
            }
        }

        function stopAnim() {
            clearInterval(timer);
            resolve();
        }

        function animFn() {
            let time = new Date().getTime() - start;
            let value = easeInOutQuart(time, from, to - from, duration);

            Object.keys(styleList).forEach((propName) => {
                updateStyle(propName, styleList[propName], value);
            });

            if (time >= duration) {
                stopAnim();
            }
        }

        let start = new Date().getTime();
        let timer = setInterval(animFn, 1000 / 60);
    });
}
