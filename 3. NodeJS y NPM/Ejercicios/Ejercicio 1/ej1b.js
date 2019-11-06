const freplace = require("./ejnode.js");

freplace("fichero1.txt",/[0-9]+/g, "{numero}", err => console.log((err) ? err.message: "Exito"));
