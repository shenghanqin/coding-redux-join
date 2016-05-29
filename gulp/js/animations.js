/**
 * @animations.js 动画定义
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppAnimations
    .animation('.content', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        return {
            enter: function(element, done) {
                // $('.content').outerHeight()
                var height = element.height();
                var outerHeight = element.outerHeight();

                // 初次进入页面时直接显示
                var duration = $rootScope.isRefresh ? 0 : 500;

                // 先将 height 设置为前一个 view 的高度
                element.css({height: $rootScope.height});

                // $('.empty').animate({'height':height},{duration:duration, queue : false, easing:'easeOutQuart'});

                // 执行 content 动画
                element
                    .animate({
                        'height': height
                    }, {
                        duration: duration,
                        queue: false,
                        easing:'easeOutQuart',
                        complete: function() {
                            // 动画结束后将 height 清空
                            // 使得内部元素可以自动改变 content 的高度
                            element.css({height: 'auto'});

                            // 记录当前 content 高度
                            $rootScope.height = element.height();
                        }
                    });

                $('.dialog').animate({
                    'margin-top': -(outerHeight + 69) / 2
                }, {
                    duration: duration,
                    queue : false,
                    easing:'easeOutQuart'
                });
                
                // 可以通过在根作用域上设置变量来判断是否第一次进入页面
                if ($rootScope.isRefresh) {
                    $rootScope.isRefresh = false;
                    return;
                };

                // 对于不支持透明度的浏览器，直接显示隐藏，不淡入淡出
                if (jQuery.support.opacity) {
                    element.css({
                        opacity: 0
                    });

                    $timeout(function() {
                        element.animate({
                            opacity: 1
                        }, 300, done);
                    }, duration);
                } else {
                    // 这里直接隐藏，会导致 margin 不稳定，所以采用 position 的方式隐藏
                    element.show();
                    done();
                }
            },
            leave: function(element, done) {
                // leave 执行时，重置 switch 页面标识
                $rootScope.isFirstSwitch = true;

                // 设置为 absolute content 高度不会叠加
                element.css({position:'absolute'});

                // 对于不支持透明度的浏览器，直接显示隐藏，不淡入淡出
                if (jQuery.support.opacity) {
                    element.animate({
                        opacity: 0
                    }, 100, done);
                } else {
                    element.hide();
                    done();
                }
            }
        }
    }])
    // 默认情况下，一个元素动画进行时，子元素是不能进行动画的
    // 此元素在 ng-view 中，所以不生效
    // 需要给 ng-vew 增加 ng-animate-children，强制子元素动画有效
    .animation('.animate-switch', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        return {
            enter: function(element, done) {
                
                // 可以通过在根作用域上设置变量来判断是否第一次进入 switch 页面
                if ($rootScope.isFirstSwitch) {
                    return;
                };

                element = element.parents('.content');

                var height = element.height();
                var outerHeight = element.outerHeight();

                // 初次进入页面时直接显示
                var duration = 500;

                // 先将 height 设置为前一个 view 的高度
                element.css({height: $rootScope.height});

                // 执行 content 动画
                element
                    .animate({
                        'height': height
                    }, {
                        duration: duration,
                        queue: false,
                        easing:'easeOutQuart',
                        complete: function() {
                            // 动画结束后将 height 清空
                            // 使得内部元素可以自动改变 content 的高度
                            element.css({height: 'auto'});

                            // 记录当前 content 高度
                            $rootScope.height = element.height();
                        }
                    });

                $('.dialog').animate({
                    'margin-top': -(outerHeight + 69) / 2
                }, {
                    duration: duration,
                    queue : false,
                    easing:'easeOutQuart'
                });

                // 对于不支持透明度的浏览器，直接显示隐藏，不淡入淡出
                if (jQuery.support.opacity) {
                    element.css({
                        opacity: 0
                    });

                    $timeout(function() {
                        element.animate({
                            opacity: 1
                        }, 300);
                    }, duration, done);
                } else {
                    element.show();
                    done();
                }

            },
            leave: function(element, done) {
                // leave 执行时，以后的 switch 页面需要淡入
                $rootScope.isFirstSwitch = false;

                // 设置为 absolute content 高度不会叠加
                element.css({position:'absolute'});

                // 对于不支持透明度的浏览器，直接显示隐藏，不淡入淡出
                if (jQuery.support.opacity) {
                    element.animate({
                        opacity: 0
                    }, 100, done);
                } else {
                    element.hide();
                    done();
                }
            }
        }
    }]);


// 登录转注册
// 300 ms 淡出
// 500 ms 300 ms 淡入
// 500 ms 高度 transition
// 500 ms margin-top transition

// 注册转登录
// 100 ms 淡出
// 500 ms 300 ms 淡入
// 500 ms 高度 transition
// 500 ms margin-top transition

// 登录转忘记密码
// 100 ms 淡出
// 500 ms 300 ms 淡入
// 500 ms 高度 transition
// 500 ms margin-top transition

// $(".loginform").animate({"opacity":"0"},300);
// setTimeout('$(".loginform").hide();',300);

// 原有 content 300ms 淡出并隐藏

// $(".regform").slideDown({duration:500,easing:'easeOutQuart'}).animate({"opacity":"1"},300);

// 新的 content 500ms 显示 300ms 淡入

// $(".container-dia").animate({"height":"434px"},{duration:500,easing:'easeOutQuart'});
// $(".dialog").animate({"margin-top":"-251px"},{duration:500,easing:'easeOutQuart'});

// content 高度 500ms transition
// dialog top 500ms transition
