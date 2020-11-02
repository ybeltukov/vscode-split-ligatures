// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const splitDecor = vscode.window.createTextEditorDecorationType({
		//after: { contentText: "!", color: "red" },
		after: { contentText: "\u200A", width: "0" },
	  });

	const disDecor = vscode.window.createTextEditorDecorationType({
		textDecoration: "undefined; font-variant-ligatures: none; font-feature-settings: \"liga\" 0;",
	});	  

	// console.log('Congratulations, your extension "split-ligatures" is now active!');

	let disposable = vscode.commands.registerCommand('split-ligatures.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Split Ligatures!');
		vscode.workspace.getConfiguration("split-ligatures").update("line", !config.line, true);
	});

	context.subscriptions.push(disposable);

	let config = readConfiguration();

	vscode.workspace.onDidChangeConfiguration(
		(event) => {
			config = readConfiguration();
		});	

	vscode.window.onDidChangeTextEditorSelection((event) => {
		disableLigatures(event);
	});

	function readConfiguration() {
		return  vscode.workspace.getConfiguration().get('split-ligatures') as any;
	}	
  
	function disableLigatures(event: vscode.TextEditorSelectionChangeEvent) {
		const editor = event.textEditor;
		const splitRanges: vscode.Range[] = [];
		const disRanges: vscode.Range[] = [];
		for (const selection of event.selections) {
			for (let i = -config.before; i <= config.after; i++) {
				let p = selection.active;
				if (p.character + i >= 0) {
					splitRanges.push(new vscode.Range(p.translate(0, i), p.translate(0, i)));
				}
				if (!selection.isEmpty) {
					let p = selection.anchor;
					if (p.character + i >= 0) {
						splitRanges.push(new vscode.Range(p.translate(0, i), p.translate(0, i)));
					}
				}
			}
			if (config.selection) {
				disRanges.push(selection);
			}
			if (config.line) {
				let p = selection.active.with(undefined, 0);
				disRanges.push(new vscode.Range(p, p.translate(1)));
			}
		}
		editor.setDecorations(splitDecor, splitRanges);
		editor.setDecorations(disDecor, disRanges);
	}	

}

