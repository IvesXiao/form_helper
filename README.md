# form_helper
模拟Chrome进行表单验证、提示；根据Name从表单中获取JSON； 将JSON对象快速绑定到Form上

Form相关辅助函数：
	
    formHelper.getJson(form);
	从指定表单中，获取出JSON对象的值

	formHelper.fill(form, json);
	根据给出的JSON对象，将值填充到form中

	formHelper.validity(form);
	跟submit表单验证差不多的效果，增强型实现

	formHelper.laodingButton(btnOrForm);
	设置按钮为加载中样式，并disable掉，防止重复提交
	
	formHelper.resetButton(btnOrForm);
	与loadingButton对应，重置按钮，使他可用