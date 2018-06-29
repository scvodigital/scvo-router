import jsonLogic = require('json-logic-js');
import dot = require('dot-object');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskRenderLayout extends TaskBase {
  constructor(jsonLogicOperations?: JsonLogicOperationsMap) {
    super();
    if (jsonLogicOperations) {
      const operations = Object.keys(jsonLogicOperations);
      operations.forEach((operationName) => {
        const operation = jsonLogicOperations[operationName];
        jsonLogic.add_operation(operationName, operation);
      });
    }
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskRenderLayoutConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }
    const config = routeTaskConfig.config;
    const layoutName = (jsonLogic.apply(config.logic, routeMatch) as string);

    if (!config.layouts.hasOwnProperty(layoutName)) {
      throw new Error(
          'Layout with the name "' + layoutName + '" does not exist');
    }

    const layout = config.layouts[layoutName];
    const layoutPartOutputs: LayoutPartsOutputMap = {};

    const partNames = Object.keys(layout.parts);
    for (let p = 0; p < partNames.length; ++p) {
      const partName = partNames[p];
      const partPathOrTemplate = layout.parts[partName];
      const partTemplate = routeMatch.getString(partPathOrTemplate);
      let partOutput = '';
      try {
        partOutput = await renderer.render(partTemplate, routeMatch);
      } catch (err) {
        console.error('Failed to render part:', partName);
        throw err;
      }
      layoutPartOutputs[partName] = partOutput;
    }

    const layoutTemplate = routeMatch.getString(layout.layout);
    (routeMatch as any).layoutParts = layoutPartOutputs;
    let layoutOutput = '';
    try {
      layoutOutput = await renderer.render(layoutTemplate, routeMatch);
    } catch (err) {
      console.error('Failed to render layout:', layoutName);
      throw err;
    }
    delete (routeMatch as any).layoutParts;

    routeMatch.response.contentType = layout.contentType || 'text/html';

    if (config.output === 'data') {
      routeMatch.data[routeTaskConfig.name] = layoutOutput;
    } else if (config.output === 'body') {
      routeMatch.response.body = layoutOutput;
    } else {
      throw new Error('No output specified');
    }
    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskRenderLayoutConfiguration {
  logic: any;
  layouts: LayoutMap;
  output: 'data'|'body';
}

export interface LayoutMap {
  [name: string]: LayoutConfiguration;
}

export interface LayoutConfiguration {
  parts: LayoutPartMap;
  layout: string;
  contentType?: string;
}

export interface LayoutPartMap {
  [name: string]: string;
}

export interface LayoutPartsOutputMap {
  [partName: string]: string;
}

export interface JsonLogicOperationsMap {
  [name: string]: (...args: any[]) => any;
}
/* tslint:enable:no-any */
