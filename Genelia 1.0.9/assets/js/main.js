(function ($) {
	'use strict';


	var geneliaArt = {
		/* ---------------------------------------------
			## Scroll top
		--------------------------------------------- */
		scroll_top: function () {
			var $scrolltop = $('#scroll-top');
			// if( $('#ghost-membersjs-root').length > 0 ) {
			// 	$scrolltop.addClass('more-top');
			// }		
			if( $('#ghost-portal-root').length > 0 ) {
				$scrolltop.addClass('more-top');
			}

			var sticky = $('header.sticky');

			const progressPath = document.querySelector('#scroll-top path');
			const pathLength = progressPath.getTotalLength();
			progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
			progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
			progressPath.style.strokeDashoffset = pathLength;
			progressPath.getBoundingClientRect();
			progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
			const updateProgress = function() {
			  const scroll = window.scrollY || window.scrollTopBtn || document.documentElement.scrollTopBtn;
		  
			  const docHeight = Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
			  );
		  
			  const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		  
			  const height = docHeight - windowHeight;
			  var progress = pathLength - (scroll * pathLength / height);
			  progressPath.style.strokeDashoffset = progress;
			}
		  
			updateProgress();
			const offset = 100;

			window.addEventListener('scroll', function(event) {
				updateProgress();

			}, false);
			
			$(window).on('scroll', function () {
				if ($(this).scrollTop() > $(this).height()) {
					$scrolltop.addClass('btn-show').removeClass('btn-hide');
					sticky.addClass('active');
				} else {
					$scrolltop.addClass('btn-hide').removeClass('btn-show');
					sticky.removeClass('active');
				}


			});

			$("a[href='#top']").on('click', function () {
				$('html, body').animate(
					{
						scrollTop: 0,
					},
					'normal'
				);
				return false;
			});
		},

		/* ---------------------------------------------
			## Menu Script
		--------------------------------------------- */
		menu_script: function () {
			// Accordion Menu
			var $AccordianMenu = $('.sidebar-menu .navigation a');
			var $mobileSubMenuOpen = $('.hamburger-menus');

			$mobileSubMenuOpen.on('click', function () {
				$(this).toggleClass("click-menu");
				$('.mobile-sidebar-menu').toggleClass("sidemenu-active");
				$('.offcanvas').toggleClass("active");
				$('#sticky-header').toggleClass("active");
			});

			$AccordianMenu.on('click', function () {
				var link = $(this);
				var closestUl = link.closest("ul");
				var parallelActiveLinks = closestUl.find(".active")
				var closestLi = link.closest("li");
				var linkStatus = closestLi.hasClass("active");
				var count = 0;

				closestUl.find("ul").slideUp(function () {
					if (++count == closestUl.find("ul").length)
						parallelActiveLinks.removeClass("active");
				});

				if (!linkStatus) {
					closestLi.children("ul").slideDown();
					closestLi.addClass("active");
				}
			});
		},

		/* ---------------------------------------------
		## Ajax Post Load
		 --------------------------------------------- */
		ajaxPostLocad: function() {
			var pagination_next_url = $('link[rel=next]').attr('href'),
			    $load_posts_button  = $('.js-load-posts');

			$load_posts_button.click(function(e) {
			    e.preventDefault();

			    var request_next_link = pagination_next_url.split(/page/)[0] + 'page/' + pagination_next_page_number + '/';

			    $.ajax({
				    url: request_next_link,
				    beforeSend: function() {
				        $load_posts_button.text('Loading');
				        $load_posts_button.addClass('button--loading');
						$('#post-masonry').css({'opacity': '0.85'});
				    }
			    }).done(function(data) {
			        var posts = $('.post-loop', data);

			        $load_posts_button.text('Load More');
			        $load_posts_button.removeClass('button--loading');
					$('#post-masonry').css({'opacity': '1'});

	                if ($('#post-masonry').length) {
						$('#post-masonry').append( posts ).isotope( 'appended', posts );
						$('#post-masonry').imagesLoaded(function(){
							$('#post-masonry').isotope('layout');
						});
		            }

			        pagination_next_page_number++;

			        // If you are on the last pagination page, add the disabled attribute
			        if (pagination_next_page_number > pagination_available_pages_number) {
			            $load_posts_button.attr('disabled', true);
			            $load_posts_button.slideUp();
						$load_posts_button.parent().parent().slideUp();
			        }
			    });
			});
		},

		/* ---------------------------------------------
		## Search Popup
		 --------------------------------------------- */
		searchPopup: function() {
			// Search results
			var posts = [],
			    searchKey = $("#search-input"),
			    searchContent = $("#search-full-content"),
			    searchResultnum = $(".no-result");

			// search-elements
			$(".search-elements").on("click", function (e) {
			    e.preventDefault();
			    $(".overlay-content").addClass("active");
			    $("body").addClass("body-overflow");
			    searchKey.focus();

			    if (posts.length == 0 && typeof serachContentApi !== undefined) {
			        $.get(serachContentApi)
			            .done(function (data) {
			                posts = data.posts;
			                search();
			            })
			            .fail(function (err) {});
			    }
			});

			//  click on close icon input text clear
			function seacrhEvent() {
			    $(".overlay-content").removeClass("active");
			    $("body").removeClass("body-overflow");
			    searchKey.val("");
			    searchContent.empty();
			    searchResultnum.removeClass("d-block");
			}

			$(".overlay-close").on("click", function () {
			    seacrhEvent();
			});

			$(document).keydown(function (event) {
			    if (event.keyCode == 27) {
			        seacrhEvent();
			    }
			});

			function search() {
			    var options = {
			        shouldSort: true,
			        tokenize: true,
			        matchAllTokens: true,
			        threshold: 0,
			        location: 0,
			        distance: 100,
			        maxPatternLength: 32,
			        minMatchCharLength: 1,
					useExtendedSearch: true,
			        keys: [
			            {
			                name: "title",
			                weight: 0.7,
			            },
						{
			                name: "tags.name",
			                weight: 0.7,
			            },
						{
			                name: "plaintext",
			                weight: 0.7,
			            },
						{
			                name: "custom_excerpt",
			                weight: 0.7,
			            },
						{
			                name: "excerpt",
			                weight: 0.7,
			            },
			        ],
			    };

			    var fuse = new Fuse(posts, options);

			    searchKey.keyup(function () {
			        var value = this.value,
			            search = fuse.search(value),
			            output = "",
			            language = $("html").attr("lang");

						if(value.length > 0) {
							searchResultnum.addClass("d-block");
							searchResultnum.children("span").html(search.length);
							if (posts.length > 0) {
								$.each(search, function (key, val) {
									var pubDate = new Date(val.published_at).toLocaleDateString(language, {
										day: "numeric",
										month: "long",
										year: "numeric",
									});
									output += `
									<a class="single-search-result" href="${val.url}">
									  <div class="single-result-item">
										  <div class="search-content pr-sm-30">
											  <div class="d-flex mb-15 align-items-center">
												  <h5 class="post-title">${val.title} <span class="post-datetime">
												  ${pubDate}      
												  </span></h5>     
											  </div> 
											  <p class="excerpt-text mb-0">${val.excerpt}</p>
										  </div>
										  <div class="prev-next-arrow d-none d-sm-block">
											  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
										  </div>
									  </div>
								   </a>`;
								});
								searchContent.html(output);
							}
						} else {
							searchResultnum.addClass("d-none");
							searchResultnum.children("span").html('0');
							searchContent.html('');
						}

			    });
			}
		},

		/* ---------------------------------------------
		## Light Dark switcher
		 --------------------------------------------- */
		light_dark: function() {
			var switcher = $('.switcher');

			switcher.on('click', function(e) {
				e.preventDefault();

				if( $(this).hasClass('active') ) {
					$(this).removeClass('active');
					$('body').removeClass('dark-layout');
					setCookie('layout_mode', 'light');
				} else {
					$('body').addClass('dark-layout');
					$(this).addClass('active');
					$('body').removeClass('light-layout');
					setCookie('layout_mode', 'dark');
				}
			});
		},

		/* ---------------------------------------------
		## Blog Masonry
		 --------------------------------------------- */
		postBlog: function() {
			$('#post-masonry').imagesLoaded(function(){
				$('#post-masonry').isotope({
					// options
					itemSelector: '.post-loop',
					percentPosition: true,
					layoutMode: 'packery'
				});
				$('#post-masonry').isotope('layout');
			});
		},
		/* ---------------------------------------------
		Content Video Responsive
		 --------------------------------------------- */
		content_video: function() {
			var $postVideo = $('.all-contents');
			$postVideo.fitVids();
		},			
		
		/* ---------------------------------------------
		Content Video Responsive
		 --------------------------------------------- */
		main_nav_auto: function() {
			var more_nav = $('.more-nav-elements a.more-btn');
			more_nav.on('click', function(e) {
				e.preventDefault();
				$('.auto-nav-more-list').toggleClass('enable-menu');
				$('.overlaybg').toggleClass('active');
			});

			$('.overlaybg').on('click', function() {
				$(this).removeClass('active');
				$('.auto-nav-more-list').removeClass('enable-menu');
			});
		},	

		/* ---------------------------------------------
		Lightbox
		 --------------------------------------------- */
		lightboxs: function() {
			const images = document.querySelectorAll('.kg-image-card img, .kg-gallery-card img');

			// Lightbox function
			images.forEach(function (image) {
			  var wrapper = document.createElement('a');
			  wrapper.setAttribute('data-no-swup', '');
			  wrapper.setAttribute('data-fslightbox', '');
			  wrapper.setAttribute('href', image.src);
			  wrapper.setAttribute('aria-label', 'Click for Lightbox');
			  image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
			  wrapper.appendChild(image);
			});
			
			refreshFsLightbox();
		},
		/* ---------------------------------------------
		 function initialize
		 --------------------------------------------- */
		initialize: function () {
			geneliaArt.scroll_top();
			geneliaArt.menu_script();
			geneliaArt.ajaxPostLocad();
			geneliaArt.searchPopup();
			geneliaArt.light_dark();
			geneliaArt.content_video();
			geneliaArt.main_nav_auto();
			geneliaArt.lightboxs();
		},
	};
	/* ---------------------------------------------
	 Document ready function
	 --------------------------------------------- */
	$(function () {
		geneliaArt.initialize();
	});

	$(window).on('load', function() {
		geneliaArt.postBlog();
	});
})(jQuery);
