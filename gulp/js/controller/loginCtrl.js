/**
 * @authCtrl.js 身份验证Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */
accountAppControllers.
    controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', '$window', '$timeout', 'User', 'Request', '$routeParams', 'Config', 'Validate', 'Loading',
     function($scope, $rootScope, $http, $location, $window, $timeout, User, Request, $routeParams, Config, Validate, Loading) {

        $rootScope.dialogTitle = '登录';

        // invalid 用于记录后端返回的错误信息
        // 在指令里会根据 invalid 的信息设置有效性
        $scope.invalid = {};

        // focus 记录需要获取焦点的输入框
        $scope.focus = {};
        $scope.util.submitted = false;

        var isEmbed = /embed/.test($location.$$url);

        // 检查参数值，假如为空，则直接跳转到非法操作页
        // 放开登录页面，不需要检查参数了
        /*
        if (!$routeParams.action) {
            $location.path('/');
        } else {
            // 检查参数是否合法
            var actionArgs = ['modifyMobile', 'modifyMail', 'modifyQuestion', 'modifyPassword'];
            var argIndex;

            angular.forEach(actionArgs, function(v){
                if(v == $routeParams.action){
                    argIndex = 1;
                    return false;
                }
            });

            if(!argIndex){
                // 如果不存在，则跳转到非法页
                $location.path('/');
            }
        }*/
        
        // 登录
        $scope.login = function() {
            // submitted 将使所有输入框失焦，触发验证
            $scope.util.submitted = true;
            
            if($scope.form.$invalid) {
                // 检查错误数量，判断是否显示动画
                Validate.checkErrNumber($scope, $scope.form);
                return;
            }

            var obj = $scope.user;

            Loading.start();
            
            Request.login(obj).then(function(msg) {
                Loading.done();

                switch (msg.errno) {
                    // 密码不对
                    case Config.errnoMap.ILLEGAL_PASSWORD:
                    case Config.errnoMap.INVALID_PASSWORD:
                        // ctrl = $scope.form.password;
                        // ctrl.$setValidity('passwordValid', false);
                        $scope.invalid.passwordValid = false;
                        $scope.focus.password = true;
                        break;

                    // 用户名不存在
                    case Config.errnoMap.INVALID_CELLPHONE:
                    case Config.errnoMap.INVALID_UID:
                    case Config.errnoMap.INVALID_EMAIL:
                        // ctrl = $scope.form.username;
                        // ctrl.$setValidity('nameValid', false);
                        $scope.invalid.nameValid = false;
                        break;
                    
                    // 验证码不对
                    case Config.errnoMap.ILLEGAL_VCODE:
                    case Config.errnoMap.INVALID_VCODE:
                        // ctrl = $scope.form.captcha;
                        // ctrl.$setValidity('captchaValid', false);
                        $scope.invalid.captchaValid = false;
                        $scope.focus.captcha = true;
                        break;
                    
                    // 需要验证码
                    case Config.errnoMap.CAPTCHA_REQUIRED:
                        $scope.captchaNeeded = true;
                        $scope.loginCaptchaUrl = msg.data.captcha;
                        // 这里有个 slidedown 的动画，直接获取焦点会导致动画变形
                        // 所以硬编码 500 ms 延时
                        $timeout(function() {
                            $scope.focus.captcha = true;
                        }, 500);
                        break;
                    
                    // 需要刷新验证码
                    case Config.errnoMap.REFRECH_VCODE:
                        $scope.captchaNeeded = true;
                        $scope.reloadCaptcha();
                        // ctrl = $scope.form.captcha;
                        // ctrl.$setValidity('captchaValid', false);
                        $scope.invalid.captchaValid = false;
                        $scope.focus.captcha = true;
                        break;
                    
                    // 密码错误，需要验证码
                    case Config.errnoMap.FAILED_LOGIN_LIMIT:
                        // ctrl = $scope.form.password;
                        // ctrl.$setValidity('passwordValid', false);
                        $scope.invalid.passwordValid = false;
                        $scope.focus.password = true;

                        $scope.captchaNeeded = true;
                        $scope.loginCaptchaUrl = msg.data.captcha;
                        break;
                    
                    case Config.errnoMap.OK:
                        // 内嵌页面，通知父页面登录成功
                        if (isEmbed) {
                            if($window.parent !== $window) {
                                $window.parent.postMessage('isLoggedIn', 'http://store.smartisan.com');
                            }
                        } else {
                            var url = $routeParams.action;

                            switch (url) {
                                // 密码可以直接修改
                                case 'modifyPassword':
                                    $location.path('/' + url);
                                    break;

                                // 手机、邮箱、安全问题需要验证身份
                                case 'modifyMobile':
                                case 'modifyMail':
                                case 'modifyQuestion':
                                    $location.path('/auth/' + url);
                                    break;

                                // 登录成功
                                default:
                                    $location.path('/result/login');
                                    break;
                            }
                        }
                        break;
                };
            }, function(err) {
                Loading.done();
            });
        };

        // 跳转到登录页面
        $scope.toRegister = function() {
            if (isEmbed) {
                $location.path('/register/embed');
            } else {
                $location.path('/register');
            }
        };

        // 忘记密码 
        $scope.forgotPassword = function() {
            // TODO
            // 这里需要进一步考虑，如果用户已经登录，是否还有更好的处理
            if (isEmbed) {
                $window.open('https://account.smartisan.com/#/forgotPassword');
            } else {
                $location.path('/forgotPassword');
            }
        };
        
        $scope.reloadCaptcha = function(){
            var tempUrl = $scope.loginCaptchaUrl;

            if (tempUrl.lastIndexOf('?') > 0) {
                tempUrl = tempUrl + '&' + (+new Date);
            } else {
                tempUrl = tempUrl + '?' + (+new Date);
            }

            $scope.loginCaptchaUrl = tempUrl;
        };
    }]);