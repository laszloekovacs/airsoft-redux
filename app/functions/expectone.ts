export default function expectOne<T>(
    results: T[],
    // never enforces functions to throw
    options?: {
        notFound?: () => never
        manyFound?: () => never
    }
): T {
    if (results.length === 0) {
        if (options?.notFound) {
            options.notFound()
        }
        throw new Response("Az elem nem található", { status: 404 })
    }

    if (results.length > 1) {
        if (options?.manyFound) {
            options.manyFound()
        }
        throw new Response(
            `Váratlan lekérdezési eredmény: ${results.length} elem érkezett, 1 volt várható`,
            { status: 500 }
        );
    }

    return results[0]
}