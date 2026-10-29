import { Button, ContactBanner } from "./m1";

export const ContactSection = () => {
  return (
    <ContactBanner
      id="contact"
      code="S-05 / CONTACT"
      title="Let's build something"
      text="Got a system that needs to scale, or a pipeline that needs taming? LinkedIn is the best place to reach me."
      action={
        <Button
          variant="secondary"
          href="https://www.linkedin.com/in/franco-roura/"
          target="_blank"
          arrow
        >
          Connect on LinkedIn
        </Button>
      }
    />
  );
};
