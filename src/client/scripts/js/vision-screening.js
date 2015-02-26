define('vision-screening', [
    'domReady',
    'underscore',
    'backbone',
    'visual-acuity',
    'contrast-vision',
    'colour-vision',
    'distance-vision',
    'astigmatism-vision'
],  function (domReady, _, Backbone, VisualAcuity, ContrastVision, ColourVision, DistanceVision, AstigmatismVision) {
    'use strict';

    /* todo: nav status, Amsler test */

    console.log('%cfile: vision-screening.js', 'color: #C2ECFF');

    /** private */
    var _this = {},
        _defaults = {
            elements: {
                main: '[data-vision-screening]',
                stage: '[data-vision-screening-stage]',
                activeStage: '[data-vision-screening-stage].active',
                reload: '[data-vision-screening-stage].active [data-vision-screening-reload]',
                controls: '[data-vision-screening-stage].active [data-vision-screening-controls]',
                test: '[data-vision-screening-stage].active [data-vision-screening-test]',
                canvas: '[data-vision-screening-stage].active [data-vision-screening-test-canvas]',
                symbol: '[data-vision-screening-stage].active [data-vision-screening-test-canvas-symbol]',
                testIteration: '[data-vision-screening-stage].active [data-vision-screening-test-iteration]',
                testLength: '[data-vision-screening-stage].active [data-vision-screening-test-length]',
                result: '[data-vision-screening-stage].active [data-vision-screening-test-result]',
                resultValue: '[data-vision-screening-stage].active [data-vision-screening-test-result-value]',
                nav: '[data-vision-screening-nav]',
                navItem: '[data-vision-screening-nav-item]'
            },
            $elements: {},
            routes: {
                'page/:page': 'page',
                "*actions" : "page"
            }
        };

    /** constructor */
    function Module(){
        console.log('%ctrace: Vision-screening -> constructor', 'color: #ccc');

        /** public */
        _this = this;

        var router = Backbone.Router.extend({
            routes: _defaults.routes
        });

        router = new router;

        domReady(function () {
            console.log('%ctrace: Vision-screening -> constructor -> domReady', 'color: #ccc');

            domElementsUpdates();

            _defaults.$elements.body = $('body');

            _this.domReady = true;

            router.on('route:page', _this.controller);

            _defaults.$elements.body.off('click', '[data-vision-screening-reload]').on('click', '[data-vision-screening-reload]', function(e){
                console.log('%ctrace: Vision-screening -> reload', 'color: #ccc');

                e.preventDefault();

                _defaults.reload = true;
                _this.controller(_defaults.$elements.activeStage.attr('data-vision-screening-stage'));
            });
        });
    }

    function domElementsUpdates(){
        console.log('%ctrace: Vision-screening -> domElementsUpdates', 'color: #ccc');

        _.forEach(_defaults.elements, function(value, key){
            _defaults.$elements[key] = $(value);
        });
    }

    var controller = function(page){
        console.log('%ctrace: Vision-screening -> page', 'color: #ccc');

        var page = page || 'start';

        var $active = _defaults.$elements.stage.filter('.active');
        var $next = _defaults.$elements.stage.filter('[data-vision-screening-stage = "' + page + '"]');

        _defaults.$elements.navItem.removeClass('active');
        _defaults.$elements.navItem.filter('[data-vision-screening-nav-item="' + page + '"]').addClass('active');

        if($next.length <= 0){
            return false;
        }

        $active.removeClass('active');
        $next.addClass('active');

        if(typeof _this[page] !== 'function'){
            return false;
        }

        if(!_this.domReady){
            console.log('%ctrace: dom not ready', 'color: #ccc');

            return false;
        }

        domElementsUpdates();

        _this[page]();

        if(_defaults.reload){
            delete _defaults.reload;
        }

        return true;
    };

    Module.prototype = {
        'controller': controller,
        'visual-acuity': function(){
            new VisualAcuity(_defaults);
        },
        'contrast-vision': function(){
            new ContrastVision(_defaults);
        },
        'colour-vision': function(){
            new ColourVision(_defaults);
        },
        'distance-vision': function(){
            new DistanceVision(_defaults);
        },
        'astigmatism-vision': function(){
            new AstigmatismVision(_defaults);
        }
    };

    return Module;
});