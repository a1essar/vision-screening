define('visual-acuity', [
    'domReady',
    'underscore'
],  function (domReady, _) {
    'use strict';

    console.log('%cfile: visual-acuity.js', 'color: #C2ECFF');

    /** private */
    var _this,
        _defaults = {
            reload: true
        };

    /** constructor */
    function Module(options){
        console.log('%ctrace: Visual-acuity -> constructor', 'color: #ccc');

        /** public */
        this.options = $.extend({
        }, _defaults, options);

        _this = this;

        if(this.options.reload){
            initialize();
        }
    }

   var initialize = function (){
       console.log('%ctrace: Visual-acuity -> initialize', 'color: #ccc');

       var steps = 18,
           step = 0,
           segment = 3,
           success = 0,
           values = ['up', 'right', 'down', 'left'],
           value = '',
           scale = [1, 0.8, 0.6, 0.4, 0.3, 0.25],
           width = 100,
           height = 100;

       update();

       _this.options.$elements.body.off('click', _this.options.elements.controls).on('click', _this.options.elements.controls, function(e){
           e.preventDefault();

           var action = $(e.currentTarget).attr('data-vision-screening-controls');
           var index = values.indexOf(action);

           if(index >= 0){
               check(action);
           }
       });

       _this.options.$elements.body.off('keydown').on('keydown', function(e){
           var codes = [38, 39, 40, 37];
           var index = codes.indexOf(e.which);

           if(index >= 0){
               e.preventDefault();
               check(values[index]);
           }
       });

       function update(){
           value = getRandomValue();

           _this.options.$elements.test.removeClass('hide');
           _this.options.$elements.result.addClass('hide');
           _this.options.$elements.resultValue.html('');

           _this.options.$elements.symbol.removeClass('up right down left');
           _this.options.$elements.symbol.addClass(value);

           _this.options.$elements.testIteration.html(step + 1);
           _this.options.$elements.testLength.html(steps);

           var scaleValue = Math.ceil((step + 1)/segment) - 1;

           var w = width * scale[scaleValue];
           var h = height * scale[scaleValue];
           _this.options.$elements.symbol.css('width', w + '%').css('height', h + '%');
       }

       function check(action){
           console.log('user: ', action, 'true: ', value);

           if(action == value){
               success++;
           }

           if(step + 1 >= steps){
               result();
               destroy();

               return false;
           }

           step++;

           update();
       }

       function result(){
           _this.options.$elements.test.addClass('hide');
           _this.options.$elements.result.removeClass('hide');
           _this.options.$elements.resultValue.html(Math.round(success/(steps) * 100));

           _defaults.reload = false;

           console.log('test end,', 'success', success);
       }

       function destroy(){
           _this.options.$elements.body.off('click', _this.options.elements.controls);
           _this.options.$elements.body.off('keydown');
       }

       function getRandomValue() {
           var vals = _.without(values, value);
           var index = Math.floor(Math.random() * vals.length);

           return vals[index];
       }
    };

    return Module;
});