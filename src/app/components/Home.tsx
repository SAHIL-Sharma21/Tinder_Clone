"use client";

import * as React from "react";
import { Neo4jUser } from "../../../types";
import TinderCard from "react-tinder-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { neo4jSwipe } from "../neo4j.action";

//interface for HomePage components
interface HomePageProps {
  currentUser: Neo4jUser;
  users: Neo4jUser[];
}

const HomePage: React.FC<HomePageProps> = ({ currentUser, users }) => {
  //funtion for swipe

  const handleSwipe = async (direction: string, userId: string) => {
    const isMatched = await neo4jSwipe(
      currentUser.applicationID,
      direction,
      userId
    );

    if (isMatched) {
      alert("It's a Match, Congrats!!");
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div>
          <div>
            <div>
              <h1 className="text-4xl">
                Hello, {currentUser.firstname} {currentUser.lastname}
              </h1>
            </div>
          </div>
          <div className="mt-5 relative">
            {users.map((user) => (
              <TinderCard
                key={user.applicationID}
                className="absolute"
                onSwipe={(direction) =>
                  handleSwipe(direction, user.applicationID)
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {user.firstname} {user.lastname}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                </Card>
              </TinderCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
