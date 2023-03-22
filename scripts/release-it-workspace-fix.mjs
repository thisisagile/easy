import fs from 'fs';
import path from 'path';
import walkSync from 'walk-sync';
import detectNewline from 'detect-newline';
import detectIndent from 'detect-indent';
import { Plugin } from 'release-it';

const ROOT_MANIFEST_PATH = './package.json';

class PackageJson {
  constructor(filename) {
    const contents = fs.readFileSync(filename, { encoding: 'utf8' });

    this.filename = filename;
    this.pkg = JSON.parse(contents);
    this.name = this.pkg.name;

    this.lineEndings = detectNewline(contents);
    this.indent = detectIndent(contents).amount;
    const trailingWhitespace = /\s+$/.exec(contents);
    this.trailingWhitespace = trailingWhitespace ? trailingWhitespace[0] : '';
  }

  write() {
    const contents = JSON.stringify(this.pkg, null, this.indent).replace(/\n/g, this.lineEndings);
    fs.writeFileSync(this.filename, contents + this.trailingWhitespace, { encoding: 'utf8' });
  }
}

class FixWorkspacePlugin extends Plugin {
  constructor(...args) {
    super(...args);

    const { workspaces } = JSON.parse(fs.readFileSync(path.resolve(ROOT_MANIFEST_PATH), { encoding: 'utf8' }));
    this.packages = walkSync('.', { globs: workspaces.map(glob => `${glob}/package.json`) }).map(f => new PackageJson(f));
  }

  async bump() {
    const task = async () => {
      this.packages.forEach(manifest => {
        this.log.exec(`Processing ${manifest.filename}`);
        this._patchDependencies(manifest);
        if (!this.config.isDryRun) manifest.write();
      });
    };

    return this.spinner.show({ task, label: 'yarn version' });
  }

  _patchDependencies(manifest) {
    const patchDependencies = type => {
      const dependencies = manifest.pkg[type] ?? {};
      Object.entries(dependencies)
        .filter(([d]) => this.packages.find(p => p.name === d))
        .forEach(([d, v]) => {
          const newVersion = v.replace('workspace:', '');
          this.log.exec(`\t${type}: \`${d}\` -> ${newVersion} (from ${v})`);
          dependencies[d] = newVersion;
        });
    };

    patchDependencies('dependencies');
    patchDependencies('devDependencies');
    patchDependencies('optionalDependencies');
    patchDependencies('peerDependencies');
  }
}

export default FixWorkspacePlugin;
