/**
 * Main JS
 */

(function ($) {

	"use strict";

	function specialFloor( number ){
		var fraction = 100;
		return Math.floor(number * fraction) / fraction;
	}

	function getScrollbarPosition(){
		var scrollbarPos;
		var pageHeaderHeight = 1 * $('header#site-head').outerHeight();

		scrollbarPos = 1 * $(window).scrollTop();
		scrollbarPos = scrollbarPos + pageHeaderHeight;
		// 0.38 = golden ratio
		scrollbarPos = scrollbarPos + ($(window).height() * 0.38);
		return specialFloor( scrollbarPos );
	}
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Header
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Fix WP admin bar

	// $(window).load(function(){
	// 	if ( $('body').hasClass('admin-bar') ) {
	// 		$('html').attr('style', 'margin-top: 0 !important');
	// 	}
	// });

	// Simulates click, mainly to trigger CSS animations

	$('.menu_button').click(function(){
		$('.menu').toggleClass('active');
	});

	// Header - Vertical Centering

	$(window).resize(function(){

		$('.headline').each(function(){
			$(this).css('font-size',  specialFloor($('.content').width()*0.087/10)+'rem');
			$(this).css('line-height',specialFloor($('.content').width()*0.087/10)+'rem');
		});

		if( ( $('.jqres').width() <= 900 ) ){
			$('.chapter-title, .menu-title').removeAttr('style');
			return;
		}
		
		// Header Height Calculation

		var pageHeaderHeight = $('#site-head').outerHeight();
		$('.header-left, .header-right').css('height', specialFloor( pageHeaderHeight ) );

		// First chapter Padding

		$('.chapter-title').each(function(){
			$(this).css('font-size',  specialFloor($('.content').width()*0.1/10)+'rem');
			$(this).css('line-height',specialFloor($('.content').width()*0.1/10)+'rem');
		});

		// Menu Title font size

		$('.menu-title').each(function(){
			$(this).css('font-size',  specialFloor($('.content').width()*0.087/10)+'rem');
			$(this).css('line-height',specialFloor($('.content').width()*0.087/10)+'rem');
		});
	}).resize();

	// Menu highlight active chapter

	/*
	$(window).scroll( function(){
		var index = findActualchapterIndex();
		//document.title = index;

		$('.menu li').removeClass('active-item');
		$('.menu li:eq(' + index + ')').addClass('active-item');
	});
*/

	// Pagination cloning for menu

	//$('.pagination').clone().appendTo('.menu');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Left part of page 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// chapter Title Manipulation - Re-sizing and centering

	if( 1 < $('.chapter').size() ) {
		$(window).scroll(function(){

			if( ( $('.jqres').width() <= 900 ) ){
				$('.chapter, .chapter-title-wrapper, .chapter-title').removeAttr('style');
				return;
			}

			var bgHeight = specialFloor( $('#site-bg-image').height() );
			var chapteroFade = 0;
			$('.chapter-title').each(function(){
				var this_chapteroFade = specialFloor( $(this).outerHeight() + ($('.content').width()*0.2) );
				if ( this_chapteroFade > chapteroFade ) {
					chapteroFade = this_chapteroFade;
				}
			});

			//document.title = chapteroFade;
			$('.chapter-title').each(function(){

				// SETTINGS FOR FADING ETC.

				var minchapterOpacity = 0.2;

				// END SETTINGS	

				var titleHeight = specialFloor( $(this).outerHeight() );
				var pageHeaderHeight = specialFloor( $('header#site-head').outerHeight() );
				
				var offset = $(this).parents('.chapter:first, .page:first').offset();
				
				var titleWrapper = $(this).parent();
				//console.log(offset);
				var offset_top = specialFloor( offset.top );
				var offset_bottom = specialFloor( 1 * offset.top + 1 * $(this).parents('.chapter:first, .page:first').outerHeight() );
				offset_bottom = specialFloor( offset_bottom + 1 * parseInt($('.chapter:first, .page:first').css('marginBottom'), 10) );

				var scrollbarPos = specialFloor( getScrollbarPosition() );

				var _marginTop = specialFloor( pageHeaderHeight - 0.5 * titleHeight );

				if ( ( offset_top + chapteroFade <= scrollbarPos ) && ( scrollbarPos + chapteroFade < offset_bottom ) ) {
					titleWrapper.css('opacity', 1);
					//document.title = chapteroFade;
					titleWrapper.css('visibility', 'visible');
					$(this).parents('.chapter:first, .page:first').css('opacity', 1);
				} else if ( ( offset_top - chapteroFade <= scrollbarPos ) && ( scrollbarPos - chapteroFade < offset_bottom ) ) {
					var _fraction = 0.5;

					if( 1 * offset_bottom <= 1 * scrollbarPos ){
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*offset_bottom - 1*scrollbarPos ) / chapteroFade ) );
						_marginTop = specialFloor( _marginTop - (1-_fraction) * chapteroFade );
						//document.title = document.title + '|A' + _fraction;
					}else if( 1 * offset_bottom - chapteroFade <= 1 * scrollbarPos ){
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*offset_bottom - 1*scrollbarPos ) / chapteroFade ) );
						_marginTop = specialFloor( _marginTop - (1-_fraction) * chapteroFade );
						//document.title = document.title + '|B' + _fraction;
					}else if( 1 * offset_top <= 1 * scrollbarPos ){
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*scrollbarPos - 1*offset_top ) / chapteroFade ) );
						_marginTop = specialFloor( _marginTop + (1-_fraction) * chapteroFade );
						//document.title = document.title + '|C' + _fraction;
					}else{
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*scrollbarPos - 1*offset_top ) / chapteroFade ) );
						_marginTop = specialFloor( _marginTop + (1-_fraction) * chapteroFade );
						//document.title = document.title + '|D' + _fraction;
					}

					titleWrapper.css('opacity', _fraction );
					titleWrapper.css('visibility', 'visible');
					$(this).parents('.chapter:first, .page:first').css('opacity', specialFloor( minchapterOpacity + (1-minchapterOpacity)*_fraction ) );
				} else {
					titleWrapper.css('opacity', 0);
					titleWrapper.css('visibility', 'hidden');
					$(this).parents('.chapter:first, .page:first').css('opacity', minchapterOpacity);
				}
								
				$(this).parent().css('marginTop', _marginTop);
			});
		}).scroll();
	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Footer navigation - prev / next
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function findActualchapterIndex(){
		var actualchapterIndex = -1;

		$('.chapter').each(function( index ){
			$(this).find('p').css('border','10 px solid Red');

			var offset = $(this).offset();
			var offset_top = 1 * offset.top;
			var offset_bottom = 1 * offset.top + 1 * $(this).outerHeight();
			offset_bottom = 1 * offset_bottom + 1 * parseInt($('.chapter:first, .page:first').css('marginBottom'), 10);

			var scrollbarPos = getScrollbarPosition();

			if ( ( offset_top <= scrollbarPos ) && ( scrollbarPos < offset_bottom ) ) {
				actualchapterIndex = index;
			}
		});
		return actualchapterIndex;
	}

	function getchapterScrollPosition( chapterIndex){
		var chapterToScroll;
		var pageHeaderHeight;
		var where;

		chapterToScroll = $('.chapter:eq(' + chapterIndex + ')');
		pageHeaderHeight = 1 * $('header#site-head').outerHeight();
		where = $(chapterToScroll).offset();
		where = where.top;
		where = where - pageHeaderHeight;
		return where;
	}

	function scrollToPosition( position ){
		jQuery('html, body').stop().animate({
			'scrollTop': position
		}, 618, 'swing' );
	}

	if( 0 < $('.prev-chapter,.next-chapter').size() ){

		///////////////////////
		// Go Down

	
		$('.next-chapter').click(function(){
			var moveTochapterIndex;
			moveTochapterIndex = findActualchapterIndex() + 1;
			if( moveTochapterIndex < $('.chapter').size() ){
				var newPos = getchapterScrollPosition( moveTochapterIndex );
				scrollToPosition( newPos );
			}else{
				scrollToPosition( $('.content').height() );
			}
		});

		$(document).keydown(function(e){
	
			if( ( $('.jqres').width() <= 900 ) ) ;
	
			if( 34 == e.keyCode ){
				// Page Down
				$('.next-chapter').click();
				return false;
			}
		});

		$('.next-chapter').mouseover(function(){
			var actualchapterIndex = findActualchapterIndex() + 1;
			var others;
			
			others = $('.cat-nav-left .cat-nav-chapter').not('.cat-nav-left .cat-nav-chapter:eq(' + actualchapterIndex + ')' );
			others.removeClass('come-from-bottom');
			others.removeClass('come-from-top');
			$('.cat-nav-left .cat-nav-chapter:eq(' + actualchapterIndex + ')').addClass('come-from-bottom');
		});

		$('.next-chapter').mouseout(function(){
			$('.cat-nav-chapter').removeClass('come-from-bottom');
			$('.cat-nav-chapter').removeClass('come-from-top');
		});

		///////////////////////
		// Go Up

		$('.prev-chapter').click(function(){
			var moveTochapterIndex;
			var newPos;

			moveTochapterIndex = findActualchapterIndex() - 1;
			if( moveTochapterIndex >= 0 ){
				if( getchapterScrollPosition( moveTochapterIndex + 1 ) <= $(window).scrollTop() ){
					newPos = getchapterScrollPosition( moveTochapterIndex +1);
					scrollToPosition( newPos );
				}else{
					newPos = getchapterScrollPosition( moveTochapterIndex + 0 );
					scrollToPosition( newPos );
				}
			}else{
				scrollToPosition( 0 );
			}
		});

		$(document).keydown(function(e){
	
			if( ( $('.jqres').width() <= 900 ) ) ;
	
			if( 33 == e.keyCode ){
				// Page Up
				$('.prev-chapter').click();
				return false;
			}
		});

		$('.prev-chapter').mouseover(function(){
			var actualchapterIndex = findActualchapterIndex() - 1;
			var others;
			
			if( 0 > actualchapterIndex ){
				actualchapterIndex = 9999999;
			}

			others = $('.cat-nav-left .cat-nav-chapter').not( '.cat-nav-left .cat-nav-chapter:eq(' + actualchapterIndex + ')' );
			others.removeClass('come-from-bottom');
			others.removeClass('come-from-top');
			$('.cat-nav-left .cat-nav-chapter:eq(' + actualchapterIndex + ')').addClass('come-from-top');
		});

		$('.prev-chapter').mouseout(function(){
			$('.cat-nav-chapter').removeClass('come-from-bottom');
			$('.cat-nav-chapter').removeClass('come-from-top');
		});

		///////////////////////
		// Changes by scrolling

		$(window).scroll(function(){
			var actualchapterIndex = findActualchapterIndex();
			if( 0 >= actualchapterIndex ){
				$('.prev-chapter').hide();
			}else{
				$('.prev-chapter').show();
			}
			
			if( $('.chapter').size() - 1 <= actualchapterIndex ){
				$('.next-chapter').hide();
			}else{
				$('.next-chapter').show();
			}

			$('.prev-chapter:hover').mouseover();
			$('.next-chapter:hover').mouseover();
		});
	
	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initialization
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if ( 1 > $('script[src*="init_rapunzel"]').size() ) {
		if ( '' != $('#ccontainer').attr('data-bg') ){
			$('#ccontainer').css('background-image', 'url('+$('#ccontainer').attr('data-bg')+')');
		}
		return;
	}

	$(window).load(function(){

		// On the home page, move the blog icon inside the header 
		// for better relative/absolute positioning.

		$('#site-bg-image').show();

		$(window).resize(function(){
			$(window).scroll();
		});

		$(window).resize();
		$(window).scroll();
		$(window).resize();
		$(window).scroll();
	});
	

}(jQuery));