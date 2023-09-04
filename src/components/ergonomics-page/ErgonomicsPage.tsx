import { Link } from "react-router-dom";
import "./ErgonomicsPage.css";
export const ErgonomicsPage = () => {
  return (
    <div className="ergonomics-container">
      <div className="home-button-container-login">
        <Link to="/" className="home-button">
          {"< Home"}
        </Link>
      </div>
      <div className="ergonomics-content">
        <img src="./assets/Workstation-Ergonomics.png" alt="" />
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
              Position your keyboard 4-6 inches away from the edge of your desk so your wrists have a place to rest.
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
              Keep frequently used items, such as pens and your stapler, close by so you don’t have to stretch or turn
              to get them.
            </li>
            <li>Use a hands-free headset if you are on the phone a lot.</li>
            <li>Use a document stand, so you don’t have to look down and strain your neck.</li>
          </ul>
        </ul>
      </div>
    </div>
  );
};
