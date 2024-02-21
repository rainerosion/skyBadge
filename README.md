<p align="center">
  <a href="https://github.com/rainerosion/skyBadge/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/rainerosion/skyBadge" alt="license">
  </a>
  <a href="https://github.com/rainerosion/skyBadge">
    <img src="https://img.shields.io/github/stars/rainerosion/skyBadge" alt="stars">
  </a>
  <a href="https://github.com/rainerosion/skyBadge/releases">
    <img src="https://img.shields.io/github/v/release/rainerosion/skyBadge?include_prereleases" alt="release">
  </a>
</p>

# [auto.js]光遇徽章使用脚本

## Sky徽章助手app已发布

APP版本已发布，当前脚本不再维护，APP交流群：166137688

## 初衷

写本脚本的初衷是为了方便使用徽章，不用携带徽章也能随时使用徽章带来的魔法。

实际上光遇NTAG徽章设计，感应区为徽章背面的小圆点部分，而这部分感应区太小且徽章的针扣也在这一面，手机nfc感应区位置问题导致徽章无法放平使用，也无法从背面扫描徽章，经常导致扫描无反应或者需要将徽章在手机nfc感应区移动很久才有反应。

## 功能

- [x] 录入徽章

- [x] 使用徽章

- [x] 渠道服选择

- [x] 国际服支持

- [x] 测试服支持

- [x] 修改使用次数

- [x] 徽章排序

- [ ] 导出徽章
  
- [ ] 导入徽章

## 使用方法

- 使用NFC Tools Pro(其他软件也可)读取实体徽章的URL

- 打当前脚本录入徽章URL

## 注意事项

- auto.js 版本 4.0.0 Beta 及以上

- **手机无NFC功能也可使用**（但是需要找有nfc功能的手机读取徽章数据）

- 首先你需要有光遇实体徽章

- 使用本脚本后如果使用实体徽章后需要重新录入徽章信息，原有的徽章信息会失效。

- 使用本脚本后也可能造成你的徽章失效，需要在NFC下多刷几次，手机有反应即可，无需打开app

## 相关问题 

> 为什么实体徽章会有几次无法使用？

光遇的NTAG徽章使用了NFC COUNTER(nfc计数器)，每次在nfc下使用徽章会使得徽章使用次数加1（无论你是否打开光遇）。当你打开光遇app并使用徽章时，光遇服务器就会记录徽章使用次数，下次使用时会校验使用次数，小于上一次的使用次数时候会抛出异常（徽章验证错误：CANNOT_UPDATE_NFC_COUNTER）。

举个例子：如果你的徽章在光遇中使用了10次，此时你将徽章信息复制并录入，程序记录下的使用次数也是10次，当你再次使用实体徽章，此时原徽章使用次数变为11次，但程序中的使用次数依旧为10，此时打开光遇后就会报错（徽章验证错误）。当然如果你使用本程序时次数为20次（使用次数可以手动修改NTAG中url的最后6位16进制数），而你实体徽章次数为15次，相差了5次，此时你需要使用实体徽章在nfc下刷5次后方可使用，因此切勿随意更改徽章使用次数，否则可能导致原徽章无法正常使用。

> 打开光遇报错 徽章验证错误：CANNOT_UPDATE_NFC_COUNTER

重新录入最新的徽章信息

> 使用本程序后，使用实体徽章报错 徽章验证错误：CANNOT_UPDATE_NFC_COUNTER 

多在NFC下刷几次徽章（无需打开光遇app，手机有反应即可）更新徽章使用次数。切勿随意更改徽章使用次数，否则可能导致原徽章无法正常使用，轻则需要刷原徽章几十次、几百次、甚至上千次，重则要刷上万次、上百万次才能使徽章恢复正常，这取决于你修改的徽章使用次数的大小。注意原徽章的数据是无法更改的。


## 渠道服务包名

<s>如果你正在使用渠道服，请修改脚本第15行的com.netease.sky为下表中渠道对应的包名，</s>目前无需修改，各渠道包名见下表。

| 包名                     | 渠道名称        |
| ------------------------ |-------------|
| com.netease.sky          | 网易          |
| com.netease.sky.bilibili | 哔哩哔哩        |
| com.netease.sky.aligames | 九游          |
| com.netease.sky.nearme.gamecenter | Realme/OPPO |
| com.netease.sky.m4399 | 4399        |
| com.netease.sky.mi | 小米          |
| com.netease.sky.vivo | VIVO        |
| com.tencent.tmgp.eyou.eygy | 应用宝         |
| com.netease.sky.huawei | 华为          |
| com.tgc.sky.android | 国际服         |
| com.tgc.sky.android.test.gold | 测试服         |
| com.tgc.sky.android.huawei | 华为国际服       |

## 更新日志

### 2022.01.15

- 发布第一个仅支持网易官方国服的版本。

### 2022.01.17

- 补充添加国内各渠道服。

### 2022.02.01

- 调整渠道服选择方式，由选择徽章后选择渠道改为先设置全局渠道，然后再使用徽章。

### 2022.02.15

- 添加华为渠道服支持。

- 修复删除和录入徽章显示多个渠道问题。

### 2022.03.07

- 添加测试服务支持。
- 添加更新徽章使用次数功能，用于解决使用实体徽章后原数据失效问题。

### 2022.03.08

- 添加自定义徽章排序功能【由用户 [影灵3](https://github.com/1173922902) 贡献 】

### 2022.05.04

- 添加华为国际服支持


## 贡献

特别鸣谢以下用户的贡献

- [影灵3](https://github.com/1173922902)

## 敬请期待
- 正在规划开发app版本
- 录入更方便（直接刷徽章录入）

