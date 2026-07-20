import { greetingIcons } from "./greetings";
import { familyIcons } from "./family";
import { foodIcons } from "./food";
import { daysTimeIcons } from "./daysTime";
import { weatherIcons } from "./weather";
import { houseIcons } from "./house";
import { clothingIcons } from "./clothing";
import { bodyHealthIcons } from "./bodyHealth";
import { jobsIcons } from "./jobs";
import { shoppingIcons } from "./shopping";
import { transportationIcons } from "./transportation";
import { hobbiesIcons } from "./hobbies";
import { feelingsIcons } from "./feelings";
import { safetyOfficerIcons } from "./safetyOfficer";
import { officeIcons } from "./office";
import NumberIllustration from "./NumberIllustration";
import ColorIllustration from "./ColorIllustration";

const VOCAB_ICONS = {
  ...greetingIcons,
  ...familyIcons,
  ...foodIcons,
  ...daysTimeIcons,
  ...weatherIcons,
  ...houseIcons,
  ...clothingIcons,
  ...bodyHealthIcons,
  ...jobsIcons,
  ...shoppingIcons,
  ...transportationIcons,
  ...hobbiesIcons,
  ...feelingsIcons,
  ...safetyOfficerIcons,
  ...officeIcons,
};

/** Renders the correct flat-SVG illustration for a vocabulary card. */
export default function Illustration({ item }) {
  if (!item) return null;
  if (item.icon === "number") {
    return <NumberIllustration value={item.value} id={item.id} />;
  }
  if (item.icon === "color") {
    return <ColorIllustration hex={item.hex} id={item.id} />;
  }
  const render = VOCAB_ICONS[item.icon] || VOCAB_ICONS["hello-wave"];
  return render(item.id || item.icon);
}
