import { BehaviorSubject, Observable } from 'rxjs';

// TODO: how do we want to type extensions?
export type UmbExtensionType = 'startUp' | 'section' | 'propertyEditor';


export interface UmbExtensionManifestBase {
  type: string;
  alias: string;
  name: string;
  js?: string;
  elementName?: string;
  meta: unknown;
}

export type UmbExtensionManifestSection = {
  type: 'section';
  meta: UmbManifestSectionMeta;
} & UmbExtensionManifestBase;

export type UmbExtensionManifestPropertyEditor = {
  type: 'propertyEditor';
  meta: UmbManifestPropertyEditorMeta;
} & UmbExtensionManifestBase;

export type UmbExtensionManifest = UmbExtensionManifestBase | UmbExtensionManifestSection | UmbExtensionManifestPropertyEditor;

export interface UmbManifestSectionMeta {
  weight: number;
}

export interface UmbManifestPropertyEditorMeta {
  icon: string;
  groupAlias: string;
  description: string;
  configConfig: unknown;
}

export class UmbExtensionRegistry {
  private _extensions: BehaviorSubject<Array<UmbExtensionManifest>> = new BehaviorSubject(<Array<UmbExtensionManifest>>[]);
  public readonly extensions: Observable<Array<UmbExtensionManifest>> = this._extensions.asObservable();

  register (manifest: UmbExtensionManifest) {
    const extensionsValues = this._extensions.getValue();
    const extension = extensionsValues.find(extension => extension.alias === manifest.alias);

    if (extension) {
      console.error(`Extension with alias ${manifest.alias} is already registered`);
      return;
    }

    this._extensions.next([...extensionsValues, manifest]);
  }

  // TODO: implement unregister of extension
}