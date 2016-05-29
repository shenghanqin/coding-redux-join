/**
 * @configService.js 配置项
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppServices.constant('Config', {
    // 后台接口的基地址
    baseUrl: '../v2/',
    // 返回到首页的地址
    // gotoIndex: 'http://www.smartisan.com/',

    officialURL: 'http://www.smartisan.com/',

    cloudURL: 'https://cloud.smartisan.com/',

    headconfig: {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    },
    regExp: {
        // 正则表达式中的特殊符号，如果被包含于中括号中，则失去特殊意义，但 \ [ ] : ^ - 除外。
        isMobile : /^1[3|4|5|7|8]\d{9}$/,
        isMail : /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,
        isPassword : /^[\w\\\[\]\:\^\-~!@#$%&*()-+={}|;'",.\/<>?]{6,16}$/
    },
    errnoMap: {
        OK: 0,
        // 以下1-8是系统错误
        // 900以下都是系统错误
        SYSTEM_MAINTENANCE: 1,
        LOGIC_ERROR: 2,
        FS_READ_ERROR: 3,
        FS_WRITE_ERROR: 4,
        DB_CONNECT_ERROR: 5,
        DB_QUERY_ERROR: 6,
        CACHE_CONNECT_ERROR: 7,
        CACHE_QUERY_ERROR: 8,
        PARAMETER_ERROR: 1002,
        // tiket 格式错误
        ILLEGAL_TICKET: 1601,
        // tiket 错误
        INVALID_TICKET: 1602,
        // UID格式错误
        ILLEGAL_UID: 1101,
        // 密码格式错误,
        ILLEGAL_PASSWORD: 1102,
        // 头像格式错误
        ILLEGAL_AVATAR: 1103,
        // 安全问题格式错误
        ILLEGAL_SECQUES: 1104,
        // 安全问题答案格式错误
        ILLEGAL_SECANS: 1105,
        // UID不存在
        INVALID_UID: 1106,
        // 密码验证错误
        INVALID_PASSWORD: 1107,
        // 安全问题答案验证错误
        INVALID_SECANS: 1108,
        // 需要别名
        ALIAS_REQUIRED: 1109,
        // 需要密码
        PASSWORD_REQUIRED: 1110,
        // 别名格式错误
        ILLEGAL_ALIAS: 1201,
        // 别名不存在
        INVALID_ALIAS: 1202,
        // 别名已经注册
        REGISTERED_ALIAS: 1203,
        // 手机号格式错误
        ILLEGAL_CELLPHONE: 1204,
        // 手机号不存在
        INVALID_CELLPHONE: 1205,
        // 手机号已注册
        REGISTERED_CELLPHONE: 1206,
        // 邮箱格式错误
        ILLEGAL_EMAIL: 1207,
        // 邮箱未注册
        INVALID_EMAIL: 1208,
        // 邮箱已注册
        REGISTERED_EMAIL: 1209,
        // 昵称格式错误
        ILLEGAL_NICKNAME: 1210,
        // 昵称未注册
        INVALID_NICKNAME: 1211,
        // 昵称已注册
        REGISTERED_NICKNAME: 1212,
        // 验证码格式错误
        ILLEGAL_VCODE: 1301,
        // 验证码错误
        INVALID_VCODE: 1302,
        // 验证码发送太频繁
        VCODE_TOO_OFTEN: 1304,
        // 需要验证码
        CAPTCHA_REQUIRED: 1502,
        // token格式错误
        ILLEGAL_TOKEN: 1401,
        // token错误
        INVALID_TOKEN: 1402,
        // 未登录
        UNAUTHORIZED: 1701,
        // 需要刷新验证码
        REFRECH_VCODE: 1303,
        // 密码错误 并且需要验证码
        FAILED_LOGIN_LIMIT: 1501
    },
    mailUrl : {
        '163.com' : 'http://mail.163.com/',
        '126.com' : 'http://mail.126.com/',
        '139.com' : 'http://mail.10086.cn/',
        'sina.com' : 'http://mail.sina.com.cn/',
        'sina.cn' : 'http://mail.sina.com.cn/',
        'qq.com' : 'https://mail.qq.com/',
        'sohu.com' : 'http://mail.sohu.com/',
        'gmail.com' : 'https://www.gmail.com/',
        'yahoo.com' : 'https://login.yahoo.com/',
        '21cn.com' : 'http://mail.21cn.com/',
        'aliyun.com' : 'https://mail.aliyun.com/',
        'outlook.com' : 'https://login.live.com/',
        'yeah.net' : 'http://www.yeah.net/',
        'sogou.com' : 'http://mail.sogou.com/',
        '189.cn' : 'http://webmail9.189.cn/webmail/',
        'cntv.cn' : 'http://mail.cntv.cn/',
        'tianya.cn' : 'http://mail.tianya.cn/',
        'hainan.net' : 'http://mail.tianya.cn/',
        'hotmail.com' : 'https://login.live.com/'
    }
    // baseUrl : 'data/'
    // baseUrl : 'index.php?r='
}).factory('UtilTools', ['$q', '$http', '$timeout',
        function($q, $http, $timeout) {
            var tool = {
                 // 创建一个占位的promise
                noopPromise: function(){
                    var delay = $q.defer();
                    $timeout(function(){
                         delay.resolve('');
                    },1000);
                    return delay.promise;
                },
                encodeUriQuery: function(val, pctEncodeSpaces) {
                    return encodeURIComponent(val).
                                replace(/%40/gi, '@').
                                replace(/%3A/gi, ':').
                                replace(/%24/g, '$').
                                replace(/%2C/gi, ',').
                                replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
                },
                toKeyValue: function(obj) {
                    var self = this;
                    var parts = [];
                    angular.forEach(obj, function(value, key) {
                        if (angular.isArray(value)) {
                            angular.forEach(value, function(arrayValue) {
                                parts.push(self.encodeUriQuery(key, true) +
                                    (arrayValue === true ? '' : '=' + self.encodeUriQuery(arrayValue, true)));
                            });
                        } else {
                            parts.push(self.encodeUriQuery(key, true) +
                                (value === true ? '' : '=' + self.encodeUriQuery(value, true)));
                        }
                    });
                    return parts.length ? parts.join('&') : '';
                }
            };

            return tool;
        }
    ]);