"use strict";

const ScreenManager = require('./ScreenManager.js');

class JTM {
    constructor() {
        this.screenManager = new ScreenManager();
        this.screenManager.getLayoutManager().getFileManager().focus();
    }
}

module.exports = JTM;