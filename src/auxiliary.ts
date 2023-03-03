import axios from 'axios';
import * as md5 from 'ts-md5';
import * as gooleTranslate from '@asmagin/google-translate-api';
import * as changeCase from 'change-case';
import * as vscode from 'vscode';

interface ResultCache {
    type: string;
    text: string;
    result: string;
}
let RESULT_CACHES: ResultCache[] = [];

export function getConfig(key: string) : string {
    let config = vscode.workspace.getConfiguration('quickTranslation').get(key);
    if (!config) {
        return '';
    }
    return config.toString();
}

export class Translate {
    type: string;
    platform: string;
    id: string;
    key: string;
    text: string;

    constructor(type: string, text: string) {
        this.type = type;
        this.platform = getConfig('api.platform');
        this.id = getConfig('api.id');
        this.key = getConfig('api.key');
        this.text = text;
    }

    isTargetLanguage(targetLanguage: string) : boolean {
        let pattern = /^^/;
        switch (targetLanguage) {
            case 'Arabic':
                pattern = /^[\u0600-\u06FF]+$/;
                break;
            case 'Chinese':
                pattern = /^[\u4e00-\u9fa5]+$/;
                break;
            case 'English': 
                pattern = /^[a-zA-Z]+$/;
                break;
            case 'French':
                pattern = /^[\u00C0-\u017F]+$/;
                break;
            case 'Russian':
                pattern = /^[\u0400-\u04FF]+$/;
                break;
            case 'Spanish':
                pattern = /^[\u00C0-\u017F]+$/;
                break;
            default:
                return false;
        }
        return pattern.test(this.text);
    }

    async baidu(targetLanguage: string) : Promise<string> {
        let salt = Date.now();
        let sign = `${this.id}${this.text}${salt}${this.key}`;
        sign = md5.Md5.hashStr(sign);
        let postData = {
            'q': this.text,
            'from': 'auto',
            'to': targetLanguage,
            'appid': this.id,
            'salt': salt,
            'sign': sign
        }
        let result = '';
        await axios.post('https://api.fanyi.baidu.com/api/trans/vip/translate', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                let results = response.data.trans_result;
                for (let resultsIndex = 0; resultsIndex < results.length; resultsIndex++) {
                    result += results[resultsIndex].dst;
                }
            });
        return result;
    }

    async result() : Promise<false | string> {
        let targetLanguage = '';
        if (this.type === 'toEnglish') {
            targetLanguage = 'English';
        } else {
            targetLanguage = getConfig('targetLanguage');
        }
        
        if (this.isTargetLanguage(targetLanguage)) {
            return this.text;
        }

        let resultCache = RESULT_CACHES.find(resultCacheItem => resultCacheItem.type === this.type && resultCacheItem.text === this.text);
        if (resultCache) {
            return resultCache.result;
        }

        let result = '';
        if (this.platform === 'Baidu') {
            if (!this.id || !this.key) {
                vscode.window.showErrorMessage('ID and KEY cannot be empty.');
                return false;
            }

            interface LanguageMaps {
                [Language: string]: string;
            }
            let languageMaps: LanguageMaps = {
                'Arabic': 'ara',
                'Chinese': 'zh',
                'English': 'en',
                'French': 'fra',
                'Russian': 'ru',
                'Spanish': 'spa'
            };
            result = await this.baidu(languageMaps[targetLanguage]);
        } else {
            interface LanguageMaps {
                [Language: string]: string;
            }
            let languageMaps: LanguageMaps = {
                'Arabic': 'ar',
                'Chinese': 'zh-CN',
                'English': 'en',
                'French': 'fr',
                'Russian': 'ru',
                'Spanish': 'es'
            };
            result = (await gooleTranslate(this.text, {to: languageMaps[targetLanguage]})).text;
        }
        if (!result) {
            vscode.window.showErrorMessage('Translation failed.');
            return false;
        }
        RESULT_CACHES.push({
            'type': this.type,
            'text': this.text,
            'result': result
        });
        return result;
    }
}

export class pick {
    constructor() {
    }

    async quickPick(title: string, items: {label: string, description: string}[]): Promise<string> {
        let result = await vscode.window.showQuickPick(items, {placeHolder: title});
        if (!result) {
            return '';
        }
        return result.label;
    }

    async namingFormat(text: string) : Promise<string> {
        let maps = [
            {handle: changeCase.camelCase, description: 'Camel Case'},
            {handle: changeCase.pascalCase, description: 'Pascal Case'},
            {handle: changeCase.snakeCase, description: 'Snake Case'},
            {handle: changeCase.paramCase, description: 'Param Case'},
            {handle: changeCase.headerCase, description: 'Header Case'},
            {handle: changeCase.noCase, description: 'No Case'},
            {handle: changeCase.capitalCase, description: 'Capital Case'},
            {handle: changeCase.constantCase, description: 'Constant Case'},
        ];
        let items = maps.map(item => ({
            label: item.handle(text),
            description: item.description,
        }));
        return await this.quickPick('Naming Format', items);
    }

    async whether() : Promise<string> {
        let items = [
            {label: 'Yes', description: 'Yes'},
            {label: 'No', description: 'No'},
        ];
        return await this.quickPick('Restructure Variable', items);
    }
}

export function restructureVariable(oldName: string, newName: string) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    let document = editor.document;
    let text = document.getText();
    let pattern = new RegExp(`\\b${oldName}\\b`, 'g');
    let result = text.replace(pattern, newName);
    let edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), result);
    vscode.workspace.applyEdit(edit);
}