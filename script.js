document.getElementById('siteForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const color = document.getElementById('color').value;
  const sectionText = document.getElementById('sectionText').value;
  
  // Simple "AI" logic: generate HTML based on user input
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f7f7f7; color: #333; }
      header { background: ${color}; color: white; padding: 1.5rem; text-align: center; }
      section { margin: 2rem auto; background: white; padding: 2rem; border-radius: 8px; max-width: 600px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);}
    </style>
  </head>
  <body>
    <header>
      <h1>${title}</h1>
    </header>
    <section>
      <p>${sectionText}</p>
    </section>
  </body>
  </html>
  `;
  
  document.getElementById('preview').innerHTML = "<h2>Preview:</h2>" + html;
  document.getElementById('downloadBtn').style.display = "block";

  // Download logic
  document.getElementById('downloadBtn').onclick = function() {
    const blob = new Blob([html], {type: 'text/html'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "index.html";
    link.click();
  }
});
function openTool(tool) {
  switch(tool) {
    case 'website':
      alert("AI Website Builder Opened!");
      break;
    case 'app':
      alert("AI App Builder Opened!");
      break;
    case 'browser':
      alert("AI Browser Opened!");
      break;
    case 'wallet':
      alert("AI Wallet Creator Opened!");
      break;
    case 'protect':
      alert("AI Protect System Activated!");
      break;
  }
}
