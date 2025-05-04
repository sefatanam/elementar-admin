import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { getWorkspace, ProjectDefinition } from '@schematics/angular/utility/workspace';
import { JSDOM } from 'jsdom';

export function ngAdd(options: { project?: string }): Rule {
  return async (tree: Tree, context: SchematicContext) => {

    const workspace = await getWorkspace(tree);

    let projectName: string | undefined = options.project;

    if (!projectName) {
      projectName = workspace.extensions['defaultProject'] as string | undefined;
      if(projectName) {
        context.logger.debug(`Project name not specified, using default project: "${projectName}"`);
      }
    }

    if (!projectName) {
      const projectNames = Array.from(workspace.projects.keys());
      if (projectNames.length > 0) {
        projectName = projectNames[0];
        context.logger.info(`Project name not specified and no default project found. Using the first project found: "${projectName}"`);
      }
    }

    if (!projectName) {
      throw new SchematicsException(
        'Could not determine the target project. ' +
        'Please specify the project name using the --project option, set a default project, ' +
        'or ensure at least one project exists in angular.json.'
      );
    }

    const project: ProjectDefinition | undefined = workspace.projects.get(projectName);
    if (!project) {
      throw new SchematicsException(`Project "${projectName}" not found in workspace configuration.`);
    }

    const buildTarget = project.targets.get('build');

    if (!buildTarget?.options || typeof buildTarget.options['index'] !== 'string') {
      throw new SchematicsException(`Could not find a string value for the 'index' option in the "build" target for project "${projectName}". Check angular.json.`);
    }

    const indexPath = buildTarget.options['index'];
    context.logger.info(`Targeting index.html: ${indexPath} for project "${projectName}"`);

    const indexContentBuffer = tree.read(indexPath);
    if (!indexContentBuffer) {
      throw new SchematicsException(`Could not read file: ${indexPath}`);
    }
    const indexContent = indexContentBuffer.toString('utf-8');


    try {
      // Используем JSDOM напрямую, так как он импортирован статически
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
      return tree;
    }

    return tree;
  };
}
