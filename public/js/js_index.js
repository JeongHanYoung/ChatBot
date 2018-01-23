var botMessageCnt = 1 // 봇 메시지 고유번호

$(function () {

    $.ajax({
        type: 'POST',
        url: '/init',
        data: {},
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                msgTypeHandler(data[i]);
            }
        }
    });

    $('#sendBtn').click(function () {
        var message = (($('#message').val() != '')? $('#message').val() : $('#menuMsg').val());
        addUserMsg(message);
        appendLoadingDiv();
        $('#sendBtn').attr('disabled', 'disabled');
        $('#message').val('')
        $.ajax({
            type: 'POST',
            url: '/input',
            data: { 'message': message },       
            success: function (data) {
                //data = JSON.parse(data);
                $('#message').val('');
                for (var totCnt = 0; totCnt < data.length; totCnt++) {
                    msgTypeHandler(data[totCnt]);
                }
            }
        });
    })

    $('#message').keydown(function (key) {
        if(key.keyCode == 13 && $('#sendBtn').attr('disabled') != 'disabled'){
            $('#sendBtn').click();
        }
    }).keyup(function () {
        if ($('#message').val().length == 0) {
            $('#sendBtn').attr('disabled', 'disabled');
        } else {
            $('#sendBtn').removeAttr('disabled');
        }
    });

    $('.btnMenu').click(function(){
        if ($('.menuBox').hasClass('on')) {
                 $('.menuBox').removeClass('on');
                 $('.menuBoxDepth').removeClass('on');
                  $('.menuBox').hide();
            } else if ($('.menuBoxDepth').hasClass('on')) {
                 $('.menuBox').removeClass('on');
                 $('.menuBoxDepth').removeClass('on');
                 $('.menuBox').hide();
                 $('.menuBoxDepth').hide();
            } else {
                 $('.menuBox').addClass('on');
                 $('.menuBoxDepth').removeClass('on');
                 $('.menuBox').show();
            }
        if($('.btnMenu').hasClass('hamburgerBtn')){
            $('#menuMsg').val('');
            $('.btnMenu').removeClass('hamburgerBtn').addClass('hamburgerBtnAction');
        }else{
            $('.btnMenu').removeClass('hamburgerBtnAction').addClass('hamburgerBtn');
        }
    });

    
})

//통합 현재시간 구하는 함수
function getCurrentDate(){
    var d = new Date();
    var currentHm = d.getHours() + ':' + ((d.getMinutes() < 10)? '0' : '') + d.getMinutes(); // 현재 시간 (시:분)
    return currentHm;
}

//통합 봇 메시지 append 함수
function appendBotDiv(htmlString, isCounting){
    if($('#loading').length != 0){
        $('#loading').remove();
    }
    $('#bot').append(htmlString).scrollTop($('#bot')[0].scrollHeight);
    if(isCounting){
        botMessageCnt ++;
    }
}

// 사용자 메시지 추가 함수
function addUserMsg(userMsg){
    var userMessage = userMsg; // 사용자 메시지

    var userMsgHtml = '' +
    '<div class="wc-message-wrapper list" >' +
        '<div class="wc-message wc-message-from-me">' +
            '<div class="wc-message-content">' +
                '<svg class="wc-message-callout"></svg>' +
                '<div>' +
                    '<span class="format-plain">' +
                        '<span><!-- react-text: 112 -->' + userMessage + '<!-- /react-text --><br></span>' +
                        '<p class="timeStampUser">' + getCurrentDate() + '</p>' +
                    '</span><!-- react-empty: 115 -->' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="wc-message-from wc-message-from-me">' +
            '<span><!-- react-text: 198 -->userid<!-- /react-text --></span>' +
        '</div>' +
    '</div>';

    appendBotDiv(userMsgHtml, false);
}

// 봇 메시지 타입별 호출 함수 핸들러
function msgTypeHandler(data){
    var type = data.type;
    if(type == 'text'){
        addBotTextMsg(data.contents);
    }else if(type == 'carousel'){
        addBotCarouselMsg(data.contents);
    }else if(type == 'media'){
        addBotMediaMsg(data.contents);
    }
}

