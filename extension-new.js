const { EOL } = require('os')
const vscode = require('vscode')
const escapeStringRegexp = require('escape-string-regexp')
let charsList

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    await readConfig()

    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration('auto-comment-next-line')) {
            await readConfig()
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
                            appendText: item.char
                        }
                    }
                ]
            })
        }
    }
}

async function readConfig() {
    return charsList = await vscode.workspace.getConfiguration('auto-comment-next-line').list
}

exports.activate = activate

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
