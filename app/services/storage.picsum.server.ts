// biome-ignore-all lint/correctness/noUnusedFunctionParameters: intentional unused params
import type { StorageDriver } from "./storage.server"

export class PicsumStorageDriver implements StorageDriver {
	async upload(key: string, buffer: Buffer, mimeType: string): Promise<string> {
		return "https:/picsum.photos/200/200"
	}

	async delete(key: string): Promise<void> {
		console.log(`deleted ${key}`)
	}

	getUrl(key: string): string {
		return "https:/picsum.photos/200/200"
	}
}
