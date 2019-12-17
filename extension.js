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

        if (doc) {
            let lang = doc.languageId
            let content = e.contentChanges
            let lastChange = content[content.length - 1]

            if (content.length && lastChange.text.startsWith('\n')) {
                let prevLine = lastChange.range.start.line
                let txt = doc.lineAt(prevLine).text.trim()

                if (hasACommentedLine(charsList, txt, lang)) {
                    vscode.commands.executeCommand('editor.action.commentLine')
                }
            }
        }
    })
}

function hasACommentedLine(list, txt, lang) {
    return list.some((item) => {
        return txt.startsWith(item.char) && item.languages.some((langId) => langId == lang)
    })
}

function getConfig() {
    return vscode.workspace.getConfiguration('auto-comment-next-line')
}

exports.activate = activate

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
