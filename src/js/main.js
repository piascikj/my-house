'use strict';

var $ = global.jQuery = global.$ = require('jquery');
require('bootstrap/dist/js/bootstrap');
require('../../lib/jquery.visible');
var Keen = require('keen.io');
var cookie = require('cookie-cutter');
var crypto = require('crypto');

var client;
if (process.env.NODE_ENV === "production") {
  client = Keen.configure({
      projectId: "5474b4af36bca436e62dcf85",
      writeKey: "9dd078a24fd66b4730dbee3d446ccea556b5cdcb795a45f8727657d6bcf78b0540ae84aade8f4d8687ae3ad0d0d99ff1e9ecbbaae60296e1e3836f309d44e49436e502a5cd967dd9318ebbae2cdf8abf2b2400b82e6dd67696fd3a31e65e7e056b6f2408818d2a299fc63ce2f9ec516b"
  });
} else {
  client = Keen.configure({
      projectId: "5474d50136bca436e5042198",
      writeKey: "7fd6e6970ef9c05602b7005900c4f4324747e1d29bf456fd692af5632441d5f63ee0bbf5ad7f9188478150a88a4cd4950de902091e1276b6ebeb9ae556a76978722dfd784608bb9bb2b0b1fffbbda5f72105ac77c41cbc22fd19c7d47db67f8e8a5229e958fb9a5bffe9a0ac4b3a5ff8"
  });
}

$(function() {

  var visit_id = crypto.randomBytes(20).toString('hex');

  function addEvent(evt, data, cb) {
    data.session = getSessionId();
    data.host = location.hostname;
    data.visit_id = visit_id;
    data.event = evt;

    cb = cb || function(err, res) {
        if (err) {
            console.log("Oh no, an error!");
        } else {
            console.log("Hooray, it worked!");
        }
    };
    
    client.addEvent("web", data, cb);
  }

  function addClickEvent(el, cb) {
    addEvent("click", {el:el}, cb);
  }

  var session_key = 'my-house-session';

  function getSessionId() {
    return cookie.get(session_key);
  }

  if (!getSessionId()) {
    var id = crypto.randomBytes(20).toString('hex');
    cookie.set(session_key, id, {expires:2147483647});
      $.get("http://ipinfo.io", function(response) {
        addEvent('new-visitor', {referrer:document.referrer, ipinfo: response});
      }, "jsonp");
  } else {
    addEvent('return-visit', {referrer:document.referrer});
  }

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

  updateLink();
  var subject = encodeURIComponent("4476 Plank Rd. Highland, WI");
  var body = encodeURIComponent("I saw this property on the my-house site.");
  var mailto = 'mailto:nicole@nicolecharles.com?' +
               'subject=' + subject +
               '&body=' + body +
               '&cc=' + 'myhouse@piascik.net';

  $('.contact').attr('href', mailto);
  
  $(document).on('scroll', updateLink);

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

  // Pic scrolling
  $('.next-image').click(function() {
    if ($(images[images.length-1]).visible()) return false;
    addClickEvent('next-image');
    return scroll.call(this);
  });

  $('.prev-image').click(function() {
    if ($(images[0]).visible()) return false;
    addClickEvent('prev-image');
    return scroll.call(this);
  });

  function openMenu(sel) {
    addClickEvent(sel);
    var $menu = $(sel);
    $('.nav-menu-open:not(' + sel + ')').removeClass('nav-menu-open');
    $menu.toggleClass('nav-menu-open');
  }

  function hideAllMenus() {
    $('.nav-menu-open').removeClass('nav-menu-open');
  }

  // Pics menu
  $('.cd-fixed-bg').each(function() {
    var id = $(this).attr('id');
    var link = $('<a/>').attr('href', '#' + id).text(id.replace('-',' '));
    $('.pics-menu').append(link);
  });

  $('.navigate').click(function() {
    openMenu('.pics-menu');
    return false;
  });

  $('.pics-menu').on('click', 'a', function(evt) {
    addClickEvent($(evt.target).attr('href'));
    hideAllMenus();
  });

  $('.contact').click(function() {
    addClickEvent('contact');
  });

  // Share menu
  $('.share-menu-normal a').each(function() {
    $(".share-menu-small").append($(this).clone());
  });

  $('.share').click(function() {
    openMenu('.share-menu-small');
    return false;
  });

  $('.share-menu-small').on('click', 'a', function(evt) {
    $('.share-menu-small').removeClass('nav-menu-open');
  });

  // Share buttons
  $('.pin').attr('href','//www.pinterest.com/pin/create/link/?' +
                        'url=' + location.origin + location.pathname + '&' +
                        'media=' + location.origin + location.pathname + 'images/house01.jpg' + '&' +
                        'description=36 acre farm for sale in south-west WI');

  $('.tweet').attr('href', '//twitter.com/share?' +
                           'url=' + location.origin + location.pathname + '&' +
                           'text=Look at this beautiful country home in SW Wisconsin&' +
                           'via=my_house_story');

  $('.fb').attr('href', 'https://www.facebook.com/sharer/sharer.php?' +
                        'u=' + location.origin + location.pathname);

  $('.popup').click(function(event) {
    addClickEvent(this.className);
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    console.log(url);
    console.log(opts);
    window.open(url, 'social', opts);
 
    return false;
  });
});