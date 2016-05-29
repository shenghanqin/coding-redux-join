/**
 * @requestService.js 基础请求服务
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppServices.factory('Request', ['$http', '$q', 'Config', 'UtilTools', function($http, $q, Config, UtilTools) {
    var user;
    var base = Config.baseUrl;
    var headConfig = Config.headconfig;
    return {
        // 检查手机是否可用
        // m=get&cellphone=13436465800&action=check
        checkMobile: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'cellphone/?' + str, '').success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            })
            return delay.promise;
        },
        // 检查邮箱是否可用
        // m=get&email=dailei6200@163.com&action=check
        checkMail: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'email/?' + str, '').success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            })
            return delay.promise;
        },
        // 检查昵称是否可用
        // m=get&nickname=%E4%BB%A3%E7%A3%8A&action=check
        checkNickName: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'nickname/?' + str, '').success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            })
            return delay.promise;
        },
        // 注册时给手机发送验证码
        // cellphone=13436465800
        sendMobileCaptcha: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'cellphone/?m=post', str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            })
            return delay.promise;
        },
        // 检查手机验证码是否正确
        // action=renew&cellphone=13436465800&cellphone_code=642146
        checkMobileCaptcha: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'cellphone/?m=post', str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            })
            return delay.promise;
        },
        // 获取用户可用的身份验证方式
        // m=get&uid=3
        getUserChecks: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'cellphone/?' + str, '').success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            })
            return delay.promise;
        },
        // 用户注册
        register: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/', str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            })
            return delay.promise;
        },
        // 用户登录 支持带验证码
        login: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'session/?m=post', str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            });
            return delay.promise;
        },
        // 用户退出
        logout: function(options){
            var delay = $q.defer();

            $http.post(base + 'session/?m=delete', '').success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            });
            
            return delay.promise;
        },
        // 检查登录验证码是否正确
        checkLoginCaptcha: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/captcha/?m=post&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            });
            return delay.promise;
        },
        // 修改用户密码
        updateUserPassword: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            // nologin
            var url = base + 'w/password/?m=put';
            if(options.uid){
                url = base + 'users/password/?m=put&uid=' + options.uid;
            }
            if(options.username){
                url = base + 'users/password/?m=put&username=' + options.username;
            }
            $http.post(url , str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 修改邮箱
        updateUserEmail: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/email/?m=put&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 修改手机号
        updateUserMobile: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/cellphone/?m=put&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 获取当前用户的验证方式---已登录的用户
        getUserAuths: function(options){
            var delay = $q.defer();
            // var str = '';
            var url = base + 'w/protection/?m=get';
            // if(options.username){
            //     url = base + 'users/protection/?m=get&username=' + options.username;
            // }
            $http.post(url, '').success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            });
            return delay.promise;
        },
        // 获取未登录用户的验证方式
        getNoLoginAuths: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/protection/?m=get&' + str, '').success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 发送当前用户选择验证方式的验证码----已登录的用户
        sendUpdateCaptcha: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/token/?m=post&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).error(function() {
                delay.reject("网络异常!");
            });
            return delay.promise;
        },
        // 验证当前用户选择验证方式的验证码
        checkUpdateCaptcha: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/token/?m=put&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 发送新手机号验证码
        // cellphone=xxx&token=xxx
        sendNewMobileCaptcha: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/cellphone/?m=post&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 给新邮箱发送新链接
        // email=xxx&token=xxx
        sendNewEmail: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/email/?m=post&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 修改邮箱
        // email=xxx&token=xxx
        modifyMail: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/email/?m=put&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 获取所有的问题列表
        getQuestions: function(){
            var delay = $q.defer();
            var str = '';
            $http.post(base + 'config/security-questions/?m=get', '').success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 修改用户密码保护问题
        updateUserQuestion: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/secques/?m=put&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        },
        // 激活用户注册的邮箱
        activeUserEmail: function(options){
            var delay = $q.defer();
            var str = UtilTools.toKeyValue(options);
            $http.post(base + 'users/active/?m=put&uid=' + options.uid, str, headConfig).success(function(msg) {
                delay.resolve(msg);
            }).
            error(function(msg) {
                delay.reject(msg);
            });
            return delay.promise;
        }
    };
}]);