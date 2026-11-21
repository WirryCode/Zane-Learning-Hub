/* Quiz + flashcard bank. Each part APPENDS its modules here. (c) Wilfred Wanyoike
   QUIZ[id] = [{q, o:[options], a:correctIndex, w:why}]   CARDS[id] = [{f:front, b:back}]  */
window.QUIZ = window.QUIZ || {}; window.CARDS = window.CARDS || {};

/* ===== PART 1 ===== */
window.QUIZ.m01 = [
 {q:"What does `<!DOCTYPE html>` do?", o:["Loads the HTML5 stylesheet","Tells the browser to use standards mode","Declares the page language","Creates the root element"], a:1, w:"It triggers standards mode. Without it browsers use quirks mode."},
 {q:"Where must `<meta charset=\"utf-8\">` appear?", o:["Anywhere in the body","Last in the head","First in the head, before the title","Inside the title"], a:2, w:"It must come first (within the first 1024 bytes) so everything after it is decoded correctly."},
 {q:"Which attribute on `<html>` declares the page language?", o:["`language`","`hreflang`","`xml:lang` only","`lang`"], a:3, w:"`lang` takes an ISO code such as `en` or `fr-CA`."},
 {q:"Which viewport value is accessibility-safe?", o:["`width=device-width, initial-scale=1`","`user-scalable=no`","`maximum-scale=1`","`width=980`"], a:0, w:"Disabling zoom (user-scalable=no / maximum-scale=1) fails accessibility audits."},
 {q:"You wrote `<link href=\"styles.css\">` and nothing is styled. Why?", o:["`rel=\"stylesheet\"` is missing","The file is too large","It must be in the body","`type` is required"], a:0, w:"`rel` defines the relationship; without it nothing is linked."},
 {q:"Which script attribute runs the script after parsing, **in order**?", o:["`async`","`lazy`","`module-only`","`defer`"], a:3, w:"`defer` waits for the document and keeps order. `async` runs as soon as downloaded, in any order."},
 {q:"How many `<base>` elements may a document have?", o:["Zero","One","Two (head and body)","Unlimited"], a:1, w:"Only one, and before any relative URLs. It also breaks `#fragment` links, so many avoid it."},
 {q:"Which `rel` value names the preferred URL for duplicated content?", o:["`alternate`","`icon`","`canonical`","`prefetch`"], a:2, w:"`canonical` tells search engines which URL is authoritative."}
];
window.CARDS.m01 = [
 {f:"The 5 must-haves of every page (DL-CTV)", b:"Doctype, Lang, Charset, Title, Viewport"},
 {f:"What is quirks mode?", b:"A legacy rendering mode triggered when the doctype is missing."},
 {f:"`defer` vs `async`", b:"defer: after parsing, in order. async: as soon as downloaded, any order. Both need `src`."},
 {f:"Why put CSS in the head?", b:"The browser knows how to paint content first time: no flash of unstyled content or repaints."},
 {f:"`rel` values: ICAC", b:"Icon, Canonical, Alternate, CSS (stylesheet)"},
 {f:"Default encoding if you forget the charset?", b:"Often windows-1252, depending on locale. Always declare UTF-8."},
 {f:"Which CSS method is the default choice?", b:"`<link rel=\"stylesheet\">`: cached across pages and easy to maintain."},
 {f:"What breaks when you use `<base>`?", b:"Fragment links like `#top` resolve against the base URL and cause a page load."}
];

window.QUIZ.m02 = [
 {q:"Which element marks a long, block-level quotation?", o:["`<q>`","`<cite>`","`<blockquote>`","`<quote>`"], a:2, w:"`<blockquote>` is for block quotes. `<q>` is inline. `<quote>` does not exist."},
 {q:"What does `<cite>` contain?", o:["The title of the work","The quote","The author's name only","A URL"], a:0, w:"`<cite>` holds the title of a work (book, site, film, program), not the person."},
 {q:"How do you display a copyright symbol?", o:["`&copyright;`","`&copy;`","`&c;`","`(c)` only"], a:1, w:"`&copy;` is the named reference (or `&#169;`)."},
 {q:"Which pair of characters must you always escape in text?", o:["`+` and `=`","`#` and `@`","`/` and `\\`","`<` and `&`"], a:3, w:"`<` starts tags and `&` starts entities."},
 {q:"The right way to separate two paragraphs is...", o:["`<br><br>`","`&nbsp;&nbsp;`","Close one `<p>` and open another","Use an `<h6>`"], a:2, w:"Use paragraphs for paragraphs; style the gap with CSS."},
 {q:"Which adds quote marks automatically?", o:["`<q>`","`<blockquote>`","`<cite>`","`<pre>`"], a:0, w:"`<q>` adds language-appropriate quotation marks."},
 {q:"Why must heading levels not be skipped?", o:["Browsers throw errors","Screen reader users navigate by heading levels","CSS stops working","Search engines delete the page"], a:1, w:"Heading order is a navigation aid, like a table of contents."},
 {q:"What does the `cite` **attribute** do?", o:["Shows a visible credit","Italicises text","Adds a footnote","Holds a machine-readable source URL"], a:3, w:"It is a URL for the source, valid on `<q>` and `<blockquote>`, not shown to readers."}
];
window.CARDS.m02 = [
 {f:"STAIRS: heading rules", b:"Start at h1, step one at a time, always down by one, one main h1, reset via sectioning, style with CSS."},
 {f:"BQC", b:"Blockquote = Big quote (block). Q = Quick (inline). Cite = Credit the work."},
 {f:"Four reserved characters and their entities", b:"`&lt;` `&gt;` `&amp;` `&quot;`"},
 {f:"`&nbsp;` use", b:"Non-breaking space: keeps two words/characters together on a line."},
 {f:"When is a `<section>` a landmark?", b:"Only when it has an accessible name (e.g. `aria-labelledby`). Then its role is `region`."},
 {f:"`<br>` is for...", b:"Line breaks inside a block (addresses, poems), never paragraph spacing."},
 {f:"Where does the quote's author go?", b:"Outside the `<blockquote>`, usually in a following `<p>`."},
 {f:"Numeric forms of ©", b:"`&#169;` (decimal) and `&#xA9;` (hex)."}
];

window.QUIZ.m03 = [
 {q:"Which element holds the site logo/title and main navigation?", o:["`<heading>`","`<header>`","`<top>`","`<title>`"], a:1, w:"A top-level `<header>` is the banner landmark."},
 {q:"How many visible `<main>` elements per page?", o:["One","Two","As many as needed","Zero"], a:0, w:"Exactly one visible `<main>` represents the dominant content."},
 {q:"A `<footer>` inside an `<article>` is...", o:["The contentinfo landmark","Invalid","Not a landmark","Always hidden"], a:2, w:"Only a top-level footer is the `contentinfo` landmark."},
 {q:"Implicit role of `<aside>`?", o:["`banner`","`region`","`article`","`complementary`"], a:3, w:"`<aside>` = complementary content."},
 {q:"A `<section>` becomes a `region` landmark when...", o:["It has an accessible name","It has an id","It is inside main","It has a class"], a:0, w:"Give it `aria-labelledby` or `aria-label`."},
 {q:"Best element for a self-contained blog post that could be syndicated?", o:["`<section>`","`<div>`","`<article>`","`<aside>`"], a:2, w:"An `<article>` is independently reusable content."},
 {q:"What is `<address>` for?", o:["Any postal address on the page","Web URLs","Map embeds","Contact information for a person/organisation"], a:3, w:"It is contact info for the nearest article/body owner, usually in a footer."},
 {q:"Two `<nav>` elements on one page. Best practice?", o:["Remove one","Label each with `aria-label`","Merge them","Use `role=\"banner\"`"], a:1, w:"Labels let screen reader users tell them apart."}
];
window.CARDS.m03 = [
 {f:"HNMAF", b:"Header, Nav, Main, Aside, Footer: the page skeleton."},
 {f:"Role of top-level `<header>` / `<footer>`", b:"banner / contentinfo"},
 {f:"Article or section? (ASA test)", b:"Could it live Alone elsewhere → article. Subdivision with a heading → section. Appearance only → div."},
 {f:"Implicit roles: main, nav, aside", b:"main, navigation, complementary"},
 {f:"Why prefer semantic tags to `div` + roles?", b:"Free meaning, less code, no id/class hooks, low specificity, better accessibility tree."},
 {f:"Heading inside `<main>` names...", b:"That page (not the whole site)."},
 {f:"Too many landmarks causes...", b:"Noise: screen reader users struggle to understand the layout."},
 {f:"Can a page have many `<header>` elements?", b:"Yes: one per article/section. Only the top-level one is a landmark."}
];

