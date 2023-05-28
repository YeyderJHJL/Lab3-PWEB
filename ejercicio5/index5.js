const fs = require("fs");
const path = require("path");
const express = require("express");
const bp = require("body-parser");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
	html: true // habilita interpretación html
});

const app = express();

app.use(express.static("pub"));
app.use(bp.json());
app.use(bp.urlencoded({
	extended: true
}));

app.listen(3000, () => {
	console.log("Escuchando e: http://localhost:3000");
});

app.get("/", (request, response) => {
	response.sendFile(path.resolve(__dirname, "index.html"));
});

app.post("/", (request, response) => {
	console.log(request.body);
	let markDownText = request.body.text;
	console.log(markDownText);
	let htmlText = md.render(markDownText);
	console.log(htmlText);
	response.setHeader("Content-Type", "application/json");
	response.end(JSON.stringify({
		text: htmlText
	}));
});

