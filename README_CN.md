---
[English](./README.md) | [中文](README_CN.md)
---
## 介绍
一款翻译变量,选中文本的VS Code插件.
## 功能
1. 将变量翻译成英语,支持多种命名格式.
2. 将所选文本翻译为目标语言.
## 配置
### API
1. quickTranslation.api.platform: 平台.
2. quickTranslation.api.id: ID,当平台是Google时,无需填写.
3. quickTranslation.api.key: KEY,当平台是Google时,无需填写.
### 目标语言
quickTranslation.targetLanguage: 目标语言.
### 功能
1. quickTranslation.variable: 开启/关闭翻译变量(如果启用,选中变量后,按Ctrl+Shift+R/Command+Shift+R组合键替换)它).
2. quickTranslation.function.translateSelectText: 开启/关闭翻译选中文本.
3. quickTranslation.function.autoTranslateSelectText: 如果启用,悬停自动翻译选中文本,如果禁用,悬停并按Ctrl+Shift+T/Command+Shift+T组合键翻译.