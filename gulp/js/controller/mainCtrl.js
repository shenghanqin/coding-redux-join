/**
 * @authCtrl.js 修改密码Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('MainCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$window', 'User', 'Request', function($scope, $rootScope, $http, $timeout, $location, $window, User, Request) {
        // 通过刷新或输入URL进入页面的标识
        $rootScope.isRefresh = true;

        $rootScope.isFirstSwitch = true;

        // 用于全局继承使用的对象
        $scope.util = {};

        if (/embed/.test($location.$$url) && $window.parent !== $window) {
            // 如果 URL 中包含 embed，则表明当前路径通过 iframe 嵌入其他网站
            // 点击需要关闭当前 iframe
            $('.wrapper').on('click', function(event) {
                event.stopPropagation();

                var target = event.target;

                if ($(target).hasClass('wrapper')) {
                    $window.parent.postMessage('dialogClose', 'http://store.smartisan.com');
                }
            });
            
            // 点击需要关闭当前 iframe
            $('.dialog .title .close').on('click', function(event) {
                $window.parent.postMessage('dialogClose', 'http://store.smartisan.com');
            });

        } else {
            // bg-none 的 class 用于删除 body 和 wrapper 的背景
            // 如果不是嵌入页面，需要删除
            $('body').removeClass('bg-none');
            $('.wrapper').removeClass('bg-none');
        }

        // 页面高度动画效果
        // $scope.$watch(function() {
        //     // 在 route 转换时，Angular 会复制一个 ng-view
        //     // 前一个视图淡出，会增加 ng-leave
        //     // 当前视图淡入，会增加 ng-enter
        //     // 这里需要观察新进入的元素
        //     if (jQuery.support.opacity) {
        //         return $('.content.ng-enter').outerHeight();
        //     } else {
        //         // ie 下没有 ng-enter
        //         return $('.content').outerHeight();
        //     }
        // }, function(newValue, oldValue) {
        //     if (!newValue) {
        //         return;
        //     }
        //     if (newValue != oldValue) {
        //         var duration = $rootScope.isRefresh ? 0 : 500;

        //         // 动画参考
        //         // $(".typeuserid").animate({"opacity":"0"},100);

        //         // $(".reset-pwd-2").slideDown({duration:500,easing:'easeOutQuart'}).animate({"opacity":"1"},300);
        //         // $(".container-dia").animate({"height":"287px"},{duration:500,easing:'easeOutQuart'});
        //         // $(".dialog").animate({"margin-top":"-178px"},{duration:500,easing:'easeOutQuart'});

        //         // content隐藏的逻辑是在app.js里resolve处理的
        //         // if (jQuery.support.opacity) {
        //         //     $('.content').slideDown({duration:duration, easing:'easeOutQuart'}).animate({'opacity':1}, duration);
        //         // } else {
        //         //     $timeout(function() {
        //         //         $('.content').css({'top':'75px'});
        //         //     }, duration);
        //         // }
        //         // $('.empty').animate({'height':newValue},{duration:duration, queue : false, easing:'easeOutQuart',
        //         //     complete : function() {
        //         //     }});
        //         // $('.dialog').animate({'margin-top':-(newValue + 79)/2},{duration:duration, queue : false, easing:'easeOutQuart'});

        //         $rootScope.isRefresh = false;
        //     }
        // });
    }]);


// 动画参考


// $(".loginform").animate({"opacity":"0"},300);
// setTimeout('$(".loginform").hide();',300);

// 原有 content 300ms 淡出并隐藏


// $(".regform").slideDown({duration:500,easing:'easeOutQuart'}).animate({"opacity":"1"},300);

// 新的 content 500ms 显示 300ms 淡入

// $(".container-dia").animate({"height":"434px"},{duration:500,easing:'easeOutQuart'});
// $(".dialog").animate({"margin-top":"-251px"},{duration:500,easing:'easeOutQuart'});

// content 高度 500ms transition
// dialog top 500ms transition