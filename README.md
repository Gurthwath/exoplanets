A simple React project using Next.js.

This project is the front-end portion of a website that will display a list of earth-like exoplanets, sourced from NASA's exoplanet archive (https://exoplanetarchive.ipac.caltech.edu/).

The website allows a user to filter these exoplanets by several criteria, and displays the results in a list.

The data is currently being reached via Next.js proxy.  It would be simple to redirect that proxy to an external API or a back-end service, but to keep this simple the proxy just reads from a local JSON file.