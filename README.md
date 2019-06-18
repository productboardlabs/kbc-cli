## kbc-cli

> command line interface for [Keboola Connection (KBC)](https://developers.keboola.com/)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/kbc-cli.svg)](https://npmjs.org/package/kbc-cli)
[![CircleCI](https://circleci.com/gh/dudko/kbc-cli/tree/master.svg?style=shield)](https://circleci.com/gh/dudko/kbc-cli/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/kbc-cli.svg)](https://npmjs.org/package/kbc-cli)
[![License](https://img.shields.io/npm/l/kbc-cli.svg)](https://github.com/dudko/kbc-cli/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g kbc-cli
$ kbc-cli COMMAND
running command...
$ kbc-cli (-v|--version|version)
kbc-cli/0.0.1 darwin-x64 node-v10.15.3
$ kbc-cli --help [COMMAND]
USAGE
  $ kbc-cli COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`kbc-cli hello [FILE]`](#kbc-cli-hello-file)
- [`kbc-cli help [COMMAND]`](#kbc-cli-help-command)

## `kbc-cli hello [FILE]`

describe the command here

```
USAGE
  $ kbc-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ kbc-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/dudko/kbc-cli/blob/v0.0.1/src/commands/hello.ts)_

## `kbc-cli help [COMMAND]`

display help for kbc-cli

```
USAGE
  $ kbc-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

<!-- commandsstop -->
