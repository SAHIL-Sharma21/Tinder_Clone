'use server'

import { driver } from "@/db"
import { Neo4jUser } from "../../types";

export const getUserByID = async(id: string) => {
    const result = await driver.executeQuery(
        `MATCH ( u: User {applicationID: $applicationID }) RETURN u`, 
        {applicationID: id}
    );

    const user = result.records.map((record) => record.get('u').properties);

    //user user is empty
    if(user.length === 0) return null;

    return user[0] as Neo4jUser;
}


//funtion to create a user in db
export const createUser = async(user: Neo4jUser) => {
    const {applicationId, firstname, lastname, email} = user;

    await driver.executeQuery(
        `CREATE (u: User {applicationID: $applicationId, email:  $email, firstname: $firstname, lastname: $lastname})`,
        {applicationId, firstname, lastname, email}
    );
}