'use strict';

var $ = global.jQuery = global.$ = require('jquery');
require('bootstrap/dist/js/bootstrap');
require('../../lib/jquery.visible');

$(function() {

  var images = $('.cd-fixed-bg');

  function updateLink() {
    var done = false;
    images.each(function(index) {
      if (!done && $(this).visible(true) && (index+1 < images.length)) {
        done = true;
        var image = images[index+1];
        var id = $(image).attr('id');
        $('.next-image').attr('href', '#'+id);
      }
    });
  }

  updateLink();
  $(document).on('scroll', updateLink);

  $('a[href*=#]:not([href=#]).next-image').click(function() {
    if ($(images[images.length-1]).visible()) return false;

    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 2500, updateLink);
        return false;
      }
    }
  });
});