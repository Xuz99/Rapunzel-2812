//Once page is loaded run scroll function.
$(window).load(function() {
  var $elem = $('body');

    //Play (Auto-scroll)
    $('.nav_down').click(
  		  function (e) {

        // Prevent flicker on button click
           e.preventDefault();

        // Scroll to bottom (with default Easing - slow start)
        // $('html, body').animate({scrollTop: $('#auto').offset().top}, 160000);

        // Scroll to bottom (linear - same speed all the way)
           $('html, body').animate({scrollTop: $('#auto').offset().top}, {duration: 500000,easing: 'linear'});
  		}
  	);

    //Pause
    $('.nav_stop').click(
    		function (e) {
    			$('html, body').stop();
    		}
    	);
    //Restart (Back to top)
    $('.nav_up').click(
    		function (e) {

          // Prevent flicker on button click
           e.preventDefault();

    			$('html, body').animate({scrollTop: '0px'}, 1600);
    		}
    	);

   });
// End of js nav scroll function




$('.chapter-scroll').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
}); 
   