// text 봇 메시지 추가 함수
function addBotTextMsg(contents){
    for(var i = 0 ; i < contents.length ; i++){
        var botTextMsgHtml = '' + 
        '<div class="wc-message-wrapper list">' +
            '<div class="wc-message wc-message-from-bot">' +
                '<div class="wc-message-content">' +
                    '<svg class="wc-message-callout"></svg>' +
                    '<div>' +
                        '<div class="format-markdown">' +
                            '<div class="textMent">' +
                                '<p style="margin-top: 0px; margin-bottom: 0px;">' + contents[i].text + '</p>' +
                            '</div>' +
                            '<p class="timeStampBot">' + getCurrentDate() + '</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="wc-message-from wc-message-from-bot">' +
                '<span><!-- react-text: 264 -->KONAPROD<!-- /react-text --></span>' +
            '</div>' +
        '</div>';

        appendBotDiv(botTextMsgHtml, true);
    }
}

//버튼 봇 메시지 추가 함수
function addBotBtnMsg(buttons){
    var botBtnMsgHtml = '';
    if(buttons && buttons.length > 0){
        for(var i = 0 ; i < buttons.length ; i++){
            botBtnMsgHtml += '<li><button alt="' + buttons[i].value + '">' + buttons[i].title + '</button></li>';
        }
    }

    return botBtnMsgHtml;
}

// Carousel 봇 메시지 추가 함수
function addBotCarouselMsg(contents){
    var botCarouselMsgHtml = '';

    for(var i = 0 ; i < contents.length ; i++){
        var liItem = '' +
        '<li class="wc-carousel-item">' +
            '<div class="wc-card hero">' +
                '<div class="wc-container imgContainer">' +
                    ((contents[i].url)? '<img src="' + contents[i].url + '">' : '') +
                '</div>' +
                ((contents[i].title != null) ? '<h1>' + contents[i].title +'</h1>' : '') +
                ((contents[i].text != null) ? '<p class="carousel">' + contents[i].text + '</p>' : '') +
                '<ul class="wc-card-buttons" style="padding: 0;">' +
                    addBotBtnMsg(contents[i].buttons) +
                '</ul>' +
            '</div>' +
        '</li>';
        botCarouselMsgHtml += liItem;
    }

    var baseCarouselHtml = '' +
    '<div class="wc-message-wrapper carousel">' +
        '<div class="wc-message wc-message-from-bot">' +
            '<div class="wc-message-content">' +
                '<svg class="wc-message-callout"></svg>' +
                '<div><!-- react-empty: 336 -->' +
                    '<div class="wc-carousel" style="width: 312px;">' +
                        '<div>' +
                            '<button id="scroll-prev-'+botMessageCnt+'" class="scroll previous" disabled="">' +
                                '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">' +
                            '</button>' +
                            '<div class="wc-hscroll-outer">' +
                                '<div class="wc-hscroll" id="scroll-contents-'+botMessageCnt+'" style="margin-bottom: 0px;">' +
                                    '<ul style="margin: 0; padding: 0;">' +
                                        botCarouselMsgHtml +
                                    '</ul>' +
                                '</div>' +
                                '<p class="timeStampBot">' + getCurrentDate() + '</p>' +
                            '</div>' +
                            '<button id="scroll-next-'+botMessageCnt+'" class="scroll next" ' + ((contents.length > 2)? '' : 'disabled=""') + '>' +
                                '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png">' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="wc-message-from wc-message-from-bot">' +
            '<span><!-- react-text: 403 -->KONAPROD<!-- /react-text --></span>' +
        '</div>' +
    '</div>';

    appendBotDiv(baseCarouselHtml, true);

    //append 후 이벤트 핸들러 연결
    $('#scroll-prev-'+(botMessageCnt-1)).click(function(e){
        scrollPrev(e.target)
    });
    $('#scroll-next-'+(botMessageCnt-1)).click(function(e){
        scrollNext(e.target)
    });
    $('.wc-card-buttons > li > button').each(function(i, e){
        $(e).off('click');
        $(e).on('click', function(){
            $('#message').val($(e).attr('alt'))
            $('#sendBtn').click();
        });
    });
}

// Media 봇 메시지 이미지 추가 함수
function addBotMediaImg(contents) {
    var mediaImgHtml = '';
    if (contents[0].url != null && contents[0].url.length > 0) {
        mediaImgHtml += '<img src="' + contents[0].url + '">';
        mediaImgHtml += '<div class="playImg"></div>';
    }

    return mediaImgHtml;
}

