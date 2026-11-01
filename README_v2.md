# The Johannesburg Dream Centre Website

A multi-page community website built with **HTML5, CSS3 and JavaScript** for The Johannesburg Dream Centre.

**Last documentation update:** 1 November 2026  
**Project stage:** Parts 1, 2 and subsequent interactive website updates  
**Status:** Static website with interactive search, catalogue, cart, gallery and externally connected forms. This is not a complete payment or order-management system.

## Student Information

| Field | Details |
| --- | --- |
| Student name | Rinae Manari |
| Student number | ST10495308 |
| Course | Diploma in IT Management |
| Institution | Rosebank International Braamfontein |
| Module | WEDE5020 |

## Project Overview

The Johannesburg Dream Centre is a South African non-profit organisation founded in June 2014 to help alleviate poverty within and around Johannesburg. Its work combines immediate support with education, skills development and opportunities for sustainable improvement.

The organisation's published information describes community outreach, computer literacy, CV assistance, interview preparation, job-readiness programmes, sewing and income-generation skills, school support and other poverty-alleviation initiatives. It is a Christian organisation whose services are available to people in need regardless of religious denomination.

The website introduces the organisation, presents its programmes and community activities, and helps visitors find information about volunteering, donations, partnerships and contact channels. Programme descriptions and statistics displayed in the student website should be confirmed with the organisation before use as an official website.

## Website Goals and Objectives

- Explain the organisation's history, mission, vision and values.
- Present its programmes and community-support services.
- Help community members find relevant information and support.
- Encourage volunteering, donations and partnerships.
- Make contact and enquiry options easy to find.
- Provide clear navigation on computers, tablets and phones.
- Support keyboard access and readable feedback during interactions.
- Improve discoverability through page metadata, `robots.txt` and `sitemap.xml`.

## Website Pages

| Page | File | Main content |
| --- | --- | --- |
| Home | `index.html` | Introduction, programme overview, community imagery and calls to action |
| About Us | `Assets/about.html` | Organisation history, mission, vision, values, team and community impact |
| Services | `Assets/services.html` | Programme catalogue, filters, programme details and priced donation/product items |
| Enquiry | `Assets/enquiry.html` | Embedded Google Form for enquiries and involvement |
| Contact | `Assets/contact.html` | Contact details, opening hours, Google Maps location and contact form |

The navigation connects all five pages. The gallery and involvement information are sections of the existing pages, not separate `gallery.html` or `get-involved.html` files.

## Current Features and New Improvements

### Navigation and Layout

- Shared navigation styling across all five pages.
- Mobile menu with open and close behaviour.
- Active-page highlighting to show the visitor's current page.
- Responsive layouts for desktop, tablet and mobile screens.
- Back-to-top button, visible from approximately **420 pixels** of scrolling, with smooth scrolling to the page top.
- Shared footer styling, social links and automatic footer-year updates.

### Search Symbol and Site Search

The original page-name search has been replaced with a content search system.

- A small **magnifying-glass symbol** replaces the wide search bar in the header.
- Clicking or tapping the symbol opens the search field and results panel.
- Search matches page titles and page content, rather than only fixed page names.
- Results show a page title, a short matching text snippet and a link to the page.
- Results appear after entering at least **two characters**.
- Pressing Enter opens the first matching result.
- Escape closes the panel and returns focus to the search symbol.
- Clicking outside the panel also closes it.
- The panel is positioned below the header on smaller screens to avoid covering navigation.
- When served over HTTP, search reads `sitemap.xml` and loads the listed pages to build its index.
- A built-in copy of the five pages' text is used when no pages can be loaded, including when opening the website directly from a local folder.
- The index is cached for the current page session, avoiding repeated loading on each keystroke.
- Result text is created using `textContent` rather than inserting fetched page text as HTML.

**Maintenance:** Refresh the built-in search copy when page wording changes or pages are added. Hosted search can discover new pages only after they are listed in the sitemap and are reachable. Offline search does not update itself, and the fallback is used when the fetched index is empty, not to fill every missing page in a partially loaded index.

### Catalogue and Programme Details

- Catalogue items are rendered from shared JavaScript data.
- Search, category filters and sorting controls help visitors browse the catalogue.
- Programme details open in a dialog without leaving the current page.
- Priced items provide an Add to Cart option.
- Informational programmes are distinguished from priced items.

