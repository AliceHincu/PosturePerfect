import { useAuth } from "../context/authContext";

export const HomePage = () => {
  // const { onLogin } = useAuth();

  return (
    <>
      <h2>Home (Public)</h2>

      {/* <button type="button" onClick={onLogin}> */}
      <button type="button">Sign In</button>
    </>
  );
};
