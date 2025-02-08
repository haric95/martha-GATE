import Captcha from "../components/Captcha";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { newCaptchaImages } from "./api/captcha-image";

export default function Home({ defaultCaptchaKey }) {
  const [message, setMessage] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [captchaKey, setCaptchaKey] = useState(defaultCaptchaKey);
  function send() {
    fetch("/api/send", {
      method: "POST",
      body: JSON.stringify({
        message,
        selectedIndexes,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      response.json().then((json) => {
        if (json.sent) {
          setCaptchaKey(new Date().getTime());
          alert("The GATE Executants have been notified");
          fetch("https://ntfy.sh/martha-joining-gate", {
            method: "POST",
            body: "Martha Joined Gate",
          });
        }
        if (!json.captchaIsOk) {
          setCaptchaKey(new Date().getTime());
          alert("silly billy");
        }
      });
    });
  }
  return (
    <main>
      <div>
        <Captcha captchaKey={captchaKey} onChange={setSelectedIndexes} />
      </div>
      <button onClick={send}>Join</button>
      <button
        onClick={() => {
          fetch("https://ntfy.sh/martha-joining-gate", {
            method: "POST",
            body: "Martha Declined to join GATE",
          });
          alert(":(");
        }}
        style={{ marginLeft: 82 }}
      >
        Decline
      </button>
    </main>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    {
      // if (!req.session.captchaImages) {
      req.session.captchaImages = newCaptchaImages();
      await req.session.save();
      // }
      return {
        props: {
          defaultCaptchaKey: new Date().getTime(),
        },
      };
    }
  },
  {
    cookieName: "session",
    password: process.env.SESSION_SECRET,
  }
);
