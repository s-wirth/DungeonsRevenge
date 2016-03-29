import stampit from "stampit";

export default function UniqueId() {
  let idCounter = 0;

  return stampit({
    init({ instance }) {
      instance.id = idCounter;
      idCounter += 1;
    },
  });
}
