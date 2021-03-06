const {EOL} = require('os')
const vscode = require('vscode')
const PACKAGE_NAME = 'autoCommentNextLine'

let charsList = []

async function activate(context) {
    await readConfig()

    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration(PACKAGE_NAME)) {
            await readConfig()
        }
    })

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((e) => {
            if (e) {
                let {document, contentChanges} = e
                let editor = vscode.window.activeTextEditor

                if (editor && document == editor.document) {
                    let lastChange = contentChanges[contentChanges.length - 1]

                    if (contentChanges.length && lastChange.text.startsWith(EOL)) {
                        let prevLine = lastChange.range.start.line
                        let txt = document.lineAt(prevLine).text.trim()

                        if (hasACommentedLine(txt, document.languageId)) {
                            vscode.commands.executeCommand('editor.action.commentLine')
                        }
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
    let config = await vscode.workspace.getConfiguration(PACKAGE_NAME)
    charsList = config.list
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
