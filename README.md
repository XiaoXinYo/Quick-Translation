![Release](https://img.shields.io/badge/Release-1.0.0-blue)
---
[English](./README.md) | [中文](./README_CN.md)
---
## Introduction
A translate variable, annotation, and select text VS Code plugin.
## Function
1. Translate variables into English and support multiple naming formats.
2. Translate the selected text into the target language.
## Configuration
### API
1. quickTranslation.api.platform: Platform.
2. quickTranslation.api.id: ID,When the platform is Google, there is no need to fill in.
3. quickTranslation.api.key: KEY,When the platform is Google, there is no need to fill in.
### Target Language
quickTranslation.targetLanguage: Target language.
### Function
1. quickTranslation.variable: Enable/Disable Translate variable into English(If enabled,after selecting the variable,press Ctrl+Shift+R/Command+Shift+R to replace).
2. quickTranslation.function.translateSelectText: Enable/Disable Translate select text into target language.
3. quickTranslation.function.autoTranslateSelectText: If enabled, hover to automatically translate the selected text. If disabled, hover and press Ctrl+Shift+T/Command+Shift+T to translate.