"auto"
var storage = storages.create("com.netease.sky:badge");
var global_option = getMenu();
if (!storage.contains("menu")) {
    storage.put("menu", global_option);
}
startSky();

/**
 * 打开app
 */
function startApp(url) {
    // 选择渠道
    var package_name = getAppChannelPackageName();
    var class_name = "com.tgc.sky.netease.GameActivity_Netease";

    if (package_name == null || package_name.length === 0) {
        toast("未选择渠道");
        return;
    }
    app.startActivity({
        action: "android.nfc.action.NDEF_DISCOVERED",
        category: "android.intent.category.DEFAULT",
        data: url,
        type: "https",
        packageName: package_name,
        className: class_name
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

/**
 * 渠道包名
 * @returns 
 */
function getAppChannelPackageName() {
    let package_map = {
        "[C]网易": "com.netease.sky",
        "[C]哔哩哔哩": "com.netease.sky.bilibili",
        "[C]九游": "com.netease.sky.aligames",
        "[C]OPPO": "com.netease.sky.nearme.gamecenter",
        "[C]4399": "com.netease.sky.m4399",
        "[C]小米": "com.netease.sky.mi",
        "[C]VIVO": "com.netease.sky.vivo",
        "[C]应用宝": "com.tencent.tmgp.eyou.eygy"
    };
    let channel_options = Object.keys(package_map).map(function (data) {
        return data;
    });
    let index = dialogs.select("请选择渠道", channel_options);
    let channel_name = channel_options[index];
    let channel_package = package_map[channel_name];
    console.log("channel:" + channel_name + ",package:" + channel_package);
    return channel_package;
}

/**
 * 全局菜单
 * @returns 
 */
function getMenu() {
    return { "[O]录入徽章": "add", "[O]清空徽章": "clear", "[O]删除徽章": "delete" };
}