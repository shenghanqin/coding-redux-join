/**
 * @app.js 应用启动文件
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';


// Declare app level module which depends on filters, and services
var accountApp = angular.module('accountApp', [
    'ngRoute',
    'ngAnimate',
    // 'ie7support',
    // 'accountApp.filters',
    'accountApp.services',
    'accountApp.directives',
    'accountApp.controllers',
    'accountApp.animations',
    'analytics'
]);

var accountAppControllers = angular.module('accountApp.controllers', []);
var accountAppDirectives = angular.module('accountApp.directives', []);
var accountAppServices = angular.module('accountApp.services', []);
var accountAppAnimations = angular.module('accountApp.animations', []);

// accountApp.config(function($compileProvider){
//   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
// });

accountApp.config(['$compileProvider', function($compileProvider){
    // $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);

}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('Interceptor');
    
}]).config(['$routeProvider', function($routeProvider) {

    var resolve = {
        delay : ['$q', '$timeout', 'Loading', function($q, $timeout, Loading) {
            // var delay = $q.defer();

            // Loading.start();

            // if (jQuery.support.opacity) {
            //     $('.content').stop(true).animate({'opacity':0}, 100);
            // } else {
            //     $('.content').css({'top':'-9999px'});
            // }

            // $timeout(function() {
                // delay.resolve();
            // }, 100);

            // return delay.promise;
        }]
    };

    // 用户注册
    $routeProvider.when(
        '/register',
        {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl',
            title: '用户注册'
        }
    );

    // 用户注册 - 嵌入页面
    $routeProvider.when(
        '/register/embed',
        {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl',
            title: '用户注册'
        }
    );

    // 正确用户登录
    $routeProvider.when(
        '/login',
        {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            title: '用户登录'
        }
    );

    // 用户登录 - 嵌入页面
    $routeProvider.when(
        '/login/embed',
        {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            title: '用户登录'
        }
    );

    // 正确用户登录
    $routeProvider.when(
        '/login/:action',
        {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            title: '用户登录'
        }
    );

    // 用户退出，空白页面，退出后直接返回首页
    $routeProvider.when(
        '/logout/embed',
        {
            // templateUrl: 'partials/loginout.html',
            template: '',
            controller: 'LogoutCtrl',
            title: '用户退出'
        }
    );

    // 修改密码
    $routeProvider.when(
        '/modifyPassword',
        {
            templateUrl: 'partials/modifyPassword.html',
            controller: 'ModifyPasswordCtrl',
            title: '修改密码',
            userRequired: true
        }
    );

    // 更换手机
    $routeProvider.when(
        '/modifyMobile',
        {
            templateUrl: 'partials/modifyMobile.html',
            controller: 'ModifyMobileCtrl',
            title: '修改手机',
            userRequired: true
        }
    );

    // 更换邮箱
    $routeProvider.when(
        '/modifyMail',
        {
            templateUrl: 'partials/modifyMail.html',
            controller: 'ModifyMailCtrl',
            title: '修改邮箱',
            userRequired: true
        }
    );

    // 设置安全问题
    $routeProvider.when(
        '/modifyQuestion',
        {
            templateUrl: 'partials/modifyQuestion.html',
            controller: 'ModifyQuestionCtrl',
            title: '设置安全问题',
            userRequired: true
        }
    );

    // 忘记密码
    $routeProvider.when(
        '/forgotPassword',
        {
            templateUrl: 'partials/forgotPassword.html',
            controller: 'ForgotPasswordCtrl',
            title: '忘记密码'
        }
    );

    // 安全验证
    $routeProvider.when(
        '/auth/:channelID',
        {
            templateUrl: 'partials/auth.html',
            controller: 'AuthCtrl',
            title: '安全验证',
            userRequired: true,
            resolve: {
                userAuths: ['Request',
                    function(Request) {
                        return Request.getUserAuths();
                    }
                ]
            }
        }
    );

    // 回调结果页面
    $routeProvider.when(
        '/result/:channelID',
        {
            templateUrl: 'partials/result.html',
            title: '修改成功',
            controller: 'ResultCtrl'
        }
    );

    // 默认指向无权限页面
    $routeProvider.otherwise({redirectTo: '/result/illegality'});
}]);

accountApp.run(['$rootScope', '$route', '$location', '$timeout', '$window', 'Loading', function($rootScope, $route, $location, $timeout, $window, Loading) {

    $rootScope.$on('$routeChangeStart', function (event, current, previous) {
        Loading.start();
    });
    
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        //Change page title, based on Route information
        $rootScope.title = $route.current.title;

        if (!jQuery.support.leadingWhitespace) {
            // IE7 IE8 title 不支持 ng-bind
            $window.document.title = $route.current.title + ' - 锤子科技';
        }
        
        Loading.done();

        // 默认隐藏，避免初次加载模板时抖动
        $('.dialog').show();
    });
}]);