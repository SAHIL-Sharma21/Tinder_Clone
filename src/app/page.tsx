import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
import { getUserByID, getUserWithNoConnection } from './neo4j.action';
import HomePage from './components/Home';



export default async function Home() {
  
  const {getUser, isAuthenticated} = getKindeServerSession();

  //is user is not aurthenticated the he needs to login first
  if(!(await isAuthenticated())){
    return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
  }


  //get currentUser
  const user = await getUser();

  if(!user){
    return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
  }

  const userWithNotConnection = await getUserWithNoConnection(user.id);
  const currentUser = await getUserByID(user.id);

  return (
    <main>
      {currentUser && (
      <HomePage currentUser={currentUser} users={userWithNotConnection} />
      )}
    

    </main>
  );
}
