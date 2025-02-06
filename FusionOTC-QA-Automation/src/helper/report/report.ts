const report = require("multiple-cucumber-html-reporter");

report.generate({
    jsonDir: "test-results",
    reportPath: "test-results/reports/",
    reportName: "Oracle FaCT Automation Execution Report",
    pageTitle: "Oracle FaCT Automation Execution Report",
    displayDuration: true,
    metadata: {
        browser: {
            name: "chrome",
            version: "112",
        },
        device: "FaCT Automation",
        platform: {
            name: "Windows",
            version: "10",
        },
    },
    customData: {
        title: "Test Info",
        data: [
            { label: "Project", value: "Oracle FaCT Application" },
            { label: "Release", value: "0.5" },
            { label: "Cycle", value: "Smoke-1" }
        ],
    },
});