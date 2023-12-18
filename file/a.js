function signIn(selector, callback) {
    /*鐢ㄦ埛娉ㄥ唽*/
    var qq = selector.qq
    var password = selector.password
    var nick = selector.nick
    var logo = "http://q2.qlogo.cn/headimg_dl?spec=100&dst_uin=" + qq
    var code = selector.code
    var token = selector.token
    codeimg.verify(token, code, function (verify) {
        if (!verify.isVerify) {
            const data = {
                msg: verify.msg,
                isSignIn: false,
                verify: verify
            }
            callback(data)
            return
        }
        const data = {
            msg: "娉ㄥ唽鎴愬姛",
            isSignIn: true,
            verify: verify
        }
        var part = /^[1-9]{1}[0-9]{4,14}$/
        var part2 = /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/
        var part3 = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,8}$/
        if (!part.test(qq)) {
            data.msg = "璇疯緭鍏ユ纭殑QQ鍙�"
            data.isSignIn = false
            callback(data)
            return
        } 
        if (!part2.test(password)) {
            data.msg = "璇疯緭鍏�8鑷�16浣嶇敱瀛楁瘝鏁板瓧缁勬垚鐨勫瘑鐮�"
            data.isSignIn = false
            callback(data)
            return
        } 
        if (!part3.test(nick)) {
            data.msg = "璇疯緭鍏�2鑷�8浣嶆樀绉�"
            data.isSignIn = false
            callback(data)
            return
        } 
        db.Has('user', qq, function (err) {
            if (!err) {
                data.msg = "褰撳墠QQ宸茶娉ㄥ唽"
                data.isSignIn = false
                callback(data)
                return
            }
            var time = Math.round(Date.now() / 1000)
            var d = new Date(time * 1000)
            var content = {
                qq: qq,
                password: password,
                nick: nick,
                logo: logo,
                isVip: false,
                vip: time,
                vipText: d.toLocaleDateString().replace(/\//g, "-"),
                vipType: 0,
                points: 0,
            }
            db.Modify('user', qq, JSON.stringify(content))
            callback(data)
        })
    })
}

