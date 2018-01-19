﻿
module.exports = {
    initQuery: '' +
    'SELECT ' +
        'DLG_ID, ' +
        'DLG_TYPE, ' +
        'DLG_GROUP, ' +
        'DLG_ORDER_NO ' +
    'FROM ' +
        'TBL_DLG ' +
    'WHERE ' +
        'DLG_GROUP = @dlgGroup ' +
        'AND ' +
        'USE_YN = @useYn ' +
    'ORDER BY ' +
        'DLG_ID '
    ,
    initTextQuery: '' +
    'SELECT ' +
        'CARD_TITLE, ' +
        'CARD_TEXT ' +
    'FROM ' +
        'TBL_DLG_TEXT ' +
    'WHERE ' +
        'DLG_ID = @dlgId ' +
        'AND ' +
        'USE_YN = @useYn '
    ,
    initcardQuery: '' +
    'SELECT ' +
        'CARD_TITLE, CARD_TEXT, MEDIA_URL, ' +
        'BTN_1_TYPE, BTN_1_TITLE, BTN_1_CONTEXT, ' +
        'BTN_2_TYPE, BTN_2_TITLE, BTN_2_CONTEXT, ' +
        'BTN_3_TYPE, BTN_3_TITLE, BTN_3_CONTEXT, ' +
        'BTN_4_TYPE, BTN_4_TITLE, BTN_4_CONTEXT ' +
    'FROM ' +
        'TBL_DLG_MEDIA ' +
    'WHERE ' +
        'DLG_ID = @dlgId ' +
        'AND ' +
        'USE_YN = @useYn '
    ,
    bannedMsgQuery: '' +
    'SELECT ' +
        'TOP 1 TD.DLG_ID, ' +
        '(SELECT TOP 1 BANNED_WORD FROM TBL_BANNED_WORD_LIST WHERE CHARINDEX(BANNED_WORD, @message) > 0) AS BANNED_WORD, ' +
        'TDT.CARD_TITLE, TDT.CARD_TEXT ' +
    'FROM ' +
        'TBL_DLG TD, TBL_DLG_TEXT TDT ' +
    'WHERE ' +
        'TD.DLG_ID = TDT.DLG_ID ' +
        'AND ' +
        'TD.DLG_GROUP = ' +
            '( ' +
                'SELECT CASE ' +
                    'WHEN SUM(CASE WHEN BANNED_WORD_TYPE = 3 THEN CHARINDEX(A.BANNED_WORD, @message) END) > 0 THEN 3 ' +
                    'WHEN SUM(CASE WHEN BANNED_WORD_TYPE = 4 THEN CHARINDEX(A.BANNED_WORD, @message) END) > 0 THEN 4 ' +
                    'END ' +
                'FROM ' +
                    'TBL_BANNED_WORD_LIST A ' +
            ') ' +
        'AND ' +
        'TD.DLG_GROUP IN (3, 4) ' +
    'ORDER BY NEWID() '
    ,
    cashMsgQuery: '' +
    'SELECT ' +
        'LUIS_ID, LUIS_INTENT, LUIS_ENTITIES, ' +
        'ISNULL(LUIS_INTENT_SCORE,\'\') AS LUIS_INTENT_SCORE ' +
    'FROM ' +
        'TBL_QUERY_ANALYSIS_RESULT ' +
    'WHERE ' +
        'LOWER(QUERY) = LOWER(@message) ' +
        'AND ' +
        'RESULT = @result '
    ,
    entityOrderByAddQuery: '' +
    'SELECT '+
    'RESULT AS ENTITIES ' +
    'FROM ' +
    'FN_ENTITY_ORDERBY_ADD(@message)'
    ,
    defineTypeChkSpareQuery: '' +
    'SELECT ' +
        'LUIS_ID, LUIS_INTENT, LUIS_ENTITIES, ' + 
        'ISNULL(DLG_ID,0) AS DLG_ID, DLG_API_DEFINE, API_ID ' +
    'FROM ' +
        'TBL_DLG_RELATION_LUIS ' +
    'WHERE ' +
        'LUIS_ENTITIES = @entities '
}