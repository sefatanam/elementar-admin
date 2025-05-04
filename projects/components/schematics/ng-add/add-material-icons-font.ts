// src/my-schematic/index.ts
import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { JsonValue } from '@angular-devkit/core'; // Полезно для типизации
import { Schema } from './schema';

export default function ngAdd(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {

    const workspace = await getWorkspace(tree);
    const projectName = options.project || workspace.extensions['defaultProject'] as string;

    if (!projectName) {
      throw new SchematicsException('Could not determine project name. Please specify it using the --project option.');
    }

    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new SchematicsException(`Project "${projectName}" not found in workspace.`);
    }

    const buildTarget = project.targets.get('build');

    if (!buildTarget?.options || typeof buildTarget.options['index'] !== 'string') {
      throw new SchematicsException(`Could not find a string value for the 'index' option in the "build" target for project "${projectName}". Check angular.json.`);
    }

    const indexPath = buildTarget.options['index'];
    context.logger.info(`Found index.html: ${indexPath}`);

    const indexContentBuffer = tree.read(indexPath);
    if (!indexContentBuffer) {
      throw new SchematicsException(`Could not read file: ${indexPath}`);
    }
    const indexContent = indexContentBuffer.toString('utf-8');

    let JSDOM;
    try {
      JSDOM = (await import('jsdom')).JSDOM;
    } catch (e) {
      context.logger.error(`❌ Failed to load jsdom. `
        + `Make sure 'jsdom' is installed as a dependency in your schematics project: `
        + `'npm install --save jsdom @types/jsdom'`);
      throw new SchematicsException(`Error loading jsdom: ${e}`);
    }

    try {
      const dom = new JSDOM(indexContent);
      const document = dom.window.document;
      const head = document.querySelector('head');

      if (!head) {
        context.logger.warn(`⚠️ <head> tag not found in ${indexPath}. Skipping link addition.`);
        return tree;
      }

      const linkHref = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block";
      const linkRel = "stylesheet";

      const existingLink = head.querySelector(`link[rel="${linkRel}"][href="${linkHref}"]`);

      if (existingLink) {
        context.logger.info(`ℹ️ Material Symbols link already exists in ${indexPath}. Skipping.`);
        return tree;
      }

      const newLinkElement = document.createElement('link');
      newLinkElement.setAttribute('rel', linkRel);
      newLinkElement.setAttribute('href', linkHref);

      head.appendChild(newLinkElement);
      head.appendChild(document.createTextNode('\n'));

      context.logger.info(`✅ Adding Material Symbols link to ${indexPath}`);

      const updatedContent = dom.serialize();
      tree.overwrite(indexPath, updatedContent);

    } catch (e) {
      context.logger.error(`❌ Error parsing or modifying ${indexPath}: ${e instanceof Error ? e.message : e}`);
      // Optionally re-throw if the update is critical
      // throw new SchematicsException(`Error processing ${indexPath}: ${e}`);
      return tree;
    }

    return tree;
  };
}
