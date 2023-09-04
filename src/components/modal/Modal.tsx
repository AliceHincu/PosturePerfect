import { useState } from "react";
import "./Modal.css";
import { Scrollbar } from "react-scrollbars-custom";
import { GrClose } from "react-icons/gr";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  if (isOpen) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      <button onClick={toggleModal} className="modal-button">
        Show Ergonomics Info
      </button>

      {isOpen && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ textAlign: "center", fontSize: "2rem" }}>Workstation Ergonomics</h2>
              <button onClick={toggleModal} className="close-modal">
                {/* Close */}
                <GrClose color="#d32f50" size={24} />
              </button>
            </div>
            {/* noDefaultStyles disableTracksWidthCompensation style={{ position: "static" }} */}
            <Scrollbar style={{ width: "100%", height: "90vh", overflowX: "hidden" }}>
              <div style={{ flex: 1 }}>
                <img src="./assets/Workstation-Ergonomics.svg" alt="Description of image" />
                <ul className="big-list">
                  <li>
                    <span>Monitor</span>
                  </li>
                  <ul className="small-list">
                    <li>Top of the monitor screen should be at eye level. Use a monitor stand if needed.</li>
                    <li>Monitor should be an arm’s length away.</li>
                  </ul>
                  <li>
                    <span>Back</span>
                  </li>
                  <ul className="small-list">
                    <li>Sit up straight and do not slump to one side.</li>
                    <li>Your back should rest against the back of your chair or a backrest.</li>
                  </ul>
                  <li>
                    <span>Arms</span>
                  </li>
                  <ul className="small-list">
                    <li>
                      Position your keyboard 4-6 inches away from the edge of your desk so your wrists have a place to
                      rest.
                    </li>
                    <li>Your forearms should be at a 90-degree angle from your upper arms.</li>
                    <li>Don’t slump over rest elbows on your desk.</li>
                    <li>Elbows should be at your sides.</li>
                    <li>Relax your shoulders.</li>
                  </ul>
                  <li>
                    <span>Legs</span>
                  </li>
                  <ul className="small-list">
                    <li>Knees and forearms should be parallel to the floor.</li>
                    <li>Keep your feet flat on the floor or a footrest.</li>
                    <li>Do not cross your legs, knees or ankles.</li>
                    <li>Keep a small space between your knees and the seat of the chair.</li>
                    <li>Your knees should be at the same height as your hips or slightly lower.</li>
                    <li>Ankles should be in front of your knees.</li>
                  </ul>
                  <li>
                    <span>Other</span>
                  </li>
                  <ul className="small-list">
                    <li>Look forward to prevent neck pain or strain.</li>
                    <li>Use an ergonomic mouse and mousepad to prevent wrist strain.</li>
                    <li>
                      Keep frequently used items, such as pens and your stapler, close by so you don’t have to stretch
                      or turn to get them.
                    </li>
                    <li>Use a hands-free headset if you are on the phone a lot.</li>
                    <li>Use a document stand, so you don’t have to look down and strain your neck.</li>
                  </ul>
                </ul>
              </div>
            </Scrollbar>
          </div>
        </div>
      )}
    </>
  );
};
