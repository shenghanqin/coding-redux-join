/**
 * @authCtrl.js 修改密码Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('ModifyMobileCtrl', ['$scope', '$rootScope', '$http', '$location', 'Request', '$interval', 'Config', 'Loading',
     function($scope, $rootScope, $http, $location, Request, $interval, Config, Loading) {

        $rootScope.dialogTitle = '修改手机';

        // invalid 用于记录后端返回的错误信息
        // 在指令里会根据 invalid 的信息设置有效性
        $scope.invalid = {};
        $scope.user = {};
        $scope.util.submitted = false;
        
        var linkObj = $location.search();

        // 因为多次跳转之后URL还是可能携带code，所以需要先判断currentToken
        // 如果没有token，说明是直接输入mobifyMobile过来的，则跳转到验证身份页面
        if (!$rootScope.currentToken) {
            // 假如是从邮箱跳转过来的，则把链接中code和uid赋给当前token和当前uid
            if(linkObj && linkObj.code) {
                $rootScope.currentUid = linkObj.uid || '';

                var obj = {
                    'for': 'UPDATE_CELLPHONE',
                    'uid': linkObj.uid || '',
                    'email_code': linkObj.code
                };

                // 需要生成新的token
                Request.checkUpdateCaptcha(obj).then(function(msg) {
                    if(msg.errno == '0'){
                        // 保存当前token
                        $rootScope.currentToken = msg.data;
                    } else {
                        // 邮箱验证码失效
                        $location.path('/auth/modifyMobile');
                    }
                }, function(err){});
            } else {
                $location.path('/auth/modifyMobile');
            }
        }
        
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
            countdown();
            // 开始调用发送手机验证码
            Loading.start();
            Request.sendNewMobileCaptcha({
                cellphone: $scope.newMobile,
                // token: $rootScope.currentToken,
                uid: $rootScope.currentUid
            }).then(function(msg){
                Loading.done();
            }, function(err){
                Loading.done();
            });
        };

        // 输入新手机，然后点击下一步
        $scope.step1 = function() {
            $scope.util.submitted = true;

            if (!$scope.form.$valid) {
                return;
            }

            Loading.start();

            Request.sendNewMobileCaptcha({
                cellphone: $scope.user.mobile,
                token: $rootScope.currentToken,
                uid: $rootScope.currentUid
            }).then(function(msg) {
                Loading.done();

                switch (+msg.errno) {
                    case Config.errnoMap.OK :
                    case Config.errnoMap.VCODE_TOO_OFTEN :
                        $scope.current = 'step2';
                        $scope.util.submitted = false;
                        $scope.newMobile = $scope.user.mobile;
                        // 重新发送验证码
                        countdown();
                        break;
                    case Config.errnoMap.REGISTERED_CELLPHONE :
                        $scope.invalid.mobileRegistered = false;
                        break;
                    default :
                        $location.path('/auth/modifyMobile');
                        break;
                }
            }, function(){
                Loading.done();
            });
        };

        // 确定修改新手机
        $scope.step2 = function() {
            $scope.util.submitted = true;

            if (!$scope.form.$valid) {
                return;
            }
            
            Loading.start();
            
            // 输入验证码
            Request.updateUserMobile({
                uid: $rootScope.currentUid,
                'user[cellphone]': $scope.newMobile,
                'ext[cellphone_code]': $scope.user.verification
            }).then(function(msg) {
                Loading.done();

                switch (+msg.errno) {
                    case Config.errnoMap.OK :
                        $location.path('/result/modifyMobile');
                        break;
                    
                    case Config.errnoMap.INVALID_VCODE :
                    case Config.errnoMap.ILLEGAL_VCODE :
                        $scope.invalid.mobileCaptchaValid = false;
                        break;
                    case Config.errnoMap.REFRECH_VCODE :
                        $scope.invalid.mobileCaptchaReload = false;
                        break;
                    default :
                        $location.path('/auth/modifyMobile');
                        break;
                }
            }, function(err){
                Loading.done();
                $location.path('/auth/modifyMobile');
            });
        };
    }]);
