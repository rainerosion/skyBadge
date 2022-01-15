"auto"
// console.show();
var storage = storages.create("com.netease.sky:badge");
// storage.clear();
var global_option = { "[O]录入徽章": "add", "[O]清空徽章": "clear", "[O]删除徽章": "delete" }
if (!storage.contains("menu")) {
    storage.put("menu", global_option);
}
startSky();

/**
 * 打开app
 */
function startApp(url) {
    var packageName = 'com.netease.sky';
    var className = 'com.tgc.sky.netease.GameActivity_Netease';
    app.startActivity({
        action: "android.nfc.action.NDEF_DISCOVERED",
        category: "android.intent.category.DEFAULT",
        data: url,
        type: "https",
        packageName: packageName,
        className: className
    });
}

/**
 * 主要方法
 */
function startSky() {
    var menu_map = storage.get("menu");
    var options = Object.keys(menu_map).map(function (data) {
        return data;
    })
    var i = dialogs.select("请选择一个选项", options);
    if (i >= 0) {
        console.log(options[i]);
        var value = menu_map[options[i]];
        if (value.length > 0) {
            switch (value) {
                case "add":
                    toast("添加徽章");
                    var name = rawInput("输入徽章名称").trim();
                    var url = rawInput('输入徽章链接').trim();
                    var isBadge = /^https:\/\/sky.thatg.co\/\?s=[\S]+$/.test(url);
                    if (name.length > 0 && isBadge) {
                        // 录入信息
                        name = "[徽章]" + name;
                        menu_map[name] = url;
                        storage.put("menu", menu_map);
                        toast("徽章录入成功");
                        // 再次打开菜单
                        startSky();
                    } else {
                        toast("徽章链接格式不正确！");
                        // 再次打开菜单
                        startSky();
                    }
                    break;
                case "clear":
                    var choice = dialogs.confirm("确定要清空所有徽章信息？");
                    if (choice) {
                        storage.put("menu", global_option);
                    }
                    startSky();
                    break;
                case "delete":
                    var len = Object.keys(menu_map).length
                    if (len > 3) {
                        delete_options = [];
                        Object.keys(menu_map).map(function (key, index) {
                            console.log("key => " + key, "index => " + index);
                            if (!isOptions(key, menu_map)) {
                                delete_options.push(key);
                            }
                        });
                        var delete_index = dialogs.select("请选择需要删除的徽章", delete_options);
                        console.log(delete_options[delete_index]);
                        // 删除指定
                        delete menu_map[delete_options[delete_index]];
                        storage.put("menu", menu_map);
                        startSky();
                    } else {
                        toast("你没有录入任何徽章信息");
                        // 再次打开菜单
                        startSky();
                    }
                    break;
                default:
                    // 启动app
                    console.log(value);
                    startApp(value);
            }
        }
    } else {
        toast("您取消了选择");
    }
}

/**
 * 判断是否为操作项
 *
 * @param key
 * @param menu
 * @returns {boolean}
 */
function isOptions(key, menu) {
    if (menu[key] == "add" || menu[key] == "delete" || menu[key] == "clear") {
        return true;
    }
    return false;
}