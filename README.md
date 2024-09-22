# ip-request-mapper

When a user visits a web site, the actual request to the web site is converted into individual requests for each element on the page, e.g. images, fonts, css, text, and the like. This Chrome extension follows each request and places it onto a map so the user can more easily visualize both where the page elements are fetched from as well as the sheer number of requests included in each visit to a web site.

This extension is available in the Chrome extension store (https://chromewebstore.google.com/detail/ip-request-mapper/ghhmhholmphdnpndngkhmpknekgicmbp). Installing from there is the easiest way to run it.

If you wish to run it yourself, you will need to obtain the following keys:

1. Google Maps
2. Google Developer
3. IP2Location.io key

Place those keys in the appropriate locations (noted in the source code).

Then compile the Typescript: "tsc" or "npx tsc"

Then "Load Unpacked Extension" in Chrome, selecting the top level folder for the extension.

Once the extension is installed, Click on the Puzzle icon in Chrome to Manage Extensions. Ensure the extension is pinned so that it can be activated. Activate the extension by clicking on the map icon. A map will open in a new window. In the original window, visit any web site and you will see pin icons dropped onto the map.

Icon courtesy of designmodo.com.

Icon licensed under Creative Commons (Attribution 3.0 Unported)
http://designmodo.com/flat-free

