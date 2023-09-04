import { render, fireEvent } from "@testing-library/react";
import { NotificationsForm } from "./NotificationsForm";
import { Formik } from "formik";
import { MINUTE_TO_SECONDS, initialNotificationValues } from "../../utils/notifications-utils";

// jest.mock('formik', () => ({
//   ...jest.requireActual('formik'),
//   Formik: ({ children, initialValues, onSubmit }) => children({ handleSubmit: onSubmit, values: initialValues })
// }));

describe("NotificationsForm", () => {
  it("Renders correctly form fields", () => {
    const { getByLabelText } = render(<NotificationsForm handleFormSubmit={jest.fn()} />);

    expect(getByLabelText(/timeValuePosture/i)).toBeInTheDocument();
    expect(getByLabelText(/timeUnitPosture/i)).toBeInTheDocument();
    expect(getByLabelText(/checkboxPosture/i)).toBeInTheDocument();
    // Add similar lines for other fields
  });

  //   it("calls handleFormSubmit on form submission", () => {
  //     const handleFormSubmit = jest.fn();
  //     const { getByRole } = render(
  //       <NotificationsForm initialValues={initialValues} handleFormSubmit={handleFormSubmit} />
  //     );

  //     fireEvent.click(getByRole("button", { name: /submit/i }));
  //     expect(handleFormSubmit).toHaveBeenCalledWith(initialValues);
  //   });
});
