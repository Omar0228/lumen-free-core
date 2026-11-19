# Lumen Seven Illuminated Roads + experimental local AI

This package **does not contain lessons.js**. KEEP the existing lessons.js in your repository unchanged. KEEP the original main branch safe.

On the development branch `feature/seven-illuminated-roads`:
1. Replace index.html with the supplied index.html.
2. Keep app.js unchanged (included only as a reference copy).
3. Add roads.js and ai.js to the repository root.
4. Append the contents of styles-additions.css to the end of the existing styles.css. Do not replace the existing stylesheet with the additions file.
5. Keep lessons.js unchanged. Commit changes to the development branch.
6. Preview using a local static server or branch preview. If GitHub Pages only publishes main, branch changes will not automatically appear on the live site.
7. Test original Ask Lumen samples, all seven gates, mode switches, quiz feedback, story navigation, keyboard navigation and mobile layout.
8. Test optional AI on a WebGPU-compatible desktop. WebLLM model IDs and CDN availability may change. The model is small and may fail on iPhone or give weak/incorrect answers. No guarantee of ChatGPT quality.
9. Review Scripture and CompTIA references with authoritative sources. This package is an educational prototype, not a certified curriculum.
10. Only merge into main after tests pass and verify the deployed URL.

Privacy: browser-based model inference avoids sending prompts to a paid inference API, but fetching scripts/models contacts external hosts. Do not enter sensitive information.

Technical note: the seven gate questions use simple expected-answer matching, not semantic grading. No audio, downloaded guide, public testimony submission, or route-specific pages are implemented yet.
