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
                this.termIndex = el.termIndex;
                this.focusCurrentTerminal();
            }
        });
        terminal.termIndex = this.terminals.length;

        let taskItem = blessed.box({
            parent: this.layoutManager.getMainSection(),
            bottom: 0,
            left: '20' * this.terminals.length,
            width: 20,
            height: 3,
            content: label,
            tags: true,
            border: {
                type: 'line'
            }
        });
        var _this = this;
        taskItem.on('click', function(mouse) {
            _this.termIndex = this.taskIndex;
            if (_this.terminals[_this.termIndex].panel.hidden) {
                _this.toggletCurrentTerminal();
            }
            _this.focusCurrentTerminal();
        });
        taskItem.taskIndex = this.terminals.length;

        this.terminals.push({
            index: this.terminals.length - 1,
            name: label,
            panel: terminal,
            taskItem: taskItem
        });
        this.termIndex++;
        this.currentTerminal = terminal;
        if (cmd) {
            terminal.pty.write(cmd);
        }
        this.focusCurrentTerminal();
    }
    closeCurrentTerminal() {
        if (this.terminals[this.getCurrentTerminalIndex()]) {
            this.getCurrentTerminal().destroy();
            this.getTerminals()[this.termIndex].taskItem.destroy();
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
        this.focusTerminal(this.termIndex);
    }
    focusTerminal(index) {
        if (this.terminals[index]) {
            this.currentTerminal = this.terminals[index].panel;
            this.currentTerminal.focus();
            this.currentTerminal.setFront();
            this.highlightTask();
            this.screen.render()
        }
    }
    toggletCurrentTerminal() {
        this.getCurrentTerminal().toggle();
        this.terminals[this.termIndex].taskItem.style = {
            border: {
                type: 'line',
                fg: this.getCurrentTerminal().hidden ? 'blue' : 'red'
            }
        };
    }
    highlightTask() {
        this.terminals.forEach(function(element) {
            if (!element.panel.hidden) {
                element.taskItem.style = { border: { type: 'line', fg: 'white' } };
            }
        }, this);
        this.terminals[this.termIndex].taskItem.style = {
            border: {
                type: 'line',
                fg: !this.terminals[this.termIndex].panel.hidden ?
                    'red' : this.terminals[this.termIndex].taskItem.style.border.fg
            }
        };
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