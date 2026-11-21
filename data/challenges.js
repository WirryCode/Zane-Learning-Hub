/* Practice challenges (Sector 3). Each check is a function body receiving `doc`
   (the rendered iframe document) and returning truthy on success. (c) Wilfred Wanyoike */
window.CHALLENGES = {
m01: [
 {id:'m01-c1', title:'The five must-haves', goal:'Give this page the five things every document needs: doctype, `lang`, charset, title and viewport.', starter:`<h1>Hello, exam hall!</h1>
<p>Edit me, then press Run and check.</p>`,
  hints:['The doctype is not a tag: `<!DOCTYPE html>` goes first.','`lang` belongs on the `<html>` element.','Charset and viewport are `<meta>` tags in `<head>`; the title is `<title>`.'],
  solution:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Hello, exam hall</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Hello, exam hall!</h1>
</body>
</html>`,
  checks:[
   {js:"return !!doc.doctype && doc.doctype.name.toLowerCase()==='html'", msg:'Start with <!DOCTYPE html>.'},
   {js:"return doc.documentElement.getAttribute('lang')==='en'", msg:'Set lang="en" on <html>.'},
   {js:"var m=doc.querySelector('meta[charset]');return !!m && m.getAttribute('charset').toLowerCase()==='utf-8'", msg:'Add <meta charset="utf-8">.'},
   {js:"var t=doc.querySelector('title');return !!t && t.textContent.trim().length>2", msg:'Give the page a real <title>.'},
   {js:"var v=doc.querySelector('meta[name=viewport]');return !!v && /width=device-width/.test(v.getAttribute('content')||'')", msg:'Add the viewport meta with width=device-width.'}]},
 {id:'m01-c2', title:'Repair a broken head', goal:'This head has four classic defects. Fix them all without deleting the page content.', starter:`<!-- built by hand -->
<html lang="en">
<head>
  <title>Workshop</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
</head>
<body><h1>Workshop</h1></body>
</html>`,
  hints:['The doctype must be the very first thing in the file.','There is no charset at all: add UTF-8 as the first child of head.','`user-scalable=no` blocks zoom: remove it and keep width=device-width.'],
  solution:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Workshop</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body><h1>Workshop</h1></body>
</html>`,
  checks:[
   {js:"return !!doc.doctype", msg:'Add <!DOCTYPE html> as the first thing.'},
   {js:"var m=doc.querySelector('meta[charset]');return !!m && m.getAttribute('charset').toLowerCase()==='utf-8'", msg:'Add <meta charset="utf-8">.'},
   {js:"var v=doc.querySelector('meta[name=viewport]');return !!v && !/user-scalable\\s*=\\s*no/.test(v.getAttribute('content')||'')", msg:'Stop blocking zoom in the viewport meta.'}],
  breakit:{prompt:'A comment or blank line before the doctype. What happens?', options:['The page still renders, but some browsers may use quirks mode','The doctype is ignored entirely and the page fails to load','No effect at all in any browser'], answer:0, why:'A doctype that is not first can be ignored, so the browser falls back to quirks mode: box sizing and table inheritance change.'}}
],
m02: [
 {id:'m02-c1', title:'A heading staircase', goal:'Mark up the outline with one `h1`, then `h2`, then `h3`. Do not skip a level and do not use headings for looks.', starter:`<h1>Machine Learning Workshop</h1>
<h4>What you will learn</h4>
<h4>Week 1: Basics</h4>
<h4>Week 2: Models</h4>
<h4>Instructors</h4>`,
  hints:['A subsection of the page title is an `h2`.','Week 1 and Week 2 sit under "What you will learn": both are `h3`.','"Instructors" is a sibling of "What you will learn", so it returns to `h2`.'],
  solution:`<h1>Machine Learning Workshop</h1>
<h2>What you will learn</h2>
<h3>Week 1: Basics</h3>
<h3>Week 2: Models</h3>
<h2>Instructors</h2>`,
  checks:[
   {js:"return doc.querySelectorAll('h1').length===1", msg:'Use exactly one h1.'},
   {js:"var h=Array.prototype.slice.call(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'));return h.map(function(x){return +x.tagName[1]}).join(',')==='1,2,3,3,2'", msg:'The staircase must read h1, h2, h3, h3, h2.'}]},
 {id:'m02-c2', title:'Quote anatomy', goal:'Build a block quote from a review, credit the work with `cite`, and add a short French quotation with `q` and `lang`.', starter:`<blockquote>The workshop exceeded my expectations.</blockquote>
<p>Review by Blendan Smooth, Smoothie Weekly.</p>`,
  hints:['A block quote should contain a paragraph, not bare text.','Wrap the publication name in `<cite>`, not the reviewer.','For the French line: `<p lang="fr">` and a `<q>` inside it.'],
  solution:`<blockquote cite="https://example.com/review">
  <p>The workshop exceeded my expectations.</p>
</blockquote>
<p>Review by Blendan Smooth, in <cite>Smoothie Weekly</cite>.</p>
<p lang="fr">Il a dit : <q>Bonjour tout le monde.</q></p>`,
  checks:[
   {js:"var b=doc.querySelector('blockquote');return !!b && !!b.querySelector('p')", msg:'Put a paragraph inside the blockquote.'},
   {js:"return !!doc.querySelector('cite')", msg:'Cite the title of the work.'},
   {js:"var q=doc.querySelector('q');return !!q && !!q.closest('[lang=fr]')", msg:'Add the French quote inside an element with lang="fr".'}]}
],
m03: [
 {id:'m03-c1', title:'Build the page skeleton', goal:'Replace the div soup with `header`, `nav`, `main` and `footer` landmarks.', starter:`<div id="top">
  <div class="title">My Blog</div>
  <div class="links"><a href="/">Home</a> <a href="/about">About</a></div>
</div>
<div class="content"><p>Posts live here.</p></div>
<div class="bottom">© 2026</div>`,
  hints:['The site title is the page heading: `header` + `h1`.','The link group is a `nav`, and the links belong in a list.','The main content goes in `main`; the copyright line in `footer`.'],
  solution:`<header>
  <h1>My Blog</h1>
  <nav><a href="/">Home</a> <a href="/about">About</a></nav>
</header>
<main><p>Posts live here.</p></main>
<footer><p>© 2026</p></footer>`,
  checks:[
   {js:"return !!doc.querySelector('body > header > h1') && !!doc.querySelector('header nav')", msg:'Use a top-level header with an h1 and a nav.'},
   {js:"return !!doc.querySelector('main') && !!doc.querySelector('body > footer')", msg:'Add one main and a top-level footer.'},
   {js:"return doc.querySelectorAll('div').length===0", msg:'Remove the divs: the semantic elements replace them.'}]},
 {id:'m03-c2', title:'Article or section?', goal:'Mark up two self-contained blog posts, each with its own heading, inside one main region.', starter:`<main>
  <h1>Latest posts</h1>
  <section><h2>First post</h2><p>Self-contained story.</p></section>
  <section><h2>Second post</h2><p>Could be syndicated elsewhere.</p></section>
</main>`,
  hints:['Both posts could be republished alone, so each is an `article`.','The page itself still needs its own `h1` and a region for the list.','Keep `main`, and use `<article>` for each post.'],
  solution:`<main>
  <h1>Latest posts</h1>
  <article><h2>First post</h2><p>Self-contained story.</p></article>
  <article><h2>Second post</h2><p>Could be syndicated elsewhere.</p></article>
</main>`,
  checks:[
   {js:"return doc.querySelectorAll('main article').length===2", msg:'Use two article elements inside main.'},
   {js:"var a=doc.querySelectorAll('main article');return a.length===2 && !!a[0].querySelector('h2') && !!a[1].querySelector('h2')", msg:'Each article needs its own h2.'},
   {js:"return doc.querySelectorAll('main section').length===0", msg:'These posts are articles, not sections.'}]}
],
m04: [
 {id:'m04-c1', title:'De-div the card', goal:'Rebuild this card with meaningful elements: a `header`, an `h2`, a `p`, and a `footer` for the meta line.', starter:`<div class="card">
  <div class="title">Eve, the probe droid</div>
  <div class="text">Eve scans vegetation for usable samples.</div>
  <div class="meta">Filed under: robotics</div>
</div>`,
  hints:['A card with a heading, body and meta line has an internal structure.','`header` and `footer` are allowed inside any sectioning content, including a `div`.','Use `h2` for the title so the card joins the page outline.'],
  solution:`<div class="card">
  <header><h2>Eve, the probe droid</h2></header>
  <p>Eve scans vegetation for usable samples.</p>
  <footer>Filed under: robotics</footer>
</div>`,
  checks:[
   {js:"return !!doc.querySelector('.card h2')", msg:'Give the card a real heading (h2).'},
   {js:"var c=doc.querySelector('.card');return !!c && !!c.querySelector('header') && !!c.querySelector('footer')", msg:'Use header and footer inside the card.'},
   {js:"return doc.querySelectorAll('.card div').length===1", msg:'Only the outer card should remain a div.'}]},
 {id:'m04-c2', title:'A real button', goal:'This fake button only looks like a button. Replace it with the real element so it is focusable and works with Enter and Space.', starter:`<div role="button" class="buy">Add to cart</div>
<p id="out">Nothing clicked yet.</p>
<script>
document.querySelector('.buy').addEventListener('click', function () {
  document.getElementById('out').textContent = 'Added to cart';
});
</script>`,
  hints:['No ARIA can add keyboard behaviour to a div by itself.','Use `<button type="button">` and keep the class and text.','A `<button>` fires `click` for Enter and Space natively, so the script can stay.'],
  solution:`<button type="button" class="buy">Add to cart</button>
<p id="out">Nothing clicked yet.</p>
<script>
document.querySelector('.buy').addEventListener('click', function () {
  document.getElementById('out').textContent = 'Added to cart';
});
</script>`,
  checks:[
   {js:"return !!doc.querySelector('button.buy')", msg:'Use a real <button> with class buy.'},
   {js:"return doc.querySelectorAll('[role=button]').length===0", msg:'Drop role="button": the button element already has it.'},
   {js:"var b=doc.querySelector('button.buy');return b && b.tabIndex===0 && !b.hasAttribute('tabindex')", msg:'Let the button join the tab order naturally.'}],
  breakit:{prompt:'`<div role="button" tabindex="0">` with click and keydown handlers. What is still missing compared with `<button>`?', options:['Nothing important: it is now equivalent','Disabled state, form submission, and consistent Space/Enter handling','Only the default CSS'], answer:1, why:'A div never becomes a form control: no disabled semantics, no submit behaviour, no native activation contract. Native is cheaper and safer.'}}
],
m05: [
 {id:'m05-c1', title:'A named, current nav', goal:'Build the primary navigation: a named `nav`, links in a list, and `aria-current` on the page you are on.', starter:`<nav>
  <a href="/">Home</a>
  <a href="/learn">Learn</a>
  <a href="/contact">Contact</a>
</nav>`,
  hints:['Name the landmark with `aria-label="Primary"`, not "Primary navigation".','Put the links in a `ul` with one `li` each.','Mark Learn with `aria-current="page"` because this page is Learn.'],
  solution:`<nav aria-label="Primary">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/learn" aria-current="page">Learn</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>`,
  checks:[
   {js:"var n=doc.querySelector('nav');return !!n && (n.getAttribute('aria-label')||'')==='Primary'", msg:'Give the nav aria-label="Primary".'},
   {js:"return doc.querySelectorAll('nav ul > li > a').length===3", msg:'Put the three links in a list.'},
   {js:"return doc.querySelectorAll('nav a[aria-current=page]').length===1", msg:'Mark exactly one link aria-current="page".'}]},
 {id:'m05-c2', title:'Skip link that appears', goal:'Add a skip link as the first focusable thing, target the main region, and make the link visible when focused.', starter:`<nav aria-label="Primary"><a href="/">Home</a></nav>
<main id="main"><h1>Lesson</h1><p>Content.</p></main>`,
  hints:['The link text should say "Skip to main content".','The target needs `tabindex="-1"` so focus really moves there.','Hide with off-screen positioning, then reveal on `:focus` — never `display:none`.'],
  solution:`<style>
.skip{position:absolute;left:-9999px}
.skip:focus{left:8px;top:8px;background:#A51C30;color:#fff;padding:6px 10px}
</style>
<a class="skip" href="#main">Skip to main content</a>
<nav aria-label="Primary"><a href="/">Home</a></nav>
<main id="main" tabindex="-1"><h1>Lesson</h1><p>Content.</p></main>`,
  checks:[
   {js:"var a=doc.querySelector('a[href=\"#main\"]');return !!a && /skip/i.test(a.textContent)", msg:'Add a "Skip to main content" link to #main.'},
   {js:"var m=doc.getElementById('main');return !!m && m.getAttribute('tabindex')==='-1'", msg:'Give the main region tabindex="-1".'},
   {js:"var s=doc.querySelector('style');return !!s && /:focus/.test(s.textContent)", msg:'Reveal the link with a :focus rule.'}]}
],
m06: [
 {id:'m06-c1', title:'Three kinds of link', goal:'Add three links with meaningful text: an absolute URL, an in-page fragment that exists, and an email link.', starter:`<h2 id="teachers">Teachers</h2>
<p>Read more, email us, or jump back to the top.</p>`,
  hints:['Absolute links start with `https://`.','A fragment link needs a matching `id` on the page.','Email links start with `mailto:`; the link text is the accessible name.'],
  solution:`<h2 id="teachers">Teachers</h2>
<p><a href="https://example.com/report">Read the 2026 report</a></p>
<p><a href="#teachers">Meet the teachers</a></p>
<p><a href="mailto:hal@example.com">Email Hal about the course</a></p>`,
  checks:[
   {js:"return !!doc.querySelector('a[href^=\"https://\"]')", msg:'Add an absolute https link.'},
   {js:"var a=doc.querySelector('a[href^=\"#\"]');return !!a && !!doc.getElementById(a.getAttribute('href').slice(1))", msg:'Add a fragment link whose target id exists.'},
   {js:"var a=doc.querySelector('a[href^=\"mailto:\"]');return !!a && !/click here|more/i.test(a.textContent)", msg:'Add a mailto link with descriptive text.'}]},
 {id:'m06-c2', title:'Open safely in a new tab', goal:'Make the external link open in a new tab, but stop the new page from getting a handle on yours.', starter:`<a href="https://example.com/guide">Open the guide</a>`,
  hints:['`target="_blank"` opens a new tab on every click.','Add `rel="noopener"` to sever the opener relationship.','`noreferrer` is optional; noopener is the security fix.'],
  solution:`<a href="https://example.com/guide" target="_blank" rel="noopener noreferrer">Open the guide (new tab)</a>`,
  checks:[
   {js:"var a=doc.querySelector('a');return !!a && a.getAttribute('target')==='_blank'", msg:'Use target="_blank".'},
   {js:"var a=doc.querySelector('a');return !!a && /(^|\\s)noopener(\\s|$)/.test(a.getAttribute('rel')||'')", msg:'Add rel="noopener".'},
   {js:"var a=doc.querySelector('a');return !!a && /new tab/i.test(a.textContent)", msg:'Warn in the link text that it opens a new tab.'}]}
],
m07: [
 {id:'m07-c1', title:'A list inside a list', goal:'Turn the flat list into a nested outline. The sub-items must live inside their parent `li`, not directly inside the `ul`.', starter:`<ul>
  <li>Elements</li>
  <li>Replaced</li>
  <li>Void</li>
  <li>Attributes</li>
</ul>`,
  hints:['A nested list is a `ul` inside a `li`.','"Replaced" and "Void" belong to "Elements".','Close the inner list before closing the parent `li`.'],
  solution:`<ul>
  <li>Elements
    <ul>
      <li>Replaced</li>
      <li>Void</li>
    </ul>
  </li>
  <li>Attributes</li>
</ul>`,
  checks:[
   {js:"return doc.querySelectorAll('ul > li > ul > li').length===2", msg:'Nest a list inside the Elements li.'},
   {js:"var u=doc.querySelector('ul');return !!u && !u.querySelector(':scope > ul')", msg:'No ul may be a direct child of another ul.'},
   {js:"return doc.querySelectorAll('li').length===4", msg:'Keep exactly four items: Elements, Replaced, Void, Attributes.'}]},
 {id:'m07-c2', title:'Countdown and definitions', goal:'Add a reversed ordered list that counts down from 3, and a description list with two term/description pairs.', starter:`<h2>Countdown</h2>
<p>Build the list here.</p>
<h2>Glossary</h2>
<p>Build the pairs here.</p>`,
  hints:['`reversed` on `<ol>` counts down; the items stay in reading order.','A description list is `dl` with `dt` and `dd`.','Each term needs at least one description.'],
  solution:`<h2>Countdown</h2>
<ol reversed>
  <li>Third</li><li>Second</li><li>First</li>
</ol>
<h2>Glossary</h2>
<dl>
  <dt>HAL</dt><dd>Spaceship computer</dd>
  <dt>EVE</dt><dd>Probe droid</dd>
</dl>`,
  checks:[
   {js:"var o=doc.querySelector('ol');return !!o && o.hasAttribute('reversed') && o.querySelectorAll('li').length===3", msg:'Add a reversed ol with three items.'},
   {js:"return doc.querySelectorAll('dl dt').length===2 && doc.querySelectorAll('dl dd').length===2", msg:'Add a dl with two dt and two dd.'}]}
],
m08: [
 {id:'m08-c1', title:'The code family', goal:'Write a keyboard shortcut, a line of program output, and a maths formula using the right inline elements.', starter:`<p>Press Ctrl + S. The console prints Saved. Solve for x in x2 + 1 = 5.</p>`,
  hints:['Keys go in `kbd`, one element per key.','Program output goes in `samp`; code fragments in `code`.','The exponent belongs in `sup`; a variable in `var`.'],
  solution:`<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd>. The console prints <samp>Saved</samp>.</p>
<p>Solve for <var>x</var> in <var>x</var><sup>2</sup> + 1 = 5.</p>`,
  checks:[
   {js:"return doc.querySelectorAll('kbd').length>=2", msg:'Wrap each key in kbd.'},
   {js:"return !!doc.querySelector('samp') && !!doc.querySelector('var') && !!doc.querySelector('sup')", msg:'Use samp, var and sup.'}]},
 {id:'m08-c2', title:'An edit and a timestamp', goal:'Show an old price as removed, a new price as inserted with a machine-readable date, highlight a warning, and mark up the date.', starter:`<p>Price: $50 $35. Limited stock. Offer ends 1 December.</p>`,
  hints:['`del` is removed text; `ins` is added text.','`ins` accepts `datetime="2026-11-01"`.','`mark` highlights relevance; `time` carries `datetime`.'],
  solution:`<p>Price: <del>$50</del> <ins datetime="2026-11-01">$35</ins>. <mark>Limited stock</mark>.</p>
<p>Offer ends <time datetime="2026-12-01">1 December</time>.</p>`,
  checks:[
   {js:"return !!doc.querySelector('del') && !!doc.querySelector('ins[datetime]')", msg:'Use del and ins with a datetime attribute.'},
   {js:"return !!doc.querySelector('mark') && !!doc.querySelector('time[datetime]')", msg:'Use mark and a time element with datetime.'}]}
],
m09: [
 {id:'m09-c1', title:'A content image, done right', goal:'Give the image `src`, meaningful alt text, intrinsic `width` and `height`, and lazy loading — the bar is below the fold.', starter:`<p>Scroll down for the chart.</p><div style="height:600px"></div>
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='400' height='200' fill='%23A51C30'/></svg>">`,
  hints:['Alt text describes meaning, not "image of".','`width` and `height` are unitless pixels; they reserve space.','`loading="lazy"` goes on this below-the-fold image.'],
  solution:`<p>Scroll down for the chart.</p><div style="height:600px"></div>
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='400' height='200' fill='%23A51C30'/></svg>"
     alt="A plain red banner representing the 2026 results chart"
     width="400" height="200" loading="lazy">`,
  checks:[
   {js:"var i=doc.querySelector('img');return !!i && (i.getAttribute('alt')||'').trim().length>10", msg:'Write meaningful alt text.'},
   {js:"var i=doc.querySelector('img');return !!i && i.getAttribute('width')==='400' && i.getAttribute('height')==='200'", msg:'Add width="400" and height="200".'},
   {js:"var i=doc.querySelector('img');return !!i && i.getAttribute('loading')==='lazy'", msg:'Lazy-load this off-screen image.'}],
  breakit:{prompt:'You delete `width` and `height` because CSS sets `max-width:100%`. What is the cost?', options:['None: CSS controls the size anyway','The browser cannot reserve space, so the page shifts when the image loads','The image will not display at all'], answer:1, why:'The attributes supply the aspect ratio before the file arrives. Without them the layout jumps (cumulative layout shift).'}},
 {id:'m09-c2', title:'Alt text depends on context', goal:'Give the avatar a name, describe the adoption photo, and make the decorative divider silent to screen readers.', starter:`<img class="avatar" src="fluffy.png">
<img class="hero" src="fluffy-ball.png">
<img class="deco" src="swirl.png">`, hints:['The avatar sits beside a review, so its name is enough.','The hero is the adoption photo: describe what is visible.','A decorative image still needs `alt`, but an empty one.'], solution:`<img class="avatar" src="fluffy.png" alt="Fluffy">
<img class="hero" src="fluffy-ball.png" alt="Fluffy, a tri-colour terrier with a tennis ball in her mouth">
<img class="deco" src="swirl.png" alt="">`, checks:[{js:"var i=doc.querySelector('img.avatar');return !!i && i.getAttribute('alt')==='Fluffy'", msg:'Name the avatar with alt="Fluffy".'},{js:"var i=doc.querySelector('img.hero');return !!i && (i.getAttribute('alt')||'').length>25", msg:'Describe the adoption photo in its alt.'},{js:"var i=doc.querySelector('img.deco');return !!i && i.hasAttribute('alt') && i.getAttribute('alt')===''", msg:'Give the decorative image alt="".'}]}
],
m10: [
 {id:'m10-c1', title:'A table with real headers', goal:'Add a caption, a header row of `th scope="col"` cells, and a row header with `th scope="row"`.', starter:`<table>
  <tr><td>Student</td><td>Term 1</td><td>Term 2</td></tr>
  <tr><td>HAL</td><td>71</td><td>80</td></tr>
  <tr><td>EVE</td><td>88</td><td>91</td></tr>
</table>`,
  hints:['A caption is the table\'s visible name and first child.','Header cells are `th`, not bold `td`.','Column headers take `scope="col"`; the name in each row takes `scope="row"`.'],
  solution:`<table>
  <caption>Workshop results, 2026</caption>
  <thead>
    <tr><th scope="col">Student</th><th scope="col">Term 1</th><th scope="col">Term 2</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">HAL</th><td>71</td><td>80</td></tr>
    <tr><th scope="row">EVE</th><td>88</td><td>91</td></tr>
  </tbody>
</table>`,
  checks:[
   {js:"var c=doc.querySelector('table caption');return !!c && c.textContent.trim().length>5", msg:'Add a caption.'},
   {js:"return doc.querySelectorAll('thead th[scope=col]').length===3", msg:'Use three th scope="col" cells in a thead.'},
   {js:"return doc.querySelectorAll('tbody th[scope=row]').length===2", msg:'Give each data row a th scope="row".'}]},
 {id:'m10-c2', title:'Merged cells that still add up', goal:'Merge the "Workshop results" header across all three columns, and add a footer that also spans three columns.', starter:`<table>
  <caption>Workshop results</caption>
  <tr><td>Workshop results</td></tr>
  <tr><td>HAL</td><td>71</td><td>80</td></tr>
  <tr><td>Average</td><td>66</td><td>75</td></tr>
</table>`,
  hints:['`colspan="3"` replaces the two cells to its right.','A merged row still has to total three columns.','Put the totals in `tfoot` with the same colspan.'],
  solution:`<table>
  <caption>Workshop results</caption>
  <thead><tr><th colspan="3">Workshop results</th></tr></thead>
  <tbody><tr><th scope="row">HAL</th><td>71</td><td>80</td></tr></tbody>
  <tfoot><tr><th scope="row">Average</th><td>66</td><td>75</td></tr></tfoot>
</table>`,
  checks:[
   {js:"return doc.querySelectorAll('th[colspan=\"3\"]').length>=1", msg:'Merge the title row across three columns.'},
   {js:"var rows=doc.querySelectorAll('tr'),ok=true;rows.forEach(function(r){var n=0;Array.prototype.forEach.call(r.children,function(c){n+=(+c.getAttribute('colspan')||1)});if(n!==3)ok=false});return ok", msg:'Every row must still total three columns.'}]}
],
m11: [
 {id:'m11-c1', title:'Booleans and data attributes', goal:'Make the email field required and read-only, and attach two `data-*` values to the form for your script to read.', starter:`<form id="f">
  <label for="email">Email</label>
  <input id="email" type="email" value="hal@example.com">
</form>`,
  hints:['Boolean attributes are true when present, whatever the value.','`required` and `readonly` are both booleans.','Data names need a lowercase letter after `data-`; use `data-role` and `data-year`.'],
  solution:`<form id="f" data-role="student" data-year="2026">
  <label for="email">Email</label>
  <input id="email" type="email" value="hal@example.com" required readonly>
</form>`,
  checks:[
   {js:"var i=doc.getElementById('email');return !!i && i.hasAttribute('required') && i.hasAttribute('readonly')", msg:'Add required and readonly to the email input.'},
   {js:"var f=doc.getElementById('f');return !!f && f.dataset.role==='student' && f.dataset.year==='2026'", msg:'Add data-role="student" and data-year="2026" to the form.'}]},
 {id:'m11-c2', title:'Repair the widget', goal:'Two ids are duplicated and the editable region is not actually editable. Fix both.', starter:`<div id="note" contenteditable="contenteditable">Edit this note</div>
<div id="note">A second note with the same id</div>
<style contenteditable="false" id="css">#note{color:#A51C30}</style>`,
  hints:['Ids must be unique in a document.','`contenteditable` is enumerated: "contenteditable" is invalid and falls back to inherit.','Use `contenteditable="true"` on the element you want edited.'],
  solution:`<div id="note" contenteditable="true">Edit this note</div>
<div id="note-2">A second note</div>
<style id="css">#note{color:#A51C30}</style>`,
  checks:[
   {js:"var ids={},ok=true;Array.prototype.forEach.call(doc.querySelectorAll('[id]'),function(e){if(ids[e.id])ok=false;ids[e.id]=1});return ok", msg:'Make every id unique.'},
   {js:"var n=doc.getElementById('note');return !!n && n.isContentEditable", msg:'Make the note really editable with contenteditable="true".'}]}
],
m12: [
 {id:'m12-c1', title:'A labelled, grouped form', goal:'Label every control, require the name and email, and group the track choices in a `fieldset` with a `legend`.', starter:`<form>
  <p>Name <input type="text"></p>
  <p>Email <input type="email"></p>
  <p>Track: <input type="radio" name="track"> ML <input type="radio" name="track"> Ops</p>
  <button>Enrol</button>
</form>`,
  hints:['`<label for>` needs a matching `id` on the control.','`required` on the text and email inputs.','The radios share a name; wrap them in `fieldset` with a `legend`.'],
  solution:`<form aria-label="Workshop registration">
  <p><label for="name">Name</label> <input id="name" name="name" type="text" required></p>
  <p><label for="email">Email</label> <input id="email" name="email" type="email" required></p>
  <fieldset><legend>Track</legend>
    <label><input type="radio" name="track" value="ml" required> ML</label>
    <label><input type="radio" name="track" value="ops"> Ops</label>
  </fieldset>
  <button type="submit">Enrol</button>
</form>`,
  checks:[
   {js:"var ok=true;Array.prototype.forEach.call(doc.querySelectorAll('input'),function(i){if(!i.labels||!i.labels.length)ok=false});return ok && doc.querySelectorAll('input').length>=4", msg:'Give every input a label (implicit or for/id).'},
   {js:"return doc.querySelectorAll('input[name=name][required], input[name=email][required]').length===2", msg:'Require both the name and email inputs.'},
   {js:"var f=doc.querySelector('fieldset');return !!f && !!f.querySelector('legend') && f.querySelectorAll('input[type=radio][name=track]').length===2", msg:'Group the two radios in a fieldset with a legend.'}],
  breakit:{prompt:'Both radio groups on a page use `name="choice"`. The user answers question 2. What happens to question 1?', options:['Nothing: groups are scoped to their fieldset','Its answer is cleared, because both groups are one radio group','Both answers are submitted'], answer:1, why:'Radios group by name across the whole form. Two questions need two different names.'}},
 {id:'m12-c2', title:'Constraints that do the work', goal:'Require an email that contains a dot, and an age that must be a whole number between 18 and 99.', starter:`<form>
  <label for="e">Email</label> <input id="e" type="email">
  <label for="a">Age</label> <input id="a" type="number">
  <button type="submit">Send</button>
</form>`, hints:['`required` makes an empty value invalid.','A `pattern` must match the whole value; add a `title` explaining it.','`min`, `max` and `step` constrain the number input.'], solution:`<form>
  <label for="e">Email</label>
  <input id="e" type="email" required pattern=".+@.+\\..+" title="An address like you@example.com">
  <label for="a">Age</label>
  <input id="a" type="number" min="18" max="99" step="1">
  <button type="submit">Send</button>
</form>`, checks:[{js:"var i=doc.getElementById('e');return !!i && i.hasAttribute('required') && /@/.test(i.getAttribute('pattern')||'') && !!i.getAttribute('title')", msg:'Make the email required, with a pattern and a title.'},{js:"var i=doc.getElementById('a');return !!i && i.getAttribute('min')==='18' && i.getAttribute('max')==='99' && i.getAttribute('step')==='1'", msg:'Constrain age to 18-99 in steps of 1.'},{js:"return !!doc.querySelector('form button[type=submit]')", msg:'Keep a submit button.'}]}
],
m13: [
 {id:'m13-c1', title:'Send focus somewhere on purpose', goal:'Add a skip link to the main region and make the main region a valid programmatic focus target.', starter:`<nav><a href="/">Home</a></nav>
<main id="main"><h1>Lesson</h1></main>`,
  hints:['The skip link is an ordinary link to `#main`.','Add `tabindex="-1"` to the main element.','The link can stay visible; just make the target focusable.'],
  solution:`<a href="#main">Skip to main content</a>
<nav><a href="/">Home</a></nav>
<main id="main" tabindex="-1"><h1>Lesson</h1></main>`,
  checks:[
   {js:"var a=doc.querySelector('a[href=\"#main\"]');return !!a && /skip/i.test(a.textContent)", msg:'Add a skip link to #main.'},
   {js:"var m=doc.getElementById('main');return !!m && m.getAttribute('tabindex')==='-1'", msg:'Give main tabindex="-1".'},
   {js:"var m=doc.getElementById('main');m.focus();return doc.activeElement===m", msg:'The main region must accept focus.'}]},
 {id:'m13-c2', title:'Take a closed panel out of the tab order', goal:'The panel is hidden off-screen but its links still catch Tab. Make the whole panel inert while it is closed.', starter:`<style>.panel{position:absolute;left:-9999px}</style>
<div class="panel" id="panel"><a href="/a">Account</a> <a href="/b">Billing</a></div>
<button id="open">Open panel</button>`,
  hints:['`inert` is a global boolean attribute.','On a container it removes every descendant from focus and from the accessibility tree.','Toggle it from script with `toggleAttribute("inert")`.'],
  solution:`<style>.panel{position:absolute;left:-9999px}</style>
<div class="panel" id="panel" inert><a href="/a">Account</a> <a href="/b">Billing</a></div>
<button id="open">Open panel</button>
<script>
document.getElementById('open').onclick = function(){ document.getElementById('panel').toggleAttribute('inert'); };
</script>`,
  checks:[
   {js:"var p=document.getElementById('panel');return !!p && p.hasAttribute('inert')", msg:'Mark the closed panel inert.'},
   {js:"var p=document.getElementById('panel');return p.querySelectorAll('a').length===2 && p.inert===true", msg:'Keep both links; inert should cover them.'}]}
],
m14: [
 {id:'m14-c1', title:'A head that shares well', goal:'Add a description, a theme colour, Open Graph title and image, a Twitter card type, and a canonical URL.', starter:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Machine Learning Workshop</title>
</head>
<body><h1>Workshop</h1></body>
</html>`,
  hints:['`name="description"` takes a short accurate sentence.','Open Graph uses `property`, not `name`.','`og:image` must be an absolute https URL; add `twitter:card`.'],
  solution:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Machine Learning Workshop</title>
  <meta name="description" content="A hands-on workshop for machines who cannot learn good.">
  <meta name="theme-color" content="#226DAA">
  <meta property="og:title" content="Machine Learning Workshop">
  <meta property="og:image" content="https://example.com/images/all.png">
  <meta property="og:image:alt" content="Line drawing of home appliances">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://example.com/">
</head>
<body><h1>Workshop</h1></body>
</html>`,
  checks:[
   {js:"var d=doc.querySelector('meta[name=description]');return !!d && (d.content||'').length>20", msg:'Add a real meta description.'},
   {js:"return !!doc.querySelector('meta[property=\"og:title\"]') && !!doc.querySelector('meta[name=\"twitter:card\"]')", msg:'Add og:title (property) and twitter:card (name).'},
   {js:"var i=doc.querySelector('meta[property=\"og:image\"]');return !!i && /^https:\\/\\//.test(i.content||'')", msg:'Use an absolute https URL for og:image.'},
   {js:"return !!doc.querySelector('link[rel=canonical]') && !!doc.querySelector('meta[name=theme-color]')", msg:'Add canonical and theme-color.'}]},
 {id:'m14-c2', title:'Fix the broken social card', goal:'This card has three defects: the Open Graph tags use the wrong attribute, the image is relative, and the Twitter card type is missing.', starter:`<meta name="og:title" content="Workshop">
<meta name="og:image" content="/img/all.png">`,
  hints:['Open Graph is not standard metadata: it uses `property`.','`/img/all.png` is relative; social scrapers need an absolute URL.','`twitter:card` is required for a large image card.'],
  solution:`<meta property="og:title" content="Workshop">
<meta property="og:image" content="https://example.com/img/all.png">
<meta property="og:image:alt" content="Workshop appliances">
<meta name="twitter:card" content="summary_large_image">`,
  checks:[
   {js:"return !!doc.querySelector('meta[property=\"og:title\"]') && !doc.querySelector('meta[name=\"og:title\"]')", msg:'Use property="og:title", not name.'},
   {js:"var i=doc.querySelector('meta[property=\"og:image\"]');return !!i && /^https:\\/\\//.test(i.content||'')", msg:'Make og:image an absolute https URL.'},
   {js:"return !!doc.querySelector('meta[name=\"twitter:card\"]')", msg:'Add twitter:card.'}]}
],
m15: [
 {id:'m15-c1', title:'A video with captions', goal:'Embed a video with controls and two `<source>` formats, plus an English captions track that is on by default.', starter:`<video src="machines.webm" width="640" height="360"></video>`,
  hints:['`controls` is a boolean attribute and is essential without script.','With multiple sources, drop `src` on the video and add `<source>`.','`<track kind="captions" srclang="en" ... default>` goes after the sources.'],
  solution:`<video controls width="640" height="360" poster="machine.jpg">
  <source src="machines.webm" type="video/webm">
  <source src="machines.mp4" type="video/mp4">
  <track label="English" kind="captions" srclang="en" src="subs-en.vtt" default>
  <p>Your browser cannot play this. <a href="machines.mp4">Download the video</a>.</p>
</video>`,
  checks:[
   {js:"var v=doc.querySelector('video');return !!v && v.hasAttribute('controls') && v.getAttribute('width')==='640' && v.getAttribute('height')==='360'", msg:'Add controls, width and height.'},
   {js:"return doc.querySelectorAll('video source').length>=2", msg:'Offer at least two source formats.'},
   {js:"var t=doc.querySelector('video track');return !!t && t.getAttribute('kind')==='captions' && t.getAttribute('srclang')==='en' && t.hasAttribute('default')", msg:'Add a default English captions track.'}]},
 {id:'m15-c2', title:'Audio with a transcript', goal:'Embed an audio player with controls, and put a readable transcript on the page (audio has no screen for tracks).', starter:`<p>Listen to the interview.</p>
<audio src="interview.mp3"></audio>
<div id="transcript"></div>`,
  hints:['Add `controls` or there is no way to press play.','A transcript is ordinary page text, not a `<track>`.','Write at least a sentence inside the transcript container.'],
  solution:`<p>Listen to the interview.</p>
<audio controls src="interview.mp3"></audio>
<h2>Transcript</h2>
<div id="transcript"><p>HAL explains why the dishwasher refuses to learn.</p></div>`,
  checks:[
   {js:"var a=doc.querySelector('audio');return !!a && a.hasAttribute('controls')", msg:'Give the audio element controls.'},
   {js:"var t=doc.getElementById('transcript');return !!t && t.textContent.trim().length>20", msg:'Add a real transcript in #transcript.'}]}
],
m16: [
 {id:'m16-c1', title:'A native disclosure', goal:'Turn this FAQ entry into a native expander: `summary` first, the answer in a paragraph, and one open by default.', starter:`<div class="faq">
  <h3>What is the return policy?</h3>
  <p>Return it within 30 days, unused, with the receipt.</p>
</div>`,
  hints:['`<details>` is the container and `<summary>` is the clickable label.','`summary` must be the first child.','`open` is a boolean attribute: add it to start expanded.'],
  solution:`<details open>
  <summary>What is the return policy?</summary>
  <p>Return it within 30 days, unused, with the receipt.</p>
</details>`,
  checks:[
   {js:"var d=doc.querySelector('details');return !!d && d.firstElementChild && d.firstElementChild.tagName==='SUMMARY'", msg:'Make summary the first child of details.'},
   {js:"var d=doc.querySelector('details');return !!d && d.hasAttribute('open') && !!d.querySelector('p')", msg:'Start it open and keep the answer paragraph.'}]},
 {id:'m16-c2', title:'An exclusive accordion', goal:'Make three FAQ entries that behave like radio buttons: opening one closes the others, with no JavaScript.', starter:`<details><summary>Shipping</summary><p>3 to 5 days.</p></details>
<details><summary>Returns</summary><p>30 days.</p></details>
<details><summary>Warranty</summary><p>1 year.</p></details>`,
  hints:['Modern `<details>` supports a `name` attribute.','Elements sharing a `name` form one exclusive group.','Only one member may carry `open` in the markup.'],
  solution:`<details name="faq" open><summary>Shipping</summary><p>3 to 5 days.</p></details>
<details name="faq"><summary>Returns</summary><p>30 days.</p></details>
<details name="faq"><summary>Warranty</summary><p>1 year.</p></details>`,
  checks:[
   {js:"var d=doc.querySelectorAll('details[name=faq]');return d.length===3", msg:'Give all three details name="faq".'},
   {js:"return doc.querySelectorAll('details[open]').length===1", msg:'Leave exactly one open.'}],
  breakit:{prompt:'Older browsers ignore `name` on details. What does the accordion do there?', options:['All entries become unopenable','Every entry can open independently: graceful degradation','The page throws a script error'], answer:1, why:'Unknown attributes are ignored. The disclosure still works; it just is not exclusive.'}}
],
m17: [
 {id:'m17-c1', title:'A dialog that closes itself', goal:'Build a dialog with a heading, a form using `method="dialog"`, and a Close button that receives focus when it opens.', starter:`<dialog id="d">
  <h2>Delete this file?</h2>
  <button>Close</button>
</dialog>`,
  hints:['A `<form method="dialog">` inside a dialog closes it and sets `returnValue`.','`autofocus` picks which control gets focus on open.','`type="submit"` keeps the button inside the form working.'],
  solution:`<dialog id="d" aria-labelledby="dt">
  <h2 id="dt">Delete this file?</h2>
  <form method="dialog">
    <button type="submit" autofocus>Close</button>
  </form>
</dialog>`,
  checks:[
   {js:"var d=doc.querySelector('dialog');return !!d && !!d.querySelector('form[method=dialog]')", msg:'Use a form with method="dialog" inside the dialog.'},
   {js:"var b=doc.querySelector('dialog button');return !!b && b.hasAttribute('autofocus')", msg:'Give the Close button autofocus.'},
   {js:"var d=doc.querySelector('dialog');return !!d && !!d.getAttribute('aria-labelledby') && !!doc.getElementById(d.getAttribute('aria-labelledby'))", msg:'Name the dialog from its heading.'}]},
 {id:'m17-c2', title:'Open it modally', goal:'Wire the button so it opens the dialog modally, and give the dialog a name.', starter:`<dialog id="d"><h2 id="t">Settings</h2><p>Preferences.</p></dialog>
<button id="open">Open settings</button>`,
  hints:['`showModal()` opens modally and makes the rest of the page inert.','`show()` is non-modal: the page stays interactive.','Read the heading id into `aria-labelledby`.'],
  solution:`<dialog id="d" aria-labelledby="t"><h2 id="t">Settings</h2><p>Preferences.</p></dialog>
<button id="open">Open settings</button>
<script>
document.getElementById('open').onclick = function(){ document.getElementById('d').showModal(); };
</script>`,
  checks:[
   {js:"var d=doc.querySelector('dialog');return !!d && d.getAttribute('aria-labelledby')==='t'", msg:'Set aria-labelledby="t" on the dialog.'},
   {js:"return /showModal\\s*\\(/.test(doc.querySelector('script') ? doc.querySelector('script').textContent : '')", msg:'Call showModal() from the button script.'},
   {js:"var d=document.querySelector('dialog');return d.open===false", msg:'Leave the dialog closed until the user asks.'}]}
],
m18: [
 {id:'m18-c1', title:'Clone a template', goal:'Use a `<template>` for a card, then clone it into the list twice and fill in each title.', starter:`<template id="tpl"><li class="card"><h3></h3></li></template>
<ul id="list"></ul>
<script>
// clone the template twice into #list
</script>`,
  hints:['`tpl.content.cloneNode(true)` gives a fresh copy.','Set the `h3` text before appending.','`importNode` is for other documents; `cloneNode` is enough here.'],
  solution:`<template id="tpl"><li class="card"><h3></h3></li></template>
<ul id="list"></ul>
<script>
var tpl = document.getElementById('tpl'), list = document.getElementById('list');
['First card', 'Second card'].forEach(function (name) {
  var node = tpl.content.cloneNode(true);
  node.querySelector('h3').textContent = name;
  list.appendChild(node);
});
</script>`,
  checks:[
   {js:"return doc.querySelectorAll('#list > li.card').length===2", msg:'Clone the template into the list twice.'},
   {js:"var h=doc.querySelectorAll('#list h3');return h.length===2 && h[0].textContent.trim()!=='' && h[1].textContent.trim()!==''", msg:'Fill each cloned title.'}]},
 {id:'m18-c2', title:'A custom element with a slot', goal:'Define `<x-badge>` with a shadow root containing a slot, then use it on the page.', starter:`<x-badge>New</x-badge>
<script>
// define x-badge with attachShadow and a slot
</script>`,
  hints:['`customElements.define("x-badge", class extends HTMLElement {...})`.','Create the shadow root in `connectedCallback`.','`<slot></slot>` projects the light-DOM text.'],
  solution:`<x-badge>New</x-badge>
<script>
customElements.define('x-badge', class extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: 'open' }).innerHTML =
      '<style>span{background:#A51C30;color:#fff;padding:2px 8px;border-radius:9px;font:12px sans-serif}</style><span><slot></slot></span>';
  }
});
</script>`,
  checks:[
   {js:"var b=doc.querySelector('x-badge');return !!b && !!b.shadowRoot", msg:'Give the custom element an open shadow root.'},
   {js:"var b=doc.querySelector('x-badge');return !!b && !!b.shadowRoot.querySelector('slot')", msg:'Project the light DOM through a slot.'},
   {js:"return !!customElements.get('x-badge')", msg:'Register the element with customElements.define.'}]}
],
m19: [
 {id:'m19-c1', title:'A counter that survives a refresh', goal:'Make the button increment a count stored in `localStorage`, show it in the output, and start from the saved value.', starter:`<button id="inc">Add one</button>
<output id="out">0</output>
<script>
// read, increment, save, display
</script>`,
  hints:['Read with `localStorage.getItem("count")`, which returns a string or null.','Convert with `Number(...)` and default to 0.','Wrap storage in try/catch: it can throw in private modes.'],
  solution:`<button id="inc">Add one</button>
<output id="out">0</output>
<script>
var key = 'hm-practice-count';
function read() { try { return Number(localStorage.getItem(key)) || 0; } catch (e) { return 0; } }
var n = read();
document.getElementById('out').textContent = n;
document.getElementById('inc').onclick = function () {
  n++;
  try { localStorage.setItem(key, String(n)); } catch (e) {}
  document.getElementById('out').textContent = n;
};
</script>`,
  checks:[
   {js:"var o=doc.getElementById('out');return o.textContent.trim()==='0'", msg:'Start the display at the saved value (0 on a first visit).'},
   {js:"doc.getElementById('inc').click();var o=document.getElementById('out');return o.textContent.trim()==='1'", msg:'A click must increment the display.'},
   {js:"return /localStorage\\.setItem/.test(Array.prototype.map.call(doc.querySelectorAll('script'),function(s){return s.textContent}).join(''))", msg:'Save the new value with localStorage.setItem.'}]},
 {id:'m19-c2', title:'Form data to a query string', goal:'On submit, stop the page reloading and write the form data as a query string into the output.', starter:`<form id="f">
  <label for="name">Name</label> <input id="name" name="name" value="HAL">
  <button type="submit">Build</button>
</form>
<output id="q"></output>
<script>
// intercept submit, build ?, show it
</script>`,
  hints:['Listen for `submit` and call `event.preventDefault()`.','`new FormData(form)` gives the pairs; `new URLSearchParams(...)` turns them into a string.','`URLSearchParams.toString()` returns `name=HAL`.'],
  solution:`<form id="f">
  <label for="name">Name</label> <input id="name" name="name" value="HAL">
  <button type="submit">Build</button>
</form>
<output id="q"></output>
<script>
document.getElementById('f').addEventListener('submit', function (e) {
  e.preventDefault();
  var data = new URLSearchParams(new FormData(e.target));
  document.getElementById('q').textContent = '?' + data.toString();
});
</script>`,
  checks:[
   {js:"var f=document.getElementById('f');f.requestSubmit();var q=document.getElementById('q');return q.textContent.indexOf('name=HAL')>-1", msg:'Build name=HAL into the output on submit.'},
   {js:"var q=document.getElementById('q');return q.textContent.charAt(0)==='?'", msg:'Prefix the string with ?.'}]}
],
m20: [
 {id:'m20-c1', title:'Protect the layout', goal:'This hero image has no dimensions, so the page jumps. Reserve space and load the hero eagerly.', starter:`<img src="hero.jpg" alt="The workshop hall" loading="lazy">`,
  hints:['`width` and `height` give the browser the aspect ratio.','This is the hero: do not lazy-load it.','The numbers are the file\'s real pixel size, 1200 by 600.'],
  solution:`<img src="hero.jpg" alt="The workshop hall" width="1200" height="600" loading="eager" fetchpriority="high">`,
  checks:[
   {js:"var i=doc.querySelector('img');return !!i && i.getAttribute('width')==='1200' && i.getAttribute('height')==='600'", msg:'Add width="1200" and height="600".'},
   {js:"var i=doc.querySelector('img');return !!i && i.getAttribute('loading')!=='lazy'", msg:'Do not lazy-load the hero image.'}]},
 {id:'m20-c2', title:'Resource hints that earn their keep', goal:'Preconnect to the font host, preload the main stylesheet, and defer the script.', starter:`<link rel="stylesheet" href="https://fonts.example.com/serif.css">
<script src="app.js"></script>`,
  hints:['`rel="preconnect"` opens the connection early.','`rel="preload"` needs `as` so the browser knows the resource type.','`defer` keeps order and runs after parsing.'],
  solution:`<link rel="preconnect" href="https://fonts.example.com">
<link rel="preload" href="styles.css" as="style">
<link rel="stylesheet" href="https://fonts.example.com/serif.css">
<script src="app.js" defer></script>`,
  checks:[
   {js:"return !!doc.querySelector('link[rel=preconnect]')", msg:'Add a preconnect link.'},
   {js:"var p=doc.querySelector('link[rel=preload]');return !!p && p.getAttribute('as')==='style'", msg:'Preload the stylesheet with as="style".'},
   {js:"var s=doc.querySelector('script[src]');return !!s && s.hasAttribute('defer')", msg:'Defer the external script.'}]}
]
};
