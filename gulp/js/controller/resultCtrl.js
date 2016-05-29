/**
 * @resultCtrl.js 结果回调页面Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('ResultCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'Request', 'Config',
        function($scope, $rootScope, $http, $location, $routeParams, Request, Config) {

        var dialogTitle = '';
        var resultInfo = '';

        switch ($routeParams.channelID) {
            case 'register' :
                dialogTitle = '注册成功';
                resultInfo = '您已经注册成功，请妥善保存您的账号和密码。';
                $rootScope.title = '注册成功';
                break;
            
            case 'login' :
                dialogTitle = '登录成功';
                resultInfo = '您已经登录成功。';
                $rootScope.title = '登录成功';
                break;
            
            case 'modifyPassword' :
                dialogTitle = '密码重置成功';
                resultInfo = '您的密码已经重置成功。';
                $rootScope.title = '密码重置成功';
                break;
            
            case 'modifyMobile' :
                dialogTitle = '修改手机成功';
                resultInfo = '您的手机已经修改成功。';
                $rootScope.title = '修改手机成功';
                break;
            
            // 修改邮箱需要执行业务逻辑
            case 'modifyMail' :
                // 此处修改邮箱，由于是跳转过来的，所以需要特殊处理
                var req = $location.search();
                updateMail(req);
                break;
            
            case 'modifyQuestion' :
                dialogTitle = '修改密码保护问题成功';
                resultInfo = '您的密码保护问题修改成功。';
                $rootScope.title = '修改密保成功';
                break;
            
            // 激活邮箱需要执行业务逻辑
            case 'activateMail' :
                var req = $location.search();
                activeMail(req);
                break;
            
            case 'illegality' :
                // 没有权限，跳转到此地
                dialogTitle = '没有权限';
                resultInfo = '没有操作权限。';
                $rootScope.title = '没有权限';
                $scope.fail = true;
                break;
            
            case 'error' :
                dialogTitle = '操作失败';
                resultInfo = '操作失败。';
                $rootScope.title = '操作失败';
                $scope.fail = true;
                break;
            
            case 'system' :
                dialogTitle = '系统错误';
                resultInfo = '系统错误，请稍候重试。';
                $rootScope.title = '系统错误';
                $scope.fail = true;
                break;
            
            case 'unauthorized' :
                dialogTitle = '没有权限';
                resultInfo = '您需要登录才能进行刚才的操作，请返回首页重新登录。';
                $rootScope.title = '没有权限';
                $scope.fail = true;
                break;
            
            default :
                $location.path('/');
                break;
        }

        $rootScope.dialogTitle = dialogTitle;
        $scope.resultInfo = resultInfo;

        // 修改用户邮箱核心
        function updateMail(req) {
            if (req && req.code){
                Request.updateUserEmail({
                    uid: req.uid,
                    'user[email]': req.email,
                    'ext[email_code]': req.code
                }).then(function(msg) {
                    if (msg.errno == '0') {
                        dialogTitle = '修改邮箱成功';
                        resultInfo = '您的邮箱已经修改成功。';
                        $rootScope.title = '修改邮箱成功';
                    } else {
                        dialogTitle = '修改邮箱失败';
                        resultInfo = '您的邮箱修改失败。';
                        $rootScope.title = '修改邮箱失败';
                        $scope.fail = true;
                    }

                    $rootScope.dialogTitle = dialogTitle;
                    $scope.resultInfo = resultInfo;
                }, function(err){
                    $location.path('/result/error');
                });
            } else {
                $location.path('/');
            }
        }

        // 激活用户注册的邮箱
        function activeMail(req) {
            if (req && req.code) {
                Request.activeUserEmail({
                    'uid': req.uid,
                    'active': 'email',
                    'email_code': req.code
                }).then(function(msg) {
                    if (msg.errno == '0') {
                        dialogTitle = '激活邮箱成功';
                        resultInfo = '您的邮箱已经激活成功。';
                        $rootScope.title = '激活邮箱成功';
                    } else {
                        dialogTitle = '激活邮箱失败';
                        resultInfo = '您的邮箱激活失败。';
                        $rootScope.title = '激活邮箱失败';
                        $scope.fail = true;
                    }

                    $rootScope.dialogTitle = dialogTitle;
                    $scope.resultInfo = resultInfo;
                }, function(err) {
                    $location.path('/result/error');
                });
            } else {
                $location.path('/');
            }
        }
        // 跳转到预定首页
        $scope.gotoIndex = function() {
            var search = $location.search();
            var url = Config.officialURL;

            if (search.referer && search.referer == 'cloud') {
                url = Config.cloudURL;
            }

            window.location.href = url;
        };
    }]);
