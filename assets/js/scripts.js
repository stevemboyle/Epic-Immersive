$(document).ready(function() {
	
	"use strict";
	
	/*============================================
	Page Preloader
	==============================================*/
	
	$('#page-loader span').animate({'width':'100%'},10000);
	
	/*============================================
	Header Slider
	==============================================*/
	
	var speed = $('.header-slider').data('speed') ? parseInt($('.header-slider').data('speed'),10) : 3000;
	
	$('.header-slider').flexslider({
		animation: "fade",
		directionNav: false,
		controlNav: false,
		slideshowSpeed: speed,
		animationSpeed: 400,
		pauseOnHover:false,
		pauseOnAction:false,
		smoothHeight: false,
		slideshow:false //paused by default, starts when window load
	});
	
	/*============================================
	Sticky Menu
	==============================================*/
	
	checkScrollTop();
	
	$(window).scroll(function(){
		checkScrollTop();
	});
	
	function checkScrollTop(){
		if ($(window).scrollTop()< 10){
			$('#main-nav').removeClass('is-sticky');
		}
		else{
			$('#main-nav').addClass('is-sticky');    
		}
	}
	
	/*============================================
	ScrollTo Links
	==============================================*/
	$('body').on('click','a.scrollto',function(e){
		
		e.preventDefault();
		
		var target =$(this).attr('href');
		
		$('html, body').stop().animate({scrollTop: $(target).offset().top}, 1600, 'easeInOutExpo',
			function(){window.location.hash =target;});
			
		if ($('.navbar-collapse').hasClass('in')){
			$('.navbar-collapse').removeClass('in').addClass('collapse');
		}
	});
	
	
	/*============================================
	Counters
	==============================================*/
	$('.counters').waypoint(function(){
		
		$('.counter').each(function(){$(this).countTo();});
		
	},{offset:'100%',triggerOnce:true});
	
	
	/*============================================
	Filter Projects
	==============================================*/
	$('#filter-works').on('click','a',function(e){
		e.preventDefault();
		
		var $this = $(this),
			category = $this.attr('data-filter');
		
		if($('#project-preview').hasClass('open')){
			closeProject();
		}
		
		$('#filter-works li').removeClass('active');
		$this.parent('li').addClass('active');

		$('.project-item').addClass('filtered');
		$('.project-item'+category).removeClass('filtered');
		$('#projects-container').masonry('reload');

		waypointsRefresh();
		
		setTimeout(function(){
			$(window).trigger('resize');
		},500);
	});
	
	/*============================================
	Project Preview
	==============================================*/
	$('body').on('click','.project-item:not(.external-link)',function(e){
		e.preventDefault();

		var project = $(this);
		
		if($('#project-preview').hasClass('open')){
			$('#project-preview .container').animate({'opacity':0},300);
			
			setTimeout(function(){
				$('#project-slider').flexslider('destroy');
				buildProject(project);
			},300);
		}else{
			buildProject(project);
		}
		
	});

	function buildProject(project){
	
		var	title = project.find('.project-title').text(),
			descr = project.find('.project-description').html(),
			slidesHtml = '<ul class="slides">',
			hasVideo = false;

		if(project.find('.project-description').data('video')){
			slidesHtml = slidesHtml + '<li>'+project.find('.project-description').data('video')+'</li>';
			hasVideo = true;
		}
		
		if(project.find('.project-description').data('images')){
			var	slides = project.find('.project-description').data('images').split(',');
			
			for (var i = 0; i < slides.length; ++i) {
				slidesHtml = slidesHtml + '<li><img src='+slides[i]+' alt=""></li>';
			}
		}
		
		slidesHtml = slidesHtml + '</ul>';
		
		$('#project-title').text(title);
		$('#project-content').html(descr);
		$('#project-slider').html(slidesHtml);
		
		openProject(hasVideo);
	}
	
	function openProject(hasVideo){
		
		$('#project-preview').addClass('open').slideDown(400);
		
		$('html, body').stop().animate({scrollTop: $('#filter-works').offset().top+50}, 600);
		
		setTimeout(function(){
		
			$('#project-slider').fitVids().flexslider({
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>',
				animation: 'slide',
				slideshowSpeed: 3000,
				useCSS: true,
				controlNav: true, 
				pauseOnAction: false, 
				pauseOnHover: hasVideo ? false : true,
				smoothHeight: false,
				start: function(){
					if(hasVideo){$('#project-slider').find('li.clone').height(1).empty();$('#project-slider').flexslider("pause");}
					$(window).trigger('resize');
					$('#project-preview .container').animate({'opacity':1},300);
				}
			});
		},200);
	
		setTimeout(function(){
			$(window).trigger('resize');
		},800);
		
	}
	
	function closeProject(){
	
		var previewPanel = $('#project-preview');
		previewPanel.removeClass('open').find('.container').animate({'opacity':0},300);
		
		$('html, body').stop().animate({scrollTop: $('#filter-works').offset().top-110}, 600);
		
		setTimeout(function(){
			
			previewPanel.slideUp().find('#project-slider').empty().flexslider('destroy');
		
			waypointsRefresh();
			
		},300);
		
		setTimeout(function(){
			$(window).trigger('resize');
		},800);
		
	}
	
	$('#project-preview').on('click','.close-preview',function(){
		closeProject();
	});
	
	/*============================================
	Placeholder Detection
	==============================================*/
	if (!Modernizr.input.placeholder) {
		$('html').addClass('no-placeholder');
	}

	/*============================================
	Video functions
	==============================================*/
	if($('.video-container').length) {$('.video-container').fitVids();}

	$('.video-bg.load').each(function(){
		var $this = $(this),
			video = $this.data('video').split('.')[0];
			
		$('<source>').attr({type:'video/mp4',src:video+'.mp4'}).appendTo($this);
		$('<source>').attr({type:'video/webm',src:video+'.webm'}).appendTo($this);
		$('<source>').attr({type:'video/ogg; codecs=&quot;theora, vorbis&quot;',src:video+'.ogg'}).appendTo($this);
		
	});
		
	/*============================================
	Resize Functions
	==============================================*/
	$(window).resize(function(){
	
		if($('#projects-container').length){
			$('#projects-container').masonry('reload');
		}
		
		waypointsRefresh();
		
	});
	
	/*============================================
	Refresh waypoints function
	==============================================*/
	function waypointsRefresh(){
		setTimeout(function(){
			$.waypoints('refresh');
		},1000);
	}
	
	/*============================================
	Contact Form
	==============================================*/
	$('body').on('submit','#contact-form',function() {
		
		var $form = $(this),
			$formBtn = $form.find('button'),
			formInput = $form.serialize(),
			buttonCopy = $formBtn.html(),
			errorMessage = $formBtn.data('error-message'),
			sendingMessage = $formBtn.data('sending-message'),
			okMessage = $formBtn.data('ok-message'),
			hasError = false;
		
		
		if($form.is('.validating')){
			return false;
		}
		
		$form.addClass('validating');
		
		$form.find('.error-message').remove();
		
		$form.find('.requiredField').each(function() {
			if($.trim($(this).val()) === '') {
				var errorText = $(this).data('error-empty');
				$(this).parents('.controls').append('<span class="error-message" style="display:none;">'+errorText+'.</span>').find('.error-message').fadeIn('fast');
				hasError = true;
			} else if($(this).is("input[type='email']") || $(this).attr('name')==='email') {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,10})?$/;
				if(!emailReg.test($.trim($(this).val()))) {
					var invalidEmail = $(this).data('error-invalid');
					$(this).parents('.controls').append('<span class="error-message" style="display:none;">'+invalidEmail+'.</span>').find('.error-message').fadeIn('fast');
					hasError = true;
				}
			}
		});
		
		if(hasError) {
			$formBtn.html('<i class="fa fa-times"></i>'+errorMessage);
			setTimeout(function(){
				$form.removeClass('validating').find('button').html(buttonCopy);
			},2000);
		}
		else {
			$formBtn.html('<i class="fa fa-spinner fa-spin"></i>'+sendingMessage);
			
			$.post($form.attr('action'),formInput, function(data){
				$formBtn.html('<i class="fa fa-check"></i>'+okMessage);
				setTimeout(function(){
					$form.removeClass('validating').find('button').html(buttonCopy);
				},2000);
				
				$form[0].reset();
			});
		}
		
		return false;	
	});
	
	/*============================================
	Newsletter
	==============================================*/
	
	$('.mc-newsletter').each(function(){
		var listUrl = $(this).data('list-url');
		$(this).ajaxChimp({
			callback: callbackMailchimp,
			url: listUrl
		});
		
	});
		
	function callbackMailchimp (resp) {
		
		var currform = $('.mc-newsletter.mc-current');
		
		currform.removeClass('validating mc-current').find('.mc-validation p').hide();
		
		if(resp.result === 'success'){
	
			currform.find('.mc-text-if-ok').show();
			currform[0].reset();
			
		}else{
		
			if(resp.msg.split(' - ',2)[0] === '0'){
				currform.find('.mc-text-if-invalid').show();
			}else{
				currform.find('.mc-text-if-exist').show();
			}
		
		}
		
	}
	
	$('body').on('click','.mc-newsletter button',function(e) {

		e.preventDefault();

		var $form = $(this).parents('.mc-newsletter');
		
		$('.mc-newsletter').removeClass('mc-current');
		$form.addClass('mc-current');
		
		if($form.is('.validating')){
			return false;
		}
	
		$form.removeClass('validating').find('.mc-validation p').hide();
		
		var hasError 	= false,
			$emailInput = $form.find('[type=email]'),
			emailReg 	= /^([\w-\.]+@([\w-]+\.)+[\w-]{2,8})?$/;
			
		
		if($.trim($emailInput.val()) === '') {
			$form.find('.mc-text-if-empty').show();
			hasError = true;
		} else if(!emailReg.test($.trim($emailInput.val()))) {
			$form.find('.mc-text-if-invalid').show();
			hasError = true;
		}
		
		if(!hasError) {
			$form.addClass('validating').submit().find('.mc-text-if-sending').show();
		}
		
		return false;	
	});
	
	
	/*============================================
	$(window).load Functions
	==============================================*/
	
	$(window).load(function(){
		
		//Hide the Preloader
		
		$('#page-loader span').stop().animate({'width':'100%'},500,function(){
			$(this).parent('#page-loader').fadeOut(500);
		});
		
		
		//Start Header Text Rotator
		
		if($('.header-slider').length){
			$('.header-slider').flexslider('play');
		}
		
		//Init the Masonry blocks
		
		if($('#projects-container').length){
			
			$('#projects-container').css({visibility:'visible'}).masonry({
				itemSelector: '.project-item:not(.filtered)',
				isFitWidth: false,
				isResizable: true,
				isAnimated: !Modernizr.csstransitions,
				gutterWidth: 0
			});

			
			waypointsRefresh();
		}
		
		//Load the Background Videos
		
		$('.video-bg').each(function(){
			var $this = $(this),
				video = $this.data('video').split('.')[0];
				
			$('<source>').attr({type:'video/mp4',src:video+'.mp4'}).appendTo($this);
			$('<source>').attr({type:'video/webm',src:video+'.webm'}).appendTo($this);
			$('<source>').attr({type:'video/ogg; codecs=&quot;theora, vorbis&quot;',src:video+'.ogg'}).appendTo($this);
			
		});
		
		//Start the popup timer
		
		$('.autopopup').each(function(){
			var $this = $(this);
			var delay = $this.data('delay');
			setTimeout(function(){
				$this.modal('show');
			},delay);
		});
		
		//Load Google Map
		
		if($('#gmap').length){
		
		
			var map,
				mapstyles = [ { "stylers": [ { "saturation": -100 } ] } ], // Google Map styles
				pointLatLng = new google.maps.LatLng(mapPoint.lat, mapPoint.lng), // Map point coords
				isDraggable = $('html').is('.touch') ? false : true, // Don't let the Map be draggable on touch devices
				mapOptions = {
					zoom: mapPoint.zoom,
					center: pointLatLng,
					zoomControl : true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.LEFT_CENTER
					},
					panControl : false,
					streetViewControl : false,
					mapTypeControl: false,
					overviewMapControl: false,
					scrollwheel: false,
					draggable:isDraggable,
					styles: mapstyles
				};
			
			map = new google.maps.Map(document.getElementById("gmap"), mapOptions); // Create the Map
			
			$('#gmap').waypoint(function(){ //When Map is on viewport, create the marker and animate it 
				var marker = new google.maps.Marker({
					position: pointLatLng, 
					map: map, 
					icon: mapPoint.icon
				});
				
				var mapLink = 'https://www.google.com/maps/preview?ll='+mapPoint.lat+','+mapPoint.lng+'&z=14&q='+mapPoint.mapAddress;
				
				google.maps.event.addListener(marker, 'click', function() {
					window.open(mapLink,'_blank');
				});
				
				marker.setAnimation(google.maps.Animation.DROP);
				
			},{offset:'50%',triggerOnce:true});
			
		}
		
	});
	
});	