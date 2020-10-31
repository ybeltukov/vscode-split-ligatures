// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const decoration = vscode.window.createTextEditorDecorationType({
		//after: { contentText: "!", color: "red" },
		after: { contentText: "\u200A", width: "0" },
	  });

	// console.log('Congratulations, your extension "split-ligatures" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('split-ligatures.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Split Ligatures!');
	});

	context.subscriptions.push(disposable);

  
	vscode.window.onDidChangeTextEditorSelection((event) => {
		disableLigatures(event);
	});
  
	function disableLigatures(event: vscode.TextEditorSelectionChangeEvent) {
		const editor = event.textEditor;
		const ranges: vscode.Range[] = [];
		for (const selection of event.selections) {
			ranges.push(new vscode.Range(selection.active, selection.active));
			if (!selection.isEmpty) {
				ranges.push(new vscode.Range(selection.anchor, selection.anchor));
			}
		}
		editor.setDecorations(decoration, ranges);
	}	

}
