const vscode = require('vscode')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let charsList = getConfig().list

    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('auto-comment-next-line')) {
            charsList = getConfig().list
        }
    })

    vscode.workspace.onDidChangeTextDocument((e) => {
        let doc = e.document
        let content = e.contentChanges
        let lastChange = content[content.length - 1]

        if (doc && content.length && lastChange.text.includes('\n')) {
            let prevLine = lastChange.range.start.line
            let txt = doc.lineAt(prevLine).text.trim()

            if (charsList.some((char) => txt.startsWith(char))) {
                vscode.commands.executeCommand('editor.action.commentLine')
            }
        }
    })
}
exports.activate = activate

function getConfig() {
    return vscode.workspace.getConfiguration('auto-comment-next-line')
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
