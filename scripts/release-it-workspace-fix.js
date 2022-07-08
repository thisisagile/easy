const fs = require('fs');
const path = require('path');
const walkSync = require('walk-sync');
const detectNewline = require('detect-newline');
const detectIndent = require('detect-indent');
const { Plugin } = require('release-it');

const ROOT_MANIFEST_PATH = './package.json';
const DETECT_TRAILING_WHITESPACE = /\s+$/;

function resolveWorkspaces(workspaces) {
  if (Array.isArray(workspaces)) {
    return workspaces;
  } else if (workspaces !== null && typeof workspaces === 'object') {
    return workspaces.packages;
  }

  throw new Error(
    "This package doesn't use yarn workspaces. (package.json doesn't contain a `workspaces` property)"
  );
}

const jsonFiles = new Map();

class JSONFile {
  static for(path) {
    if (jsonFiles.has(path)) return jsonFiles.get(path);

    let jsonFile = new this(path);
    jsonFiles.set(path, jsonFile);

    return jsonFile;
  }

  constructor(filename) {
    let contents = fs.readFileSync(filename, { encoding: 'utf8' });

    this.filename = filename;
    this.pkg = JSON.parse(contents);
    this.lineEndings = detectNewline(contents);
    this.indent = detectIndent(contents).amount;

    let trailingWhitespace = DETECT_TRAILING_WHITESPACE.exec(contents);
    this.trailingWhitespace = trailingWhitespace ? trailingWhitespace : '';
  }

  write() {
    let contents = JSON.stringify(this.pkg, null, this.indent).replace(/\n/g, this.lineEndings);

    fs.writeFileSync(this.filename, contents + this.trailingWhitespace, { encoding: 'utf8' });
  }
}

class FixWorkspacePlugin extends Plugin {
  constructor(...args) {
    super(...args);

    const { workspaces } = require(path.resolve(ROOT_MANIFEST_PATH));

    this.workspaces = resolveWorkspaces(workspaces);
    this.root = process.cwd();
  }

  async bump(version) {
    const workspaces = this.getWorkspaces();

    const task = async () => {
      const { isDryRun } = this.config;

      workspaces.forEach(({ relativeRoot, pkgInfo }) => {
        this.log.exec(`Processing ${relativeRoot}/package.json:`);
        this._patchDependencies(pkgInfo, version);
        if (!isDryRun) pkgInfo.write();
      });
    };

    return this.spinner.show({ task, label: 'yarn version' });
  }

  _patchDependencies(pkgInfo, newVersion) {
    const { isDryRun } = this.config;
    const workspaces = this.getWorkspaces();
    const { pkg } = pkgInfo;

    const patchDependencies = type => {
      let dependencies = pkg[type];

      if (dependencies) {
        for (let dependency in dependencies) {
          if (workspaces.find((w) => w.name === dependency)) {
            const existingVersion = dependencies[dependency];
            const replacementVersion = existingVersion.replace('workspace:', '');

            this.log.exec(`\t${type}: \`${dependency}\` -> ${replacementVersion} (from ${existingVersion})`);

            if (!isDryRun) dependencies[dependency] = replacementVersion;
          }
        }
      }
    };

    patchDependencies('dependencies');
    patchDependencies('devDependencies');
    patchDependencies('optionalDependencies');
    patchDependencies('peerDependencies');
  }

  getWorkspaces() {
    if (this._workspaces) return this._workspaces;

    let packageJSONFiles = walkSync('.', { globs: this.workspaces.map(glob => `${glob}/package.json`) });

    return this._workspaces = packageJSONFiles.map(f => {
      let absolutePath = path.join(this.root, f);
      let pkgInfo = JSONFile.for(absolutePath);
      let relativeRoot = path.dirname(f);

      return {
        root: path.join(this.root, relativeRoot),
        relativeRoot,
        name: pkgInfo.pkg.name,
        isPrivate: !!pkgInfo.pkg.private,
        pkgInfo,
      };
    });
  }
}

module.exports = FixWorkspacePlugin;
