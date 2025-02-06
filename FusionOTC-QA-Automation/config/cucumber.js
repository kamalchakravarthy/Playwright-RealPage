const { setDefaultTimeout } = require("@cucumber/cucumber");

module.exports = {
    default: {
        tags: process.env.npm_config_TAGS || "@smoke",
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            "src/test/features/"
        ],
        dryRun: false,
        require: [
            "src/test/steps/*.ts",
            "src/hooks/hooks.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [       
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "junit:test-results/e2e-junit-results.xml",
            "rerun:@rerun.txt"
        ],
        "parallel":1,
        "retry":2,
        setDefaultTimeout: (60 * 1000 * 2)
        
    },
    rerun: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        dryRun: false,
        require: [
            "src/test/steps/*.ts",
            "src/hooks/hooks.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [

            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
       "parallel": 1,
        "retry" : 2,
    }
}