### Shopping Cart and Place Order

The old README described a missing cart function. The current website includes a cart implementation.

- Add priced items to the cart.
- Track quantities and update the cart count in the header.
- Open the cart dialog to review selected items.
- Remove items or cancel the whole order.
- Keep cart contents in the current browser using `localStorage`.
- Show a **Place order** form when the cart contains items.
- Request the customer's full name, email address and phone number.
- Validate these details before attempting to save the order.
- Disable the submission button while processing to reduce duplicate submissions.
- Generate an order reference beginning with `JDC-`.
- Attempt to save through the existing Canva data SDK if it is available; otherwise attempt browser-local storage.
- Clear the cart and display a thank-you message after the save attempt.

**Important limitations:** No payment is taken. Local storage is only on the visitor's device and does not notify the organisation. No owner order dashboard or order-confirmation email is implemented. The current code can show confirmation even if both storage attempts fail; its message is not proof of a received or durably stored order. Reliable shared storage and confirmed delivery are still required for production orders.

### Contact Form

- The Contact page uses a shared JavaScript form handler.
- Required fields, email addresses and phone numbers are validated.
- Invalid fields receive feedback, and focus moves to the first invalid field.
- Submission progress, success and error messages are displayed.
- Duplicate submission attempts are blocked while a request is processing.
- Contact messages are sent to the configured **Formspree** endpoint.
- This connection is not limited to Lovable hosting, but requires internet access and a working Formspree endpoint that accepts the deployed site's requests.

**Email status:** Formspree is connected in the code, but account ownership, delivery settings and actual email delivery have not been verified for this documentation update. Automatic emails to both the sender and the receiver were discussed, not completed or confirmed. Sender acknowledgements require the appropriate service settings and may depend on the provider's plan.

### Enquiry Form

- The current Enquiry page embeds a **Google Form**.
- The form provides an enquiry/involvement submission channel outside the website's own JavaScript form handler.
- It requires internet access and an accessible Google Form.
- Google Forms controls response collection, validation and storage for this embedded form.

**Email status:** Owner notifications and responder copies must be enabled in Google Forms. These settings have not been verified. The shared script still contains a Canva/browser-storage handler for local forms, but that is not the submission path used by the current embedded enquiry form.

### Gallery and Dialogs

- Gallery images open in an enlarged preview dialog.
- Programme information and the cart use dialogs.
- Dialogs support close controls and Escape-key handling.
- Focus is contained within an open dialog and restored when it closes.
- Background scrolling is controlled while dialogs are open.

### Silver Star Effects

- Small silver-gray stars appear around taps or clicks.
- Scrolling creates occasional stars across the screen.
- The effect fades away in under a second.
- Stars do not intercept clicks because they use `pointer-events: none`.
- Scroll effects are throttled to limit how often stars are created.
- Star effects are disabled when the visitor requests reduced motion.

### Speed Improvements

- Website images were compressed to reduce download size.
- Previous optimisation work reduced the photos from approximately **760 KB to 390 KB** and made the logo approximately **five times smaller**; these are earlier file-size comparisons, not a measured loading-time guarantee.
- Images further down pages use lazy loading, with asynchronous image decoding where added.
- The embedded map and enquiry form use lazy loading.
- Google Fonts connection hints are included.
- Search loading begins when needed and its index is reused during the page session.

**Performance status:** These changes reduce initial loading work, but a before-and-after page-speed benchmark has not been recorded. External fonts, maps and forms still depend on network conditions.

### Code Comments and Maintainability

- Added explanatory comments above shared JavaScript functions.
- Added notes for validation patterns, focus handling and duplicate-submission protection.
- Added HTML section markers for page structure, forms, dialogs and scripts.
- Added CSS comments for theme variables and responsive sections.
- Standardised line endings in the pages inside `Assets/` during the commenting update.
- Kept common behaviour in `scripts/script.js` rather than repeating inline functions across pages.

## Technologies and Design

