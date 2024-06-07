const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use('/uploads',express.static(__dirname + '/uploads'));
app.listen(8081, function() {
  console.log('App running on port 8081');
});

