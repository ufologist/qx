(function() {
    function initLogin() {
        var phoneNumber = localStorage.getItem('phoneNumber');
        if (phoneNumber) {
            $('.j-ipt-phonenum').val(phoneNumber);
        }
    }

    function bindLogin() {
        $('.j-btn-login .login-button').on('click', function(event) {
            event.preventDefault();

            $('.j-btn-login .loading').show();

            var phoneNumber = $('.j-ipt-phonenum').val();
            var password = $('.j-ipt-password').val();

            localStorage.setItem('phoneNumber', phoneNumber);

            var loginData = '{"PhoneNumber":"' + phoneNumber + '","InternationalAreaCode":"+86","Password":"' + password + '","PersistenceHint":true,"ClientId":"undefined","ImgCode":""}';
            $.post('https://www.fxiaoke.com/FHH/EM0HXUL/Authorize/PersonalLogin', loginData).done(function(jsonString) {
                $('.js-login-result').text(jsonString);

                // {"Value":{"IsNeedImageCode":false,"Enterprises":[{"EnterpriseName":"公司","EnterpriseId":1,"EnterpriseAccount":"","EnterpriseStatus":1,"UserName":""}],"IsPasswordOk":true},"Result":{"StatusCode":0,"FailureCode":0,"FailureMessage":null}}
                var result = JSON.parse(jsonString);
                // alert(result.Value.Enterprises[0].EnterpriseId);

                var loginData2 = '{"EnterpriseId":'+result.Value.Enterprises[0].EnterpriseId+'}'
                $.post('https://www.fxiaoke.com/FHH/EM0HXUL/Authorize/EnterpriseUserLogin', loginData2).done(function(d) {
                    // alert(d);
                    $('#login').hide();
                    loadContactData().done(initQx);
                });
            });
        });
    }

    function loadContactData() {
        return $.get('http://www.fxiaoke.com/XV/Home/Index#stream').done(function(d) {
            // 正则表达式在某些电脑上不知道为什么匹配不到数据, 算了改用 indexOf 来截取
            // var regExp = /\("contactData", (\S+)\);/gim
            // var contactData = regExp.exec(d)[1];
            // console.log(contactData);
            var contactDataStartIndex = d.indexOf('"contactData",') + 14;
            var contactDataEndIndex = d.indexOf('});', contactDataStartIndex) + 1;
            contactData = d.substring(contactDataStartIndex, contactDataEndIndex);

            // 原来在 Home/Index 页面中初始化的数据
            FS.setAppStore("contactData", JSON.parse(contactData));
        });
    }

    function initQx() {
        // fs 模块
        // http://www.fxiaoke.com/html/fs-dist/app.js?11.5
        seajs.use("base-static/js/contacts1", function(fsApp) {
            seajs.use("fs/app", function(fsApp) {
                fsApp.init();
            });
        });
    }

    function hasNewMessage() {
        if (document.title.indexOf('新企信') != -1) {
            notify();
        }
    }

    function notify() {
        hex.restore();
        hex.focusForm();
    }

    function initHex() {
        // window 图标
        hex.setFormIcon(hex.applicationDirectoryPath + '\\qx\\qx.ico');
        window.addEventListener('beforeSystemCommand', function (e) {
            var command = e.detail;
            if (command == hex.CLOSE) {
                command = hex.MINIMIZE;
            }
            hex.doSystemCommand(command);
        }, false);
        // manifest.json 中的 first_page 可以在 JS 中修改
        // 然后通过 updateManifest 会重写 manifest.json 文件(但编码好像不是 UTF-8 的啦, 出现了乱码)
        // first_page 可以指定为一个 URL, 因此可以将文件部署到服务器上,
        // 就可以发挥出 Web App 版本更新的优势了
        // hex.manifest.first_page = 'http://192.168.1.62:8008/qx.html';
        // hex.updateManifest();
    }

    initLogin();
    bindLogin();
    // 检测是否有新消息
    setInterval(hasNewMessage, 5000);

    initHex();
})();

