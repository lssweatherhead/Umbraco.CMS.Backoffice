import { defineElement } from '@umbraco-ui/uui-base/lib/registration';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { Subscription } from 'rxjs';

import { UmbContextConsumerMixin } from '../core/context';
import { UmbSectionContext } from '../section.context';

import { UmbExtensionManifest, UmbManifestSectionMeta } from '../core/extension';

// TODO: lazy load these. How to we handle dynamic import of our typescript file?
import '../content/content-section.element';
import '../media/media-section.element';
import '../settings/settings-section.element';

@defineElement('umb-backoffice-main')
export class UmbBackofficeMain extends UmbContextConsumerMixin(LitElement) {
  static styles = [
    UUITextStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ];

  @state()
  private _sectionElement?: HTMLElement;

  private _sectionContext?: UmbSectionContext;
  private _currentSectionSubscription?: Subscription;

  constructor() {
    super();

    this.consumeContext('umbSectionContext', (_instance: UmbSectionContext) => {
      this._sectionContext = _instance;
      this._useCurrentSection();
    });
  }

  private _useCurrentSection() {
    this._currentSectionSubscription?.unsubscribe();

    this._currentSectionSubscription = this._sectionContext?.getCurrent().subscribe((section) => {
      this._createSectionElement(section);
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._currentSectionSubscription?.unsubscribe();
  }

  private async _createSectionElement(section: UmbExtensionManifest<UmbManifestSectionMeta>) {
    if (!section) return;

    // TODO: How do we handle dynamic imports of our files?
    if (section.js) {
      await import(/* @vite-ignore */ section.js);
    }

    if (section.elementName) {
      this._sectionElement = document.createElement(section.elementName);
    }
  }

  render() {
    return html` ${this._sectionElement} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'umb-backoffice-main': UmbBackofficeMain;
  }
}