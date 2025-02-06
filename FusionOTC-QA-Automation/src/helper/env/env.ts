import * as dotenv from 'dotenv'

export const getEnv = () => {
    if (process.env.ENV) {
        dotenv.config({
            override: true,
            path: `src/helper/env/.env.${process.env.ENV}`
        })
    } else {
        console.error("NO ENV PASSED!")
    }

}

export const getCreds = (user: string): string[] => {
    let username: string;
    let password: string;

        username = process.env.USERNAME_RP_AP_Invoice_Processor;
        password = process.env.PASSWORD_SERVICEADMIN;
        throw new Error(`Unknown user: ${user}`);
    
  
    if (!username || !password) {
      throw new Error(`Credentials not found for user: ${user}`);
    }
  
    return [username, password];
  };
  