| Technology | Purpose |
| --- | --- |
| HTML5 | Semantic page structure, navigation, forms and content |
| CSS3 | Layouts, visual styling, responsive media queries and animations |
| JavaScript | Navigation, search, catalogue, cart, dialogs, form handling and stars |
| Browser `localStorage` | Device-local cart and fallback submission storage |
| XML sitemap | List of pages for crawlers and hosted site search |
| `robots.txt` | Crawler instructions and sitemap reference |
| Formspree | External contact-form submission service |
| Google Forms | Embedded enquiry submission form |
| Google Maps | Embedded location map |
| Google Fonts | DM Sans and Fraunces typography |
| Optional Canva data SDK | Conditional saving when the SDK is available and configured |

No package installation, database or application server is required to view the exported static pages. External forms and maps are separate online services.

The current stylesheet is **`styles/style.css`**, not the old `Css/style1.css`. It uses CSS custom properties for navy, deep navy, teal, orange, yellow, cream, ink, muted text, borders, success/error states and shadows. Star styling uses silver-gray. Responsive rules include adjustments around 1024, 768, 767, 480 and 420 pixels, together with reduced-motion rules.

## Project Structure

```text
Root/
├── index.html                       # Home page
├── Assets/
│   ├── about.html                   # About Us page
│   ├── contact.html                 # Contact form and map
│   ├── enquiry.html                 # Embedded Google Form
│   └── services.html                # Catalogue and programmes
├── images/
│   ├── Alicia.png
│   ├── Community Support Services.jpg
│   ├── Senior Citizen Programs.jpg
│   ├── blurred.jpg
│   ├── logo-mark.png
│   ├── oscar.png
│   ├── youth-programs.jpg
│   └── zakhele.png
├── scripts/
│   └── script.js                    # Shared interactions and offline search data
├── styles/
│   └── style.css                    # Shared styling and responsive rules
├── robots.txt                       # Search-engine crawler instructions
└── sitemap.xml                      # Five-page sitemap
```

This tree documents the website source, not Lovable's surrounding preview application. Add this document as `README.md` at the repository root. File names and capitalisation must remain consistent, especially on case-sensitive hosting.

## Sitemap and Search-Engine Discoverability

The XML sitemap includes Home, About Us, Services, Enquiry and Contact. It is separate from the visual planning sitemap below.

