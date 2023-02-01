import * as vscode from 'vscode';
import * as function_ from './function';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(function_.translateVariable);
	context.subscriptions.push(function_.manualTranslateSelectText);
	context.subscriptions.push(function_.autoTranslateSelectText);
}

export function deactivate() {
	
}