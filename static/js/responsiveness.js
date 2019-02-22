(function($, document, window, viewport){

  CMNH.responsiveImageCheck = function(){
    // this checks to see if we've crossed the boundary between $xs and $sm breakpoints
    // (mobile and smallest desktop) and if so, loads any new images we might need
    // by renaming the data-xsrc attribute to data-src and triggering cloudinary

    // desktop
    var container = $('.desktop-container');
    if ($(container).css('display') == 'block') {
        $(container).find('[data-xsrc]').each(function(){
            $(this).attr({'data-src': $(this).attr('data-xsrc')}).removeAttr('data-xsrc');
            // console.log(this);
        });
    }

    // mobile
    container = $('.mobile-container');
    if ($(container).css('display') == 'block') {
      $(container).find('[data-xsrc]').each(function(){
          $(this).attr({'data-src': $(this).attr('data-xsrc')}).removeAttr('data-xsrc');
          // console.log(this);
      });
    }

    setTimeout(function(){
      $.cloudinary.responsive();
      // console.log('responsivizing!');
    }, 150);
  }


  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
  };

  CMNH.onResize = debounce(function() {

    // resize the video container
    viewport.changed(function() {
      CMNH.responsiveImageCheck();

      CMNH.oldBreakpoint = CMNH.currentBreakpoint;
      CMNH.currentBreakpoint = viewport.current();

      // we're going from mobile to desktop
      if (CMNH.oldBreakpoint == 'xs' && CMNH.page == 'kids') {
        // clear the history deeplink
        if (CMNH.selectedKidDesktop != -1) {
          History.replaceState('', '', '../kids/' + CMNH.selectedKidDesktop);
        } else {
          History.replaceState('', '', '../');
        }
      }

      // we're going from desktop to mobile
      if (CMNH.currentBreakpoint == 'xs' && CMNH.page == 'kids')
      {
        History.replaceState('', '', '../kids/' + CMNH.selectedKidMobile);
      }

      // console.log('current breakpoint: ' + CMNH.currentBreakpoint);
      var elem = ((CMNH.currentBreakpoint == 'xs') ? $('.hero-image.mobile') : $('.hero-image.desktop'));
       // adjust the hero panel wrapper height
       var heroHeight, kidHeight;
       switch (CMNH.currentBreakpoint) {
          case 'lg':
            heroHeight = '487px';
            kidHeight = '251px';
            break;
          case 'md':
            heroHeight = '404px';
            kidHeight = '208px';
            break;
          case 'sm':
            heroHeight = '312px';
            kidHeight = '161px';
            break;
          default:
            break;
       }

       if (CMNH.videoPlayers) {
        var isMobile = /(iPad|iPhone|iPod|Android)/g.test(navigator.userAgent);
            if ( CMNH.currentBreakpoint == 'xs') {
            // pause large player
            if (CMNH.videoPlayers.large && CMNH.videoPlayers.large.ready) {
              CMNH.videoPlayers.large.pauseVideo();
            }
         } else {
            // pause small player
          if (CMNH.videoPlayers.small && CMNH.videoPlayers.small.ready) {
              CMNH.videoPlayers.small.pauseVideo();
            }
         }
       }

       $('.hero-panel-wrapper').css('height', heroHeight);
       
     // page-specific stuff
      // if (CMNH.page == 'index') {
      //   $('.bluebox').height(kidHeight);      
      // }

      //   if (CMNH.page == 'kids') {
      //     // 
      //   }

    });
  }, 250);

  // bind it to the resize event
  $(window).resize(CMNH.onResize);

})(jQuery, document, window, ResponsiveBootstrapToolkit);

