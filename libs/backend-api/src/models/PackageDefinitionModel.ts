/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PackageModelBaseModel } from './PackageModelBaseModel';

export type PackageDefinitionModel = (PackageModelBaseModel & {
    key?: string;
    packagePath?: string;
});

