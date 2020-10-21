let zh = {
    'loginPage': {
        'title': '力朴人事管理系统',
        'login': '登录',
        'sendText': '获取验证码',
        'tryAgain': '秒后重新发送',
        'rememberMe': '记住我',
        'loginFormRules': {
            'username': {
                'notNull': '用户名不能为空！',
                'length': '用户名长度必须在4~12之间！',
                'illegal': '用户名含有非法字符！'
            },
            'password': {
                'notNull': '密码不能为空！',
                'length': '密码长度必须在4~12之间！',
                'illegal': '密码含有非法字符！'
            },
        },
        'smsCodeLoginFormRules': {
            'phone': {
                'notNull': '手机号码不能为空！',
                'length': '手机号码长度必须为11位！',
                'illegal': '手机号码含有非法字符！'
            },
            'smsCode': {
                'notNull': '短信验证码不能为空！',
                'length': '短信验证码长度必须为6位！',
                'illegal': '短信验证码含有非法字符！'
            }
        }
    },
    'employeeMenu': {
        'employeeManagement': '员工管理'
    }
}

export default zh