![Original website planning sitemap](https://github.com/user-attachments/assets/0ad1c7eb-d2d9-411b-ab27-c91cf748005a)

- `robots.txt` tells external crawlers which paths they may visit and points to the sitemap.
- The on-site search reads `sitemap.xml`; it does **not** read `robots.txt`.
- Pages contain titles, descriptions and Open Graph metadata.
- The home page includes structured organisation data using JSON-LD.
- The robots sitemap reference was changed to include `/site/sitemap.xml` for the preview's folder structure.

**Deployment check still required:** The current robots and sitemap files use `https://johannesburg-dream-centre.lovable.app/site/…`, which differs from this project's supplied published address, `https://johannesburgdreamcenterorg.lovable.app`. Replace the sitemap page addresses and robots sitemap reference with the final public host and actual page paths before relying on crawler discovery. Serve `robots.txt` at the domain root; a copy only inside `/site/` is not the standard crawler entry point. If publishing at the domain root instead of `/site/`, update those paths accordingly. These files help discovery but do not guarantee Google indexing.

## How to Run the Website

### Open from a Local Folder

1. Download and extract the website archive.
2. Keep the `Assets`, `images`, `scripts` and `styles` folders alongside `index.html`.
3. Open `index.html` in a browser.
4. Browse the pages using the navigation links.

Local page navigation and built-in fallback search are intended to work without hosting. Online forms, maps and externally loaded fonts still require internet access. Cart and submission storage depend on the browser allowing local storage.

### Run through a Local Web Server

Use Visual Studio Code Live Server, or run the following from the website folder if Python is installed:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`. Serving over HTTP allows search to fetch the sitemap and current page content instead of relying only on its built-in copy.

### Publish on Static Hosting or GitHub Pages

- Put the website files and folders in the selected publishing directory.
- Add this README to the repository root.
- Configure the host to serve `index.html`.
- Preserve file names and relative asset paths.
- Update absolute sitemap/robots addresses to match the actual deployment.
- Check Formspree and Google Forms on the published site.
- For GitHub Pages project sites, include the repository subpath in sitemap URLs. The domain-root robots file may be outside the project site's control.

## Timeline and Milestones

Dates below preserve the original README rather than inventing missing dates.

| Milestone | Recorded date/status |
| --- | --- |
| Project kickoff | 7 August 2026 |
| Content research complete | 8 August 2026 |
| HTML structure complete | 12 August 2026 |
| Initial repository setup documented | 13 August 2026 |
| Initial interface design documented | 14 August 2026 |
| CSS styling complete | 17 September 2026 |
| Initial development documented | 18 September 2026 |
| JavaScript, comments, robots and sitemap update | Recorded under 28 October 2026 in the previous changelog |
| Search, cart, effects and performance updates | Documented by 1 November 2026; individual completion dates not recorded |
| Full production testing and final submission | Dates not supplied |

**Time taken:** Exact working hours and durations were not supplied. The initial recorded CSS period spans 7 August to 17 September 2026, but calendar dates do not establish time spent working. Add actual hours or sessions when available.

## Changelog — From the Beginning

### Version 0.1 — Initial Project Setup — 13 August 2026

- Created the initial project repository.
- Researched the Johannesburg Dream Centre.
- Established website requirements, objectives and planned structure.
- Created the original planning sitemap.

### Version 0.2 — User Interface Design — 14 August 2026

- Planned the website layout, navigation and main sections.
- Selected content and imagery.
- Established the initial visual direction.

### Version 0.3 — Initial Development — 18 September 2026

- Created the HTML pages and initial CSS styling.
- Added organisation and programme content.
- Began responsive desktop, tablet and mobile layouts.

### Part 2 — Multi-page Website Development — Date Not Recorded

- Developed Home, About Us, Services, Enquiry and Contact pages.
- Added programme information, team content, imagery and donation/product information.
- Added contact details, opening hours and an embedded location map.
- Added navigation, early page-name search and back-to-top behaviour.
- Documented the website's original limitations and future improvements.

### Shared JavaScript, Comments and SEO Files — Recorded 28 October 2026

- Consolidated shared behaviour in `scripts/script.js`.
- Updated mobile navigation, active navigation, catalogue, cart, dialogs, gallery and form handling.
- Added email/phone validation, feedback and duplicate-submission guards.
- Added keyboard handling for catalogue controls and dialogs.
- Added explanatory comments throughout HTML, CSS and JavaScript.
- Updated `robots.txt` and the five-page XML sitemap.
- Prepared project-structure and changelog documentation for GitHub.

### Search, Preview and Export Updates — Documented by 1 November 2026

- Added sitemap-driven content search to all five pages.
- Corrected result titles so individual page names appear.
- Replaced the wide header search bar with a compact magnifier symbol.
- Added panel toggle, outside-click dismissal and Escape handling.
- Added built-in page text so search can work from an extracted local folder.
- Adjusted the robots sitemap path for the `/site/` preview directory.
- Set up a live website preview and packaged the static source under the requested archive name, `Root.zip`.

### Cart and Visual Effects — Documented by 1 November 2026

- Added the Place order form with customer details and validation.
- Added generated order references, saving attempts, cart clearing and confirmation text.
- Added small stars on clicks/taps and scrolling.
- Changed stars from gold to silver-gray.
- Added reduced-motion handling and non-blocking effect styling.

### Forms and Performance — Documented by 1 November 2026

- Connected the contact form to Formspree and the enquiry page to an embedded Google Form.
- Compressed website photos and the logo.
- Added lazy loading and asynchronous decoding where appropriate.
- Discussed sender and receiver email notifications; service settings and delivery remain unverified.

### README Refresh — 1 November 2026

- Combined the original project information with the subsequent updates.
- Corrected outdated file paths, search descriptions and the claim that cart code was missing.
- Separated implemented features from unfinished production requirements.
- Preserved original milestone dates, student information and references.
- Left unrecorded dates and development durations explicitly unconfirmed.

## Testing Record and Recommended Checks

Earlier development checks reported:

- JavaScript syntax checking after comments were added.
- Comparison confirming the commenting update did not change executable content, apart from HTML line-ending normalisation.
- Desktop and phone-size search-panel checks, result selection, Escape and outside-click dismissal.
- Search from a directly opened local folder using the built-in text copy.
- Silver stars checked against both light and dark sections.
- Preview home-page loading and navigation to the About Us page.

This README update does not constitute a fresh end-to-end test of every feature. Complete the following before official launch:

- [ ] Check navigation, images and search on all five pages at the final hosting address.
- [ ] Test cart quantities, removal, cancellation and validation.
- [ ] Verify an order is actually stored and visible to the organisation before claiming receipt.
- [ ] Test invalid and valid contact submissions and confirm receiver email delivery.
- [ ] Test the embedded enquiry form and verify its Google Forms response record.
- [ ] Enable and confirm sender acknowledgements and owner notifications for both forms.
- [ ] Check keyboard access, focus, reduced-motion behaviour and mobile layouts.
- [ ] Correct sitemap/robots deployment URLs and verify crawler access.
- [ ] Measure performance before and after optimisation using the same conditions.
- [ ] Confirm organisation content, contact details, opening hours, statistics and image permissions.

## Remaining Limitations and Future Improvements

1. **Reliable order receipt:** Add shared production storage, an owner view and confirmed order notifications. Correct the confirmation behaviour when saving fails.
2. **Payments:** No payment gateway or completed online donation transaction is implemented.
3. **Email copies:** Emails to both sender and receiver for Contact and Enquiry have not been confirmed or fully set up.
4. **Local storage:** Browser-local records are not shared, can be cleared and should not be treated as secure production storage for personal information.
5. **External dependencies:** Formspree, Google Forms, Maps and Google Fonts need internet access and appropriate service configuration.
6. **Search maintenance:** Update the sitemap and offline text copy when content changes; improve handling of partially unavailable pages.
7. **SEO deployment:** Correct the current host/path mismatch and verify indexing separately.
8. **Further improvements:** Privacy information, spam protection, analytics, news/events and more comprehensive accessibility and performance testing remain possible future work, not completed features.

## Contact Information in the Original README

The original documentation listed the following details. They are retained as supplied, not independently verified organisation details:

- **Email:** [info@Johannesburgdreamcenter.org](mailto:info@Johannesburgdreamcenter.org)
- **Phone:** +27 81 402 8576
- **Address:** 1st Floor Northlands Corner, New Market Road, Hoogland, Gauteng
- **Hours:** Monday–Friday 9:00 AM–3:00 PM; Saturday 8:00 AM–2:00 PM; Sunday closed

Confirm these details with the organisation before publishing as official information.

## References

### Organisation Research — Original References

- Johannesburg Dream Center. (n.d.). *Our story*. Available at: https://johannesburgdreamcenter.org/charity/our-story/ (Accessed: 13 August 2026).
- Johannesburg Dream Center. (n.d.). *Contact us*. Available at: https://johannesburgdreamcenter.org/contact-us/ (Accessed: 13 August 2026).
- Johannesburg Dream Center. (n.d.). *Sponsors*. Available at: https://johannesburgdreamcenter.org/charity/sponsors/ (Accessed: 13 August 2026).
- Johannesburg Dream Center NPC. (n.d.). *Johannesburg Dream Center NPC*. LinkedIn. Available at: https://za.linkedin.com/company/johannesburg-dream-center-npc (Accessed: 13 August 2026).

### Technical Documentation — Further Reading

These links document the technologies used; no new consultation dates are claimed.

- MDN Web Docs. *HTML*. https://developer.mozilla.org/en-US/docs/Web/HTML
- MDN Web Docs. *CSS*. https://developer.mozilla.org/en-US/docs/Web/CSS
- MDN Web Docs. *JavaScript*. https://developer.mozilla.org/en-US/docs/Web/JavaScript
- MDN Web Docs. *Window: localStorage property*. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN Web Docs. *Fetch API*. https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Sitemaps.org. *Sitemaps XML format*. https://www.sitemaps.org/protocol.html
- Google Search Central. *Introduction to robots.txt*. https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Formspree. *Help Center*. https://help.formspree.io/
- Google. *Google Forms Help*. https://support.google.com/docs/topic/9055404
- GitHub Docs. *GitHub Pages documentation*. https://docs.github.com/en/pages

## Conclusion

The project has progressed from an informational multi-page site to an interactive community website with shared JavaScript, content search, an offline search fallback, a catalogue, cart, order-entry form, gallery dialogs, silver star effects, externally connected forms and lighter images.

The remaining priority is production reliability: verified form emails, confirmed order receipt, payment integration if required, correct deployment URLs and full launch testing.

## Copyright

© 2026 The Johannesburg Dream Centre. All rights reserved.
