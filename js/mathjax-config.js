// MathJax configuration
MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [ ["$","$"], ["\\(","\\)"] ],
    processEscapes: true
  }
});

MathJax.Hub.Config({
  tex2jax: {
    skipTags: ["script", "noscript", "style", "textarea", "pre", "code"]
  }
});

MathJax.Hub.Queue(function() {
    var all = MathJax.Hub.getAllJax(), i;
    for(i=0; i < all.length; i += 1) {
        all[i].SourceElement().parentNode.className += " has-jax";
    }
});

// Load MathJax
(function() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  document.head.appendChild(script);
})();