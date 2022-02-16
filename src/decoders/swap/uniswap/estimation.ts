export function normalizeEstimation(response: unknown): string {
    switch (typeof response) {
        case 'string':
            if (response.length > 64) {
                return response.substring(response.length - 64, response.length);
            }
    }
    return '';
}
