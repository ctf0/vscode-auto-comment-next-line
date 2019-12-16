i've tried every possible ext that add this feature but sadly all have its own issues, so without any hacks or workarounds, here's what we do

- check if pressed key is "enter".
- check if previous line started with a comment char.
- if so, execute the `editor.action.commentLine` command.

## Config∫

- single line comment chars list
    - until https://github.com/microsoft/vscode/issues/580 is solved, we have to use the manual way :disappointed:

```json
"auto-comment-next-line.list": [
    "//",
    "#"
]
```
