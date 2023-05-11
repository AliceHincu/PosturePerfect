import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export enum AlertMessages {
  LATERAL_WRONG = "You are not positioned correctly - reposition to a 90 angle",
  LANDMARKS_NOT_VISIBLE = "Can't see the whole posture - make sure that the hips(only for lateral), shoulders, head are visible on camera",
}

interface AlertComponentProps {
  message: string;
}

export const AlertC = ({ message }: AlertComponentProps) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
};
