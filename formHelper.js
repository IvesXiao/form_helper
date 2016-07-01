var Instance = {};

Instance.loadingButton = function(btn, noDisable) {
	btn = $(btn);
    if(btn[0].nodeName !== "BUTTON") {
    	btn = btn.find('button[type="submit"]:eq(0)');
    }
	var text = btn.html();
	btn.html('Loading ...').attr('data-html', text);
	if(!noDisable) {
		btn.attr('disabled', 'disabled');
	}
};

Instance.resetButton = function(btn) {
	btn = $(btn);
    if(btn[0].nodeName !== "BUTTON") {
    	btn = btn.find('button[type="submit"]:eq(0)');
    }

	var text = btn.attr('data-html');
	btn.removeAttr('disabled').html(text)
};

Instance.validity = function(ele) {
	ele = $(ele);

	if(ele[0].nodeName.toUpperCase() === 'FORM') {
		ele = ele.find('input, textarea, select').filter(':visible');
	}

	var valid = true;
	ele.each(function() {
		var validity = this.validity;
		if(!validity.valid) {
			valid = false;

			var errMsg = '';
			if(this.validationMessage) {
				errMsg = this.validationMessage;
			}
			else if(validity.customError) {
				errMsg = 'Custome validity is not pass.';
			}
			else if(validity.patternMismatch) {
				errMsg = 'Format is not creact';
			}
			else if(validity.rangeOverflow) {
				errMsg = 'Value is to large';
			}
			else if(validity.rangeUnderflow) {
				errMsg = 'Value is to small';
			}
			else if(validity.stepMisMatch) {
				errMsg = 'Not allowed value';
			}
			else if(validity.tooLong) {
				errMsg = 'Value is too long';
			}
			else if(validity.typeMismatch) {
				errMsg = 'Value is not matched';
			}
			else if(validity.valueMissing) {
				errMsg = 'Value is required';
			}

			Instance.warn(errMsg, this);
			this.focus();

			return false;
		}
	});

	return valid;
};

Instance.getValueByParam = function(model, param) {
	if(param.indexOf('.') === -1) {
		return model[param];
	}
	param = param.split('.');
	var value = model;
	for(var i = 0; i < param.length; i ++) {
		var key = param[i];
		value = value[key];
		if(value === undefined) {
			return undefined;
		}
	}

	return value;
};

Instance.fill = function(form, model) {
	form = $(form);
	var ipts = form.find('input[name]:visible, select[name]:visible, textarea[name]:visible');

	ipts.each(function() {
		var name = this.name;
		var value = Instance.getValueByParam(model, name) || '';
		if(this.type == 'radio') {
			ipts.filter('[name="' + name + '"]').prop('checked', false);
			ipts.filter('[name="' + name + '"][value="' + value + '"]').prop('checked', true);
		}
		else if(this.type == 'checkbox') {
			var iptValue = this.value;
			if(value == iptValue || (value && value.indexOf && value.indexOf(iptValue) !== -1) ) {
				this.checked = true;
			}
			else {
				this.checked = false;
			}
		}
		else {
			$(this).val(value);
		}
	});
};

//isReplace: 如果为true, 相同key值将被替换，否则则生成数组, 默认替换---
Instance.setValueByParam = function(model, param, value, isReplace) {
	var target = null;
	if(param.indexOf('.') === -1) {
		if(!model[param] || isReplace) {
			model[param] = value;
		}
		else {
		    model[param] = model[param] instanceof Array? model[param] : [model[param]];
		    model[param].push(value);
		}
	}
	else {
		param = param.split('.');
		var target = model;
		for(var i = 0; i < param.length - 1; i ++) {
			var key = param[i];
			if(!target[key]) {
				target[key] = {};
			}
			target = target[key];
		}

		arguments.callee.call(this, target, param.slice(-1)[0], value, isReplace);
	}
}

Instance.getJson = function(form) {
	var form = $(form);
	var model = {};
	var ipts = form.find('input[name]:visible, select[name]:visible, textarea[name]:visible');

	ipts.each(function() {
		var name = this.name;
		var value = this.value;

		if(this.type == 'checkbox') {
			this.checked && Instance.setValueByParam(model, name, value);
		}
		else if(this.type === 'radio') {
			this.checked && Instance.setValueByParam(model, name, value, true);
		}
		else {
			Instance.setValueByParam(model, name, value, true);
		}
	});

	return model
}

Instance.warn = function(msg, ele) {
    ele = $(ele);
    
    var removeTips = function(ele) {
        if(!ele) {
            return;
        }
        ele = ele.target || ele.srcElement || ele;
        ele = $(ele);
        var tips = ele.data('target');
        if(tips) {
            tips.data('timer') && clearTimeout(tips.data('timer'));
            tips.remove();
            ele.data('target', null);
        }
    };

    if(ele.data('target')) {
        removeTips(ele);
    }

    ele.off('click', removeTips);
    ele.on('click', removeTips);
    ele.on('blur', removeTips);

    var tips = $('<span class="zTooltips warn none">' + msg + '</span>');
    tips.appendTo('body');
    tips.fadeIn(200, function() {
        var timer = setTimeout(function() {
            removeTips();
        }, 5000);
        tips.data('timer', timer);
    });
    
    tips.css({
        left: ele.offset().left,
        top: ele.offset().top + ele.height() + 10
    });
    
    ele.data('target', tips);
    return tips;
}

if(window.module && module.exports) {
	module.exports = Instance;
}

else {
	window.formHelper = Instance;
}