// Media 봇 메시지 추가 함수
function addBotMediaMsg(contents){
    var botMediaMsgHtml = '' +
    '<div class="wc-message-wrapper carousel">' +
        '<div class="wc-message wc-message-from-bot">' +
            '<div class="wc-message-content">' +
                '<svg class="wc-message-callout"></svg>' +
                '<div>' +
                    '<div class="wc-carousel">' +
                        '<div>' +
                            '<button class="scroll previous" disabled="">' +
                                '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">' +
                            '</button>' +
                            '<div class="wc-hscroll-outer">' +
                                '<div class="wc-hscroll" style="margin-bottom: 0px;">' +
                                    '<ul style="padding: 0; margin: 0;">' +
                                       '<li class="wc-carousel-item wc-carousel-play">' +
                                            '<div class="wc-card hero">' +
                                                '<div class="wc-card-div imgContainer">' +
                                                        addBotMediaImg(contents) +
                                                    '<div class="hidden" alt="' + contents[0].text + '"></div>' +
                                                    '<div class="hidden" alt="https://www.youtube.com/embed/cr-XihCw1GU?rel=0"></div>' +
                                                '</div>' +
                                                ((contents[0].title != null) ? '<h1>' + contents[0].title + '</h1>' : '') +
                                                ((contents[0].text != null) ? '<p class="carousel" style="margin: 0; min-height:0;">' + contents[0].text + '</p>' : '') +
                                                '<ul class="wc-card-buttons" style="padding: 0;">' +
                                                    addBotBtnMsg(contents[0].buttons) +
                                                '</ul >' +
                                            '</div>' +
                                        '</li>' +
                                    '</ul>' +
                                '</div>' +
                                '<p class="timeStampBot">' + getCurrentDate() + '</p>' +
                            '</div>' +
                            '<button class="scroll next" disabled="">' +
                                '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png">' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="wc-message-from wc-message-from-bot">' +
            '<span><!-- react-text: 293 -->KONAPROD<!-- /react-text --></span>' +
        '</div>' +
    '</div>';

    appendBotDiv(botMediaMsgHtml, true);

    //append 후 이벤트 핸들러 연결
    $('.wc-card-buttons > li > button').each(function (i, e) {
        $(e).off('click');
        $(e).on('click', function () {
            $('#message').val($(e).attr('alt'))
            $('#sendBtn').click();
        });
    });
}

// Carousel 슬라이드 버튼
function scrollPrev(target){
    var count = $(target).parent().attr('id').split('-')[2];
    var left = parseInt($('#scroll-contents-' + count).scrollLeft());
    var liLength = parseInt($('#scroll-contents-' + count).scrollLeft());
    $('#scroll-contents-' + count).animate({scrollLeft: (left-312) +'px'},500,function(){
        scrollAmimateCallback(count,liLength);
    });
}
function scrollNext(target){
    var count = $(target).parent().attr('id').split('-')[2];
    var left = parseInt($('#scroll-contents-' + count).scrollLeft());
    var liLength = $('#scroll-contents-' + count + ' > ul > li').length;
    $('#scroll-contents-' + count).animate({scrollLeft: (left+312) +'px'},500, function(){
        scrollAmimateCallback(count,liLength);
    });
    
}
function scrollAmimateCallback(count,liLength){
    if($('#scroll-contents-' + count).scrollLeft() == 0){
        $('#scroll-prev-' + count).attr('disabled','disabled');
    }else{
        $('#scroll-prev-' + count).removeAttr('disabled');
    }
    if($('#scroll-contents-' + count).scrollLeft() == 312 * ((liLength/2)-1)){
        $('#scroll-next-' + count).attr('disabled','disabled');
    }else{
        $('#scroll-next-' + count).removeAttr('disabled');
    }
}

//메뉴박스 클릭 함수
function viewMenu(msg){
    $('#message').val('');
    $('#menuMsg').val(msg);
    $('#sendBtn').click();
    $('.btnMenu').click();
}

//로딩 이미지 추가 함수
function appendLoadingDiv() {
    //console.log('로딩 시작[메시지 보냄..]');
    if ($('#loading').length == 0) {
        var loadingHtml = '' + 
        '<div id="loading" class="wc-message-wrapper list">' +
            '<div class="wc-message wc-message-from-bot">' +
                '<div class="wc-message-content">' +
                    '<svg class="wc-message-callout">' +
                    '</svg>' +
                    '<div>' +
                        '<div class="format-markdown loadingMsg">' +
                            '<p style="margin: 0;"><img src="../images/loading.gif" width="15px;" /></p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="wc-list">' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="wc-message-from wc-message-from-bot">' +
                '<span>&nbsp;</span>' +
            '</div>' +
        '</div>';

        appendBotDiv(loadingHtml,false);
    }
}