/**
 * @interceptorService.js http 拦截器
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppServices.factory('Interceptor', ['$q', '$rootScope', '$location', 'Config',  function($q, $rootScope, $location, Config) {

    var interceptor = {
        // optional method
        'request': function(config) {
            return config || $q.when(config);
        },

        // optional method
       'requestError': function(rejection) {
            // do something on error
            return $q.reject(rejection);
        },

        // optional method
        'response': function(response) {
            // do something on success
            // 假如响应返回的是UNAUTHORIZED，则代表需要登录
            if (response.data) {
                // 900以下都是系统错误,统一跳转到系统错误提示页
                if (response.data.errno != 0 && response.data.errno <= 900) {
                    $location.path('/result/system');
                } else if (response.data.errno == Config.errnoMap.UNAUTHORIZED) {
                    // uid token 用于身份验证及信息修改
                    // 无操作权限，将其清空
                    if(!$rootScope.forgotPasswordMsg){
                        $rootScope.currentUid = undefined;
                        $rootScope.currentToken = undefined;
                        $location.path('/result/unauthorized');
                    }
                }
            }
            
            return response || $q.when(response);
        },
        
        // optional method
       'responseError': function(rejection) {
            // do something on error
            return $q.reject(rejection);
        }
    };

    return interceptor;
}]);