/* ===== PART 2 ===== */
window.QUIZ.m04 = [
 {q:"What does \"semantic HTML\" mean?", o:["Choosing elements for the meaning of the content, not its looks","Using as many div elements as possible","Adding ARIA roles to every element","Styling elements with CSS only"], a:0, w:"Semantic means relating to meaning. Looks are CSS's job."},
 {q:"Which structure do screen readers use to understand a page?", o:["The DOM","The CSSOM","The accessibility tree","The render tree"], a:2, w:"Browsers derive an accessibility tree from the DOM plus computed styles; assistive technology reads that."},
 {q:"What is the implicit role of a top-level `<footer>`?", o:["banner","contentinfo","complementary","region"], a:1, w:"A top-level footer is the `contentinfo` landmark. Nested footers are not landmarks."},
 {q:"What does `<div role=\"button\">` actually do?", o:["Makes the div keyboard-focusable","Makes Enter and Space work","Changes only what assistive technology announces","Adds a click handler"], a:2, w:"`role` changes semantics only. Focus, keys and behaviour must be rebuilt by hand."},
 {q:"Which is NOT given free by a native `<button>`?", o:["A tab stop","Enter and Space activation","The role of button","Your brand's custom styling"], a:3, w:"Styling is yours to write. Focus, keys and role come free."},
 {q:"What is the first rule of ARIA?", o:["Add a role to every element","Use a native element first","Always add aria-hidden to icons","Prefer div over button"], a:1, w:"If a native element does the job, use it instead of ARIA. No ARIA beats bad ARIA."},
 {q:"A `<header>` nested inside `<main>` has which role?", o:["No landmark role (generic)","banner","contentinfo","main"], a:0, w:"Only a top-level header is the banner landmark."},
 {q:"A developer uses `<h3>` for a small label purely because of its size. What is the fix?", o:["Use `<b>` instead","Use `<h6>`","Use a `<span>` with role=\"heading\"","Use the right element for meaning and set size with CSS"], a:3, w:"Pick elements for structure; control appearance with CSS."}
];
window.CARDS.m04 = [
 {f:"MOLE", b:"Meaning Over Looks, Every time: choose tags for what content is."},
 {f:"FROG", b:"First Rule Of ARIA: Go native. Use the real element first."},
 {f:"TESR", b:"What a real button gives free: Tab stop, Enter, Space, Role."},
 {f:"Does `role=\"button\"` make a div behave like a button?", b:"No. It only changes the announced role. Focus and keys must be built."},
 {f:"Three trees the browser builds", b:"DOM, CSSOM and the accessibility tree (AOM)."},
 {f:"Implicit roles: nav, main, aside", b:"navigation, main, complementary."},
 {f:"What does the accessibility tree expose per node?", b:"Name, role and state/value."},
 {f:"Quick test of good semantics", b:"Turn off CSS or tab through: order, headings, lists and landmarks should still make sense."}
];
window.QUIZ.m05 = [
 {q:"Which element marks up the main navigation?", o:["`<navigation>`","`<menu>`","`<nav>`","`<links>`"], a:2, w:"`<nav>` has the implicit role navigation, a landmark."},
 {q:"A page has two navigation blocks. What is best practice?", o:["Remove one","Use two `<nav>`s and label each","Wrap both in one `<nav>`","Use `<nav>` once and `<div>` for the other"], a:1, w:"Multiple `<nav>`s are fine; give each an accessible name."},
 {q:"Best accessible name for the primary nav?", o:["`aria-label=\"Primary\"`","`aria-label=\"Primary navigation\"`","`aria-label=\"nav\"`","`aria-label=\"Navigation menu\"`"], a:0, w:"Screen readers already announce \"navigation\", so repeating it is redundant."},
 {q:"What is the rule for a skip link?", o:["It must be display:none until focused","It may be visually hidden but must show when focused","It must always stay visible","It is only for mouse users"], a:1, w:"Hide off-screen, reveal on :focus. `display:none` removes it from the tab order."},
 {q:"How do you mark the link to the current page?", o:["`aria-selected=\"true\"`","`role=\"current\"`","`class=\"active\"` only","`aria-current=\"page\"`"], a:3, w:"`aria-current=\"page\"` tells assistive tech; `aria-selected` is invalid on links."},
 {q:"Which list element suits breadcrumbs, and why?", o:["`ul`: bullets look better","`dl`: key/value pairs","`ol`: the order is meaningful","`div`: no list needed"], a:2, w:"Breadcrumb order is hierarchy, so an ordered list fits."},
 {q:"Best way to draw breadcrumb separators?", o:["CSS `li + li::before`","Literal \">\" text inside each link","An image with alt=\"arrow\"","An `<hr>` between items"], a:0, w:"Generated content is decoration and is not read by screen readers."},
 {q:"Why avoid changing tab order across screen sizes?", o:["It slows loading","Users expect a predictable, consistent focus order","It is invalid HTML","Search engines penalise it"], a:1, w:"Layouts may move, but keyboard order should not surprise users."}
];
window.CARDS.m05 = [
 {f:"GLBTS", b:"Global, Local, Breadcrumb, Table of contents, Site map: navigation types."},
 {f:"LLAMA", b:"Label, List, Aria-current, Mark up with nav, Always consistent."},
 {f:"ONA", b:"Breadcrumb recipe: Ol inside Nav, Aria-current on current item."},
 {f:"aria-label vs aria-labelledby", b:"labelledby reuses visible text; label is hidden text. Never include the word \"navigation\"."},
 {f:"Skip link target tip", b:"`<main id=\"main\" tabindex=\"-1\">` so focus really moves there."},
 {f:"Attribute for current page link", b:"`aria-current=\"page\"` (not aria-selected)."},
 {f:"Why role=\"menu\" is risky for site navs", b:"It promises app-style arrow-key behaviour. Use a button with aria-expanded plus a list of links."},
 {f:"Is `<nav>` for every group of links?", b:"No. Only major blocks, or the landmark list becomes noise."}
];
window.QUIZ.m06 = [
 {q:"Which attribute turns `<a>` into a hyperlink?", o:["`src`","`href`","`link`","`url`"], a:1, w:"`href` supplies the destination. Without it `<a>` is a placeholder."},
 {q:"What does `<a href=\"#top\">` do when no element has id=\"top\"?", o:["Reloads the page","Scrolls to the top of the page","Opens a new tab","Does nothing"], a:1, w:"`#top` (case-insensitive) and an empty `#` both return to the page top."},
 {q:"A `target=\"_blank\"` link is clicked 15 times. How many tabs open?", o:["One","Zero","Fifteen","Two"], a:2, w:"`_blank` opens a new unnamed tab every time."},
 {q:"What does `target=\"reg\"` do on repeated clicks?", o:["Opens a new window each time","Is invalid","Behaves like `_top`","Reuses the same named tab after the first click"], a:3, w:"A named browsing context is reused."},
 {q:"Correct MIME type for a PDF in the `type` attribute?", o:["`application/x-pdf`","`application/pdf`","`text/pdf`","`pdf`"], a:1, w:"`application/pdf` is the standard type."},
 {q:"Which `rel` value marks a translation or alternate version?", o:["`alternate`","`alternative`","`translate`","`other`"], a:0, w:"It is spelled `alternate`. Pair it with `hreflang`."},
 {q:"What does the `download` attribute do?", o:["Encrypts the file","Opens the file in a new tab","Forces any URL to download","Suggests a filename; ignored for cross-origin URLs"], a:3, w:"It works for same-origin, blob and data URLs only."},
 {q:"Which link text is best?", o:["Click here","More","Read the 2026 annual report","Link"], a:2, w:"Link text is the accessible name and must say where the link goes."}
];
window.CARDS.m06 = [
 {f:"MATH", b:"Link kinds: Mailto, Anchor (#id), Tel, Http(s)."},
 {f:"HTRD-HTP", b:"href, target, rel, download, hreflang, type, ping."},
 {f:"Fragment identifier", b:"`#id` jumps to the matching element; it is not sent to the server."},
 {f:"rel for a translation", b:"`rel=\"alternate\"` with `hreflang`."},
 {f:"Safe new-tab link", b:"`target=\"_blank\" rel=\"noopener noreferrer\"`."},
 {f:"Correct tel link format", b:"International: `tel:+18005551212`."},
 {f:"Which key activates a link vs a button?", b:"Link: Enter. Button: Enter and Space."},
 {f:"Can `<a>` wrap other interactive elements?", b:"No. Do not nest buttons, inputs or other links inside a link."}
];
window.QUIZ.m07 = [
 {q:"Which is a valid direct child of `<ul>`?", o:["`<li>`","`<div>`","`<ul>`","`<dt>`"], a:0, w:"Only `<li>` (plus script-supporting elements)."},
 {q:"Where must a nested list go?", o:["Directly inside the outer `<ul>`","Inside an `<li>`","Inside a `<p>`","After the closing `</ul>` only"], a:1, w:"Nest it in the list item it belongs to."},
 {q:"What numbers does `<ol start=\"4\" reversed>` show for 3 items?", o:["4, 3, 2","4, 5, 6","3, 2, 1","6, 5, 4"], a:0, w:"`reversed` counts down from the start value."},
 {q:"Valid values of the `type` attribute on `<ol>`?", o:["`circle`, `square`, `disc`","`roman`, `alpha`, `digit`","`1`, `a`, `A`, `i`, `I`","`decimal`, `latin`"], a:2, w:"Five values: numbers, lower/upper letters, lower/upper roman."},
 {q:"Which elements make up a description list?", o:["`<li>` and `<ul>`","`<th>` and `<td>`","`<key>` and `<value>`","`<dt>` and `<dd>`"], a:3, w:"`<dl>` holds `<dt>` terms and `<dd>` details."},
 {q:"Implicit ARIA role of `<dl>`?", o:["list","group","none","term"], a:2, w:"`<dl>` has no implicit role because it is not always a list."},
 {q:"Why add `role=\"list\"` to a `<ul>` with `list-style:none`?", o:["It changes the bullet style","Safari with VoiceOver may drop list semantics otherwise","It is required by the spec","It improves SEO"], a:1, w:"Removing the bullets can remove the list semantics in some browsers."},
 {q:"Is an `<h2>` inside an `<li>` valid?", o:["Yes: `<li>` accepts any flow content","No: only text is allowed","Only `<h6>`","Only with a role"], a:0, w:"`<li>` may contain flow content, headings included."}
];
window.CARDS.m07 = [
 {f:"OUD", b:"Ordered (ol), Unordered (ul), Description (dl)."},
 {f:"RSTV", b:"reversed, start, type on ol; value on li."},
 {f:"Children of ul/ol", b:"`<li>` only. Nest lists inside an li."},
 {f:"Children of dl", b:"`<dt>` and `<dd>` (optionally grouped in `<div>`)."},
 {f:"Which attribute sets one item's number?", b:"`value` on the `<li>`; later items continue from it."},
 {f:"Can a dt have several dd?", b:"Yes. Each dt needs at least one dd, and dd's may be shared."},
 {f:"Why not `<br>` or typed bullets?", b:"No list semantics: no count, no list navigation."},
 {f:"Why can't a `<ul>` sit inside a `<p>`?", b:"The parser closes the paragraph before the list."}
];
window.QUIZ.m08 = [
 {q:"Which element shows sample output from a program?", o:["`<code>`","`<kbd>`","`<samp>`","`<var>`"], a:2, w:"`<samp>` is program output, `<kbd>` is user input."},
 {q:"Date-related content that needs a machine-readable value should use...", o:["`<data>`","`<time>`","`<var>`","`<abbr>`"], a:1, w:"`<time datetime=\"...\">` is for dates and times. `<data>` is the generic version."},
 {q:"What is the difference between `<em>` and `<strong>`?", o:["Italic vs bold","None, they are identical","`<em>` is deprecated","`<em>` adds stress, `<strong>` adds importance"], a:3, w:"Meaning, not looks: stress versus importance."},
 {q:"What is `<mark>` for?", o:["Relevance, such as highlighting a search hit","Importance","Deleted text","Stress"], a:0, w:"It highlights text that is relevant in context."},
 {q:"`<cite>` should wrap...", o:["A person's name","The title of a creative work","A URL","An ISBN"], a:1, w:"It marks the title of a work."},
 {q:"Which of these is NOT a void element?", o:["`<br>`","`<hr>`","`<wbr>`","`<abbr>`"], a:3, w:"`<abbr>` has content and an end tag."},
 {q:"`<ruby>` is used for...", o:["Decorative text","Syntax highlighting","Pronunciation annotations in East Asian text","Quotations"], a:2, w:"Ruby text (`<rt>`) annotates base characters."},
 {q:"What is the difference between `<s>` and `<del>`?", o:["They are identical","`<s>` is no longer relevant; `<del>` is removed text","`<s>` is for subscript","`<del>` is not valid"], a:1, w:"`<s>` keeps outdated content; `<del>` records a deletion."}
];
window.CARDS.m08 = [
 {f:"CKSVP", b:"code, kbd, samp, var, pre: the code family."},
 {f:"ESM", b:"Em (stress), Strong (importance), Mark (relevance)."},
 {f:"IBU", b:"i, b, u: last-resort elements."},
 {f:"BHW", b:"br, hr, wbr: the void line-break trio."},
 {f:"samp vs kbd", b:"samp = program output; kbd = user input."},
 {f:"Which element for a date?", b:"`<time datetime=\"...\">`."},
 {f:"When is `<abbr title>` unreliable?", b:"On touch and keyboard. Spell the term out in the text too."},
 {f:"What is `<wbr>`?", b:"An optional line-break opportunity inside long strings. No hyphen added."}
];
window.QUIZ.m09 = [
 {q:"Which two attributes should every content image have?", o:["`size` and `title`","`width` and `height`","`src` and `alt`","`href` and `alt`"], a:2, w:"`src` finds the image; `alt` describes it."},
 {q:"A purely decorative `<img>` should have...", o:["No alt attribute","`alt=\"\"`","`alt=\"decorative\"`","`alt=\"image\"`"], a:1, w:"An empty alt is skipped by assistive tech. A missing alt may read the file name."},
 {q:"Best alt for a magnifying-glass search icon?", o:["Magnifying glass image","Icon","Image of a magnifier","Search"], a:3, w:"For icons, convey the meaning (the action), not the picture."},
 {q:"Which attribute enables native lazy loading?", o:["`loading=\"lazy\"`","`lazy`","`defer`","`preload`"], a:0, w:"It is `loading=\"lazy\"`; there is no `lazy` attribute."},
 {q:"When using `w` descriptors in `srcset`, you should also provide...", o:["`media`","`type`","`sizes` (default is 100vw)","`ismap`"], a:2, w:"`sizes` tells the browser the displayed width so it can pick a candidate."},
 {q:"`<picture>` is best for...", o:["Lazy loading","Art direction and format fallback","Adding captions","Image maps"], a:1, w:"`<source>` with `media` or `type`; the inner `<img>` is the fallback."},
 {q:"Why add `width` and `height` to an `<img>`?", o:["To force a fixed size","To make it load faster","To replace alt","To let the browser reserve space and avoid layout shift"], a:3, w:"The attributes give the aspect ratio; CSS can still resize."},
 {q:"Where must `<figcaption>` sit inside `<figure>`?", o:["Anywhere","Outside the figure","First or last child","Inside the `<img>`"], a:2, w:"It must be the first or last child."}
];
window.CARDS.m09 = [
 {f:"SAWH", b:"src, alt, width, height: four attributes for every content image."},
 {f:"CATS", b:"Context first, Avoid \"image of\", Terse, Skip what nearby text says."},
 {f:"PAF", b:"Picture = Art direction + Formats; srcset = sizes and resolution."},
 {f:"Alt for decorative image", b:"`alt=\"\"` (present but empty), or use CSS."},
 {f:"Alt for an icon", b:"The meaning or action (\"Search\"), not the picture."},
 {f:"Lazy-load attribute", b:"`loading=\"lazy\"`. Never on the hero image."},
 {f:"Why width + height?", b:"Reserve space and reduce layout shift."},
 {f:"srcset `w` descriptors need...", b:"`sizes` (defaults to 100vw)."}
];

