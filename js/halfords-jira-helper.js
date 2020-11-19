// ==UserScript==
// @name         Copy JIRA issue title with issue key (halfords)
// @namespace    https://halfordsdigital.atlassian.net/browse/
// @include      https://halfordsdigital.atlassian.net/browse/*
// @version      1.0
// @description  try to take over the world!
// @grant        none
// ==/UserScript==

var nfxpnk = {
    issueKey: document.querySelector('[data-test-id="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"] .css-eaycls'),
    text: document.querySelector('[data-test-id="issue.views.issue-base.foundation.summary.heading"]'),
    issueType: document.querySelector('.css-1ne1vc3 img').getAttribute('alt'),
    containerHeader: document.getElementById('jira-issue-header'),

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
        parentElement.parentNode.prepend(inputWrap);

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
        parentElement.parentNode.prepend(msgTypeBtnWrap);

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
        + 'margin-bottom: 10px;'
        + '}'

        + '.input-element {'
        + 'display: block;'
        + 'height: 28px;'
        + 'width: 100%;'
        + 'padding: 0 10px;'
        + 'margin-right: -4px;'
        + 'border: 2px solid #0052cc !important;'
        + 'border-radius: 3px 0 0 3px;'
        + 'transition: all .3s;'
        + '}'

        + '.button-copy {'
        + 'border-top-left-radius: 0;'
        + 'border-bottom-left-radius: 0;'
        + '}'

        + '.button-type-wrap {'
        + 'margin: 10px 0;'
        + ''
        + '}'
        ;

        this.addStyle(styles);
    },

    main: function() {
        var issueTypeMatch = this.issueType.match(/Bug/);
        var branchType = issueTypeMatch ? 'bugfix' : 'feature';

        var fullText = this.text.textContent;
        var branchText = branchType + '/' + this.issueKey.textContent;

        var btnArray = ['FIX', 'DEV', 'CHANGE', 'MERGE', 'ADD'];

        this.btnInputStyles();

        this.appendInput(this.containerHeader, branchText);
        this.msgTypeButton(this.containerHeader, fullText, btnArray);
    }
};

nfxpnk.main();