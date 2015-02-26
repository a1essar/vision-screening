/**
 * source:
 *  http://www.oculus.de/ru/sites/detail_ger.php?page=497
 *  http://unlimitedmemory.tripod.com/sitebuildercontent/sitebuilderfiles/ishihara38.pdf
 *  http://white.stanford.edu/newlm/images/0/0a/Ishihara.14.Plate.Instructions.pdf
 *  http://www.richmondproducts.com/files/3113/1550/1433/5566_Ishihara_38_Plate_Instructions_and_score_sheet_071410.pdf
* */

 define('distance-vision', [
    'domReady',
    'underscore'
],  function (domReady, _) {
    'use strict';

    console.log('%cfile: distance-vision.js', 'color: #C2ECFF');

    /** private */
    var _this,
        _defaults = {
            reload: true,
            name: 'distance-vision',
            messages: {}
        };

    /** constructor */
    function Module(options){
        console.log('%ctrace: Distance-vision -> constructor', 'color: #ccc');

        /** public */
        this.options = $.extend({
        }, _defaults, options);

        _this = this;

        var messages = _this.options.$elements.result.attr('data-vision-screening-test-result');

        if(messages){
            _this.options.messages = JSON.parse(messages);
        }

        if(this.options.reload){
            initialize();
        }
    }

   var initialize = function (){
       console.log('%ctrace: Distance-vision -> initialize', 'color: #ccc');

       var steps = 1,
           step = 0,
           success = 0,
           values = ['up', 'right', 'left'],
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
           var codes = [38, 39, 37];
           var index = codes.indexOf(e.which);

           if(index >= 0){
               e.preventDefault();
               check(values[index]);
           }
       });

       function update(){
           _this.options.$elements.test.removeClass('hide');
           _this.options.$elements.result.addClass('hide');
           _this.options.$elements.result.find('.up, .left, .right').addClass('hide');

           _this.options.$elements.resultMessage.html('');
           _this.options.$elements.resultMessage.removeClass('success');
           _this.options.$elements.resultMessage.removeClass('warning');

           _this.options.$elements.navItem.filter('.active').removeClass('success');
           _this.options.$elements.navItem.filter('.active').removeClass('warning');
       }

       function check(action){
           console.log('user: ', action, 'true: ', value);

           value = action;

           result();
           destroy();

           return false;
       }

       function result(){
           _this.options.$elements.test.addClass('hide');
           _this.options.$elements.result.removeClass('hide');
           _this.options.$elements.result.find('.' + value).removeClass('hide');

           var r;
           if(value == 'up'){
               r = 'success';
           }else{
               r = 'warning';
           }

           _this.options.$elements.resultMessage.addClass(r).html(_this.options.messages[value]);
           _this.options.$elements.navItem.filter('.active').addClass(r);

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