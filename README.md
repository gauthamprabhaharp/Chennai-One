# ChennaiPulse — Our City. Our Voice.

Responsive city-issue reporting portal prototype. Original design; not affiliated with Greater Chennai Corporation or any government body.

## Features
- Responsive landing page and mobile navigation
- Category selection for potholes, garbage, streetlights, drainage, water, safety and other civic concerns
- Area/neighbourhood, street/landmark, optional PIN code and description
- Optional photo upload with preview and JPG/PNG/WebP validation, maximum 5 MB
- Generates a `CHP-####` reference ID
- Dedicated tracking section: look up a report by `CHP-####`, see saved details and a status timeline\n- Community issue board with category and status filters
- Reports and photo data stored in this browser via localStorage
- Sample reports for UI demonstration

## Run
Extract the ZIP and open `index.html` in your browser. Or run `python3 -m http.server 8000` from the project folder and open `http://localhost:8000`.

## Important limitations
This is a front-end demo. Reports are not sent to civic officials; there is no official integration, account system, or cross-device sync. Sample reports are illustrative. Images are stored locally in the browser and may use storage quickly. Do not submit sensitive personal information. For urgent issues, contact appropriate official or emergency channels directly.

Before public launch, add a secure backend/database and image storage, access controls, moderation, rate limits, privacy/retention policies, and verified official workflows. Clearly state whether the service is independent or formally authorized.
