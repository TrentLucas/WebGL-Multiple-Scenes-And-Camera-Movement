/*
 * File: storage.js
 *
 * logics for loading a text file into the resource_map
 */
"use strict";

import * as map from "../core/resource_map.js";

// functions from resource_map
let unload = map.unload;
let has = map.has;
let get = map.get;

function loadToMap(path) {
    map.loadRequested("cam");
    map.set("cam", path);
}

function getCam() {
    return map.get("cam");
}

export {has, get, unload, loadToMap, getCam}