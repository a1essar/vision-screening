/**
 * source:
 *  http://www.oculus.de/ru/sites/detail_ger.php?page=497
 *  http://unlimitedmemory.tripod.com/sitebuildercontent/sitebuilderfiles/ishihara38.pdf
 *  http://white.stanford.edu/newlm/images/0/0a/Ishihara.14.Plate.Instructions.pdf
 *  http://www.richmondproducts.com/files/3113/1550/1433/5566_Ishihara_38_Plate_Instructions_and_score_sheet_071410.pdf
* */

 define('colour-vision', [
    'domReady',
    'underscore'
],  function (domReady, _) {
    'use strict';

    console.log('%cfile: colour-vision.js', 'color: #C2ECFF');

    /** private */
    var _this,
        _defaults = {
            reload: true,
            name: 'colour-vision',
            messages: {}
        };

    /** constructor */
    function Module(options){
        console.log('%ctrace: Colour-vision -> constructor', 'color: #ccc');

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

       var steps = 14,
           step = 0,
           success = 0,
           values = ['up', 'right', 'down', 'left'],
           value = '',
           rightValues = ['up', 'left', 'right', 'up', 'down', 'up', 'left', 'up', 'right', 'down', 'left', 'up', 'right', 'down'],
           allValues = {
               0: {
                   'up': 12,
                   'right' : 'x',
                   'down': 2,
                   'left': 1
               },
               1: {
                   'up': 3,
                   'right' : 'x',
                   'down': 6,
                   'left': 8
               },
               2: {
                   'up': 3,
                   'right' : 5,
                   'down': 'x',
                   'left': 2
               },
               3: {
                   'up': 29,
                   'right' : 70,
                   'down': 'x',
                   'left': 28
               },
               4: {
                   'up': 21,
                   'right' : 'x',
                   'down': 74,
                   'left': 31
               },
               5: {
                   'up': 7,
                   'right' : 'x',
                   'down': 5,
                   'left': 1
               },
               6: {
                   'up': 48,
                   'right' : 46,
                   'down': 'x',
                   'left': 45
               },
               7: {
                   'up': 2,
                   'right' : 5,
                   'down': 7,
                   'left': 'x'
               },
               8: {
                   'up': 2,
                   'right' : 'x',
                   'down': 7,
                   'left': 1
               },
               9: {
                   'up': 'x',
                   'right' : 76,
                   'down': 16,
                   'left': 18
               },
               10: {
                   'up': 'x',
                   'right' : 2,
                   'down': 7,
                   'left': 'xx'
               },
               11: {
                   'up': 35,
                   'right' : 5,
                   'down': 'x',
                   'left': 3
               },
               12: {
                   'up': 6,
                   'right' : 96,
                   'down': 9,
                   'left': 'x'
               },
               13: {
                   'up': 'x',
                   'right' : 88,
                   'down': 'xx',
                   'left': 8
               }
           }
           ;

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
           value = rightValues[step];

           _this.options.$elements.test.removeClass('hide');
           _this.options.$elements.result.addClass('hide');
           _this.options.$elements.resultValue.html('');

           _this.options.$elements.resultMessage.html('');
           _this.options.$elements.resultMessage.removeClass('success');
           _this.options.$elements.resultMessage.removeClass('warning');

           _this.options.$elements.navItem.filter('.active').removeClass('success');
           _this.options.$elements.navItem.filter('.active').removeClass('warning');

           _this.options.$elements.testIteration.html(step + 1);
           _this.options.$elements.testLength.html(steps);

           _this.options.$elements.controls.filter('[data-vision-screening-controls="up"]').html(allValues[step]['up']);
           _this.options.$elements.controls.filter('[data-vision-screening-controls="right"]').html(allValues[step]['right']);
           _this.options.$elements.controls.filter('[data-vision-screening-controls="down"]').html(allValues[step]['down']);
           _this.options.$elements.controls.filter('[data-vision-screening-controls="left"]').html(allValues[step]['left']);

           _this.options.$elements.symbol.removeClass();
           _this.options.$elements.symbol.addClass('ishihara ishihara-' + parseInt(step + 1));
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
    };

    return Module;
});