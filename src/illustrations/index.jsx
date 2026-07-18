import { greetingIcons } from "./greetings";
import { familyIcons } from "./family";
import { foodIcons } from "./food";

const VOCAB_ICONS = {
  ...greetingIcons,
  ...familyIcons,
  ...foodIcons,
};

/** Renders the correct flat-SVG illustration for a vocabulary card. */
export default function Illustration({ item }) {
  if (!item) return null;
  const render = VOCAB_ICONS[item.icon] || VOCAB_ICONS["hello-wave"];
  return render(item.id || item.icon);
}
