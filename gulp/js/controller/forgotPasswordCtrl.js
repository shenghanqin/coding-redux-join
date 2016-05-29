/**
 * @authCtrl.js 修改密码Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Request', 'Config', 'User', 'Validate', 'Loading',
     function($scope, $rootScope, $http, $location, Request, Config, User, Validate, Loading) {

        $rootScope.dialogTitle = '忘记密码';

        // invalid 用于记录后端返回的错误信息
        // 在指令里会根据 invalid 的信息设置有效性
        $scope.invalid = {};
        $scope.util.submitted = false;
        // focus 记录需要获取焦点的输入框
        $scope.focus = {};

        $scope.next = function() {
            $scope.util.submitted = true;

            if (!$scope.form.$valid) {
                Validate.checkErrNumber($scope, $scope.form);
                return;
            }

            Loading.start();

            var obj = $scope.user;

            // 验证手机或邮箱
            Request.getNoLoginAuths(obj).then(function(msg) {
                Loading.done();

                switch (+msg.errno) {
                    case 0:
                        $location.path('/auth/forgotPassword');
                        $rootScope.forgotPasswordMsg = msg;
                        break;
                    // 手机号或邮箱不存在
                    case Config.errnoMap.INVALID_CELLPHONE:
                    case Config.errnoMap.ILLEGAL_CELLPHONE:
                    case Config.errnoMap.INVALID_UID:
                    case Config.errnoMap.ILLEGAL_EMAIL:
                    case Config.errnoMap.INVALID_EMAIL:
                        $scope.invalid.nameValid = false;
                        $scope.focus.username = true;
                        break;
                    case Config.errnoMap.ILLEGAL_VCODE:
                    case Config.errnoMap.INVALID_VCODE:
                        // 验证码不对
                        $scope.invalid.captchaValid = false;
                        $scope.focus.captcha = true;
                        break;
                    // 需要刷新验证码
                    case Config.errnoMap.REFRECH_VCODE:
                        $scope.reloadCaptcha();
                        $scope.invalid.captchaValid = false;
                        $scope.focus.captcha = true;
                        break;
                }

            }, function(err){
                Loading.done();
            });
        };

        $scope.reloadCaptcha = function() {
            $scope.captchaUrl = User.refreshCaptcha();
        };

        $scope.reloadCaptcha();
    }]);