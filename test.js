const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });

try {
    const window = dom.window;
    const document = window.document;

    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        const btn = card.querySelector('button');
        if (btn) {
            console.log(`Clicking button for product ${index + 1}...`);
            btn.click();
            console.log(`Modal display:`, document.getElementById('productModal').style.display);
        } else {
            console.log(`No button for product ${index + 1}`);
        }
    });
} catch(e) {
    console.error("Error evaluating scripts:", e);
}
