/**
 * source:
 *  http://www.prokerala.com/health/eye-care/eye-test/astigmatism-test.php
* */

 define('astigmatism-vision', [
    'domReady',
    'underscore'
],  function (domReady, _) {
    'use strict';

    console.log('%cfile: astigmatism-vision.js', 'color: #C2ECFF');

    /** private */
    var _this,
        _defaults = {
            reload: true,
            name: 'astigmatism-vision',
            messages: {}
        };

    /** constructor */
    function Module(options){
        console.log('%ctrace: Astigmatism-vision -> constructor', 'color: #ccc');

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
       console.log('%ctrace: Astigmatism-vision -> initialize', 'color: #ccc');

       var steps = 3,
           step = 0,
           success = 0,
           values = ['right', 'left'],
           rightValues = ['left', 'left', 'left'],
           value = '';

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
           var codes = [39, 37];
           var index = codes.indexOf(e.which);

           if(index >= 0){
               e.preventDefault();
               check(values[index]);
           }
       });

       function update(){
           value = rightValues[step];

           _this.options.$elements.testIteration.html(step + 1);
           _this.options.$elements.testLength.html(steps);

           _this.options.$elements.test.removeClass('hide');
           _this.options.$elements.result.addClass('hide');
           _this.options.$elements.result.find('.success, .warn').addClass('hide');

           _this.options.$elements.resultMessage.html('');
           _this.options.$elements.resultMessage.removeClass('success');
           _this.options.$elements.resultMessage.removeClass('warning');

           _this.options.$elements.navItem.filter('.active').removeClass('success');
           _this.options.$elements.navItem.filter('.active').removeClass('warning');

           _this.options.$elements.stage.find('.astigmatism-vision-1, .astigmatism-vision-2, .astigmatism-vision-3').addClass('hide');
           _this.options.$elements.stage.find('.astigmatism-vision-' + parseInt(step + 1)).removeClass('hide');

           _this.options.$elements.symbol.removeClass();
           _this.options.$elements.symbol.addClass('astigmatism-' + parseInt(step + 1));
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

            if(success == steps){
                _this.options.$elements.resultMessage.addClass('success').html(_this.options.messages['success']);
                _this.options.$elements.navItem.filter('.active').addClass('success');
            }else{
                _this.options.$elements.resultMessage.addClass('warning').html(_this.options.messages['warning']);
                _this.options.$elements.navItem.filter('.active').addClass('warning');
            }

           _this.options.$elements.resultStatus.filter('[data-vision-screening-test-result-status="' + _this.options.name + '"]').html(success);

           _defaults.reload = false;

           console.log('test end,', 'success', success);
       }

       function destroy(){
           _this.options.$elements.body.off('click', _this.options.elements.controls);
           _this.options.$elements.body.off('keydown');
       }
    };

    return Module;
});