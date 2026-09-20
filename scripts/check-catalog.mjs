import assert from 'node:assert/strict';
import { readFile, realpath, stat } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const catalog = JSON.parse(await readFile(resolve(root, 'catalog.json'), 'utf8'));
const text = (value, name) => assert.equal(typeof value === 'string' && value.trim().length > 0, true, `${name} must be a nonempty string`);
const list = (value, name) => assert.ok(Array.isArray(value), `${name} must be an array`);
function ids(records, label) {
  list(records, label);
  const result = new Set();
  for (const item of records) {
    text(item.id, `${label}.id`);
    assert.ok(!result.has(item.id), `Duplicate ${label} id: ${item.id}`);
    result.add(item.id);
  }
  return result;
}
function links(values, allowed, label) {
  list(values, label);
  for (const value of values) assert.ok(allowed.has(value), `Unknown ${label}: ${value}`);
}
function url(value, label) {
  text(value, label);
  const parsed = new URL(value);
  assert.ok(['http:', 'https:'].includes(parsed.protocol), `${label} must use HTTP(S)`);
  assert.ok(!parsed.username && !parsed.password, `${label} must not contain credentials`);
}
async function local(value, directory = false) {
  text(value, 'local path');
  const name = value.split('#', 1)[0];
  assert.ok(name && !isAbsolute(name), `Expected repository-relative path: ${value}`);
  const target = await realpath(resolve(root, name));
  const rel = relative(root, target);
  assert.ok(rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel), `Path escapes repository: ${value}`);
  const info = await stat(target);
  assert.ok(directory ? info.isDirectory() : info.isFile(), `Wrong path type: ${value}`);
}

assert.equal(catalog.schema_version, 1, 'Unsupported catalog schema');
url(catalog.repository, 'repository');
const families = ids(catalog.families, 'families');
const styles = ids(catalog.styles, 'styles');
const references = ids(catalog.references, 'references');
ids(catalog.projects, 'projects');
for (const family of catalog.families) text(family.name, 'family.name');
for (const style of catalog.styles) {
  text(style.name, 'style.name');
  text(style.description, 'style.description');
  assert.ok(families.has(style.family_id), `Unknown family: ${style.family_id}`);
  assert.ok(['preferred', 'regular', 'exploratory'].includes(style.default_priority), `Unknown default priority: ${style.default_priority}`);
  links(style.reference_ids, references, 'style.reference_ids');
  await local(style.entry_path);
}
for (const entry of [...catalog.references, ...catalog.projects]) {
  text(entry.title, 'entry.title');
  text(entry.kind, 'entry.kind');
  links(entry.style_ids, styles, 'entry.style_ids');
  await local(entry.entry_path);
}
for (const entry of catalog.references) url(entry.source_url, 'reference.source_url');
for (const entry of catalog.projects) {
  assert.equal(entry.kind, 'vmg-project');
  assert.ok(entry.source_path || entry.package_url, `Project needs a source directory or package URL: ${entry.id}`);
  if (entry.source_path) await local(entry.source_path, true);
  if (entry.package_url) url(entry.package_url, 'project.package_url');
}
console.log(`Catalog OK: ${catalog.styles.length} directions, ${catalog.references.length} references, ${catalog.projects.length} source projects.`);
