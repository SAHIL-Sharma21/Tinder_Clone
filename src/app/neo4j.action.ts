'use server'

import { driver } from "@/db"
import { Neo4jUser } from "../../types";

export const getUserByID = async (id: string) => {
    const result = await driver.executeQuery(
        `MATCH (u:User {applicationID: $applicationID}) RETURN u`, 
        { applicationID: id }
    );

    const user = result.records.map((record) => record.get('u').properties);

    // user is empty
    if (user.length === 0) return null;

    return user[0] as Neo4jUser;
}

// function to create a user in db
export const createUser = async (user: Neo4jUser) => {
    const { applicationID, firstname, lastname, email } = user;

    await driver.executeQuery(
        `CREATE (u:User {applicationID: $applicationID, email: $email, firstname: $firstname, lastname: $lastname})`,
        { applicationID, firstname, lastname, email }
    );
}

// method to fetch user with no connection
export const getUserWithNoConnection = async (id: string) => {
    const result = await driver.executeQuery(
        `MATCH (cu:User {applicationID: $applicationID}) MATCH (ou:User) WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou RETURN ou`,
        { applicationID: id }
    );

    const users = result.records.map((record) => record.get('ou').properties);

    return users as Neo4jUser[];
}

// function for swipe/logic
export const neo4jSwipe = async (
    id: string,
    swipe: string,
    userId: string
) => {
    const type = swipe === "RIGHT" ? "LIKE" : "DISLIKE";

    // writing the query
    await driver.executeQuery(
        `MATCH (cu:User {applicationID: $id}), (ou:User {applicationID: $userId}) CREATE (cu)-[:${type}]->(ou)`,
        { id, userId }
    );

    if (type === "LIKE") {
        // query to check if other user also liked us back
        const result = await driver.executeQuery(
            `MATCH (cu:User {applicationID: $id}), (ou:User {applicationID: $userId}) WHERE (ou)-[:LIKE]->(cu) RETURN ou AS match`,
            { id, userId }
        );
        const matches = result.records.map((record) => record.get("match").properties);
        return Boolean(matches.length > 0);
    }
}


//get matched
export const getMatches = async(currentUserId: string) => {
    const result = await driver.executeQuery(
        `MATCH (cu: User {applicationID: $id})-[:LIKE]-(ou: User)-[:LIKE]->(cu) RETURN ou as match`,
        {id: currentUserId}
    );
    const matches = result.records.map((record) => record.get("match").properties);
    return matches as Neo4jUser[];
}