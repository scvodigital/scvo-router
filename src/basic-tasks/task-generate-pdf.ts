/* tslint:disable:no-any */
const pdfMake: any = require('pdfmake');
import rp = require('request-promise-native');
import * as util from 'util';
const stringify: any = require('json-stringify-safe');
import {Stream, PassThrough} from 'stream';

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RouteMatch} from '../route-match';
import {RendererBase} from '../renderer-base';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

export class TaskGeneratePdf extends TaskBase {
  printer: any;

  constructor(private fonts: any) {
    super();
    this.printer = new pdfMake(fonts);
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskGeneratePdfConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }
    const config = routeTaskConfig.config;

    if (config.imagesTemplate) {
      const imagesMap =
          await renderer.render(config.imagesTemplate, routeMatch);
      const images = await this.fetchImages(imagesMap, routeMatch);
      (routeMatch as any).images = images;
    }

    routeMatch.log('Rendering Definition template');
    let definition: any = {};
    try {
      definition = await renderer.render(config.definitionTemplate, routeMatch);
    } catch (err) {
      routeMatch.log(config.definitionTemplate);
      routeMatch.error(err, 'Failed to render definition template');
      throw err;
    }
    routeMatch.log('Rendered Definition template', definition);

    if (!definition.hasOwnProperty('header') && config.headerTemplate) {
      routeMatch.log(
          'No header in definition and Header template provided so adding it');
      definition.header = (currentPage: number, pageCount: number) => {
        routeMatch.log(
            'Rendering header -> currentPage:', currentPage,
            '| pageCount:', pageCount,
            '| header template:', config.headerTemplate);
        let output: any = [];
        try {
          (routeMatch as any).currentPage = currentPage;
          (routeMatch as any).pageCount = pageCount;
          output = renderer.renderSync(config.headerTemplate, routeMatch);
        } catch (err) {
          routeMatch.error(err, 'Problem rendering header from JSON-e');
        }
        if (routeMatch.hasOwnProperty(currentPage)) {
          delete (routeMatch as any).currentPage;
        }
        if (routeMatch.hasOwnProperty(pageCount)) {
          delete (routeMatch as any).pageCount;
        }
        routeMatch.log(
            'Header template rendered:\n', stringify(output, null, 2));
        return output;
      };
    }

    if (!definition.hasOwnProperty('footer') && config.footerTemplate) {
      routeMatch.log(
          'No footer in definition and Footer template provided so adding it');
      definition.footer = (currentPage: number, pageCount: number) => {
        routeMatch.log(
            'Rendering footer -> currentPage:', currentPage,
            '| pageCount:', pageCount,
            '| footer template:', config.footerTemplate);
        let output: any = [];
        try {
          (routeMatch as any).currentPage = currentPage;
          (routeMatch as any).pageCount = pageCount;
          output = renderer.renderSync(config.footerTemplate, routeMatch);
        } catch (err) {
          routeMatch.error(err, 'Problem rendering footer from JSON-e');
        }
        if (routeMatch.hasOwnProperty(currentPage)) {
          delete (routeMatch as any).currentPage;
        }
        if (routeMatch.hasOwnProperty(pageCount)) {
          delete (routeMatch as any).pageCount;
        }
        routeMatch.log(
            'Footer template rendered:\n', stringify(output, null, 2));
        return output;
      };
    }

    const output = await this.generatePdf(definition, routeMatch);

    if (routeMatch.hasOwnProperty('images')) {
      delete (routeMatch as any).images;
    }

    routeMatch.log('Converted to string!', output.length, 'bytes');

    routeMatch.response.body = output;
    routeMatch.response.contentType = 'application/pdf';
    //    routeMatch.response.headers['Content-Disposition'] =
    //        'attachment; filename=download.pdf';

    routeMatch.log('Finished everything. Returning HALT command');

    return {command: TaskResultCommand.HALT};
  }

  async fetchImages(images: ImageMap|undefined, routeMatch: RouteMatch):
      Promise<ImageMap> {
    if (!images) return {};
    const fetched: ImageMap = {};

    for (const name of Object.keys(images)) {
      const url = images[name];
      routeMatch.log('Downloading Image:', url);
      const response =
          await rp({url, encoding: null, resolveWithFullResponse: true});
      const mime = response.headers['content-type'];
      const image = Buffer.from(response.body, 'base64');
      const b64 = image.toString('base64');
      const uri = `data:${mime};base64,${b64}`;
      fetched[name] = uri;
      routeMatch.log('Image downloaded');
    }

    return fetched;
  }

  generatePdf(definition: any, routeMatch: RouteMatch): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      routeMatch.log(
          'Finished all definition setup, generating pdf:',
          stringify(definition, null, 4));
      const pdfDoc: any = this.printer.createPdfKitDocument(definition);

      const chunks: any[] = [];
      pdfDoc.on('data', (chunk: any) => {
        chunks.push(chunk);
      });
      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      pdfDoc.end();
    });
  }
}

export interface TaskGeneratePdfConfiguration {
  imagesTemplate?: ImageMap;
  headerTemplate?: any;
  footerTemplate?: any;
  definitionTemplate: any;
}

export interface ImageMap {
  [name: string]: string;
}

/* tslint:enable:no-any */