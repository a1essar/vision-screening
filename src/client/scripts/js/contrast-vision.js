define('contrast-vision', [
    'domReady',
    'underscore'
],  function (domReady, _) {
    'use strict';

    console.log('%cfile: contrast-vision.js', 'color: #C2ECFF');

    /** private */
    var _this,
        _defaults = {
            reload: true,
            name: 'contrast-vision',
            messages: {}
        };

    /** constructor */
    function Module(options){
        console.log('%ctrace: Contrast-vision -> constructor', 'color: #ccc');

        /** public */
        this.options = $.extend({
        }, _defaults, options);

        _this = this;

        var messages = _this.options.$elements.result.attr('data-vision-screening-test-result');

        if(messages){
            _this.options.messages = JSON.parse(messages);
        }

        if(this.options.reload){
            _defaults.reload = true;
            initialize();
        }
    }

   var initialize = function (){
       console.log('%ctrace: Contrast-vision -> initialize', 'color: #ccc');

       var steps = 18,
           step = 0,
           segment = 3,
           success = 0,
           values = ['up', 'right', 'down', 'left'],
           value = '',
           opacity = [1, 0.5, 0.25, 0.125, 0.05, 0.025];

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

           _this.options.$elements.resultMessage.html('');
           _this.options.$elements.resultMessage.removeClass('success');
           _this.options.$elements.resultMessage.removeClass('warning');

           _this.options.$elements.navItem.filter('.active').removeClass('success');
           _this.options.$elements.navItem.filter('.active').removeClass('warning');

           _this.options.$elements.symbol.removeClass('up right down left');
           _this.options.$elements.symbol.addClass(value);

           _this.options.$elements.testIteration.html(step + 1);
           _this.options.$elements.testLength.html(steps);

           var opacityValue = Math.ceil((step + 1)/segment) - 1;
           _this.options.$elements.symbol.css('opacity', opacity[opacityValue]);
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
           var r = Math.round(success/(steps) * 100);

           _this.options.$elements.test.addClass('hide');
           _this.options.$elements.result.removeClass('hide');
           _this.options.$elements.resultValue.html(r);

           if(r == 100){
               _this.options.$elements.resultMessage.addClass('success').html(_this.options.messages['success']);
               _this.options.$elements.navItem.filter('.active').addClass('success');
           }else{
               _this.options.$elements.resultMessage.addClass('warning').html(_this.options.messages['warning']);
               _this.options.$elements.navItem.filter('.active').addClass('warning');
           }

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