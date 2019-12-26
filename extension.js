const { EOL } = require('os')
const vscode = require('vscode')
const escapeStringRegexp = require('escape-string-regexp')
let charsList

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    readConfig()

    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('auto-comment-next-line')) {
            readConfig()
        }
    })

    for (const item of charsList) {
        for (const lang of item.languages) {
            vscode.languages.setLanguageConfiguration(lang, {
                onEnterRules: [
                    {
                        beforeText: new RegExp(escapeStringRegexp(item.char)),
                        action: {
                            indentAction: 0,
                            appendText: `${item.char} `
                        }
                    }
                ]
            })
        }
    }
}

function hasACommentedLine(list, txt, lang) {
    return list.some((item) => {
        return txt.startsWith(item.char) && item.languages.some((langId) => langId == lang)
    })
}

function getConfig() {
    return vscode.workspace.getConfiguration('auto-comment-next-line')
}

function readConfig() {
    return charsList = getConfig().list
}

exports.activate = activate

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
