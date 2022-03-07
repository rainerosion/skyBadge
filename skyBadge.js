"auto"
// 徽章数据
var storage = storages.create("com.netease.sky:badge1");
// storage.clear();
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
    let package_name = getAppChannelPackageName();
    let class_name = getClassName(package_name);

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
    let current_channel = currentChannel();
    let current_channel_name = "[C] 当前【" + current_channel["name"] + "】";
    let current_map = {};
    current_map[current_channel_name] = "channel";
    console.log(current_map);

    let menu_map = Object.assign(current_map, storage.get("menu"));
    let options = Object.keys(menu_map).map(function (data) {
        return data;
    });
    let i = dialogs.select("请选择一个选项", options);
    if (i >= 0) {
        console.log(options[i]);
        let value = menu_map[options[i]];
        if (value.length > 0) {
            // 计算菜单长度
            let len = Object.keys(menu_map).length;
            switch (value) {
                case "add":
                    toast("添加徽章");
                    let name = rawInput("输入徽章名称").trim();
                    let url = rawInput('输入徽章链接').trim();
                    let isBadge = /^https:\/\/sky.thatg.co\/\?s=[\S]+$/.test(url);
                    if (name.length > 0 && isBadge) {
                        // 录入信息
                        name = "[徽章]" + name;
                        menu_map[name] = url;
                        storage_map = {};
                        // 过滤数据
                        Object.keys(menu_map).map(function (key, index) {
                            console.log("key => " + key, "index => " + index);
                            if (!isSwitchOptions(key, menu_map)) {
                                storage_map[key] = menu_map[key]
                            }
                        });
                        storage.put("menu", storage_map);
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
                    let choice = dialogs.confirm("确定要清空所有徽章信息？");
                    if (choice) {
                        storage.put("menu", global_option);
                    }
                    startSky();
                    break;
                case "delete":
                    // let len = Object.keys(menu_map).length;
                    if (len - 1 > Object.keys(getMenu()).length) {
                        delete_options = [];
                        storage_map = {};
                        Object.keys(menu_map).map(function (key, index) {
                            console.log("key => " + key, "index => " + index);
                            if (!isOptions(key, menu_map)) {
                                delete_options.push(key);
                            }
                            if (!isSwitchOptions(key, menu_map)) {
                                storage_map[key] = menu_map[key]
                            }
                        });
                        let delete_index = dialogs.select("请选择需要删除的徽章", delete_options);
                        console.log(delete_options[delete_index]);
                        // 删除指定
                        delete storage_map[delete_options[delete_index]];
                        storage.put("menu", storage_map);
                        startSky();
                    } else {
                        toast("你没有录入任何徽章信息");
                        // 再次打开菜单
                        startSky();
                    }
                    break;
                case "channel":
                    // 选择渠道
                    selectAppChannelPackageName();
                    startSky();
                    break;
                case "update":
                    // 更新徽章次数
                    // let len = Object.keys(menu_map).length;
                    console.log("len => " + len + " menuLen => " + Object.keys(getMenu()).length);
                    if (len - 1 > Object.keys(getMenu()).length) {
                        update_options = [];
                        storage_map = {};
                        Object.keys(menu_map).map(function (key, index) {
                            console.log("key => " + key, "index => " + index);
                            if (!isOptions(key, menu_map)) {
                                update_options.push(key);
                            }
                            if (!isSwitchOptions(key, menu_map)) {
                                storage_map[key] = menu_map[key]
                            }
                        });
                        let update_index = dialogs.select("请选择需要更新的徽章", update_options);
                        // console.log("update => " + update_options[update_index]);
                        // 获取数据
                        let uri = storage_map[update_options[update_index]];
                        // 截取前缀
                        let prefix = uri.substring(0, uri.length - 6);
                        // 计数器
                        let counter = uri.substring(uri.length - 6);
                        // console.log("prefix => " + prefix + ",counter => " + counter + ",counterDec => " + hex2dec(counter));
                        // 保存数据
                        let num = rawInput("请在输入框输入新的次数，当前:" + hex2dec(counter) + "次").trim();
                        rules = /^[0-9]+$/;
                        if (rules.test(num)) {
                            if (num < hex2dec(counter)) {
                                toast("将要更新的次数[" + num + "]小于当前次数[" + hex2dec(counter) + "]可能会无法使用，请悉知!!!");
                            }
                            // 转换为16进制
                            let counter_hex = dec2hex(num, 6)
                            // console.log("num => " + num + ",hex => " + counter_hex + "newData => " + (prefix + counter_hex));
                            // 更新数据
                            storage_map[update_options[update_index]] = prefix + counter_hex;
                            storage.put("menu", storage_map);
                        } else {
                            toast("徽章次数只能输入整数。");
                            return;
                        }
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
    if (menu[key] == "add"
        || menu[key] == "delete"
        || menu[key] == "clear"
        || menu[key] == "channel"
        || menu[key] == "update"
    ) {
        return true;
    }
    return false;
}

/**
 * 判断是否为渠道切换操作项
 *
 * @param key
 * @param menu
 * @returns {boolean}
 */
function isSwitchOptions(key, menu) {
    if (menu[key] == "channel") {
        return true;
    }
    return false;
}

/**
 * 已选择的渠道包名
 * 
 * @returns 
 */
function getAppChannelPackageName() {
    let channel = storage.get("channel");
    let package = channel["package"];
    console.log("当前渠道包：" + package);
    return package;
}

/**
 * 选择渠道
 */
function selectAppChannelPackageName() {
    let package_map = {
        "[C] 网易": "com.netease.sky",
        "[C] 哔哩哔哩": "com.netease.sky.bilibili",
        "[C] 九游": "com.netease.sky.aligames",
        "[C] OPPO": "com.netease.sky.nearme.gamecenter",
        "[C] 4399": "com.netease.sky.m4399",
        "[C] 小米": "com.netease.sky.mi",
        "[C] VIVO": "com.netease.sky.vivo",
        "[C] 应用宝": "com.tencent.tmgp.eyou.eygy",
        "[C] 华为": "com.netease.sky.huawei",
        "[I] 国际服": "com.tgc.sky.android",
        "[T] 测试服": "com.tgc.sky.android.test.gold",
    };
    let channel_options = Object.keys(package_map).map(function (data) {
        return data;
    });
    let index = dialogs.select("请选择渠道", channel_options);
    let channel_name = channel_options[index];
    let channel_package = package_map[channel_name];
    let channel_map = {
        "name": channel_name.substring(4),
        "package": channel_package
    };
    storage.put("channel", channel_map);
    console.log("channel:" + channel_name + ",package:" + channel_package);
}

/**
 * 全局菜单
 * 
 * @returns 
 */
function getMenu() {
    return {
        "[O] 录入徽章": "add",
        "[O] 清空徽章": "clear",
        "[O] 删除徽章": "delete",
        "[O] 更新次数": "update"
    };
}

/**
 * 获取class
 * 
 * @param package_name 
 */
function getClassName(package_name) {
    let china_class_name = "com.tgc.sky.netease.GameActivity_Netease";
    let international_class_name = "com.tgc.sky.GameActivity";
    // 测试服务和国际服class一致
    if (isInternational(package_name) || isTest(package_name)) {
        return international_class_name;
    } else {
        return china_class_name;
    }
}

/**
 * 判断是否为国际服
 * 
 * @param package_name 
 */
function isInternational(package_name) {
    if (package_name === "com.tgc.sky.android") {
        return true;
    }
    return false;
}


/**
 * 判断是否为测试服
 * 
 * @param package_name 
 */
function isTest(package_name) {
    if (package_name === "com.tgc.sky.android.test.gold") {
        return true;
    }
    return false;
}

/**
 * 获取当前渠道
 */
function currentChannel() {
    // 未选择默认官服
    if (!storage.contains("channel")) {
        let channel_map = {
            "name": "网易",
            "package": "com.netease.sky"
        };
        // 设置默认渠道
        storage.put("channel", channel_map);
    }
    return storage.get("channel");
}

/**
 * 16进制转10进制
 * @param {*} hex 16进制
 * @returns 
 */
function hex2dec(hex) {
    return parseInt(hex, 16);
}

/**
 * 10进制转16进制
 * 
 * @param {*} dec 10进制
 * @param {*} len 长度
 * @returns 
 */
function dec2hex(dec, len) {
    var hex = "";
    while (dec) {
        var last = dec & 15;
        hex = String.fromCharCode(((last > 9) ? 55 : 48) + last) + hex;
        dec >>= 4;
    }
    if (len) {
        while (hex.length < len) hex = '0' + hex;
    }
    return hex;
}