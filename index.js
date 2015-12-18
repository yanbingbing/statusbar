"use strict";

const express = require('express');

const app = express();

const server = require('http').createServer(app);

app.get('/', function (req, res) {
    res.type('image/svg+xml');
    res.send(getsvg(req.query.title || 'hello', req.query.color, req.query.label, req.query.flat));
    res.end();
});

function getsvg(title, color, label, flat) {
    title = title || '';
    label = label || '';
    color = color || '#555';

    let lM = 0,
        lh = 40,
        lH = 0,
        lx = lh / 2,
        width = 80,
        h = width,
        height = 20,
        M = 0,
        H = 0,
        v = height,
        x = width / 2,
        ph = 0,
        progress = false,
        pcolor = '';

    if (label) {
        M = lh;
        H = lh;
        width += lh;
        x += lh;
    }

    if (/^\d+$/.test(title)) {
        progress = parseInt(title);
        title = title + '%';
        ph = parseInt(0.8 * progress);
        if (progress < 30) {
            pcolor = '#d9534f'
        } else if (progress < 70) {
            pcolor = '#f0ad4e';
        } else {
            pcolor = '#5cb85c';
        }
    }

    let svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'
    ];
    if (!flat) {
        svg.push('<linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>');
        svg.push('<mask id="a"><rect width="'+width+'" height="'+height+'" rx="3" fill="#fff"/></mask>');
    }
    svg.push('<g' + (flat ? '' : ' mask="url(#a)"') + '>');

    if (label) {
        svg.push('<path fill="#162e34" d="M0 0h'+lh+'v'+v+'H0z"/>');
    }

    svg.push('<path fill="'+color+'" d="M'+M+' 0h'+h+'v'+v+'H'+H+'z"/>');

    if (progress !== false) {
        svg.push('<path fill="'+pcolor+'" d="M'+M+' 0h'+ph+'v'+v+'H'+H+'z"/>');
    }

    if (!flat) {
        svg.push('<path fill="url(#b)" d="M0 0h'+width+'v'+height+'H0z"/>');
    }

    svg.push('</g><g fill="#fff" text-anchor="middle" font-family="Menlo, Lucida Console, monospace" font-size="12">');

    if (label) {
        svg.push('<text x="'+lx+'" y="14">'+label+'</text>');
    }

    svg.push('<text x="'+x+'" y="14">'+title+'</text>');

    svg.push('</g></svg>');

    return svg.join('');
}

let port = process.env.HTTP_PORT || 8080;

server.listen(port);

console.log('Listening on port %s', port);