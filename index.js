"use strict";

const express = require('express');
const stringWidth = require('string-width');

const app = express();

const server = require('http').createServer(app);

app.get('/', function (req, res) {
    res.type('image/svg+xml');
    let query = req.query;
    res.send(getsvg(query.t || query.progress || query.title || 'hello', query.c || query.color, query.s || query.subject || query.label, query.f || query.flat, query.sc || query.subjectColor || query.labelColor));
    res.end();
});

const CONFIG = {
    height: 20,
    progressBarWidth: 80,
    fontSize: 12,
    fontFamily: "Menlo, Lucida Console, monospace"
};

function getsvg(title, titleColor, subject, flat, subjectColor) {
    title = title || '';
    subject = subject || '';
    titleColor = titleColor || '#555';
    subjectColor = subjectColor || '#162e34';

    let progressWidth = 0,
        progress = false,
        progressColor = '';

    if (/^\d+$/.test(title)) {
        progress = parseInt(title);
        title = title + '%';
        progressWidth = parseInt(CONFIG.progressBarWidth * progress / 100);
        if (progress < 30) {
            progressColor = '#d9534f'
        } else if (progress < 70) {
            progressColor = '#f0ad4e';
        } else {
            progressColor = '#5cb85c';
        }
    }

    let titleWidth = progress !== false ? CONFIG.progressBarWidth : (parseInt(stringWidth(title) * CONFIG.fontSize * 0.6) + 10);
    let subjectWidth = subject ? parseInt(stringWidth(subject) * CONFIG.fontSize * 0.6 + 10) : 0;
    let width = titleWidth + subjectWidth;
    let height = CONFIG.height;

    let svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'
    ];
    if (!flat) {
        svg.push('<linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>');
        svg.push('<mask id="a"><rect width="'+width+'" height="'+height+'" rx="3" fill="#fff"/></mask>');
    }
    svg.push('<g' + (flat ? '' : ' mask="url(#a)" ') + '>');

    if (subject) {
        svg.push('<path fill="' + subjectColor + '" d="M0 0h'+subjectWidth+'v'+height+'H0z"/>');
    }

    svg.push('<path fill="'+titleColor+'" d="M'+subjectWidth+' 0h'+titleWidth+'v'+height+'H'+subjectWidth+'z"/>');

    if (progress !== false) {
        svg.push('<path fill="'+progressColor+'" d="M'+subjectWidth+' 0h'+progressWidth+'v'+height+'H'+subjectWidth+'z"/>');
    }

    if (!flat) {
        svg.push('<path fill="url(#b)" d="M0 0h'+width+'v'+height+'H0z"/>');
    }

    svg.push('</g><g fill="#fff" text-anchor="middle" font-family="'+CONFIG.fontFamily+'" font-size="'+CONFIG.fontSize+'">');

    if (subject) {
        if (!flat) {
            svg.push('<text x="'+(subjectWidth / 2)+'" fill="#010101" fill-opacity=".3" y="15">'+subject+'</text>');
        }
        svg.push('<text x="'+(subjectWidth / 2)+'" y="14">'+subject+'</text>');

    }

    if (!flat) {
        svg.push('<text x="'+(subjectWidth + (titleWidth / 2))+'" fill="#010101" fill-opacity=".3" y="15">'+title+'</text>');
    }
    svg.push('<text x="'+(subjectWidth + (titleWidth / 2))+'" y="14">'+title+'</text>');

    svg.push('</g></svg>');

    return svg.join('');
}

let port = process.env.HTTP_PORT || 8000;

server.listen(port);

console.log('Listening on port %s', port);