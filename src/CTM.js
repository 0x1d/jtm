"use strict";

const ScreenManager = require('./ScreenManager.js');

class CTM {
    constructor() {
        this.screenManager = new ScreenManager();
        this.screenManager.getLayoutManager().getFileManager().focus();
    }
}

module.exports = CTM;