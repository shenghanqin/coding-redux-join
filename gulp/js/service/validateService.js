/**
 * @validateService.js 加载动画Service
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppServices.factory('Validate', function() {
    return {
        // 检查当前的错误数量，用于出错以后动画提示
        // 参数为当前controller的scope与form
        checkErrNumber : function(scope, form) {
            // 点击提交按钮输入框验证出错后，如果多个错误，则只出现错误框，如果只有一个错误，则输入框晃动
            var error = 0;
            var name;
            // 错误动画标识
            scope.errAnimation = {};

            angular.forEach(form.$error, function(item) {

                angular.forEach(item, function(i) {
                    
                    // 如果输入框验证失败，则记录失败数量
                    if (i.$invalid) {
                        name = [i.$name];
                        error++;
                    }
                });
            });
            
            // 错误等于1个，则记录动画
            if (error == 1) {
                scope.errAnimation[name] = true;
            }
        }
    };
});