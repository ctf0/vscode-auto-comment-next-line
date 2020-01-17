const { EOL } = require('os')
const vscode = require('vscode')
let charsList = []

async function activate(context) {
    await readConfig()

    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration('auto-comment-next-line')) {
            await readConfig()
        }
    })

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((e) => {
            let { document, contentChanges } = e

            if (e && document == vscode.window.activeTextEditor.document) {
                let lastChange = contentChanges[contentChanges.length - 1]

                if (contentChanges.length && lastChange.text.startsWith(EOL)) {
                    let prevLine = lastChange.range.start.line
                    let txt = document.lineAt(prevLine).text.trim()

                    if (hasACommentedLine(txt, document.languageId)) {
                        vscode.commands.executeCommand('editor.action.commentLine')
                    }
                }
            }
        })
    )
}

function hasACommentedLine(txt, lang) {
    return charsList.some((item) => {
        return txt.startsWith(item.char) && item.languages.some((langId) => langId == lang)
    })
}

async function readConfig() {
    return charsList = await vscode.workspace.getConfiguration('auto-comment-next-line').list
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
