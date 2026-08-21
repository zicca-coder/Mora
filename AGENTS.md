## Windows Shell Rules

This project may be executed by Codex on Windows.

When running shell commands on Windows:

- Assume the shell may be Windows PowerShell 5.1 unless verified otherwise.
- Do not assume Bash syntax is available.
- Do not use Bash-only constructs such as:
  - `export`
  - `rm -rf`
  - `cat <<EOF`
  - `grep | sed | awk`
  - `$()`
- Do not rely on `&&` or `||` unless PowerShell 7 has been verified.
- Prefer simple commands over complex PowerShell one-liners.
- Run one logical operation per shell invocation when possible.
- Prefer cross-platform executable tools directly:
  - `git`
  - `rg`
  - `node`
  - `pnpm`
  - `npm`
  - `python`
  - `cmake`
- Prefer Codex file editing/patch tools over PowerShell commands for modifying files.
- Do not use PowerShell text replacement commands for large source-code edits.
- If a command fails because of shell syntax, inspect the current shell/version before retrying.
- Do not repeatedly try alternative shell syntaxes blindly.