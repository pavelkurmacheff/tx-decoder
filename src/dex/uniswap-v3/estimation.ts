export function normalizeEstimation(response: unknown): string {
    switch (typeof response) {
        case 'string':
            if (response.length > 128) {
                const data = response.substring(response.length - 64, response.length);
                if (data === '0000000000000000000000000000000000000000000000000000000000000000') {
                    return response.substring(response.length - 128, response.length - 64);
                }
            }
    }
    return '';
}
