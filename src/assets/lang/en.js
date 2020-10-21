let en = {
    'loginPage': {
        'title': 'LeeBoo',
        'login': 'Login',
        'sendText': 'Send',
        'tryAgain': 'Try Again',
        'rememberMe': 'Remember Me',
        'loginFormRules': {
            'username': {
                'notNull': 'Username is required !',
                'length': 'Length must be between 4~12 !',
                'illegal': 'Include illegal character !'
            },
            'password': {
                'notNull': 'Password is required !',
                'length': 'Length must be between 4~12 !',
                'illegal': 'Include illegal character !'
            }
        },
        'smsCodeLoginFormRules': {
            'phone': {
                'notNull': 'Phone is required !',
                'length': 'Length must be 11 !',
                'illegal': 'Include illegal character !'
            },
            'smsCode': {
                'notNull': 'Verification code is required !',
                'length': 'Length must be 6!',
                'illegal': 'Include illegal character !'
            }
        }
    },
    'employeeMenu': {
        'employeeManagement': 'employeeManagement'
    }
}

export default en