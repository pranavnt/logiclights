var boolSocket = new Rete.Socket("Boolean");

var VueBoolDisplay = {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  template:
    '<input :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>',
  data() {
    return {
      value: "false",
    };
  },
  methods: {
    change(e) {
      this.value = this.value == "false" ? "true" : "false";
      this.update();
    },
    update() {
      if (this.ikey) this.putData(this.ikey, this.value);
    },
  },
  mounted() {
    this.value = this.getData(this.ikey);
  },
};

var VueBoolDisplayT = {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  template:
    '<input :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>',
  data() {
    return {
      value: "true",
    };
  },
  methods: {
    change(e) {
      this.value = "true"; //this.value == "false" ? "true" : "false";
      this.update();
    },
    update() {
      if (this.ikey) this.putData(this.ikey, this.value);
    },
  },
  mounted() {
    this.value = this.getData(this.ikey);
  },
};

class BoolDisplay extends Rete.Control {
  constructor(emitter, key) {
    super(key);
    this.component = VueBoolDisplay;
    this.props = { emitter, ikey: key, readonly: true };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class BoolDisplayT extends Rete.Control {
  constructor(emitter, key) {
    super(key);
    this.component = VueBoolDisplayT;
    this.props = { emitter, ikey: key, readonly: true };
  }

  setValue(val) {
    console.log(this.vueContext.value);
    this.vueContext.value = val;
  }
}

class NumControl extends Rete.Control {
  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueNumControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

const VueBoolControl = {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  template:
    '<input type="checkbox" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>',
  data() {
    return {
      value: false,
    };
  },
  methods: {
    change(e) {
      this.value = !this.value;
      console.log(this.value);
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.value);
      }
    },
  },
  mounted() {
    this.value = this.getData(this.ikey);
  },
};

class SwitchControl extends Rete.Control {
  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueBoolControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(v) {
    this.vueContext.value = v;
  }
}

class SwitchComponent extends Rete.Component {
  constructor() {
    super("Switch");
  }

  builder(node) {
    var out1 = new Rete.Output("bool", "Boolean", boolSocket);

    return node
      .addControl(new SwitchControl(this.editor, "bool"))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["bool"] = node.data.bool;
  }
}

class AndComponent extends Rete.Component {
  constructor() {
    super("AND");
  }

  builder(node) {
    var inp1 = new Rete.Input("bool1", "Boolean", boolSocket);
    var inp2 = new Rete.Input("bool2", "Boolean", boolSocket);
    var out1 = new Rete.Output("bool", "Boolean", boolSocket);

    node.addControl(new BoolDisplay(this.editor, "bool"));

    node.outputs["bool"] = false;

    return node.addInput(inp1).addInput(inp2).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    let inp1 = inputs["bool1"][0];
    let inp2 = inputs["bool2"][0];

    outputs["bool"] =
      inp1 == undefined ? false : inp1 && inp2 == undefined ? false : inp2;
    console.log(outputs["bool"]);

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("bool")
      .setValue(outputs["bool"]);
  }
}

class OrComponent extends Rete.Component {
  constructor() {
    super("OR");
  }

  builder(node) {
    var inp1 = new Rete.Input("bool1", "Boolean", boolSocket);
    var inp2 = new Rete.Input("bool2", "Boolean", boolSocket);
    var out1 = new Rete.Output("bool", "Boolean", boolSocket);

    node.addControl(new BoolDisplay(this.editor, "bool"));

    node.outputs["bool"] = false;

    return node.addInput(inp1).addInput(inp2).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    console.log("inputs");
    console.log(inputs);
    let inp1 = inputs["bool1"][0];
    let inp2 = inputs["bool2"][0];
    outputs["bool"] =
      (inp1 == undefined ? false : inp1) || (inp2 == undefined ? false : inp2);
    console.log(outputs["bool"]);

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("bool")
      .setValue(outputs["bool"]);
  }
}
class NandComponent extends Rete.Component {
  constructor() {
    super("NAND");
  }

  builder(node) {
    var inp1 = new Rete.Input("bool1", "Boolean", boolSocket);
    var inp2 = new Rete.Input("bool2", "Boolean", boolSocket);
    var out1 = new Rete.Output("bool", "Boolean", boolSocket);

    node.addControl(new BoolDisplay(this.editor, "bool"));

    node.outputs["bool"] = true;

    return node.addInput(inp1).addInput(inp2).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    let inp1 = inputs["bool1"][0];
    let inp2 = inputs["bool2"][0];

    if (inp1 == undefined) inp1 = false;
    if (inp2 == undefined) inp2 = false;

    outputs["bool"] = !(inp1 && inp2);

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("bool")
      .setValue(outputs["bool"]);
  }
}

class NorComponent extends Rete.Component {
  constructor() {
    super("NOR");
  }

  builder(node) {
    var inp1 = new Rete.Input("bool1", "Boolean", boolSocket);
    var inp2 = new Rete.Input("bool2", "Boolean", boolSocket);
    var out1 = new Rete.Output("bool", "Boolean", boolSocket);

    node.addControl(new BoolDisplay(this.editor, "bool"));

    node.outputs["bool"] = true;

    return node.addInput(inp1).addInput(inp2).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    let inp1 = inputs["bool1"][0];
    let inp2 = inputs["bool2"][0];

    if (inp1 == undefined) inp1 = false;
    if (inp2 == undefined) inp2 = false;

    outputs["bool"] = !(inp1 || inp2);

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("bool")
      .setValue(outputs["bool"]);
  }
}

(async () => {
  var container = document.querySelector("#rete");
  var components = [
    new SwitchComponent(),
    new AndComponent(),
    new OrComponent(),
    new NandComponent(),
    new NorComponent(),
  ];

  var editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin.default);
  editor.use(VueRenderPlugin.default);
  editor.use(ContextMenuPlugin.default);
  editor.use(AreaPlugin);
  editor.use(CommentPlugin.default);
  editor.use(HistoryPlugin);
  editor.use(ConnectionMasteryPlugin.default);

  var engine = new Rete.Engine("demo@0.1.0");

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  var n1 = await components[0].createNode({ val: false });
  var n2 = await components[0].createNode({ val: false });
  var add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get("bool"), add.inputs.get("bool1"));
  editor.connect(n2.outputs.get("bool"), add.inputs.get("bool2"));

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");
})();
