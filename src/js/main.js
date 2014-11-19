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
        var nextImage = images[index+1];
        var nextId = $(nextImage).attr('id');
        $('.next-image').attr('href', '#'+nextId);
        
        if (index > 0) {
          var image = images[index-1];
          var id = $(image).attr('id');
          $('.prev-image').attr('href', '#'+id);
        } 
      }
    });
  }

  function scroll() {
    var hash = this.hash;
    var target = $(hash);
    $('html,body').animate({
      scrollTop: target.offset().top
    }, 2000, function() {
      location.hash = hash;
    });
    return false;
  }

  updateLink();
  
  $(document).on('scroll', updateLink);



  $('.next-image').click(function() {
    if ($(images[images.length-1]).visible()) return false;
    return scroll.call(this);
  });

  $('.prev-image').click(function() {
    if ($(images[0]).visible()) return false;
    return scroll.call(this);
  });

  $('.navigate').click(function() {
    $('.nav-menu-right').toggleClass('nav-menu-open');
    return false;
  });

  $('.nav-menu-right').on('click', 'a', scroll);

  $('.cd-fixed-bg').each(function() {
    var id = $(this).attr('id');
    var link = $('<a/>').attr('href', '#' + id).text(id);
    $('.nav-menu-right').append(link);
  });

  $('.pin').attr('href','//www.pinterest.com/pin/create/link/?' +
                        'url=' + location.origin + '&' +
                        'media=' + location.origin + '/images/house01.jpg' + '&' +
                        'description=36 acre farm for sale in south-west WI');
});