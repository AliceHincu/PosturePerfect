import { CSSProperties, useEffect } from "react";
import { MoonLoader } from "react-spinners";

interface SpinnerInterface {
  loading: boolean;
}

export const Spinner = ({ loading }: SpinnerInterface) => {
  const style: CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "1000",
  };
  return (
    <div style={style}>
      <MoonLoader loading={loading} color="white" size={100}></MoonLoader>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "5px", color: "white" }}>Loading</div>
      ) : null}
    </div>
  );
};
