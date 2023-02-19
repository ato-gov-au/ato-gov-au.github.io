
$(document).ready(function () {
    var key = visitorCookieName;
    var uuid = randomUUID();

    if (read_cookie(key) == null) {
        write_cookie(key, uuid);
    }
});

function write_cookie(name, value) {
    var expiration_date = new Date();
    
    expiration_date.setTime(expiration_date.getTime() + (30 * 365 * 24 * 60 * 60 * 1000));

    var cookie_string = escape(name) + "=" + escape(value) + "; expires=" + expiration_date.toGMTString() + "; path=/";

    document.cookie = cookie_string;
}

function read_cookie(key, skips) {
    if (skips == null) {
        skips = 0;
    }

    var cookie_string = "" + document.cookie;
    var cookie_array = cookie_string.split("; ");

    for (var i = 0; i < cookie_array.length; ++i) {
        var single_cookie = cookie_array[i].split("=");

        if (single_cookie.length != 2) {
            continue;
        }
        
        var name = unescape(single_cookie[0]);
        var value = unescape(single_cookie[1]);

        if (key == name && skips-- == 0) {
            return value;
        }
    }
    return null;
}

function randomUUID() {
    var s = [], itoh = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

    for (var i = 0; i < 36; i++) {
        var num = Math.floor(Math.random() * 0x10);
        s[i] = num;
    }

    s[14] = 4;
    s[19] = (s[19] & 0x3) | 0x8;

    for (var i = 0; i < 36; i++) {
        s[i] = itoh[s[i]];
    }

    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
}