/* ===== PART 3 ===== */
window.QUIZ.m10 = [
 {q:"Which element gives a table its visible title and accessible name?", o:["`<title>`", "`<caption>`", "`<header>`", "`<legend>`"], a:1, w:"`<caption>` is the first child of `<table>`. It is visible to everyone and names the table."},
 {q:"What is the correct order of a table's children?", o:["`thead`, `caption`, `tbody`, `colgroup`, `tfoot`", "`colgroup`, `caption`, `tfoot`, `thead`, `tbody`", "`caption`, `thead`, `colgroup`, `tfoot`, `tbody`", "`caption`, `colgroup`, `thead`, `tbody`, `tfoot`"], a:3, w:"Caption first, then column groups, then the row groups with the footer last."},
 {q:"A header row is made of `<td>` cells with bold CSS. What is lost?", o:["The header association that assistive technology relies on", "Nothing: it looks the same", "The ability to use `colspan`", "The table border"], a:0, w:"Only `<th>` creates a header-cell relationship (roles columnheader/rowheader). Bold text is visual only."},
 {q:"In a 3-column table, one cell in a row has `colspan=\"2\"`. How many other cells does that row need?", o:["0", "2", "1", "3"], a:2, w:"2 columns are covered by the merged cell, so exactly 1 more cell completes the row of 3."},
 {q:"You want a cell to merge with the cell beneath it. Where does `rowspan=\"2\"` go?", o:["On the lower cell", "On the `<tr>`", "On the upper cell, and you omit the lower cell", "On both cells"], a:2, w:"`rowspan` goes on the first cell of the merge. The merged-over cell is removed from the markup."},
 {q:"What does the `headers` attribute hold?", o:["A space-separated list of header cell `id` values", "The visible text of the headers", "A single `scope` keyword", "The column numbers"], a:0, w:"Use it for complex tables where `scope` cannot express every association. It is valid on `<td>` and `<th>`."},
 {q:"Which CSS property moves a caption below the table?", o:["`align: bottom` (the attribute)", "`vertical-align` on the table", "`float: bottom`", "`caption-side: bottom`"], a:3, w:"`caption-side` is the modern way. The `align` attribute is deprecated."},
 {q:"Which data is best presented in a `<table>`?", o:["Ingredients for a recipe", "Students and their grades over three semesters", "A group of thumbnail images", "A glossary of terms and definitions"], a:1, w:"Tables are for data that is compared across rows and columns. Recipes suit `<ul>`, glossaries `<dl>`, images a CSS grid."}
];
window.CARDS.m10 = [
 {f:"Table child order", b:"`caption`, `colgroup`, `thead`, `tbody`, `tfoot` (CCTTT)."},
 {f:"Header cell element", b:"`<th>`, with `scope` (`col`, `row`, `colgroup`, `rowgroup`, `auto`)."},
 {f:"colspan vs rowspan", b:"`colspan` merges across a row, `rowspan` merges down. Remove the merged-over cells."},
 {f:"The `headers` attribute", b:"Space-separated header `id`s on a cell, for complex tables."},
 {f:"Preferred table name", b:"`<caption>`, first child. Alternatives: `aria-label` / `aria-labelledby`."},
 {f:"`<col>` / `<colgroup>`", b:"No semantics, styling hooks only (border, background, width, visibility)."},
 {f:"Table for layout?", b:"Never. Use CSS grid or flex. Inherited layout table: `role=\"none\"`."},
 {f:"Move the caption below", b:"`caption-side: bottom`."}
];
window.QUIZ.m11 = [
 {q:"What does `<input disabled=\"false\">` do?", o:["The input is still disabled", "The input is enabled", "It is a syntax error and ignored", "It disables only keyboard input"], a:0, w:"A boolean attribute is true whenever it is present. Remove it, or set `el.disabled = false`."},
 {q:"Which statement is true of `<input required=\"required\">`?", o:["It is invalid HTML", "It makes the field optional", "It is valid and identical to `required`", "It needs a space before the equals sign"], a:2, w:"A boolean attribute may be omitted-value, empty, or equal to its own name. All forms mean true."},
 {q:"What does `<div contenteditable=\"contenteditable\">` do?", o:["It makes the div editable", "The value is invalid, so it falls back to `inherit` and the div is not editable", "It makes the div editable only with a click", "It throws a JavaScript error"], a:1, w:"`contenteditable` is enumerated (`true`, `false`, `plaintext-only`). Invalid values default to `inherit`."},
 {q:"Which attribute values are case-sensitive?", o:["`type=\"text\"` on an input", "`<input type=\"TEXT\">`", "Every attribute value", "`id` and `class` names"], a:3, w:"Spec-defined keywords are case-insensitive. Strings you invent, like ids and classes, are case-sensitive."},
 {q:"Which is a correctly formed custom attribute?", o:["`birthday`", "`data-birthday`", "`data:birthday`", "`xml-birthday`"], a:1, w:"Custom attributes start with `data-`, are lowercase and contain no colon."},
 {q:"How do you read `data-first-name` in JavaScript?", o:["`el.dataset.first-name`", "`el.data.firstName`", "`el.dataset['first_name']`", "`el.dataset.firstName`"], a:3, w:"`dataset` converts kebab-case names to camelCase. Values are always strings."},
 {q:"What does `tabindex=\"-1\"` do?", o:["Removes the element from the page", "Puts it first in the tab order", "Makes the element focusable by script or click but not tabbable", "Disables it"], a:2, w:"`-1` is for programmatic focus. `0` adds it to the tab order. Positive values reorder the sequence and should be avoided."},
 {q:"Two elements share `id=\"email\"`. What happens?", o:["The page renders, but links, labels and scripts target the wrong (first) element", "The browser refuses to render the page", "The second id is silently renamed", "Only CSS is affected"], a:0, w:"Duplicate ids do not crash the page, but anything that looks up an id returns the first match."}
];
window.CARDS.m11 = [
 {f:"Boolean attribute rule", b:"Present = true, absent = false. `disabled=\"false\"` is still true (PIT)."},
 {f:"Boolean vs enumerated", b:"Booleans: presence only. Enumerated: fixed keywords, defaults vary, absent is not false."},
 {f:"Invalid `contenteditable` value", b:"Falls back to `inherit`. Valid: `true`, `false`, `plaintext-only`, empty."},
 {f:"Case sensitivity", b:"Spec keywords insensitive; `id` and `class` values case-sensitive."},
 {f:"Custom attribute", b:"`data-*`, lowercase, no colon. Read with `el.dataset.camelCase`."},
 {f:"`tabindex` values", b:"`-1` focusable only, `0` tabbable, positive = bad (FTB)."},
 {f:"Uniqueness", b:"`id` must be unique per document; `class` is a space-separated list."},
 {f:"Turn a boolean off in JS", b:"`el.removeAttribute(\"x\")` or `toggleAttribute`. `setAttribute` needs 2 args."}
];
window.QUIZ.m12 = [
 {q:"What is the default `type` of a `<button>` inside a form?", o:["`button`", "`reset`", "There is no default", "`submit`"], a:3, w:"Always write `type=\"button\"` for buttons that should not submit the form."},
 {q:"How do you make radio buttons one group?", o:["Give them all the same `name`", "Put them in a `<div>`", "Give them all the same `id`", "Give them all the same `value`"], a:0, w:"Same `name` means only one can be selected. Each radio keeps its own `value`."},
 {q:"Which control is NOT included in the submitted data?", o:["A named `readonly` text input", "A named hidden input", "A named checkbox that is unchecked", "A named text input left empty"], a:2, w:"Unchecked checkboxes and radios send nothing. A readonly or empty named input is still sent. Disabled controls are not sent either."},
 {q:"A checked checkbox has a `name` but no `value`. What is submitted?", o:["`name=true`", "`name=on`", "`name=`", "Nothing"], a:1, w:"The default value of a checkbox is `on`. Always give checkboxes real values."},
 {q:"What does `formnovalidate` on a submit button do?", o:["Skips constraint validation when that button is used", "Disables the button", "Prevents the form from submitting at all", "Turns validation on"], a:0, w:"Useful for \"Save draft\" and dialog \"Cancel\" buttons. `novalidate` on the `<form>` does the same for every submit."},
 {q:"How do you set a custom validation message?", o:["`input.validity.setCustomValidity(...)`", "`input.title = \"message\"` only", "`input.setCustomValidity(\"message\")`, and reset it with `\"\"`", "`form.customMessage = \"message\"`"], a:2, w:"`setCustomValidity` is a method on the control. A non-empty message blocks submission until you set it back to an empty string."},
 {q:"What do you need on the `<form>` for a file upload?", o:["`enctype=\"text/plain\"`", "`enctype=\"multipart/form-data\"` and `method=\"post\"`", "`method=\"get\"`", "`type=\"file\"` on the form"], a:1, w:"File data cannot travel in a URL-encoded query string, so use `multipart/form-data` with POST."},
 {q:"When is a `<form>` exposed as a landmark?", o:["Always", "Only when it has an `action`", "Only inside `<main>`", "When it has an accessible name (`aria-label` or `aria-labelledby`)"], a:3, w:"An unnamed `<form>` is just a generic group. Name it to make it a form landmark."}
];
window.CARDS.m12 = [
 {f:"Default `<button>` type in a form", b:"`submit`. Write `type=\"button\"`."},
 {f:"Sent in form data?", b:"Has a `name`, not disabled, and checked if checkbox/radio (NDC)."},
 {f:"GET vs POST", b:"GET puts pairs in the URL, POST in the body. Use POST for sensitive data."},
 {f:"Group radios", b:"Same `name`; each its own `value`; `required` on one."},
 {f:"Label a control / a group", b:"`<label>` for a control; `<fieldset>` + `<legend>` for a group."},
 {f:"Validation attributes", b:"`required`, `pattern`, `min`, `max`, `step`, `minlength`, `maxlength`, `type` (RPMMSLT)."},
 {f:"Skip validation", b:"`novalidate` on form, `formnovalidate` on a button."},
 {f:"Custom error message", b:"`input.setCustomValidity(\"msg\")`; clear with `\"\"`. Always validate on the server too."}
];
window.QUIZ.m13 = [
 {q:"What does `tabindex=\"-1\"` on a `<div>` do?", o:["It cannot be focused at all", "It becomes first in the tab order", "It can be focused by script or click but is skipped by Tab", "It is added to the tab order in source order"], a:2, w:"`-1` is for programmatic focus (skip-link targets, headings, modals). `0` adds an element to the tab order."},
 {q:"Why avoid `tabindex=\"3\"` on a few elements?", o:["They disable the element", "Positive values jump ahead of the normal order and create chaos", "They are invalid HTML", "They only work on links"], a:1, w:"Elements with positive tabindex are visited first, lowest to highest, then the rest in source order."},
 {q:"Which attribute makes a section unclickable, unfocusable and removes it from the accessibility tree?", o:["`disabled`", "`tabindex=\"-1\"`", "`hidden=\"until-found\"`", "`inert`"], a:3, w:"`inert` is a global boolean. `disabled` is limited to form controls and `tabindex=\"-1\"` only drops tabbing."},
 {q:"A form control has the `disabled` attribute. Which is true?", o:["It cannot be focused and is not submitted", "It is still submitted with the form", "It is only greyed out", "It can still receive click events"], a:0, w:"Disabled controls are unfocusable, receive no click events and are left out of form submission."},
 {q:"Where is `autofocus` still a good idea?", o:["On the first input of every page", "On the `<body>`", "On an element inside a `<dialog>`", "On the site logo"], a:2, w:"Elsewhere it scrolls the page and can hide labels or instructions. In a dialog it chooses which control gets focus when the dialog opens."},
 {q:"A flex container uses `flex-direction: row-reverse`. What happens to keyboard focus order?", o:["It still follows the source order, so it no longer matches the visual order", "It follows the new visual order", "Tabbing stops working", "Positive tabindex is added automatically"], a:0, w:"CSS reorders pixels, not the DOM. Change the source order instead of reordering visually."},
 {q:"Which property tells you which element currently has focus?", o:["`document.focused`", "`window.focus`", "`element.isFocused`", "`document.activeElement`"], a:3, w:"`document.activeElement` is read-only and returns the focused element."},
 {q:"Which CSS pseudo-class styles focus mainly for keyboard users?", o:["`:focus-within`", "`:focus-visible`", "`:target`", "`:hover`"], a:1, w:"`:focus-visible` matches when the browser decides a focus ring is useful, typically after keyboard navigation."}
];
window.CARDS.m13 = [
 {f:"Focusable vs tabbable", b:"Focusable: can receive focus. Tabbable: also reachable with Tab."},
 {f:"`tabindex=\"0\"` / `\"-1\"`", b:"`0` adds to tab order. `-1` focusable by script only."},
 {f:"Three ways to drop from Tab", b:"Negative `tabindex`, `disabled`, `inert` (TDI). Not interchangeable."},
 {f:"`disabled` effects", b:"Unfocusable, no click events, not submitted. Form controls only."},
 {f:"`inert` effects", b:"Whole subtree unclickable, unfocusable, out of the accessibility tree."},
 {f:"`autofocus` guidance", b:"Avoid, except inside `<dialog>`."},
 {f:"Focus order rule", b:"Source order = visual order. Never reorder only with CSS."},
 {f:"Focus styling", b:"Show `:focus-visible`; never remove the outline without a replacement (SPOT)."}
];
window.QUIZ.m14 = [
 {q:"Which meta tag do search engines ignore?", o:["`description`", "`keywords`", "`robots`", "`viewport`"], a:1, w:"`keywords` was abused by spammers, so it carries no weight. `description` is often shown under the title in results."},
 {q:"Which attribute do Open Graph tags use instead of `name`?", o:["`property`", "`rel`", "`itemprop`", "`http-equiv`"], a:0, w:"`<meta property=\"og:title\" content=\"...\">`. Twitter/X tags use `name=\"twitter:...\"`."},
 {q:"Which is the correct syntax for a redirect after 5 seconds?", o:["`<meta name=\"refresh\" content=\"5; https://example.com/\">`", "`<meta http-equiv=\"redirect\" content=\"5\">`", "`<meta http-equiv=\"refresh\" content=\"5; url=https://example.com/\">`", "`<meta http-equiv=\"refresh\" src=\"https://example.com/\">`"], a:2, w:"It is an `http-equiv` pragma with `seconds; url=...`. Still, prefer a server redirect."},
 {q:"Which Twitter/X tag selects the card layout?", o:["`twitter:site`", "`og:type`", "`twitter:layout`", "`twitter:card`"], a:3, w:"`summary` or `summary_large_image`. Other `twitter:` tags fall back to Open Graph if missing."},
 {q:"Which meta tag can take a `media` attribute?", o:["`theme-color`", "`description`", "`robots`", "`charset`"], a:0, w:"It lets you set different browser UI colours for, say, light and dark mode."},
 {q:"How do you link a web app manifest?", o:["`<meta name=\"manifest\" content=\"...\">`", "`<link rel=\"manifest\" href=\"/manifest.webmanifest\">`", "`<script src=\"manifest.json\">`", "`<link rel=\"app\" src=\"...\">`"], a:1, w:"It is a `<link>` with `rel=\"manifest\"`. Note `href`, not `src`."},
 {q:"What does `<meta name=\"robots\" content=\"noindex, nofollow\">` ask crawlers to do?", o:["Block visitors from the page", "Hide the page from the browser history", "Compress the page", "Not index the page and not follow its links"], a:3, w:"It is a request, not enforcement. It only works if crawlers are allowed to fetch the page."},
 {q:"What should `og:image` contain?", o:["A relative path like `/img/a.png`", "The image encoded in base64", "An absolute `https://` URL to the image", "Only the file name"], a:2, w:"Platforms fetch the image themselves, so it needs a full public URL. Add `og:image:alt` too."}
];
window.CARDS.m14 = [
 {f:"Three meta forms", b:"`charset`; `http-equiv` + `content`; `name`/`property` + `content`."},
 {f:"Head essentials", b:"Charset, viewport, description, theme-color (CVDT)."},
 {f:"Ignored meta", b:"`keywords`."},
 {f:"`refresh` pragma", b:"`5; url=...`. Avoid it: use a server redirect."},
 {f:"Open Graph attribute", b:"`property`, e.g. `og:title`; image must be absolute https."},
 {f:"Twitter/X card tag", b:"`twitter:card` (`summary_large_image`), with `name=\"twitter:...\"`."},
 {f:"`theme-color`", b:"Only meta with `media`; can set light/dark colours."},
 {f:"Manifest and icons", b:"`<link rel=\"manifest\" href=...>`, `rel=\"icon\"`, `rel=\"apple-touch-icon\"`."}
];
/* ===== PART 4 ===== */
window.QUIZ.m15 = [
 {q:"Which attribute shows the browser's built-in play, volume and fullscreen controls?", o:["`ui`", "`controls`", "`player`", "`mediacontrols`"], a:1, w:"`controls` is a plain boolean attribute (not \"booleancontrols\"). Without it, and without script, users cannot start the media."},
 {q:"What is the `type` attribute on a `<source>` for?", o:["It sets the file's volume", "It chooses the subtitle language", "It lets the browser skip files it cannot decode without downloading them", "It names the CDN to use"], a:2, w:"`type` holds the MIME type (optionally with `codecs`) so the browser picks the first playable source and never fetches the rest."},
 {q:"Which attribute makes a video start silent so autoplay is usually allowed?", o:["`muted`", "`mute`", "`silent`", "`quiet`"], a:0, w:"The attribute is `muted` (the notes wrote \"mute\"). It sets the initial state; scripts use the `el.muted` property."},
 {q:"Which `<track kind>` covers dialogue plus sound effects, for people who cannot hear?", o:["`caption`", "`descriptions`", "`captions`", "`metadata`"], a:2, w:"`captions` (plural) includes non-speech sounds. `descriptions` describe visuals. A misspelt kind is treated as `metadata` and never shown."},
 {q:"What does the `poster` attribute do?", o:["Shows an image if the browser cannot play video", "Plays a short intro clip", "Shows a thumbnail every time the video is paused", "Shows an image before playback starts"], a:3, w:"The poster is displayed until the video plays. It is not shown again after pausing, and it is not fallback content."},
 {q:"Which file format should `<track src>` point to?", o:["WebVTT (`.vtt`)", "`.mp4`", "`.json`", "`.docx`"], a:0, w:"Timed text uses WebVTT, served as `text/vtt`, from the same origin unless `crossorigin` is set."},
 {q:"A muted, looping background video plays for a minute. What do accessibility guidelines require?", o:["Nothing, because it is muted", "A way to pause, stop or hide it", "A transcript in the fallback content", "`preload=\"none\"`"], a:1, w:"WCAG 2.2.2: moving content that lasts over five seconds needs a pause control. `loop` never ends, so always provide one."},
 {q:"What does `video.play()` return?", o:["`true` or `false`", "Nothing (undefined)", "The current playback time", "A Promise that rejects with `NotAllowedError` if playback is blocked"], a:3, w:"`play()` returns a Promise. Always add `.catch()` so you can show a Play button when autoplay is blocked."}
];
window.CARDS.m15 = [
 {f:"Background video recipe (PALM)", b:"`playsinline`, `autoplay`, `loop`, `muted`. Add `role=\"none\"`, no fallback, and a pause control."},
 {f:"Track kinds (SCDCM)", b:"Subtitles, Captions, Descriptions, Chapters, Metadata. Plural `captions`/`descriptions`."},
 {f:"Child order inside `<video>`", b:"`<source>` elements, then `<track>` elements, then fallback content. The closing tag is required."},
 {f:"`muted` attribute vs property", b:"The attribute sets only the initial state. In script, use `el.muted`."},
 {f:"`preload` values", b:"`none`, `metadata`, `auto`. A hint the browser may ignore."},
 {f:"Why `type`/`codecs` on `<source>`?", b:"The browser takes the first playable source and avoids downloading formats it cannot decode."},
 {f:"`<audio>` and captions", b:"No visual area, so `<track>` is not displayed. Provide a transcript (or show cues with script)."},
 {f:"Keeping custom controls safe", b:"Keep `controls` in HTML; remove it only after your own button exists. Use `play()`, `pause()`, `paused`, `aria-controls`."}
];
window.QUIZ.m16 = [
 {q:"Where must `<summary>` be placed?", o:["As the last child of `<details>`", "Inside a `<fieldset>`", "As the first child of `<details>`", "Anywhere in the `<body>`"], a:2, w:"The summary is the always-visible label, so it must be the first child of its `<details>`."},
 {q:"What does the `open` attribute do?", o:["Shows all the contents when present", "Opens the link in a new tab", "Hides the `<summary>`", "Locks the widget closed"], a:0, w:"`open` is a boolean the browser adds and removes as the user toggles. Present means expanded, absent means collapsed."},
 {q:"How do you make an accordion where opening one item closes the others, with no JavaScript?", o:["Give them the same `id`", "Add `role=\"accordion\"`", "Add `exclusive` to each", "Give the `<details>` elements the same `name`"], a:3, w:"A shared `name` groups `<details>` like radio buttons. Older browsers ignore it and let each item open independently."},
 {q:"Where is the content of a closed `<details>`?", o:["Removed from the DOM", "In the DOM, but not rendered", "Fetched only after the click", "Replaced by the summary text"], a:1, w:"It stays in the DOM (which is why find-in-page can open it in some browsers); it simply is not rendered."},
 {q:"Which event fires when a `<details>` opens or closes?", o:["`expand`", "`toggle`", "`open`", "`change`"], a:1, w:"`toggle` fires after the state changes. It does not bubble, so attach it to each `<details>`. Read `el.open` inside it."},
 {q:"What happens if a `<details>` has no `<summary>`?", o:["Nothing renders", "The first paragraph becomes the label", "The page throws an error", "The browser adds a default summary reading \"Details\""], a:3, w:"The built-in summary lives in a shadow root, so your `summary` CSS cannot style it. Always write your own."},
 {q:"What is a safe way to restyle the disclosure arrow?", o:["Set `list-style: none` and draw your own icon with `summary::before`", "Delete the `<summary>`", "Set `details { marker: none }`", "Set `display: none` on the summary"], a:0, w:"The marker is a list-style marker. Replace it, never just remove it: users need a visible cue that the summary expands."},
 {q:"How do assistive technologies expose a `<summary>`?", o:["As a level 2 heading", "As a link", "Like a button with an expanded or collapsed state", "As plain text"], a:2, w:"That is also why headings inside a summary can lose their heading role: a button's children are presentational. Test with a screen reader."}
];
window.CARDS.m16 = [
 {f:"Details in four words (SOFA)", b:"Summary first, Open boolean, Fires `toggle`, Accordion via shared `name`."},
 {f:"Exclusive accordion without JS", b:"`<details name=\"faq\">` on each item. One `name` per group."},
 {f:"`toggle` event", b:"Fires after any open/close, does not bubble. Read `el.open` inside it. `beforetoggle` fires first in newer browsers."},
 {f:"Closed content and the DOM", b:"Still in the DOM, just not rendered. Find-in-page can open it in Chrome and Edge."},
 {f:"Style the marker", b:"`list-style`, `summary::marker` (limited) or hide it and use `summary::before` with `details[open]`."},
 {f:"No `<summary>`?", b:"The browser inserts a default \"Details\" summary (shadow root, not stylable by your CSS)."},
 {f:"When to use details (DUCK)", b:"Disclosure content, FAQs, collapsible extras. Not menus or modals."},
 {f:"`<summary>` semantics", b:"Button with expanded state. Avoid links or labels inside it; headings inside may lose their role."}
];
window.QUIZ.m17 = [
 {q:"Which method opens a dialog with a backdrop and makes the rest of the page inert?", o:["`show()`", "`open()`", "`display()`", "`showModal()`"], a:3, w:"`showModal()` opens a modal in the top layer with `::backdrop`. `show()` opens a non-modal dialog; there is no `open()` method."},
 {q:"Which dialogs does the Escape key close?", o:["Non-modal dialogs only", "Modal dialogs only", "Both kinds", "Neither"], a:1, w:"Escape fires `cancel` and closes a modal. A non-modal dialog needs its own visible close button."},
 {q:"A `method=\"dialog\"` form is submitted. What is `returnValue` set to?", o:["The `value` of the submit button used", "The button's `name`", "The button's text", "Always `\"ok\"`"], a:0, w:"The source said `name`: it is `value`. A button without a value gives an empty string. `close(\"x\")` sets it too."},
 {q:"How can a dialog be closed with no JavaScript?", o:["`<form action=\"close\">`", "`<button close>`", "A form with `method=\"dialog\"` (or a button with `formmethod=\"dialog\"`)", "`<dialog hidden>`"], a:2, w:"Submitting a dialog-method form closes the dialog. Nothing is sent to a server, and validation still runs unless `novalidate`."},
 {q:"Which pseudo-element styles the layer behind a modal dialog?", o:["`dialog::background`", "`dialog:overlay`", "`dialog::backdrop`", "`dialog::scrim`"], a:2, w:"`::backdrop` exists only for modal dialogs (and fullscreen elements). `::background` does not exist."},
 {q:"Why is `dialog { display: flex }` risky?", o:["It overrides the default hiding, so a closed dialog is visible", "It makes the dialog modal", "It blocks the Escape key", "It removes the backdrop"], a:0, w:"The browser hides closed dialogs with `dialog:not([open]) { display: none }`. Style the open state: `dialog[open] { display: flex }`."},
 {q:"You write `<dialog open>` in HTML. What kind of dialog is it?", o:["A modal dialog", "A non-modal dialog (no backdrop, nothing inert)", "A hidden dialog", "An invalid dialog that throws"], a:1, w:"The `open` attribute opens it non-modally. The source's \"modal-less\" means non-modal. Use `showModal()` for a modal."},
 {q:"Which role suits a confirmation that needs an immediate response?", o:["`role=\"modal\"`", "`role=\"popup\"`", "`aria-modal=\"false\"`", "`role=\"alertdialog\"`"], a:3, w:"The implicit role is `dialog`. Use `alertdialog` for urgent confirmations, and always give the dialog an accessible name."}
];
window.CARDS.m17 = [
 {f:"What showModal() gives you (BIET)", b:"Backdrop, Inert page, Escape closes, Top layer. `show()` gives none of them."},
 {f:"Three ways to close (EFC)", b:"Escape key, Form `method=\"dialog\"`, `close()` call (optionally `close(\"value\")`)."},
 {f:"Dialog members (ORCC)", b:"`open` property, `returnValue`, `cancel` event, `close` event."},
 {f:"`returnValue`", b:"Set to the submitter button's `value` (not `name`); empty string if none."},
 {f:"Focus in a dialog", b:"First focusable element gets focus, or the `autofocus` one. On close, focus returns to the opener."},
 {f:"Do not add `tabindex` to `<dialog>`", b:"It is not interactive and takes no focus; its contents do."},
 {f:"Closed dialog still showing?", b:"You set `display` on `dialog`. Use `dialog[open] { display: ... }`."},
 {f:"Click-outside close", b:"A backdrop click targets the dialog itself: `if (e.target === dialog) dialog.close()`. Pad an inner wrapper."}
];
window.QUIZ.m18 = [
 {q:"What happens to the content of a `<template>`?", o:["It is not rendered and lives in `template.content`", "It is rendered but hidden with CSS", "It runs scripts immediately", "It is deleted after parsing"], a:0, w:"Template content is an inert `DocumentFragment`. It becomes live only when you clone it into the document or a shadow root."},
 {q:"Which rule applies to custom element names?", o:["They must start with `x-`", "They must be uppercase", "They must be lowercase and contain a hyphen", "Any name works"], a:2, w:"`star-rating` is valid; `rating` is reserved for built-ins and `customElements.define` throws a `SyntaxError`."},
 {q:"Why use `template.content.cloneNode(true)`?", o:["It makes the template load faster", "So the template can be reused: appending `content` directly moves it", "It is required for custom element names", "It adds a hyphen to the tag"], a:1, w:"Appending the fragment itself empties the template, so the second component instance renders blank."},
 {q:"A `<slot>` has no matching slotted child. What is shown?", o:["Nothing", "An error message", "The host's `title`", "The slot's fallback content"], a:3, w:"Content inside `<slot>...</slot>` is the fallback, rendered when nothing is assigned to it."},
 {q:"What does `el.shadowRoot` return for a shadow root created with `mode: 'closed'`?", o:["The shadow root, as usual", "`null`", "An empty object", "It throws"], a:1, w:"`closed` hides the root from `el.shadowRoot`. It is a convenience, not a security boundary."},
 {q:"A global `input { border: 2px solid red }` rule is on the page. Does it style an input inside a shadow tree?", o:["Yes, always", "Only for radio inputs", "Only if `!important` is used", "No: shadow DOM scopes styles"], a:3, w:"Styles do not cross the shadow boundary either way. Put styles inside the shadow root or use custom properties and `::part()`."},
 {q:"Which selector lets page CSS style an element in a shadow tree marked `part=\"box\"`?", o:["`star-rating::slotted(box)`", "`star-rating:host(box)`", "`star-rating::part(box)`", "`star-rating::shadow(box)`"], a:2, w:"`part` works like a class, and `::part()` is written from the page. `::slotted()` and `:host` are written inside the component."},
 {q:"A custom element has a child that matches no slot (and there is no default slot). What happens to it?", o:["It stays in the DOM but is not rendered", "It is deleted", "It is rendered after the shadow content", "It becomes the default slot"], a:0, w:"Slotted nodes are not copied or replaced: unmatched light-DOM children are simply not displayed."}
];
window.CARDS.m18 = [
 {f:"The three parts (TCS)", b:"Template (`<template>`, `<slot>`), Custom element (`customElements.define`), Shadow DOM (`attachShadow`)."},
 {f:"Styling across the boundary (HSPV)", b:"`:host`, `::slotted()`, `::part()`, and CSS Variables (custom properties)."},
 {f:"Custom element name rule", b:"Lowercase with a hyphen. Define once per name; check with `customElements.get()`."},
 {f:"Named vs default slot", b:"`<slot name=\"x\">` gets children with `slot=\"x\"`. Unnamed `<slot>` gets every other child. Slot content is the fallback."},
 {f:"`open` vs `closed` shadow", b:"`open`: `el.shadowRoot` works. `closed`: it returns `null`. Neither is real security."},
 {f:"Lifecycle callbacks", b:"`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback` (+ `observedAttributes`), `adoptedCallback`."},
 {f:"Declarative shadow DOM", b:"`<template shadowrootmode=\"open\">` builds the shadow root during parsing, with no JavaScript."},
 {f:"Forms and shadow DOM", b:"Inputs inside a shadow tree are not part of the outer form. Use a form-associated custom element (`ElementInternals`)."}
];
window.QUIZ.m19 = [
 {q:"Which interface gives every DOM node `addEventListener()`?", o:["`Element`", "`EventTarget`", "`HTMLElement`", "`Window` only"], a:1, w:"The chain is `EventTarget` to `Node` to `Element` to `HTMLElement` to the specific interface. `Window` also inherits from `EventTarget`."},
 {q:"A child interface defines a property with the same name as one it inherits. Which wins?", o:["The parent's property", "Neither: it throws", "Whichever was defined first", "The child's property"], a:3, w:"The inheriting interface overrides the inherited one (e.g. `HTMLOptionsCollection.length` is writable, `HTMLCollection.length` is not). The source stated it backwards."},
 {q:"`fetch('/missing')` hits a 404. What happens?", o:["The Promise rejects", "It retries automatically", "The Promise resolves with `response.ok === false`", "It throws synchronously"], a:2, w:"`fetch` rejects only on network failure. Always check `response.ok` before reading the body."},
 {q:"What can `localStorage` store directly?", o:["Strings only", "Any object", "Functions", "Only numbers"], a:0, w:"Values are strings. Save objects with `JSON.stringify` and read them with `JSON.parse`."},
 {q:"Which method returns a static snapshot, not a live collection?", o:["`querySelectorAll()`", "`getElementsByClassName()`", "`getElementsByTagName()`", "`element.children`"], a:0, w:"`querySelectorAll` returns a static `NodeList`. The others return live `HTMLCollection`s that update with the DOM."},
 {q:"What does the Geolocation API require?", o:["Nothing: it works anywhere", "Only a `<meta>` tag", "A secure context (HTTPS) and the user's permission", "A service worker"], a:2, w:"Powerful APIs need HTTPS (or `localhost`) and often a permission prompt, best asked after a user gesture. Handle denial."},
 {q:"What must the `dragover` handler do for an element to accept a drop?", o:["Return `false` from `drop`", "Set `draggable=\"false\"`", "Call `stopPropagation()` only", "Call `event.preventDefault()`"], a:3, w:"Without `preventDefault()` in `dragover`, the browser refuses the drop and `drop` never fires."},
 {q:"What is the safest way to put user-supplied text into the page?", o:["Set `innerHTML`", "Set `textContent`", "Use `document.write()`", "Use `eval()`"], a:1, w:"`textContent` treats the string as plain text. `innerHTML` with user input is a classic XSS hole."}
];
window.CARDS.m19 = [
 {f:"Inheritance ladder (ENEH)", b:"EventTarget, Node, Element, HTMLElement, then the specific `HTMLxxxElement`."},
 {f:"Override rule", b:"A child interface's member overrides the inherited one. Example: `HTMLOptionsCollection.length` is writable."},
 {f:"Live vs static collections", b:"Live: `getElementsBy*`, `children`. Static: `querySelectorAll` (NodeList)."},
 {f:"Three observers (IMR)", b:"Intersection, Mutation, Resize. Batched callbacks instead of polling."},
 {f:"APIs that ask permission (GNCC)", b:"Geolocation, Notifications, Camera/microphone, Clipboard read. Need secure context; ask after a click."},
 {f:"Web Storage", b:"Strings only, about 5 MB, synchronous. `localStorage` persists, `sessionStorage` lasts for the tab."},
 {f:"Fetch gotcha", b:"Rejects only on network failure. Check `response.ok`. Cancel with `AbortController`."},
 {f:"Where the accessibility tree is", b:"A separate view from the Elements panel (which shows the DOM). `display:none` nodes are absent from it."}
];
window.QUIZ.m20 = [
 {q:"What is the \"good\" threshold for Largest Contentful Paint (at the 75th percentile)?", o:["100 milliseconds", "0.1", "2.5 seconds or less", "4 seconds"], a:2, w:"LCP good is 2.5 s or less. 200 ms is INP and 0.1 is CLS."},
 {q:"Which metric replaced First Input Delay as a Core Web Vital?", o:["Interaction to Next Paint (INP)", "Time to First Byte", "First Contentful Paint", "Total Blocking Time"], a:0, w:"INP replaced FID in March 2024. It measures responsiveness across the whole visit."},
 {q:"Why is `loading=\"lazy\"` on the hero image a mistake?", o:["It makes the image smaller", "It delays the largest above-the-fold image and hurts LCP", "It blocks the parser", "It breaks `alt` text"], a:1, w:"Only lazy-load below-the-fold images. Give the hero `fetchpriority=\"high\"` instead."},
 {q:"Why set `width` and `height` on an `<img>`?", o:["To compress the file", "To enable lazy loading", "To make it load first", "To reserve space and prevent layout shift"], a:3, w:"The browser derives an aspect ratio and reserves the box before the file arrives, improving CLS."},
 {q:"Which script attribute downloads in parallel and runs in order after parsing?", o:["`async`", "`lazy`", "`preload`", "`defer`"], a:3, w:"`defer` keeps order and waits for parsing. `async` runs as soon as it arrives, in any order."},
 {q:"What does `<link rel=\"preconnect\">` do?", o:["Downloads the page's CSS", "Opens DNS, TCP and TLS to another origin ahead of time", "Fetches the next page", "Compresses responses"], a:1, w:"It warms the connection to a cross-origin host you will certainly use. It downloads nothing itself."},
 {q:"What does `Cache-Control: no-cache` mean?", o:["Revalidate with the server before using the cached copy", "Never store the response", "Cache for one year", "Cache only on a CDN"], a:0, w:"`no-cache` means \"revalidate\" (often with ETag/304). `no-store` is the one that forbids storing."},
 {q:"What does a `304 Not Modified` response tell the browser?", o:["The page moved permanently", "The server refused the request", "Its cached copy is still valid; no body is sent", "The response is compressed"], a:2, w:"The browser sent `If-None-Match` with the ETag; a match returns 304. It saves bandwidth but still costs a round trip."}
];
window.CARDS.m20 = [
 {f:"Core Web Vitals (LIC)", b:"LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less (75th percentile of real users)."},
 {f:"Resource hints (PPPD)", b:"Preload (this page), Preconnect (early handshake), Prefetch (next page), DNS-prefetch (DNS only)."},
 {f:"Image checklist (WSLFD)", b:"Width/height, Srcset, Lazy (not the hero), Fetchpriority, Decoding async."},
 {f:"TTFB guide", b:"0.8 s or less is good. Fix redirects, cache, compress, use a CDN, and measure with `Server-Timing`."},
 {f:"`defer` vs `async`", b:"`defer`: parallel download, runs in order after parsing. `async`: runs when ready, any order. Modules defer by default."},
 {f:"Compression", b:"Brotli beats gzip by roughly 15 to 20%; gzip as fallback. Static for CSS/JS/SVG, dynamic for generated HTML. Skip images and WOFF2."},
 {f:"ETag and 304", b:"Browser sends `If-None-Match`; a match gets `304 Not Modified` with no body."},
 {f:"DOM size", b:"Lighthouse warns near 800 nodes, flags about 1,400. Trim wrappers, virtualise lists, try `content-visibility: auto`."}
];
