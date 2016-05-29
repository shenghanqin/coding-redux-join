/**
 * @directives.js 自定义指令
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppDirectives.
    directive('iAutoFocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                if (elm) {
                    // 这里是为了避免 focus 时触发 digest
                    $timeout(function() {
                        elm.focus();
                    }, 10);
                }
            }
        };
    }]).
    // 当满足条件时获取焦点
    // 例如验证码
    directive('focusOn', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                scope.$watch(attrs.focusOn, function(value) {
                    if (value) {
                        // 这里是为了避免 focus 时触发 digest
                        $timeout(function() {
                            elm.focus();
                        }, 10);
                    }
                });
            }
        };
    }]).
    // 当满足条件时选中输入框内文本
    // 例如验证码
    directive('selectOn', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                scope.$watch(attrs.selectOn, function(value) {
                    if (value) {
                        // 这里是为了避免 focus 时触发 digest
                        $timeout(function() {
                            elm.select();
                        }, 10);
                    }
                });
            }
        };
    }]).
    directive('iFocus', [function() {
        var FOCUS_CLASS = 'i-focused';

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$focused = false;
                // 还没有获得焦点，所以认为没有失去焦点
                ctrl.$blurred = false;

                elm.on('focus', function(evt) {
                    elm.addClass(FOCUS_CLASS);
                    scope.$apply(function() {
                        ctrl.$focused = true;
                    });
                }).on('blur', function(evt) {
                    elm.removeClass(FOCUS_CLASS);
                    scope.$apply(function() {
                        ctrl.$focused = false;
                        ctrl.$blurred = true;
                    });
                }).on('keydown', function(evt) {
                    scope.$apply(function() {
                        ctrl.$blurred = false;
                    });
                });

                // 这里耦合了业务逻辑，如果用户直接点登录，则报错以后认为所有输入框都触发了失焦事件
                // 避免用户输入一个输入框内容时所有提示同时消失
                // 用户点击提交，则认为当前的输入框全部失去焦点
                // 验证判断时只需要判断 ctrl.$blurred
                // scope.$watch('submitted', function() {
                //     if (scope.submitted == true) {
                //         ctrl.$blurred = true;
                //     }
                // });
            }
        };
    }]).
    // 失去焦点触发验证
    directive('iBlur', [function() {
        var BLUR_CLASS = 'i-blurred';

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                // 还没有获得焦点，所以认为没有失去焦点
                ctrl.$blurred = false;

                elm.on('keydown', function(evt) {
                    elm.removeClass(BLUR_CLASS);
                    scope.$apply(function() {
                        ctrl.$blurred = false;
                    });
                }).on('blur', function(evt) {
                    elm.addClass(BLUR_CLASS);
                    scope.$apply(function() {
                        ctrl.$blurred = true;
                    });
                });

                // 这里耦合了业务逻辑，如果用户直接点登录，则报错以后认为所有输入框都触发了失焦事件
                // 避免用户输入一个输入框内容时所有提示同时消失
                // 用户点击提交，则认为当前的输入框全部失去焦点
                // 验证判断时只需要判断 ctrl.$blurred
                // scope.$watch('submitted', function() {
                //     if (scope.submitted == true) {
                //         ctrl.$blurred = true;
                //     }
                // });
            }
        };
    }]).
    // 自定义input事件处理
    directive('iInput', function() {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                // input获取焦点事件
                elm.on('focus', function() {
                    $(this).parent('.input').addClass('focus');

                    if (!jQuery.support.opacity) {
                        return;
                    }

                    $(this).parent('.input').animate({
                        opacity : 1
                    }, {
                        queue : false,
                        duration : 300
                    });
                });
                // input失去焦点事件
                elm.on('blur', function() {
                    $(this).parent('.input').removeClass('focus');

                    // 当前输入为空
                    if (!$(this).val()) {
                        $(this).prev('.placeholder').show();

                        if (!jQuery.support.opacity) {
                            return;
                        }
                        $(this).parent('.input').animate({
                            opacity : 0.618
                        }, {
                            queue : false,
                            duration : 300
                        });
                    }
                });
                // input输入事件
                // propertychange用于IE下内容发生改变而没有输入
                // input用于标准浏览器没有输入内容而内容改变，比如有记忆列表
                elm.on('keydown input', function(event) {
                    // 用户输入内容，清空 placeholder
                    $(this).prev('.placeholder').hide();
                    
                    if (event.which != 13) {
                        // 输入框获取焦点，重置提交状态
                        ctrl.$submitted = false;
                        scope.util.submitted = false;
                        // 重置错误动画
                        scope.errAnimation = {};
                        
                        // 清空后端错误信息
                        // TODO 这里最好也根据当前的 input 具体重置某一项
                        // 重置所有焦点
                        angular.forEach(scope.focus, function(item, key) {
                            scope.focus[key] = false;
                        });

                        // 增加设置当前model关联的错误属性置空
                        switch (ctrl.$name) {
                            case 'username':
                                scope.invalid.nameValid = true;
                                break;

                            case 'password':
                                scope.invalid.passwordValid = true;
                                break;

                            case 'oldpassword':
                                scope.invalid.oldpasswordValid = true;
                                break;
                            
                            case 'captcha':
                                scope.invalid.captchaValid = true;
                                scope.invalid.captchaReload = true;
                                break;
                            
                            case 'mobile':
                                scope.invalid.mobileRegistered = true;
                                break;
                            
                            case 'mail':
                                scope.invalid.emailRegistered = true;
                                break;
                            
                            case 'verification':
                                scope.invalid.mobileCaptchaValid = true;
                                scope.invalid.mobileCaptchaReload = true;
                                break;
                            case 'answer1':
                            case 'answer2':
                                scope.invalid.answerInvalid = true;
                                break;
                        }

                        // 后端返回的错误无处清理，这里暂时硬编码了业务逻辑
                        /*angular.forEach(ctrl.$error, function(item, key) {
                            ctrl.$setValidity(key, true);
                        });*/
                    }
                });


                // elm.parent().prepend('<div class="border-inner"></div>');

                // 这里耦合了业务逻辑，如果用户直接点登录，则将每个ctrl的submitted设置为true
                // 以此触发提交的验证逻辑
                scope.$watch('util.submitted', function(value) {
                    if (value) {
                        ctrl.$submitted = true;
                        ctrl.$blurred = true;
                    }
                });
            }
        };
    }).
    // 验证用户名
    directive('iUsername', ['Config', function(Config) {

        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                // 根据输入进行验证
                ctrl.$parsers.push(function(value) {
                    // value = value || '';

                    if (!value || (Config.regExp.isMail).test(value) || (Config.regExp.isMobile).test(value)) {
                        ctrl.$setValidity(ctrl.$name, true);
                        return value;
                    } else {
                        ctrl.$setValidity(ctrl.$name, false);
                        return undefined;
                    }

                });
            }
        };
    }]).
    // 注册时验证密码格式
    directive('iPassword', ['Config', function(Config) {

        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.push(function(value) {
                    value = value || '';
                    if (!value || (Config.regExp.isPassword).test(value)) {
                        ctrl.$setValidity('password', true);
                        return value;
                    } else {
                        ctrl.$setValidity('password', false);
                        return undefined;
                    }

                });
            }
        };
    }]).
    // 验证重复密码一致性
    directive('iRepassword', ['Config', function(Config) {

        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {

                scope.$watch(function() {
                    // 如果用户未输入时，user 不存在，所以要先判断
                    return (scope.user && (scope.user.repassword == scope.user.password));
                }, function(newValue, oldValue) {
                    // 第一次判断时两个都是 undefined，不进行判断
                    if (newValue == oldValue) {
                        return;
                    }

                    if (newValue) {
                        ctrl.$setValidity('repassword', true);
                    } else {
                        ctrl.$setValidity('repassword', false);
                    }
                });
            }
        };
    }]).
    // 验证手机号
    directive('iMobile', ['Config', function(Config) {

        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.push(function(value) {
                    // value = value || '';

                    if (!value || (Config.regExp.isMobile).test(value)) {
                        ctrl.$setValidity(ctrl.$name, true);
                        return value;
                    } else {
                        ctrl.$setValidity(ctrl.$name, false);
                        return undefined;
                    }

                });
            }
        };
    }]).
    // 验证邮箱
    directive('iMail', ['Config', function(Config) {

        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.push(function(value) {
                    // value = value || '';

                    // 非空验证在required里进行，这里忽略
                    if (!value || (Config.regExp.isMail).test(value)) {
                        ctrl.$setValidity(ctrl.$name, true);
                        return value;
                    } else {
                        ctrl.$setValidity(ctrl.$name, false);
                        return undefined;
                    }

                });
            }
        };
    }]).
    // 根据后端返回的信息验证
    directive('iResponse', ['Validate', function(Validate) {

        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                switch (ctrl.$name) {
                    case 'username':
                        scope.$watch('invalid.nameValid', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('nameValid', true);
                            } else {
                                ctrl.$setValidity('nameValid', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        break;
                    
                    case 'password':
                        scope.$watch('invalid.passwordValid', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('passwordValid', true);
                            } else {
                                ctrl.$setValidity('passwordValid', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        break;
                    
                    case 'oldpassword':
                        scope.$watch('invalid.oldpasswordValid', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('oldpasswordValid', true);
                            } else {
                                ctrl.$setValidity('oldpasswordValid', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        break;
                    
                    case 'captcha':
                        scope.$watch('invalid.captchaValid', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('captchaValid', true);
                            } else {
                                ctrl.$setValidity('captchaValid', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        scope.$watch('invalid.captchaReload', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('captchaReload', true);
                            } else {
                                ctrl.$setValidity('captchaReload', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        break;
                    
                    case 'mobile':
                        scope.$watch('invalid.mobileRegistered', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('mobileRegistered', true);
                            } else {
                                ctrl.$setValidity('mobileRegistered', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }

                        });

                        scope.$watch('invalid.mobile', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('mobile', true);
                            } else {
                                ctrl.$setValidity('mobile', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }

                        });
                        break;
                    
                    case 'mail':
                        scope.$watch('invalid.emailRegistered', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('emailRegistered', true);
                            } else {
                                ctrl.$setValidity('emailRegistered', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        scope.$watch('invalid.mail', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('mail', true);
                            } else {
                                ctrl.$setValidity('mail', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        break;
                    
                    case 'verification':
                        scope.$watch('invalid.mobileCaptchaValid', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('mobileCaptchaValid', true);
                            } else {
                                ctrl.$setValidity('mobileCaptchaValid', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        scope.$watch('invalid.mobileCaptchaReload', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('mobileCaptchaReload', true);
                            } else {
                                ctrl.$setValidity('mobileCaptchaReload', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        break;
                    case 'answer1':
                    case 'answer2':
                        scope.$watch('invalid.answerInvalid', function(value) {
                            // 默认为 true
                            value = typeof value == 'undefined' ? true : value;

                            if (value) {
                                ctrl.$setValidity('answerInvalid', true);
                            } else {
                                ctrl.$setValidity('answerInvalid', false);
                                Validate.checkErrNumber(scope, scope.form);
                            }
                            
                        });
                        break;
                }
                
            }
        };
    }]).
    // dom元素渐显动画，当iShow值为真时，动画生效
    directive('iShow', ['$timeout', function($timeout) {

        return {
            restrict : 'A',
            link : function(scope, elm, attrs, ctrl) {
                // var hideTimer;
                scope.$watch(attrs.iShow, function(value) {

                    if (value) {
                        if (!jQuery.support.opacity) {
                            elm.stop().show();
                        } else {
                            elm.stop().show().animate({
                                opacity : 1
                            }, {
                                queue : false,
                                duration : 300
                            });
                        }
                    } else {
                        if (!jQuery.support.opacity) {
                            elm.stop().hide();
                        } else {
                            elm.stop().animate({
                                opacity : 0
                            }, {
                                duration : 300,
                                done : function() {
                                    elm.hide();
                                }
                            });
                        }
                    }
                });
            }
        };
    }]).
    // 错误信息显示
    directive('iWarning', [function() {

        return {
            restrict : 'A',
            link : function(scope, elm, attrs, ctrl) {
                var parent = elm.parent('.input');

                scope.$watch(attrs.iWarning, function(newVal, oldVal) {
                    // newVal oldVal 可能是 undefined
                    // 转化成布尔值比较才准确
                    if (!!newVal === !!oldVal) {
                        return;
                    }

                    if (newVal) {
                        parent.addClass('invalid');

                        if (!jQuery.support.opacity) {
                            elm.stop().show();
                        } else {
                            elm.stop().show().animate({
                                opacity : 1
                            }, {
                                queue : false,
                                duration : 300
                            });
                        }
                    } else {
                        parent.removeClass('invalid');

                        if (!jQuery.support.opacity) {
                            elm.stop().hide();
                        } else {
                            elm.stop().animate({
                                opacity : 0
                            }, {
                                duration : 300,
                                done : function() {
                                    elm.hide();
                                }
                            });
                        }
                    }
                });
            }
        };
    }]).
    // 验证码slideDown效果
    directive('slideDown', ['$timeout', function($timeout) {

        return {
            restrict : 'A',
            link : function(scope, elm, attrs, ctrl) {

                scope.$watch(attrs.slideDown, function(value) {
                    if (value) {
                        // 获取 content 元素
                        // 根据 content 的高度修改 dialog 的 margin-top
                        // 先显示该元素，才能准确获得展开以后 content 的高度
                        elm.show();
                        var height = elm.parents('.content').outerHeight();
                        var duration = 500;
                        
                        $('.dialog').animate({'margin-top':-(height + 69)/2},{duration:duration, queue : false, easing:'easeOutQuart'});
                        
                        elm.hide().slideDown({duration : duration, easing : 'easeOutQuart'});
                    }
                });
            }
        };
    }]).
    // 错误信息抖动效果
    directive('iAnimation', [function() {

        return {
            restrict : 'A',
            link : function(scope, elm, attrs, ctrl) {

                scope.$watch(attrs.iAnimation, function(value) {
                    if (value) {
                        elm.stop(true).animate({'left':'-15px'},50)
                            .animate({'left':'20px'},80)
                            .animate({'left':'-10px'},80)
                            .animate({'left':'5px'},80)
                            .animate({'left':'0px'},80);

                        if (scope.animationTip) {
                            scope.animationTip = false;
                        }
                    }
                });
            }
        };
    }]).
    // 回车确认
    directive('iEnter', [function() {
        return function(scope, elm, attrs, ctrl) {
            elm.bind('keydown keypress', function(event) {
                if (event.which == 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.iEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            })
        };
    }]).
    // 精确的长度限制
    directive('limitLength', [function() {
        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {

                ctrl.$parsers.push(function(value) {
                    if (!value || value.length == +attrs.limitLength) {
                        ctrl.$setValidity('limitlength', true);
                        return value;
                    } else {
                        ctrl.$setValidity('limitlength', false);
                        return undefined;
                    }
                });
            }
        };
    }]).
    // input圆角
    directive('inputRadius', [function() {
        return {
            restrict : 'A',
            link : function(scope, elm, attrs, ctrl) {
                elm.find(':first').before('<div class="radius-left"></div><div class="radius-center"></div><div class="radius-right"></div>');
                // elm.find('.warning').append('<div class="warning-left"></div><div class="warning-right"></div>');
            }
        };
    }]).
    // input圆角
    directive('btnRadius', [function() {
        return {
            restrict : 'A',
            link : function(scope, elm, attrs, ctrl) {
                elm.find(':first').before('<div class="radius-left"></div><div class="radius-right"></div>');
            }
        };
    }]).
    // 模拟label
    directive('iLabel', [function() {
        return {
            restrict : 'A',
            link : function(scope, elm, attrs, ctrl) {
                var label = attrs.iLabel;
                // 这里要用 _ 连接，- 在 ng 的指令里不识别
                var mousedownTag = label + '_mousedown';

                // mousedown click mouseup
                // 如果按住鼠标不起来，则 click 未触发时元素已经消失
                // 所以在 mousedown 为 true 时，强制显示元素
                elm.on('click', function() {
                    $('#' + label).focus();
                }).on('mousedown', function() {
                    scope[mousedownTag] = true;
                }).on('mouseup', function() {
                    scope[mousedownTag] = false;
                });
            }
        };
    }]);