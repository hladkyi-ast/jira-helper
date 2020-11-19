// ==UserScript==
// @name         Copy JIRA issue title with issue key (new function)
// @namespace    https://jira.ontrq.com/browse/
// @include      https://jira.ontrq.com/browse/*
// @version      1.0
// @description  try to take over the world!
// @grant        none
// ==/UserScript==

var nfxpnk = {
    issueKey: document.getElementById('key-val'),
    text: document.getElementById('summary-val'),
    issueType: document.getElementById('type-val').innerText,

    ge: function(elementId) {
        return document.getElementById(elementId);
    },

    appendInput: function(parentElement, value) {
        var inputWrap = document.createElement('div');
        var input = document.createElement('input');
        var btnInputCopy = document.createElement('button');

        inputWrap.classList.add('input-wrap');

        input.type = 'text';
        input.classList.add('input-element');
        input.value = value;

        btnInputCopy.classList.add('aui-button', 'aui-button-primary', 'button-copy');
        btnInputCopy.innerHTML = '<span class="aui-icon aui-icon-small aui-iconfont-devtools-repository-locked"></span>';

        inputWrap.appendChild(input);
        inputWrap.appendChild(btnInputCopy);
        parentElement.parentNode.appendChild(inputWrap);

        // Copy input value
        btnInputCopy.addEventListener('click', function () {
            input.select();
            document.execCommand("copy");
        });
    },

    msgTypeButton: function (parentElement, value, msgType) {
        var msgTypeBtnWrap = document.createElement('div');
        var msgTypeBtnTemplate = document.createElement('button');

        msgTypeBtnWrap.classList.add('button-type-wrap');
        msgTypeBtnTemplate.classList.add('aui-button', 'aui-button-primary');
        parentElement.parentNode.appendChild(msgTypeBtnWrap);

        msgType.forEach(function(type) {
            var clonedBtn = msgTypeBtnTemplate.cloneNode();
            clonedBtn.innerHTML = type;
            msgTypeBtnWrap.appendChild(clonedBtn);
        });

        msgTypeBtnWrap.addEventListener('click', (event) => {
            var targetBtn = event.target.textContent;
            value = this.issueKey.textContent + ':' + targetBtn + ': ' + this.text.textContent;
            if (event.target.tagName == 'BUTTON') this.appendInput(parentElement, value);
        });



    },

    addStyle: function (styles) {
        var css = document.createElement('style');
        css.type = 'text/css';

        if (css.styleSheet) css.styleSheet.cssText = styles;
        else css.appendChild(document.createTextNode(styles));
        document.getElementsByTagName("head")[0].appendChild(css);
    },

    btnInputStyles: function() {
        var styles = ''
        + '.input-wrap {'
        + 'width: 400px;'
        + 'max-width: 100%;'
        + 'display: flex;'
        + 'margin-top: 10px;'
        + '}'

        + '.input-element {'
        + 'display: block;'
        + 'height: 28px;'
        + 'width: 100%;'
        + 'padding: 0 10px;'
        + 'margin-right: -2px;'
        + 'border: 1px solid #0052cc;'
        + 'border-radius: 3px 0 0 3px;'
        + 'transition: all .3s;'
        + '}'

        + '.button-copy {'
        + 'border-top-left-radius: 0;'
        + 'border-bottom-left-radius: 0;'
        + '}'

        + '.button-type-wrap {'
        + 'margin-top: 10px;'
        + ''
        + '}'
        ;

        this.addStyle(styles);
    },

    main: function() {
        var issueTypeMatch = this.issueType.match(/Bug/);
        var messageType = issueTypeMatch ? 'Fix' : 'Feature';
        var branchType = issueTypeMatch ? 'bugfix' : 'feature';

        var fullText = this.text.textContent;
        var branchText = branchType + '/' + this.issueKey.textContent;

        var btnArray = ['FIX', 'DEV', 'CHANGE', 'MERGE', 'ADD'];

        this.btnInputStyles();

        // this.appendInput(this.issueKey, this.issueKey.textContent);
        this.appendInput(this.text, branchText);
        this.msgTypeButton(this.text, fullText, btnArray);
    }
};

nfxpnk.main();