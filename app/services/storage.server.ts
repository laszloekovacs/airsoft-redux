import { env } from "./env.server"
import { PicsumStorageDriver } from "./storage.picsum.server"

// implement this for s3 or local for example
export interface StorageDriver {
	// upload file, returns resource url
	upload(key: string, buffer: Buffer, mimeType: string): Promise<string>
	delete(key: string): Promise<void>
	getUrl(key: string): string
}

// factory and singleton driver
function createStorageDriver(): StorageDriver {
	switch (env.STORAGE_DRIVER) {
		case "picsum":
			return new PicsumStorageDriver()
		default:
			throw new Error(`unknown storage driver: ${env.STORAGE_DRIVER}`)
	}
}

export const storage = createStorageDriver()
