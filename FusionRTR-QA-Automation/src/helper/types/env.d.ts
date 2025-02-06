export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chrome" | "firefox" | "webkit",
            BASEURL: string,
            HEAD: "true" | "false",
            FUSION_PWD: string,
            TOKEN:string,
            getAvailableTestPlansBasicurl:string,
            getTestpointUsingTestcaseNumber:string,
            updateTheStatusOfTheTC:string;
            
        }
    }
}