import { UmbBackofficeExtensionRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { ReplaySubject } from '@umbraco-cms/backoffice/external/rxjs';

export type UmbTranslationDictionary = Map<string, string>;

export class UmbTranslationRegistry {
	#extensionRegistry;
	#innerDictionary = new ReplaySubject<UmbTranslationDictionary>(1);
	#innerDictionaryValue: UmbTranslationDictionary = new Map();

	constructor(umbExtensionRegistry: UmbBackofficeExtensionRegistry) {
		this.#extensionRegistry = umbExtensionRegistry;
	}

	get translations() {
		return this.#innerDictionary.asObservable();
	}

	register(userCulture: string, fallbackCulture = 'en') {
		// Reset the inner dictionary.
		this.#innerDictionaryValue = new Map();

		// Load new translations
		this.#extensionRegistry.extensionsOfType('translations').subscribe(async (extensions) => {
			await Promise.all(
				extensions
					.filter((x) => x.meta.culture === userCulture || x.meta.culture === fallbackCulture)
					.map(async (extension) => {
						// If extension contains a dictionary, add it to the inner dictionary.
						if (extension.meta.translations) {
							for (const [dictionaryName, dictionary] of Object.entries(extension.meta.translations)) {
								this.#addOrUpdateDictionary(dictionaryName, dictionary);
							}
						}

						// If extension contains a js file, load it and add the default dictionary to the inner dictionary.
						if (extension.loader) {
							const loader = await extension.loader();
							if (loader.default) {
								for (const [dictionaryName, dictionary] of Object.entries(loader.default)) {
									this.#addOrUpdateDictionary(dictionaryName, dictionary);
								}
							}
						}

						// If extension contains a json file, load it and add the default dictionary to the inner dictionary.
						if (extension.js) {
							const js = await import(extension.js);
							if (js.default) {
								for (const [dictionaryName, dictionary] of Object.entries(js.default)) {
									if (dictionary && typeof dictionary === 'object') {
										this.#addOrUpdateDictionary(dictionaryName, dictionary as Record<string, string>);
									}
								}
							}
						}
					})
			);

			// Notify subscribers that the inner dictionary has changed.
			if (this.#innerDictionaryValue.size > 0) {
				this.#innerDictionary.next(this.#innerDictionaryValue);
			}
		});
	}

	#addOrUpdateDictionary(dictionaryName: string, dictionary: Record<string, string>) {
		for (const [key, value] of Object.entries(dictionary)) {
			this.#innerDictionaryValue.set(`${dictionaryName}_${key}`, value);
		}
	}
}
