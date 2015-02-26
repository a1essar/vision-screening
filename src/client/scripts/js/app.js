define('app', [
    'domReady',
    'jquery',
    'underscore',
    'backbone',
    'modernizr',
    'detectizr',
    'vision-screening'
],  function ( domReady, $, _, Backbone, Modernizr, Detectizr, VisionScreening ) {
    'use strict';

    console.log('%cfile: app.js', 'color: #C2ECFF');

    /** private */
    var _this;
    var _defaults = {};

    /** constructor
     * @return {boolean}
     */
    function App(){
        console.log('%ctrace: App -> constructor', 'color: #ccc');

        _this = this;

        /** public */
        this.options = _.extend({

            },
            _defaults
        );

        var visionScreening = new VisionScreening();

        domReady(function () {
            console.log('%ctrace: App -> constructor -> domReady', 'color: #ccc');

            /* call when all routes init end */
            Backbone.history.start({pushState: false});
        });
    }

    return App;
});