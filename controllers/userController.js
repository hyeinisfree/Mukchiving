const express = require('express');
const db = require('../db');
const conn = db.init();

db.connect(conn);