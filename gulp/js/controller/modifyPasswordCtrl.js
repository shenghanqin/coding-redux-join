/**
 * @authCtrl.js 修改密码Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('ModifyPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Request', 'Config', 'Loading', 'Validate',
     function($scope, $rootScope, $http, $location, Request, Config, Loading, Validate) {

        $rootScope.dialogTitle = '修改密码';

        // invalid 用于记录后端返回的错误信息
        // 在指令里会根据 invalid 的信息设置有效性
        $scope.invalid = {};
        $scope.user = {};
        $scope.oldRequired = true;
        $scope.util.submitted = false;
        var linkObj = $location.search();

        // 因为多次跳转之后URL还是可能携带code，所以需要先判断currentToken
        if (!$rootScope.currentToken) {
            // 假如是从邮箱跳转过来的，则把链接中code和uid赋给当前token和当前uid
            if(linkObj && linkObj.code) {
                // 忘记密码渠道，修改密码不需要旧密码
                $scope.oldRequired = false;

                $rootScope.currentUid = linkObj.uid;
                 // 需要获取token
                var obj = {
                    'for': 'FIND_PASSWORD',
                    'uid': linkObj.uid,
                    'email_code': linkObj.code
                };

                Request.checkUpdateCaptcha(obj).then(function(msg) {
                    if (msg.errno == '0') {
                        // 保存当前token
                        $rootScope.currentToken = msg.data;
                    } else {
                        // 邮箱验证码失效
                        $location.path('/forgotPassword'); 
                    }
                }, function(err) {});
            }
        } else {
            // 通过手机或安全问题验证，修改密码不需要旧密码
            $scope.oldRequired = false;
        }

        $scope.modify = function() {
            $scope.util.submitted = true;

            if (!$scope.form.$valid) {
                Validate.checkErrNumber($scope, $scope.form);
                return;
            }

            Loading.start();

            var obj = {};

            if ($scope.oldRequired) {
                // 需要输入旧密码
                obj = {
                    'user[password]': $scope.user.password,
                    'ext[password]': $scope.user.oldpassword
                }
            } else {
                obj = {
                    'user[password]': $scope.user.password,
                    'ext[token]': $rootScope.currentToken
                };

                // 如果uid有的话，则优先传uid
                if ($rootScope.currentUid) {
                    obj.uid = $rootScope.currentUid;
                }
                if (linkObj.username) {
                    obj.username = linkObj.username;
                }
            }

            Request.updateUserPassword(obj).then(function(msg) {
                Loading.done();

                switch (+msg.errno) {
                    case Config.errnoMap.OK:
                        $location.path('/result/modifyPassword');
                        break;
                    
                    // 密码格式不对
                    case Config.errnoMap.ILLEGAL_PASSWORD:
                        $scope.invalid.passwordValid = false;
                        break;
                    
                    // 旧密码输入错误
                    case Config.errnoMap.INVALID_PASSWORD:
                        $scope.invalid.oldpasswordValid = false;
                        break;
                }
            }, function(err){
                Loading.done();
            });
        }
    }]);