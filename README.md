# node-force-domain

node-force-domain is a middleware for the Express.js framework that allows you to have multiple domains, but forces them to redirect (301) to a default one.

## Installation

    $ npm install node-force-domain

## Quick Start

Using node-force-domain is easy:

**use() it within Express.js**

    ```javascript
        // Insert before all other calls to app.use().
        app.use(require('node-force-domain').redirectTo('www.example.com'));
    ```
That's it!
