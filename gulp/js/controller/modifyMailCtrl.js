/**
 * @authCtrl.js 修改密码Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('ModifyMailCtrl', ['$scope', '$rootScope', '$http', '$location', 'Request', '$interval', 'Config', 'Loading', 
     function($scope, $rootScope, $http, $location, Request, $interval, Config, Loading) {

        $rootScope.dialogTitle = '修改邮箱';
        
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
                // 假如是从邮箱跳转过来的，则需要生成token
                var obj = {
                    'for': 'UPDATE_EMAIL',
                    'uid': linkObj.uid || '',
                    'email_code': linkObj.code
                };

                Request.checkUpdateCaptcha(obj).then(function(msg) {
                    if(msg.errno == '0'){
                        // 保存当前token
                        $rootScope.currentToken = msg.data;
                    } else {
                        // 邮箱验证码失效
                        $location.path('/auth/modifyMail');
                    }
                }, function(err){});
            } else {
                $location.path('/auth/modifyMail');
            }
        }

        // 倒计时
        var countdown = function(minute) {
            var count = 60 * (minute || 1);
            $scope.timer = count;
            $scope.showBtn = false;

            $interval(function() {
                $scope.timer--;
            }, 1000, count).then(function() {
                $scope.showBtn = true;
            });
        };

        // 重新发送邮箱
        $scope.resend = function() {
            countdown(5);
            // 开始调用发送手机验证码
            Loading.start();
            
            Request.sendNewEmail({
                email: $scope.newEmail,
                uid: $rootScope.currentUid
            }).then(function(msg) {
                Loading.done();
            }, function(err) {
                Loading.done();
            });
        };

        // 输入正确的邮箱，然后点击下一步
        $scope.next = function() {
            $scope.util.submitted = true;

            if (!$scope.form.$valid) {
                return;
            }
            
            Loading.start();

            Request.modifyMail({
                'uid': $rootScope.currentUid,
                'user[email]': $scope.user.mail,
                'ext[token]': $rootScope.currentToken
            }).then(function(msg) {
                Loading.done();

                switch (+msg.errno) {
                    case Config.errnoMap.OK :
                        $scope.submitted = false;
                        $scope.newEmail = $scope.user.mail;
                        $scope.current = 'step2';
                        $rootScope.dialogTitle = '修改邮箱成功';
                        countdown(5);
                        break;
                    
                    case Config.errnoMap.REGISTERED_EMAIL :
                        $scope.invalid.emailRegistered = false;
                        break;
                    
                    case Config.errnoMap.ILLEGAL_EMAIL :
                        $scope.invalid.emailRegistered = false;
                        break;
                    
                    case Config.errnoMap.VCODE_TOO_OFTEN :
                        $scope.submitted = false;
                        $scope.newEmail = $scope.user.mail;
                        $scope.current = 'step2';
                        $rootScope.dialogTitle = '修改邮箱成功';
                        countdown(5);
                        break;
                    
                    default :
                        // 跳转到安全验证页面
                        $location.path('/auth/modifyMail');
                        break;
                }
            }, function(err){
                Loading.done();
            });
        };

        // 查看邮箱
        $scope.gotoEmail = function(){
            var newEmail = $scope.newEmail;
            var postfix = newEmail.split('@')[1];

            // 配置了常用的邮件地址，其余直接添加mail前缀
            var mailUrl = Config.mailUrl[postfix] || 'http://mail.' + postfix + '/';
            window.open(mailUrl);
        };
    }]);