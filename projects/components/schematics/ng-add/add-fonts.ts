import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { getWorkspace, ProjectDefinition } from '@schematics/angular/utility/workspace';
import { JSDOM } from 'jsdom';

export function ngAdd(options: { project?: string }): Rule { // Переименовал функцию для ясности
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
      const dom = new JSDOM(indexContent);
      const document = dom.window.document;
      const head = document.querySelector('head');

      if (!head) {
        context.logger.warn(`⚠️ <head> tag not found in ${indexPath}. Skipping link additions.`);
        return tree;
      }

      let changed = false; // Флаг для отслеживания, были ли внесены изменения

      const symbolsLinkHref = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block";
      const symbolsLinkRel = "stylesheet";
      const existingSymbolsLink = head.querySelector(`link[rel="${symbolsLinkRel}"][href="${symbolsLinkHref}"]`);

      if (!existingSymbolsLink) {
        const newSymbolsLinkElement = document.createElement('link');
        newSymbolsLinkElement.setAttribute('rel', symbolsLinkRel);
        newSymbolsLinkElement.setAttribute('href', symbolsLinkHref);
        head.appendChild(newSymbolsLinkElement);
        head.appendChild(document.createTextNode('\n')); // Добавляем перенос строки
        context.logger.info(`✅ Adding Material Symbols link to ${indexPath}`);
        changed = true;
      } else {
        context.logger.info(`ℹ️ Material Symbols link already exists in ${indexPath}. Skipping.`);
      }

      const openSansLinkHref = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";
      const openSansLinkRel = "stylesheet";
      const existingOpenSansLink = head.querySelector(`link[rel="${openSansLinkRel}"][href="${openSansLinkHref}"]`);

      if (!existingOpenSansLink) {
        const newOpenSansLinkElement = document.createElement('link');
        newOpenSansLinkElement.setAttribute('rel', openSansLinkRel);
        newOpenSansLinkElement.setAttribute('href', openSansLinkHref);
        head.appendChild(newOpenSansLinkElement);
        head.appendChild(document.createTextNode('\n')); // Добавляем перенос строки
        context.logger.info(`✅ Adding Open Sans font link to ${indexPath}`);
        changed = true;
      } else {
        context.logger.info(`ℹ️ Open Sans font link already exists in ${indexPath}. Skipping.`);
      }

      if (changed) {
        const updatedContent = dom.serialize();
        tree.overwrite(indexPath, updatedContent);
        context.logger.info(`✅ Successfully updated ${indexPath}`);
      } else {
        context.logger.info(`✅ No changes needed for ${indexPath}.`);
      }


    } catch (e) {
      context.logger.error(`❌ Error parsing or modifying ${indexPath}: ${e instanceof Error ? e.message : e}`);
      return tree;
    }

    return tree;
  };
}
