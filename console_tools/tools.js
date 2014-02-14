var fns = ['jevi', 'jevi_describe'];

function jevi_describe(events, type, levels) {
    var table = [], events, l, i;

    if (!levels) {
        levels = '-';
    } 

    for (var n in events)
            if (events.hasOwnProperty(n) 
                && (type ? (n == type) : true)) {

        events = events[n];
        l = events.length;

        for (i = 0; i < l; i++) {
            table.push({
                type: n,
                selector: events[i].selector,
                handler: events[i].handler.toString(),
                behind_levels: levels
            });
        }
    }

    console.table(table, ['type', 'handler', 'selector', 'behind_levels']);
}

function jevi(el, eventn, lookbehind) {
    if (typeof jQuery !== 'function') {
        console.info('No jQuery! =[');
        return;
    }

    var __$ = jQuery;

    if (typeof lookbehind === 'undefined') {
        lookbehind = true;
    }

    if (typeof el === 'string') {
        el = __$(el);
    }

    // dom element
    if (typeof el.length === 'undefined') {
        el = [el];
    }
    
    var i = 0, l = el.length;
    var current, events, behindLevels;

    for (i = 0; i < l; i++) {
        current = el[i];
        behindLevels = 0;
        do {
            if (__$._data) {
                events = __$._data(current, 'events');
            } else {
                events = __$(current).data('events');
            }
            if (events && (eventn ? events[eventn] : true)) {
                console.info('element:', current);
                jevi_describe(events, eventn, behindLevels);
                break;
            }
            if (current === document) {
                break;
            }
            if (current.tagName === 'BODY') {
                current = document;
            } else {
                current = __$(current).parent().get(0);
            }
            ++behindLevels;
        } while(lookbehind);
    }
}

var l = fns.length, declare = "";
while (l--) {
    declare += 'window.' + fns[l] + ' = ' + this[fns[l]] + ';';
}

var script = document.createElement('script'),
    code   = document.createTextNode(declare);
script.appendChild(code);
(document.body || document.head).appendChild(script);