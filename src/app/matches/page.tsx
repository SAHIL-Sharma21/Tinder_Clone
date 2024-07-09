//matches page

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getMatches } from "../neo4j.action";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MatchPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  //is user is not aurthenticated the he needs to login first
  if (!(await isAuthenticated())) {
    return redirect(
      "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
    );
  }

  //get currentUser
  const user = await getUser();

  if (!user) {
    return redirect(
      "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
    );
  }

  const matches = await getMatches(user.id);

  return (
    <main>
      {matches.map((user) => (
        <Card key={user.applicationID}>
          <CardHeader>
            <CardTitle>
              {user.firstname} {user.lastname}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </main>
  );
}
