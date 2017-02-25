"use strict";

const blessed = require('blessed'),
    LayoutManager = require('./LayoutManager.js');

class ScreenManager {
    constructor() {
        this.currentTerminal;
        this.terminals = [];
        this.termIndex = -1;
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
    setupEvents() {
        this.layoutManager.getFileManager().on('file', (file) => {
            this.spawnTerminal(file.substr(file.lastIndexOf('/') + 1), file + '\n');
        });
        for (let cmd in this.commands()) {
            this.screen.key(cmd, () => { this.commands()[cmd](); });
        }
    }
    commands() {
        return {}
    }
    spawnTerminal(label, cmd) {
        let terminal = blessed.terminal({
            parent: this.layoutManager.getMainSection(),
            scrollable: true,
            left: this.terminals.length * 4,
            top: this.terminals.length * 4,
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
        this.termIndex++;
        this.currentTerminal = terminal;
        if (cmd) {
            terminal.pty.write(cmd);
        }
        terminal.focus();
    }
    closeCurrentTerminal() {
        if (this.terminals[this.getCurrentTerminalIndex()]) {
            this.getCurrentTerminal().destroy();
            this.getTerminals().splice(this.getCurrentTerminalIndex(), 1);
            if (this.terminals[this.getCurrentTerminalIndex()]) {
                this.nextTerminal()
            }
            this.getScreen().render();
        }
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
    nextTerminal() {
        this.termIndex++;
        if (!this.terminals[this.termIndex]) {
            this.termIndex = 0;
        }
        this.focusCurrentTerminal();
    }
    lastTerminal() {
        this.termIndex--;
        if (!this.terminals[this.termIndex]) {
            this.termIndex = this.terminals.length - 1;
        }
        this.focusCurrentTerminal();
    }
    focusCurrentTerminal() {
        if (this.terminals[this.termIndex]) {
            this.currentTerminal = this.terminals[this.termIndex].panel;
            this.currentTerminal.focus();
            this.currentTerminal.setFront();
        }
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
    getTerminal(index) {
        return this.terminals[index];
    }
    getTerminals() {
        return this.terminals;
    }
    getCurrentTerminalIndex() {
        return this.termIndex;
    }
}

module.exports = ScreenManager;