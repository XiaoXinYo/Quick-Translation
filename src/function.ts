import * as vscode from 'vscode';
import * as auxiliary from './auxiliary';

let SELECT_ING = false;

export const translateVariable = vscode.commands.registerCommand('extension.translateVariable', async () => {
    if (!auxiliary.getConfig('function.translateVariable')) {
        return;
    }
    
    SELECT_ING = true;
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        SELECT_ING = false;
        return;
    }
    let selection = editor.selection;
    let text = editor.document.getText(selection);
    if (!text) {
        SELECT_ING = false;
        return;
    }

    let result = await new auxiliary.Translate('toEnglish', text).result();
    if (!result) {
        SELECT_ING = false;
        return;
    }
    
    const pick = new auxiliary.pick();
    vscode.window.showQuickPick([{label: 'Translating'}]);
    let name = await pick.namingFormat(result);
    if (name) {
        let reconsitution = await pick.whether();
        if (reconsitution === 'Yes') {
            auxiliary.restructureVariable(text, name);
        } else {
            editor.edit(editBuilder => editBuilder.replace(selection, name));
        }
    }
    SELECT_ING = false;
});

export const manualTranslateSelectText = vscode.commands.registerCommand('extension.manualTranslateSelectText', async () => {
    if (!auxiliary.getConfig('function.translateSelectText') || auxiliary.getConfig('function.autoTranslateSelectText')) {
        return;
    }
    
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    let selection = editor.selection;
    let text = editor.document.getText(selection);
    if (!text) {
        return;
    }

    let result = await new auxiliary.Translate('toTargetLanguage', text).result();
    if (!result) {
        return;
    }
    vscode.window.showInformationMessage(result);
});

export const autoTranslateSelectText = vscode.languages.registerHoverProvider('*', {
    async provideHover(document, position, token) {
        if (!auxiliary.getConfig('function.translateSelectText') || !auxiliary.getConfig('function.autoTranslateSelectText')) {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 2500));

        if (SELECT_ING) {
            return;
        }

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let selection = editor.selection;
		let text = editor.document.getText(selection);
        if (!text) {
            return;
        }
        
        let result = await new auxiliary.Translate('toTargetLanguage', text).result();
        if (!result) {
            return;
        }
        return new vscode.Hover(result);
    }
});