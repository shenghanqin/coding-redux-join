/**
 * @loadingService.js 加载动画Service
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppServices.factory('Loading', function() {
    return {
        start : function() {
            $('.loading').show();
        },
        done : function() {
            $('.loading').hide();
        }
    };
});