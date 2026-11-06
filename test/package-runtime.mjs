const sqlCheck = `
  const sql = require('mssql');
  sql.ConnectionPool.prototype.connect = function () { return Promise.resolve(this); };
  sql.ConnectionPool.prototype.request = () => ({ query: async () => ({ rowsAffected: [1] }) });
  const provider = new library.SqlServerProvider({ options: { connectionString: 'Server=localhost;Database=fixture;User Id=fixture;Password=fixture;' } });
  provider.command({ toString: () => 'SELECT 1' })
    .then(count => assert.equal(count, 1))
    .catch(error => { console.error(error); process.exitCode = 1; });
`;

export function runtimeSource(name, format) {
  const loader = format === 'module' ? 'await import' : 'require';
  const setup = format === 'module' ? `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);` : '';
  return `
    ${setup}
    const assert = require('node:assert/strict');
    globalThis.expect = require('expect').expect;
    // Inside Jest the runtime serves '@jest/globals'; here the same pieces come from the standalone packages.
    require('node:module').registerHooks({
      load: (url, context, nextLoad) =>
        url.endsWith('/node_modules/@jest/globals/build/index.js')
          ? { format: 'commonjs', source: "exports.jest = require('jest-mock'); exports.expect = require('expect').expect;", shortCircuit: true }
          : nextLoad(url, context),
    });
    const library = ${loader}(${JSON.stringify(name)});
    assert.ok(Object.keys(library).length > 0);
    ${name === '@thisisagile/easy-mssql' ? sqlCheck : ''}
    if (${JSON.stringify(name)} === '@thisisagile/easy-service') {
      const { ctx } = ${loader}('@thisisagile/easy');
      const settings = { tokenPrivateKey: 'packaging-test-secret', tokenPublicKey: 'packaging-test-secret', tokenAlgorithm: 'HS256' };
      ctx.env = { get: (key, fallback) => settings[key] ?? fallback };
      const token = library.Jwt.sign({ sub: 'packaging' }, { audience: 'consumer', issuer: 'fixture' });
      assert.equal(token.isValid, true);
      assert.equal(token.decode().sub, 'packaging');
      assert.equal(token.decode().aud, 'consumer');
      assert.equal(library.Jwt.of({ jwt: 'invalid' }).isValid, false);
    }
    if (${JSON.stringify(name)} === '@thisisagile/easy-domain') {
      assert.equal(new library.Email('consumer@example.com').isValid, true);
      assert.equal(new library.Email('invalid').isValid, false);
    }
  `;
}
