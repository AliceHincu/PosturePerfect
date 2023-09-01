import { useAuth } from "../context/authContext";

export const Profile = () => {
  console.log("HI!");
  const { token } = useAuth();

  return (
    <>
      <h2>Profile (Protected)</h2>

      <div>Authenticated as {token}</div>
    </>
  );
};
