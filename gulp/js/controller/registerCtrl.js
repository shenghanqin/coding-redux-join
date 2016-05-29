/**
 * @authCtrl.js 身份验证Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('RegisterCtrl', ['$scope', '$rootScope', '$window', '$http', '$location', '$timeout', '$interval', 'Request', 'Config', 'User', 'Validate', 'Loading',
     function($scope, $rootScope, $window, $http, $location, $timeout, $interval, Request, Config, User, Validate, Loading) {
        $rootScope.dialogTitle = '注册';

        // invalid 用于记录后端返回的错误信息
        // 在指令里会根据 invalid 的信息设置有效性
        $scope.invalid = {};

        // focus 记录需要获取焦点的输入框
        $scope.focus = {};

        // $scope.submitted = false;
        $scope.showBtn = true;

        // 默认不勾选
        $scope.agreed = false;
        $scope.user = {};

        $scope.util.submitted = false;

        var isEmbed = /embed/.test($location.$$url);

        // 注册
        $scope.register = function() {
            // 用户协议未勾选，会有动画提示
            if (!$scope.agreed) {
                $scope.animationTip = true;
                return;
            }

            // submitted 将使所有输入框失焦，触发验证
            $scope.util.submitted = true;

            if ($scope.form.$invalid) {
                Validate.checkErrNumber($scope, $scope.form);
                return;
            }

            Loading.start();

            $scope.clicked = true;

            Request.register({
                'user[cellphone]': $scope.user.mobile,
                'user[email]': $scope.user.mail,
                'ext[cellphone_code]': $scope.user.verification,
                'user[password]': $scope.user.password
            }).then(function(msg){
                // 注册成功
                Loading.done();
                $scope.clicked = false;

                switch (+msg.errno){
                    // 手机已经注册
                    case Config.errnoMap.REGISTERED_CELLPHONE:
                        // ctrl = $scope.form.mobile;
                        // ctrl.$setValidity('mobileRegistered', false);
                        $scope.invalid.mobileRegistered = false;
                        break;
                    // 验证码不正确
                    case Config.errnoMap.INVALID_VCODE:
                        // ctrl = $scope.form.captcha;
                        // ctrl.$setValidity('captchaValid', false);
                        $scope.invalid.captchaValid = false;
                        break;
                    // 需要重新获取验证码
                    case Config.errnoMap.REFRECH_VCODE:
                        // ctrl = $scope.form.captcha;
                        // ctrl.$setValidity('captchaReload', false);
                        $scope.invalid.captchaReload = false;
                        break;
                    // 邮箱已经注册
                    case Config.errnoMap.REGISTERED_EMAIL:
                        // ctrl = $scope.form.mail;
                        // ctrl.$setValidity('emailRegistered', false);
                        $scope.invalid.emailRegistered = false;
                        break;
                    // 注册成功跳转到展示页面
                    case Config.errnoMap.OK:
                        if (isEmbed) {
                            if($window.parent !== $window) {
                                $window.parent.postMessage('isRegistered', 'http://store.smartisan.com');
                            }
                        } else {
                            $location.path('/result/register');
                        }
                        break;
                }
            }, function(err){
                // 注册失败
                Loading.done();
                $scope.clicked = false;
            });
        };

        // 倒计时
        var countdown = function() {
            var count = 60;
            $scope.timer = count;
            $scope.showBtn = false;

            $interval(function() {
                $scope.timer--;
            }, 1000, count).then(function() {
                $scope.showBtn = true;
            });
        };

        // 发送手机验证码
        $scope.resend = function() {
            if ($scope.form.mobile.$invalid || $scope.form.captcha.$invalid) {
                return;
            }

            var obj = {
                'cellphone' : $scope.user.mobile,
                'captcha' : $scope.user.captcha
            };

            // 用于禁用按钮
            $scope.captchaSubmitted = true;

            // 开始调用发送手机验证码
            Request.sendMobileCaptcha(obj).then(function(msg){
                $scope.captchaSubmitted = false;

                if (msg.errno != 0) {
                    switch (+msg.errno) {
                        // 手机已经注册
                        case Config.errnoMap.REGISTERED_CELLPHONE:
                            $scope.invalid.mobileRegistered = false;
                            break;
                        // 验证码不对
                        case Config.errnoMap.ILLEGAL_VCODE:
                        case Config.errnoMap.INVALID_VCODE:
                            $scope.invalid.captchaValid = false;
                            break;
                        // 需要图形验证码
                        // 发送前已经判断了是否存在，所以这个错误不可能在页面返回
                        case Config.errnoMap.CAPTCHA_REQUIRED:
                            $scope.reloadCaptcha();
                            $scope.focus.captcha = true;
                            break;
                        // 需要刷新图形验证码
                        case Config.errnoMap.REFRECH_VCODE:
                            $scope.invalid.captchaValid = false;
                            $scope.reloadCaptcha();
                            $scope.focus.captcha = true;
                            break;
                        // 验证码发送太频繁
                        case Config.errnoMap.VCODE_TOO_OFTEN:
                            countdown();
                            break;
                    }
                } else {
                    // 发送成功以后倒计时
                    countdown();
                }
            }, function(err){});
        };

        $scope.reloadCaptcha = function() {
            $scope.loginCaptchaUrl = User.refreshCaptcha();
        };

        $scope.reloadCaptcha();

        // 检查手机号是否可用
        $scope.validateMobile = function() {
            if ($scope.form.mobile.$invalid) {
                return;
            }

            Request.checkMobile({
                m: 'get',
                cellphone: $scope.user.mobile,
                action: 'check'
            }).then(function(msg){
                if (msg.errno != 0) {
                    switch (msg.errno) {
                        case Config.errnoMap.REGISTERED_CELLPHONE:
                            $scope.invalid.mobileRegistered = false;
                            break;
                        case Config.errnoMap.ILLEGAL_CELLPHONE:
                            $scope.invalid.mobile = false;
                            break;
                    }
                }
            }, function(err){});
        };

        // 检查手机验证码是否正确
        $scope.validateMobileCaptcha = function() {
            if ($scope.form.verification.$invalid) {
                return;
            }

            // 如果手机未验证通过，则输入任何验证码都提示错误
            if ($scope.form.mobile.$invalid) {
                $scope.invalid.mobileCaptchaValid = false;
                return;
            }

            Request.checkMobileCaptcha({
                action: 'renew',
                cellphone: $scope.user.mobile,
                cellphone_code: $scope.user.verification
            }).then(function(msg) {
                if(msg.errno != 0){
                    switch (msg.errno) {
                        case Config.errnoMap.INVALID_VCODE:
                        case Config.errnoMap.ILLEGAL_VCODE:
                            // 验证码不正确
                            $scope.invalid.mobileCaptchaValid = false;
                            break;
                        case Config.errnoMap.REFRECH_VCODE:
                            // 重新获取验证码,错误次数太多
                            $scope.invalid.mobileCaptchaReload = false;
                            break;
                    }
                }
            }, function(err) {

            });
        }

        // 检查邮箱是否可用
        $scope.validateMail = function(){
            if ($scope.form.mail.$invalid) {
                return;
            }

            Request.checkMail({
                m: 'get',
                email: $scope.user.mail,
                action: 'check'
            }).then(function(msg) {
                if(msg.errno != 0){
                    switch (msg.errno) {
                        case Config.errnoMap.REGISTERED_EMAIL:
                            // 邮箱已经注册
                            $scope.invalid.emailRegistered = false;
                            break;
                        case Config.errnoMap.ILLEGAL_EMAIL:
                            // 邮箱格式问题
                            $scope.invalid.mail = false;
                            break;
                    }
                }
            }, function(err){});
        };

        // 跳转到登录页面
        $scope.toLogin = function() {
            if (isEmbed) {
                $location.path('/login/embed');
            } else {
                $location.path('/login');
            }
        };

    }]);
