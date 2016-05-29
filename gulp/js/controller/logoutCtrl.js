/**
 * @authCtrl.js 身份验证Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */
accountAppControllers.
    controller('LogoutCtrl', ['$scope', '$rootScope', '$http', '$location', '$window', '$timeout', 'User', 'Request', '$routeParams', 'Config', 'Validate', 'Loading',
     function($scope, $rootScope, $http, $location, $window, $timeout, User, Request, $routeParams, Config, Validate, Loading) {

        // 直接发送退出请求
        Loading.start();

        Request.logout().then(function(response) {
                Loading.done();

                if (response.errno == 0) {
                    // 退出成功
                    $location.path('/login');

                    // 外部系统调用退出时，通知父级页面
                    if($window.parent !== $window) {
                        $window.parent.postMessage('isLoggedOut', 'http://store.smartisan.com');
                    }
                }

            }, function(err) {
                Loading.done();
            });
    }]);