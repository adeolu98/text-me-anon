import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { IconPlus } from "@tabler/icons-react";
import { Accordion } from "@mantine/core";

const info = [
  {
    emoji: "",
    value: "Do I need a special setup to use Text-Me Anon?",
    description: "No, you do not need any special setup to use Text-Me-Anon.",
  },
  {
    emoji: "",
    value: "Which networks are supported?",
    description: "Ethereum, Polygon, Optimism and many more",
  },
  {
    emoji: "",
    value: "Are messages delivered instantly?",
    description:
      "Yes, messages are delivered instantly as the transaction gets sent on the blockchain",
  },
];

function FAQAccordion() {
  const items = info.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji} disabled={false}>
        <p className="font-bold">{item.value}</p>
      </Accordion.Control>
      <Accordion.Panel>
        <p className="font-semibold text-2xl">{item.description} </p>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion chevron={<IconPlus />}>
      {items}
    </Accordion>
  );
}

export default FAQAccordion;
