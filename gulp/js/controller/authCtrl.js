/**
 * @authCtrl.js 身份验证Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */
 
accountAppControllers.
    controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$routeParams', '$location', '$window', 'Request', 'UtilTools', '$interval', 'Config', 'Validate', 'Loading', 'userAuths',  
     function($scope, $rootScope, $http, $routeParams, $location, $window, Request, UtilTools, $interval, Config, Validate, Loading, userAuths) {

        $rootScope.dialogTitle = '安全验证';
        
        // invalid 用于记录后端返回的错误信息
        // 在指令里会根据 invalid 的信息设置有效性
        $scope.invalid = {};
        $scope.user = {};
        $scope.answer = {};
        var authContents = {
            cellphone: '通过手机短信验证身份',
            email: '通过邮箱验证身份',
            secques: '通过密码保护验证身份'
        };

        $scope.authType = {
            types : [],
            checked : 0
        };


        $scope.util.submitted = false;

        // $scope.current = 'default';

        // input的controlller
        var ctrl = {};

        switch ($routeParams.channelID) {
            // 忘记密码
            case 'forgotPassword':
                $scope.authType.action = 'FIND_PASSWORD';
                var linkObj = $routeParams;

                if (linkObj && linkObj.username) {
                    $scope.authType.username = linkObj.username;
                }
                $scope.gotoPage = 'modifyPassword';
                break;
            // 修改手机号
            case 'modifyMobile':
                $scope.authType.action = 'UPDATE_CELLPHONE';
                $scope.gotoPage = 'modifyMobile';
                break;
            // 修改邮箱
            case 'modifyMail':
                $scope.authType.action = 'UPDATE_EMAIL';
                $scope.gotoPage = 'modifyMail';
                break;
            // 修改密码保护问题
            case 'modifyQuestion':
                $scope.authType.action = 'UPDATE_SECQUES';
                $scope.gotoPage = 'modifyQuestion';
                break;
            default :
                // 否则跳转到非法操作页面
                // $location.path('/');
                break;
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

        // 重新发送手机验证码
        $scope.resend = function() {
            countdown();

            // 开始调用发送手机验证码
            Request.sendUpdateCaptcha({
                'for': $scope.authType.action,
                'to': $scope.authType.checkType,
                'uid': $rootScope.currentUid,
                'secret': $scope.secret
            }).then(function(msg){
                if(msg.errno == Config.errnoMap.PARAMETER_ERROR) {
                    // 一般是参数不对，刷新页面
                    $window.location.reload();
                    return;
                }
            });
        };

        // 重新发送邮箱
        $scope.resendEmail = function(){
            countdown(5);

            // 开始调用发送邮件链接
            Request.sendUpdateCaptcha({
                'for': $scope.authType.action,
                'to': $scope.authType.checkType,
                'uid': $rootScope.currentUid,
                'secret': $scope.secret
            }).then(function(msg) {
                if(msg.errno == Config.errnoMap.PARAMETER_ERROR) {
                    // 一般是参数不对，刷新页面
                    $window.location.reload();
                    return;
                }
            });
        };

        // 查看我的邮箱
        $scope.gotoEmail = function(){
            // var email = UtilTools._.find($scope.authType.types, function(v) {
            //     return v.type == 'email';
            // }).value;
            var email;
            angular.forEach($scope.authType.types, function(item) {
                if (item.type == 'email') {
                    email = item.value;
                }
            });

            var postfix = email.split('@')[1];

            // 配置了常用的邮件地址，其余直接添加mail前缀
            var mailUrl = Config.mailUrl[postfix] || 'http://mail.' + postfix + '/';
            window.open(mailUrl);
        };

        // 选择验证身份方式，然后点击下一步
        $scope.next = function() {
            if ($scope.authType.checkType == 'secques') {
                // 密保问题直接显示，不需要验证
                $scope.current = 'secques';
                $scope.changeQuestion();
                return;
            }

            Loading.start();

            // 选择验证方式
            Request.sendUpdateCaptcha({
                'for': $scope.authType.action,
                'to': $scope.authType.checkType,
                'uid': $rootScope.currentUid,
                'secret': $scope.secret
            }).then(function(msg) {
                Loading.done();
                $scope.util.submitted = false;

                if (msg.errno == Config.errnoMap.PARAMETER_ERROR) {
                    // 一般是参数不对，刷新页面
                    $window.location.reload();
                    return;
                }

                if (jQuery.support.opacity) {
                    $('.content').css({'opacity':'0'}).animate({'opacity':'1'},500);
                }

                // if(msg.errno == '0'){
                switch ($scope.authType.checkType) {
                    // 发送邮件
                    case 'email':
                        $scope.current = 'email';
                        countdown(5);
                        break;

                    // 发送手机验证码
                    case 'cellphone':
                        $scope.current = 'cellphone';
                        // $scope.mobile =  UtilTools._.find($scope.authType.types, function(v){
                        //     return v.type == 'cellphone';
                        // }).value;

                        angular.forEach($scope.authType.types, function(item) {
                            if (item.type == 'cellphone') {
                                $scope.mobile = item.value;
                            }
                        });

                        $scope.showBtn = true;
                        // 开始到计时
                        countdown();
                        // 如果操作太频繁，则给予提示
                        // 这里不用提示吧？
                        // if(msg.errno == Config.errnoMap.VCODE_TOO_OFTEN){
                            // $scope.error.verificationOffen = true;
                            // ctrl = $scope.form.verification;
                            // ctrl.$setValidity('captchaReload', false);
                        // }
                        break;
                    default:
                        break;
                }
                // }
            }, function(err){
                Loading.done();
            });

        };

        // 输入手机验证码之后，跳转到下一步
        $scope.mobileNext = function() {
            $scope.util.submitted = true;

            $rootScope.currentToken = undefined;

            if (!$scope.form.$valid) {
                Validate.checkErrNumber($scope, $scope.form);
                return;
            }

            Loading.start();

            var obj = {
                'for': $scope.authType.action,
                'uid': $rootScope.currentUid
            };

            obj['cellphone_code'] = $scope.user.verification;

            // 获取token
            Request.checkUpdateCaptcha(obj).then(function(msg) {
                Loading.done();

                switch (+msg.errno) {
                    // 保存当前token
                    case Config.errnoMap.OK:
                        $rootScope.currentToken = msg.data;
                        $location.path('/' + $scope.gotoPage);
                        break;
                    
                    // 提示验证码错误
                    case Config.errnoMap.ILLEGAL_VCODE:
                    case Config.errnoMap.INVALID_VCODE:
                        $scope.invalid.mobileCaptchaValid = false;
                        break;
                    
                    // 提示验证码刷新
                    case Config.errnoMap.REFRECH_VCODE:
                        $scope.invalid.mobileCaptchaReload = false;
                        break;
                }
                
            }, function(err) {
                Loading.done();
            });
        };

        // 更换问题
        $scope.changeQuestion = function() {
            $scope.questions = [];

            // var _questions = UtilTools._.find($scope.authType.types, function(v){
            //     return v.type == 'secques';
            // }).value;

            var questions;

            angular.forEach($scope.authType.types, function(item) {
                if (item.type == 'secques') {
                    questions = item.value;
                }
            });

            for(var key in questions){
                // if(_questions.hasOwnProperty(k)){
                $scope.questions.push({
                    k: key,
                    v: questions[key]
                });
                // }
            };

            // 随机删除一个，只验证两个问题
            $scope.questions.splice((Math.floor(Math.random()*3)), 1);

            $scope.answer = {};
            $scope.invalid.answerInvalid = true;
            $scope.util.submitted = false;
            $scope.form.answer1 && ($scope.form.answer1.$submitted = false);
            $scope.form.answer2 && ($scope.form.answer2.$submitted = false);
        }

        // 安全问题确认
        $scope.questionConfirm = function() {
            $scope.util.submitted = true;
            $rootScope.currentToken = undefined;

            if (!$scope.form.$valid) {
                Validate.checkErrNumber($scope, $scope.form);
                return;
            }

            var obj = {
                'for': $scope.authType.action,
                'uid': $rootScope.currentUid
            };

            obj['secans[' + $scope.questions[0].k + ']'] = $scope.answer.answer1;
            obj['secans[' + $scope.questions[1].k + ']'] = $scope.answer.answer2;
            
            Loading.start();

            // 获取token
            Request.checkUpdateCaptcha(obj).then(function(msg) {
                Loading.done();

                switch (+msg.errno) {
                    // 保存当前token
                    case Config.errnoMap.OK:
                        $rootScope.currentToken = msg.data;
                        $location.path('/' + $scope.gotoPage);
                        break;

                    // 安全问题答案错误
                    case Config.errnoMap.INVALID_SECANS:
                        $scope.invalid.answerInvalid = false;
                        break;
                }
            }, function(err) {
                Loading.done();
            });
        };

        // 修改验证方式顺序
        var sortAuth = function(data){
            // var cellphone = UtilTools._.filter(data, function(v){ return v.type == 'cellphone';});
            // var email = UtilTools._.filter(data, function(v){ return v.type == 'email';});
            // var secques = UtilTools._.filter(data, function(v){ return v.type == 'secques';});

            var obj = {};
            var result = [];

            angular.forEach(data, function(v, i) {
                // 用户肯定有手机
                switch (v.type) {
                    case 'cellphone':
                        obj['cellphone'] = v;
                        break;
                    case 'email':
                        obj['email'] = v;
                        break;
                    case 'secques':
                        obj['secques'] = v;
                        break;
                }
            });

            if (obj['cellphone']) {
                result.push(obj['cellphone']);
            }
            if (obj['email']) {
                result.push(obj['email']);
            }
            if (obj['secques']) {
                result.push(obj['secques']);
            }

            return result;

            
            // if(cellphone && cellphone.length) result.push(cellphone[0]);
            // if(email && email.length) result.push(email[0]);
            // if(secques && secques.length) result.push(secques[0]);
            // return result;
        };

        // 获取当前登录用户的所有验证方式
        var getUserAuthsForLogined = function(){
            // 如果是非法的请求类型，则不执行后台接口
            if (!$scope.gotoPage) {
                return;
            }

            getUserAuths();
        };

        var getUserAuths = function() {
            // Loading.start();

            if ($rootScope.forgotPasswordMsg) {
                // 忘记密码携带参数
                loginSuccess($rootScope.forgotPasswordMsg);
            } else {
                if(userAuths.errno == '0'){
                    loginSuccess(userAuths);
                }else{
                    loginFail();
                }
            }
        };

        var loginSuccess = function(msg) {
            Loading.done();
            
            $scope.authType.types = [];
            
            if (msg.errno == '0') {
                // 开始获取所有验证方式
                // cellphone email secques uid
                for(var k in msg.data) {
                    if (msg.data[k]) {
                        if (k == 'uid') {
                            // 保存验证方式里的uid到根作用域下
                            $rootScope.currentUid = msg.data[k];
                        } else {
                            var obj = {};
                            obj.type = k;
                            obj.value = msg.data[k];
                            obj.desc = authContents[k];
                            $scope.authType.types.push(obj);
                        }
                    }
                }

                $scope.authType.types = sortAuth($scope.authType.types);

                // 这里只是保存起来传给后端
                $scope.secret = msg.data.secret;
                
                // 默认选中手机验证方式
                angular.forEach($scope.authType.types, function(v, i){
                    if(v.type == 'cellphone'){
                        $scope.selectType(i);
                    }
                });
            } else {
                loginFail();
            }
        };

        // 选择一个验证类型
        $scope.selectType = function($index) {
            $scope.authType.checked = $index;
            $scope.authType.checkType = $scope.authType.types[$index].type;
        };

        var loginFail = function() {
            Loading.done();

            // 如果失败，则直接跳到登录页面
            // $location.url('/login/' + $scope.gotoPage);
        };

        getUserAuthsForLogined();
    }]);