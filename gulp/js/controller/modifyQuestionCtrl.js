/**
 * @authCtrl.js 修改密码Controller
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

accountAppControllers.
    controller('ModifyQuestionCtrl', ['$scope', '$rootScope', '$http', '$location', 'Request', '$timeout', 'Config', 'Validate', 'Loading',  
     function($scope, $rootScope, $http, $location, Request, $timeout, Config, Validate, Loading) {

        $rootScope.dialogTitle = '设置安全问题';

        var linkObj = $location.search();

        $scope.question = {};

        $scope.util.submitted = false;
        // 因为多次跳转之后URL还是可能携带code，所以需要先判断currentToken
        // 如果没有token，说明是直接输入 URL 过来的，则跳转到验证身份页面
        if (!$rootScope.currentToken) {
            // 假如是从邮箱跳转过来的，则把链接中code和uid赋给当前token和当前uid
            if (linkObj && linkObj.code) {
                $rootScope.currentUid = linkObj.uid || '';

                // 假如是从邮箱跳转过来的，则需要生成token
                var obj = {
                    'for': 'UPDATE_SECQUES',
                    'uid': linkObj.uid,
                    'email_code': linkObj.code
                };

                Request.checkUpdateCaptcha(obj).then(function(msg) {
                    if (msg.errno == '0') {
                        // 保存当前token
                        $rootScope.currentToken = msg.data;
                    } else {
                        // 验证码失效
                        // INVALID_VCODE
                        // REFRECH_VCODE
                        $location.path('/auth/modifyQuestion'); 
                    }
                }, function(err) {});
            } else {
                $location.path('/auth/modifyQuestion');
            }
        }

        // 初始化获取所有的密码保护问题列表
        var origQuestions = [];

        var initQuestions = function() {
            // msg.data的数据格式
            // var data = {
            //     '1' : '你的工作是什么？',
            //     '2' : '你的职业是什么？',
            //     '3' : '你的订单是什么？',
            //     '4' : '你的地方是什么？',
            //     '5' : '你的共和国是什么？',
            //     '6' : '你的大苏打是什么？',
            //     '7' : '你的数量是什么？'
            // };

            // 开始转换数据格式 { id:值} -> { k:id, v:值}
            // var keys = [];
            // var values = [];

            // angular.forEach(data, function(value, key) {
            //     keys.push(key);
            //     values.push(value);
            // });

            // for (var i = 0; i < keys.length; i++) {
            //     origQuestions.push({
            //         k: keys[i],
            //         v: values[i]
            //     });
            // }

            // 开始赋值到三个作用域里去
            // $scope.updateQuestion();

            Request.getQuestions().then(function(msg) {
                if (msg.errno == '0') {
                    // 开始转换数据格式 { id:值} -> { k:id, v:值}
                    var keys = [];
                    var values = [];

                    angular.forEach(msg.data, function(value, key) {
                        keys.push(key);
                        values.push(value);
                    });

                    for (var i = 0; i < keys.length; i++) {
                        origQuestions.push({
                            k: keys[i],
                            v: values[i]
                        });
                    }
                    // 开始赋值到三个作用域里去
                    $scope.updateQuestion();
                }
            }, function(err){

            });
        }

        $scope.question.question1 = $scope.question.question2 = $scope.question.uestion3 = '';
        
        // 选择密保问题
        $scope.updateQuestion = function() {
            $scope.questionsOne = [];
            $scope.questionsTwo = [];
            $scope.questionsThree = [];

            angular.forEach(origQuestions, function(v) {
                switch (v.k){
                    case $scope.question.question1:
                        $scope.questionsOne.push(v);
                        break;
                    case $scope.question.question2:
                        $scope.questionsTwo.push(v);
                        break;
                    case $scope.question.question3:
                        $scope.questionsThree.push(v);
                        break;
                    default:
                        $scope.questionsOne.push(v);
                        $scope.questionsTwo.push(v);
                        $scope.questionsThree.push(v);
                        break;
                }
            });
        };

        initQuestions();

        // 单击下一步
        $scope.next = function() {
            $scope.util.submitted = true;

            if (!$scope.form.$valid) {
                Validate.checkErrNumber($scope, $scope.form);
                return;
            }

            var obj = {
                'uid': $rootScope.currentUid,
                'ext[token]': $rootScope.currentToken
            };

            obj['user[secques][' + $scope.question.question1 + ']'] = $scope.question.answer1;
            obj['user[secques][' + $scope.question.question2 + ']'] = $scope.question.answer2;
            obj['user[secques][' + $scope.question.question3 + ']'] = $scope.question.answer3;

            Loading.start();

            Request.updateUserQuestion(obj).then(function(msg) {
                Loading.done();
                
                if (msg.errno == '0') {
                    $location.path('/result/modifyQuestion');
                }
                
                // ILLEGAL_SECQUES 密码问题格式有误
                // ILLEGAL_SECANS 密保答案格式有误
            }, function(err){
                Loading.done();
            });
        };
    }]);
