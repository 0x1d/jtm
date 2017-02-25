"use strict";

const blessed = require('blessed'),
    LayoutManager = require('./LayoutManager.js');

class ScreenManager {
    constructor() {
        this.currentTerminal;
        this.terminals = [];
        this.screen = blessed.screen({
            dump: process.cwd() + '/logs/dump.log',
            autoPadding: true,
            enableMouse: true,
            warnings: true,
            smartCSR: true
        });
        this.layoutManager = new LayoutManager(this);
        this.setupEvents();
    }
    getScreen() {
        return this.screen;
    }
    getCurrentTerminal() {
        return this.currentTerminal;
    }
    setCurrentTerminal(currentTerminal) {
        this.currentTerminal = currentTerminal;
    }
    getLayoutManager() {
        return this.layoutManager;
    }
    setupEvents() {
        this.layoutManager.getFileManager().on('file', (file) => {
            this.spawnTerminal(file.substr(file.lastIndexOf('/') + 1), file + '\n');
        });
        for (let cmd in this.commands()) {
            this.screen.key(cmd, () => { this.commands()[cmd](); });
        }
    }
    spawnTerminal(label, cmd) {
        let terminal = blessed.terminal({
            parent: this.layoutManager.getMainSection(),
            scrollable: true,
            left: this.terminals.length,
            top: this.terminals.length,
            width: '50%',
            height: '50%',
            padding: 0,
            draggable: true,
            border: 'line',
            label: ' ' + label + ' ',
            scrollbar: {
                bg: 'white',
                ch: ' '
            }
        });
        terminal.on('element click', (el, mouse) => {
            if (el === terminal) {
                this.currentTerminal = el;
            }
        });
        this.screen.render();
        this.terminals.push({
            name: label,
            panel: terminal
        });
        this.currentTerminal = terminal;
        if (cmd) {
            terminal.pty.write(cmd);
        }
        terminal.focus();
    }
    zoomTerminal(terminal) {
        if (terminal) {
            terminal.top = !terminal.isZoomed ? 0 : 'center';
            terminal.left = !terminal.isZoomed ? 0 : 'center';
            terminal.height = !terminal.isZoomed ? '100%-2' : '50%';
            terminal.width = !terminal.isZoomed ? '100%-2' : '50%';
            terminal.isZoomed = !terminal.isZoomed;
            terminal.focus();
            this.screen.render();
        }
    }
    commands() {
        return {}
    }
}

module.exports = ScreenManager;