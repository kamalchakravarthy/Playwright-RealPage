export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chrome" | "firefox" | "webkit",
            BASEURL: string,
            HEAD: "true" | "false",
            USERNAME_SERVICEADMIN: string,
            PASSWORD_SERVICEADMIN: string,
            TOKEN:string,
            getAvailableTestPlansBasicurl:string,
            getTestpointUsingTestcaseNumber:string,
            updateTheStatusOfTheTC:string;
            
        }
    }
}