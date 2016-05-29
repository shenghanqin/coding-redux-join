/**
 * @userService.js 用户登录Service
 * @author wanghuijun(wanghuijun@smartisan.cn)
 */

'use strict';

accountAppServices.factory('User', function() {
    return {
        user : '',

        captchaUrl : 'https://account.smartisan.com/v2/session/captcha/?' + (+new Date),

        refreshCaptcha : function() {
            var self = this;
            var tempUrl = self.captchaUrl;

            if (tempUrl.lastIndexOf('?') > 0) {
                tempUrl = tempUrl + '&' + (+new Date);
            } else {
                tempUrl = tempUrl + '?' + (+new Date);
            }

            return self.captchaUrl = tempUrl;
        },
        
        setUser : function(user){
            this.user = user;
        },
        
        isLoggedIn : function(){
            return (this.user) ? this.user : false;
        }
    };
});