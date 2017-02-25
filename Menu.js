"use strict";

var blessed = require('blessed');

class Menu {

    constructor(screenManager) {
        this.screenManager = screenManager;
        this.build();
    }

    build() {
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
                    }
                },
                'spawn shell': {
                    keys: ['C-n'],
                    callback: () => {
                        this.screenManager.spawnTerminal('~');
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
                        if (this.screenManager.getCurrentTerminal()) {
                            this.screenManager.getCurrentTerminal().destroy();
                            this.screenManager.setCurrentTerminal(null);
                            this.screenManager.getScreen().render();
                        }
                    }
                },
                'quit': {
                    keys: ['C-q'],
                    callback: () => {
                        this.screenManager.getScreen().destroy();
                    }
                }
            }
        });
    }
}

module.exports = Menu;