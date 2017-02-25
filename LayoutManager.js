"use strict";

var blessed = require('blessed'),
    Menu = require('./Menu.js');

class LayoutManager {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.screen = screenManager.getScreen();
        this.mainSection = blessed.box({
            parent: this.screen,
            left: '30%+1',
            top: 0,
            width: '70%',
            height: '100%-1',
            border: 'line'
        });
        this.fileManager = blessed.filemanager({
            parent: this.screen,
            border: 'line',
            style: {
                selected: {
                    bg: 'blue'
                }
            },
            left: 1,
            top: 0,
            height: '100%-1',
            width: '30%',
            label: ' {blue-fg}%path{/blue-fg} ',
            cwd: process.env.HOME,
            keys: true,
            vi: true,
            mouse: true,
            scrollbar: {
                bg: 'white',
                ch: ' '
            }
        });
        this.fileManager.refresh();
        this.menu = new Menu(this.screenManager);
    }
    getMainSection() {
        return this.mainSection;
    }
    setMainSection(mainSection) {
        this.mainSection = mainSection;
    }
    getFileManager() {
        return this.fileManager;
    }
}
module.exports = LayoutManager;