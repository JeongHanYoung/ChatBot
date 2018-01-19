
module.exports = {
    textParse: function (data) {
        var textJson = {
            "type": "text",
            "contents": [
                { "text": data.CARD_TEXT }
            ]
        };
        return textJson;
    },
    cardParse: function (data) {

    },
    mediaParse: function (data) {
        var mediaJson = {
            "type": "media",
            "contents": [
                {
                    "text": data.CARD_TEXT,
                    "url": data.MEDIA_URL,
                    "buttons": []
                }]
        };
        mediaJson.contents[0].buttons = this.buttonsParse(data);

        return mediaJson;
    },
    buttonsParse: function (data) {
        var buttonJson = []
        if (data.BTN_1_TITLE.length > 0) {
            buttonJson.push({
                "type": data.BTN_1_TYPE,
                "title": data.BTN_1_TITLE,
                "value": data.BTN_1_CONTEXT
            });
        }
        if (data.BTN_2_TITLE.length > 0) {
            buttonJson.push({
                "type": data.BTN_2_TYPE,
                "title": data.BTN_2_TITLE,
                "value": data.BTN_2_CONTEXT
            });
        }
        if (data.BTN_3_TITLE.length > 0) {
            buttonJson.push({
                "type": data.BTN_3_TYPE,
                "title": data.BTN_3_TITLE,
                "value": data.BTN_3_CONTEXT
            });
        }
        if (data.BTN_4_TITLE.length > 0) {
            buttonJson.push({
                "type": data.BTN_4_TYPE,
                "title": data.BTN_4_TITLE,
                "value": data.BTN_4_CONTEXT
            });
        }

        return buttonJson;
    }
}