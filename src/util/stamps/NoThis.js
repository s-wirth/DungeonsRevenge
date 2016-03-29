import stampit from "stampit";

const NoThis = stampit({
  init({ stamp }) {
    Object.keys(stamp.fixed.methods).forEach((methodName) => {
      const method = stamp.fixed.methods[methodName];
      this[methodName] = method.bind(null, this);
    });
  },
});

export default NoThis;
