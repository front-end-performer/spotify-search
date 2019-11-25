(function () {
    var results = $('.results-container');
    var moreBtn = $('.btn').hide();
    var nextUrl;
    var searchContainer = $('.search_for-container');
    var resultsContainer = $('.results-container');

    $('.submit-button').on('click', submitFn);
    function submitFn() {
        var userInput = $('input[name="user-input"]').val();
        var dropDown = $('.artist-or-album').val();
        var baseUrl = 'https://elegant-croissant.glitch.me/spotify';

        if (userInput === '') {
            return;
        } else {
            $.ajax({
                url: baseUrl,
                metod: 'GET',
                data: {
                    q: userInput,
                    type: dropDown
                },
                success: submitSuccess
            });
            function submitSuccess(payload) {
                payload = payload.artists || payload.albums;

                var resultFor = '';
                var targetSearchMessage = $('.search_for-container');
                resultFor = '<p>Result for: ' + $('input[name="user-input"]').val() + '</p>';
                targetSearchMessage.html(resultFor);

                if (payload.items.length) {
                    console.log(payload.items.length);
                    var artistBlock = '';
                    var imgUrl = "http://dudespaper.com/wp-content/uploads/2008/12/lebowskirecordalbum1.jpg";

                    for (var i = 0; i < payload.items.length; i++) {

                        if (payload.items[i].images.length > 0) {
                            artistBlock += '<div class="result_box"><a href="' + payload.items[i].external_urls.spotify + '"><img class="artist_img" src="' + payload.items[i].images[0].url + '" alt="img_artist" /></a><h3>' + payload.items[i].name + '</h3></div>';
                            searchContainer.css({
                                display: 'block'
                            });
                            resultsContainer.css({
                                display: 'flex',
                                flexDirection: 'column'
                            });
                        } else {
                            artistBlock += '<div class="result_box"><a href="' + payload.items[i].external_urls.spotify + '"><img class="artist_img" src="' + imgUrl + '" alt="img_artist" /></a><h3>' + payload.items[i].name + '</h3></div>';
                        }
                    }
                    results.html(artistBlock);
                    $('.result_box').hover(
                        function () {
                            $(this).append($("<span>***</span>"));
                        }, function () {
                            $(this).find("span").last().remove();
                        });
                } else {
                    results.html('<p>no result</p>');
                    moreBtn.hide();
                }

                if (payload.items.length <= 20) {
                    if (payload.next) {
                        nextUrl = payload.next.replace(
                            'https://api.spotify.com/v1/search', baseUrl
                        );
                        moreBtn.hide();
                        infiniteScroll();
                    }
                }
                startLoading();
            }
        }
    }

    moreBtn.on('click', moreSubmit); // more submit btn event listener

    function moreSubmit() { // more submit btn
        var baseUrl = 'https://elegant-croissant.glitch.me/spotify';

        $.ajax({
            url: nextUrl,
            success: submitMoreSuccess
        });

        function submitMoreSuccess(payload) {
            stopLoading();
            payload = payload.artists || payload.albums;

            if (payload.items.length) {
                console.log(payload.items.length);
                var artistBlock = '';
                var imgUrl = "http://dudespaper.com/wp-content/uploads/2008/12/lebowskirecordalbum1.jpg";

                for (var x = 0; x < payload.items.length; x++) {
                    if (payload.items[x].images.length > 0) {
                        artistBlock += '<div class="result_box"><a href="' + payload.items[x].external_urls.spotify + '"><img class="artist_img" src="' + payload.items[x].images[0].url + '" alt="img_artist" /></a><h3>' + payload.items[x].name + '</h3></div>';
                    } else {
                        artistBlock += '<div class="result_box"><a href="' + payload.items[x].external_urls.spotify + '"><img class="artist_img" src="' + imgUrl + '" alt="img_artist" /></a><h3>' + payload.items[x].name + '</h3></div>';
                    }
                }
                results.append(artistBlock);
                $('.result_box').hover(
                    function () {
                        $(this).append($("<span>***</span>"));
                    }, function () {
                        $(this).find("span").last().remove();
                    });
            } else {
                return;
            }

            if (payload.items.length <= 20) {
                if (payload.next) {
                    nextUrl = payload.next.replace(
                        'https://api.spotify.com/v1/search', baseUrl
                    );
                    infiniteScroll();
                } else {
                    moreBtn.hide();
                    stopLoading();
                }
            }
            startLoading();
        }
    }

    function infiniteScroll() {

        if ($(window).height() + $(document).scrollTop() >= $(document).height()) {
            if (location.search.indexOf('scroll=infinite') === -1) {
                console.log('true', location.search.indexOf('scroll=infinite'));
                moreBtn.trigger('click');
                moreBtn.hide();
            }
        } else {
            setTimeout(infiniteScroll, 500);
        }
    }

    function startLoading() {
        $('.result_box').animate({
            width: '50%',
            opacity: '1'
        }, 1500);
        $('#loading').fadeIn(100);
    }

    function stopLoading() {
        $('.result_box').css({
            width: '60%',
            opacity: '1'
        });
        $('#loading img').css({
            display: 'none'
        });
    }
})();
