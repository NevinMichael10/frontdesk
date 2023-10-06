import parseArguments from "command-line-args";

import { createBrowser } from "./components/browser.js";
import { createRequestAnalyzer } from "./components/request-analyzer.js";
import { createDocumentGenerator } from "./components/document-generator.js";
import { createModuleConnector } from "./components/module-connector.js";
import { logMessage } from "./components/logging.js";

const options = parseArguments([
    { name: "chrome-path" },
    { name: "application-url" },
    { name: "generate-path" },
    { name: "result-path" },
    { name: "request-id" },
    { name: "security-token" },
    { name: "enable-metrics", type: Boolean }
]);

const {
    "chrome-path": chromePath,
    "application-url": appUrl,
    "generate-path": generatePath,
    "result-path": resultPath,
    "request-id": requestId,
    "security-token": securityToken,
    "enable-metrics": enableMetrics,
} = options;

const requestAnalyzer = enableMetrics ? createRequestAnalyzer() : undefined;
const moduleConnector = createModuleConnector();

await withBrowser(async (browser) => {
    const documentGenerator = createDocumentGenerator(browser, requestAnalyzer);
    await documentGenerator.initialize();

    const pageUrl = new URL(`${appUrl}/${generatePath}?id=${requestId}`).href;
    const resultUrl = new URL(`${appUrl}/${resultPath}?id=${requestId}`).href;

    const document = await documentGenerator.generateDocument(
        pageUrl,
        securityToken
    );

    if (enableMetrics) {
        const metrics = await documentGenerator.getPageMetrics();
        logMessage(`Page metrics: ${JSON.stringify(metrics)}`);

        const requestStatistics = documentGenerator.getRequestStatistics();
        logMessage(`Request statistics: ${JSON.stringify(requestStatistics)}`);
    }

    await moduleConnector.sendResult(resultUrl, document, securityToken);
}).catch((error) => {
    console.error(error.message);
    process.exit(1);
});

async function withBrowser(fn) {
    const browser = createBrowser(chromePath);
    await browser.initialize();

    try {
        await fn(browser).catch((error) => {
            throw error;
        });
    } finally {
        await browser.close();
    }
}
