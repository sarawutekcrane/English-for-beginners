import { greetingIcons } from "./greetings";

const VOCAB_ICONS = {
  ...greetingIcons,
};

/** Renders the correct flat-SVG illustration for a vocabulary card. */
export default function Illustration({ item }) {
  if (!item) return null;
  const render = VOCAB_ICONS[item.icon] || VOCAB_ICONS["hello-wave"];
  return render(item.id || item.icon);
}
