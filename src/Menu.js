"use strict";

var blessed = require('blessed');

class Menu {

    constructor(screenManager) {
        this.screenManager = screenManager;
        this.bar = blessed.listbar({
            parent: this.screenManager.getScreen(),
            bottom: 0,
            left: '1',
            right: 0,
            height: 'shrink',
            mouse: true,
            keys: true,
            //border: 'line',
            vi: true,
            style: {
                bg: 'green',
                item: {
                    bg: 'lightblue',
                    hover: {
                        bg: 'blue'
                    }
                },
                selected: {
                    bg: 'red'
                }
            },
            commands: {
                'files': {
                    keys: ['C-t'],
                    callback: () => {
                        this.screenManager.getLayoutManager().getFileManager().focus();
                        this.screenManager.getLayoutManager().getFileManager().refresh();
                    }
                },
                'spawn shell': {
                    keys: ['C-n'],
                    callback: () => {
                        this.screenManager.spawnTerminal('~');
                    }
                },
                'last shell': {
                    keys: ['C-y'],
                    callback: () => {
                        this.screenManager.lastTerminal();
                    }
                },
                'next shell': {
                    keys: ['C-x'],
                    callback: () => {
                        this.screenManager.nextTerminal();
                    }
                },
                'zoom': {
                    keys: ['C-f'],
                    callback: () => {
                        this.screenManager.zoomTerminal(this.screenManager.getCurrentTerminal());
                    }
                },
                'destroy': {
                    keys: ['C-w'],
                    callback: () => {
                        this.screenManager.closeCurrentTerminal();
                    }
                },
                'quit': {
                    keys: ['C-q'],
                    callback: () => {
                        var question = blessed.question({
                            parent: this.screenManager.getScreen(),
                            border: 'line',
                            height: 'shrink',
                            width: 'half',
                            top: 'center',
                            left: 'center',
                            label: 'Quit?',
                            tags: true,
                            keys: true,
                            vi: true
                        });
                        question.ask('Really want to quit?', (err, value) => {
                            if (value) {
                                this.screenManager.getScreen().destroy();
                            }
                            this.screenManager.getScreen().render();
                        });
                    }
                }
            }
        });
    }
}

module.exports = Menu;